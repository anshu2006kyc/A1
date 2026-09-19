import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Headphones,
  Loader2,
  ShieldCheck,
  Sun,
  Wallet,
  Zap
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { sfx } from '../utils/sound';
import { formatINR } from '../utils/currency';
import { createSunpaysPayinOrder, generateSunpaysOrderId } from '../utils/sunpays';
import { createWatchPayPayinOrder, generateWatchPayOrderId } from '../utils/watchpay';
import { ServiceModal } from '../components/ServiceModal';

export const RechargeView: React.FC = () => {
  const {
    user,
    goBack,
    navigateToTransactions,
    adminSettings,
    showToast,
    rechargePrefillAmount,
    openPaymentPage
  } = useApp();

  const quickAmounts = [285, 520, 720, 1000, 2000, 5000];
  const initialAmount = rechargePrefillAmount && rechargePrefillAmount > 0 ? rechargePrefillAmount : 720;

  const [amount, setAmount] = useState<number>(initialAmount);
  const [customInput, setCustomInput] = useState<string>(String(initialAmount));
  const [selectedChannel, setSelectedChannel] = useState<'watchpay' | 'sunpay'>('watchpay');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [showServiceModal, setShowServiceModal] = useState<boolean>(false);

  const isWatchPay = selectedChannel === 'watchpay';

  // Dynamic Cashback Bonus
  const getBonus = (val: number) => {
    if (val >= 5000) return Math.floor(val * 0.08);
    if (val >= 1000) return Math.floor(val * 0.05);
    if (val >= 500) return Math.floor(val * 0.03);
    return 0;
  };

  const bonusAmount = getBonus(amount);

  // Sync if prefill amount provided
  useEffect(() => {
    if (rechargePrefillAmount && rechargePrefillAmount > 0) {
      setAmount(rechargePrefillAmount);
      setCustomInput(String(rechargePrefillAmount));
    }
  }, [rechargePrefillAmount]);

  const handleSelectQuick = (amt: number) => {
    sfx.playTap();
    setAmount(amt);
    setCustomInput(String(amt));
  };

  const handleCustomInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '');
    setCustomInput(val);
    const parsed = parseInt(val, 10);
    if (!isNaN(parsed) && parsed > 0) {
      setAmount(parsed);
    }
  };

  // Direct 1-Tap Launch to Automated Payment Gateway
  const handleLaunchPayment = async () => {
    if (amount < adminSettings.minRecharge) {
      showToast(`Minimum deposit is ₹${adminSettings.minRecharge}`, 'error');
      return;
    }

    if (isProcessing) return;
    setIsProcessing(true);
    sfx.playGatewayLaunch();

    const isWatchPay = selectedChannel === 'watchpay';
    const channelLabel = isWatchPay ? 'WATCHPAY' : 'SUNPAY';

    try {
      let directPayUrl = '';
      let orderId = '';

      if (isWatchPay) {
        orderId = generateWatchPayOrderId();
        const res = await createWatchPayPayinOrder({
          amount,
          orderId,
          customerPhone: user.phone || '9876543210',
          notifyUrl: `${window.location.origin}/api/watchpay/notify`
        });
        if (res.checkoutUrl && res.checkoutUrl.startsWith('http')) {
          directPayUrl = res.checkoutUrl;
        } else {
          directPayUrl = `/pay/checkout?order_id=${encodeURIComponent(orderId)}&amount=${amount}&channel=watchpay`;
        }
      } else {
        orderId = generateSunpaysOrderId();
        const res = await createSunpaysPayinOrder({
          amount,
          orderId,
          customerPhone: user.phone || '9876543210',
          notifyUrl: `${window.location.origin}/api/sunpays/webhook`
        });
        if (res.checkoutUrl && res.checkoutUrl.startsWith('http')) {
          directPayUrl = res.checkoutUrl;
        } else {
          directPayUrl = `/pay/checkout?order_id=${encodeURIComponent(orderId)}&amount=${amount}&channel=sunpay`;
        }
      }

      openPaymentPage(amount, channelLabel, orderId, directPayUrl);
      showToast(`${channelLabel} cashier opened for ₹${amount}`, 'info');
    } catch {
      const fallbackId = `ORD${Date.now()}`;
      const fallbackUrl = `/pay/checkout?order_id=${encodeURIComponent(fallbackId)}&amount=${amount}&channel=${selectedChannel}`;
      openPaymentPage(amount, channelLabel, fallbackId, fallbackUrl);
      showToast(`${channelLabel} cashier ready for ₹${amount}`, 'info');
    } finally {
      setIsProcessing(false);
    }
  };

  // MAIN SINGLE-PAGE NON-SCROLLABLE AUTOMATED DEPOSIT VIEW
  return (
    <div className="h-[100dvh] max-h-screen bg-[#f8fafc] font-sans max-w-md mx-auto flex flex-col justify-between overflow-hidden select-none">
      {/* 1. Header (Compact, 48px) */}
      <div className="h-12 px-3.5 bg-white border-b border-gray-100 flex items-center justify-between shrink-0 shadow-2xs">
        <button
          id="recharge-back-btn"
          onClick={goBack}
          className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 hover:bg-gray-200 active:scale-95 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="text-center">
          <h1 className="text-xs font-black text-gray-900 uppercase tracking-wider leading-none">
            Deposit Funds
          </h1>
          <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">
            Instant Automated UPI
          </span>
        </div>

        <div className="flex items-center space-x-1">
          <button
            type="button"
            onClick={() => setShowServiceModal(true)}
            className="text-[11px] font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-full flex items-center space-x-1 cursor-pointer active:scale-95 transition-all"
            title="Service Desk"
          >
            <Headphones className="w-3 h-3 text-emerald-600" />
            <span>Help</span>
          </button>

          <button
            onClick={() => navigateToTransactions('deposit')}
            className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-200 cursor-pointer hover:bg-emerald-100 active:scale-95 transition-all"
          >
            Record
          </button>
        </div>
      </div>

      {/* 2. Middle Content */}
      <div className="flex-1 p-3.5 flex flex-col justify-around overflow-hidden">
        {/* A. Available Balance Pill */}
        <div className="bg-white px-3.5 py-2.5 rounded-2xl border border-gray-200/80 shadow-xs flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#00ba58] flex items-center justify-center">
              <Wallet className="w-4 h-4 stroke-[2.3]" />
            </div>
            <div>
              <span className="text-[10px] text-gray-500 block font-medium leading-tight">Wallet Balance</span>
              <span className="text-base font-black text-gray-900 font-mono tracking-tight leading-tight">
                {formatINR(user.balance)}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-1 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-full text-[10px] font-bold text-[#00ba58]">
            <ShieldCheck className="w-3 h-3 text-[#00ba58]" />
            <span>Instant Clearance</span>
          </div>
        </div>

        {/* B. Amount Entry & Quick Preset Chips */}
        <div className="bg-white p-3 rounded-2xl border border-gray-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-gray-800">
            <span>Enter Deposit Amount</span>
            {bonusAmount > 0 && (
              <span className="bg-amber-100 text-amber-900 text-[9.5px] font-black px-2 py-0.5 rounded-full border border-amber-300">
                🎁 +₹{bonusAmount} Cashback
              </span>
            )}
          </div>

          {/* Amount Input */}
          <div className="flex items-center space-x-1.5 py-1 border-b-2 border-emerald-500/30 focus-within:border-[#00ba58] transition-colors">
            <span className="text-2xl font-black text-[#00ba58]">₹</span>
            <input
              type="text"
              inputMode="numeric"
              value={customInput}
              onChange={handleCustomInputChange}
              placeholder="0"
              className="text-2xl font-black text-[#00ba58] w-full focus:outline-none tabular-nums font-mono bg-transparent"
            />
          </div>

          {/* Quick Preset Buttons (6 Compact Chips) */}
          <div className="grid grid-cols-3 gap-1.5 pt-1">
            {quickAmounts.map((amt) => {
              const isSelected = amount === amt;
              const bonus = getBonus(amt);
              return (
                <button
                  key={amt}
                  type="button"
                  onClick={() => handleSelectQuick(amt)}
                  className={`py-1.5 px-1 rounded-xl text-xs font-bold text-center transition-all cursor-pointer select-none active:scale-95 ${
                    isSelected
                      ? 'btn-chamkila text-white font-black shadow-sm'
                      : 'border border-gray-200 bg-white text-gray-700 hover:border-emerald-300 hover:bg-emerald-50/20'
                  }`}
                >
                  <span className="tabular-nums">₹{amt}</span>
                  {bonus > 0 && (
                    <span className={`text-[8px] block font-black leading-none ${isSelected ? 'text-amber-200' : 'text-amber-600'}`}>
                      +{bonus}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="text-[10px] text-gray-500 flex items-center justify-between pt-0.5">
            <span>Min: ₹{adminSettings.minRecharge || 285}</span>
            <span className="text-emerald-700 font-bold">Transfer Fee: ₹0</span>
          </div>
        </div>

        {/* C. Payment Server Selection (WATCHPAY & SUNPAY ONLY) */}
        <div className="bg-white p-3 rounded-2xl border border-gray-200/80 shadow-xs space-y-2">
          <div className="text-xs font-bold text-gray-800 flex items-center justify-between">
            <span>Select Payment Gateway</span>
            <span className="text-[10px] text-emerald-600 font-bold">100% Automated</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {/* WATCHPAY Gateway */}
            <div
              onClick={() => {
                sfx.playTap();
                setSelectedChannel('watchpay');
              }}
              className={`p-2.5 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                selectedChannel === 'watchpay'
                  ? 'border-[#00ba58] bg-emerald-50/70 shadow-xs'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="w-6 h-6 rounded-lg bg-[#00ba58] text-white flex items-center justify-center">
                  <Zap className="w-3.5 h-3.5 fill-current" />
                </div>
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center border-2 ${
                    selectedChannel === 'watchpay'
                      ? 'border-[#00ba58] bg-[#00ba58] text-white'
                      : 'border-gray-300 bg-white'
                  }`}
                >
                  {selectedChannel === 'watchpay' && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                </div>
              </div>
              <div className="mt-1.5">
                <span className="text-[11px] font-black text-gray-900 block leading-tight">
                  WATCHPAY
                </span>
                <span className="text-[9.5px] text-gray-500 block leading-tight mt-0.5">
                  Automated High-Speed
                </span>
              </div>
            </div>

            {/* SUNPAY Gateway */}
            <div
              onClick={() => {
                sfx.playTap();
                setSelectedChannel('sunpay');
              }}
              className={`p-2.5 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                selectedChannel === 'sunpay'
                  ? 'border-amber-500 bg-amber-50/70 shadow-xs'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="w-6 h-6 rounded-lg bg-amber-500 text-white flex items-center justify-center">
                  <Sun className="w-3.5 h-3.5 fill-current" />
                </div>
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center border-2 ${
                    selectedChannel === 'sunpay'
                      ? 'border-amber-500 bg-amber-500 text-white'
                      : 'border-gray-300 bg-white'
                  }`}
                >
                  {selectedChannel === 'sunpay' && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                </div>
              </div>
              <div className="mt-1.5">
                <span className="text-[11px] font-black text-gray-900 block leading-tight">
                  SUNPAY
                </span>
                <span className="text-[9.5px] text-gray-500 block leading-tight mt-0.5">
                  VIP Express Instant
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* D. Instant Auto-Credit Assurance */}
        <div className="bg-emerald-50/80 border border-emerald-200/80 p-2.5 rounded-xl flex items-center space-x-2 text-[11px] text-emerald-900">
          <CheckCircle2 className="w-4 h-4 text-[#00ba58] shrink-0" />
          <span className="font-semibold">
            Automatic Deposit: Balance is credited to your wallet immediately after payment.
          </span>
        </div>
      </div>

      {/* 3. Sticky Bottom Action Button */}
      <div className="p-3 bg-white border-t border-gray-100 shrink-0 shadow-lg">
        <button
          id="recharge-submit-btn"
          disabled={isProcessing || amount < adminSettings.minRecharge}
          onClick={handleLaunchPayment}
          className={`w-full py-3.5 rounded-xl text-white font-black text-sm flex items-center justify-center space-x-2 active:scale-98 transition-all cursor-pointer shadow-md ${
            isProcessing || amount < adminSettings.minRecharge
              ? 'bg-gray-300 cursor-not-allowed opacity-60 shadow-none'
              : 'btn-chamkila shadow-lg shadow-emerald-500/25 hover:brightness-110'
          }`}
        >
          {isProcessing ? (
            <div className="flex items-center space-x-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Connecting Secure Payment...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-1.5">
              <Zap className="w-4 h-4 fill-current" />
              <span>Deposit ₹{amount} via {isWatchPay ? 'WATCHPAY' : 'SUNPAY'}</span>
            </div>
          )}
        </button>
      </div>

      {showServiceModal && (
        <ServiceModal
          onClose={() => setShowServiceModal(false)}
          supportUrl={adminSettings.telegramSupportUrl}
          channelUrl={adminSettings.telegramChannelUrl}
        />
      )}
    </div>
  );
};
