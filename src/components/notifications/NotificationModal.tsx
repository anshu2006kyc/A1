import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Bell,
  Check,
  CheckCheck,
  ChevronRight,
  Clock,
  Coins,
  CreditCard,
  Flame,
  Info,
  ShieldCheck,
  Sparkles,
  Trash2,
  Volume2,
  VolumeX,
  X,
  Zap,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AppNotification, NotificationType } from '../../types';
import { formatINR } from '../../utils/currency';
import { sfx } from '../../utils/sound';

export const NotificationModal: React.FC = () => {
  const {
    isNotificationModalOpen,
    setIsNotificationModalOpen,
    notifications,
    unreadNotificationCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearAllNotifications,
    deleteNotification,
    sendLocalNotification,
    notificationPermission,
    requestBrowserNotificationPermission,
    isNotificationSoundEnabled,
    toggleNotificationSound,
    setCurrentView,
    user
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'interest' | 'withdrawal'>('all');
  const [showTestMenu, setShowTestMenu] = useState(false);

  // Prevent background scrolling while modal is open
  useEffect(() => {
    if (!isNotificationModalOpen) return;
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [isNotificationModalOpen]);

  if (!isNotificationModalOpen) return null;

  // Filter notifications for current user
  const userNotifications = notifications.filter((n) => !n.userId || n.userId === user.id);

  const filteredNotifications = userNotifications.filter((n) => {
    if (activeFilter === 'unread') return !n.read;
    if (activeFilter === 'interest') return n.type === 'interest_credit';
    if (activeFilter === 'withdrawal') return n.type === 'withdrawal_status';
    return true;
  });

  const interestCount = userNotifications.filter((n) => n.type === 'interest_credit').length;
  const withdrawalCount = userNotifications.filter((n) => n.type === 'withdrawal_status').length;

  const handleNotificationClick = (item: AppNotification) => {
    sfx.playTap();
    if (!item.read) {
      markNotificationAsRead(item.id);
    }
    if (item.linkView) {
      setIsNotificationModalOpen(false);
      setCurrentView(item.linkView as any);
    }
  };

  const handleTestNotification = (type: 'interest' | 'withdrawal_success' | 'withdrawal_failed') => {
    setShowTestMenu(false);
    if (type === 'interest') {
      sendLocalNotification({
        userId: user.id,
        type: 'interest_credit',
        title: 'Daily Interest Credited! 💰',
        body: `₹250.00 daily return from "1 Minute Flash Express" has been successfully credited to your wallet balance.`,
        amount: 250,
        status: 'success',
        linkView: 'myproducts'
      });
    } else if (type === 'withdrawal_success') {
      const mockRrn = Date.now().toString().slice(-12);
      sendLocalNotification({
        userId: user.id,
        type: 'withdrawal_status',
        title: 'Withdrawal Approved & Disbursed! 🎉',
        body: `Your payout of ₹1,000.00 (Order #WD-${Date.now().toString().slice(-6)}) has been approved and transferred to your bank via IMPS RRN #${mockRrn}.`,
        amount: 1000,
        status: 'success',
        linkView: 'transactions',
        utrNumber: mockRrn
      });
    } else {
      sendLocalNotification({
        userId: user.id,
        type: 'withdrawal_status',
        title: 'Withdrawal Request Rejected ⚠️',
        body: `Withdrawal request for ₹800.00 was rejected due to bank account mismatch. ₹800.00 has been refunded to your wallet.`,
        amount: 800,
        status: 'failed',
        linkView: 'transactions'
      });
    }
  };

  return createPortal(
    <div
      onClick={() => setIsNotificationModalOpen(false)}
      className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 relative animate-scale-up my-auto cursor-default flex flex-col max-h-[92vh] overflow-hidden"
      >
        {/* Modal Top Header */}
        <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 via-white to-emerald-50/40">
          <div className="flex items-center space-x-2.5">
            <div
              className="w-10 h-10 rounded-2xl text-white flex items-center justify-center shadow-md relative"
              style={{
                background: 'var(--brand-chamkila-gradient, linear-gradient(135deg, #008f4c 0%, #00a859 100%))'
              }}
            >
              <Bell className="w-5 h-5" />
              {unreadNotificationCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 text-slate-950 font-black text-[9.5px] rounded-full flex items-center justify-center shadow-xs animate-bounce">
                  {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
                </span>
              )}
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h3 className="text-base font-black text-gray-900 tracking-tight">
                  Notification Center
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Live Alerts
                </span>
              </div>
              <p className="text-[11px] text-gray-500 font-medium">
                Daily interest credits & withdrawal status updates
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            {/* Sound Toggle */}
            <button
              onClick={() => {
                sfx.playTap();
                toggleNotificationSound();
              }}
              className={`p-2 rounded-xl transition-all cursor-pointer ${
                isNotificationSoundEnabled
                  ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                  : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
              }`}
              title={isNotificationSoundEnabled ? 'Notification Sound Enabled' : 'Notification Sound Muted'}
            >
              {isNotificationSoundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Close Button */}
            <button
              id="close-notifications-btn"
              onClick={() => setIsNotificationModalOpen(false)}
              className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 transition-all cursor-pointer active:scale-95"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Browser System Permission & Fast Testing Bar */}
        <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-100 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <span
              className={`w-2 h-2 rounded-full ${
                notificationPermission === 'granted'
                  ? 'bg-emerald-500 animate-pulse'
                  : notificationPermission === 'denied'
                  ? 'bg-rose-500'
                  : 'bg-amber-400'
              }`}
            />
            <span className="text-[11px] font-bold text-gray-700">
              {notificationPermission === 'granted'
                ? 'System Alerts Active'
                : notificationPermission === 'denied'
                ? 'Browser Alerts Blocked'
                : 'System Alerts Ready'}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {notificationPermission !== 'granted' && notificationPermission !== 'unsupported' && (
              <button
                onClick={async () => {
                  sfx.playTap();
                  await requestBrowserNotificationPermission();
                }}
                className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] shadow-xs cursor-pointer active:scale-95 transition-all"
              >
                Enable Push
              </button>
            )}

            {/* Test Notification Trigger Menu */}
            <div className="relative">
              <button
                onClick={() => setShowTestMenu(!showTestMenu)}
                className="px-2 py-1 rounded-lg bg-white border border-gray-200 hover:bg-gray-100 text-gray-700 font-bold text-[10px] shadow-2xs cursor-pointer active:scale-95 flex items-center space-x-1"
                title="Send a sample alert"
              >
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>Simulate</span>
              </button>

              {showTestMenu && (
                <div className="absolute right-0 top-full mt-1.5 w-56 bg-white rounded-2xl shadow-xl border border-gray-200 p-2 z-30 animate-fade-in space-y-1">
                  <div className="text-[10px] font-extrabold text-gray-400 px-2 py-1 uppercase tracking-wider">
                    Test Trigger
                  </div>
                  <button
                    onClick={() => handleTestNotification('interest')}
                    className="w-full text-left p-2 rounded-xl hover:bg-emerald-50 text-emerald-900 text-xs font-bold flex items-center space-x-2 transition-colors cursor-pointer"
                  >
                    <Coins className="w-3.5 h-3.5 text-emerald-600" />
                    <span>💰 Interest Credited (+₹250)</span>
                  </button>
                  <button
                    onClick={() => handleTestNotification('withdrawal_success')}
                    className="w-full text-left p-2 rounded-xl hover:bg-emerald-50 text-emerald-900 text-xs font-bold flex items-center space-x-2 transition-colors cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                    <span>✅ Withdrawal Paid (+₹1,000)</span>
                  </button>
                  <button
                    onClick={() => handleTestNotification('withdrawal_failed')}
                    className="w-full text-left p-2 rounded-xl hover:bg-rose-50 text-rose-900 text-xs font-bold flex items-center space-x-2 transition-colors cursor-pointer"
                  >
                    <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                    <span>⚠️ Withdrawal Rejected</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Filter Navigation Chips & Action Buttons */}
        <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
          <div className="flex items-center space-x-1.5 shrink-0">
            <button
              onClick={() => {
                sfx.playTap();
                setActiveFilter('all');
              }}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-gray-900 text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All ({userNotifications.length})
            </button>

            <button
              onClick={() => {
                sfx.playTap();
                setActiveFilter('unread');
              }}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center space-x-1 ${
                activeFilter === 'unread'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
              }`}
            >
              <span>Unread</span>
              {unreadNotificationCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black flex items-center justify-center">
                  {unreadNotificationCount}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                sfx.playTap();
                setActiveFilter('interest');
              }}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center space-x-1 ${
                activeFilter === 'interest'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
              }`}
            >
              <Coins className="w-3 h-3" />
              <span>Interest ({interestCount})</span>
            </button>

            <button
              onClick={() => {
                sfx.playTap();
                setActiveFilter('withdrawal');
              }}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center space-x-1 ${
                activeFilter === 'withdrawal'
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'bg-teal-50 text-teal-800 hover:bg-teal-100'
              }`}
            >
              <CreditCard className="w-3 h-3" />
              <span>Payouts ({withdrawalCount})</span>
            </button>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            {unreadNotificationCount > 0 && (
              <button
                onClick={() => {
                  sfx.playTap();
                  markAllNotificationsAsRead();
                }}
                className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 flex items-center space-x-1 cursor-pointer"
                title="Mark all as read"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Mark read</span>
              </button>
            )}

            {userNotifications.length > 0 && (
              <button
                onClick={() => {
                  sfx.playTap();
                  clearAllNotifications();
                }}
                className="text-[11px] font-bold text-gray-400 hover:text-rose-600 flex items-center space-x-1 cursor-pointer transition-colors"
                title="Clear all notifications"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Notification List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5 max-h-[58vh]">
          {filteredNotifications.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center text-gray-400">
              <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-300 mb-3 border border-gray-100">
                <Bell className="w-6 h-6 stroke-[1.5]" />
              </div>
              <h4 className="text-sm font-bold text-gray-700">No Notifications Here</h4>
              <p className="text-xs text-gray-400 max-w-xs mt-1">
                {activeFilter === 'unread'
                  ? 'All caught up! You have read all notifications.'
                  : activeFilter === 'interest'
                  ? 'Daily interest credit notifications will appear here when your investment plans earn profit.'
                  : activeFilter === 'withdrawal'
                  ? 'Withdrawal status updates (Approved, Disbursed, or Refunded) will appear here.'
                  : 'New activity, interest credits, and withdrawal status changes will appear here.'}
              </p>
              <button
                onClick={() => handleTestNotification('interest')}
                className="mt-4 px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold border border-emerald-200 cursor-pointer transition-all"
              >
                Simulate Sample Alert
              </button>
            </div>
          ) : (
            filteredNotifications.map((item) => {
              const isInterest = item.type === 'interest_credit';
              const isWithdrawal = item.type === 'withdrawal_status';
              const isSuccess = item.status === 'success';
              const isFailed = item.status === 'failed';
              const isPending = item.status === 'pending';

              return (
                <div
                  key={item.id}
                  onClick={() => handleNotificationClick(item)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative group ${
                    item.read
                      ? 'bg-white border-gray-100 hover:border-gray-200 hover:shadow-2xs opacity-90'
                      : 'bg-emerald-50/40 border-emerald-200 hover:border-emerald-300 shadow-xs'
                  }`}
                >
                  {/* Unread Accent Dot */}
                  {!item.read && (
                    <span className="absolute top-3.5 right-3.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-200 animate-pulse" />
                  )}

                  <div className="flex items-start space-x-3">
                    {/* Icon Badge */}
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-xs ${
                        isInterest
                          ? 'bg-gradient-to-tr from-emerald-500 to-teal-500 text-white'
                          : isWithdrawal
                          ? isSuccess
                            ? 'bg-gradient-to-tr from-emerald-600 to-green-500 text-white'
                            : isFailed
                            ? 'bg-gradient-to-tr from-rose-500 to-red-600 text-white'
                            : 'bg-gradient-to-tr from-amber-400 to-yellow-500 text-slate-950'
                          : 'bg-gradient-to-tr from-indigo-500 to-purple-500 text-white'
                      }`}
                    >
                      {isInterest ? (
                        <Coins className="w-5 h-5" />
                      ) : isWithdrawal ? (
                        isSuccess ? (
                          <Check className="w-5 h-5 stroke-[3]" />
                        ) : isFailed ? (
                          <AlertCircle className="w-5 h-5" />
                        ) : (
                          <Clock className="w-5 h-5" />
                        )
                      ) : (
                        <Bell className="w-5 h-5" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 pr-4">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-black text-gray-900 tracking-tight line-clamp-1">
                          {item.title}
                        </span>
                      </div>

                      <p className="text-[11.5px] text-gray-600 mt-1 leading-relaxed">
                        {item.body}
                      </p>

                      {/* Footer Info Row */}
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100/80 text-[10.5px]">
                        <span className="text-gray-400 font-medium">
                          {item.timestamp}
                        </span>

                        <div className="flex items-center space-x-2">
                          {item.amount && item.amount > 0 && (
                            <span
                              className={`font-mono font-black ${
                                isFailed
                                  ? 'text-rose-600'
                                  : isSuccess || isInterest
                                  ? 'text-emerald-700'
                                  : 'text-amber-700'
                              }`}
                            >
                              {isFailed ? 'Refund: ' : '+'}{formatINR(item.amount)}
                            </span>
                          )}

                          {item.linkView && (
                            <span className="inline-flex items-center text-emerald-700 font-bold group-hover:translate-x-0.5 transition-transform">
                              <span>Open</span>
                              <ChevronRight className="w-3 h-3 ml-0.5" />
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Delete Single Notification Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      sfx.playTap();
                      deleteNotification(item.id);
                    }}
                    className="absolute bottom-2 right-2 p-1 text-gray-300 hover:text-rose-500 rounded-lg hover:bg-rose-50 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                    title="Delete"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Bottom Information Footer */}
        <div className="p-3.5 bg-gray-50 border-t border-gray-100 text-center flex items-center justify-between text-[11px] text-gray-500">
          <div className="flex items-center space-x-1.5 text-emerald-700 font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>AKM Local Alert System</span>
          </div>
          <button
            onClick={() => setIsNotificationModalOpen(false)}
            className="px-4 py-1.5 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold cursor-pointer active:scale-95 transition-all text-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
