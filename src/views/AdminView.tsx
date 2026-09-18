import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Activity,
  AlertOctagon,
  ArrowDownToLine,
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  Clock,
  CreditCard,
  Database,
  ExternalLink,
  Layers,
  LayoutDashboard,
  LogOut,
  Megaphone,
  Menu,
  RefreshCw,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sliders,
  Terminal,
  Users,
  Wallet,
  X,
  Zap
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AdminTabId, AdminTabNav } from '../components/admin/AdminTabNav';
import { AdminOverviewTab } from '../components/admin/AdminOverviewTab';
import { AdminAnalyticsTab } from '../components/admin/AdminAnalyticsTab';
import { AdminUsersTab } from '../components/admin/AdminUsersTab';
import { AdminDepositsTab } from '../components/admin/AdminDepositsTab';
import { AdminWithdrawalsTab } from '../components/admin/AdminWithdrawalsTab';
import { AdminPlansTab } from '../components/admin/AdminPlansTab';
import { AdminEngineTab } from '../components/admin/AdminEngineTab';
import { AdminRiskTab } from '../components/admin/AdminRiskTab';
import { AdminBroadcastTab } from '../components/admin/AdminBroadcastTab';
import { AdminGatewayTab } from '../components/admin/AdminGatewayTab';
import { AdminBackupTab } from '../components/admin/AdminBackupTab';
import { AdminLogsTab } from '../components/admin/AdminLogsTab';
import { formatINR } from '../utils/currency';

export const AdminView: React.FC = () => {
  const {
    setIsAdminOpen,
    adminSettings,
    transactions,
    securityAlerts,
    registeredUsers,
    user,
    plans
  } = useApp();

  const [activeTab, setActiveTab] = useState<AdminTabId>('overview');
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const pendingDepositsCount = transactions.filter(
    (t) => t.type === 'recharge' && t.status === 'pending'
  ).length;

  const pendingWithdrawalsCount = transactions.filter(
    (t) => t.type === 'withdraw' && t.status === 'pending'
  ).length;

  const unresolvedAlertsCount = securityAlerts.filter((a) => !a.resolved).length;

  const tabGroups: {
    category: string;
    items: {
      id: AdminTabId;
      label: string;
      icon: React.FC<{ className?: string }>;
      badge?: number;
      badgeColor?: string;
    }[];
  }[] = [
    {
      category: 'Financial Core',
      items: [
        { id: 'overview', label: 'Overview Hub', icon: LayoutDashboard },
        { id: 'analytics', label: 'Treasury Analytics', icon: BarChart3 },
        {
          id: 'deposits',
          label: 'Deposit Orders',
          icon: Wallet,
          badge: pendingDepositsCount,
          badgeColor: 'bg-emerald-400 text-slate-950'
        },
        {
          id: 'withdrawals',
          label: 'Payout Ledger',
          icon: ArrowDownToLine,
          badge: pendingWithdrawalsCount,
          badgeColor: 'bg-amber-400 text-slate-950'
        }
      ]
    },
    {
      category: 'Asset & Gateways',
      items: [
        { id: 'plans', label: 'Products Portfolio', icon: Layers },
        { id: 'engine', label: 'Turbo Engine', icon: Zap },
        { id: 'gateway', label: 'Sunpays Gateway', icon: CreditCard }
      ]
    },
    {
      category: 'Security & Operations',
      items: [
        { id: 'users', label: 'Users Directory', icon: Users },
        {
          id: 'risk',
          label: 'Risk Shield',
          icon: ShieldAlert,
          badge: unresolvedAlertsCount,
          badgeColor: 'bg-rose-500 text-white'
        },
        { id: 'broadcast', label: 'Broadcast Center', icon: Megaphone },
        { id: 'logs', label: 'Audit Logs', icon: Terminal },
        { id: 'backup', label: 'Backup & Recovery', icon: Database }
      ]
    }
  ];

  const currentTabMeta = tabGroups
    .flatMap((g) => g.items)
    .find((item) => item.id === activeTab);

  const handleSelectTab = (id: AdminTabId) => {
    setActiveTab(id);
    setMobileDrawerOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col lg:flex-row antialiased selection:bg-emerald-500 selection:text-white">
      {/* ============================================================ */}
      {/* DESKTOP SIDEBAR (Visible on lg and larger screens)           */}
      {/* ============================================================ */}
      <aside className="hidden lg:flex flex-col w-72 bg-slate-900/95 border-r border-slate-800/80 shrink-0 sticky top-0 h-screen overflow-y-auto">
        {/* Brand Top Block */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 via-teal-500 to-emerald-700 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/20 ring-2 ring-emerald-400/20 shrink-0">
              <ShieldCheck className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <h1 className="text-sm font-black text-white tracking-wider flex items-center space-x-1.5">
                <span>AKM FINTECH</span>
              </h1>
              <div className="flex items-center space-x-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                  MASTER NODE V3.2
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Executive Real-time Quick Metric Badge */}
        <div className="p-4 mx-3 my-3 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Treasury Status</span>
            <span className="text-emerald-400 font-bold font-mono">ACTIVE</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-center text-xs">
            <div
              onClick={() => setActiveTab('deposits')}
              className="p-2 bg-slate-900 rounded-xl border border-slate-800 cursor-pointer hover:border-emerald-500/40 transition-colors"
            >
              <span className="text-[10px] text-slate-400 block">Pending In</span>
              <span className="font-bold text-emerald-400 font-mono text-sm">
                {pendingDepositsCount}
              </span>
            </div>
            <div
              onClick={() => setActiveTab('withdrawals')}
              className="p-2 bg-slate-900 rounded-xl border border-slate-800 cursor-pointer hover:border-amber-500/40 transition-colors"
            >
              <span className="text-[10px] text-slate-400 block">Pending Out</span>
              <span className="font-bold text-amber-400 font-mono text-sm">
                {pendingWithdrawalsCount}
              </span>
            </div>
          </div>
        </div>

        {/* Categorized Navigation Menu */}
        <nav className="flex-1 px-3 space-y-6 pb-6 text-xs">
          {tabGroups.map((group) => (
            <div key={group.category} className="space-y-1">
              <div className="px-3 py-1 text-[10px] font-black uppercase text-slate-400 tracking-wider">
                {group.category}
              </div>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelectTab(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl font-bold transition-all cursor-pointer text-left ${
                        isActive
                          ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25 ring-1 ring-emerald-400/40'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge !== undefined && item.badge > 0 && (
                        <span
                          className={`px-1.5 py-0.2 rounded-full text-[10px] font-black shrink-0 ${
                            isActive ? 'bg-slate-950 text-emerald-400' : item.badgeColor || 'bg-amber-400 text-slate-950'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom Sidebar Return Button */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/60 mt-auto">
          <button
            onClick={() => setIsAdminOpen(false)}
            className="w-full py-2.5 px-3 bg-slate-800 hover:bg-emerald-600 text-slate-200 hover:text-white rounded-2xl text-xs font-bold flex items-center justify-center space-x-2 border border-slate-700 hover:border-emerald-500 transition-all cursor-pointer active:scale-95 shadow-md"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to User App</span>
          </button>
        </div>
      </aside>

      {/* ============================================================ */}
      {/* MOBILE HEADER (Visible on screens < lg)                     */}
      {/* ============================================================ */}
      <header className="lg:hidden sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setMobileDrawerOpen(true)}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 cursor-pointer active:scale-95 transition-all"
            title="Open Admin Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-slate-950 font-black shadow-xs">
              <ShieldCheck className="w-4 h-4 text-slate-950" />
            </div>
            <div>
              <div className="text-xs font-black text-white leading-tight">AKM Console</div>
              <div className="text-[10px] text-emerald-400 font-bold">{currentTabMeta?.label || 'Overview'}</div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {pendingDepositsCount + pendingWithdrawalsCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-black">
              {pendingDepositsCount + pendingWithdrawalsCount} Pending
            </span>
          )}

          <button
            onClick={() => setIsAdminOpen(false)}
            className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center space-x-1 shadow-xs active:scale-95 transition-all cursor-pointer"
          >
            <span>Exit</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </header>

      {/* ============================================================ */}
      {/* MOBILE HORIZONTAL QUICK SCROLL TABS (Visible on < lg)        */}
      {/* ============================================================ */}
      <div className="lg:hidden bg-slate-900 border-b border-slate-800/80 px-3 py-2 sticky top-[57px] z-30 shadow-sm">
        <AdminTabNav activeTab={activeTab} onSelectTab={handleSelectTab} />
      </div>

      {/* ============================================================ */}
      {/* MAIN CONTENT CANVAS (Responsive on Mobile & Desktop)         */}
      {/* ============================================================ */}
      <main className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-8">
        {/* Top Desktop Breadcrumb Bar */}
        <div className="hidden lg:flex items-center justify-between px-8 py-4 bg-slate-900/40 border-b border-slate-800/60">
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-slate-400 font-bold">AKM Executive Console</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-white font-black">{currentTabMeta?.label}</span>
          </div>

          <div className="flex items-center space-x-4 text-xs">
            <div className="flex items-center space-x-2 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800 font-mono text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="text-slate-300">Auto-Reconcile: ON</span>
              <span className="text-slate-600">•</span>
              <span className="text-emerald-400 font-bold">Port 3000 Ingress</span>
            </div>

            <button
              onClick={() => setIsAdminOpen(false)}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-emerald-600 text-slate-200 hover:text-white rounded-xl font-bold flex items-center space-x-1.5 border border-slate-700 transition-all cursor-pointer active:scale-95"
            >
              <span>Switch to User View</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Tab Content Container */}
        <div className="p-3 sm:p-5 lg:p-8 max-w-7xl w-full mx-auto space-y-4">
          {activeTab === 'overview' && (
            <AdminOverviewTab onNavigateTab={(tab) => setActiveTab(tab)} />
          )}
          {activeTab === 'analytics' && <AdminAnalyticsTab />}
          {activeTab === 'users' && <AdminUsersTab />}
          {activeTab === 'deposits' && <AdminDepositsTab />}
          {activeTab === 'withdrawals' && <AdminWithdrawalsTab />}
          {activeTab === 'plans' && <AdminPlansTab />}
          {activeTab === 'engine' && <AdminEngineTab />}
          {activeTab === 'risk' && <AdminRiskTab />}
          {activeTab === 'broadcast' && <AdminBroadcastTab />}
          {activeTab === 'gateway' && <AdminGatewayTab />}
          {activeTab === 'backup' && <AdminBackupTab />}
          {activeTab === 'logs' && <AdminLogsTab />}
        </div>
      </main>

      {/* ============================================================ */}
      {/* MOBILE BOTTOM QUICK DOCK (Visible on < lg screens)          */}
      {/* ============================================================ */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 px-2 py-1.5 flex items-center justify-around shadow-2xl">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex flex-col items-center py-1 px-2.5 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
            activeTab === 'overview' ? 'text-emerald-400' : 'text-slate-400 hover:text-white'
          }`}
        >
          <LayoutDashboard className="w-4 h-4 mb-0.5" />
          <span>Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('deposits')}
          className={`relative flex flex-col items-center py-1 px-2.5 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
            activeTab === 'deposits' ? 'text-emerald-400' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Wallet className="w-4 h-4 mb-0.5" />
          <span>Deposits</span>
          {pendingDepositsCount > 0 && (
            <span className="absolute -top-0.5 right-1 w-2 h-2 rounded-full bg-emerald-400"></span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('withdrawals')}
          className={`relative flex flex-col items-center py-1 px-2.5 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
            activeTab === 'withdrawals' ? 'text-amber-400' : 'text-slate-400 hover:text-white'
          }`}
        >
          <ArrowDownToLine className="w-4 h-4 mb-0.5" />
          <span>Payouts</span>
          {pendingWithdrawalsCount > 0 && (
            <span className="absolute -top-0.5 right-1 w-2 h-2 rounded-full bg-amber-400"></span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`flex flex-col items-center py-1 px-2.5 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
            activeTab === 'users' ? 'text-emerald-400' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4 mb-0.5" />
          <span>Users</span>
        </button>

        <button
          onClick={() => setMobileDrawerOpen(true)}
          className="flex flex-col items-center py-1 px-2.5 rounded-xl text-[10px] font-bold text-slate-400 hover:text-white cursor-pointer"
        >
          <Menu className="w-4 h-4 mb-0.5" />
          <span>All Tabs</span>
        </button>
      </div>

      {/* ============================================================ */}
      {/* MOBILE FULL DRAWER NAVIGATION (Using createPortal z-[99999]) */}
      {/* ============================================================ */}
      {mobileDrawerOpen && createPortal(
        <div
          onClick={() => setMobileDrawerOpen(false)}
          className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-sm flex justify-start animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-4/5 max-w-xs bg-slate-900 h-full border-r border-slate-800 flex flex-col shadow-2xl overflow-y-auto"
          >
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-slate-950 font-black">
                  <ShieldCheck className="w-5 h-5 text-slate-950" />
                </div>
                <div>
                  <h2 className="text-sm font-black text-white">AKM Admin</h2>
                  <p className="text-[10px] text-emerald-400 font-bold">Executive Suite</p>
                </div>
              </div>
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 p-3 space-y-5 text-xs">
              {tabGroups.map((group) => (
                <div key={group.category} className="space-y-1">
                  <div className="px-2 py-0.5 text-[10px] font-black uppercase text-slate-400 tracking-wider">
                    {group.category}
                  </div>
                  <div className="space-y-1">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleSelectTab(item.id)}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold transition-all cursor-pointer text-left ${
                            isActive
                              ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                              : 'text-slate-300 hover:bg-slate-800'
                          }`}
                        >
                          <div className="flex items-center space-x-2.5">
                            <Icon className="w-4 h-4 shrink-0" />
                            <span>{item.label}</span>
                          </div>
                          {item.badge !== undefined && item.badge > 0 && (
                            <span
                              className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                                isActive ? 'bg-slate-950 text-emerald-400' : item.badgeColor || 'bg-amber-400 text-slate-950'
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-950">
              <button
                onClick={() => {
                  setMobileDrawerOpen(false);
                  setIsAdminOpen(false);
                }}
                className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2 shadow-md cursor-pointer"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Return to User App</span>
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
