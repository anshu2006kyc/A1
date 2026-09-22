import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Lock,
  RotateCw,
  ShieldCheck,
  Wallet,
  Loader2,
  Zap,
  Sun,
  Copy,
  Check,
  ExternalLink
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
    return (order.channel || '').toUpperCase().includes('WATCH') || (order.channel || '').includes('1');
  }, [order.channel]);

  // Direct official gateway checkout URL - Opens 100% inside app
  const frameSrc = useMemo(() => {
    if (order.payUrl && (order.payUrl.startsWith('http://') || order.payUrl.startsWith('https://'))) {
      return order.payUrl;
    }
    // If relative path, resolve to current origin
    const path = order.payUrl || `/pay/checkout?order_id=${encodeURIComponent(order.orderId)}&amount=${order.amount}&channel=${isWatchPay ? 'watchpay' : 'sunpay'}`;
    return path.startsWith('/') ? path : `/${path}`;
  }, [order.payUrl, order.orderId, order.amount, isWatchPay]);

  // Automated background payment polling - Only credits when REAL settlement occurs
  useEffect(() => {
    if (isSuccess || !order.orderId) return;

    let isMounted = true;
    const pollInterval = setInterval(async () => {
      try {
        const res = await fetch(`/api/payin/status/${order.orderId}`);
        if (!res.ok) return;
        const contentType = res.headers.get('content-type') || '';
        if (!contentType.includes('application/json')) return;

        const data = await res.json();
        if (data && data.status === 'success' && isMounted && !isSuccess) {
          clearInterval(pollInterval);
          setIsSuccess(true);
          confirmDepositPayment(order.orderId, data.utr);
          sfx.playSuccess();
          try {
            confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
          } catch {}
          showToast(`Deposit of ₹${order.amount} verified and credited to wallet!`, 'success');
        }
      } catch {
        // Silently retry
      }
    }, 3000);

    return () => {
      isMounted = false;
      clearInterval(pollInterval);
    };
  }, [order.orderId, isSuccess, confirmDepositPayment, order.amount, showToast]);

  // Strict Real Verification Handler - Bina payment kiye balance KABHI nahi aayega
  const handleVerifyStatus = async () => {
    if (isVerifying || isSuccess) return;

    setIsVerifying(true);
    sfx.playTap();

    try {
      const res = await fetch(`/api/payin/status/${order.orderId}`);
      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        showToast('Waiting for bank settlement. Please complete the transfer first.', 'warning');
        return;
      }

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
        showToast(`Deposit of ₹${order.amount} verified and credited!`, 'success');
      } else {
        // Payment not completed yet - STRICTLY DO NOT CREDIT
        sfx.playWarning();
        showToast('Payment not received yet. Please complete payment in your UPI app first.', 'warning');
      }
    } catch {
      sfx.playWarning();
      showToast('Unable to verify bank settlement. Please check your network connection.', 'error');
    } finally {
      setIsVerifying(false);
    }
  };

  // Reload the in-app frame without exiting the app
  const handleReloadFrame = () => {
    sfx.playTap();
    setIsFrameLoading(true);
    setFrameKey((prev) => prev + 1);
    showToast('Reloading secure payment desk inside app...', 'info');
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
          <span>AKM ENTERPRISES Settlement Verified</span>
        </div>

        <h2 className="text-2xl font-black text-white mt-1">Deposit Successful!</h2>
        <p className="text-xs text-slate-400 mt-1 max-w-xs">
          Your payment was confirmed and credited directly to your wallet.
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
            <span>Payment Method:</span>
            <span className="font-bold text-emerald-400">Instant UPI Direct</span>
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
            <Zap className="w-4 h-4 text-emerald-200" />
            <span>Invest in Growth Plans</span>
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

  // 100% IN-APP NATIVE CASHIER VIEW (NO EXTERNAL POPUPS / REDIRECTS)
  return (
    <div className="h-[100dvh] max-h-screen bg-[#0b131e] text-slate-100 font-sans flex flex-col justify-between select-none max-w-md mx-auto overflow-hidden">
      {/* 1. In-App Header Bar with AKM ENTERPRISES Branding */}
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
            <div className="w-4 h-4 rounded bg-[#00ba58] text-white flex items-center justify-center">
              <Zap className="w-2.5 h-2.5 fill-current" />
            </div>
            <span className="text-xs font-black tracking-wider uppercase text-white">
              AKM ENTERPRISES CASHIER
            </span>
          </div>
          <span className="text-[9.5px] text-slate-400 font-medium">
            256-Bit Encrypted Official Payment Desk
          </span>
        </div>

        <div className="flex items-center space-x-1.5 shrink-0">
          {frameSrc && frameSrc.startsWith('http') && (
            <button
              onClick={() => {
                sfx.playTap();
                window.open(frameSrc, '_blank');
                showToast('Opening payment gateway in external browser...', 'info');
              }}
              className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:text-white active:scale-95 transition-all cursor-pointer"
              title="Open in External Browser"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={handleReloadFrame}
            className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:text-white active:scale-95 transition-all cursor-pointer"
            title="Refresh in-app cashier"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Order Quick Summary Strip */}
      <div className="bg-[#142335] px-3 py-1.5 border-b border-slate-800 flex items-center justify-between text-xs shrink-0">
        <div className="flex items-center space-x-2">
          <span className="text-slate-400 text-[11px]">Amount:</span>
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

      {/* 3. In-App Embedded Payment Desk */}
      <div className="flex-1 relative w-full h-full bg-[#ffffff] overflow-hidden">
        {isFrameLoading && (
          <div className="absolute inset-0 z-10 bg-[#0b131e] flex flex-col items-center justify-center p-6 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-[#00ba58] flex items-center justify-center animate-pulse">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Opening Secure Cashier...</div>
              <div className="text-xs text-slate-400 mt-0.5">
                Connecting directly to official payment desk
              </div>
            </div>
          </div>
        )}

        <iframe
          key={frameKey}
          ref={iframeRef}
          src={frameSrc}
          title="AKM ENTERPRISES Secure Payment Cashier"
          className="w-full h-full border-none block bg-white"
          onLoad={() => setIsFrameLoading(false)}
          allow="payment *; camera *; geolocation *; clipboard-read; clipboard-write; display-capture"
        />
      </div>

      {/* 4. Bottom Settlement Action Bar */}
      <div className="bg-[#101c2a] p-3 border-t border-slate-800 shrink-0 shadow-2xl space-y-2 z-20">
        <div className="flex items-center justify-between text-[10px] text-slate-400 px-1">
          <div className="flex items-center space-x-1 text-emerald-400">
            <Lock className="w-3 h-3" />
            <span>AKM ENTERPRISES 256-Bit Encrypted Channel</span>
          </div>
          <span className="font-mono text-slate-500">Auto-Verifying</span>
        </div>

        <button
          id="verify-payment-btn"
          onClick={handleVerifyStatus}
          disabled={isVerifying}
          className="w-full py-3 rounded-xl font-black text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-lg active:scale-95 bg-[#00ba58] hover:bg-emerald-600 text-white shadow-emerald-500/25"
        >
          {isVerifying ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Checking Bank Settlement...</span>
            </>
          ) : (
            <>
              <RotateCw className="w-4 h-4" />
              <span>🔄 Check Bank Settlement / Confirm Credit</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
