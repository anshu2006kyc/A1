import React, { useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  Building2,
  Check,
  ChevronDown,
  ChevronRight,
  Clock,
  Coins,
  Copy,
  CreditCard,
  Info,
  Lock,
  RotateCcw,
  ShieldCheck,
  Wallet,
  Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { sfx } from '../utils/sound';
import { formatINR } from '../utils/currency';

export const WithdrawView: React.FC = () => {
  const {
    user,
    setCurrentView,
    navigateToTransactions,
    adminSettings,
    requestWithdrawal,
    cancelWithdrawal,
    transactions,
    showToast
  } = useApp();

  const [withdrawSpeed, setWithdrawSpeed] = useState<'express' | 'standard'>('express');
  const [withdrawAmount, setWithdrawAmount] = useState<string>('500');
  const [selectedPercentage, setSelectedPercentage] = useState<number | null>(null);
  const [tradePassword, setTradePassword] = useState<string>('');
  const [showInstructions, setShowInstructions] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [copiedAccount, setCopiedAccount] = useState<boolean>(false);

  const numAmount = parseFloat(withdrawAmount) || 0;
  const taxPercent = adminSettings.withdrawFeePercent || 0;
  const taxAmount = Math.round(((numAmount * taxPercent) / 100) * 100) / 100;
  const netReceived = Math.max(0, numAmount - taxAmount);

  // Daily quota tracker (standard ₹50,000 max per day)
  const dailyLimit = 50000;
  const usedToday = transactions
    .filter((t) => t.type === 'withdraw' && t.status !== 'rejected')
    .reduce((sum, t) => sum + t.amount, 0);
  const remainingQuota = Math.max(0, dailyLimit - usedToday);
  const quotaPercent = Math.min(100, (usedToday / dailyLimit) * 100);

  // Active pending withdrawal if any
  const pendingWithdrawals = transactions.filter(
    (t) => t.type === 'withdraw' && t.status === 'pending'
  );

  const handleSelectPercentage = (pct: number) => {
    sfx.playTap();
    setSelectedPercentage(pct);
    if (pct === 100) {
      setWithdrawAmount(String(Math.floor(user.balance)));
    } else {
      const calculated = Math.floor((user.balance * pct) / 100);
      setWithdrawAmount(String(calculated));
    }
  };

  const handleCopyAccount = (acc: string) => {
    navigator.clipboard.writeText(acc);
    sfx.playTap();
    setCopiedAccount(true);
    showToast('Account number copied!', 'info');
    setTimeout(() => setCopiedAccount(false), 2000);
  };

  const handleWithdraw = () => {
    if (!user.bankAccount || !user.bankAccount.accountNumber) {
      showToast('Please bind your receiving Bank Card first', 'error');
      setCurrentView('bank');
      return;
    }

    if (numAmount < (adminSettings.minWithdraw || 150)) {
      showToast(`Minimum withdrawal amount is ₹${adminSettings.minWithdraw || 150}`, 'error');
      return;
    }

    if (numAmount > adminSettings.maxWithdraw) {
      showToast(`Maximum withdrawal amount is ₹${adminSettings.maxWithdraw}`, 'error');
      return;
    }

    if (numAmount > user.balance) {
      showToast('Insufficient balance for withdrawal', 'error');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const res = requestWithdrawal(numAmount, 'bank');
      if (res.success) {
        sfx.playSuccess();
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.7 }
        });
        setWithdrawAmount('');
        navigateToTransactions('withdraw');
      } else {
        sfx.playTap();
        showToast(res.message, 'error');
      }
    }, 600);
  };

  const handleCancelPending = (txId: string) => {
    setCancellingId(txId);
    setTimeout(() => {
      cancelWithdrawal(txId);
      setCancellingId(null);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-[#f4f6f8] pb-32 animate-fade-in font-sans">
      {/* Top App Bar */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-100 sticky top-0 z-20 shadow-2xs">
        <button
          id="withdraw-back-btn"
          onClick={() => setCurrentView('profile')}
          className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 hover:bg-gray-200 active:scale-95 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="text-center">
          <h1 className="text-sm font-black text-gray-900 tracking-tight">
            Withdrawal Card System
          </h1>
          <span className="text-[10px] text-emerald-600 font-bold block">
            Instant IMPS / RTGS Direct Clearance
          </span>
        </div>

        <button
          onClick={() => navigateToTransactions('withdraw')}
          className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 cursor-pointer hover:bg-emerald-100 active:scale-95 transition-all"
        >
          Record
        </button>
      </div>

      <div className="p-3.5 space-y-3.5 max-w-md mx-auto">
        {/* CARD 1: Bound Bank ATM/Debit Card */}
        {user.bankAccount && user.bankAccount.accountNumber ? (
          <div
            id="receiving-bank-card"
            className="relative rounded-3xl p-5 text-white overflow-hidden shadow-xl border border-slate-700/80 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#090d16]"
          >
            {/* Background grid */}
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)',
                backgroundSize: '14px 14px'
              }}
            />

            {/* Glowing orbs */}
            <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-blue-500/20 blur-2xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-emerald-500/15 blur-2xl pointer-events-none" />

            {/* Card Top: Bank Name, Chip & Change Bank */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-emerald-400 border border-white/10">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-black tracking-wider uppercase text-white block">
                    {user.bankAccount.bankName || 'State Bank of India'}
                  </span>
                  <span className="text-[9px] text-gray-400 font-mono">
                    IFSC: {user.bankAccount.ifsc || 'SBIN0001234'}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setCurrentView('bank')}
                className="text-[10px] font-bold text-emerald-300 bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-full border border-white/20 transition-all cursor-pointer active:scale-95"
              >
                Manage
              </button>
            </div>

            {/* Card Middle: EMV Chip + Masked Account Number */}
            <div className="relative z-10 my-4 flex items-center justify-between">
              {/* Gold Chip Graphic */}
              <div className="w-10 h-7 rounded-md bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 p-0.5 shadow-md flex items-center justify-center relative overflow-hidden border border-amber-300/60">
                <div className="w-full h-full border border-amber-800/30 rounded-xs flex items-center justify-center">
                  <div className="w-4 h-3.5 border-t border-b border-amber-900/40 rounded-xs relative">
                    <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-amber-900/40" />
                  </div>
                </div>
              </div>

              {/* Contactless symbol */}
              <span className="text-xs font-mono text-gray-400">((•))</span>
            </div>

            {/* Embossed Account Number */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="font-mono text-base tracking-widest text-white font-bold drop-shadow-sm">
                •••• •••• {user.bankAccount.accountNumber.slice(-4)}
              </div>
              <button
                onClick={() => handleCopyAccount(user.bankAccount!.accountNumber)}
                className="text-[10px] text-gray-300 hover:text-white bg-black/30 px-2 py-0.5 rounded flex items-center space-x-1 cursor-pointer"
              >
                {copiedAccount ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedAccount ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* Card Bottom: Holder Name and Verified Status */}
            <div className="relative z-10 mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between">
              <div>
                <span className="text-[8px] uppercase tracking-widest text-gray-400 block">
                  Account Holder
                </span>
                <span className="text-xs font-bold text-gray-200 tracking-wide">
                  {user.bankAccount.actualName || user.name}
                </span>
              </div>

              <div className="flex items-center space-x-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 rounded-full text-[9px] font-bold">
                <ShieldCheck className="w-3 h-3" />
                <span>Verified IMPS Node</span>
              </div>
            </div>
          </div>
        ) : (
          /* Unlinked Bank Card Prompt */
          <div
            onClick={() => setCurrentView('bank')}
            className="p-4 bg-amber-50/90 border-2 border-dashed border-amber-300 rounded-3xl flex items-center justify-between cursor-pointer hover:bg-amber-100/70 transition-all shadow-xs"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-amber-950 block">
                  No Bank Card Bound Yet
                </span>
                <span className="text-[10.5px] text-amber-700">
                  Click here to link your receiving bank account details
                </span>
              </div>
            </div>
            <div className="text-xs font-bold text-amber-800 bg-white px-3 py-1 rounded-xl border border-amber-300">
              + Link Card
            </div>
          </div>
        )}

        {/* CARD 2: Available Withdrawable Balance & Quota Card */}
        <div className="bg-gradient-to-r from-[#00ba58] via-[#00a84e] to-[#008f42] text-white p-4 rounded-2xl shadow-md relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white">
                <Wallet className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-emerald-100">
                Available Withdrawable Balance
              </span>
            </div>

            <div className="flex items-center space-x-1.5 bg-black/25 px-2.5 py-1 rounded-full text-[10px] font-mono border border-white/10">
              <ShieldCheck className="w-3 h-3 text-emerald-300" />
              <span className="text-emerald-100 font-bold">100% Liquid</span>
            </div>
          </div>

          <div className="text-3xl font-black mt-2 tracking-tight tabular-nums font-mono">
            {formatINR(user.balance)}
          </div>

          <div className="mt-3 pt-2.5 border-t border-white/15 flex items-center justify-between text-[11px]">
            <span className="text-emerald-100">
              Daily Payout Quota: <b className="text-white font-mono">₹{formatINR(remainingQuota)}</b> / ₹50,000 Left
            </span>
            <span className="text-[10px] bg-black/20 text-emerald-200 px-2 py-0.5 rounded-full">
              Zero Tax
            </span>
          </div>

          <div className="w-full h-1.5 bg-black/25 rounded-full overflow-hidden mt-1.5">
            <div
              className="h-full bg-amber-300 rounded-full transition-all duration-500"
              style={{ width: `${Math.max(5, 100 - quotaPercent)}%` }}
            />
          </div>
        </div>

        {/* CARD 3: Clearance Speed Mode Cards */}
        <div className="bg-white p-3.5 rounded-2xl border border-gray-100 shadow-xs space-y-2">
          <div className="text-xs font-bold text-gray-800">
            Select Clearance Channel Speed
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                sfx.playTap();
                setWithdrawSpeed('express');
              }}
              className={`p-2.5 rounded-xl border-2 text-left cursor-pointer transition-all ${
                withdrawSpeed === 'express'
                  ? 'border-[#00ba58] bg-emerald-50/60 shadow-2xs ring-2 ring-emerald-500/20'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-900">⚡ Express IMPS</span>
                <span className="text-[9px] bg-emerald-100 text-emerald-800 font-extrabold px-1.5 py-0.5 rounded">
                  VIP 15m
                </span>
              </div>
              <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">
                5 – 15 Minutes Direct
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                sfx.playTap();
                setWithdrawSpeed('standard');
              }}
              className={`p-2.5 rounded-xl border-2 text-left cursor-pointer transition-all ${
                withdrawSpeed === 'standard'
                  ? 'border-[#00ba58] bg-emerald-50/60 shadow-2xs ring-2 ring-emerald-500/20'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-900">🏦 Standard RTGS</span>
                <span className="text-[9px] bg-gray-100 text-gray-700 font-bold px-1.5 py-0.5 rounded">
                  Batch
                </span>
              </div>
              <div className="text-[10px] text-gray-500 mt-0.5">
                1 – 2 Business Hours
              </div>
            </button>
          </div>
        </div>

        {/* CARD 4: Active Pending Withdrawal Tracker Card */}
        {pendingWithdrawals.length > 0 && (
          <div className="bg-amber-50/80 border border-amber-300/80 p-3.5 rounded-2xl shadow-xs space-y-3 animate-fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                <span className="text-xs font-bold text-amber-900">Live Clearance Status</span>
              </div>
              <span className="text-[10px] bg-amber-200 text-amber-900 font-extrabold px-2 py-0.5 rounded-full">
                Processing Order
              </span>
            </div>

            {/* 3-Step Progress Timeline */}
            <div className="grid grid-cols-3 gap-1 pt-1 text-center">
              <div className="flex flex-col items-center">
                <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold">
                  ✓
                </div>
                <span className="text-[9px] font-bold text-gray-800 mt-1">Submitted</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-[10px] font-bold animate-pulse">
                  ⟳
                </div>
                <span className="text-[9px] font-bold text-amber-800 mt-1">Bank Node</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-5 h-5 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-[10px] font-bold">
                  3
                </div>
                <span className="text-[9px] font-bold text-gray-400 mt-1">Cash Credited</span>
              </div>
            </div>

            {pendingWithdrawals.map((pw) => (
              <div key={pw.id} className="bg-white p-2.5 rounded-xl border border-amber-200 flex items-center justify-between">
                <div>
                  <div className="text-xs font-black text-gray-900">
                    {formatINR(pw.amount)}
                  </div>
                  <div className="text-[10px] text-gray-500 mt-0.5">
                    Order {pw.id} · {pw.createdAt}
                  </div>
                </div>

                <button
                  type="button"
                  disabled={cancellingId === pw.id}
                  onClick={() => handleCancelPending(pw.id)}
                  className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 text-[10px] font-bold rounded-lg border border-rose-200 flex items-center space-x-1 cursor-pointer active:scale-95 transition-all"
                >
                  <RotateCcw className={`w-3 h-3 ${cancellingId === pw.id ? 'animate-spin' : ''}`} />
                  <span>Cancel / Refund</span>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* CARD 5: Withdrawal Amount & Percentage Cards */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs space-y-3">
          <div className="text-xs font-bold text-gray-800">
            Withdrawal Amount
          </div>

          {/* Amount Display with Bank Icon on Right */}
          <div className="flex items-center justify-between py-1 border-b border-gray-100">
            <div className="flex items-center space-x-1 w-full">
              <span className="text-3xl font-black text-[#00ba58]">₹</span>
              <input
                type="number"
                value={withdrawAmount}
                onChange={(e) => {
                  setWithdrawAmount(e.target.value);
                  setSelectedPercentage(null);
                }}
                className="text-3xl font-black text-[#00ba58] w-full focus:outline-none tabular-nums font-mono bg-transparent"
                placeholder="0"
              />
            </div>

            <button
              onClick={() => setCurrentView('bank')}
              className="w-9 h-9 rounded-full bg-emerald-50 text-[#00ba58] flex items-center justify-center hover:bg-emerald-100 active:scale-95 transition-all cursor-pointer shadow-2xs shrink-0"
              title="Bank Account Details"
            >
              <Building2 className="w-5 h-5" />
            </button>
          </div>

          {/* Minimum Withdrawal Notice */}
          <div className="bg-emerald-50 text-emerald-800 text-xs py-2 px-3 rounded-xl flex items-center space-x-2 border border-emerald-100 font-medium">
            <Info className="w-4 h-4 text-[#00ba58] shrink-0" />
            <span>Minimum withdrawal: ₹{adminSettings.minWithdraw || 150}</span>
          </div>

          {/* 4 Percentage Cards (25%, 50%, 75%, Max) */}
          <div className="grid grid-cols-4 gap-2 pt-1">
            {[25, 50, 75, 100].map((pct) => {
              const isSelected = selectedPercentage === pct;
              const label = pct === 100 ? 'Max' : `${pct}%`;
              return (
                <button
                  key={pct}
                  type="button"
                  onClick={() => handleSelectPercentage(pct)}
                  className={`relative py-2.5 px-1 rounded-xl text-xs font-bold text-center transition-all cursor-pointer select-none active:scale-95 ${
                    isSelected
                      ? 'border-2 border-[#00ba58] bg-emerald-50/70 text-[#00ba58] font-extrabold shadow-2xs ring-2 ring-emerald-500/20'
                      : 'border border-gray-200 bg-white text-gray-800 hover:border-gray-300'
                  }`}
                >
                  <span>{label}</span>

                  {isSelected && (
                    <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#00ba58] rounded-full flex items-center justify-center text-white shadow-xs border border-white">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Withdrawal Trade Password */}
          <div className="pt-2">
            <div className="flex items-center space-x-2.5 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 focus-within:border-[#00ba58] focus-within:bg-white transition-all">
              <Lock className="w-4 h-4 text-[#00ba58] shrink-0" />
              <input
                type="password"
                placeholder="Enter withdrawal security password"
                value={tradePassword}
                onChange={(e) => setTradePassword(e.target.value)}
                className="w-full bg-transparent text-xs text-gray-800 focus:outline-none font-medium placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Calculations Box */}
          <div className="bg-gray-50/80 p-3 rounded-xl space-y-1.5 text-xs text-gray-600 border border-gray-100">
            <div className="flex items-center justify-between">
              <span>Handling Fee ({taxPercent.toFixed(2)}%):</span>
              <span className="font-semibold text-gray-800 tabular-nums">
                ₹{taxAmount.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-gray-200/60 font-bold">
              <span className="text-gray-800">You Receive:</span>
              <span className="text-sm font-extrabold text-[#00ba58] tabular-nums font-mono">
                ₹{netReceived.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Instructions Accordion */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setShowInstructions(!showInstructions)}
              className="w-full flex items-center justify-between text-xs font-bold text-gray-800 hover:text-emerald-700 transition-colors py-1 cursor-pointer"
            >
              <div className="flex items-center space-x-1">
                <span className="text-[#00ba58] font-bold text-sm">›</span>
                <span>Withdrawal Instructions</span>
              </div>
              {showInstructions ? (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-400" />
              )}
            </button>

            {showInstructions && (
              <div className="mt-2 text-[11px] text-gray-500 space-y-1.5 bg-gray-50/60 p-3 rounded-xl border border-gray-100 animate-fade-in leading-relaxed">
                <div className="flex items-start space-x-1.5">
                  <span className="font-bold text-gray-700">1.</span>
                  <span>Withdrawal window: 07:00 – 18:00 daily</span>
                </div>
                <div className="flex items-start space-x-1.5">
                  <span className="font-bold text-gray-700">2.</span>
                  <span>Minimum withdrawal amount: ₹{adminSettings.minWithdraw || 150}</span>
                </div>
                <div className="flex items-start space-x-1.5">
                  <span className="font-bold text-gray-700">3.</span>
                  <span>Handling fee: {taxPercent.toFixed(2)}%</span>
                </div>
                <div className="flex items-start space-x-1.5">
                  <span className="font-bold text-gray-700">4.</span>
                  <span>Payout is routed directly to your bound bank account via IMPS node.</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sticky Bottom Action Button */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-3.5 bg-white/95 backdrop-blur-md border-t border-gray-100 z-30 shadow-lg">
        <button
          id="withdraw-submit-btn"
          disabled={isSubmitting || numAmount <= 0}
          onClick={handleWithdraw}
          className={`w-full py-3.5 rounded-2xl text-white font-black text-sm flex items-center justify-center space-x-2 active:scale-98 transition-all cursor-pointer shadow-md tracking-wide ${
            isSubmitting || numAmount <= 0
              ? 'bg-gray-300 cursor-not-allowed opacity-60 shadow-none'
              : 'btn-chamkila shadow-lg shadow-emerald-500/25 hover:brightness-110'
          }`}
        >
          {isSubmitting ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Routing Payout to Bank Card...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-amber-300">
                <Coins className="w-3.5 h-3.5 fill-amber-300" />
              </div>
              <span className="drop-shadow-xs">
                Withdraw to Bank Now
              </span>
            </div>
          )}
        </button>
      </div>
    </div>
  );
};
