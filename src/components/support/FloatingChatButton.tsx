import React, { useState, useEffect, useRef, useCallback } from 'react';
import { RealSupportHeadsetIcon } from '../BrandIcons';
import { useApp } from '../../context/AppContext';
import { sfx } from '../../utils/sound';

const STORAGE_KEY = 'akm_chat_bubble_position_v1';
const BUTTON_SIZE = 48; // 48px compact circular floating button

interface Position {
  x: number;
  y: number;
}

export const FloatingChatButton: React.FC = () => {
  const { isSupportModalOpen, setIsSupportModalOpen, supportMessages, user, currentView } = useApp();

  const [position, setPosition] = useState<Position | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const dragInfoRef = useRef<{
    startX: number;
    startY: number;
    originX: number;
    originY: number;
    hasMoved: boolean;
  }>({
    startX: 0,
    startY: 0,
    originX: 0,
    originY: 0,
    hasMoved: false
  });

  const buttonRef = useRef<HTMLDivElement>(null);

  // Compute default initial position on screen
  const getDefaultPosition = useCallback((): Position => {
    if (typeof window === 'undefined') return { x: 280, y: 550 };
    const winWidth = window.innerWidth;
    const winHeight = window.innerHeight;

    const hasBottomNav = ['home', 'share', 'team', 'profile', 'checkin'].includes(currentView);
    const bottomOffset = hasBottomNav ? 88 : 32;

    // Center in the mobile frame if screen is wide
    const maxContainerWidth = 448; // max-w-md
    let targetX: number;
    if (winWidth > maxContainerWidth) {
      const containerRight = (winWidth + maxContainerWidth) / 2;
      targetX = containerRight - BUTTON_SIZE - 16;
    } else {
      targetX = winWidth - BUTTON_SIZE - 16;
    }

    const targetY = Math.max(60, winHeight - BUTTON_SIZE - bottomOffset);

    return {
      x: Math.max(10, Math.min(targetX, winWidth - BUTTON_SIZE - 10)),
      y: Math.max(40, Math.min(targetY, winHeight - BUTTON_SIZE - 10))
    };
  }, [currentView]);

  // Load saved position or default on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed?.x === 'number' && typeof parsed?.y === 'number') {
          // Verify it's within current window bounds
          const winWidth = window.innerWidth;
          const winHeight = window.innerHeight;
          const clampedX = Math.max(10, Math.min(parsed.x, winWidth - BUTTON_SIZE - 10));
          const clampedY = Math.max(40, Math.min(parsed.y, winHeight - BUTTON_SIZE - 10));
          setPosition({ x: clampedX, y: clampedY });
          return;
        }
      }
    } catch {
      // Ignore localStorage errors
    }
    setPosition(getDefaultPosition());
  }, [getDefaultPosition]);

  // Adjust on window resize so button doesn't end up offscreen
  useEffect(() => {
    const handleResize = () => {
      setPosition((prev) => {
        if (!prev) return getDefaultPosition();
        const winWidth = window.innerWidth;
        const winHeight = window.innerHeight;
        return {
          x: Math.max(10, Math.min(prev.x, winWidth - BUTTON_SIZE - 10)),
          y: Math.max(40, Math.min(prev.y, winHeight - BUTTON_SIZE - 10))
        };
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [getDefaultPosition]);

  // Handle pointer down (mouse and touch)
  const handlePointerDown = (e: React.PointerEvent) => {
    // Only respond to primary click / single touch
    if (e.button !== 0 && e.pointerType === 'mouse') return;

    const currentPos = position || getDefaultPosition();
    dragInfoRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      originX: currentPos.x,
      originY: currentPos.y,
      hasMoved: false
    };

    setIsDragging(true);

    const onPointerMove = (moveEvent: PointerEvent) => {
      const dx = moveEvent.clientX - dragInfoRef.current.startX;
      const dy = moveEvent.clientY - dragInfoRef.current.startY;

      // Distance threshold to differentiate tap vs drag
      if (!dragInfoRef.current.hasMoved && Math.hypot(dx, dy) > 5) {
        dragInfoRef.current.hasMoved = true;
      }

      if (dragInfoRef.current.hasMoved) {
        const winWidth = window.innerWidth;
        const winHeight = window.innerHeight;

        const rawX = dragInfoRef.current.originX + dx;
        const rawY = dragInfoRef.current.originY + dy;

        const nextX = Math.max(8, Math.min(rawX, winWidth - BUTTON_SIZE - 8));
        const nextY = Math.max(36, Math.min(rawY, winHeight - BUTTON_SIZE - 12));

        setPosition({ x: nextX, y: nextY });
      }
    };

    const onPointerUp = () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);

      setIsDragging(false);

      if (dragInfoRef.current.hasMoved) {
        // Save final dragged position
        setPosition((latest) => {
          if (latest) {
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(latest));
            } catch {
              // Ignore localStorage error
            }
          }
          return latest;
        });
      } else {
        // Was a tap/click -> trigger Contact Support Modal
        sfx.playTap();
        setIsSupportModalOpen(true);
      }
    };

    window.addEventListener('pointermove', onPointerMove, { passive: false });
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
  };

  if (isSupportModalOpen || !position) return null;

  // Count unread replies or active pending messages for this user
  const userTickets = supportMessages.filter((m) => m.userId === user.id);
  const unreadRepliesCount = userTickets.filter((m) => m.adminReply && m.status === 'resolved').length;
  const pendingCount = userTickets.filter((m) => m.status === 'pending').length;

  return (
    <div
      ref={buttonRef}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        touchAction: 'none',
        userSelect: 'none',
        WebkitUserSelect: 'none'
      }}
      onPointerDown={handlePointerDown}
      className={`fixed top-0 left-0 z-50 pointer-events-auto transition-transform ${
        isDragging ? 'duration-0 cursor-grabbing scale-110' : 'duration-150 cursor-grab hover:scale-105 active:scale-95'
      }`}
      title="Contact Support (Movable - drag anywhere)"
      aria-label="Contact Investment Support"
    >
      {/* Compact Circular Support Button without animations */}
      <div
        className="relative w-12 h-12 rounded-full flex items-center justify-center text-white shadow-xl border border-white/30 backdrop-blur-xs select-none"
        style={{
          background: 'linear-gradient(135deg, #059669 0%, #047857 50%, #064e3b 100%)',
          boxShadow: isDragging
            ? '0 12px 28px -4px rgba(4, 120, 87, 0.6), 0 0 0 2px rgba(52, 211, 153, 0.4)'
            : '0 8px 20px -3px rgba(4, 120, 87, 0.45)'
        }}
      >
        {/* Real Customer Support Headset with mic */}
        <div className="relative flex items-center justify-center">
          <RealSupportHeadsetIcon className="w-5.5 h-5.5 text-white drop-shadow-xs" size={22} />
          {/* Active online green dot (static, no pulse) */}
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-400 rounded-full ring-2 ring-emerald-950" />
        </div>

        {/* Badge indicator for new reply or pending ticket (static, no bounce) */}
        {unreadRepliesCount > 0 ? (
          <span className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full bg-rose-500 text-white font-black text-[7.5px] ring-1.5 ring-white shadow-md">
            Reply
          </span>
        ) : pendingCount > 0 ? (
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-amber-400 text-amber-950 font-black text-[7.5px] ring-1.5 ring-white flex items-center justify-center shadow-md">
            {pendingCount}
          </span>
        ) : null}
      </div>
    </div>
  );
};
