import React from 'react';
import {
  Activity,
  AlertOctagon,
  Banknote,
  BarChart3,
  CreditCard,
  Database,
  Layers,
  Megaphone,
  Palette,
  ShieldAlert,
  Sliders,
  Terminal,
  Users,
  Wallet,
  Zap
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export type AdminTabId =
  | 'overview'
  | 'analytics'
  | 'users'
  | 'deposits'
  | 'withdrawals'
  | 'plans'
  | 'engine'
  | 'theme'
  | 'risk'
  | 'broadcast'
  | 'gateway'
  | 'backup'
  | 'logs';

interface AdminTabNavProps {
  activeTab: AdminTabId;
  onSelectTab: (tab: AdminTabId) => void;
}

export const AdminTabNav: React.FC<AdminTabNavProps> = ({ activeTab, onSelectTab }) => {
  const { transactions, securityAlerts } = useApp();

  const pendingDepositsCount = transactions.filter(
    (t) => t.type === 'recharge' && t.status === 'pending'
  ).length;

  const pendingWithdrawalsCount = transactions.filter(
    (t) => t.type === 'withdraw' && t.status === 'pending'
  ).length;

  const unresolvedAlertsCount = securityAlerts.filter((a) => !a.resolved).length;

  const tabs: { id: AdminTabId; label: string; icon: React.FC<{ className?: string }>; badge?: number; badgeColor?: string }[] = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    {
      id: 'deposits',
      label: 'Deposits',
      icon: Wallet,
      badge: pendingDepositsCount,
      badgeColor: 'bg-emerald-400 text-slate-950'
    },
    {
      id: 'withdrawals',
      label: 'Payouts',
      icon: Banknote,
      badge: pendingWithdrawalsCount,
      badgeColor: 'bg-amber-400 text-slate-950'
    },
    { id: 'plans', label: 'Products', icon: Layers },
    { id: 'engine', label: 'Turbo Engine', icon: Zap },
    { id: 'theme', label: 'Theme & Colors', icon: Palette },
    {
      id: 'risk',
      label: 'Risk Shield',
      icon: ShieldAlert,
      badge: unresolvedAlertsCount,
      badgeColor: 'bg-rose-500 text-white'
    },
    { id: 'broadcast', label: 'Broadcast', icon: Megaphone },
    { id: 'gateway', label: 'Payment Gateways', icon: CreditCard },
    { id: 'backup', label: 'Backup & Recovery', icon: Database },
    { id: 'logs', label: 'Audit Logs', icon: Terminal }
  ];

  return (
    <div className="flex bg-slate-900/95 p-1 rounded-2xl border border-slate-800/90 overflow-x-auto no-scrollbar gap-1 text-[11px] sm:text-xs shadow-inner scroll-smooth snap-x">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl sm:rounded-2xl font-bold transition-all whitespace-nowrap cursor-pointer shrink-0 snap-start active:scale-95 ${
              isActive
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/25 ring-1 ring-emerald-400/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
            <span>{tab.label}</span>
            {tab.badge !== undefined && tab.badge > 0 && (
              <span
                className={`ml-1 px-1.5 py-0.2 rounded-full text-[9.5px] font-black shrink-0 ${
                  isActive ? 'bg-slate-950 text-emerald-300 ring-1 ring-emerald-400/30' : tab.badgeColor || 'bg-amber-400 text-slate-950'
                }`}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
