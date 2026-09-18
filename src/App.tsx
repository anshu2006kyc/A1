import React from 'react';
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
import { AdminView } from './views/AdminView';

import { BottomNav } from './components/BottomNav';
import { GatewaySimulatorModal } from './components/GatewaySimulatorModal';
import { Toast } from './components/Toast';
import { AnnouncementModal } from './components/AnnouncementModal';
import { AuthModal } from './components/AuthModal';
import { ShieldAlert, Wrench } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const {
    currentView,
    isAdminOpen,
    setIsAdminOpen,
    adminSettings,
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalInitialMode
  } = useApp();

  // If Admin Panel is open, render full-screen AdminView
  if (isAdminOpen) {
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
          AKM financial nodes are undergoing scheduled maintenance to upgrade payout speed. Regular user actions are temporarily paused.
        </p>
        <button
          id="admin-maintenance-bypass"
          onClick={() => setIsAdminOpen(true)}
          className="mt-6 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-lg active:scale-95"
        >
          Open Admin Control Panel
        </button>
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
        {/* Floating Quick Admin Access Button */}
        <button
          id="floating-admin-toggle"
          onClick={() => setIsAdminOpen(true)}
          className="fixed bottom-20 right-4 z-30 bg-slate-900/90 hover:bg-slate-950 text-amber-400 p-2.5 rounded-full shadow-xl border border-amber-400/40 backdrop-blur-md flex items-center space-x-1.5 active:scale-95 transition-all cursor-pointer group"
          title="Open Admin Control Panel"
        >
          <ShieldAlert className="w-5 h-5 text-amber-400 group-hover:rotate-12 transition-transform" />
          <span className="text-[10px] font-bold text-white pr-1">Admin</span>
        </button>

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
