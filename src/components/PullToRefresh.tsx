import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ArrowDown, RefreshCw, CheckCircle2 } from 'lucide-react';
import { sfx } from '../utils/sound';

interface PullToRefreshProps {
  children: React.ReactNode;
  onRefresh: () => Promise<void> | void;
  disabled?: boolean;
}

export const PullToRefresh: React.FC<PullToRefreshProps> = ({
  children,
  onRefresh,
  disabled = false
}) => {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const startYRef = useRef(0);
  const startXRef = useRef(0);
  const isPullingRef = useRef(false);
  const isRefreshingRef = useRef(false);

  isRefreshingRef.current = isRefreshing;

  // Thresholds
  const PULL_THRESHOLD = 64; // Distance required to trigger refresh
  const MAX_PULL = 85; // Maximum visual pull distance

  const isAtTop = useCallback(() => {
    const scrollY = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
    const containerScrollTop = containerRef.current ? containerRef.current.scrollTop : 0;
    return scrollY <= 2 && containerScrollTop <= 2;
  }, []);

  const handleTouchStart = (e: React.TouchEvent | TouchEvent) => {
    if (disabled || isRefreshingRef.current) return;
    if (isAtTop()) {
      startYRef.current = e.touches[0].clientY;
      startXRef.current = e.touches[0].clientX;
      isPullingRef.current = true;
    }
  };

  const handleTouchMove = (e: React.TouchEvent | TouchEvent) => {
    if (!isPullingRef.current || isRefreshingRef.current || disabled) return;

    const currentY = e.touches[0].clientY;
    const currentX = e.touches[0].clientX;
    const diffY = currentY - startYRef.current;
    const diffX = currentX - startXRef.current;

    // Prevent interference with horizontal gestures
    if (Math.abs(diffX) > Math.abs(diffY)) {
      isPullingRef.current = false;
      setPullDistance(0);
      return;
    }

    if (diffY > 0 && isAtTop()) {
      // Natural rubber-band resistance formula
      const distance = Math.min(MAX_PULL, Math.pow(diffY, 0.82));
      setPullDistance(distance);

      // Prevent native pull-to-refresh overscroll if we're handling it
      if (distance > 10 && e.cancelable) {
        e.preventDefault();
      }
    } else {
      setPullDistance(0);
      isPullingRef.current = false;
    }
  };

  const handleTouchEnd = async () => {
    if (!isPullingRef.current || isRefreshingRef.current || disabled) return;
    isPullingRef.current = false;

    if (pullDistance >= PULL_THRESHOLD) {
      setIsRefreshing(true);
      setPullDistance(52); // Keep indicator visible during refresh

      try {
        if ('vibrate' in navigator) {
          navigator.vibrate?.(15);
        }
      } catch {}

      try {
        await Promise.resolve(onRefresh());
        setIsSuccess(true);
        sfx.tap();
        await new Promise((res) => setTimeout(res, 450));
      } catch (err) {
        console.warn('Pull-to-refresh failed:', err);
      } finally {
        setIsSuccess(false);
        setIsRefreshing(false);
        setPullDistance(0);
      }
    } else {
      // Snap back smoothly
      setPullDistance(0);
    }
  };

  // Mouse drag support for desktop testing
  const handleMouseDown = (e: React.MouseEvent) => {
    if (disabled || isRefreshingRef.current) return;
    if (isAtTop()) {
      startYRef.current = e.clientY;
      startXRef.current = e.clientX;
      isPullingRef.current = true;
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPullingRef.current || isRefreshingRef.current || disabled) return;
    const diffY = e.clientY - startYRef.current;
    if (diffY > 0 && isAtTop()) {
      const distance = Math.min(MAX_PULL, Math.pow(diffY, 0.82));
      setPullDistance(distance);
    } else {
      setPullDistance(0);
      isPullingRef.current = false;
    }
  };

  const handleMouseUp = () => {
    if (isPullingRef.current) {
      handleTouchEnd();
    }
  };

  // Ensure touchmove events can be passive-cancelled when needed
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onNativeTouchMove = (e: TouchEvent) => {
      if (isPullingRef.current && pullDistance > 10 && e.cancelable) {
        e.preventDefault();
      }
    };

    el.addEventListener('touchmove', onNativeTouchMove, { passive: false });
    return () => {
      el.removeEventListener('touchmove', onNativeTouchMove);
    };
  }, [pullDistance]);

  const isReadyToRelease = pullDistance >= PULL_THRESHOLD;
  const progressRatio = Math.min(1, pullDistance / PULL_THRESHOLD);

  return (
    <div
      ref={containerRef}
      className="relative flex-1 flex flex-col w-full overflow-x-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Pull Indicator Header Pill */}
      <div
        className="pointer-events-none fixed left-1/2 -translate-x-1/2 z-40 transition-all duration-150 flex items-center justify-center"
        style={{
          top: isRefreshing || isSuccess ? '16px' : `${Math.max(-48, pullDistance - 44)}px`,
          opacity: pullDistance > 8 || isRefreshing || isSuccess ? 1 : 0,
          transform: `translateX(-50%) scale(${0.8 + progressRatio * 0.2})`
        }}
      >
        <div className="flex items-center space-x-2 bg-white/95 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-emerald-500/20 text-gray-800 text-xs font-semibold">
          {isSuccess ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-600 animate-bounce" />
              <span className="text-emerald-700 font-bold">Updated!</span>
            </>
          ) : isRefreshing ? (
            <>
              <RefreshCw className="w-4 h-4 text-emerald-600 animate-spin" />
              <span className="text-emerald-700 font-bold">Refreshing...</span>
            </>
          ) : (
            <>
              <ArrowDown
                className="w-4 h-4 text-emerald-600 transition-transform duration-200"
                style={{
                  transform: `rotate(${isReadyToRelease ? 180 : progressRatio * 180}deg)`
                }}
              />
              <span className={isReadyToRelease ? 'text-emerald-700 font-bold' : 'text-gray-600'}>
                {isReadyToRelease ? 'Release to refresh' : 'Pull down to refresh'}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Main Content with subtle responsive transform when pulled */}
      <div
        className="flex-1 flex flex-col w-full transition-transform"
        style={{
          transform: pullDistance > 0 ? `translateY(${Math.min(pullDistance * 0.45, 32)}px)` : 'none',
          transitionDuration: isPullingRef.current ? '0ms' : '220ms'
        }}
      >
        {children}
      </div>
    </div>
  );
};
