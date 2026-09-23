import React, { useEffect, useState, lazy, Suspense } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { AppProvider, useApp } from './context/AppContext';
import { HomeView } from './views/HomeView';

// Code-split / Lazy load secondary views for fast initial load & reduced bundle size
const RechargeView = lazy(() => import('./views/RechargeView').then((m) => ({ default: m.RechargeView })));
const WithdrawView = lazy(() => import('./views/WithdrawView').then((m) => ({ default: m.WithdrawView })));
const CheckInView = lazy(() => import('./views/CheckInView').then((m) => ({ default: m.CheckInView })));
const ShareView = lazy(() => import('./views/ShareView').then((m) => ({ default: m.ShareView })));
const TeamView = lazy(() => import('./views/TeamView').then((m) => ({ default: m.TeamView })));
const ProfileView = lazy(() => import('./views/ProfileView').then((m) => ({ default: m.ProfileView })));
const AboutView = lazy(() => import('./views/AboutView').then((m) => ({ default: m.AboutView })));
const BankView = lazy(() => import('./views/BankView').then((m) => ({ default: m.BankView })));
const MyProductsView = lazy(() => import('./views/MyProductsView').then((m) => ({ default: m.MyProductsView })));
const TransactionsView = lazy(() => import('./views/TransactionsView').then((m) => ({ default: m.TransactionsView })));
const PaymentCashierView = lazy(() => import('./views/PaymentCashierView').then((m) => ({ default: m.PaymentCashierView })));
const PasswordView = lazy(() => import('./views/PasswordView').then((m) => ({ default: m.PasswordView })));
const AdminView = lazy(() => import('./views/AdminView').then((m) => ({ default: m.AdminView })));

import { BottomNav } from './components/BottomNav';
import { GatewaySimulatorModal } from './components/GatewaySimulatorModal';
import { Toast } from './components/Toast';
import { AnnouncementModal } from './components/AnnouncementModal';
import { AuthModal } from './components/AuthModal';
import { AdminAuthModal } from './components/AdminAuthModal';
import { MobileAuthGate } from './components/MobileAuthGate';
import { Lock, ShieldAlert, Wrench } from 'lucide-react';

const ViewLoadingFallback = () => (
  <div className="flex-1 flex flex-col items-center justify-center p-8 min-h-[50vh]">
    <div className="w-10 h-10 border-3 border-emerald-500/20 border-t-emerald-600 rounded-full animate-spin" />
    <span className="mt-3 text-xs font-semibold text-gray-500 animate-pulse tracking-wide">
      Loading...
    </span>
  </div>
);

const MainAppContent: React.FC = () => {
  const {
    currentView,
    isAdminOpen,
    setIsAdminOpen,
    isAdminUser,
    adminSettings,
    isLoggedIn,
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalInitialMode,
    openPaymentPage
  } = useApp();
  const [isAdminAuthModalOpen, setIsAdminAuthModalOpen] = useState(false);

  // Intercept payment cashier deep links (e.g. /pay/watchpay-redirect?order_id=...&amount=...)
  useEffect(() => {
    try {
      const url = new URL(window.location.href);
      const pathname = url.pathname.toLowerCase();
      const orderId = url.searchParams.get('order_id') || url.searchParams.get('orderId');
      const amountParam = url.searchParams.get('amount');
      const parsedAmount = amountParam ? parseFloat(amountParam) : 0;

      if (pathname.includes('/pay') || orderId) {
        const finalOrderId = orderId || `ORD${Date.now()}`;
        const finalAmount = parsedAmount > 0 ? parsedAmount : 500;
        const channel = pathname.includes('sunpay') ? 'UPI Express Channel' : 'UPI Fast Channel';
        openPaymentPage(finalAmount, channel, finalOrderId);

        // Normalize URL to root without page reload
        window.history.replaceState({}, document.title, window.location.origin + '/');
      }
    } catch (err) {
      console.warn('Error checking payment deep link:', err);
    }
  }, [openPaymentPage]);

  // If Admin Panel is open, ensure user has admin authorization
  if (isAdminOpen) {
    if (!isAdminUser) {
      return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
          <AdminAuthModal
            isOpen={true}
            onClose={() => setIsAdminOpen(false)}
            onSuccess={() => setIsAdminOpen(true)}
          />
        </div>
      );
    }
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100">
        <Suspense fallback={<ViewLoadingFallback />}>
          <AdminView />
        </Suspense>
        <Toast />
      </div>
    );
  }

  // Maintenance mode active
  if (adminSettings.maintenanceMode) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center text-white relative animate-fade-in">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center mb-4 animate-float">
          <Wrench className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-black tracking-wide">Platform Maintenance Mode</h2>
        <p className="text-xs text-slate-400 max-w-xs mt-2 leading-relaxed">
          AKM financial systems are undergoing scheduled maintenance to upgrade payout speed. Regular user actions are temporarily paused.
        </p>
        {isAdminUser && (
          <button
            id="admin-maintenance-bypass"
            onClick={() => setIsAdminOpen(true)}
            className="mt-6 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-lg active:scale-95"
          >
            Open Admin Control Panel
          </button>
        )}
      </div>
    );
  }

  // 100% Gated: Without Mobile Registration / Login, nobody can access or use any view
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-100 flex justify-center selection:bg-emerald-500 selection:text-white">
        <div className="w-full max-w-md bg-white min-h-screen shadow-2xl relative flex flex-col">
          <MobileAuthGate />
          <Toast />
        </div>
      </div>
    );
  }

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <HomeView />;
      case 'recharge':
        return <RechargeView />;
      case 'payment':
        return <PaymentCashierView />;
      case 'withdraw':
        return <WithdrawView />;
      case 'checkin':
        return <CheckInView />;
      case 'share':
        return <ShareView />;
      case 'team':
        return <TeamView />;
      case 'profile':
        return <ProfileView />;
      case 'about':
        return <AboutView />;
      case 'bank':
        return <BankView />;
      case 'myproducts':
        return <MyProductsView />;
      case 'transactions':
        return <TransactionsView />;
      case 'password':
        return <PasswordView />;
      default:
        return <HomeView />;
    }
  };

  // Views that display the persistent bottom navigation bar
  const showBottomNav = ['home', 'share', 'team', 'profile', 'checkin'].includes(currentView);

  return (
    <div className="min-h-screen bg-neutral-900 flex justify-center selection:bg-emerald-500 selection:text-white">
      {/* Mobile-sized container with high-end app layout */}
      <div className="w-full max-w-md bg-white min-h-screen shadow-2xl relative flex flex-col">
        {/* Dynamic View Component with smooth view transitions */}
        <main className="flex-1 overflow-x-hidden flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="flex-1 flex flex-col"
            >
              <Suspense fallback={<ViewLoadingFallback />}>
                {renderView()}
              </Suspense>
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Global Modals & Notifications */}
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          initialMode={authModalInitialMode}
        />
        <AdminAuthModal
          isOpen={isAdminAuthModalOpen}
          onClose={() => setIsAdminAuthModalOpen(false)}
        />
        <GatewaySimulatorModal />
        <AnnouncementModal />
        <Toast />

        {/* Bottom Navigation */}
        {showBottomNav && <BottomNav />}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
