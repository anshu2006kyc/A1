import React from 'react';
import { motion } from 'motion/react';
import { CalendarCheck, Check, Gift, Home, Share2, User, Users } from 'lucide-react';
import { AppView, useApp } from '../context/AppContext';
import { sfx } from '../utils/sound';

export const BottomNav: React.FC = () => {
  const { currentView, setCurrentView, hasCheckedInToday, streakDays } = useApp();

  const handleNavClick = (view: AppView) => {
    sfx.playTap();
    setCurrentView(view);
  };

  const isProfileActive = currentView === 'profile' || ['about', 'bank', 'myproducts', 'transactions'].includes(currentView);

  return (
    <div className="fixed bottom-3 left-3 right-3 z-30 max-w-md mx-auto pointer-events-none">
      <nav
        aria-label="Bottom Navigation"
        className="pointer-events-auto relative bg-white/92 backdrop-blur-2xl border border-white/80 shadow-[0_12px_36px_rgba(0,0,0,0.1),0_2px_8px_rgba(0,168,89,0.06)] rounded-[26px] px-2 py-1.5 ring-1 ring-black/[0.04]"
      >
        <div className="flex items-center justify-between relative">
          {/* Left Wing: Home & Share */}
          <div className="flex items-center justify-around w-[40%]">
            {/* Home Tab */}
            <button
              id="nav-home"
              onClick={() => handleNavClick('home')}
              className="relative flex-1 py-1.5 px-2 flex flex-col items-center justify-center cursor-pointer transition-all active:scale-95 group"
            >
              {currentView === 'home' && (
                <motion.div
                  layoutId="navPill"
                  className="absolute inset-0 bg-emerald-50/90 rounded-2xl border border-emerald-100/80"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <motion.div
                whileTap={{ scale: 0.85 }}
                className={`relative z-10 flex flex-col items-center transition-colors ${
                  currentView === 'home' ? 'text-[#008a44]' : 'text-slate-400 group-hover:text-slate-600'
                }`}
              >
                <Home className={`w-5 h-5 transition-transform ${currentView === 'home' ? 'stroke-[2.5] scale-105' : 'stroke-[1.9]'}`} />
                <span className={`text-[10px] mt-0.5 tracking-tight ${currentView === 'home' ? 'font-black' : 'font-semibold'}`}>
                  Home
                </span>
                {currentView === 'home' && (
                  <motion.span
                    layoutId="navDot"
                    className="w-1 h-1 rounded-full bg-emerald-500 mt-0.5"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.div>
            </button>

            {/* Share Tab */}
            <button
              id="nav-share"
              onClick={() => handleNavClick('share')}
              className="relative flex-1 py-1.5 px-2 flex flex-col items-center justify-center cursor-pointer transition-all active:scale-95 group"
            >
              {currentView === 'share' && (
                <motion.div
                  layoutId="navPill"
                  className="absolute inset-0 bg-emerald-50/90 rounded-2xl border border-emerald-100/80"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <motion.div
                whileTap={{ scale: 0.85 }}
                className={`relative z-10 flex flex-col items-center transition-colors ${
                  currentView === 'share' ? 'text-[#008a44]' : 'text-slate-400 group-hover:text-slate-600'
                }`}
              >
                <Share2 className={`w-5 h-5 transition-transform ${currentView === 'share' ? 'stroke-[2.5] scale-105' : 'stroke-[1.9]'}`} />
                <span className={`text-[10px] mt-0.5 tracking-tight ${currentView === 'share' ? 'font-black' : 'font-semibold'}`}>
                  Share
                </span>
                {currentView === 'share' && (
                  <motion.span
                    layoutId="navDot"
                    className="w-1 h-1 rounded-full bg-emerald-500 mt-0.5"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.div>
            </button>
          </div>

          {/* Center Elevated Action Button: Daily Check-in */}
          <div className="relative -top-5 flex flex-col items-center justify-center z-20">
            <motion.button
              id="nav-checkin"
              whileHover={{ scale: 1.06, y: -2 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => handleNavClick('checkin')}
              className={`relative w-14 h-14 rounded-full flex flex-col items-center justify-center text-white shadow-xl cursor-pointer border-[3.5px] border-white transition-all ${
                currentView === 'checkin'
                  ? 'bg-gradient-to-tr from-[#006e36] via-[#009e4f] to-[#1cdb77] shadow-emerald-600/40 ring-2 ring-emerald-500 scale-105'
                  : 'bg-gradient-to-tr from-[#008241] via-[#00aa5a] to-[#2bd97e] shadow-emerald-500/30'
              }`}
            >
              {/* Pulsing ring if check-in pending today */}
              {!hasCheckedInToday && (
                <span className="absolute -inset-1.5 rounded-full bg-emerald-400/40 animate-ping pointer-events-none" />
              )}

              {/* Subtle metallic gloss overlay */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/30 via-transparent to-black/10 pointer-events-none" />

              <CalendarCheck className="w-6 h-6 stroke-[2.3] relative z-10 drop-shadow-xs" />

              {/* Status Badge Top-Right */}
              {!hasCheckedInToday ? (
                <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full border-2 border-white shadow-md flex items-center space-x-0.5 animate-bounce">
                  <Gift className="w-2.5 h-2.5" />
                  <span>NEW</span>
                </span>
              ) : (
                <span className="absolute -top-1 -right-1 bg-emerald-700 text-emerald-200 text-[8px] font-black p-0.5 rounded-full border border-white shadow-xs">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </span>
              )}
            </motion.button>
            <span
              className={`text-[9px] font-black tracking-tight mt-1 transition-colors ${
                currentView === 'checkin' ? 'text-[#008a44]' : 'text-slate-500'
              }`}
            >
              Check-in
            </span>
          </div>

          {/* Right Wing: Team & Profile */}
          <div className="flex items-center justify-around w-[40%]">
            {/* Team Tab */}
            <button
              id="nav-team"
              onClick={() => handleNavClick('team')}
              className="relative flex-1 py-1.5 px-2 flex flex-col items-center justify-center cursor-pointer transition-all active:scale-95 group"
            >
              {currentView === 'team' && (
                <motion.div
                  layoutId="navPill"
                  className="absolute inset-0 bg-emerald-50/90 rounded-2xl border border-emerald-100/80"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <motion.div
                whileTap={{ scale: 0.85 }}
                className={`relative z-10 flex flex-col items-center transition-colors ${
                  currentView === 'team' ? 'text-[#008a44]' : 'text-slate-400 group-hover:text-slate-600'
                }`}
              >
                <Users className={`w-5 h-5 transition-transform ${currentView === 'team' ? 'stroke-[2.5] scale-105' : 'stroke-[1.9]'}`} />
                <span className={`text-[10px] mt-0.5 tracking-tight ${currentView === 'team' ? 'font-black' : 'font-semibold'}`}>
                  Team
                </span>
                {currentView === 'team' && (
                  <motion.span
                    layoutId="navDot"
                    className="w-1 h-1 rounded-full bg-emerald-500 mt-0.5"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.div>
            </button>

            {/* Profile Tab */}
            <button
              id="nav-profile"
              onClick={() => handleNavClick('profile')}
              className="relative flex-1 py-1.5 px-2 flex flex-col items-center justify-center cursor-pointer transition-all active:scale-95 group"
            >
              {isProfileActive && (
                <motion.div
                  layoutId="navPill"
                  className="absolute inset-0 bg-emerald-50/90 rounded-2xl border border-emerald-100/80"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <motion.div
                whileTap={{ scale: 0.85 }}
                className={`relative z-10 flex flex-col items-center transition-colors ${
                  isProfileActive ? 'text-[#008a44]' : 'text-slate-400 group-hover:text-slate-600'
                }`}
              >
                <User className={`w-5 h-5 transition-transform ${isProfileActive ? 'stroke-[2.5] scale-105' : 'stroke-[1.9]'}`} />
                <span className={`text-[10px] mt-0.5 tracking-tight ${isProfileActive ? 'font-black' : 'font-semibold'}`}>
                  Profile
                </span>
                {isProfileActive && (
                  <motion.span
                    layoutId="navDot"
                    className="w-1 h-1 rounded-full bg-emerald-500 mt-0.5"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.div>
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
};

