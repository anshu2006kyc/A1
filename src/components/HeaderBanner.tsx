import React, { useState, useEffect, useRef } from 'react';
import { Bell, ChevronLeft, ChevronRight, ShieldCheck, TrendingUp, Zap, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { formatINR } from '../utils/currency';

interface BannerSlide {
  id: string;
  title: string;
  subtitle: string;
  badge?: string;
  imageUrl: string;
  tagline: string;
  statLabel: string;
  statValue: string;
  accentColor: string;
}

const SLIDES: BannerSlide[] = [
  {
    id: 'akm-wealth-prime',
    title: 'SMART DIGITAL ASSETS',
    subtitle: 'AKM CAPITAL & WEALTH',
    badge: 'OFFICIAL PORTAL',
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80',
    tagline: 'High-frequency compounding with daily automated returns',
    statLabel: 'Active Yield Rate',
    statValue: 'Up to 600% Return Time',
    accentColor: 'from-emerald-950/85 via-emerald-950/40 to-transparent'
  },
  {
    id: 'akm-special-yield',
    title: 'SPECIAL 2-DAY FAST RETURN',
    subtitle: 'HIGH YIELD PORTFOLIO',
    badge: 'EXCLUSIVE ALLOCATION',
    imageUrl: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&w=1200&q=80',
    tagline: 'Deposit ₹720 & earn ₹8,708 in just 48 hours Return Time',
    statLabel: 'Settlement Window',
    statValue: 'Instant Bank IMPS',
    accentColor: 'from-amber-950/85 via-amber-950/40 to-transparent'
  },
  {
    id: 'akm-turbo-ultra',
    title: 'INSTITUTIONAL TURBO FUNDS',
    subtitle: 'ULTRA SPEED DIVIDENDS',
    badge: 'VIP PRIORITY',
    imageUrl: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&w=1200&q=80',
    tagline: 'Minute-level turbo harvests with 24/7 liquidity clearance',
    statLabel: 'Security Level',
    statValue: '256-Bit Vault',
    accentColor: 'from-teal-950/85 via-teal-950/40 to-transparent'
  },
  {
    id: 'akm-fintech-growth',
    title: 'DIRECT GATEWAY SETTLEMENT',
    subtitle: 'WATCHPAY & SUNPAY VIP',
    badge: 'VERIFIED SYSTEM',
    imageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80',
    tagline: 'Zero surcharge deposits and real-time IMPS direct banking',
    statLabel: 'Clearance Speed',
    statValue: '0.8s Ultra Fast',
    accentColor: 'from-blue-950/85 via-slate-950/40 to-transparent'
  }
];

export const HeaderBanner: React.FC = () => {
  const { user, isAdminUser, setIsAdminOpen, setIsAnnouncementOpen, setCurrentView } = useApp();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  const minSwipeDistance = 40;

  // Auto-slide effect every 4.5 seconds
  useEffect(() => {
    startAutoPlay();
    return () => stopAutoPlay();
  }, [currentSlide]);

  const startAutoPlay = () => {
    stopAutoPlay();
    autoPlayRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 4500);
  };

  const stopAutoPlay = () => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    startAutoPlay();
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1));
    startAutoPlay();
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    startAutoPlay();
  };

  const onTouchStart = (e: React.TouchEvent) => {
    stopAutoPlay();
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) {
      startAutoPlay();
      return;
    }
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    } else {
      startAutoPlay();
    }
  };

  const slide = SLIDES[currentSlide];

  return (
    <div className="relative overflow-hidden bg-neutral-950 rounded-b-3xl shadow-xl">
      {/* Top Bar with Status & Admin Quick Access */}
      <div className="relative z-20 px-3.5 pt-3 pb-2 flex items-center justify-between text-xs bg-black/40 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center space-x-1.5 bg-white/10 px-2.5 py-1 rounded-full border border-white/15">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-bold tracking-wide text-white text-[10.5px]">
            AKM ENTERPRISES
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {/* Quick Admin Access Button - STRICTLY VISIBLE ONLY TO VERIFIED ADMINS */}
          {isAdminUser && (
            <button
              id="header-admin-btn"
              onClick={() => setIsAdminOpen(true)}
              className="flex items-center space-x-1 font-bold px-2.5 py-1 rounded-full shadow-sm text-[11px] transition-transform active:scale-95 cursor-pointer bg-amber-400 hover:bg-amber-300 text-slate-950 font-black ring-1 ring-amber-300"
              title="Open Admin Control Panel"
            >
              <span>🔐 Admin</span>
            </button>
          )}

          <button
            id="header-notification-btn"
            onClick={() => setIsAnnouncementOpen(true)}
            className="bg-white/20 hover:bg-white/30 p-1.5 rounded-full text-white transition-colors cursor-pointer active:scale-95"
            title="Notifications"
          >
            <Bell className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Slider Carousel Container with Rich Photography - Compact Sleek Height */}
      <div
        className="relative h-44 sm:h-48 w-full overflow-hidden select-none cursor-grab active:cursor-grabbing"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseEnter={stopAutoPlay}
        onMouseLeave={startAutoPlay}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.03 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="absolute inset-0 flex flex-col justify-between p-3 sm:p-3.5"
          >
            {/* Real Photographic Background with Enhanced Clarity */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <img
                src={slide.imageUrl}
                alt={slide.title}
                className="w-full h-full object-cover object-center filter brightness-[0.75] contrast-105 scale-105 transition-transform duration-1000 ease-out"
                referrerPolicy="no-referrer"
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${slide.accentColor}`} />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/35 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-neutral-950/95 via-neutral-950/60 to-transparent" />
            </div>

            {/* Slide Content Header: Official AKM Badge & Category Tag */}
            <div className="relative z-10 flex items-start justify-between">
              <div className="flex flex-col items-start">
                <div className="flex items-center space-x-1.5">
                  <div className="bg-gradient-to-r from-emerald-500 to-[#00ba58] text-white px-2 py-0.5 rounded-lg shadow-md border border-white/20 flex items-center space-x-1">
                    <span className="font-black text-base tracking-tighter leading-none">
                      AKM
                    </span>
                    <span className="text-[8px] font-extrabold uppercase tracking-widest text-emerald-100">
                      GROWTH
                    </span>
                  </div>
                  <span className="flex h-1.5 w-1.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                  </span>
                </div>

                <div className="mt-1 flex items-center space-x-1">
                  <div className="h-0.5 w-2.5 bg-amber-400"></div>
                  <span className="text-[8.5px] font-black tracking-wider text-emerald-200 uppercase drop-shadow-sm">
                    {slide.title}
                  </span>
                </div>
                <div className="text-[12px] sm:text-[13px] font-black tracking-tight text-white drop-shadow-md leading-tight">
                  {slide.subtitle}
                </div>
              </div>

              {/* Badge Tag */}
              <div className="flex items-center space-x-1 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full border border-emerald-400/40 text-[8.5px] font-black text-emerald-300 shadow-md">
                <Award className="w-2.5 h-2.5 text-amber-300" />
                <span>{slide.badge}</span>
              </div>
            </div>

            {/* Middle Feature Highlights Glassmorphic Card (Compact) */}
            <div className="relative z-10 py-0.5">
              <div className="bg-black/55 backdrop-blur-md border border-white/15 rounded-xl px-2.5 py-1.5 max-w-[280px] sm:max-w-xs shadow-xl">
                <p className="text-[10px] text-gray-200 font-medium leading-tight truncate">
                  {slide.tagline}
                </p>
                <div className="mt-1 flex items-center justify-between pt-1 border-t border-white/10 text-[9.5px]">
                  <span className="text-gray-300 font-semibold">{slide.statLabel}:</span>
                  <span className="font-mono font-black text-emerald-300 flex items-center space-x-1">
                    <TrendingUp className="w-2.5 h-2.5 text-emerald-400" />
                    <span>{slide.statValue}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Slider Ribbon with Balance preview */}
            <div className="relative z-10 flex items-center justify-between bg-black/65 backdrop-blur-md rounded-lg px-2.5 py-1 border border-white/15 text-white shadow-md">
              <div className="flex items-center space-x-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-xs shadow-emerald-400"></div>
                <span className="text-[9px] font-bold text-gray-200">
                  Instant Auto-Dividend
                </span>
              </div>
              <div className="text-[10px] font-black text-emerald-300 font-mono tracking-tight">
                Wallet: {formatINR(user.balance)}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Previous / Next Arrow Controls */}
        <button
          type="button"
          onClick={handlePrev}
          className="absolute left-1.5 top-1/2 -translate-y-1/2 z-20 w-6 h-6 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-xs transition-colors cursor-pointer border border-white/10"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="absolute right-1.5 top-1/2 -translate-y-1/2 z-20 w-6 h-6 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-xs transition-colors cursor-pointer border border-white/10"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>

        {/* Carousel Pagination Dots */}
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 z-20 flex items-center space-x-1.5">
          {SLIDES.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => goToSlide(idx)}
              className={`transition-all rounded-full cursor-pointer ${
                currentSlide === idx
                  ? 'w-5 h-1 bg-emerald-400 shadow-xs shadow-emerald-400/50'
                  : 'w-1 h-1 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
