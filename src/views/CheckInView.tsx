import React, { useEffect, useState } from 'react';
import {
  Award,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Coins,
  Flame,
  Gift,
  HelpCircle,
  Lock,
  Trophy,
  Unlock,
  Zap
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatINR } from '../utils/currency';
import { maskPhone } from '../utils/phone';
import { sfx } from '../utils/sound';

export const CheckInView: React.FC = () => {
  const {
    user,
    setCurrentView,
    checkIns,
    hasCheckedInToday,
    claimDailyCheckIn,
    streakDays,
    totalCheckInDays,
    totalCheckInEarned,
    claimedStreakMilestones,
    claimStreakMilestone,
    adminSettings,
    showToast
  } = useApp();

  const [showRules, setShowRules] = useState(false);
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Calculate live time remaining until midnight IST (next checkin)
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setHours(24, 0, 0, 0);
      const diff = Math.max(0, tomorrow.getTime() - now.getTime());

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  // Today's formatted real date
  const now = new Date();
  const dateFormatted = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  // 7-Day progressive bonus map
  const streakBonusMap: Record<number, number> = {
    1: 0,
    2: 4,
    3: 8,
    4: 12,
    5: 18,
    6: 25,
    7: 40
  };

  const baseReward = adminSettings.dailyCheckInReward || 12;

  // Compute which day (1 to 7) user is currently on in the 7-day cycle
  // If user has checked in today, their current day in cycle is: ((streakDays - 1) % 7) + 1
  // If not checked in today, today will be: (streakDays % 7) + 1
  const currentCycleDay = hasCheckedInToday
    ? ((Math.max(1, streakDays) - 1) % 7) + 1
    : (streakDays % 7) + 1;

  const todayRewardAmount = baseReward + (streakBonusMap[currentCycleDay] || 0);

  // 7-day progressive ladder cards
  const sevenDaysPlan = [
    { dayNumber: 1, title: 'Day 1', reward: baseReward, isSpecial: false },
    { dayNumber: 2, title: 'Day 2', reward: baseReward + 4, isSpecial: false },
    { dayNumber: 3, title: 'Day 3', reward: baseReward + 8, isSpecial: false },
    { dayNumber: 4, title: 'Day 4', reward: baseReward + 12, isSpecial: false },
    { dayNumber: 5, title: 'Day 5', reward: baseReward + 18, isSpecial: false },
    { dayNumber: 6, title: 'Day 6', reward: baseReward + 25, isSpecial: false },
    { dayNumber: 7, title: 'Day 7', reward: baseReward + 40, isSpecial: true }
  ];

  const handleClaim = () => {
    sfx.cash();
    const res = claimDailyCheckIn();
    if (res?.message) {
      showToast(res.message, res.success ? 'success' : 'info');
    }
  };

  const handleClaimMilestone = (days: number, reward: number) => {
    sfx.success();
    const res = claimStreakMilestone(days, reward);
    if (res?.message) {
      showToast(res.message, res.success ? 'success' : 'info');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-28 animate-fade-in">
      {/* Top Navigation - Clean & Working Header (Back button & ? icon removed) */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-100 sticky top-0 z-20">
        <div className="flex items-center space-x-1.5 min-w-[70px]">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-black tracking-wider text-emerald-700 uppercase">AKM</span>
        </div>

        <div className="text-center flex-1">
          <h1 className="text-base font-bold text-gray-900 leading-tight">Daily Check-in</h1>
          <span className="text-[10px] text-emerald-600 font-medium">Daily Streak & Reward Center</span>
        </div>

        <div className="min-w-[70px] flex justify-end">
          <div className="flex items-center space-x-1 bg-emerald-50 border border-emerald-200/70 px-2.5 py-1 rounded-full text-emerald-700 text-[10px] font-bold shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Active</span>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Top Header Card */}
        <div className="bg-gradient-to-br from-[#008f4c] via-[#00a859] to-[#0a6634] text-white p-5 rounded-3xl shadow-lg relative overflow-hidden">
          {/* Subtle decorative circles */}
          <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10 blur-xl pointer-events-none" />
          <div className="absolute -left-8 -bottom-8 w-32 h-32 rounded-full bg-emerald-900/20 blur-xl pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="text-xs font-semibold text-emerald-100 flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping" />
                <span>ID: {maskPhone(user.phone, false)}</span>
              </div>
              <div className="inline-flex items-center space-x-1 bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-bold text-emerald-100">
                <Flame className="w-3 h-3 text-amber-300 fill-amber-300" />
                <span>Streak Day {streakDays}</span>
              </div>
            </div>

            <div className="text-xl font-black mt-2 tracking-tight flex items-center justify-between">
              <span>{dateFormatted}</span>
              <Award className="w-4 h-4 text-amber-300 drop-shadow-sm" />
            </div>

            {/* 3 Metrics Row */}
            <div className="grid grid-cols-3 gap-2 mt-4">
              <div className="bg-black/20 backdrop-blur-md p-2.5 rounded-2xl text-center border border-white/10">
                <div className="flex justify-center mb-1 text-amber-300">
                  <Flame className="w-4 h-4 fill-amber-300/30" />
                </div>
                <div className="text-base font-black text-white">{streakDays}</div>
                <div className="text-[9px] font-bold text-emerald-200 tracking-wider">DAY STREAK</div>
              </div>

              <div className="bg-black/20 backdrop-blur-md p-2.5 rounded-2xl text-center border border-white/10">
                <div className="flex justify-center mb-1 text-emerald-200">
                  <Calendar className="w-4 h-4" />
                </div>
                <div className="text-base font-black text-white">{totalCheckInDays}</div>
                <div className="text-[9px] font-bold text-emerald-200 tracking-wider">TOTAL DAYS</div>
              </div>

              <div className="bg-black/20 backdrop-blur-md p-2.5 rounded-2xl text-center border border-white/10">
                <div className="flex justify-center mb-1 text-yellow-300">
                  <Coins className="w-4 h-4" />
                </div>
                <div className="text-base font-black text-white tabular-nums font-mono">
                  {formatINR(totalCheckInEarned, { decimals: 0 })}
                </div>
                <div className="text-[9px] font-bold text-emerald-200 tracking-wider">EARNED</div>
              </div>
            </div>
          </div>
        </div>

        {/* Central Gold Coin Reward Card */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm text-center flex flex-col items-center relative overflow-hidden">
          {/* Status Badge */}
          {hasCheckedInToday ? (
            <div className="inline-flex items-center space-x-1.5 bg-emerald-100 text-emerald-800 text-xs font-bold px-3.5 py-1 rounded-full mb-3 shadow-xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>DAY {currentCycleDay} CHECKED IN TODAY</span>
            </div>
          ) : (
            <div className="inline-flex items-center space-x-1.5 bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 text-xs font-bold px-3.5 py-1 rounded-full mb-3 shadow-xs border border-amber-200">
              <Gift className="w-3.5 h-3.5 text-amber-600" />
              <span>DAY {currentCycleDay} REWARD UNLOCKED</span>
            </div>
          )}

          {/* 3D Gold Coin Artwork */}
          <div className="relative my-2">
            <div className={`w-28 h-28 rounded-full flex items-center justify-center p-2 shadow-xl transition-all duration-300 ${
              hasCheckedInToday
                ? 'bg-gradient-to-tr from-emerald-500 to-teal-300 shadow-emerald-500/20'
                : 'bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-500 shadow-amber-400/40 animate-pulse'
            }`}>
              <div className="w-full h-full rounded-full border-4 border-dashed border-white/50 flex items-center justify-center bg-gradient-to-br from-amber-400 via-amber-500 to-yellow-500 shadow-inner">
                {hasCheckedInToday ? (
                  <Check className="w-12 h-12 text-white stroke-[3.5] drop-shadow-md" />
                ) : (
                  <Gift className="w-12 h-12 text-white drop-shadow-md animate-bounce" />
                )}
              </div>
            </div>
          </div>

          {/* Amount Label */}
          <div className="text-3xl font-black text-emerald-700 mt-2 tabular-nums font-mono">
            {formatINR(todayRewardAmount, { decimals: 0 })}
          </div>
          <span className="text-xs text-gray-500 mt-0.5">
            {hasCheckedInToday ? 'Earned Today · Return tomorrow for more' : 'Collect today\'s streak reward bonus'}
          </span>

          {/* Action Button & Countdown */}
          <div className="w-full mt-5">
            {hasCheckedInToday ? (
              <div className="space-y-2">
                <button
                  disabled
                  className="w-full py-3.5 rounded-2xl bg-gray-100 text-gray-400 font-bold text-sm flex items-center justify-center space-x-2 cursor-not-allowed border border-gray-200"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Already Claimed Today</span>
                </button>
                <div className="flex items-center justify-center space-x-1.5 text-xs text-gray-500 font-medium">
                  <Clock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Next check-in opens in:</span>
                  <span className="font-bold text-emerald-700 font-mono">
                    {String(timeLeft.hours).padStart(2, '0')}:
                    {String(timeLeft.minutes).padStart(2, '0')}:
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </span>
                </div>
              </div>
            ) : (
              <button
                id="claim-checkin-btn"
                onClick={handleClaim}
                className="w-full py-4 rounded-2xl btn-chamkila-gold text-amber-950 font-black text-sm flex items-center justify-center space-x-2 shadow-xl hover:brightness-105 active:scale-95 transition-all cursor-pointer tracking-wide"
              >
                <Gift className="w-4 h-4 text-amber-900" />
                <span className="drop-shadow-xs">Claim {formatINR(todayRewardAmount, { decimals: 0 })} Bonus Now</span>
              </button>
            )}
          </div>
        </div>

        {/* 7-Day Progressive Streak Journey */}
        <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-gray-900">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <span>7-Day Continuous Streak Period</span>
            </div>
            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              Round {Math.floor(streakDays / 7) + 1}
            </span>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center">
            {sevenDaysPlan.map((d) => {
              // Status logic
              const isPastChecked = hasCheckedInToday
                ? d.dayNumber <= currentCycleDay
                : d.dayNumber < currentCycleDay;
              const isToday = d.dayNumber === currentCycleDay;
              const isUpcoming = hasCheckedInToday
                ? d.dayNumber > currentCycleDay
                : d.dayNumber > currentCycleDay;

              return (
                <div
                  key={d.dayNumber}
                  className={`py-2.5 px-0.5 rounded-2xl flex flex-col items-center justify-between transition-all relative ${
                    isPastChecked
                      ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                      : isToday
                      ? 'bg-gradient-to-b from-emerald-600 to-emerald-700 text-white shadow-md ring-2 ring-emerald-400/50 scale-[1.03]'
                      : d.isSpecial
                      ? 'bg-amber-50/70 border border-amber-200 text-gray-600'
                      : 'bg-gray-50 border border-gray-100 text-gray-500'
                  }`}
                >
                  {/* Top Day Tag */}
                  <span className={`text-[9px] font-bold block ${isToday ? 'text-emerald-100' : 'text-gray-400'}`}>
                    {d.title}
                  </span>

                  {/* Icon */}
                  <div className="my-1.5">
                    {isPastChecked ? (
                      <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    ) : isToday ? (
                      <div className="w-5 h-5 rounded-full bg-white text-emerald-600 flex items-center justify-center shadow-xs animate-pulse">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    ) : d.isSpecial ? (
                      <div className="w-5 h-5 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                        <Gift className="w-3 h-3" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center">
                        <Lock className="w-2.5 h-2.5" />
                      </div>
                    )}
                  </div>

                  {/* Reward Amount */}
                  <span className={`text-[10px] font-black tabular-nums ${isToday ? 'text-white' : isPastChecked ? 'text-emerald-700' : 'text-gray-700'}`}>
                    +{d.reward}
                  </span>

                  {d.isSpecial && !isPastChecked && !isToday && (
                    <span className="text-[7.5px] font-extrabold text-amber-700 bg-amber-200/80 px-1 rounded mt-0.5">
                      MEGA
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
            <span>Progress: {currentCycleDay}/7 Days</span>
            <span className="text-emerald-600 font-semibold">Day 7 includes Mega Mystery Box 🎁</span>
          </div>
        </div>

        {/* Streak Milestone Rewards & Mystery Chests */}
        <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-gray-900">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>Continuous Streak Milestones</span>
            </div>
            <span className="text-[10px] text-gray-400">Claim once reached</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {adminSettings.streakRewards.map((sr, idx) => {
              const isClaimed = claimedStreakMilestones.includes(sr.days);
              const isUnlocked = streakDays >= sr.days;
              const canClaim = isUnlocked && !isClaimed;

              return (
                <div
                  key={idx}
                  className={`p-3 rounded-2xl border flex flex-col justify-between transition-all ${
                    isClaimed
                      ? 'bg-gray-50 border-gray-200 opacity-80'
                      : canClaim
                      ? 'bg-gradient-to-br from-amber-50 to-emerald-50 border-amber-300 shadow-sm ring-1 ring-amber-300'
                      : 'bg-white border-gray-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs">
                      {isClaimed ? (
                        <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                      ) : (
                        <Gift className="w-4 h-4" />
                      )}
                    </div>
                    <span className="text-[10px] font-bold text-gray-500">{sr.label}</span>
                  </div>

                  <div className="my-2">
                    <div className="text-xs font-bold text-gray-900">{sr.days} Days Streak</div>
                    <div className="text-sm font-black text-emerald-600 tabular-nums">
                      +{formatINR(sr.reward, { decimals: 0 })}
                    </div>
                  </div>

                  {/* Action button */}
                  {isClaimed ? (
                    <div className="text-[10px] font-bold text-gray-400 bg-gray-100 py-1 rounded-lg text-center">
                      Claimed ✓
                    </div>
                  ) : canClaim ? (
                    <button
                      onClick={() => handleClaimMilestone(sr.days, sr.reward)}
                      className="w-full py-1.5 rounded-lg btn-chamkila-gold text-amber-950 font-black text-[10px] shadow-sm active:scale-95 transition-all cursor-pointer flex items-center justify-center space-x-1"
                    >
                      <Gift className="w-3 h-3 text-amber-900" />
                      <span>Claim Bonus</span>
                    </button>
                  ) : (
                    <div className="text-[9.5px] text-gray-400 bg-gray-50 py-1 rounded-lg text-center flex items-center justify-center space-x-1">
                      <Lock className="w-2.5 h-2.5" />
                      <span>{Math.max(0, sr.days - streakDays)} days left</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Check-in Rules Accordion / Guide */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <button
            onClick={() => setShowRules(!showRules)}
            className="w-full p-4 flex items-center justify-between text-left cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center space-x-2 text-xs font-bold text-gray-900">
              <HelpCircle className="w-4 h-4 text-emerald-600" />
              <span>Check-in Rules & Multipliers</span>
            </div>
            {showRules ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
          </button>

          {showRules && (
            <div className="px-4 pb-4 pt-1 text-[11px] text-gray-600 space-y-2 border-t border-gray-50 bg-gray-50/50">
              <div className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <span>Each account is entitled to 1 check-in reward per calendar day (00:00 - 23:59 IST).</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <span>Consecutive check-ins increase your daily earnings progressively up to Day 7.</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <span>Reaching Day 7 unlocks the Mega Mystery Box, and continuous streaks unlock Milestone Chests.</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <span>If you miss a day, the continuous streak counter resets back to Day 1.</span>
              </div>
            </div>
          )}
        </div>

        {/* Recent Check-ins History List */}
        <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-gray-900 mb-3">
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Check-in Records History</span>
            </div>
          </div>

          {checkIns.filter((ci) => ci.userId === user.id).length === 0 ? (
            <div className="text-center py-6 text-gray-400 text-xs">
              No check-ins yet. Claim your first bonus above!
            </div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {checkIns.filter((ci) => ci.userId === user.id).map((ci, idx) => (
                <div
                  key={`${ci.id || 'chk'}-${idx}`}
                  className="flex items-center justify-between p-3 rounded-2xl bg-gray-50/80 border border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-gray-900">Daily Check-in Bonus</div>
                      <div className="text-[10px] text-gray-400 mt-0.5">{ci.timestamp}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-bold text-emerald-600 tabular-nums font-mono">
                      +{formatINR(ci.amount, { decimals: 0 })}
                    </div>
                    <span className="inline-block text-[9px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full mt-0.5">
                      Success
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
