import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AlertCircle, CheckCircle2, Clock, Copy, ExternalLink, QrCode, ShieldCheck, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatINR } from '../utils/currency';

export const GatewaySimulatorModal: React.FC = () => {
  const {
    user,
    activeCheckoutModal,
    setActiveCheckoutModal,
    adminSettings,
    confirmDepositPayment,
    showToast
  } = useApp();

  const [utrNumber, setUtrNumber] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [copiedOrder, setCopiedOrder] = useState(false);
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

  const handleSimulateInstantPay = () => {
    confirmDepositPayment(orderId, `AUTOPAY_${Date.now()}`);
    setActiveCheckoutModal(null);
    showToast(`Deposit of ${formatINR(amount)} completed successfully!`, 'success');
  };

  const handleSubmitUtr = () => {
    if (!utrNumber || utrNumber.trim().length < 6) {
      showToast('Please enter a valid 12-digit UTR number', 'error');
      return;
    }
    confirmDepositPayment(orderId, utrNumber.trim());
    setActiveCheckoutModal(null);
    showToast('UTR submitted! Deposit request is being processed.', 'success');
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
              <div className="text-[10px] text-gray-500 font-medium">Automated Verified Node</div>
            </div>
          </div>
          <div className="flex items-center text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5 mr-1" />
            <span>256-Bit SSL</span>
          </div>
        </div>

        {/* Amount & Timer */}
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-3.5 rounded-2xl border border-emerald-100 text-center mb-4">
          <span className="text-xs text-gray-500 font-medium">Payment Payable Amount</span>
          <div className="text-2xl font-black text-emerald-700 mt-0.5 tabular-nums font-mono">{formatINR(amount)}</div>
          <div className="flex items-center justify-center space-x-1.5 text-[11px] text-amber-700 mt-1">
            <Clock className="w-3.5 h-3.5 animate-spin" />
            <span>Expires in: 14:52</span>
          </div>
        </div>

        {/* Instant UPI Pay Button */}
        <div className="mb-4">
          <button
            type="button"
            onClick={handleSimulateInstantPay}
            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-emerald-500/20 active:scale-95 transition-all text-center cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Instant Auto-Credit Pay</span>
          </button>
          <span className="text-[10px] text-gray-400 block text-center mt-1">
            Official 256-bit encrypted secure UPI channel
          </span>
        </div>

        {/* Order Details */}
        <div className="space-y-1.5 text-xs bg-gray-50 p-3 rounded-xl mb-4 border border-gray-100">
          <div className="flex justify-between items-center text-gray-600">
            <span>Merchant ID:</span>
            <span className="font-mono font-bold text-gray-800">{adminSettings.mchId}</span>
          </div>
          <div className="flex justify-between items-center text-gray-600">
            <span>Method Name:</span>
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

        {/* UTR Input */}
        <div className="mb-4">
          <label className="block text-[11px] font-semibold text-gray-700 mb-1">
            After payment, enter 12-Digit UTR / Ref No:
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="e.g. 423871928371"
              value={utrNumber}
              onChange={(e) => setUtrNumber(e.target.value)}
              className="flex-1 px-3 py-2 text-xs border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
            />
            <button
              onClick={handleSubmitUtr}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer shadow-sm"
            >
              Submit
            </button>
          </div>
        </div>

        {/* Fast Instant Demo Pay Button */}
        <div className="space-y-2">
          <button
            id="instant-test-pay-btn"
            onClick={handleSimulateInstantPay}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-emerald-600/30 active:scale-95 transition-all cursor-pointer"
          >
            <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
            <span>Instant Auto-Approve (Simulation Test)</span>
          </button>

          <button
            onClick={() => setActiveCheckoutModal(null)}
            className="w-full py-2 rounded-xl text-gray-500 hover:text-gray-700 text-xs font-semibold hover:bg-gray-100 transition-colors cursor-pointer"
          >
            Cancel Payment
          </button>
        </div>

        {/* Gateway MD5 Signature Debug Viewer */}
        <div className="mt-3 pt-3 border-t text-center">
          <button
            onClick={() => setShowDebug(!showDebug)}
            className="text-[10px] text-gray-400 hover:text-gray-600 underline cursor-pointer"
          >
            {showDebug ? 'Hide Security & API Specs' : 'View Gateway API Security Specs'}
          </button>

          {showDebug && (
            <div className="text-left mt-2 p-2 bg-gray-900 text-emerald-400 rounded-lg text-[10px] font-mono overflow-x-auto space-y-1">
              <div>
                <span className="text-gray-400">Gateway:</span> Sunpays Enterprise Node
              </div>
              <div>
                <span className="text-gray-400">Order Ref:</span> {orderId}
              </div>
              <div>
                <span className="text-gray-400">Security:</span> HMAC-SHA256 Signed
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
