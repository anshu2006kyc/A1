import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { AppProvider, useApp } from './context/AppContext';
import { HomeView } from './views/HomeView';
import { RechargeView } from './views/RechargeView';
import { WithdrawView } from './views/WithdrawView';
import { CheckInView } from './views/CheckInView';
import { ShareView } from './views/ShareView';
import { TeamView } from './views/TeamView';
import { ProfileView } from './views/ProfileView';
import { AboutView } from './views/AboutView';
import { BankView } from './views/BankView';
import { MyProductsView } from './views/MyProductsView';
import { TransactionsView } from './views/TransactionsView';
import { PaymentCashierView } from './views/PaymentCashierView';
import { PasswordView } from './views/PasswordView';
import { AdminView } from './views/AdminView';

import { BottomNav } from './components/BottomNav';
import { GatewaySimulatorModal } from './components/GatewaySimulatorModal';
import { Toast } from './components/Toast';
import { AnnouncementModal } from './components/AnnouncementModal';
import { AuthModal } from './components/AuthModal';
import { AdminAuthModal } from './components/AdminAuthModal';
import { MobileAuthGate } from './components/MobileAuthGate';
import { Lock, ShieldAlert, Wrench } from 'lucide-react';

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
        <AdminView />
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
              {renderView()}
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
