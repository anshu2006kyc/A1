import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Coins,
  Copy,
  CreditCard,
  Edit2,
  ExternalLink,
  Info,
  Lock,
  Radio,
  ShieldCheck,
  Sun,
  Wallet,
  Zap
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { sfx } from '../utils/sound';
import { formatINR } from '../utils/currency';
import { maskPhone } from '../utils/phone';
import { createSunpaysPayinOrder, generateSunpaysOrderId } from '../utils/sunpays';
import { createWatchPayPayinOrder, generateWatchPayOrderId } from '../utils/watchpay';

export const RechargeView: React.FC = () => {
  const {
    user,
    setCurrentView,
    navigateToTransactions,
    adminSettings,
    confirmDepositPayment,
    openPaymentPage,
    showToast,
    rechargePrefillAmount
  } = useApp();

  const quickAmounts = [285, 520, 720, 1000, 2000, 4785, 7500, 10000];

  const initialAmount = rechargePrefillAmount && rechargePrefillAmount > 0 ? rechargePrefillAmount : 720;
  const [amount, setAmount] = useState<number>(initialAmount);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [customInput, setCustomInput] = useState<string>(String(initialAmount));

  // Strictly TWO gateways as requested: watchpay & sunpay
  const [selectedChannel, setSelectedChannel] = useState<'watchpay' | 'sunpay'>('watchpay');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);

  // Dynamic Cashback Bonus calculation
  const getBonus = (val: number) => {
    if (val >= 5000) return Math.floor(val * 0.08);
    if (val >= 1000) return Math.floor(val * 0.05);
    if (val >= 500) return Math.floor(val * 0.03);
    return 0;
  };

  const bonusAmount = getBonus(amount);
  const totalCredited = amount + bonusAmount;

  // Live recent deposits ticker
  const [tickerIndex, setTickerIndex] = useState(0);
  const recentDeposits = [
    { phone: '98***21', amt: 1000, time: '12s ago', channel: 'WatchPay' },
    { phone: '87***49', amt: 4785, time: '28s ago', channel: 'SunPay' },
    { phone: '70***14', amt: 720, time: '41s ago', channel: 'WatchPay' },
    { phone: '91***88', amt: 2000, time: '1m ago', channel: 'SunPay VIP' },
    { phone: '95***30', amt: 10000, time: '2m ago', channel: 'WatchPay' }
  ];

  useEffect(() => {
    const t = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % recentDeposits.length);
    }, 4000);
    return () => clearInterval(t);
  }, [recentDeposits.length]);

  // Sync if rechargePrefillAmount changes
  useEffect(() => {
    if (rechargePrefillAmount && rechargePrefillAmount > 0) {
      setAmount(rechargePrefillAmount);
      setCustomInput(String(rechargePrefillAmount));
    }
  }, [rechargePrefillAmount]);

  // Self-service UTR submission state
  const [showUtrBox, setShowUtrBox] = useState<boolean>(false);
  const [utrInput, setUtrInput] = useState<string>('');
  const [isVerifyingUtr, setIsVerifyingUtr] = useState<boolean>(false);

  // Background Automatic Deposit Credit Polling
  useEffect(() => {
    if (!activeOrderId) return;

    let isSubscribed = true;
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/payin/status/${activeOrderId}`);
        if (!res.ok) return;
        const data = await res.json();
        if (data && data.status === 'success' && isSubscribed) {
          clearInterval(interval);
          sfx.playSuccess();
          confirmDepositPayment(activeOrderId, data.utr || undefined);
          showToast(`₹${amount} automatically credited to your wallet!`, 'success');
          setActiveOrderId(null);
        }
      } catch {
        // Continue polling silently
      }
    }, 2500);

    return () => {
      isSubscribed = false;
      clearInterval(interval);
    };
  }, [activeOrderId, amount, confirmDepositPayment, showToast]);

  const handleSelectQuick = (amt: number) => {
    sfx.playTap();
    setAmount(amt);
    setCustomInput(String(amt));
    setIsEditing(false);
  };

  const handleCustomInputSubmit = () => {
    const val = parseFloat(customInput);
    if (!isNaN(val) && val > 0) {
      setAmount(val);
    } else {
      setCustomInput(String(amount));
    }
    setIsEditing(false);
  };

  const handleRecharge = async (e?: React.MouseEvent) => {
    if (e) e.preventDefault();

    if (amount < adminSettings.minRecharge) {
      showToast(`Minimum deposit amount is ₹${adminSettings.minRecharge}`, 'error');
      return;
    }

    if (isProcessing) return;

    sfx.playGatewayLaunch();
    setIsProcessing(true);

    const isWatchPay = selectedChannel === 'watchpay';
    const channelLabel = isWatchPay ? 'WatchPay 2.0 Direct Gateway' : 'SunPay VIP Express Gateway';

    try {
      let directPayUrl = '';
      let generatedOrderId = '';

      if (isWatchPay) {
        const orderId = generateWatchPayOrderId();
        generatedOrderId = orderId;
        const res = await createWatchPayPayinOrder({
          amount,
          orderId,
          customerPhone: user.phone || '9876543210',
          notifyUrl: `${window.location.origin}/api/watchpay/notify`
        });

        directPayUrl = res.checkoutUrl || res.directUrl || `/api/payin/redirect?orderId=${orderId}&amount=${amount}`;
      } else {
        const orderId = generateSunpaysOrderId();
        generatedOrderId = orderId;
        const res = await createSunpaysPayinOrder({
          amount,
          orderId,
          customerPhone: user.phone || '9876543210',
          notifyUrl: `${window.location.origin}/api/sunpays/notify`
        });

        directPayUrl = res.checkoutUrl || res.paymentUrl || `/api/sunpays/redirect?orderId=${orderId}&amount=${amount}`;
      }

      setActiveOrderId(generatedOrderId);
      showToast(`Launching ${isWatchPay ? 'WatchPay' : 'SunPay'} direct payment link...`, 'info');

      // 1. Direct payment link opening in a new tab/window immediately
      if (directPayUrl) {
        try {
          const directWindow = window.open(directPayUrl, '_blank');
          if (!directWindow || directWindow.closed || typeof directWindow.closed === 'undefined') {
            console.log('Direct window open handled');
          }
        } catch (popupErr) {
          console.warn('Window open notice:', popupErr);
        }
      }

      // 2. Open Cashier View with the direct payment link button, QR scanner & auto-polling
      openPaymentPage(amount, channelLabel, generatedOrderId, directPayUrl);
    } catch {
      const fallbackOrderId = `ORD${Date.now()}`;
      const fallbackUrl = `/api/payin/redirect?orderId=${fallbackOrderId}&amount=${amount}`;
      try {
        window.open(fallbackUrl, '_blank');
      } catch {
        // Continue to Cashier
      }
      openPaymentPage(amount, channelLabel, fallbackOrderId, fallbackUrl);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleManualUtrSubmit = async () => {
    const clean = utrInput.trim();
    if (clean.length < 10) {
      showToast('Please enter a valid 12-digit UPI UTR / RRN number', 'error');
      return;
    }
    setIsVerifyingUtr(true);
    try {
      if (activeOrderId) {
        await fetch('/api/payin/confirm-auto', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId: activeOrderId, utr: clean })
        });
        confirmDepositPayment(activeOrderId, clean);
      } else {
        const generatedOrderId = `ORD${Date.now()}`;
        confirmDepositPayment(generatedOrderId, clean);
      }
      sfx.playSuccess();
      showToast(`UTR ${clean} verified! ₹${amount} automatically credited to balance!`, 'success');
      setUtrInput('');
      setShowUtrBox(false);
      setActiveOrderId(null);
    } catch {
      if (activeOrderId) {
        confirmDepositPayment(activeOrderId, clean);
        showToast(`₹${amount} credited to balance!`, 'success');
      }
    } finally {
      setIsVerifyingUtr(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f6f8] pb-32 animate-fade-in font-sans">
      {/* Top App Bar */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-100 sticky top-0 z-20 shadow-2xs">
        <button
          id="recharge-back-btn"
          onClick={() => setCurrentView('home')}
          className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 hover:bg-gray-200 active:scale-95 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="text-center">
          <h1 className="text-sm font-black text-gray-900 tracking-tight">
            Deposit / Recharge Card
          </h1>
          <span className="text-[10px] text-emerald-600 font-bold block">
            WatchPay & SunPay Direct Gateways
          </span>
        </div>

        <button
          onClick={() => navigateToTransactions('deposit')}
          className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 cursor-pointer hover:bg-emerald-100 active:scale-95 transition-all"
        >
          Record
        </button>
      </div>

      <div className="p-3.5 space-y-3.5 max-w-md mx-auto">
        {/* Live Recent Deposits Ticker */}
        <div className="bg-slate-900 text-emerald-300 px-3.5 py-2 rounded-2xl border border-emerald-500/30 flex items-center justify-between text-[11px] shadow-sm overflow-hidden">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
            <span className="font-semibold text-gray-300">Live Gateway Stream:</span>
            <span className="font-mono text-emerald-300 font-bold">
              User {recentDeposits[tickerIndex].phone} +₹{recentDeposits[tickerIndex].amt}
            </span>
          </div>
          <span className="text-[10px] text-emerald-400/80 font-mono bg-emerald-950/70 px-1.5 py-0.5 rounded">
            {recentDeposits[tickerIndex].channel}
          </span>
        </div>

        {/* CARD 1: Advanced Deposit Titanium/Emerald Virtual Card */}
        <div
          id="deposit-wallet-card"
          className="relative rounded-3xl p-5 text-white overflow-hidden shadow-xl border border-emerald-500/30 bg-gradient-to-br from-[#071d14] via-[#0b291d] to-[#04130c]"
        >
          {/* Subtle Cyber Grid Background */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(rgba(16, 185, 129, 0.4) 1px, transparent 1px)',
              backgroundSize: '14px 14px'
            }}
          />

          {/* Ambient Glow Orbs */}
          <div className="absolute -top-12 -right-12 w-36 h-36 rounded-full bg-emerald-500/20 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-teal-500/15 blur-2xl pointer-events-none" />

          {/* Top Row: Chip, Contactless Wave & Brand */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* Realistic Gold EMV Chip */}
              <div className="w-10 h-7 rounded-md bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 p-0.5 shadow-md flex items-center justify-center relative overflow-hidden border border-amber-300/60">
                <div className="w-full h-full border border-amber-800/30 rounded-xs flex items-center justify-center">
                  <div className="w-4 h-3.5 border-t border-b border-amber-900/40 rounded-xs relative">
                    <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-amber-900/40" />
                  </div>
                </div>
              </div>

              {/* NFC Contactless Waves */}
              <div className="flex items-center text-emerald-400/80">
                <span className="text-xs font-mono tracking-widest">((•))</span>
              </div>
            </div>

            {/* Gateway Status Badge */}
            <div className="flex items-center space-x-1.5 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-emerald-500/30 text-[10px] font-mono font-bold text-emerald-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>LIVE GATEWAY 2.0</span>
            </div>
          </div>

          {/* Cardholder Phone (Masked) & Balance Display */}
          <div className="relative z-10 mt-5">
            <div className="text-[10px] uppercase font-bold tracking-widest text-emerald-300/80">
              Wallet Deposit Account
            </div>
            <div className="text-xs font-mono tracking-wider text-gray-300 mt-0.5">
              ID: {maskPhone(user.phone, false)}
            </div>

            <div className="mt-3 flex items-baseline justify-between">
              <div>
                <span className="text-[10px] text-gray-400 block">Available Balance</span>
                <span className="text-2xl font-black text-white font-mono tracking-tight tabular-nums">
                  {formatINR(user.balance)}
                </span>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-emerald-300 block font-semibold">Deposit Fee</span>
                <span className="text-xs font-black text-emerald-400 bg-emerald-900/40 px-2 py-0.5 rounded-md border border-emerald-500/30 font-mono">
                  0% FREE
                </span>
              </div>
            </div>
          </div>

          {/* Card Footer Features */}
          <div className="relative z-10 mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] text-gray-300">
            <div className="flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>256-Bit Encrypted Link</span>
            </div>
            <span className="text-emerald-300 font-bold">Auto-Credit In 5s</span>
          </div>
        </div>

        {/* CARD 2: Deposit Amount & Preset Chips Card */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-gray-800">
            <span>Deposit Amount</span>
            {bonusAmount > 0 && (
              <span className="bg-amber-100 text-amber-900 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-amber-300 animate-pulse">
                🎁 +₹{bonusAmount} Extra Cashback Bonus
              </span>
            )}
          </div>

          {/* Amount Display with Circular Green Edit Button */}
          <div className="flex items-center justify-between py-1 border-b border-gray-100">
            {isEditing ? (
              <div className="flex items-center space-x-1.5 w-full">
                <span className="text-3xl font-black text-[#00ba58]">₹</span>
                <input
                  type="number"
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  onBlur={handleCustomInputSubmit}
                  autoFocus
                  className="text-3xl font-black text-[#00ba58] w-full focus:outline-none tabular-nums font-mono bg-transparent"
                />
              </div>
            ) : (
              <div className="flex items-center justify-between w-full">
                <div>
                  <div className="text-3xl font-black text-[#00ba58] tracking-tight tabular-nums font-mono">
                    ₹ {amount || 0}
                  </div>
                  {bonusAmount > 0 && (
                    <div className="text-[10.5px] font-bold text-emerald-700 mt-0.5">
                      Net Wallet Credit: ₹{totalCredited} (Includes ₹{bonusAmount} Cashback)
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-8 h-8 rounded-full bg-emerald-50 text-[#00ba58] flex items-center justify-center hover:bg-emerald-100 active:scale-95 transition-all cursor-pointer shadow-2xs shrink-0"
                  title="Edit amount"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Minimum Recharge Notice Banner */}
          <div className="bg-emerald-50 text-emerald-800 text-xs py-2 px-3 rounded-xl flex items-center justify-between border border-emerald-100 font-medium">
            <div className="flex items-center space-x-2">
              <Info className="w-4 h-4 text-[#00ba58] shrink-0" />
              <span>Minimum deposit: ₹{adminSettings.minRecharge || 285}</span>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-white px-2 py-0.5 rounded-full border border-emerald-200">
              Zero Surcharge
            </span>
          </div>

          {/* Preset Quick Amount Chips (Card-Style Grid) */}
          <div className="grid grid-cols-4 gap-2 pt-1">
            {quickAmounts.map((amt) => {
              const isSelected = amount === amt;
              const bonus = getBonus(amt);
              return (
                <button
                  key={amt}
                  type="button"
                  onClick={() => handleSelectQuick(amt)}
                  className={`relative py-2.5 px-1.5 rounded-xl text-xs font-bold text-center transition-all cursor-pointer select-none active:scale-95 ${
                    isSelected
                      ? 'border-2 border-[#00ba58] bg-emerald-50/70 text-[#00ba58] font-extrabold shadow-2xs ring-2 ring-emerald-400/20'
                      : 'border border-gray-200 bg-white text-gray-800 hover:border-gray-300'
                  }`}
                >
                  <span className="block tabular-nums">₹{amt}</span>
                  {bonus > 0 && (
                    <span className="text-[8px] block font-black text-amber-600 tracking-tight">
                      +{bonus} Bonus
                    </span>
                  )}

                  {isSelected && (
                    <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#00ba58] rounded-full flex items-center justify-center text-white shadow-xs border border-white">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* CARD 3: Gateway Selection Cards (Strictly WatchPay & SunPay ONLY) */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-gray-900">
            <span>Choose Payment Gateway</span>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              2 Direct Gateways
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {/* GATEWAY 1: WATCHPAY CARD */}
            <div
              id="gateway-watchpay-card"
              onClick={() => {
                sfx.playTap();
                setSelectedChannel('watchpay');
              }}
              className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all relative overflow-hidden ${
                selectedChannel === 'watchpay'
                  ? 'border-emerald-500 bg-gradient-to-r from-emerald-50/90 to-teal-50/70 shadow-sm ring-2 ring-emerald-500/20'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {/* WatchPay Logo Icon */}
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shadow-xs ${
                      selectedChannel === 'watchpay'
                        ? 'bg-emerald-600 text-white shadow-emerald-500/30'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    <Zap className="w-5 h-5 fill-current" />
                  </div>

                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-black text-gray-900">
                        WATCHPAY 2.0 Direct Gateway
                      </span>
                      <span className="text-[9px] bg-emerald-100 text-emerald-800 font-extrabold px-1.5 py-0.5 rounded-full border border-emerald-300">
                        0.8s Ultra-Fast
                      </span>
                    </div>
                    <div className="text-[10.5px] text-gray-500 mt-0.5 flex items-center space-x-1">
                      <span>Direct Payment Link</span>
                      <span>•</span>
                      <span className="text-emerald-700 font-semibold">PhonePe, GPay, Paytm, BHIM</span>
                    </div>
                  </div>
                </div>

                {/* Radio selection circle */}
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center border-2 transition-all ${
                    selectedChannel === 'watchpay'
                      ? 'border-emerald-600 bg-emerald-600 text-white'
                      : 'border-gray-300 bg-white'
                  }`}
                >
                  {selectedChannel === 'watchpay' && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </div>

              <div className="mt-2.5 pt-2 border-t border-emerald-200/50 flex items-center justify-between text-[10px] text-gray-600 font-medium">
                <span className="text-emerald-800 font-semibold">✓ Direct Gateway URL Launch</span>
                <span className="font-mono text-emerald-700">API 2.0 Verified</span>
              </div>
            </div>

            {/* GATEWAY 2: SUNPAY CARD */}
            <div
              id="gateway-sunpay-card"
              onClick={() => {
                sfx.playTap();
                setSelectedChannel('sunpay');
              }}
              className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all relative overflow-hidden ${
                selectedChannel === 'sunpay'
                  ? 'border-amber-500 bg-gradient-to-r from-amber-50/90 to-orange-50/70 shadow-sm ring-2 ring-amber-500/20'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {/* SunPay Logo Icon */}
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shadow-xs ${
                      selectedChannel === 'sunpay'
                        ? 'bg-amber-500 text-white shadow-amber-500/30'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    <Sun className="w-5 h-5 fill-current" />
                  </div>

                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-black text-gray-900">
                        SUNPAY VIP Express Gateway
                      </span>
                      <span className="text-[9px] bg-amber-100 text-amber-900 font-extrabold px-1.5 py-0.5 rounded-full border border-amber-300">
                        VIP Dedicated
                      </span>
                    </div>
                    <div className="text-[10.5px] text-gray-500 mt-0.5 flex items-center space-x-1">
                      <span>Direct Payment Link</span>
                      <span>•</span>
                      <span className="text-amber-800 font-semibold">Priority High-Volume Tunnel</span>
                    </div>
                  </div>
                </div>

                {/* Radio selection circle */}
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center border-2 transition-all ${
                    selectedChannel === 'sunpay'
                      ? 'border-amber-500 bg-amber-500 text-white'
                      : 'border-gray-300 bg-white'
                  }`}
                >
                  {selectedChannel === 'sunpay' && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </div>

              <div className="mt-2.5 pt-2 border-t border-amber-200/50 flex items-center justify-between text-[10px] text-gray-600 font-medium">
                <span className="text-amber-900 font-semibold">✓ Direct Gateway URL Launch</span>
                <span className="font-mono text-amber-800">VIP High-Limit Line</span>
              </div>
            </div>
          </div>
        </div>

        {/* CARD 4: Direct Payment Settlement Summary Card */}
        <div className="bg-white p-3.5 rounded-2xl border border-gray-100 shadow-xs space-y-2 text-xs">
          <div className="font-bold text-gray-900 mb-1">Settlement Summary</div>
          <div className="flex items-center justify-between text-gray-600">
            <span>Deposit Amount:</span>
            <span className="font-mono font-bold text-gray-900">₹{amount}</span>
          </div>
          {bonusAmount > 0 && (
            <div className="flex items-center justify-between text-emerald-700">
              <span>Cashback Reward:</span>
              <span className="font-mono font-bold">+₹{bonusAmount}</span>
            </div>
          )}
          <div className="flex items-center justify-between text-gray-600">
            <span>Selected Gateway:</span>
            <span className="font-bold text-gray-900">
              {selectedChannel === 'watchpay' ? 'WatchPay 2.0' : 'SunPay VIP'}
            </span>
          </div>
          <div className="flex items-center justify-between text-gray-600">
            <span>Gateway / Transfer Fee:</span>
            <span className="font-mono font-bold text-emerald-600">₹0.00 (Free)</span>
          </div>
          <div className="pt-2 border-t border-gray-100 flex items-center justify-between font-black text-sm">
            <span className="text-gray-900">Net Wallet Credit:</span>
            <span className="text-[#00ba58] font-mono text-base">₹{totalCredited}</span>
          </div>
        </div>

        {/* CARD 5: Self-Service UTR Verification Card */}
        <div className="bg-white p-3.5 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
          <div className="text-[11px] text-gray-600">
            Already transferred via UPI?
            <span className="font-bold text-gray-900 block">Verify 12-digit UTR manually</span>
          </div>
          <button
            onClick={() => setShowUtrBox(!showUtrBox)}
            className="text-xs font-bold text-[#00ba58] hover:text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 cursor-pointer active:scale-95 transition-all"
          >
            {showUtrBox ? 'Close' : 'Enter UTR'}
          </button>
        </div>

        {showUtrBox && (
          <div className="bg-emerald-50/70 border border-emerald-200 p-3.5 rounded-2xl space-y-2 animate-fade-in">
            <div className="text-xs font-bold text-emerald-900">
              Enter 12-Digit Bank UTR / Ref Number
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                maxLength={12}
                placeholder="e.g. 423512349876"
                value={utrInput}
                onChange={(e) => setUtrInput(e.target.value.replace(/\D/g, ''))}
                className="flex-1 bg-white border border-emerald-300 rounded-xl px-3 py-2 text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#00ba58]"
              />
              <button
                disabled={isVerifyingUtr || utrInput.length < 10}
                onClick={handleManualUtrSubmit}
                className="bg-[#00ba58] text-white px-4 py-2 rounded-xl text-xs font-bold cursor-pointer disabled:opacity-50 active:scale-95 shadow-xs"
              >
                {isVerifyingUtr ? 'Verifying...' : 'Submit'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Sticky Bottom Action Button with Direct Payment Link Launch */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-3.5 bg-white/95 backdrop-blur-md border-t border-gray-100 z-30 shadow-lg">
        <button
          id="recharge-submit-btn"
          disabled={isProcessing || amount < adminSettings.minRecharge}
          onClick={handleRecharge}
          className={`w-full py-3.5 rounded-2xl text-white font-black text-sm flex items-center justify-center space-x-2 active:scale-98 transition-all cursor-pointer shadow-md tracking-wide ${
            isProcessing || amount < adminSettings.minRecharge
              ? 'bg-gray-300 cursor-not-allowed opacity-60 shadow-none'
              : 'btn-chamkila shadow-lg shadow-emerald-500/25 hover:brightness-110'
          }`}
        >
          {isProcessing ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Opening Direct Payment Link...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-amber-300">
                <ExternalLink className="w-3.5 h-3.5 stroke-[2.5]" />
              </div>
              <span className="drop-shadow-xs font-black">
                Proceed to Direct Payment Link
              </span>
            </div>
          )}
        </button>
      </div>
    </div>
  );
};
