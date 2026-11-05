import React, { useState, useEffect, useRef } from 'react';
import { Bell, ChevronLeft, ChevronRight, ShieldCheck, TrendingUp, Zap, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { formatINR } from '../utils/currency';

import { getBladeBannerDataUri } from './BannerArtwork';

interface BannerSlide {
  id: string;
  title: string;
  subtitle: string;
  badge?: string;
  imageUrl: string;
  tagline: string;
  statLabel: string;
  statValue: string;
}

const SLIDES: BannerSlide[] = [
  {
    id: 'blade-factory-master',
    title: 'PRECISION BLADES PLANT',
    subtitle: 'AKM RAZOR BLADE DIVISION',
    badge: 'OFFICIAL BLADES PLANT',
    imageUrl: getBladeBannerDataUri('blade-factory-master'),
    tagline: 'Automated high-speed precision blade manufacturing with daily returns',
    statLabel: 'Production Speed',
    statValue: '12,000 Blades/Min'
  },
  {
    id: 'blade-cartridge-matrix',
    title: '5-BLADE COMFORT MATRIX',
    subtitle: 'PRECISION SHAVING SYSTEM',
    badge: '2-DAY TURBO RETURN',
    imageUrl: getBladeBannerDataUri('blade-cartridge-matrix'),
    tagline: 'Deposit ₹720 & earn ₹8,708 in just 48 hours Return Time',
    statLabel: 'Settlement Window',
    statValue: 'Instant Bank IMPS'
  },
  {
    id: 'blade-titanium-cutters',
    title: 'TITANIUM INDUSTRIAL CUTTERS',
    subtitle: 'HEAVY-DUTY DIAMOND COATING',
    badge: 'TITANIUM NITRIDE (TiN)',
    imageUrl: getBladeBannerDataUri('blade-titanium-cutters'),
    tagline: 'Heavy-duty industrial razor cutters for continuous compound dividends',
    statLabel: 'Security Level',
    statValue: '256-Bit Vault'
  },
  {
    id: 'blade-cryogenic-strip',
    title: 'SWEDISH CRYO RAZOR STRIPS',
    subtitle: 'HIGH-FREQUENCY ROLLING MILL',
    badge: '0.10mm CRYO STEEL',
    imageUrl: getBladeBannerDataUri('blade-cryogenic-strip'),
    tagline: 'Zero surcharge deposits and real-time IMPS direct banking',
    statLabel: 'Clearance Speed',
    statValue: '0.8s Ultra Fast'
  }
];

export const HeaderBanner: React.FC = () => {
  const {
    user,
    isAdminUser,
    setIsAdminOpen,
    setIsAnnouncementOpen,
    isNotificationModalOpen,
    setIsNotificationModalOpen,
    unreadNotificationCount,
    setCurrentView
  } = useApp();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const autoPlayRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    <div
      className="relative overflow-hidden rounded-b-3xl shadow-lg border-b border-white/20"
      style={{
        background: 'var(--brand-hero-gradient, linear-gradient(135deg, #065f46 0%, #047857 50%, #064e3b 100%))',
      }}
    >
      {/* Top Bar with Status & Admin Quick Access (Cute & Professional) */}
      <div className="relative z-20 px-3.5 pt-2 pb-1.5 flex items-center justify-between text-xs bg-emerald-950/25 backdrop-blur-md border-b border-white/15">
        <div className="flex items-center space-x-1.5 bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/25 shadow-xs">
          <ShieldCheck className="w-3 h-3 text-emerald-300" />
          <span className="font-black tracking-wider text-white text-[9.5px] uppercase">
            AKM ENTERPRISES
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </div>

        <div className="flex items-center space-x-1.5">
          {/* Quick Admin Access Button - STRICTLY VISIBLE ONLY TO VERIFIED ADMINS */}
          {isAdminUser && (
            <button
              id="header-admin-btn"
              onClick={() => setIsAdminOpen(true)}
              className="flex items-center space-x-1 font-black px-2.5 py-0.5 rounded-full shadow-sm text-[10px] transition-transform active:scale-90 cursor-pointer bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-slate-950 ring-1 ring-amber-300"
              title="Open Admin Control Panel"
            >
              <span>🔐 Admin</span>
            </button>
          )}

          <button
            id="header-notification-btn"
            onClick={() => setIsNotificationModalOpen(true)}
            className="bg-white/20 hover:bg-white/30 p-1.5 rounded-full text-white transition-all cursor-pointer active:scale-90 border border-white/20 shadow-xs relative"
            title="Notifications & Alerts"
          >
            <Bell className="w-3.5 h-3.5" />
            {unreadNotificationCount > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-400 text-slate-950 font-black text-[8.5px] rounded-full flex items-center justify-center ring-1 ring-white shadow-xs animate-pulse">
                {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main Slider Carousel Container with Rich Photography - Slimmer Proportions */}
      <div
        className="relative h-32 sm:h-36 w-full overflow-hidden select-none cursor-grab active:cursor-grabbing"
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
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="absolute inset-0 flex flex-col justify-between p-2.5 sm:p-3"
          >
            {/* Real Photographic Background with Enhanced Clarity */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <img
                src={slide.imageUrl}
                alt={slide.title}
                className="w-full h-full object-cover object-center filter brightness-[0.75] contrast-105 scale-105 transition-transform duration-1000 ease-out"
                referrerPolicy="no-referrer"
              />
              <div
                className="absolute inset-0 opacity-40 mix-blend-overlay pointer-events-none"
                style={{ background: 'var(--brand-hero-gradient)' }}
              />
              <div
                className="absolute inset-0 opacity-35 pointer-events-none"
                style={{ background: 'linear-gradient(to top, var(--brand-secondary) 0%, transparent 75%)' }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
            </div>

            {/* Slide Content Header: Official AKM Badge & Category Tag */}
            <div className="relative z-10 flex items-start justify-between">
              <div className="flex flex-col items-start">
                <div className="flex items-center space-x-1.5">
                  <div
                    className="text-white px-2 py-0.5 rounded-md shadow-md border border-white/20 flex items-center space-x-1"
                    style={{ background: 'var(--brand-chamkila-gradient)' }}
                  >
                    <span className="font-black text-xs tracking-tighter leading-none">
                      AKM
                    </span>
                    <span className="text-[7.5px] font-extrabold uppercase tracking-widest text-white/90">
                      GROWTH
                    </span>
                  </div>
                  <span className="flex h-1.5 w-1.5 relative">
                    <span
                      className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                      style={{ backgroundColor: 'var(--brand-primary)' }}
                    />
                    <span
                      className="relative inline-flex rounded-full h-1.5 w-1.5"
                      style={{ backgroundColor: 'var(--brand-primary)' }}
                    />
                  </span>
                  <div className="flex items-center space-x-1 ml-1">
                    <div className="h-0.5 w-2 bg-amber-400"></div>
                    <span className="text-[8px] font-black tracking-wider text-white uppercase drop-shadow-sm">
                      {slide.title}
                    </span>
                  </div>
                </div>

                <div className="text-[12px] sm:text-[13px] font-black tracking-tight text-white drop-shadow-md leading-tight mt-1">
                  {slide.subtitle}
                </div>
              </div>

              {/* Badge Tag */}
              <div className="flex items-center space-x-1 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/20 text-[8px] font-black text-white shadow-md">
                <Award className="w-2.5 h-2.5 text-amber-300" />
                <span>{slide.badge}</span>
              </div>
            </div>

            {/* Bottom Slider Ribbon with Stat and Balance preview */}
            <div className="relative z-10 flex items-center justify-between bg-black/45 backdrop-blur-md rounded-lg px-2.5 py-1 border border-white/20 text-white shadow-md">
              <div className="flex items-center space-x-1.5 min-w-0 pr-2">
                <div
                  className="w-1.5 h-1.5 rounded-full animate-pulse shrink-0"
                  style={{ backgroundColor: 'var(--brand-primary)' }}
                />
                <span className="text-[8.5px] font-semibold text-gray-200 truncate">
                  {slide.tagline}
                </span>
              </div>
              <div className="text-[9.5px] font-black font-mono tracking-tight shrink-0 flex items-center space-x-1 text-white">
                <TrendingUp className="w-2.5 h-2.5" style={{ color: 'var(--brand-primary)' }} />
                <span>{slide.statValue}</span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Previous / Next Arrow Controls */}
        <button
          type="button"
          onClick={handlePrev}
          className="absolute left-1.5 top-1/2 -translate-y-1/2 z-20 w-5 h-5 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-xs transition-colors cursor-pointer border border-white/20"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-3 h-3" />
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="absolute right-1.5 top-1/2 -translate-y-1/2 z-20 w-5 h-5 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-xs transition-colors cursor-pointer border border-white/20"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-3 h-3" />
        </button>

        {/* Carousel Pagination Dots */}
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 z-20 flex items-center space-x-1.5">
          {SLIDES.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => goToSlide(idx)}
              className={`transition-all rounded-full cursor-pointer ${
                currentSlide === idx
                  ? 'w-4 h-1'
                  : 'w-1 h-1 bg-white/40 hover:bg-white/70'
              }`}
              style={{
                backgroundColor: currentSlide === idx ? 'var(--brand-primary)' : undefined,
                boxShadow: currentSlide === idx ? '0 0 8px var(--brand-glow)' : undefined,
              }}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
