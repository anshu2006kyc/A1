import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  AlertTriangle,
  ArrowLeft,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Coins,
  IndianRupee,
  Layers,
  RotateCcw,
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

export const MyProductsView: React.FC = () => {
  const { user, userPlans, setCurrentView, goBack, claimPlanProfit, claimAllPlanProfits, returnPlanCycle, showToast } = useApp();
  const [planToReturn, setPlanToReturn] = useState<UserPlan | null>(null);

  // Scoped strictly to current user's purchased investments
  const myPlans = userPlans.filter((p) => p.userId === user.id);
  const activePlans = myPlans.filter((p) => p.status === 'active');
  const totalInvested = myPlans.reduce((sum, p) => sum + p.depositAmount, 0);
  const dailyIncomeTotal = activePlans.reduce((sum, p) => sum + p.dailyIncome, 0);
  const remainingReturn = activePlans.reduce(
    (sum, p) => sum + Math.max(0, p.totalReturn - p.daysClaimed * p.dailyIncome),
    0
  );

  const todayStr = new Date().toISOString().split('T')[0];

  // Realtime clock for minute-level accuracy
  const [currentTime, setCurrentTime] = useState<number>(Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const isPlanClaimable = (up: (typeof userPlans)[0]) => {
    if (up.status !== 'active') return false;
    if (up.durationMinutes) {
      return up.nextClaimTime ? currentTime >= up.nextClaimTime : true;
    }
    return up.lastClaimDate !== todayStr;
  };

  // Eligible to claim now
  const unclaimedPlans = activePlans.filter(isPlanClaimable);
  const claimableAmount = unclaimedPlans.reduce(
    (sum, p) => sum + (p.durationMinutes ? p.totalReturn || p.dailyIncome : p.dailyIncome),
    0
  );

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
    sfx.playSuccess();
    claimPlanProfit(id);
    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.8 }
    });
  };

  const handleClaimAll = () => {
    if (unclaimedPlans.length === 0) return;
    sfx.playSuccess();
    claimAllPlanProfits();
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-28 animate-fade-in">
      {/* Top Navigation */}
      <div className="bg-white px-4 py-3.5 flex items-center justify-between border-b border-gray-100 sticky top-0 z-20">
        <button
          id="products-back-btn"
          onClick={goBack}
          className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 hover:bg-gray-200 active:scale-95 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-base font-bold text-gray-900">My Active Machines</h1>
        <div className="w-9"></div>
      </div>

      <div className="p-4 space-y-4">
        {/* Top Summary Card */}
        <div className="bg-gradient-to-br from-[#00a859] via-[#008f4c] to-[#0a6634] text-white p-5 rounded-3xl shadow-lg relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-semibold text-emerald-100 block">Total Invested</span>
              <div className="text-3xl font-black mt-1 tracking-tight tabular-nums font-mono">
                {formatINR(totalInvested, { decimals: 0 })}
              </div>
            </div>

            {/* Next Settlement Countdown */}
            <div className="bg-black/25 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-white/10 text-right">
              <div className="flex items-center space-x-1 text-[10px] text-emerald-200 justify-end">
                <Timer className="w-3 h-3 text-emerald-300" />
                <span>Next Payout</span>
              </div>
              <div className="font-mono font-black text-xs text-white tracking-widest mt-0.5">
                {String(timeLeft.h).padStart(2, '0')}:{String(timeLeft.m).padStart(2, '0')}:{String(timeLeft.s).padStart(2, '0')}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-emerald-400/30 text-center">
            <div>
              <span className="text-[10px] text-emerald-200 block uppercase">DAILY</span>
              <span className="text-sm font-black text-white mt-0.5 block tabular-nums">
                {formatINR(dailyIncomeTotal, { decimals: 0 })}
              </span>
            </div>

            <div>
              <span className="text-[10px] text-emerald-200 block uppercase">REMAINING</span>
              <span className="text-sm font-black text-white mt-0.5 block tabular-nums">
                {formatINR(remainingReturn, { decimals: 0 })}
              </span>
            </div>

            <div>
              <span className="text-[10px] text-emerald-200 block uppercase">ACTIVE</span>
              <span className="text-sm font-black text-white mt-0.5 block">
                {activePlans.length}/{myPlans.length}
              </span>
            </div>
          </div>
        </div>

        {/* Claim All Banner Button if multiple are claimable */}
        {unclaimedPlans.length > 0 && (
          <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 p-4 rounded-2xl shadow-lg shadow-amber-500/20 flex items-center justify-between animate-scale-up">
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-slate-900">
                ⚡ Unclaimed Dividends
              </div>
              <div className="text-sm font-black text-slate-950 mt-0.5 tabular-nums font-mono">
                {formatINR(claimableAmount, { decimals: 0 })} Ready to Collect
              </div>
            </div>

            <button
              type="button"
              onClick={handleClaimAll}
              className="py-2 px-3.5 btn-chamkila-gold text-amber-950 font-black text-xs rounded-xl shadow-md active:scale-95 transition-all cursor-pointer flex items-center space-x-1"
            >
              <Coins className="w-3.5 h-3.5" />
              <span>Claim All</span>
            </button>
          </div>
        )}

        {/* Empty State vs Active Plans List */}
        {myPlans.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm text-center flex flex-col items-center my-6">
            <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 shadow-inner">
              <IndianRupee className="w-10 h-10" />
            </div>

            <h3 className="text-base font-bold text-gray-900">No Active Plans Yet</h3>
            <p className="text-xs text-gray-500 mt-1 max-w-[260px]">
              You haven't subscribed to any income plan. Start investing to earn daily profits!
            </p>

            <button
              id="browse-plans-btn"
              onClick={() => setCurrentView('home')}
              className="mt-6 py-3 px-6 rounded-2xl btn-chamkila text-white font-bold text-xs shadow-md shadow-emerald-600/30 active:scale-95 transition-all cursor-pointer"
            >
              Browse Plans
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <span className="text-xs font-bold text-gray-900 block px-1">
              Subscribed Packages ({activePlans.length})
            </span>

            {myPlans.map((up, idx) => {
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
                  className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-2.5">
                      {up.imageUrl && (
                        <img
                          src={up.imageUrl}
                          alt={up.title}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-xl object-cover shrink-0 border border-emerald-200/50 bg-zinc-900 shadow-xs"
                        />
                      )}
                      <div>
                        <div className="text-xs font-bold text-gray-900 flex items-center space-x-1">
                          <span>{up.title}</span>
                          {isTurbo && (
                            <span className="text-[9px] font-extrabold bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded border border-amber-300">
                              ⚡ {up.durationMinutes === 60 ? '1 Hour' : `${up.durationMinutes} ${up.durationMinutes === 1 ? 'Minute' : 'Minutes'}`}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-gray-400">Purchased: {up.purchasedAt}</span>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
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
                          ? '⚡ Turbo Running'
                          : 'Active'
                        : up.status === 'returned'
                        ? '↩ Plan Returned'
                        : 'Completed'}
                    </span>
                  </div>

                  {/* Plan Return Info Bar */}
                  <div className="flex items-center justify-between text-[11px] text-gray-500 bg-emerald-50/50 px-3 py-1.5 rounded-xl border border-emerald-100/50">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Return Time:</span>
                      <strong className="text-gray-900">
                        {isTurbo
                          ? up.durationMinutes === 60
                            ? '1 Hour'
                            : `${up.durationMinutes} Minutes`
                          : `${up.returnDays} Days`}
                      </strong>
                    </span>
                    <span>
                      Progress: <strong className="text-gray-900">{isTurbo ? (up.status === 'completed' ? 'Settled' : 'In Progress') : `${up.daysClaimed}/${up.returnDays} Days`}</strong>
                    </span>
                  </div>

                  {/* Metrics Row */}
                  <div className="grid grid-cols-3 gap-2 bg-gray-50 p-2.5 rounded-2xl text-center text-xs">
                    <div>
                      <span className="text-[9px] text-gray-400 block">Deposit</span>
                      <span className="font-bold text-gray-800 tabular-nums">{formatINR(up.depositAmount, { decimals: 0 })}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-gray-400 block">
                        {isTurbo ? 'Plan Return' : 'Daily Return'}
                      </span>
                      <span className="font-extrabold text-emerald-600 tabular-nums">{formatINR(up.dailyIncome, { decimals: 0 })}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-gray-400 block">Total Est.</span>
                      <span className="font-extrabold text-emerald-700 tabular-nums">{formatINR(up.totalReturn, { decimals: 0 })}</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                      <span>
                        {isTurbo ? (
                          up.status === 'completed' ? (
                            'Status: Completed & Claimed'
                          ) : isReady ? (
                            <span className="text-emerald-600 font-bold">⚡ Ready to Collect!</span>
                          ) : (
                            <span>
                              Remaining: {Math.floor(remainingMs / 60000)} Minutes {Math.floor((remainingMs % 60000) / 1000)} Seconds
                            </span>
                          )
                        ) : up.status === 'returned' ? (
                          <span className="text-rose-600 font-bold">Plan Returned & Refunded</span>
                        ) : (
                          `Progress: ${up.daysClaimed}/${up.returnDays} Days`
                        )}
                      </span>
                      <span className="font-mono font-bold">{progressPct}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          up.status === 'returned'
                            ? 'bg-rose-400'
                            : isTurbo
                            ? 'bg-gradient-to-r from-amber-400 to-amber-500'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${progressPct}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {up.status === 'active' && (
                    <div className="space-y-2 pt-1">
                      {isTurbo ? (
                        isReady ? (
                          <button
                            id={`claim-turbo-btn-${up.id}`}
                            onClick={() => handleClaimSingle(up.id, profitAmount)}
                            className="w-full py-2.5 btn-chamkila-gold text-amber-950 rounded-xl text-xs font-black flex items-center justify-center space-x-1.5 shadow-md active:scale-95 transition-all cursor-pointer ring-1 ring-amber-300"
                          >
                            <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-700 animate-bounce" />
                            <span>Collect Turbo Return (+{formatINR(profitAmount, { decimals: 0 })})</span>
                          </button>
                        ) : (
                          <div className="w-full py-2 bg-amber-50/90 border border-amber-200 rounded-xl text-center text-[11px] font-bold text-amber-900 flex items-center justify-center space-x-1.5">
                            <Clock className="w-3.5 h-3.5 text-amber-600 animate-spin" />
                            <span>
                              In Progress: {Math.floor(remainingMs / 60000)} Minutes {Math.floor((remainingMs % 60000) / 1000)} Seconds remaining
                            </span>
                          </div>
                        )
                      ) : up.lastClaimDate === todayStr ? (
                        <div className="w-full py-2 bg-emerald-50 rounded-xl text-center text-[11px] font-bold text-emerald-700 flex items-center justify-center space-x-1 border border-emerald-100">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          <span>Today's Profit Claimed (Next in {timeLeft.h} Hours {timeLeft.m} Minutes)</span>
                        </div>
                      ) : (
                        <button
                          id={`claim-daily-btn-${up.id}`}
                          onClick={() => handleClaimSingle(up.id, up.dailyIncome)}
                          className="w-full py-2.5 btn-chamkila text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
                        >
                          <Coins className="w-3.5 h-3.5 text-amber-200" />
                          <span>Collect Today's Profit (+{formatINR(up.dailyIncome, { decimals: 0 })})</span>
                        </button>
                      )}

                      {/* Return Plan / Refund Button */}
                      <button
                        id={`return-plan-btn-${up.id}`}
                        type="button"
                        onClick={() => setPlanToReturn(up)}
                        className="w-full py-2 bg-gray-50 hover:bg-rose-50 text-gray-600 hover:text-rose-700 border border-gray-200 hover:border-rose-200 rounded-xl text-[11px] font-bold flex items-center justify-center space-x-1.5 active:scale-95 transition-all cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-rose-500" />
                        <span>Return Plan (Refund Deposit {formatINR(up.depositAmount, { decimals: 0 })})</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Return Plan Confirmation Modal */}
      {planToReturn &&
        createPortal(
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden text-center p-6 space-y-4">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shadow-inner">
                <RotateCcw className="w-7 h-7" />
              </div>

              <div>
                <h3 className="text-base font-black text-gray-900">Return Investment Plan?</h3>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  Are you sure you want to return the investment plan for{' '}
                  <strong className="text-gray-800">{planToReturn.title}</strong>?
                </p>
              </div>

              <div className="p-3 bg-rose-50/80 rounded-2xl border border-rose-100 text-left space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500">Plan:</span>
                  <span className="font-bold text-gray-800">{planToReturn.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Return Time:</span>
                  <span className="font-bold text-gray-800">
                    {planToReturn.durationMinutes
                      ? `${planToReturn.durationMinutes} Minutes`
                      : `${planToReturn.returnDays} Days`}
                  </span>
                </div>
                <div className="flex justify-between border-t border-rose-200/60 pt-1.5">
                  <span className="text-rose-700 font-bold">Refund to Wallet:</span>
                  <span className="text-rose-700 font-extrabold text-sm font-mono">
                    +{formatINR(planToReturn.depositAmount, { decimals: 0 })}
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <button
                  id="confirm-return-plan-btn"
                  type="button"
                  onClick={() => {
                    sfx.playSuccess();
                    returnPlanCycle(planToReturn.id);
                    setPlanToReturn(null);
                  }}
                  className="w-full py-3 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-black text-xs rounded-xl shadow-md active:scale-95 transition-all cursor-pointer"
                >
                  Yes, Return Plan & Refund Deposit
                </button>

                <button
                  id="cancel-return-plan-btn"
                  type="button"
                  onClick={() => {
                    sfx.playTap();
                    setPlanToReturn(null);
                  }}
                  className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl active:scale-95 transition-all cursor-pointer"
                >
                  Keep Plan Running
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};
