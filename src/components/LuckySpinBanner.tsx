import React, { useState, useEffect } from 'react';
import { Crown, Clock, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { sfx } from '../utils/sound';

export const LuckySpinBanner: React.FC = () => {
  const { hasSpunToday, setIsLuckySpinOpen } = useApp();
  const [countdown, setCountdown] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setHours(24, 0, 0, 0);
      const diffMs = Math.max(0, tomorrow.getTime() - now.getTime());

      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

      setCountdown({ hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const padZero = (n: number) => String(n).padStart(2, '0');

  const handleClick = () => {
    sfx.playTap();
    setIsLuckySpinOpen(true);
  };

  return (
    <div className="px-3.5 mb-3.5">
      <div
        id="home-lucky-spin-banner"
        onClick={handleClick}
        className="relative overflow-hidden rounded-2xl p-3 sm:p-3.5 bg-gradient-to-r from-emerald-950 via-slate-950 to-emerald-900 border border-amber-400/50 shadow-md hover:shadow-lg transition-all cursor-pointer group active:scale-[0.99]"
      >
        {/* Subtle Ambient Shimmer Background */}
        <div className="absolute inset-0 bg-radial from-amber-400/10 via-transparent to-transparent opacity-60 pointer-events-none" />
        <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-amber-400/15 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between gap-3">
          {/* Left: 3D-Style Spinning Wheel Icon */}
          <div className="relative w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-yellow-600 p-1 shadow-lg shadow-amber-500/25 shrink-0 group-hover:scale-105 transition-transform flex items-center justify-center">
            {/* Spinning Wheel Mini Graphic */}
            <div className="w-full h-full rounded-xl bg-slate-950 relative flex items-center justify-center overflow-hidden border border-amber-300">
              <svg viewBox="0 0 40 40" className="w-9 h-9 animate-[spin_8s_linear_infinite]">
                <circle cx="20" cy="20" r="18" fill="#0f172a" stroke="#f59e0b" strokeWidth="2" />
                <path d="M 20 20 L 20 2 A 18 18 0 0 1 38 20 Z" fill="#059669" />
                <path d="M 20 20 L 38 20 A 18 18 0 0 1 20 38 Z" fill="#0284c7" />
                <path d="M 20 20 L 20 38 A 18 18 0 0 1 2 20 Z" fill="#d97706" />
                <path d="M 20 20 L 2 20 A 18 18 0 0 1 20 2 Z" fill="#7c3aed" />
                <circle cx="20" cy="20" r="5" fill="#fef08a" stroke="#b45309" strokeWidth="1" />
              </svg>

              {/* Center Pointer Pin */}
              <div className="absolute top-0.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[3.5px] border-l-transparent border-r-[3.5px] border-r-transparent border-t-[6px] border-t-yellow-300 drop-shadow-xs" />
            </div>

            {/* Glowing Active Badge */}
            {!hasSpunToday && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-80" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-300 border border-white" />
              </span>
            )}
          </div>

          {/* Middle: Content Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-1 mb-0.5">
              <span className="text-[5.5px] sm:text-[6px] font-black uppercase tracking-wider text-amber-300 bg-amber-400/20 px-1 py-0.5 rounded border border-amber-400/30 leading-none">
                1x Daily Reward
              </span>
              {!hasSpunToday ? (
                <span className="text-[5.5px] sm:text-[6px] font-extrabold text-emerald-300 bg-emerald-500/20 px-1 py-0.5 rounded flex items-center space-x-0.5 leading-none">
                  <Zap className="w-1.5 h-1.5 text-emerald-400 fill-emerald-400" />
                  <span>FREE SPIN READY</span>
                </span>
              ) : (
                <span className="text-[5.5px] sm:text-[6px] font-bold text-slate-400 bg-white/10 px-1 py-0.5 rounded flex items-center space-x-0.5 leading-none">
                  <Clock className="w-1.5 h-1.5 text-slate-400" />
                  <span>RESET AT MIDNIGHT</span>
                </span>
              )}
            </div>

            <div className="text-xs sm:text-sm font-black text-white tracking-wide truncate flex items-center space-x-1">
              <span>Lucky Spin Wheel</span>
              <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
            </div>

            <div className="text-[10px] text-slate-300 truncate mt-0.5">
              Win up to <strong className="text-amber-300 font-bold">₹500.00</strong> instant cash credited to wallet!
            </div>
          </div>

          {/* Right: CTA Action Button */}
          <div className="shrink-0 flex flex-col items-end">
            {!hasSpunToday ? (
              <button
                type="button"
                className="btn-chamkila-gold text-slate-950 font-black text-xs px-3 py-2 rounded-xl flex items-center space-x-1 shadow-md group-hover:scale-105 active:scale-95 transition-all cursor-pointer ring-1 ring-yellow-200"
              >
                <span>SPIN</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.8]" />
              </button>
            ) : (
              <div className="text-right bg-slate-900/90 border border-slate-800 px-2.5 py-1.5 rounded-xl">
                <div className="text-[8px] font-bold text-amber-400 uppercase tracking-wider flex items-center justify-end space-x-0.5">
                  <Clock className="w-2.5 h-2.5 text-amber-400" />
                  <span>Next Spin</span>
                </div>
                <div className="text-[11px] font-black font-mono text-white mt-0.5">
                  {padZero(countdown.hours)}:{padZero(countdown.minutes)}:{padZero(countdown.seconds)}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
