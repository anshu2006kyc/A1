import React, { useState, useEffect, useMemo } from 'react';
import {
  ArrowLeft,
  Check,
  Clock,
  Copy,
  ExternalLink,
  Info,
  Loader2,
  Lock,
  QrCode,
  ShieldAlert,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatINR } from '../utils/currency';
import { sfx } from '../utils/sound';

export const PaymentCashierView: React.FC = () => {
  const {
    user,
    activePayment,
    adminSettings,
    setCurrentView,
    goBack,
    submitDepositUtr,
    showToast
  } = useApp();

  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [utrNumber, setUtrNumber] = useState('');
  const [isSubmittingUtr, setIsSubmittingUtr] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [copiedOrderId, setCopiedOrderId] = useState(false);
  const [copiedAmount, setCopiedAmount] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedUtr, setSubmittedUtr] = useState('');

  // If no active payment, fallback to default order or redirect to recharge
  const order = useMemo(() => {
    if (activePayment) return activePayment;
    return {
      orderId: `ORD${Date.now()}`,
      amount: 500,
      channel: 'PAY-A Fast UPI',
      payUrl: null,
      directUpiUrl: `upi://pay?pa=${adminSettings.upiId || 'akmpayments@okaxis'}&pn=AKM+Investments&am=500&cu=INR&tn=ORD${Date.now()}`,
      createdAt: Date.now()
    };
  }, [activePayment, adminSettings.upiId]);

  const targetUpiId = adminSettings.upiId || 'akmpayments@okaxis';
  const payUpiUrl =
    order.directUpiUrl ||
    `upi://pay?pa=${encodeURIComponent(targetUpiId)}&pn=${encodeURIComponent('AKM Investments')}&am=${order.amount}&cu=INR&tn=${encodeURIComponent(order.orderId)}`;

  // Ticking countdown timer
  useEffect(() => {
    if (timeLeft <= 0 || isSubmitted) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft, isSubmitted]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleCopy = (text: string, type: 'upi' | 'order' | 'amount') => {
    navigator.clipboard.writeText(text);
    sfx.playTap();
    if (type === 'upi') {
      setCopiedUpi(true);
      showToast('UPI ID copied to clipboard!', 'info');
      setTimeout(() => setCopiedUpi(false), 2000);
    } else if (type === 'order') {
      setCopiedOrderId(true);
      showToast('Order ID copied!', 'info');
      setTimeout(() => setCopiedOrderId(false), 2000);
    } else {
      setCopiedAmount(true);
      showToast('Amount copied!', 'info');
      setTimeout(() => setCopiedAmount(false), 2000);
    }
  };

  const handleUtrSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanUtr = utrNumber.trim().replace(/\D/g, '');

    if (cleanUtr.length < 10) {
      showToast('Please enter a valid 10-12 digit UPI UTR / Ref number', 'error');
      return;
    }

    setIsSubmittingUtr(true);
    sfx.playTap();

    try {
      const ok = submitDepositUtr(order.orderId, cleanUtr);
      if (ok) {
        setSubmittedUtr(cleanUtr);
        setIsSubmitted(true);
      }
    } finally {
      setIsSubmittingUtr(false);
    }
  };

  // Dynamic QR code generation URL
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=12&data=${encodeURIComponent(payUpiUrl)}`;

  // SUBMITTED VERIFICATION SCREEN (Strictly pending verification, no unearned credit)
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#0b131e] text-slate-100 flex flex-col items-center justify-center p-5 text-center animate-fade-in font-sans">
        <div className="w-20 h-20 rounded-3xl bg-amber-500/20 border-2 border-amber-500/40 text-amber-400 flex items-center justify-center shadow-xl shadow-amber-500/10 mb-4">
          <Clock className="w-10 h-10 animate-pulse" />
        </div>

        <div className="inline-flex items-center space-x-1.5 bg-amber-500/15 text-amber-300 border border-amber-500/30 text-xs font-bold px-3 py-1 rounded-full mb-3">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
          <span>Payment Under Verification</span>
        </div>

        <h2 className="text-2xl font-black text-white">Deposit Request Submitted!</h2>

        <div className="text-3xl font-black text-emerald-400 mt-2 font-mono">
          {formatINR(order.amount)}
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 w-full max-w-sm mt-4 text-left space-y-2 text-xs">
          <div className="flex justify-between text-slate-400">
            <span>Order ID:</span>
            <span className="font-mono font-bold text-slate-200">{order.orderId}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Submitted UTR:</span>
            <span className="font-mono font-bold text-amber-400 tracking-wider">{submittedUtr}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Review Status:</span>
            <span className="font-bold text-amber-300">Pending Bank Clearance</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-slate-800 text-slate-300">
            <span>Estimated Verification Time:</span>
            <span className="font-bold text-slate-200">5 – 15 Minutes</span>
          </div>
        </div>

        <p className="text-xs text-slate-400 mt-3 max-w-xs leading-relaxed">
          Our finance team is verifying this transaction with bank records. Your balance will be credited as soon as payment is confirmed.
        </p>

        <div className="w-full max-w-sm space-y-2 mt-6">
          <button
            onClick={() => setCurrentView('transactions')}
            className="w-full py-3.5 rounded-xl btn-chamkila text-white font-black text-xs shadow-lg active:scale-95 transition-all cursor-pointer"
          >
            Check Deposit Status in Records
          </button>
          <button
            onClick={() => setCurrentView('home')}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs active:scale-95 transition-all cursor-pointer"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d1620] text-slate-100 pb-24 animate-fade-in font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Cashier Bar */}
      <div className="bg-[#131f2d] border-b border-slate-800 px-4 py-3 sticky top-0 z-30 flex items-center justify-between shadow-md">
        <button
          id="payment-back-btn"
          onClick={goBack}
          className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-700 active:scale-95 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="flex flex-col items-center">
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-black tracking-wider uppercase text-white">
              AKM Direct Payment Cashier
            </span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            Order: {order.orderId}
          </span>
        </div>

        <div className="flex items-center space-x-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full text-[10px] font-bold">
          <Lock className="w-3 h-3" />
          <span>256-Bit</span>
        </div>
      </div>

      <div className="p-4 max-w-md mx-auto space-y-4">
        {/* Payable Amount & Timer Banner */}
        <div className="bg-gradient-to-br from-[#172738] to-[#101b27] p-4 rounded-2xl border border-slate-700/80 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Payable Amount
            </span>
            <div className="flex items-center space-x-1 bg-amber-500/15 border border-amber-500/30 text-amber-300 px-2 py-0.5 rounded-full text-[11px] font-bold font-mono">
              <Clock className="w-3 h-3 animate-spin text-amber-400" />
              <span>{formatTimer(timeLeft)}</span>
            </div>
          </div>

          <div className="flex items-baseline justify-between mt-2">
            <div className="text-3xl font-black text-emerald-400 tracking-tight font-mono">
              {formatINR(order.amount)}
            </div>
            <button
              onClick={() => handleCopy(String(order.amount), 'amount')}
              className="text-[11px] font-bold text-slate-300 bg-slate-800/90 hover:bg-slate-700 px-2.5 py-1 rounded-lg border border-slate-700 flex items-center space-x-1 active:scale-95 transition-all cursor-pointer"
            >
              {copiedAmount ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedAmount ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <div className="mt-2.5 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Gateway Channel:</span>
            <span className="font-bold text-emerald-300">{order.channel || 'Instant Fast UPI'}</span>
          </div>
        </div>

        {/* Direct Payment Action Card */}
        {order.payUrl && (
          <div className="bg-gradient-to-r from-emerald-950/90 via-teal-950/80 to-slate-900 p-4 rounded-2xl border-2 border-emerald-500/60 shadow-lg space-y-2.5 animate-fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-black text-emerald-300">
                  Instant UPI Checkout Activated
                </span>
              </div>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-mono font-bold border border-emerald-500/40">
                Official Gateway
              </span>
            </div>

            <p className="text-[11px] text-slate-300">
              Click below to proceed to the secure <span className="text-emerald-300 font-bold">{order.channel}</span> payment window.
            </p>

            <a
              id="cashier-direct-pay-link"
              href={order.payUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => sfx.playGatewayLaunch()}
              className="w-full py-3 px-4 rounded-xl btn-chamkila text-white font-black text-xs flex items-center justify-center space-x-2 shadow-lg hover:brightness-110 active:scale-95 transition-all cursor-pointer"
            >
              <span>Pay Securely Now</span>
              <ExternalLink className="w-4 h-4 stroke-[2.5]" />
            </a>
          </div>
        )}

        {/* 1-Tap UPI App Launch Buttons (Mobile Direct Checkout) */}
        <div className="bg-[#142231] p-3.5 rounded-2xl border border-slate-800 shadow-md space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-200">
              ⚡ 1-Tap Direct UPI Pay (Mobile)
            </span>
            <span className="text-[10px] text-emerald-400 font-medium">Instant Open</span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {/* PhonePe */}
            <a
              href={`phonepe://pay?pa=${encodeURIComponent(targetUpiId)}&pn=${encodeURIComponent('AKM Investments')}&am=${order.amount}&cu=INR&tn=${encodeURIComponent(order.orderId)}`}
              onClick={() => sfx.playTap()}
              className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-800/80 hover:bg-[#5f259f]/40 border border-slate-700/80 hover:border-[#5f259f] transition-all active:scale-95 cursor-pointer text-center group"
            >
              <div className="w-8 h-8 rounded-lg bg-[#5f259f] text-white flex items-center justify-center font-black text-xs shadow-sm">
                पे
              </div>
              <span className="text-[10px] font-bold text-slate-300 mt-1">PhonePe</span>
            </a>

            {/* Google Pay */}
            <a
              href={`tez://upi/pay?pa=${encodeURIComponent(targetUpiId)}&pn=${encodeURIComponent('AKM Investments')}&am=${order.amount}&cu=INR&tn=${encodeURIComponent(order.orderId)}`}
              onClick={() => sfx.playTap()}
              className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-800/80 hover:bg-blue-600/30 border border-slate-700/80 hover:border-blue-500 transition-all active:scale-95 cursor-pointer text-center group"
            >
              <div className="w-8 h-8 rounded-lg bg-white text-blue-600 flex items-center justify-center font-black text-xs shadow-sm">
                G
              </div>
              <span className="text-[10px] font-bold text-slate-300 mt-1">GPay</span>
            </a>

            {/* Paytm */}
            <a
              href={`paytmmp://pay?pa=${encodeURIComponent(targetUpiId)}&pn=${encodeURIComponent('AKM Investments')}&am=${order.amount}&cu=INR&tn=${encodeURIComponent(order.orderId)}`}
              onClick={() => sfx.playTap()}
              className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-800/80 hover:bg-[#00b9f5]/30 border border-slate-700/80 hover:border-[#00b9f5] transition-all active:scale-95 cursor-pointer text-center group"
            >
              <div className="w-8 h-8 rounded-lg bg-[#002e6e] text-[#00b9f5] flex items-center justify-center font-black text-[11px] shadow-sm">
                Paytm
              </div>
              <span className="text-[10px] font-bold text-slate-300 mt-1">Paytm</span>
            </a>

            {/* Other UPI */}
            <a
              href={payUpiUrl}
              onClick={() => sfx.playTap()}
              className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-800/80 hover:bg-emerald-600/30 border border-slate-700/80 hover:border-emerald-500 transition-all active:scale-95 cursor-pointer text-center group"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-black text-xs shadow-sm">
                UPI
              </div>
              <span className="text-[10px] font-bold text-slate-300 mt-1">Any App</span>
            </a>
          </div>
        </div>

        {/* Dynamic QR Code Card */}
        <div className="bg-[#142231] p-4 rounded-2xl border border-slate-800 shadow-md text-center space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-200">
              Scan UPI QR Code
            </span>
            <span className="text-[10px] text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20 font-bold">
              Scan & Pay Exact Amount
            </span>
          </div>

          {/* QR Container */}
          <div className="relative mx-auto w-56 h-56 bg-white p-3 rounded-2xl shadow-xl flex items-center justify-center border-4 border-emerald-500/40 group">
            <img
              src={qrCodeUrl}
              alt="UPI Payment QR Code"
              className="w-full h-full object-contain rounded-lg"
              loading="eager"
            />
            {/* Center Logo Overlay */}
            <div className="absolute inset-0 m-auto w-10 h-10 rounded-xl bg-slate-950 border-2 border-emerald-400 flex flex-col items-center justify-center shadow-lg">
              <span className="text-[8px] font-black text-emerald-400">AKM</span>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-0.5"></div>
            </div>
          </div>

          <p className="text-[11px] text-slate-400">
            Open PhonePe / Google Pay / Paytm / BHIM and scan this QR code to transfer.
          </p>

          {/* Direct External Checkout Button (if third-party URL exists) */}
          {order.payUrl && (
            <a
              href={order.payUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => sfx.playTap()}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/40 text-xs font-bold flex items-center justify-center space-x-1.5 transition-all cursor-pointer active:scale-95"
            >
              <span>Open External Gateway Cashier</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>

        {/* Copy UPI ID Card */}
        <div className="bg-[#142231] p-3.5 rounded-2xl border border-slate-800 shadow-md space-y-2">
          <div className="text-xs font-bold text-slate-300">
            Or Transfer Directly to Beneficiary UPI ID:
          </div>
          <div className="flex items-center justify-between bg-slate-900/90 border border-slate-700/90 rounded-xl p-2.5">
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">UPI ID / VPA</span>
              <span className="font-mono text-sm font-black text-emerald-400 tracking-wide select-all">
                {targetUpiId}
              </span>
            </div>
            <button
              onClick={() => handleCopy(targetUpiId, 'upi')}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3 py-1.5 rounded-lg flex items-center space-x-1 active:scale-95 transition-all cursor-pointer shadow-sm"
            >
              {copiedUpi ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedUpi ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Step-by-Step & 12-Digit UTR Form */}
        <div className="bg-[#142231] p-4 rounded-2xl border border-emerald-500/30 shadow-xl space-y-3">
          <div className="flex items-center space-x-2 pb-2 border-b border-slate-800">
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-xs">
              ✓
            </div>
            <div>
              <h4 className="text-xs font-black text-white">
                Step 2: Submit 12-Digit UPI UTR / Ref No.
              </h4>
              <p className="text-[10px] text-slate-400">
                After payment in your UPI app, paste the 12-digit transaction UTR / RRN number
              </p>
            </div>
          </div>

          <form onSubmit={handleUtrSubmit} className="space-y-3 pt-1">
            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1.5">
                Enter 12-Digit UTR Number
              </label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={12}
                placeholder="e.g. 423985124678"
                value={utrNumber}
                onChange={(e) => setUtrNumber(e.target.value.replace(/\D/g, ''))}
                className="w-full bg-slate-900 border-2 border-slate-700 focus:border-emerald-400 rounded-xl px-3 py-2.5 text-sm font-mono font-black text-emerald-400 placeholder:text-slate-600 focus:outline-none transition-all tracking-wider"
              />
              <span className="text-[10.5px] text-slate-400 mt-1 block">
                Found in PhonePe / GPay / Paytm receipt as "UPI Ref No" or "UTR"
              </span>
            </div>

            <button
              type="submit"
              disabled={isSubmittingUtr || utrNumber.length < 10}
              className={`w-full py-3 rounded-xl font-black text-xs flex items-center justify-center space-x-1.5 transition-all cursor-pointer shadow-lg active:scale-95 ${
                isSubmittingUtr || utrNumber.length < 10
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  : 'btn-chamkila text-white shadow-emerald-500/30'
              }`}
            >
              {isSubmittingUtr ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Submitting UTR for Review...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-emerald-300" />
                  <span>Submit UTR for Verification</span>
                </>
              )}
            </button>
          </form>

          {/* Verification Notice */}
          <div className="flex items-center justify-center space-x-1.5 text-[10.5px] text-slate-400 pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Bank-statement verified deposits protect against fraudulent claims</span>
          </div>
        </div>

        {/* Safety Warnings */}
        <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800/80 text-[10.5px] text-slate-400 space-y-1">
          <div className="flex items-center space-x-1 text-slate-300 font-bold">
            <Info className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Deposit Rules:</span>
          </div>
          <p>• Transfer the exact amount ({formatINR(order.amount)}). Do not change the amount.</p>
          <p>• Each QR code is single-use and linked to your Order ID ({order.orderId}).</p>
          <p>• Only genuine payments verified against bank statements are credited to wallets.</p>
        </div>
      </div>
    </div>
  );
};
