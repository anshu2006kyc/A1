import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Lock,
  RotateCw,
  ShieldCheck,
  Sparkles,
  Wallet,
  AlertCircle,
  Loader2,
  ExternalLink,
  Zap,
  Sun,
  Copy,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
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
    confirmDepositPayment,
    showToast
  } = useApp();

  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [copiedOrderId, setCopiedOrderId] = useState(false);
  const [isFrameLoading, setIsFrameLoading] = useState(true);
  const [frameKey, setFrameKey] = useState(1);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Active payment order details
  const order = useMemo(() => {
    if (activePayment) return activePayment;
    const defaultId = `ORD${Date.now()}`;
    return {
      orderId: defaultId,
      amount: 500,
      channel: 'WATCHPAY',
      payUrl: `/pay/checkout?order_id=${defaultId}&amount=500&channel=watchpay`,
      createdAt: Date.now()
    };
  }, [activePayment]);

  const isWatchPay = useMemo(() => {
    return (order.channel || '').toUpperCase().includes('WATCH');
  }, [order.channel]);

  const gatewayName = isWatchPay ? 'WATCHPAY' : 'SUNPAY';
  const gatewaySubtitle = isWatchPay ? 'WatchGLB Automated Gateway' : 'SunPay VIP Express Gateway';

  // Direct official gateway checkout URL
  const directGatewayUrl = useMemo(() => {
    if (order.payUrl && order.payUrl.startsWith('http')) {
      return order.payUrl;
    }
    return `/pay/checkout?order_id=${encodeURIComponent(order.orderId)}&amount=${order.amount}&channel=${isWatchPay ? 'watchpay' : 'sunpay'}`;
  }, [order.payUrl, order.orderId, order.amount, isWatchPay]);

  // In-app embedded frame URL (via server proxy to eliminate X-Frame-Options blocking)
  const frameSrc = useMemo(() => {
    return `/api/cashier-frame?url=${encodeURIComponent(directGatewayUrl)}&orderId=${encodeURIComponent(order.orderId)}&amount=${order.amount}`;
  }, [directGatewayUrl, order.orderId, order.amount]);

  // Automated background payment polling - Only credits when REAL settlement occurs
  useEffect(() => {
    if (isSuccess || !order.orderId) return;

    let isMounted = true;
    const pollInterval = setInterval(async () => {
      try {
        const res = await fetch(`/api/payin/status/${order.orderId}`);
        if (!res.ok) return;
        const data = await res.json();
        if (data && data.status === 'success' && isMounted && !isSuccess) {
          clearInterval(pollInterval);
          setIsSuccess(true);
          confirmDepositPayment(order.orderId, data.utr);
          sfx.playSuccess();
          try {
            confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
          } catch {}
          showToast(`Deposit of ₹${order.amount} verified by ${gatewayName}!`, 'success');
        }
      } catch {
        // Silently retry
      }
    }, 3000);

    return () => {
      isMounted = false;
      clearInterval(pollInterval);
    };
  }, [order.orderId, isSuccess, confirmDepositPayment, order.amount, showToast, gatewayName]);

  // Strict Real Verification Handler - Bina payment kiye balance KABHI nahi aayega
  const handleVerifyStatus = async () => {
    if (isVerifying || isSuccess) return;

    setIsVerifying(true);
    sfx.playTap();

    try {
      const res = await fetch(`/api/payin/status/${order.orderId}`);
      const data = await res.json();

      if (data && data.status === 'success') {
        setIsSuccess(true);
        confirmDepositPayment(order.orderId, data.utr);
        sfx.playSuccess();
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch {}
        showToast(`Deposit of ₹${order.amount} verified by ${gatewayName}!`, 'success');
      } else {
        // Payment not completed yet - STRICTLY DO NOT CREDIT
        sfx.playWarning();
        showToast(`Payment not received on ${gatewayName} yet. Please complete payment first.`, 'warning');
      }
    } catch {
      sfx.playWarning();
      showToast(`Unable to verify ${gatewayName} settlement. Please check connection.`, 'error');
    } finally {
      setIsVerifying(false);
    }
  };

  // Reload the in-app frame
  const handleReloadFrame = () => {
    sfx.playTap();
    setIsFrameLoading(true);
    setFrameKey((prev) => prev + 1);
    showToast(`Reloading ${gatewayName} gateway...`, 'info');
  };

  // Open official gateway directly in a new window/app
  const handleOpenExternal = () => {
    sfx.playTap();
    window.open(directGatewayUrl, '_blank');
  };

  // Copy Order ID
  const handleCopyOrderId = () => {
    sfx.playTap();
    navigator.clipboard.writeText(order.orderId);
    setCopiedOrderId(true);
    showToast('Order ID copied!', 'info');
    setTimeout(() => setCopiedOrderId(false), 2000);
  };

  // SUCCESS SCREEN
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#0b131e] text-slate-100 flex flex-col items-center justify-center p-6 text-center font-sans max-w-md mx-auto animate-fade-in select-none">
        <div className="w-20 h-20 rounded-3xl bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center shadow-xl shadow-emerald-500/30 mb-4 animate-bounce">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="inline-flex items-center space-x-1.5 bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs font-bold px-3 py-1 rounded-full mb-2">
          <ShieldCheck className="w-3.5 h-3.5 fill-current text-emerald-400" />
          <span>{gatewayName} Settlement Verified</span>
        </div>

        <h2 className="text-2xl font-black text-white mt-1">Deposit Successful!</h2>
        <p className="text-xs text-slate-400 mt-1 max-w-xs">
          Your payment via {gatewayName} was confirmed and added to your wallet.
        </p>

        <div className="text-4xl font-black text-emerald-400 mt-3 font-mono">
          {formatINR(order.amount)}
        </div>

        <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-md w-full mt-6 text-left space-y-2 text-xs">
          <div className="flex justify-between text-slate-400">
            <span>Order ID:</span>
            <span className="font-mono font-bold text-slate-200">{order.orderId}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Gateway:</span>
            <span className="font-bold text-emerald-400">{gatewayName} Official</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Status:</span>
            <span className="font-bold text-emerald-400">Settled & Credited</span>
          </div>
          <div className="flex justify-between pt-2.5 border-t border-slate-800 text-slate-200 font-bold">
            <span>New Wallet Balance:</span>
            <span className="text-emerald-400 font-mono text-sm">{formatINR(user.balance)}</span>
          </div>
        </div>

        <div className="w-full max-w-sm space-y-2.5 mt-6">
          <button
            onClick={() => setCurrentView('home')}
            className="w-full py-3.5 rounded-xl btn-chamkila text-white font-black text-xs shadow-lg active:scale-95 transition-all cursor-pointer flex items-center justify-center space-x-2"
          >
            <Sparkles className="w-4 h-4 text-emerald-200" />
            <span>Invest in High-Yield Plans</span>
          </button>
          <button
            onClick={() => setCurrentView('transactions')}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs active:scale-95 transition-all cursor-pointer flex items-center justify-center space-x-2"
          >
            <Wallet className="w-3.5 h-3.5" />
            <span>View Wallet History</span>
          </button>
        </div>
      </div>
    );
  }

  // COMPLETE IN-APP GATEWAY CASHIER (WATCHPAY & SUNPAY EXCLUSIVE)
  return (
    <div className="h-[100dvh] max-h-screen bg-[#0b131e] text-slate-100 font-sans flex flex-col justify-between select-none max-w-md mx-auto overflow-hidden">
      {/* 1. Header Bar with Gateway Branding */}
      <div className="bg-[#101c2a] border-b border-slate-800 px-3.5 py-2.5 flex items-center justify-between shrink-0 z-20 shadow-md">
        <button
          id="cashier-back-btn"
          onClick={goBack}
          className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:text-white active:scale-95 transition-all cursor-pointer shrink-0"
          title="Back to Recharge"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="flex flex-col items-center">
          <div className="flex items-center space-x-1.5">
            {isWatchPay ? (
              <div className="w-4 h-4 rounded bg-[#00ba58] text-white flex items-center justify-center">
                <Zap className="w-2.5 h-2.5 fill-current" />
              </div>
            ) : (
              <div className="w-4 h-4 rounded bg-amber-500 text-white flex items-center justify-center">
                <Sun className="w-2.5 h-2.5 fill-current" />
              </div>
            )}
            <span className="text-xs font-black tracking-wider uppercase text-white">
              {gatewayName} CASHIER
            </span>
          </div>
          <span className="text-[9.5px] text-slate-400 font-medium">
            {gatewaySubtitle}
          </span>
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={handleReloadFrame}
            className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:text-white active:scale-95 transition-all cursor-pointer"
            title="Reload Gateway"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleOpenExternal}
            className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:text-white active:scale-95 transition-all cursor-pointer"
            title="Open in Browser / UPI"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Order Quick Summary Strip */}
      <div className="bg-[#142335] px-3 py-1.5 border-b border-slate-800 flex items-center justify-between text-xs shrink-0">
        <div className="flex items-center space-x-2">
          <span className="text-slate-400 text-[11px]">Pay:</span>
          <span className="text-emerald-400 font-mono font-black text-sm">
            {formatINR(order.amount)}
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="text-slate-400 font-mono text-[10px]">ID: {order.orderId}</span>
          <button
            onClick={handleCopyOrderId}
            className="text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Copy Order ID"
          >
            {copiedOrderId ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* 3. In-App Embedded Payment Gateway (Renders WatchPay or SunPay Directly) */}
      <div className="flex-1 relative w-full h-full bg-[#0a0f18] overflow-hidden">
        {isFrameLoading && (
          <div className="absolute inset-0 z-10 bg-[#0b131e] flex flex-col items-center justify-center p-6 text-center space-y-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center animate-pulse ${
              isWatchPay ? 'bg-emerald-500/20 text-[#00ba58]' : 'bg-amber-500/20 text-amber-500'
            }`}>
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Opening {gatewayName} Gateway...</div>
              <div className="text-xs text-slate-400 mt-0.5">
                Connecting to official bank cashier desk
              </div>
            </div>
            <button
              onClick={handleOpenExternal}
              className="mt-2 py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center space-x-1.5 active:scale-95 transition-all cursor-pointer border border-slate-700"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Tap here if page does not load</span>
            </button>
          </div>
        )}

        <iframe
          key={frameKey}
          ref={iframeRef}
          src={frameSrc}
          title={`${gatewayName} Payment Cashier`}
          className="w-full h-full border-none block"
          onLoad={() => setIsFrameLoading(false)}
          allow="payment *; camera *; geolocation *"
          sandbox="allow-forms allow-scripts allow-same-origin allow-popups allow-modals allow-top-navigation-by-user-activation"
        />
      </div>

      {/* 4. Bottom Settlement Action Bar */}
      <div className="bg-[#101c2a] p-3 border-t border-slate-800 shrink-0 shadow-2xl space-y-2 z-20">
        <div className="flex items-center justify-between text-[10px] text-slate-400 px-1">
          <div className="flex items-center space-x-1 text-emerald-400">
            <Lock className="w-3 h-3" />
            <span>Official {gatewayName} Encrypted Channel</span>
          </div>
          <span className="font-mono text-slate-500">Instant Verification</span>
        </div>

        <button
          id="verify-payment-btn"
          onClick={handleVerifyStatus}
          disabled={isVerifying}
          className={`w-full py-3 rounded-xl font-black text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-lg active:scale-95 ${
            isVerifying
              ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700'
              : isWatchPay
              ? 'bg-[#00ba58] hover:bg-emerald-600 text-white shadow-emerald-500/25'
              : 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/25'
          }`}
        >
          {isVerifying ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Checking {gatewayName} Bank Settlement...</span>
            </>
          ) : (
            <>
              <RotateCw className="w-4 h-4" />
              <span>🔄 Verify {gatewayName} Payment / Confirm</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
