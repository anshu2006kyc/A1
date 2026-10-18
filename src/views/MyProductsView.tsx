import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
  AlertTriangle,
  ArrowLeft,
  Bell,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Coins,
  History,
  IndianRupee,
  Layers,
  LogIn,
  RotateCcw,
  ShieldCheck,
  Timer,
  TrendingUp,
  Wallet,
  Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { sfx } from '../utils/sound';
import { formatINR } from '../utils/currency';
import { UserPlan } from '../types';
import { sortRecordsNewestFirst, formatRecordDateTime, getRelativeTimeLabel } from '../utils/date';
import { getProductArtworkDataUri } from '../components/ProductArtwork';

export const MyProductsView: React.FC = () => {
  const {
    user,
    userPlans,
    setCurrentView,
    goBack,
    claimPlanProfit,
    claimAllPlanProfits,
    returnPlanCycle,
    showToast,
    isLoggedIn,
    openAuthModal,
    navigateToTransactions,
    isNotificationModalOpen,
    setIsNotificationModalOpen,
    unreadNotificationCount
  } = useApp();

  const [planToReturn, setPlanToReturn] = useState<UserPlan | null>(null);
  const [activeTab, setActiveTab] = useState<'active' | 'completed' | 'all'>('active');

  // STRICT REQUIREMENT: Scoped strictly to current user and sorted with NEWEST on top & OLDEST at bottom
  const myPlans = useMemo(() => {
    const userOnly = userPlans.filter((p) => p.userId === user.id);
    return sortRecordsNewestFirst(userOnly);
  }, [userPlans, user.id]);

  const activePlans = useMemo(() => myPlans.filter((p) => p.status === 'active'), [myPlans]);
  const completedPlans = useMemo(() => myPlans.filter((p) => p.status === 'completed' || p.status === 'returned'), [myPlans]);

  const totalInvested = useMemo(() => myPlans.reduce((sum, p) => sum + p.depositAmount, 0), [myPlans]);
  const dailyIncomeTotal = useMemo(() => activePlans.reduce((sum, p) => sum + p.dailyIncome, 0), [activePlans]);
  const hourlyRunRate = useMemo(() => dailyIncomeTotal / 24, [dailyIncomeTotal]);
  const monthlyProjected = useMemo(() => dailyIncomeTotal * 30, [dailyIncomeTotal]);

  const totalCollectedSoFar = useMemo(() => {
    return myPlans.reduce((sum, p) => sum + (p.daysClaimed * p.dailyIncome), 0);
  }, [myPlans]);

  const remainingReturn = useMemo(() => {
    return activePlans.reduce(
      (sum, p) => sum + Math.max(0, p.totalReturn - p.daysClaimed * p.dailyIncome),
      0
    );
  }, [activePlans]);

  const todayStr = new Date().toISOString().split('T')[0];

  // Realtime clock for live accrual and countdown
  const [currentTime, setCurrentTime] = useState<number>(Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Live Continuous Daily Income Accrual calculation (second-by-second fractional accumulator)
  const [liveAccruedSeed, setLiveAccruedSeed] = useState<number>(0);
  useEffect(() => {
    if (dailyIncomeTotal <= 0) return;
    const now = new Date();
    // Fraction of the day elapsed
    const secondsToday = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
    const dayFraction = secondsToday / 86400;
    setLiveAccruedSeed(dailyIncomeTotal * dayFraction);
  }, [currentTime, dailyIncomeTotal]);

  const isPlanClaimable = (up: UserPlan) => {
    if (up.status !== 'active') return false;
    if (up.durationMinutes) {
      return up.nextClaimTime ? currentTime >= up.nextClaimTime : true;
    }
    return up.lastClaimDate !== todayStr;
  };

  // Eligible to claim now
  const unclaimedPlans = useMemo(() => activePlans.filter(isPlanClaimable), [activePlans, currentTime, todayStr]);
  const claimableAmount = useMemo(() => {
    return unclaimedPlans.reduce(
      (sum, p) => sum + (p.durationMinutes ? p.totalReturn || p.dailyIncome : p.dailyIncome),
      0
    );
  }, [unclaimedPlans]);

  // Settlement Countdown (Time to next midnight for daily plans)
  const [timeLeft, setTimeLeft] = useState<{ h: number; m: number; s: number }>({ h: 0, m: 0, s: 0 });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      const diff = Math.max(0, Math.floor((midnight.getTime() - now.getTime()) / 1000));
      const h = Math.floor(diff / 3600);
      const m = Math.floor((diff % 3600) / 60);
      const s = diff % 60;
      setTimeLeft({ h, m, s });
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleClaimSingle = (id: string, income: number) => {
    if (!isLoggedIn || !user.id || user.id <= 0) {
      showToast('Kripya profit collect karne ke liye pehle Login karein', 'info');
      openAuthModal('login');
      return;
    }
    sfx.playSuccess();
    claimPlanProfit(id);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 }
    });
  };

  const handleClaimAll = () => {
    if (!isLoggedIn || !user.id || user.id <= 0) {
      showToast('Kripya profit collect karne ke liye pehle Login karein', 'info');
      openAuthModal('login');
      return;
    }
    if (unclaimedPlans.length === 0) return;
    sfx.playSuccess();
    claimAllPlanProfits();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const displayedPlans = useMemo(() => {
    if (activeTab === 'active') return activePlans;
    if (activeTab === 'completed') return completedPlans;
    return myPlans;
  }, [activeTab, activePlans, completedPlans, myPlans]);

  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-28 animate-fade-in font-sans">
      {/* Top Header */}
      <div className="bg-white px-4 py-3.5 flex items-center justify-between border-b border-gray-100 sticky top-0 z-20 shadow-2xs">
        <button
          id="products-back-btn"
          onClick={goBack}
          className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 hover:bg-gray-200 active:scale-95 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center space-x-1.5">
          <TrendingUp className="w-4 h-4 text-emerald-600" />
          <h1 className="text-base font-bold text-gray-900 tracking-tight">
            Automated Income Engine
          </h1>
        </div>

        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => {
              sfx.playTap();
              setIsNotificationModalOpen(true);
            }}
            title="Interest & Payout Alerts"
            className="w-8 h-8 rounded-full bg-amber-50 text-amber-700 hover:bg-amber-100 flex items-center justify-center active:scale-95 transition-all cursor-pointer border border-amber-200/60 relative"
          >
            <Bell className="w-3.5 h-3.5" />
            {unreadNotificationCount > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-400 text-slate-950 font-black text-[8px] rounded-full flex items-center justify-center ring-1 ring-white shadow-xs animate-pulse">
                {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
              </span>
            )}
          </button>

          <button
            onClick={() => navigateToTransactions('revenue')}
            title="Income Records"
            className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-100 flex items-center justify-center active:scale-95 transition-all cursor-pointer border border-emerald-200/60"
          >
            <History className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="p-3.5 space-y-3.5">
        {!isLoggedIn && (
          <div className="bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-teal-500/10 border border-emerald-500/30 rounded-2xl p-3 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                <LogIn className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-gray-900">Guest Mode (Logged Out)</div>
                <div className="text-[10px] text-gray-500">Sign in to view your real-time machine income & claim dividends.</div>
              </div>
            </div>
            <button
              onClick={() => openAuthModal('login')}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shrink-0 cursor-pointer shadow-xs active:scale-95 transition-all"
            >
              Sign In
            </button>
          </div>
        )}

        {/* Chamkila Master Income Overview Card */}
        <div
          className="text-white p-5 rounded-3xl shadow-lg relative overflow-hidden"
          style={{
            background: 'var(--brand-card-gradient, linear-gradient(135deg, #008f4c 0%, #00a859 50%, #0a6634 100%))'
          }}
        >
          {/* Top Row: Total Invested & Next Settlement Countdown */}
          <div className="flex justify-between items-start relative z-10">
            <div>
              <span className="text-[11px] font-bold text-emerald-100 uppercase tracking-wider flex items-center space-x-1">
                <Wallet className="w-3.5 h-3.5 text-emerald-200" />
                <span>Active Capital Invested</span>
              </span>
              <div className="text-3xl font-black mt-1 tracking-tight tabular-nums font-mono">
                {formatINR(totalInvested)}
              </div>
            </div>

            {/* Next Automated Settlement Countdown */}
            <div className="bg-black/25 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-white/10 text-right">
              <div className="flex items-center space-x-1 text-[9.5px] text-emerald-200 justify-end font-bold">
                <Timer className="w-3 h-3 text-emerald-300" />
                <span>Next Dividend Settlement</span>
              </div>
              <div className="font-mono font-black text-xs text-white tracking-widest mt-0.5">
                {String(timeLeft.h).padStart(2, '0')}:{String(timeLeft.m).padStart(2, '0')}:{String(timeLeft.s).padStart(2, '0')}
              </div>
            </div>
          </div>

          {/* Real-time Continuous Accrual Counter */}
          <div className="mt-4 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/15 relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-emerald-300 animate-ping" />
                <span className="text-[10.5px] font-black uppercase tracking-wider text-emerald-100 flex items-center gap-1">
                  <span>Live Income Accrual Today</span>
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold text-emerald-200">
                Run-Rate: +{formatINR(hourlyRunRate)}/hr
              </span>
            </div>
            <div className="flex items-baseline justify-between mt-1">
              <div className="text-xl font-black font-mono text-white tracking-tight tabular-nums">
                +{formatINR(liveAccruedSeed, { decimals: 2 })}
              </div>
              <span className="text-[10px] font-medium text-emerald-200">
                Guaranteed: +{formatINR(dailyIncomeTotal)}/day
              </span>
            </div>
          </div>

          {/* 3 Metrics Bottom Grid */}
          <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-emerald-400/30 text-center relative z-10">
            <div>
              <span className="text-[9.5px] text-emerald-200 font-bold block uppercase">DAILY RUN-RATE</span>
              <span className="text-sm font-black text-white mt-0.5 block tabular-nums font-mono">
                {formatINR(dailyIncomeTotal)}
              </span>
            </div>

            <div>
              <span className="text-[9.5px] text-emerald-200 font-bold block uppercase">30-DAY FORECAST</span>
              <span className="text-sm font-black text-white mt-0.5 block tabular-nums font-mono">
                {formatINR(monthlyProjected)}
              </span>
            </div>

            <div>
              <span className="text-[9.5px] text-emerald-200 font-bold block uppercase">REMAINING TARGET</span>
              <span className="text-sm font-black text-white mt-0.5 block tabular-nums font-mono">
                {formatINR(remainingReturn)}
              </span>
            </div>
          </div>
        </div>

        {/* Claim All Banner Button if multiple are claimable */}
        {unclaimedPlans.length > 0 && (
          <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 text-slate-950 p-3.5 rounded-2xl shadow-lg shadow-amber-500/20 flex items-center justify-between animate-scale-up border border-amber-300">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/30 flex items-center justify-center shrink-0">
                <Coins className="w-5 h-5 text-slate-950" />
              </div>
              <div>
                <div className="text-[11px] font-black uppercase tracking-wider text-slate-950">
                  ⚡ Unclaimed Dividends Ready
                </div>
                <div className="text-sm font-black text-slate-950 mt-0.5 tabular-nums font-mono">
                  {formatINR(claimableAmount)} Ready to Collect
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleClaimAll}
              className="py-2 px-3.5 btn-chamkila-gold text-amber-950 font-black text-xs rounded-xl shadow-md active:scale-95 transition-all cursor-pointer flex items-center space-x-1.5"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Collect All</span>
            </button>
          </div>
        )}

        {/* Tab Filters: Active Packages, Completed, All */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-2">
          <div className="flex space-x-1.5">
            {[
              { id: 'active', label: 'Active Packages', count: activePlans.length },
              { id: 'completed', label: 'Settled / Matured', count: completedPlans.length },
              { id: 'all', label: 'All Investments', count: myPlans.length }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  sfx.playTap();
                  setActiveTab(tab.id as any);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1 ${
                  activeTab === tab.id
                    ? 'btn-chamkila text-white shadow-xs'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[9.5px] px-1.5 py-0.2 rounded-full font-mono ml-0.5 ${activeTab === tab.id ? 'bg-white/25 text-white' : 'bg-gray-100 text-gray-500'}`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Empty State vs Active Plans List */}
        {displayedPlans.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm text-center flex flex-col items-center my-4">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 shadow-inner">
              <IndianRupee className="w-8 h-8" />
            </div>

            <h3 className="text-sm font-bold text-gray-900">No Packages in this Tab</h3>
            <p className="text-xs text-gray-500 mt-1 max-w-[260px]">
              {activeTab === 'active'
                ? "You don't have active machines right now. Subscribe to a plan to start automated daily earnings!"
                : 'No matured packages found in this category.'}
            </p>

            <button
              id="browse-plans-btn"
              onClick={() => setCurrentView('home')}
              className="mt-4 py-2.5 px-5 rounded-2xl btn-chamkila text-white font-bold text-xs shadow-md shadow-emerald-600/30 active:scale-95 transition-all cursor-pointer"
            >
              Browse Daily Income Plans
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {displayedPlans.map((up, idx) => {
              const isTurbo = Boolean(up.durationMinutes);
              const isReady = isTurbo
                ? (up.nextClaimTime ? currentTime >= up.nextClaimTime : true)
                : up.lastClaimDate !== todayStr;

              const remainingMs = isTurbo
                ? Math.max(0, (up.nextClaimTime || 0) - currentTime)
                : 0;

              const totalMs = isTurbo ? (up.durationMinutes || 1) * 60 * 1000 : 1;
              const elapsedMs = Math.max(0, totalMs - remainingMs);
              const turboProgressPct = up.status === 'completed' ? 100 : Math.min(100, Math.round((elapsedMs / totalMs) * 100));
              const dailyProgressPct = Math.min(100, Math.round((up.daysClaimed / up.returnDays) * 100));
              const progressPct = isTurbo ? turboProgressPct : dailyProgressPct;

              const profitAmount = isTurbo ? up.totalReturn || up.dailyIncome : up.dailyIncome;

              return (
                <div
                  key={`${up.id || 'up'}-${idx}`}
                  className="bg-white p-4 rounded-3xl border border-gray-100 hover:border-gray-200 shadow-2xs space-y-3 transition-all relative"
                >

                  {/* Header: Title, Image, Status Badge */}
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-2.5">
                      {(() => {
                        const img = (!up.imageUrl || up.imageUrl.includes('unsplash.com'))
                          ? getProductArtworkDataUri(up.planId || up.id, up.durationMinutes ? 'turbo' : 'normal')
                          : up.imageUrl;
                        return (
                          <img
                            src={img}
                            alt={up.title}
                            referrerPolicy="no-referrer"
                            className="w-11 h-11 rounded-2xl object-cover shrink-0 border border-emerald-300/60 bg-zinc-950 shadow-xs"
                          />
                        );
                      })()}
                      <div>
                        <div className="text-xs font-bold text-gray-900 flex items-center space-x-1">
                          <span>{up.title}</span>
                          {isTurbo && (
                            <span className="text-[9px] font-extrabold bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded border border-amber-300">
                              ⚡ {up.durationMinutes === 60 ? '1 Hour' : `${up.durationMinutes}m`}
                            </span>
                          )}
                        </div>
                        <span className="text-[8.5px] text-gray-400 font-mono block mt-0.5">
                          Purchased: {formatRecordDateTime(up.purchasedAt)}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`text-[9.5px] font-bold px-2 py-0.5 rounded-full ${
                        up.status === 'active'
                          ? isTurbo
                            ? 'bg-amber-100 text-amber-900 font-extrabold border border-amber-300'
                            : 'bg-emerald-100 text-emerald-800'
                          : up.status === 'returned'
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {up.status === 'active'
                        ? isTurbo
                          ? '⚡ Accruing'
                          : 'Active & Earning'
                        : up.status === 'returned'
                        ? '↩ Plan Liquidated'
                        : 'Completed'}
                    </span>
                  </div>

                  {/* Plan Return Info Bar */}
                  <div className="flex items-center justify-between text-[11px] text-gray-500 bg-gray-50/80 px-3 py-1.5 rounded-xl border border-gray-100">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Tenure:</span>
                      <strong className="text-gray-900 font-mono">
                        {isTurbo
                          ? up.durationMinutes === 60
                            ? '1 Hour'
                            : `${up.durationMinutes} Minutes`
                          : `${up.returnDays} Days`}
                      </strong>
                    </span>
                    <span>
                      Settled: <strong className="text-gray-900 font-mono">{isTurbo ? (up.status === 'completed' ? 'Settled' : 'In Progress') : `${up.daysClaimed}/${up.returnDays} Days`}</strong>
                    </span>
                  </div>

                  {/* Metrics Row */}
                  <div className="grid grid-cols-3 gap-2 bg-gray-50 p-2.5 rounded-2xl text-center text-xs">
                    <div>
                      <span className="text-[9px] text-gray-400 block uppercase">Deposit</span>
                      <span className="font-bold text-gray-800 tabular-nums font-mono">{formatINR(up.depositAmount)}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-gray-400 block uppercase">
                        {isTurbo ? 'Plan Return' : 'Daily Income'}
                      </span>
                      <span className="font-extrabold text-emerald-600 tabular-nums font-mono">{formatINR(up.dailyIncome)}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-gray-400 block uppercase">Total Return</span>
                      <span className="font-extrabold text-emerald-700 tabular-nums font-mono">{formatINR(up.totalReturn)}</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                      <span>Cycle Lifecycle</span>
                      <span className="font-bold text-gray-900">{progressPct}%</span>
                    </div>
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${progressPct}%`,
                          background: 'var(--brand-chamkila-gradient, linear-gradient(90deg, #00d26a, #00ba58))'
                        }}
                      />
                    </div>
                  </div>

                  {/* Action Buttons for Plan */}
                  {up.status === 'active' && (
                    <div className="pt-1 flex items-center justify-between space-x-2">
                      {isReady ? (
                        <button
                          type="button"
                          onClick={() => handleClaimSingle(up.id, profitAmount)}
                          className="flex-1 py-2 px-3 rounded-xl btn-chamkila text-white font-black text-xs shadow-md active:scale-95 transition-all cursor-pointer flex items-center justify-center space-x-1.5"
                        >
                          <Coins className="w-4 h-4" />
                          <span>Collect Profit ({formatINR(profitAmount)})</span>
                        </button>
                      ) : (
                        <div className="flex-1 py-2 px-3 rounded-xl bg-gray-100 text-gray-500 text-xs font-bold text-center flex items-center justify-center space-x-1.5">
                          <Clock className="w-3.5 h-3.5 text-gray-400" />
                          <span>
                            {isTurbo
                              ? remainingMs > 0
                                ? `Settling in ${Math.ceil(remainingMs / 1000)}s...`
                                : 'Settling now...'
                              : "Today's income credited"}
                          </span>
                        </div>
                      )}

                      {/* Early Return / Refund Option */}
                      <button
                        type="button"
                        onClick={() => setPlanToReturn(up)}
                        title="Early Capital Refund"
                        className="py-2 px-2.5 rounded-xl border border-gray-200 text-gray-500 hover:text-rose-600 hover:border-rose-300 text-[11px] font-bold transition-all active:scale-95 cursor-pointer flex items-center space-x-1"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Refund</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Early Return Confirmation Modal */}
      {planToReturn && createPortal(
        <div
          onClick={() => setPlanToReturn(null)}
          className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl border border-gray-100 space-y-3.5 text-center"
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-100">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-base font-black text-gray-900">
              Return Plan Early?
            </h3>

            <p className="text-xs text-gray-500 leading-relaxed">
              Are you sure you want to exit <strong>{planToReturn.title}</strong>? Your principal capital of{' '}
              <strong className="text-gray-900 font-mono">{formatINR(planToReturn.depositAmount)}</strong> will be credited back to your balance immediately, and future daily dividends will stop.
            </p>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => setPlanToReturn(null)}
                className="py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs cursor-pointer active:scale-95 transition-all"
              >
                Keep Earning
              </button>

              <button
                type="button"
                onClick={() => {
                  returnPlanCycle(planToReturn.id);
                  setPlanToReturn(null);
                }}
                className="py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs cursor-pointer active:scale-95 transition-all shadow-sm"
              >
                Confirm Exit
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
