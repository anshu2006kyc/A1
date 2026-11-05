import React, { useState, useEffect, useRef } from 'react';
import { Crown, Gift, Coins, Clock, CheckCircle2, AlertCircle, X, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { formatINR } from '../utils/currency';
import { sfx } from '../utils/sound';
import { DEMO_SPIN_WINNERS } from '../data/initialData';

interface LuckySpinWheelProps {
  onClose?: () => void;
  isEmbedded?: boolean;
}

export const LuckySpinWheel: React.FC<LuckySpinWheelProps> = ({ onClose, isEmbedded = false }) => {
  const {
    user,
    hasSpunToday,
    luckySpinSegments,
    spinLuckyWheel,
    openAuthModal,
    totalSpinEarned,
    luckySpinRecords
  } = useApp();

  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [wonSegment, setWonSegment] = useState<{ amount: number; label: string; isJackpot?: boolean } | null>(null);
  const [showWinDialog, setShowWinDialog] = useState(false);
  const [timeUntilTomorrow, setTimeUntilTomorrow] = useState({ hours: 0, minutes: 0, seconds: 0 });

  const tickIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const currentRotationRef = useRef(0);

  // Countdown timer to midnight IST (daily reset)
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setHours(24, 0, 0, 0);
      const diffMs = Math.max(0, tomorrow.getTime() - now.getTime());

      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

      setTimeUntilTomorrow({ hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSpinClick = async () => {
    if (isSpinning) return;

    if (!user.id || user.id <= 0) {
      sfx.playTap();
      openAuthModal('login');
      return;
    }

    if (hasSpunToday) {
      sfx.playWarning();
      return;
    }

    sfx.playTap();
    setIsSpinning(true);
    setWonSegment(null);
    setShowWinDialog(false);

    try {
      // Get winning segment from context logic
      const result = await spinLuckyWheel();
      if (!result.success) {
        setIsSpinning(false);
        return;
      }

      const targetIdx = result.segmentIndex;
      const numSegments = luckySpinSegments.length;
      const segmentAngle = 360 / numSegments;

      // In our SVG layout, 12 o'clock pointer points to angle 0°.
      // Segment `i` spans from `i * segmentAngle` to `(i + 1) * segmentAngle`.
      // Center of segment `i` is `i * segmentAngle + segmentAngle / 2`.
      // To bring segment `i` center to 0° (top), the wheel must end at rotation:
      // targetDegrees = 360 - (targetIdx * segmentAngle + segmentAngle / 2).
      const segmentCenter = targetIdx * segmentAngle + segmentAngle / 2;
      const targetNormalized = (360 - segmentCenter + 360) % 360;

      // Add 6 to 8 full revolutions for excitement
      const fullSpins = 7 * 360;
      const currentMod = currentRotationRef.current % 360;
      const deltaToTarget = (targetNormalized - currentMod + 360) % 360;
      const totalNewRotation = currentRotationRef.current + fullSpins + deltaToTarget;

      currentRotationRef.current = totalNewRotation;
      setRotation(totalNewRotation);

      // Play decelerating tick sounds during 4.2s spin
      let elapsed = 0;
      const spinDuration = 4200;
      let tickDelay = 60; // starts fast

      const scheduleNextTick = () => {
        if (elapsed >= spinDuration) return;
        sfx.playWheelTick(800 + Math.random() * 150);
        elapsed += tickDelay;
        // Exponentially increase delay as wheel decelerates
        const progress = elapsed / spinDuration;
        tickDelay = 60 + Math.pow(progress, 2.5) * 350;
        setTimeout(scheduleNextTick, tickDelay);
      };

      setTimeout(scheduleNextTick, 60);

      // Wheel stops after 4.2 seconds
      setTimeout(() => {
        setIsSpinning(false);
        const won = luckySpinSegments[targetIdx];
        setWonSegment({
          amount: won.amount,
          label: won.label,
          isJackpot: won.isJackpot
        });
        setShowWinDialog(true);

        // Confetti & triumph sound
        if (won.isJackpot || won.amount >= 100) {
          sfx.playFanfare();
          confetti({
            particleCount: 140,
            spread: 90,
            origin: { y: 0.5 }
          });
        } else {
          sfx.playSuccess();
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.55 }
          });
        }
      }, 4300);
    } catch {
      setIsSpinning(false);
    }
  };

  // Helper to generate SVG path for a wheel slice
  const createSlicePath = (index: number, total: number, radius: number) => {
    const anglePerSlice = (2 * Math.PI) / total;
    // Offset by -PI/2 so 0 radians starts at 12 o'clock (top)
    const startAngle = index * anglePerSlice - Math.PI / 2;
    const endAngle = (index + 1) * anglePerSlice - Math.PI / 2;

    const x1 = 150 + radius * Math.cos(startAngle);
    const y1 = 150 + radius * Math.sin(startAngle);
    const x2 = 150 + radius * Math.cos(endAngle);
    const y2 = 150 + radius * Math.sin(endAngle);

    return `M 150 150 L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z`;
  };

  const padZero = (n: number) => String(n).padStart(2, '0');

  return (
    <div className={`relative ${isEmbedded ? '' : 'p-4 sm:p-6'} flex flex-col items-center select-none`}>
      {/* Top Header Card */}
      <div className="w-full text-center mb-3">
        <div className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-900 text-[8.5px] font-black uppercase tracking-wider mb-1.5 shadow-xs">
          <Gift className="w-3 h-3 text-amber-600" />
          <span>100% Cash Win • 1x Daily</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight flex items-center justify-center space-x-1.5">
          <span>AKM Lucky Spin Wheel</span>
        </h2>
        <p className="text-xs text-gray-500 font-medium mt-0.5">
          Spin once daily to win up to <strong className="text-emerald-700">₹500.00</strong> instant cash!
        </p>
      </div>

      {/* Main Wheel Container with High-Trust Casino Bezel */}
      <div className="relative w-[300px] h-[300px] sm:w-[330px] sm:h-[330px] flex items-center justify-center my-2">
        {/* Outer Glowing Halo */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-400/30 via-emerald-400/20 to-yellow-500/30 blur-xl animate-pulse pointer-events-none" />

        {/* Outer Golden Flanged Ring with 16 Glowing LED Bulbs */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-300 via-amber-500 to-yellow-600 p-2.5 shadow-xl border-2 border-yellow-200">
          <div className="w-full h-full rounded-full bg-slate-950 relative flex items-center justify-center overflow-hidden border border-amber-300/60 shadow-inner">
            {/* 16 Perimeter LED Bulbs */}
            {Array.from({ length: 16 }).map((_, i) => {
              const deg = (i * 360) / 16;
              const rad = (deg * Math.PI) / 180;
              const r = 142; // distance from center
              const top = 146 + r * Math.sin(rad);
              const left = 146 + r * Math.cos(rad);
              const isEven = i % 2 === 0;

              return (
                <div
                  key={`bulb-${i}`}
                  style={{ top: `${top}px`, left: `${left}px` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full border border-white/80 shadow-sm transition-all duration-300 ${
                    isSpinning
                      ? isEven
                        ? 'bg-yellow-300 shadow-yellow-300 animate-ping'
                        : 'bg-emerald-400 shadow-emerald-400 animate-pulse'
                      : isEven
                      ? 'bg-yellow-300 shadow-amber-300'
                      : 'bg-white shadow-white'
                  }`}
                />
              );
            })}
          </div>
        </div>

        {/* Rotatable Wheel SVG */}
        <div
          id="lucky-spin-rotator"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: isSpinning ? 'transform 4.2s cubic-bezier(0.12, 0.85, 0.25, 1)' : 'none'
          }}
          className="relative w-[260px] h-[260px] sm:w-[280px] sm:h-[280px] rounded-full overflow-hidden shadow-2xl z-10"
        >
          <svg viewBox="0 0 300 300" className="w-full h-full">
            <defs>
              <radialGradient id="goldCap" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="40%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#78350f" />
              </radialGradient>
              <linearGradient id="jackpotGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fde047" />
                <stop offset="50%" stopColor="#eab308" />
                <stop offset="100%" stopColor="#ca8a04" />
              </linearGradient>
            </defs>

            {/* Slices Rendering */}
            {luckySpinSegments.map((segment, idx) => {
              const sliceAngle = 360 / luckySpinSegments.length;
              const textAngle = idx * sliceAngle + sliceAngle / 2; // angle in degrees

              return (
                <g key={segment.id}>
                  {/* Slice Wedge */}
                  <path
                    d={createSlicePath(idx, luckySpinSegments.length, 140)}
                    fill={segment.isJackpot ? 'url(#jackpotGlow)' : segment.color}
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    strokeOpacity="0.4"
                  />

                  {/* Slice Divider Accent Line */}
                  <line
                    x1="150"
                    y1="150"
                    x2={150 + 140 * Math.cos((idx * sliceAngle - 90) * (Math.PI / 180))}
                    y2={150 + 140 * Math.sin((idx * sliceAngle - 90) * (Math.PI / 180))}
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    strokeOpacity="0.8"
                  />

                  {/* Text & Icon in Slice (Rotated to align outwards) */}
                  <g transform={`rotate(${textAngle} 150 150)`}>
                    <text
                      x="150"
                      y="50"
                      textAnchor="middle"
                      fill={segment.textColor}
                      fontFamily="sans-serif"
                      fontSize={segment.isJackpot ? "14" : "13"}
                      fontWeight="900"
                      style={{ textShadow: '0 1px 3px rgba(0,0,0,0.6)' }}
                    >
                      {segment.label}
                    </text>
                    {segment.isJackpot && (
                      <text
                        x="150"
                        y="34"
                        textAnchor="middle"
                        fill="#78350f"
                        fontFamily="sans-serif"
                        fontSize="10"
                        fontWeight="black"
                      >
                        👑 MEGA
                      </text>
                    )}
                  </g>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Center Spin Hub & Interactive Button */}
        <div className="absolute z-20 w-20 h-20 sm:w-22 sm:h-22 rounded-full flex items-center justify-center">
          {/* Subtle Outer Drop Ring */}
          <div className="w-full h-full rounded-full bg-slate-900 shadow-2xl p-1.5 flex items-center justify-center border-2 border-amber-300">
            <button
              id="lucky-spin-button"
              type="button"
              disabled={isSpinning || hasSpunToday}
              onClick={handleSpinClick}
              className={`w-full h-full rounded-full flex flex-col items-center justify-center text-center transition-all cursor-pointer shadow-lg active:scale-95 ${
                hasSpunToday
                  ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700'
                  : isSpinning
                  ? 'bg-amber-600 text-white cursor-wait animate-pulse'
                  : 'btn-chamkila-gold text-slate-950 font-black hover:scale-105 ring-2 ring-yellow-200'
              }`}
            >
              {isSpinning ? (
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-100">
                  LUCKY...
                </span>
              ) : hasSpunToday ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mb-0.5" />
                  <span className="text-[8.5px] font-black tracking-wider text-slate-300 uppercase">
                    CLAIMED
                  </span>
                </>
              ) : (
                <>
                  <span className="text-sm font-black tracking-wider leading-none drop-shadow-xs">
                    SPIN
                  </span>
                  <span className="text-[7.5px] font-extrabold uppercase tracking-widest text-slate-900/80">
                    FREE
                  </span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Top Pointer Flapper (12 o'clock needle pointing downwards) */}
        <div className="absolute -top-3 z-30 flex flex-col items-center drop-shadow-lg pointer-events-none">
          <div className="w-7 h-9 relative flex items-center justify-center">
            {/* Glowing needle polygon */}
            <svg viewBox="0 0 28 36" className="w-7 h-9 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
              <polygon
                points="14,36 2,4 26,4"
                fill="url(#goldCap)"
                stroke="#ffffff"
                strokeWidth="1.5"
              />
              <circle cx="14" cy="8" r="4.5" fill="#ffffff" />
              <circle cx="14" cy="8" r="2.5" fill="#d97706" />
            </svg>
          </div>
        </div>
      </div>

      {/* Status Bar / Daily Countdown Display */}
      <div className="w-full max-w-sm mt-3 px-3">
        {hasSpunToday ? (
          <div className="bg-slate-900/90 text-white rounded-2xl p-3 border border-slate-800 flex items-center justify-between shadow-sm">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-slate-200">Today's Spin Claimed</div>
                <div className="text-[9.5px] text-slate-400">Return tomorrow for 1 free spin</div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-[9px] text-amber-400 font-bold uppercase tracking-wider flex items-center justify-end space-x-1">
                <Clock className="w-3 h-3 text-amber-400" />
                <span>Next Spin in</span>
              </div>
              <div className="text-xs font-black font-mono text-white mt-0.5">
                {padZero(timeUntilTomorrow.hours)}:{padZero(timeUntilTomorrow.minutes)}:{padZero(timeUntilTomorrow.seconds)}
              </div>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleSpinClick}
            disabled={isSpinning}
            className="w-full py-3 px-4 rounded-2xl btn-chamkila-gold text-slate-950 font-black text-sm flex items-center justify-center space-x-2 shadow-lg hover:brightness-105 active:scale-95 transition-all cursor-pointer ring-2 ring-yellow-300/80"
          >
            <Gift className="w-4 h-4 text-slate-900" />
            <span>{isSpinning ? 'SPINNING THE WHEEL...' : 'SPIN THE WHEEL (1 FREE SPIN)'}</span>
          </button>
        )}
      </div>

      {/* Live Recent Lucky Winners Marquee */}
      <div className="w-full max-w-sm mt-3.5 bg-gray-50 border border-gray-200 rounded-2xl p-2.5 overflow-hidden">
        <div className="flex items-center space-x-1.5 text-[10px] font-black text-gray-500 uppercase tracking-wider mb-1.5 px-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>Live Recent Lucky Winners</span>
        </div>
        <div className="flex space-x-3 overflow-x-auto scrollbar-none py-1">
          {DEMO_SPIN_WINNERS.map((winner, idx) => (
            <div
              key={`winner-${idx}`}
              className={`shrink-0 px-2.5 py-1.5 rounded-xl border text-[10px] flex items-center space-x-1.5 shadow-2xs ${
                winner.isJackpot
                  ? 'bg-amber-100 border-amber-300 text-amber-950 font-black'
                  : 'bg-white border-gray-100 text-gray-700 font-bold'
              }`}
            >
              {winner.isJackpot && <span>👑</span>}
              <span className="font-mono text-gray-600">{winner.phone}</span>
              <span className="text-emerald-600 font-extrabold font-mono">+{formatINR(winner.amount)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Trust & Fair Play Footer */}
      <div className="mt-2 text-center text-[7px] sm:text-[7.5px] text-gray-400 flex items-center justify-center space-x-1 tracking-wide">
        <ShieldCheck className="w-2 h-2 text-emerald-600 shrink-0" />
        <span>AKM ENTERPRISES Certified Fair Play • 100% Guaranteed Cash Reward</span>
      </div>

      {/* Congratulations Winning Dialog Overlay */}
      {showWinDialog && wonSegment && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="relative w-full max-w-xs bg-white rounded-3xl p-5 text-center shadow-2xl border-2 border-amber-300 animate-scale-up">
            {/* Close Button */}
            <button
              onClick={() => setShowWinDialog(false)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-gray-100 text-gray-500 hover:text-gray-900 flex items-center justify-center cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Glowing Icon */}
            <div className="w-16 h-16 mx-auto rounded-3xl btn-chamkila-gold flex items-center justify-center shadow-lg shadow-amber-500/30 mb-3">
              {wonSegment.isJackpot ? (
                <Crown className="w-9 h-9 text-slate-950 fill-amber-300" />
              ) : (
                <Gift className="w-9 h-9 text-slate-950" />
              )}
            </div>

            <div className="text-[11px] font-black uppercase tracking-wider text-amber-600 mb-0.5">
              {wonSegment.isJackpot ? '🎉 MEGA JACKPOT WINNER!' : '🎉 CONGRATULATIONS!'}
            </div>
            <h3 className="text-xl font-black text-gray-900">
              You Won {wonSegment.label}!
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              {formatINR(wonSegment.amount)} has been successfully credited directly to your AKM wallet balance.
            </p>

            <div className="my-4 p-3 bg-emerald-50 rounded-2xl border border-emerald-200">
              <div className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider">
                Instant Credit Confirmed
              </div>
              <div className="text-2xl font-black font-mono text-emerald-600 mt-0.5">
                +{formatINR(wonSegment.amount)}
              </div>
              <div className="text-[9.5px] text-emerald-800 font-medium mt-1">
                Wallet Balance: <strong className="font-mono">{formatINR(user.balance)}</strong>
              </div>
            </div>

            <button
              onClick={() => {
                sfx.playTap();
                setShowWinDialog(false);
                if (onClose) onClose();
              }}
              className="w-full py-2.5 px-4 rounded-xl btn-chamkila text-white font-bold text-xs shadow-md cursor-pointer active:scale-95 transition-all"
            >
              Collect & Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
