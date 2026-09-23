import React, { useState } from 'react';
import {
  ArrowLeft,
  Building2,
  Check,
  Coins,
  CreditCard,
  Headphones,
  HelpCircle,
  Info,
  Lock,
  RotateCcw,
  ShieldCheck,
  Wallet,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { sfx } from '../utils/sound';
import { formatINR } from '../utils/currency';
import { ServiceModal } from '../components/ServiceModal';

export const WithdrawView: React.FC = () => {
  const {
    user,
    setCurrentView,
    goBack,
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
  const [showRulesModal, setShowRulesModal] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [showServiceModal, setShowServiceModal] = useState<boolean>(false);

  const numAmount = parseFloat(withdrawAmount) || 0;
  const taxPercent = adminSettings.withdrawFeePercent || 0;
  const taxAmount = Math.round(((numAmount * taxPercent) / 100) * 100) / 100;
  const netReceived = Math.max(0, numAmount - taxAmount);

  // Active pending withdrawal if any (strictly scoped to current user)
  const pendingWithdrawals = transactions.filter(
    (t) => t.userId === user.id && t.type === 'withdraw' && t.status === 'pending'
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

  const handleWithdraw = () => {
    if (!user.bankAccount || !user.bankAccount.accountNumber) {
      showToast('Please bind your receiving Bank Card first', 'error');
      setCurrentView('bank');
      return;
    }

    if (numAmount < (adminSettings.minWithdraw || 150)) {
      showToast(`Minimum withdrawal is ₹${adminSettings.minWithdraw || 150}`, 'error');
      return;
    }

    if (numAmount > adminSettings.maxWithdraw) {
      showToast(`Maximum withdrawal is ₹${adminSettings.maxWithdraw}`, 'error');
      return;
    }

    if (numAmount > user.balance) {
      showToast('Insufficient balance for withdrawal', 'error');
      return;
    }

    if (user.tradePassword && tradePassword.trim()) {
      if (tradePassword.trim() !== user.tradePassword) {
        showToast('Incorrect withdrawal security password', 'error');
        return;
      }
    } else if (user.tradePassword && !tradePassword.trim()) {
      showToast('Please enter your withdrawal security password', 'error');
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
          origin: { y: 0.5 }
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
    <div className="h-[100dvh] max-h-screen bg-[#f4f6f8] font-sans max-w-md mx-auto flex flex-col justify-between overflow-hidden select-none">
      {/* 1. Top Bar (Compact, 48px) */}
      <div className="h-12 px-3.5 bg-white border-b border-gray-100 flex items-center justify-between shrink-0 shadow-2xs">
        <button
          id="withdraw-back-btn"
          onClick={goBack}
          className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 hover:bg-gray-200 active:scale-95 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="text-center">
          <h1 className="text-xs font-black text-gray-900 uppercase tracking-wider leading-none">
            Withdraw Funds
          </h1>
          <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">
            Direct Bank IMPS Channel
          </span>
        </div>

        <div className="flex items-center space-x-1">
          <button
            type="button"
            onClick={() => setShowRulesModal(true)}
            className="w-7 h-7 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 flex items-center justify-center cursor-pointer active:scale-95"
            title="Rules"
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => setShowServiceModal(true)}
            className="text-[11px] font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-full flex items-center space-x-1 cursor-pointer active:scale-95"
            title="Service Desk"
          >
            <Headphones className="w-3 h-3 text-emerald-600" />
            <span>Help</span>
          </button>

          <button
            onClick={() => navigateToTransactions('withdraw')}
            className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-200 cursor-pointer hover:bg-emerald-100 active:scale-95"
          >
            Record
          </button>
        </div>
      </div>

      {/* 2. Middle Content: Perfectly fitted for single-screen non-scrollable viewport */}
      <div className="flex-1 p-3 flex flex-col justify-around overflow-hidden">
        {/* A. Receiving Bank Card Bar */}
        {user.bankAccount && user.bankAccount.accountNumber ? (
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-3 rounded-2xl text-white border border-slate-700/80 shadow-sm flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-emerald-400">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] font-black uppercase text-white block leading-tight">
                  {user.bankAccount.bankName || 'State Bank of India'}
                </span>
                <span className="text-[10px] text-gray-300 font-mono leading-tight">
                  •••• {user.bankAccount.accountNumber.slice(-4)} · {user.bankAccount.actualName || user.name}
                </span>
              </div>
            </div>

            <button
              onClick={() => setCurrentView('bank')}
              className="text-[10px] font-bold text-emerald-400 bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-full border border-white/20 active:scale-95 cursor-pointer"
            >
              Change
            </button>
          </div>
        ) : (
          <div
            onClick={() => setCurrentView('bank')}
            className="p-2.5 bg-amber-50 border border-dashed border-amber-300 rounded-2xl flex items-center justify-between cursor-pointer hover:bg-amber-100/70 active:scale-98 transition-all"
          >
            <div className="flex items-center space-x-2">
              <Building2 className="w-5 h-5 text-amber-600" />
              <span className="text-xs font-bold text-amber-900">
                No Bank Card Bound Yet
              </span>
            </div>
            <span className="text-[10px] font-bold text-amber-800 bg-white px-2 py-0.5 rounded-lg border border-amber-300">
              + Link Card
            </span>
          </div>
        )}

        {/* B. Withdrawable Balance Bar */}
        <div className="bg-gradient-to-r from-[#00ba58] to-[#009b49] text-white px-3.5 py-2.5 rounded-2xl shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] text-emerald-100 block font-medium leading-none">
              Withdrawable Balance
            </span>
            <div className="text-lg font-black font-mono tracking-tight leading-tight mt-0.5">
              {formatINR(user.balance)}
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] bg-black/20 text-emerald-100 font-bold px-2 py-0.5 rounded-full inline-block">
              Daily Limit: ₹50,000
            </span>
          </div>
        </div>

        {/* C. Amount Input & Quick Percentage Chips */}
        <div className="bg-white p-3 rounded-2xl border border-gray-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-gray-800">
            <span>Withdrawal Amount</span>
            <span className="text-[10px] text-gray-500">
              Min: ₹{adminSettings.minWithdraw || 150}
            </span>
          </div>

          {/* Amount input */}
          <div className="flex items-center space-x-1.5 py-1 border-b-2 border-emerald-500/30 focus-within:border-[#00ba58] transition-colors">
            <span className="text-2xl font-black text-[#00ba58]">₹</span>
            <input
              type="number"
              value={withdrawAmount}
              onChange={(e) => {
                setWithdrawAmount(e.target.value);
                setSelectedPercentage(null);
              }}
              className="text-2xl font-black text-[#00ba58] w-full focus:outline-none tabular-nums font-mono bg-transparent"
              placeholder="0"
            />
          </div>

          {/* 4 Percentage Chips */}
          <div className="grid grid-cols-4 gap-1.5 pt-0.5">
            {[25, 50, 75, 100].map((pct) => {
              const isSelected = selectedPercentage === pct;
              const label = pct === 100 ? 'Max' : `${pct}%`;
              return (
                <button
                  key={pct}
                  type="button"
                  onClick={() => handleSelectPercentage(pct)}
                  className={`py-1.5 rounded-xl text-xs font-bold text-center transition-all cursor-pointer select-none active:scale-95 ${
                    isSelected
                      ? 'btn-chamkila text-white font-black shadow-sm'
                      : 'border border-gray-200 bg-white text-gray-700 hover:border-emerald-300 hover:bg-emerald-50/20'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Net Received Calculation */}
          <div className="bg-gray-50 p-2 rounded-xl text-[11px] flex items-center justify-between text-gray-600">
            <span>Fee ({taxPercent}%): ₹{taxAmount.toFixed(2)}</span>
            <span className="font-bold text-gray-900">
              You Receive: <strong className="text-[#00ba58] font-mono font-black">₹{netReceived.toFixed(2)}</strong>
            </span>
          </div>
        </div>

        {/* D. Clearance Speed Selector (Compact 2 columns) */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => {
              sfx.playTap();
              setWithdrawSpeed('express');
            }}
            className={`p-2 rounded-xl border-2 text-left cursor-pointer transition-all ${
              withdrawSpeed === 'express'
                ? 'border-[#00ba58] bg-emerald-50/70 shadow-2xs'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-gray-900">⚡ Express IMPS</span>
              <span className="text-[8px] bg-emerald-100 text-emerald-800 font-extrabold px-1 py-0.5 rounded">
                5-15m
              </span>
            </div>
            <div className="text-[9px] text-emerald-700 font-semibold mt-0.5">
              Direct Automated Payout
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              sfx.playTap();
              setWithdrawSpeed('standard');
            }}
            className={`p-2 rounded-xl border-2 text-left cursor-pointer transition-all ${
              withdrawSpeed === 'standard'
                ? 'border-[#00ba58] bg-emerald-50/70 shadow-2xs'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-gray-900">🏦 Standard RTGS</span>
              <span className="text-[8px] bg-gray-100 text-gray-700 font-bold px-1 py-0.5 rounded">
                Batch
              </span>
            </div>
            <div className="text-[9px] text-gray-500 mt-0.5">
              1-2 Business Hours
            </div>
          </button>
        </div>

        {/* E. Trade Password Input */}
        <div className="bg-white px-3 py-2 rounded-xl border border-gray-200/80 flex items-center space-x-2 focus-within:border-[#00ba58] transition-all">
          <Lock className="w-4 h-4 text-gray-400 shrink-0" />
          <input
            type="password"
            placeholder="Enter withdrawal security password"
            value={tradePassword}
            onChange={(e) => setTradePassword(e.target.value)}
            className="w-full bg-transparent text-xs text-gray-800 focus:outline-none placeholder:text-gray-400"
          />
        </div>

        {/* F. Pending Withdrawal if any */}
        {pendingWithdrawals.length > 0 && (
          <div className="bg-amber-50 border border-amber-300/80 p-2 rounded-xl flex items-center justify-between text-xs">
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-[11px] text-amber-900 font-bold">
                Processing ₹{pendingWithdrawals[0].amount}
              </span>
            </div>
            <button
              onClick={() => handleCancelPending(pendingWithdrawals[0].id)}
              disabled={cancellingId === pendingWithdrawals[0].id}
              className="text-[10px] text-rose-700 font-bold bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-lg active:scale-95"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* 3. Bottom Action Button (Compact) */}
      <div className="p-3 bg-white border-t border-gray-100 shrink-0 shadow-lg">
        <button
          id="withdraw-submit-btn"
          disabled={isSubmitting || numAmount <= 0}
          onClick={handleWithdraw}
          className={`w-full py-3.5 rounded-xl text-white font-black text-sm flex items-center justify-center space-x-2 active:scale-98 transition-all cursor-pointer shadow-md ${
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
            <div className="flex items-center space-x-1.5">
              <Coins className="w-4 h-4 fill-amber-300 text-amber-300" />
              <span>Withdraw to Bank Now</span>
            </div>
          )}
        </button>
      </div>

      {/* Rules Modal */}
      {showRulesModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-4 max-w-xs w-full space-y-3 shadow-xl animate-scale-up">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <h3 className="text-xs font-black text-gray-900 uppercase">Withdrawal Rules</h3>
              <button
                onClick={() => setShowRulesModal(false)}
                className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="text-[11px] text-gray-600 space-y-2">
              <p>1. Daily withdrawal window: 07:00 – 18:00.</p>
              <p>2. Minimum withdrawal amount: ₹{adminSettings.minWithdraw || 150}.</p>
              <p>3. Handling fee: {taxPercent}%. Zero additional hidden charges.</p>
              <p>4. Payout is transferred directly to your bound bank account via IMPS banking channel.</p>
            </div>
            <button
              onClick={() => setShowRulesModal(false)}
              className="w-full py-2 bg-emerald-600 text-white font-bold rounded-xl text-xs active:scale-95"
            >
              Understood
            </button>
          </div>
        </div>
      )}

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
