import React from 'react';
import { motion } from 'motion/react';
import { CalendarCheck, Check, Gift, Home, Share2, User, Users } from 'lucide-react';
import { AppView, useApp } from '../context/AppContext';
import { sfx } from '../utils/sound';

export const BottomNav: React.FC = () => {
  const { currentView, setCurrentView, hasCheckedInToday } = useApp();

  const handleNavClick = (view: AppView) => {
    sfx.playTap();
    setCurrentView(view);
  };

  const isProfileActive =
    currentView === 'profile' ||
    ['about', 'bank', 'myproducts', 'transactions'].includes(currentView);

  return (
    <div className="fixed bottom-2.5 left-2.5 right-2.5 z-40 max-w-md mx-auto pointer-events-none">
      <nav
        aria-label="Bottom Navigation"
        className="pointer-events-auto relative bg-white/95 backdrop-blur-2xl border border-emerald-500/20 shadow-[0_10px_30px_rgba(0,138,68,0.12),0_2px_8px_rgba(0,0,0,0.04)] rounded-[26px] px-2 h-[60px] flex items-center ring-1 ring-emerald-500/10 box-border"
      >
        {/* Subtle interior ambient light bar */}
        <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent pointer-events-none" />

        <div className="flex items-center justify-between w-full h-full relative">
          {/* Left Wing: Home & Share */}
          <div className="flex items-center justify-around w-[38%] h-full">
            {/* Home Tab */}
            <button
              id="nav-home"
              type="button"
              onClick={() => handleNavClick('home')}
              className="relative flex-1 h-[48px] px-1 flex flex-col items-center justify-center cursor-pointer transition-all active:scale-95 group focus:outline-none"
            >
              {currentView === 'home' && (
                <motion.div
                  layoutId="navPill"
                  className="absolute inset-0 bg-emerald-50/90 rounded-xl border border-emerald-300/60 shadow-[inset_0_1px_2px_rgba(0,138,68,0.08)]"
                  transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                />
              )}
              <motion.div
                whileTap={{ scale: 0.88 }}
                className={`relative z-10 flex flex-col items-center justify-center transition-colors ${
                  currentView === 'home'
                    ? 'text-[#008a44]'
                    : 'text-slate-400 group-hover:text-emerald-800'
                }`}
              >
                <Home
                  className={`w-5 h-5 transition-transform ${
                    currentView === 'home'
                      ? 'stroke-[2.6] drop-shadow-[0_2px_6px_rgba(0,138,68,0.3)]'
                      : 'stroke-[1.9]'
                  }`}
                />
                <span
                  className={`text-[9.5px] mt-0.5 tracking-tight ${
                    currentView === 'home' ? 'font-black text-[#008a44]' : 'font-bold text-slate-500'
                  }`}
                >
                  Home
                </span>
                {/* Fixed height dot container to prevent any navbar jumping */}
                <div className="h-1.5 flex items-center justify-center mt-0.5">
                  {currentView === 'home' && (
                    <motion.span
                      layoutId="navDot"
                      className="w-1.5 h-1.5 rounded-full bg-[#008a44] shadow-[0_0_6px_#00ba58]"
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </div>
              </motion.div>
            </button>

            {/* Share Tab */}
            <button
              id="nav-share"
              type="button"
              onClick={() => handleNavClick('share')}
              className="relative flex-1 h-[48px] px-1 flex flex-col items-center justify-center cursor-pointer transition-all active:scale-95 group focus:outline-none"
            >
              {currentView === 'share' && (
                <motion.div
                  layoutId="navPill"
                  className="absolute inset-0 bg-emerald-50/90 rounded-xl border border-emerald-300/60 shadow-[inset_0_1px_2px_rgba(0,138,68,0.08)]"
                  transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                />
              )}
              <motion.div
                whileTap={{ scale: 0.88 }}
                className={`relative z-10 flex flex-col items-center justify-center transition-colors ${
                  currentView === 'share'
                    ? 'text-[#008a44]'
                    : 'text-slate-400 group-hover:text-emerald-800'
                }`}
              >
                <Share2
                  className={`w-5 h-5 transition-transform ${
                    currentView === 'share'
                      ? 'stroke-[2.6] drop-shadow-[0_2px_6px_rgba(0,138,68,0.3)]'
                      : 'stroke-[1.9]'
                  }`}
                />
                <span
                  className={`text-[9.5px] mt-0.5 tracking-tight ${
                    currentView === 'share' ? 'font-black text-[#008a44]' : 'font-bold text-slate-500'
                  }`}
                >
                  Share
                </span>
                {/* Fixed height dot container */}
                <div className="h-1.5 flex items-center justify-center mt-0.5">
                  {currentView === 'share' && (
                    <motion.span
                      layoutId="navDot"
                      className="w-1.5 h-1.5 rounded-full bg-[#008a44] shadow-[0_0_6px_#00ba58]"
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </div>
              </motion.div>
            </button>
          </div>

          {/* Center Elevated Action Button: Daily Check-in (Strictly Fixed Dimensions, Zero Navbar Jump) */}
          <div className="relative -top-4 w-16 h-full flex flex-col items-center justify-center shrink-0 z-30 pointer-events-auto">
            <button
              id="nav-checkin"
              type="button"
              aria-label="Daily Check-in Reward"
              onClick={() => handleNavClick('checkin')}
              className="flex flex-col items-center justify-center cursor-pointer select-none group focus:outline-none"
            >
              {/* Elevated Circle Wrapper with Constant Outer Geometry */}
              <div className="relative">
                {/* Outer Pulsing Aura when check-in is pending today */}
                {!hasCheckedInToday && (
                  <span className="absolute -inset-1 rounded-full bg-emerald-400/50 animate-ping pointer-events-none" />
                )}

                {/* Main Circular Button with Constant 52px Diameter (No scale-105 or dynamic ring offset) */}
                <div
                  className={`relative w-[52px] h-[52px] rounded-full flex items-center justify-center border-[3px] transition-all overflow-hidden ${
                    currentView === 'checkin'
                      ? 'border-emerald-400 shadow-[0_0_18px_rgba(16,185,129,0.7)]'
                      : 'border-white shadow-[0_6px_16px_rgba(0,186,88,0.4)] group-hover:shadow-[0_8px_20px_rgba(0,186,88,0.55)]'
                  }`}
                  style={{
                    background: 'linear-gradient(135deg, #00d26a 0%, #00ba58 45%, #00873d 100%)',
                  }}
                >
                  {/* Top Gloss Arc */}
                  <div
                    className="absolute top-0 left-0 right-0 h-1/2 pointer-events-none rounded-t-full"
                    style={{
                      background: 'linear-gradient(180deg, rgba(255,255,255,0.65) 0%, rgba(255,255,255,0.05) 100%)',
                    }}
                  />

                  {/* Chamkila Light Beam Sweeping Animation */}
                  <div
                    className="absolute inset-y-0 w-8 pointer-events-none"
                    style={{
                      background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.85) 50%, transparent 100%)',
                      animation: 'shineSweep 2.6s ease-in-out infinite',
                    }}
                  />

                  {/* Calendar Check Icon */}
                  <CalendarCheck className="w-6 h-6 stroke-[2.4] text-white relative z-10 drop-shadow-[0_2px_5px_rgba(0,0,0,0.3)] transition-transform group-hover:scale-105" />
                </div>

                {/* Floating Notification Badge */}
                {!hasCheckedInToday ? (
                  <span className="absolute -top-1 -right-1 z-30 bg-gradient-to-r from-amber-500 via-amber-600 to-rose-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full border-2 border-white shadow-md flex items-center space-x-0.5 animate-bounce pointer-events-none">
                    <Gift className="w-2.5 h-2.5 text-amber-100" />
                    <span>NEW</span>
                  </span>
                ) : (
                  <span className="absolute -top-1 -right-1 z-30 bg-emerald-600 text-white text-[8px] font-black p-0.5 rounded-full border-2 border-white shadow-xs flex items-center justify-center pointer-events-none">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                )}
              </div>

              {/* Label below the circle (Stable size, no scale jump) */}
              <span
                className={`text-[9.5px] tracking-tight mt-0.5 font-bold transition-colors ${
                  currentView === 'checkin'
                    ? 'text-[#008a44] font-black'
                    : 'text-slate-600 group-hover:text-emerald-700'
                }`}
              >
                Check-in
              </span>

              {/* Fixed height dot container */}
              <div className="h-1.5 flex items-center justify-center mt-0.5">
                {currentView === 'checkin' && (
                  <motion.span
                    layoutId="navDot"
                    className="w-1.5 h-1.5 rounded-full bg-[#008a44] shadow-[0_0_6px_#00ba58]"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </div>
            </button>
          </div>

          {/* Right Wing: Team & Profile */}
          <div className="flex items-center justify-around w-[38%] h-full">
            {/* Team Tab */}
            <button
              id="nav-team"
              type="button"
              onClick={() => handleNavClick('team')}
              className="relative flex-1 h-[48px] px-1 flex flex-col items-center justify-center cursor-pointer transition-all active:scale-95 group focus:outline-none"
            >
              {currentView === 'team' && (
                <motion.div
                  layoutId="navPill"
                  className="absolute inset-0 bg-emerald-50/90 rounded-xl border border-emerald-300/60 shadow-[inset_0_1px_2px_rgba(0,138,68,0.08)]"
                  transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                />
              )}
              <motion.div
                whileTap={{ scale: 0.88 }}
                className={`relative z-10 flex flex-col items-center justify-center transition-colors ${
                  currentView === 'team'
                    ? 'text-[#008a44]'
                    : 'text-slate-400 group-hover:text-emerald-800'
                }`}
              >
                <Users
                  className={`w-5 h-5 transition-transform ${
                    currentView === 'team'
                      ? 'stroke-[2.6] drop-shadow-[0_2px_6px_rgba(0,138,68,0.3)]'
                      : 'stroke-[1.9]'
                  }`}
                />
                <span
                  className={`text-[9.5px] mt-0.5 tracking-tight ${
                    currentView === 'team' ? 'font-black text-[#008a44]' : 'font-bold text-slate-500'
                  }`}
                >
                  Team
                </span>
                {/* Fixed height dot container */}
                <div className="h-1.5 flex items-center justify-center mt-0.5">
                  {currentView === 'team' && (
                    <motion.span
                      layoutId="navDot"
                      className="w-1.5 h-1.5 rounded-full bg-[#008a44] shadow-[0_0_6px_#00ba58]"
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </div>
              </motion.div>
            </button>

            {/* Profile Tab */}
            <button
              id="nav-profile"
              type="button"
              onClick={() => handleNavClick('profile')}
              className="relative flex-1 h-[48px] px-1 flex flex-col items-center justify-center cursor-pointer transition-all active:scale-95 group focus:outline-none"
            >
              {isProfileActive && (
                <motion.div
                  layoutId="navPill"
                  className="absolute inset-0 bg-emerald-50/90 rounded-xl border border-emerald-300/60 shadow-[inset_0_1px_2px_rgba(0,138,68,0.08)]"
                  transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                />
              )}
              <motion.div
                whileTap={{ scale: 0.88 }}
                className={`relative z-10 flex flex-col items-center justify-center transition-colors ${
                  isProfileActive
                    ? 'text-[#008a44]'
                    : 'text-slate-400 group-hover:text-emerald-800'
                }`}
              >
                <User
                  className={`w-5 h-5 transition-transform ${
                    isProfileActive
                      ? 'stroke-[2.6] drop-shadow-[0_2px_6px_rgba(0,138,68,0.3)]'
                      : 'stroke-[1.9]'
                  }`}
                />
                <span
                  className={`text-[9.5px] mt-0.5 tracking-tight ${
                    isProfileActive ? 'font-black text-[#008a44]' : 'font-bold text-slate-500'
                  }`}
                >
                  Profile
                </span>
                {/* Fixed height dot container */}
                <div className="h-1.5 flex items-center justify-center mt-0.5">
                  {isProfileActive && (
                    <motion.span
                      layoutId="navDot"
                      className="w-1.5 h-1.5 rounded-full bg-[#008a44] shadow-[0_0_6px_#00ba58]"
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </div>
              </motion.div>
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
};
