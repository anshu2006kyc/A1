import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Bell, Check, Clock, Gift, ShieldCheck, X, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatINR } from '../utils/currency';

export const AnnouncementModal: React.FC = () => {
  const { isAnnouncementOpen, setIsAnnouncementOpen, adminSettings } = useApp();

  // Prevent background scrolling while modal is open
  useEffect(() => {
    if (!isAnnouncementOpen) return;
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [isAnnouncementOpen]);

  if (!isAnnouncementOpen) return null;

  return createPortal(
    <div
      onClick={() => setIsAnnouncementOpen(false)}
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-gray-100 relative animate-scale-up my-auto cursor-default max-h-[92vh] overflow-y-auto"
      >
        {/* Top Close X Button */}
        <button
          id="close-announcement-x"
          onClick={() => setIsAnnouncementOpen(false)}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors cursor-pointer active:scale-95"
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex flex-col items-center text-center">
          {/* Icon Header */}
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#00a859] to-[#25d366] text-white flex items-center justify-center mb-3 shadow-lg shadow-emerald-600/30">
            <Bell className="w-7 h-7" />
          </div>

          <h3 className="text-base font-extrabold text-gray-900">
            {adminSettings.announcementTitle || 'Platform Notification'}
          </h3>
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full mt-1 border border-emerald-200">
            {adminSettings.announcementTag || 'Official AKM Notice'}
          </span>

          {adminSettings.announcementMessage && (
            <p className="mt-2 text-xs text-gray-600 px-1 leading-relaxed bg-amber-50/70 border border-amber-200/60 p-2.5 rounded-xl text-amber-900 font-medium text-left">
              {adminSettings.announcementMessage}
            </p>
          )}

          <div className="w-full space-y-2.5 text-left text-xs text-gray-700 mt-3 bg-gray-50 p-3.5 rounded-2xl border border-gray-100">
            <div className="flex items-start space-x-2">
              <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </div>
              <p className="leading-snug">
                <strong>Instant UPI Topup:</strong> Automated UPI auto-credit channels are operational 24/7 with zero recharge fee.
              </p>
            </div>

            <div className="flex items-start space-x-2">
              <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                <Clock className="w-2.5 h-2.5" />
              </div>
              <p className="leading-snug">
                <strong>Withdrawal Timings:</strong> Daily window from{' '}
                <span className="font-bold text-emerald-800">
                  {adminSettings.withdrawStartTime} to {adminSettings.withdrawEndTime} IST
                </span>.
              </p>
            </div>

            <div className="flex items-start space-x-2">
              <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                <Gift className="w-2.5 h-2.5" />
              </div>
              <p className="leading-snug">
                <strong>Daily Check-in:</strong> Claim your free daily reward of{' '}
                <span className="font-bold text-emerald-800 tabular-nums">{formatINR(adminSettings.dailyCheckInReward, { decimals: 0 })}</span>{' '}
                every day from the Check-In screen.
              </p>
            </div>
          </div>

          {/* Large, Prominent Close Button */}
          <button
            id="close-announcement-btn"
            onClick={() => setIsAnnouncementOpen(false)}
            className="w-full mt-4 py-3.5 rounded-2xl btn-chamkila text-white font-black text-sm shadow-lg hover:brightness-110 active:scale-98 transition-all cursor-pointer flex items-center justify-center space-x-1.5 tracking-wide"
          >
            <span className="drop-shadow-xs">Understood & Close</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
