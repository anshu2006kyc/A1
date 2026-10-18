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
  Lock,
  LogOut,
  Megaphone,
  Menu,
  Palette,
  RefreshCw,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sliders,
  Terminal,
  Unlock,
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
import { AdminThemeTab } from '../components/admin/AdminThemeTab';
import { AdminRiskTab } from '../components/admin/AdminRiskTab';
import { AdminBroadcastTab } from '../components/admin/AdminBroadcastTab';
import { AdminGatewayTab } from '../components/admin/AdminGatewayTab';
import { AdminBackupTab } from '../components/admin/AdminBackupTab';
import { AdminLogsTab } from '../components/admin/AdminLogsTab';
import { formatINR } from '../utils/currency';
import { sfx } from '../utils/sound';
import { AVAILABLE_THEMES, getThemeById } from '../utils/theme';

export const AdminView: React.FC = () => {
  const {
    setIsAdminOpen,
    lockAdminSession,
    adminSettings,
    updateAdminSettings,
    transactions,
    securityAlerts,
    registeredUsers,
    user,
    plans,
    dbConnectionStatus,
    isDbConnected,
    runDailySettlement,
    approveAllPendingDeposits,
    approveAllPendingWithdrawals,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<AdminTabId>('overview');
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [showQuickActionsModal, setShowQuickActionsModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleManualRefresh = () => {
    sfx.playTap();
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      showToast('Admin data & balances synced in real-time.', 'success');
    }, 450);
  };

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
          label: 'Payout Orders',
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
        { id: 'gateway', label: 'Payment Gateways', icon: CreditCard }
      ]
    },
    {
      category: 'Appearance & Theme',
      items: [
        { id: 'theme', label: 'Theme Studio (Colours)', icon: Palette }
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
                <span>AKM ENTERPRISES</span>
              </h1>
              <div className="flex items-center space-x-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                  EXECUTIVE CONSOLE
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={handleManualRefresh}
            className={`p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 cursor-pointer transition-all ${
              isRefreshing ? 'animate-spin text-emerald-400' : ''
            }`}
            title="Refresh Real-Time Data"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
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

        {/* Quick Search Tab Filter */}
        <div className="px-3 mb-2">
          <div className="relative flex items-center bg-slate-950 border border-slate-800 focus-within:border-emerald-500/70 rounded-xl px-2.5 py-1.5 transition-all">
            <Search className="w-3.5 h-3.5 text-slate-500 shrink-0 mr-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tabs..."
              className="w-full bg-transparent text-xs text-slate-200 placeholder-slate-500 focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-slate-500 hover:text-white ml-1 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Categorized Navigation Menu */}
        <nav className="flex-1 px-3 space-y-6 pb-6 text-xs">
          {tabGroups
            .map((group) => ({
              ...group,
              items: group.items.filter(
                (item) =>
                  !searchQuery ||
                  item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  group.category.toLowerCase().includes(searchQuery.toLowerCase())
              )
            }))
            .filter((group) => group.items.length > 0)
            .map((group) => (
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
          <div className="space-y-2">
            <button
              onClick={() => setIsAdminOpen(false)}
              className="w-full py-2.5 px-3 bg-slate-800 hover:bg-emerald-600 text-slate-200 hover:text-white rounded-2xl text-xs font-bold flex items-center justify-center space-x-2 border border-slate-700 hover:border-emerald-500 transition-all cursor-pointer active:scale-95 shadow-md"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to User App</span>
            </button>
            <button
              onClick={lockAdminSession}
              className="w-full py-2 px-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 hover:text-rose-200 rounded-2xl text-[11px] font-bold flex items-center justify-center space-x-1.5 border border-rose-500/30 transition-all cursor-pointer active:scale-95"
              title="Lock Admin Session"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Lock Admin Session</span>
            </button>
          </div>
        </div>
      </aside>

      {/* ============================================================ */}
      {/* MOBILE HEADER (Streamlined Executive Top Bar)                */}
      {/* ============================================================ */}
      <header className="lg:hidden sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800/90 px-3 py-2 flex items-center justify-between shadow-md">
        {/* Left: Menu & Title */}
        <div className="flex items-center space-x-2 min-w-0">
          <button
            onClick={() => setMobileDrawerOpen(true)}
            className="relative p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 rounded-xl border border-slate-700/80 cursor-pointer active:scale-95 transition-all shrink-0"
            title="Open Executive Navigation"
          >
            <Menu className="w-5 h-5" />
            {pendingDepositsCount + pendingWithdrawalsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 ring-2 ring-slate-950 animate-ping" />
            )}
            {pendingDepositsCount + pendingWithdrawalsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 ring-2 ring-slate-950" />
            )}
          </button>

          <div className="flex items-center space-x-1.5 min-w-0">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-slate-950 font-black shadow-xs shrink-0">
              <ShieldCheck className="w-4 h-4 text-slate-950" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-black text-white leading-tight truncate">
                AKM CONSOLE
              </div>
              <div className="text-[9.5px] text-emerald-400 font-bold truncate">
                {currentTabMeta?.label || 'Overview'}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Quick Action Hub & Controls */}
        <div className="flex items-center space-x-1.5 shrink-0">
          {/* Quick Actions Speed Dial Trigger */}
          <button
            onClick={() => {
              sfx.playTap();
              setShowQuickActionsModal(true);
            }}
            className="px-2 py-1 bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 text-amber-300 border border-amber-400/40 rounded-xl text-[10.5px] font-extrabold flex items-center space-x-1 active:scale-95 transition-all cursor-pointer shadow-xs"
            title="Open Quick Commands"
          >
            <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
            <span>Actions</span>
            {pendingDepositsCount + pendingWithdrawalsCount > 0 && (
              <span className="ml-0.5 bg-amber-400 text-slate-950 px-1 rounded-full text-[9px] font-black">
                {pendingDepositsCount + pendingWithdrawalsCount}
              </span>
            )}
          </button>

          {/* Sync Button */}
          <button
            onClick={handleManualRefresh}
            className={`p-1.5 rounded-xl bg-slate-900 text-slate-300 hover:text-white border border-slate-700/80 cursor-pointer active:scale-95 transition-all ${
              isRefreshing ? 'border-emerald-500 text-emerald-400' : ''
            }`}
            title="Sync Live Data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} />
          </button>

          {/* Return to App */}
          <button
            onClick={() => setIsAdminOpen(false)}
            className="p-1.5 bg-emerald-600/80 hover:bg-emerald-600 text-white rounded-xl text-xs flex items-center cursor-pointer active:scale-95 transition-all"
            title="Return to User App"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          {/* Lock Session */}
          <button
            onClick={lockAdminSession}
            className="p-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 rounded-xl cursor-pointer active:scale-95 transition-all"
            title="Lock Admin Session"
          >
            <Lock className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* ============================================================ */}
      {/* MOBILE HORIZONTAL QUICK SCROLL TABS (Sticky Below Header)    */}
      {/* ============================================================ */}
      <div className="lg:hidden bg-slate-950/95 border-b border-slate-800/80 px-2 py-1.5 sticky top-[49px] z-30 shadow-sm backdrop-blur-md">
        <AdminTabNav activeTab={activeTab} onSelectTab={handleSelectTab} />
      </div>

      {/* ============================================================ */}
      {/* MAIN CONTENT CANVAS (Responsive on Mobile & Desktop)         */}
      {/* ============================================================ */}
      <main className="flex-1 flex flex-col min-w-0 pb-28 lg:pb-8">
        {/* Top Desktop Breadcrumb Bar */}
        <div className="hidden lg:flex items-center justify-between px-8 py-4 bg-slate-900/40 border-b border-slate-800/60">
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-slate-400 font-bold">AKM Executive Console</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-white font-black">{currentTabMeta?.label}</span>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            <div className="flex items-center space-x-2 bg-emerald-950/40 px-3 py-1.5 rounded-xl border border-emerald-500/30 font-mono text-[11px]">
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-300 font-bold">
                {isDbConnected ? 'DB: Connected' : 'DB: Syncing'}
              </span>
              <span className="text-emerald-500/50">•</span>
              <span className="text-slate-400 text-[10px]">Firestore</span>
            </div>

            <div className="flex items-center space-x-2 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800 font-mono text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="text-slate-300">Auto-Reconcile: ON</span>
              <span className="text-slate-600">•</span>
              <span className="text-emerald-400 font-bold">Port 3000 Ingress</span>
            </div>

            <button
              onClick={handleManualRefresh}
              className={`px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl font-bold flex items-center space-x-1.5 border border-slate-700 transition-all cursor-pointer active:scale-95 ${
                isRefreshing ? 'border-emerald-500 text-emerald-400' : ''
              }`}
              title="Refresh Real-Time Data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} />
              <span>{isRefreshing ? 'Syncing...' : 'Sync Live'}</span>
            </button>

            {/* Quick 1-Click Theme Switcher in Header */}
            <div className="flex items-center space-x-1.5 bg-slate-900/90 px-2.5 py-1.5 rounded-xl border border-slate-800">
              <Palette className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <div className="flex items-center space-x-1">
                {AVAILABLE_THEMES.map((t) => {
                  const isActive = (adminSettings.activeThemeId || 'emerald') === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => {
                        updateAdminSettings({ activeThemeId: t.id });
                        showToast(`Theme switched to ${t.name}!`, 'success');
                      }}
                      title={`${t.name} (${t.hindiName})`}
                      className={`w-3.5 h-3.5 rounded-full transition-transform cursor-pointer ${
                        isActive
                          ? 'scale-125 ring-2 ring-white ring-offset-1 ring-offset-slate-900'
                          : 'opacity-70 hover:opacity-100 hover:scale-110'
                      }`}
                      style={{ backgroundColor: t.previewColor }}
                    />
                  );
                })}
              </div>
              <button
                onClick={() => setActiveTab('theme')}
                className="text-[10px] font-bold text-slate-400 hover:text-white px-1 font-mono cursor-pointer ml-1"
                title="Open Theme Studio"
              >
                Studio
              </button>
            </div>

            <button
              onClick={() => setIsAdminOpen(false)}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold flex items-center space-x-1.5 shadow-xs transition-all cursor-pointer active:scale-95"
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
          {activeTab === 'theme' && <AdminThemeTab />}
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
      {/* ============================================================ */}
      {/* MOBILE BOTTOM QUICK DOCK (Glassy Executive Navigation)       */}
      {/* ============================================================ */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/90 px-1.5 pt-1.5 pb-2.5 flex items-center justify-around shadow-2xl safe-area-bottom">
        <button
          onClick={() => {
            sfx.playTap();
            setActiveTab('overview');
          }}
          className={`flex flex-col items-center py-1 px-2.5 rounded-xl text-[10px] font-bold transition-all cursor-pointer active:scale-95 ${
            activeTab === 'overview'
              ? 'text-emerald-300 bg-emerald-500/15 ring-1 ring-emerald-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <LayoutDashboard className="w-4 h-4 mb-0.5" />
          <span>Overview</span>
        </button>

        <button
          onClick={() => {
            sfx.playTap();
            setActiveTab('deposits');
          }}
          className={`relative flex flex-col items-center py-1 px-2.5 rounded-xl text-[10px] font-bold transition-all cursor-pointer active:scale-95 ${
            activeTab === 'deposits'
              ? 'text-emerald-300 bg-emerald-500/15 ring-1 ring-emerald-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Wallet className="w-4 h-4 mb-0.5" />
          <span>Deposits</span>
          {pendingDepositsCount > 0 && (
            <span className="absolute -top-1 -right-0.5 px-1 rounded-full bg-emerald-400 text-slate-950 text-[9px] font-black leading-tight ring-1 ring-slate-950">
              {pendingDepositsCount}
            </span>
          )}
        </button>

        {/* Central Speed Dial Action Button */}
        <button
          onClick={() => {
            sfx.playTap();
            setShowQuickActionsModal(true);
          }}
          className="relative -top-2 w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/30 ring-2 ring-slate-950 active:scale-90 transition-all cursor-pointer"
          title="Executive Quick Action Hub"
        >
          <Zap className="w-5 h-5 fill-slate-950" />
        </button>

        <button
          onClick={() => {
            sfx.playTap();
            setActiveTab('withdrawals');
          }}
          className={`relative flex flex-col items-center py-1 px-2.5 rounded-xl text-[10px] font-bold transition-all cursor-pointer active:scale-95 ${
            activeTab === 'withdrawals'
              ? 'text-amber-300 bg-amber-500/15 ring-1 ring-amber-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <ArrowDownToLine className="w-4 h-4 mb-0.5" />
          <span>Payouts</span>
          {pendingWithdrawalsCount > 0 && (
            <span className="absolute -top-1 -right-0.5 px-1 rounded-full bg-amber-400 text-slate-950 text-[9px] font-black leading-tight ring-1 ring-slate-950">
              {pendingWithdrawalsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => {
            sfx.playTap();
            setActiveTab('users');
          }}
          className={`flex flex-col items-center py-1 px-2.5 rounded-xl text-[10px] font-bold transition-all cursor-pointer active:scale-95 ${
            activeTab === 'users'
              ? 'text-emerald-300 bg-emerald-500/15 ring-1 ring-emerald-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4 mb-0.5" />
          <span>Users</span>
        </button>
      </div>

      {/* ============================================================ */}
      {/* MOBILE QUICK COMMAND SHEET (1-Tap Operational Power Hub)     */}
      {/* ============================================================ */}
      {showQuickActionsModal && createPortal(
        <div
          onClick={() => setShowQuickActionsModal(false)}
          className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
          >
            {/* Top Drag Handle on Mobile */}
            <div className="w-12 h-1.5 rounded-full bg-slate-700 mx-auto -mt-1 mb-2 sm:hidden" />

            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30 shadow-xs">
                  <Zap className="w-5 h-5 fill-amber-400" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">Executive Command Hub</h3>
                  <p className="text-[10.5px] text-emerald-400 font-bold">1-Tap Operational Shortcuts</p>
                </div>
              </div>
              <button
                onClick={() => setShowQuickActionsModal(false)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-slate-950 p-2.5 rounded-2xl border border-slate-800">
                <span className="text-[9.5px] text-slate-400 block font-medium">Pending Payouts</span>
                <span className="text-sm font-black text-amber-400 font-mono mt-0.5 block">
                  {pendingWithdrawalsCount}
                </span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-2xl border border-slate-800">
                <span className="text-[9.5px] text-slate-400 block font-medium">Pending Deposits</span>
                <span className="text-sm font-black text-emerald-400 font-mono mt-0.5 block">
                  {pendingDepositsCount}
                </span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-2xl border border-slate-800">
                <span className="text-[9.5px] text-slate-400 block font-medium">Registered Users</span>
                <span className="text-sm font-black text-white font-mono mt-0.5 block">
                  {registeredUsers.length}
                </span>
              </div>
            </div>

            {/* 1-Tap Action Buttons Grid */}
            <div className="space-y-2">
              {/* Batch Disburse Payouts */}
              <button
                onClick={() => {
                  sfx.playSuccess();
                  approveAllPendingWithdrawals();
                  setShowQuickActionsModal(false);
                }}
                disabled={pendingWithdrawalsCount === 0}
                className={`w-full p-3 rounded-2xl flex items-center justify-between text-xs font-bold transition-all cursor-pointer active:scale-95 ${
                  pendingWithdrawalsCount > 0
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black shadow-lg shadow-amber-500/20'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-60'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <ArrowDownToLine className="w-4 h-4" />
                  <span>1-Tap Disburse All Payouts</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-950/20">
                  {pendingWithdrawalsCount} Orders
                </span>
              </button>

              {/* Batch Credit Deposits */}
              <button
                onClick={() => {
                  sfx.playSuccess();
                  approveAllPendingDeposits();
                  setShowQuickActionsModal(false);
                }}
                disabled={pendingDepositsCount === 0}
                className={`w-full p-3 rounded-2xl flex items-center justify-between text-xs font-bold transition-all cursor-pointer active:scale-95 ${
                  pendingDepositsCount > 0
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black shadow-lg shadow-emerald-500/20'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-60'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>1-Tap Credit All Deposits</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/20">
                  {pendingDepositsCount} Orders
                </span>
              </button>

              {/* Trigger Turbo Settlement */}
              <button
                onClick={() => {
                  sfx.playSuccess();
                  runDailySettlement();
                  setShowQuickActionsModal(false);
                }}
                className="w-full p-3 rounded-2xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700/80 flex items-center justify-between text-xs font-bold transition-all cursor-pointer active:scale-95"
              >
                <div className="flex items-center space-x-2.5">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>Trigger Instant Dividend Settlement</span>
                </div>
                <span className="text-[10.5px] text-emerald-400 font-mono">Run Now</span>
              </button>

              {/* Toggle Platform Emergency Lock */}
              <button
                onClick={() => {
                  sfx.playTap();
                  const curFreeze = adminSettings.freezeWithdrawals;
                  updateAdminSettings({ freezeWithdrawals: !curFreeze });
                  showToast(curFreeze ? 'Withdrawals unfreezed!' : 'Withdrawals emergency frozen!', curFreeze ? 'success' : 'info');
                  setShowQuickActionsModal(false);
                }}
                className={`w-full p-3 rounded-2xl border flex items-center justify-between text-xs font-bold transition-all cursor-pointer active:scale-95 ${
                  adminSettings.freezeWithdrawals
                    ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                    : 'bg-rose-950/60 border-rose-500/40 text-rose-300'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  {adminSettings.freezeWithdrawals ? (
                    <Unlock className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Lock className="w-4 h-4 text-rose-400" />
                  )}
                  <span>{adminSettings.freezeWithdrawals ? 'Lift Emergency Payout Lock' : 'Emergency Lock All Payouts'}</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/30">
                  {adminSettings.freezeWithdrawals ? 'LOCKED' : 'ACTIVE'}
                </span>
              </button>

              {/* Quick Navigation to Broadcast / Theme */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => {
                    handleSelectTab('broadcast');
                    setShowQuickActionsModal(false);
                  }}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 flex items-center justify-center space-x-1.5 text-xs font-bold active:scale-95 cursor-pointer"
                >
                  <Megaphone className="w-3.5 h-3.5 text-teal-400" />
                  <span>Send Broadcast</span>
                </button>
                <button
                  onClick={() => {
                    handleSelectTab('theme');
                    setShowQuickActionsModal(false);
                  }}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 flex items-center justify-center space-x-1.5 text-xs font-bold active:scale-95 cursor-pointer"
                >
                  <Palette className="w-3.5 h-3.5 text-amber-400" />
                  <span>Theme Studio</span>
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

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
                  <h2 className="text-sm font-black text-white">AKM ENTERPRISES</h2>
                  <p className="text-[10px] text-emerald-400 font-bold">Executive Console</p>
                </div>
              </div>
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Search Tab in Drawer */}
            <div className="p-3 border-b border-slate-800/80 bg-slate-950/50">
              <div className="relative flex items-center bg-slate-900 border border-slate-700/80 rounded-xl px-2.5 py-1.5">
                <Search className="w-3.5 h-3.5 text-slate-400 shrink-0 mr-2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter admin sections..."
                  className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-slate-400 hover:text-white ml-1 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            <div className="flex-1 p-3 space-y-5 text-xs">
              {tabGroups
                .map((group) => ({
                  ...group,
                  items: group.items.filter(
                    (item) =>
                      !searchQuery ||
                      item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      group.category.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                }))
                .filter((group) => group.items.length > 0)
                .map((group) => (
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
