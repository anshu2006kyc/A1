import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle2, Clock, Copy, Loader2, QrCode, ShieldCheck, Sparkles, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatINR } from '../utils/currency';
import { sfx } from '../utils/sound';

export const GatewaySimulatorModal: React.FC = () => {
  const {
    activeCheckoutModal,
    setActiveCheckoutModal,
    adminSettings,
    confirmDepositPayment,
    showToast
  } = useApp();

  const [copiedUpi, setCopiedUpi] = useState(false);
  const [copiedOrder, setCopiedOrder] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showDebug, setShowDebug] = useState(false);

  // Prevent background scrolling while modal is open
  useEffect(() => {
    if (!activeCheckoutModal) return;
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [activeCheckoutModal]);

  if (!activeCheckoutModal) return null;

  const { orderId, amount, channel } = activeCheckoutModal;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(adminSettings.upiId);
    setCopiedUpi(true);
    showToast('UPI ID copied to clipboard!', 'info');
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleCopyOrder = () => {
    navigator.clipboard.writeText(orderId);
    setCopiedOrder(true);
    showToast('Order ID copied!', 'info');
    setTimeout(() => setCopiedOrder(false), 2000);
  };

  // Automated 1-Tap Payment Completion (No manual UTR required)
  const handleAutoConfirmPayment = () => {
    if (isProcessing || isSuccess) return;
    setIsProcessing(true);
    sfx.playTap();

    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      confirmDepositPayment(orderId);
      setTimeout(() => {
        setActiveCheckoutModal(null);
      }, 1800);
    }, 1200);
  };

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-gray-100 relative my-auto max-h-[92vh] overflow-y-auto">
        {/* Gateway Header */}
        <div className="flex items-center justify-between border-b pb-3 mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white flex items-center justify-center font-black text-sm shadow-md">
              UPI
            </div>
            <div>
              <div className="text-xs font-black text-gray-900 leading-tight">
                Secure Instant UPI Gateway
              </div>
              <div className="text-[10px] text-gray-500 font-medium">100% Automated Node</div>
            </div>
          </div>
          <div className="flex items-center text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5 mr-1" />
            <span>Instant</span>
          </div>
        </div>

        {/* Amount & Timer */}
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-3.5 rounded-2xl border border-emerald-100 text-center mb-4">
          <span className="text-xs text-gray-500 font-medium">Payable Amount</span>
          <div className="text-2xl font-black text-emerald-700 mt-0.5 tabular-nums font-mono">{formatINR(amount)}</div>
          <div className="flex items-center justify-center space-x-1.5 text-[11px] text-amber-700 mt-1">
            <Clock className="w-3.5 h-3.5 animate-spin" />
            <span>Automatic Session Active</span>
          </div>
        </div>

        {/* Order Details */}
        <div className="space-y-1.5 text-xs bg-gray-50 p-3 rounded-xl mb-4 border border-gray-100">
          <div className="flex justify-between items-center text-gray-600">
            <span>Routing Node:</span>
            <span className="font-mono font-bold text-emerald-700">{channel}</span>
          </div>
          <div className="flex justify-between items-center text-gray-600">
            <span>Order ID:</span>
            <div className="flex items-center space-x-1">
              <span className="font-mono text-gray-800 text-[11px]">{orderId}</span>
              <button onClick={handleCopyOrder} className="text-emerald-600 hover:text-emerald-700 cursor-pointer">
                <Copy className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic QR Code */}
        <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl border-2 border-dashed border-emerald-300 mb-4 shadow-sm">
          <div className="w-36 h-36 bg-gray-50 p-2 rounded-xl flex items-center justify-center border">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=upi://pay?pa=${adminSettings.upiId}&pn=AKM+Group&am=${amount}&cu=INR`}
              alt="UPI QR Code"
              className="w-full h-full object-contain"
            />
          </div>
          <span className="text-[11px] font-semibold text-gray-600 mt-2 flex items-center">
            <QrCode className="w-3.5 h-3.5 mr-1 text-emerald-600" />
            Scan QR via Paytm / GPay / PhonePe
          </span>

          {/* UPI ID copy pill */}
          <div className="flex items-center justify-between w-full mt-3 px-3 py-1.5 bg-emerald-50 rounded-lg border border-emerald-200">
            <span className="text-[11px] font-mono text-emerald-800 font-semibold">{adminSettings.upiId}</span>
            <button
              onClick={handleCopyUpi}
              className="text-[10px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-2 py-0.5 rounded transition-colors cursor-pointer"
            >
              {copiedUpi ? 'Copied!' : 'Copy UPI'}
            </button>
          </div>
        </div>

        {isSuccess ? (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2 mb-3 animate-fade-in">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="text-xs font-black text-emerald-900">Payment Credited Instantly!</div>
            <p className="text-[11px] text-emerald-700 leading-relaxed">
              ₹{amount} has been added to your wallet automatically.
            </p>
          </div>
        ) : (
          /* Automated Confirmation (No Manual UTR required) */
          <div className="mb-4">
            <button
              onClick={handleAutoConfirmPayment}
              disabled={isProcessing}
              className="w-full py-3 px-4 font-black text-xs rounded-xl transition-all cursor-pointer shadow-md bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center space-x-1.5 active:scale-95"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Verifying Gateway Signal...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-emerald-200" />
                  <span>⚡ Paid in UPI App - Auto-Credit Wallet</span>
                </>
              )}
            </button>
            <span className="text-[10px] text-gray-400 text-center block mt-1.5">
              100% Automated deposit — balance credited immediately.
            </span>
          </div>
        )}

        <div className="space-y-2">
          <button
            onClick={() => setActiveCheckoutModal(null)}
            className="w-full py-2.5 rounded-xl text-gray-600 hover:text-gray-800 text-xs font-semibold bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
          >
            Close Window
          </button>
        </div>

        {/* Gateway Security Specs */}
        <div className="mt-3 pt-3 border-t text-center">
          <button
            onClick={() => setShowDebug(!showDebug)}
            className="text-[10px] text-gray-400 hover:text-gray-600 underline cursor-pointer"
          >
            {showDebug ? 'Hide Security Specs' : 'View Gateway Security Specs'}
          </button>

          {showDebug && (
            <div className="text-left mt-2 p-2 bg-gray-900 text-emerald-400 rounded-lg text-[10px] font-mono overflow-x-auto space-y-1">
              <div>
                <span className="text-gray-400">Gateway:</span> Automated Enterprise Node
              </div>
              <div>
                <span className="text-gray-400">Order Ref:</span> {orderId}
              </div>
              <div>
                <span className="text-gray-400">Security:</span> Automated Signal Settlement
              </div>
              <div>
                <span className="text-gray-400">Channel:</span> {channel}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};
