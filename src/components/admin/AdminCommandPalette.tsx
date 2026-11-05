import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  Search,
  Command,
  ArrowRight,
  User,
  Wallet,
  ArrowDownToLine,
  Layers,
  Zap,
  CreditCard,
  Settings,
  ShieldAlert,
  Megaphone,
  Palette,
  Terminal,
  Database,
  X,
  CheckCircle2,
  Lock,
  Unlock,
  BarChart3,
  Clock
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AdminTabId } from './AdminTabNav';
import { formatINR } from '../../utils/currency';
import { sfx } from '../../utils/sound';

interface AdminCommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: AdminTabId) => void;
  onSelectUser?: (userId: number) => void;
}

interface CommandItem {
  id: string;
  category: 'Navigation' | 'Actions' | 'Users' | 'Transactions' | 'Plans';
  title: string;
  subtitle?: string;
  icon: React.FC<{ className?: string }>;
  badge?: string;
  badgeColor?: string;
  action: () => void;
}

export const AdminCommandPalette: React.FC<AdminCommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectTab,
  onSelectUser
}) => {
  const {
    registeredUsers,
    transactions,
    plans,
    adminSettings,
    updateAdminSettings,
    runDailySettlement,
    approveAllPendingDeposits,
    approveAllPendingWithdrawals,
    showToast
  } = useApp();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Global Keyboard shortcuts: ESC to close, Up/Down to navigate, Enter to select
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1 < filteredCommands.length ? prev + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 >= 0 ? prev - 1 : Math.max(0, filteredCommands.length - 1)));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex]);

  // Build searchable commands list
  const allCommands = useMemo<CommandItem[]>(() => {
    const list: CommandItem[] = [];

    // 1. Operational Quick Actions
    list.push(
      {
        id: 'act-approve-deposits',
        category: 'Actions',
        title: 'Approve All Pending Deposits',
        subtitle: 'Auto-credit all awaiting investor deposits to balances',
        icon: CheckCircle2,
        badge: '1-Tap',
        badgeColor: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
        action: () => {
          sfx.playSuccess();
          approveAllPendingDeposits();
          onClose();
        }
      },
      {
        id: 'act-disburse-payouts',
        category: 'Actions',
        title: 'Approve All Pending Withdrawals',
        subtitle: 'Disburse all pending payouts and generate IMPS RRNs',
        icon: ArrowDownToLine,
        badge: '1-Tap',
        badgeColor: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
        action: () => {
          sfx.playSuccess();
          approveAllPendingWithdrawals();
          onClose();
        }
      },
      {
        id: 'act-run-settlement',
        category: 'Actions',
        title: 'Trigger Instant Dividend Settlement',
        subtitle: 'Force immediate yield accrual for active investments',
        icon: Zap,
        badge: 'Settlement',
        badgeColor: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
        action: () => {
          sfx.playSuccess();
          runDailySettlement();
          onClose();
        }
      },
      {
        id: 'act-toggle-freeze',
        category: 'Actions',
        title: adminSettings.freezeWithdrawals ? 'Lift Emergency Payout Lock' : 'Emergency Lock All Payouts',
        subtitle: adminSettings.freezeWithdrawals ? 'Resume standard automated withdrawals' : 'Pause all withdrawals platform-wide immediately',
        icon: adminSettings.freezeWithdrawals ? Unlock : Lock,
        badge: adminSettings.freezeWithdrawals ? 'LOCKED' : 'ACTIVE',
        badgeColor: adminSettings.freezeWithdrawals ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-slate-800 text-slate-300',
        action: () => {
          sfx.playTap();
          const next = !adminSettings.freezeWithdrawals;
          updateAdminSettings({ freezeWithdrawals: next });
          showToast(next ? 'Withdrawals emergency frozen!' : 'Withdrawals unfreezed!', next ? 'error' : 'success');
          onClose();
        }
      }
    );

    // 2. Navigation Tabs
    const navTabs: { id: AdminTabId; label: string; desc: string; icon: React.FC<{ className?: string }> }[] = [
      { id: 'overview', label: 'Overview Hub', desc: 'Main executive dashboard and solvency metrics', icon: BarChart3 },
      { id: 'analytics', label: 'Treasury Analytics', desc: 'Financial graphs, cash flow, and deposit trends', icon: BarChart3 },
      { id: 'users', label: 'Users Directory', desc: 'User accounts, balances, VIP levels, and bans', icon: User },
      { id: 'deposits', label: 'Deposit Orders', desc: 'Pending and completed deposit order management', icon: Wallet },
      { id: 'withdrawals', label: 'Payout Orders', desc: 'IMPS/UPI bank withdrawal approvals and tracking', icon: ArrowDownToLine },
      { id: 'plans', label: 'Products Portfolio', desc: 'Investment plans, durations, returns, and prices', icon: Layers },
      { id: 'engine', label: 'Turbo Engine', desc: 'High-frequency turbo cycle automation settings', icon: Zap },
      { id: 'gateway', label: 'Payment Gateways', desc: 'WatchPay and Sunpays automated merchant settings', icon: CreditCard },
      { id: 'theme', label: 'Theme Studio', desc: 'Platform visual themes, brand colors, and styling', icon: Palette },
      { id: 'broadcast', label: 'Broadcast Center', desc: 'Send popups and announcements to all users', icon: Megaphone },
      { id: 'risk', label: 'Risk Shield', desc: 'Anti-fraud monitor, security logs, and multi-accounts', icon: ShieldAlert },
      { id: 'logs', label: 'Audit Logs', desc: 'Full administrative immutable activity trail', icon: Terminal },
      { id: 'backup', label: 'Backup & Recovery', desc: 'Export full database backup JSON or CSV snapshot', icon: Database }
    ];

    navTabs.forEach((tab) => {
      list.push({
        id: `nav-${tab.id}`,
        category: 'Navigation',
        title: tab.label,
        subtitle: tab.desc,
        icon: tab.icon,
        action: () => {
          sfx.playTap();
          onSelectTab(tab.id);
          onClose();
        }
      });
    });

    // 3. Registered Users (Top 25 recent/searchable)
    registeredUsers.slice(0, 30).forEach((u) => {
      list.push({
        id: `user-${u.id}`,
        category: 'Users',
        title: `${u.phone} (${u.name || 'Investor'})`,
        subtitle: `UID #${u.id} • Balance: ${formatINR(u.balance)} • ${u.role === 'admin' ? 'Super Admin' : u.vipLevel || 'Member'}`,
        icon: User,
        badge: formatINR(u.balance),
        badgeColor: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono',
        action: () => {
          sfx.playTap();
          onSelectTab('users');
          if (onSelectUser) onSelectUser(u.id);
          onClose();
        }
      });
    });

    // 4. Products Portfolio
    plans.forEach((p) => {
      list.push({
        id: `plan-${p.id}`,
        category: 'Plans',
        title: p.title,
        subtitle: `Deposit ${formatINR(p.depositAmount)} • Daily Return ${formatINR(p.dailyIncome)} • Category: ${p.category.toUpperCase()}`,
        icon: Layers,
        badge: p.badge || `₹${p.depositAmount}`,
        badgeColor: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
        action: () => {
          sfx.playTap();
          onSelectTab('plans');
          onClose();
        }
      });
    });

    // 5. Recent Transactions
    transactions.slice(0, 20).forEach((tx) => {
      list.push({
        id: `tx-${tx.id}`,
        category: 'Transactions',
        title: `${tx.type.toUpperCase()}: ${formatINR(tx.finalAmount || tx.amount)} • ${tx.orderId || tx.id}`,
        subtitle: `Status: ${tx.status.toUpperCase()} • ${tx.method || 'Wallet'} • ${tx.createdAt}`,
        icon: tx.type === 'recharge' ? Wallet : ArrowDownToLine,
        badge: tx.status.toUpperCase(),
        badgeColor: tx.status === 'success' ? 'bg-emerald-500/20 text-emerald-400' : tx.status === 'pending' ? 'bg-amber-500/20 text-amber-400' : 'bg-rose-500/20 text-rose-400',
        action: () => {
          sfx.playTap();
          if (tx.type === 'recharge') {
            onSelectTab('deposits');
          } else {
            onSelectTab('withdrawals');
          }
          onClose();
        }
      });
    });

    return list;
  }, [
    registeredUsers,
    transactions,
    plans,
    adminSettings,
    approveAllPendingDeposits,
    approveAllPendingWithdrawals,
    runDailySettlement,
    updateAdminSettings,
    showToast,
    onSelectTab,
    onSelectUser,
    onClose
  ]);

  // Filter commands by search query
  const filteredCommands = useMemo(() => {
    if (!query.trim()) return allCommands.slice(0, 30);
    const q = query.trim().toLowerCase();
    return allCommands.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        (c.subtitle && c.subtitle.toLowerCase().includes(q)) ||
        c.category.toLowerCase().includes(q)
    );
  }, [allCommands, query]);

  if (!isOpen || typeof document === 'undefined') return null;

  return createPortal(
    <div
      onClick={onClose}
      className="fixed inset-0 z-[100000] bg-slate-950/85 backdrop-blur-md flex items-start justify-center p-3 sm:p-6 pt-16 sm:pt-24 animate-fade-in cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] cursor-default animate-scale-up"
      >
        {/* Top Input Bar */}
        <div className="p-4 border-b border-slate-800 flex items-center space-x-3 bg-slate-950/60">
          <Search className="w-5 h-5 text-emerald-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command, search user phone, order ID, or jump to tab..."
            className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none font-medium"
          />
          {query && (
            <button
              onClick={() => {
                setQuery('');
                setSelectedIndex(0);
              }}
              className="p-1 rounded-lg text-slate-500 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <div className="hidden sm:flex items-center space-x-1 px-2 py-0.5 rounded-lg bg-slate-800 border border-slate-700 text-[10px] text-slate-400 font-mono">
            <span>ESC</span>
          </div>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1 divide-y divide-slate-800/40">
          {filteredCommands.length === 0 ? (
            <div className="py-12 text-center text-slate-500 space-y-2">
              <Command className="w-8 h-8 mx-auto text-slate-600" />
              <p className="text-xs">No commands or records matching &ldquo;{query}&rdquo;</p>
              <p className="text-[10px] text-slate-600">Try searching for &quot;deposits&quot;, a phone number, or &quot;settlement&quot;</p>
            </div>
          ) : (
            filteredCommands.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`p-3 rounded-2xl flex items-center justify-between cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-emerald-500/15 border border-emerald-500/30 text-white'
                      : 'hover:bg-slate-800/60 text-slate-300'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/20'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold truncate text-white">{item.title}</span>
                        <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold bg-slate-800/80 px-1.5 py-0.2 rounded">
                          {item.category}
                        </span>
                      </div>
                      {item.subtitle && (
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">{item.subtitle}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0 ml-3">
                    {item.badge && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.badgeColor || 'bg-slate-800 text-slate-300'}`}>
                        {item.badge}
                      </span>
                    )}
                    <ArrowRight className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-400' : 'text-slate-600'}`} />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts hint */}
        <div className="px-4 py-2.5 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="flex items-center space-x-1">
              <span className="px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-mono text-[9.5px]">↑↓</span>
              <span>Navigate</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-mono text-[9.5px]">ENTER</span>
              <span>Execute</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-mono text-[9.5px]">ESC</span>
              <span>Close</span>
            </span>
          </div>
          <span className="text-emerald-400 font-mono text-[10px] font-bold">AKM Command v2.6</span>
        </div>
      </div>
    </div>,
    document.body
  );
};
