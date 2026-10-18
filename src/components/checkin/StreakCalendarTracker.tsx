import React, { useState, useMemo, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  Check,
  ChevronLeft,
  ChevronRight,
  Flame,
  Gift,
  Lock,
  Sparkles,
  Trophy,
  X,
  Zap,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CheckInRecord } from '../../types';
import { formatINR } from '../../utils/currency';
import { sfx } from '../../utils/sound';

interface StreakCalendarTrackerProps {
  checkIns: CheckInRecord[];
  currentUserId: number;
  streakDays: number;
  totalCheckInDays: number;
  totalCheckInEarned: number;
  hasCheckedInToday: boolean;
  onClaimClick?: () => void;
  // External trigger for celebration modal
  triggerCelebration?: boolean;
  onCelebrationClosed?: () => void;
}

export const StreakCalendarTracker: React.FC<StreakCalendarTrackerProps> = ({
  checkIns,
  currentUserId,
  streakDays,
  totalCheckInDays,
  totalCheckInEarned,
  hasCheckedInToday,
  onClaimClick,
  triggerCelebration = false,
  onCelebrationClosed
}) => {
  // Calendar Navigation State
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedDayDetail, setSelectedDayDetail] = useState<{
    dateStr: string;
    record?: CheckInRecord;
    isToday: boolean;
    isPast: boolean;
    isFuture: boolean;
  } | null>(null);

  // 7-Day Streak Celebration Modal state
  const [showCelebration, setShowCelebration] = useState(false);

  // Respond to triggerCelebration prop
  useEffect(() => {
    if (triggerCelebration) {
      launchCelebration();
    }
  }, [triggerCelebration]);

  // Today's Date String YYYY-MM-DD
  const todayStr = useMemo(() => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  }, []);

  // Filter checkins for current user into a fast Lookup Map
  const userCheckInsMap = useMemo(() => {
    const map = new Map<string, CheckInRecord>();
    checkIns
      .filter((c) => c.userId === currentUserId)
      .forEach((c) => {
        map.set(c.dateStr, c);
      });
    return map;
  }, [checkIns, currentUserId]);

  // Calendar Math: Year, Month, Days
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sun, 1 = Mon...
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Previous month navigation
  const prevMonth = () => {
    sfx.playTap();
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDayDetail(null);
  };

  // Next month navigation
  const nextMonth = () => {
    sfx.playTap();
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDayDetail(null);
  };

  // Jump to Current Month
  const jumpToToday = () => {
    sfx.playTap();
    setCurrentDate(new Date());
    setSelectedDayDetail(null);
  };

  // Check-ins in the selected month
  const monthlyCheckInCount = useMemo(() => {
    let count = 0;
    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      if (userCheckInsMap.has(dateKey)) {
        count++;
      }
    }
    return count;
  }, [daysInMonth, month, userCheckInsMap, year]);

  // Launch Satisfying 7-Day Streak Celebration
  const launchCelebration = () => {
    setShowCelebration(true);
    sfx.fanfare();

    // Haptic feedback if supported
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([80, 50, 120, 50, 200]);
      } catch {}
    }

    // Grand Fireworks / Confetti Storm with multi-angle cannons
    const duration = 3.5 * 1000;
    const animationEnd = Date.now() + duration;
    const colors = ['#10b981', '#f59e0b', '#fbbf24', '#34d399', '#6366f1', '#ec4899'];

    // Immediate center burst
    confetti({
      particleCount: 100,
      spread: 90,
      origin: { y: 0.55 },
      colors
    });

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors
      });

      if (Date.now() < animationEnd) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  const closeCelebration = () => {
    sfx.playTap();
    setShowCelebration(false);
    if (onCelebrationClosed) {
      onCelebrationClosed();
    }
  };

  // 7-day progress in current cycle (1 to 7)
  const currentCycleProgress = useMemo(() => {
    if (streakDays === 0) return 0;
    const remainder = streakDays % 7;
    return remainder === 0 ? 7 : remainder;
  }, [streakDays]);

  const is7DayStreakChampion = streakDays >= 7;

  return (
    <div className="space-y-4">
      {/* ============================================================ */}
      {/* 1. VISUAL 7-DAY STREAK TRACKER ROAD                          */}
      {/* ============================================================ */}
      <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
        {/* Subtle background glow when on a streak */}
        {streakDays > 0 && (
          <div className="absolute -top-12 -right-12 w-36 h-36 rounded-full bg-amber-400/10 blur-2xl pointer-events-none" />
        )}

        {/* Top Streak Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shadow-xs">
              <Flame className="w-4 h-4 fill-amber-500 text-amber-500 animate-pulse" />
            </div>
            <div>
              <div className="text-xs font-black text-gray-900 flex items-center space-x-1.5">
                <span>Active Streak Tracker</span>
                {is7DayStreakChampion && (
                  <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 shadow-xs">
                    7-Day Champion
                  </span>
                )}
              </div>
              <p className="text-[10px] text-gray-500">
                {streakDays === 0
                  ? 'Check in today to start your continuous streak!'
                  : `${streakDays} Days Continuous Streak active • Cycle Progress ${currentCycleProgress}/7`}
              </p>
            </div>
          </div>

          {/* Celebration Replay Button */}
          {is7DayStreakChampion ? (
            <button
              onClick={launchCelebration}
              className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 text-[10px] font-black flex items-center space-x-1 shadow-sm active:scale-95 transition-all cursor-pointer ring-1 ring-amber-300"
              title="Replay Satisfying 7-Day Celebration"
            >
              <Sparkles className="w-3 h-3 fill-slate-950" />
              <span>Celebrate!</span>
            </button>
          ) : (
            <div className="flex items-center space-x-1 text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
              <span>{7 - currentCycleProgress}d to 7-Day Chest</span>
            </div>
          )}
        </div>

        {/* 7-Node Visual Streak Path / Chain */}
        <div className="relative py-2">
          {/* Background Connecting Line */}
          <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 h-1 bg-gray-100 rounded-full z-0" />

          {/* Active Filled Progress Line */}
          <div
            className="absolute top-1/2 left-4 -translate-y-1/2 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-400 rounded-full z-0 transition-all duration-500"
            style={{
              width: currentCycleProgress > 1
                ? `${Math.min(100, ((currentCycleProgress - 1) / 6) * 100)}%`
                : '0%'
            }}
          />

          {/* 7 Interactive Nodes */}
          <div className="relative z-10 grid grid-cols-7 gap-1 text-center">
            {[1, 2, 3, 4, 5, 6, 7].map((dayNum) => {
              const isPassed = currentCycleProgress >= dayNum && (hasCheckedInToday || dayNum < currentCycleProgress);
              const isCurrentDayNode = currentCycleProgress === dayNum;
              const isMegaDay = dayNum === 7;

              return (
                <div key={dayNum} className="flex flex-col items-center">
                  <div
                    onClick={() => {
                      if (isMegaDay && is7DayStreakChampion) {
                        launchCelebration();
                      }
                    }}
                    className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all ${
                      isPassed
                        ? 'bg-gradient-to-tr from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/30 scale-100'
                        : isCurrentDayNode
                        ? 'bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-950 shadow-md shadow-amber-400/40 ring-2 ring-amber-400 ring-offset-2 scale-110 animate-pulse'
                        : isMegaDay
                        ? 'bg-amber-100/90 text-amber-700 border-2 border-dashed border-amber-300'
                        : 'bg-gray-100 text-gray-400 border border-gray-200'
                    } ${isMegaDay && is7DayStreakChampion ? 'cursor-pointer hover:scale-115' : ''}`}
                    title={isMegaDay ? 'Day 7: Mega Mystery Chest Reward!' : `Day ${dayNum}`}
                  >
                    {isPassed ? (
                      <Check className="w-4 h-4 stroke-[3.5]" />
                    ) : isMegaDay ? (
                      <Trophy className="w-4 h-4 text-amber-600 drop-shadow-xs" />
                    ) : (
                      <span className="text-[11px] font-black">{dayNum}</span>
                    )}
                  </div>
                  <span className={`text-[9px] font-bold mt-1.5 ${
                    isCurrentDayNode ? 'text-amber-700 font-black' : isPassed ? 'text-emerald-700 font-extrabold' : 'text-gray-400'
                  }`}>
                    {dayNum === 7 ? '🎁 Day 7' : `D${dayNum}`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Motivational Streak Footer */}
        <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-[10.5px]">
          <div className="flex items-center space-x-1.5 text-gray-600">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Hitting Day 7 activates the <strong>Mega Jackpot Multiplier</strong></span>
          </div>
          {currentCycleProgress === 7 && is7DayStreakChampion && (
            <span className="text-emerald-600 font-black font-mono">STREAK MAXED 🔥</span>
          )}
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. INTERACTIVE VISUAL CALENDAR WIDGET                         */}
      {/* ============================================================ */}
      <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
        {/* Calendar Navigation Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <CalendarIcon className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-black text-gray-900 leading-tight">
                {monthNames[month]} {year}
              </h2>
              <p className="text-[10px] text-gray-500">
                {monthlyCheckInCount} check-ins recorded this month
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={jumpToToday}
              className="px-2 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-[10px] font-bold transition-all cursor-pointer mr-1"
              title="Jump to Today"
            >
              Today
            </button>
            <button
              onClick={prevMonth}
              className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 transition-all cursor-pointer active:scale-90"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextMonth}
              className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 transition-all cursor-pointer active:scale-90"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Weekday Column Headers */}
        <div className="grid grid-cols-7 gap-1 text-center py-2 text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>

        {/* Calendar Days Matrix */}
        <div className="grid grid-cols-7 gap-1.5">
          {/* Empty cells for offset */}
          {Array.from({ length: firstDayOfMonth }).map((_, idx) => (
            <div key={`empty-${idx}`} className="h-10 sm:h-12 rounded-xl bg-transparent" />
          ))}

          {/* Days of Month */}
          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const dayNum = idx + 1;
            const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
            const isToday = dateKey === todayStr;
            const record = userCheckInsMap.get(dateKey);
            const isCheckedIn = !!record;

            const dayDate = new Date(year, month, dayNum);
            const todayDate = new Date();
            todayDate.setHours(0, 0, 0, 0);
            dayDate.setHours(0, 0, 0, 0);

            const isPast = dayDate < todayDate;
            const isFuture = dayDate > todayDate;

            return (
              <div
                key={dateKey}
                onClick={() => {
                  sfx.playTap();
                  setSelectedDayDetail({
                    dateStr: dateKey,
                    record,
                    isToday,
                    isPast,
                    isFuture
                  });
                }}
                className={`h-11 sm:h-13 rounded-2xl p-1 flex flex-col items-center justify-between transition-all cursor-pointer select-none active:scale-95 relative ${
                  isCheckedIn
                    ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-sm shadow-emerald-500/25 ring-1 ring-emerald-400/40'
                    : isToday
                    ? 'bg-amber-50 text-amber-900 border-2 border-amber-400 shadow-sm animate-pulse'
                    : isPast
                    ? 'bg-gray-50/80 text-gray-500 hover:bg-gray-100 border border-gray-100'
                    : 'bg-white text-gray-300 border border-gray-100 opacity-60'
                }`}
              >
                {/* Day Number Header */}
                <div className="w-full flex items-center justify-between px-1">
                  <span className={`text-[10px] font-black ${
                    isCheckedIn ? 'text-white' : isToday ? 'text-amber-900 font-extrabold' : 'text-gray-600'
                  }`}>
                    {dayNum}
                  </span>

                  {/* Flame for streak records */}
                  {isCheckedIn && (
                    <Flame className="w-2.5 h-2.5 fill-amber-300 text-amber-300" />
                  )}
                </div>

                {/* Center Status Glyph */}
                <div className="my-auto flex items-center justify-center">
                  {isCheckedIn ? (
                    <div className="w-4 h-4 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-white stroke-[3.5]" />
                    </div>
                  ) : isToday ? (
                    <span className="text-[8px] font-black uppercase text-amber-800 bg-amber-200/90 px-1 rounded-sm">
                      TODAY
                    </span>
                  ) : isPast ? (
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                  ) : (
                    <Lock className="w-2.5 h-2.5 text-gray-300" />
                  )}
                </div>

                {/* Bottom Reward Tag */}
                {isCheckedIn ? (
                  <span className="text-[8px] font-black text-emerald-100 font-mono tracking-tight leading-none">
                    +{record?.amount || 12}
                  </span>
                ) : isToday ? (
                  <span className="text-[7.5px] font-extrabold text-amber-700 leading-none">
                    {hasCheckedInToday ? 'CLAIMED' : 'CLAIM'}
                  </span>
                ) : (
                  <span className="text-[7px] text-transparent leading-none">.</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Selected Day Details Pop-Banner */}
        {selectedDayDetail && (
          <div className="mt-3.5 p-3 rounded-2xl bg-gray-50 border border-gray-200 text-xs flex items-center justify-between animate-fade-in">
            <div className="flex items-center space-x-2.5">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold ${
                selectedDayDetail.record
                  ? 'bg-emerald-100 text-emerald-800'
                  : selectedDayDetail.isToday
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {selectedDayDetail.record ? (
                  <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                ) : (
                  <CalendarIcon className="w-4 h-4" />
                )}
              </div>
              <div>
                <div className="font-bold text-gray-900">
                  {new Date(selectedDayDetail.dateStr).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </div>
                <div className="text-[10px] text-gray-500">
                  {selectedDayDetail.record ? (
                    <span className="text-emerald-700 font-bold">
                      Checked in at {selectedDayDetail.record.timestamp || '09:00 AM'} • Earned {formatINR(selectedDayDetail.record.amount)}
                    </span>
                  ) : selectedDayDetail.isToday ? (
                    hasCheckedInToday ? (
                      <span className="text-emerald-700 font-semibold">Today's daily bonus already credited!</span>
                    ) : (
                      <span className="text-amber-700 font-semibold">Today is active! Claim your bonus above.</span>
                    )
                  ) : selectedDayDetail.isPast ? (
                    <span className="text-gray-400">Missed check-in on this date</span>
                  ) : (
                    <span className="text-gray-400">Upcoming calendar date</span>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedDayDetail(null)}
              className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-200 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Legend Indicators */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-around text-[10px] text-gray-500 flex-wrap gap-2">
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-md bg-gradient-to-br from-emerald-500 to-teal-600 shadow-2xs" />
            <span className="font-medium">Checked-in Day</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-md bg-amber-100 border border-amber-400" />
            <span className="font-medium">Today</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-md bg-gray-100 border border-gray-200" />
            <span className="font-medium">Missed Day</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Flame className="w-3 h-3 fill-amber-500 text-amber-500" />
            <span className="font-medium">Active Streak</span>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 3. GRAND 7-DAY STREAK CELEBRATION MODAL                      */}
      {/* ============================================================ */}
      {showCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-sm bg-gradient-to-b from-slate-900 via-slate-950 to-black text-white rounded-3xl p-6 border-2 border-amber-400/80 shadow-2xl shadow-amber-500/20 text-center overflow-hidden">
            {/* Pulsating Sunburst Radial Rays */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 bg-gradient-to-br from-amber-400/20 via-yellow-500/10 to-transparent rounded-full blur-2xl pointer-events-none animate-pulse" />

            {/* Close Cross */}
            <button
              onClick={closeCelebration}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white cursor-pointer active:scale-90 transition-all z-20"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Glowing Trophy Icon with Floating Glow Rings */}
            <div className="relative my-4 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-300 p-1 shadow-2xl shadow-amber-400/50 flex items-center justify-center animate-bounce">
                <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center border-2 border-amber-300/60 shadow-inner">
                  <Trophy className="w-12 h-12 text-amber-400 fill-amber-400 drop-shadow-md" />
                </div>
              </div>
            </div>

            {/* Badge Title */}
            <div className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 text-xs font-black uppercase tracking-wider mb-2 shadow-md">
              <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
              <span>7-Day Continuous Streak!</span>
            </div>

            <h3 className="text-xl font-black text-white tracking-tight">
              Champion Streaker Unlocked!
            </h3>

            <p className="text-xs text-amber-200/90 mt-1 leading-relaxed">
              Incredible dedication! You have achieved a full 7-day continuous check-in journey.
            </p>

            {/* Perks Cards Grid */}
            <div className="grid grid-cols-2 gap-2 my-4 text-left text-xs">
              <div className="p-2.5 rounded-2xl bg-white/5 border border-amber-400/30">
                <div className="text-[10px] text-amber-300 font-bold flex items-center space-x-1">
                  <Gift className="w-3 h-3" />
                  <span>Mega Box</span>
                </div>
                <div className="text-xs font-black text-white mt-0.5">Mystery Tier Unlocked</div>
              </div>

              <div className="p-2.5 rounded-2xl bg-white/5 border border-amber-400/30">
                <div className="text-[10px] text-emerald-400 font-bold flex items-center space-x-1">
                  <Zap className="w-3 h-3" />
                  <span>Multiplier</span>
                </div>
                <div className="text-xs font-black text-white mt-0.5">Maximum Daily Rate</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 mt-4">
              <button
                onClick={() => {
                  launchCelebration();
                }}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-xs shadow-lg shadow-amber-400/30 flex items-center justify-center space-x-1.5 active:scale-95 transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
                <span>Replay Confetti & Fireworks 🎆</span>
              </button>

              <button
                onClick={closeCelebration}
                className="w-full py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs cursor-pointer active:scale-95 transition-all"
              >
                Awesome! Continue Earning
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
