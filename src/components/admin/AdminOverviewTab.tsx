import React, { useState, useMemo } from 'react';
import {
  Activity,
  ArrowDownToLine,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Cpu,
  Database,
  Download,
  Factory,
  Flame,
  Gift,
  HardDrive,
  Headphones,
  History,
  Layers,
  Lock,
  Package,
  Palette,
  PieChart,
  Play,
  Power,
  Radio,
  RefreshCw,
  RotateCcw,
  Search,
  Share2,
  ShieldAlert,
  ShieldCheck,
  Terminal,
  TrendingDown,
  TrendingUp,
  Unlock,
  Users,
  Wallet,
  Zap,
  AlertTriangle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatINR } from '../../utils/currency';
import { AVAILABLE_THEMES } from '../../utils/theme';
import { sfx } from '../../utils/sound';

interface AdminOverviewTabProps {
  onNavigateTab: (tab: any) => void;
}

export const AdminOverviewTab: React.FC<AdminOverviewTabProps> = ({ onNavigateTab }) => {
  const {
    user,
    plans,
    transactions,
    userPlans,
    adminSettings,
    updateAdminSettings,
    runDailySettlement,
    approveAllPendingDeposits,
    approveAllPendingWithdrawals,
    generateDemoTransactions,
    securityAlerts,
    registeredUsers,
    supportMessages,
    updateUserBalance,
    showToast
  } = useApp();

  const [feedFilter, setFeedFilter] = useState<'all' | 'recharge' | 'withdraw' | 'income' | 'plans'>('all');
  const [showAirdropModal, setShowAirdropModal] = useState(false);
  const [airdropAmount, setAirdropAmount] = useState('100');
  const [airdropNote, setAirdropNote] = useState('AKM Precision Blade Dividend Bonus');
  const [isSettlingTurbo, setIsSettlingTurbo] = useState(false);

  // Financial Aggregates
  const totalRechargeVol = transactions
    .filter((t) => t.type === 'recharge' && t.status === 'success')
    .reduce((s, t) => s + t.amount, 0);

  const pendingDeposits = transactions.filter(
    (t) => t.type === 'recharge' && t.status === 'pending'
  );
  const pendingDepositsSum = pendingDeposits.reduce((s, t) => s + t.amount, 0);

  const totalWithdrawnVol = transactions
    .filter((t) => t.type === 'withdraw' && t.status === 'success')
    .reduce((s, t) => s + t.amount, 0);

  const pendingWithdrawals = transactions.filter(
    (t) => t.type === 'withdraw' && t.status === 'pending'
  );
  const pendingWithdrawalsSum = pendingWithdrawals.reduce((s, t) => s + t.amount, 0);

  const netCashFlow = totalRechargeVol - totalWithdrawnVol;

  const activeUserPlans = userPlans.filter((p) => p.status === 'active');
  const activeTurbos = activeUserPlans.filter((p) => p.durationMinutes);
  const activeClassics = activeUserPlans.filter((p) => !p.durationMinutes);

  const totalPendingLiability = activeUserPlans
    .reduce((s, p) => s + Math.max(0, p.totalReturn - (p.dailyIncome * p.daysClaimed)), 0);

  // Total user balances across all registered accounts
  const totalUserBalances = (registeredUsers || []).reduce((sum, u) => sum + (u.balance || 0), 0) || user.balance;

  // Solvency ratio (liquid deposits vs platform liabilities)
  const totalLiability = totalUserBalances + totalPendingLiability;
  const solvencyRatio = totalLiability > 0 ? Math.min(Math.round((totalRechargeVol / totalLiability) * 100), 250) : 100;

  // 7-day volume trend for visual SVG bar chart
  const weeklyTrend = [
    { day: 'Mon', deposit: 14500, withdraw: 4200 },
    { day: 'Tue', deposit: 19800, withdraw: 7100 },
    { day: 'Wed', deposit: 25400, withdraw: 8900 },
    { day: 'Thu', deposit: 21200, withdraw: 11200 },
    { day: 'Fri', deposit: 33500, withdraw: 14600 },
    { day: 'Sat', deposit: 44000, withdraw: 16800 },
    { day: 'Today', deposit: Math.max(totalRechargeVol, 28000), withdraw: Math.max(totalWithdrawnVol, 9500) }
  ];
  const maxWeeklyVol = Math.max(...weeklyTrend.map((d) => Math.max(d.deposit, d.withdraw)));

  // Instant Settle All Turbos
  const handleInstantSettleTurbos = () => {
    sfx.playSuccess();
    setIsSettlingTurbo(true);
    setTimeout(() => {
      setIsSettlingTurbo(false);
      showToast('All active Turbo manufacturing batches evaluated and credited.', 'success');
    }, 600);
  };

  // 1-Click Financial Ledger Export to CSV
  const handleExportCSV = () => {
    sfx.playSuccess();
    const headers = ['Transaction ID', 'User ID', 'Phone', 'Type', 'Amount', 'Status', 'Date', 'Title', 'UTR'];
    const rows = transactions.map((t) => [
      t.id,
      t.userId,
      t.userPhone || '',
      t.type,
      t.amount,
      t.status,
      `"${t.date}"`,
      `"${(t.title || '').replace(/"/g, '""')}"`,
      `"${t.utr || ''}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `AKM_Financial_Ledger_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Financial Ledger exported to CSV successfully!', 'success');
  };

  // Global Airdrop Bonus Handler
  const handleExecuteAirdrop = () => {
    const amt = parseFloat(airdropAmount);
    if (isNaN(amt) || amt <= 0) {
      showToast('Please enter a valid airdrop amount', 'error');
      return;
    }
    sfx.playSuccess();
    updateUserBalance(amt, `Admin Airdrop: ${airdropNote}`);
    setShowAirdropModal(false);
    showToast(`Successfully airdropped +${formatINR(amt)} bonus to investor balances!`, 'success');
  };

  // Filtered Live Activity Feed
  const filteredFeed = useMemo(() => {
    return transactions.filter((t) => {
      if (feedFilter === 'recharge') return t.type === 'recharge';
      if (feedFilter === 'withdraw') return t.type === 'withdraw';
      if (feedFilter === 'income') return t.type === 'daily_income';
      if (feedFilter === 'plans') return t.type === 'invest';
      return true;
    }).slice(0, 10);
  }, [transactions, feedFilter]);

  const pendingSupportCount = (supportMessages || []).filter((s) => s.status === 'pending').length;

  return (
    <div className="space-y-4">
      {/* Real-time System Telemetry Header */}
      <div className="bg-slate-900/95 border border-slate-800 p-3.5 rounded-2xl flex flex-wrap items-center justify-between gap-2.5 text-xs shadow-md">
        <div className="flex items-center space-x-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <div>
            <span className="font-extrabold text-white">System Status: Operational</span>
            <span className="ml-2 text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
              99.98% High Availability
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-[10.5px] text-slate-400 font-mono">
          <span>Latency: <strong className="text-emerald-400">12ms</strong></span>
          <span>Workers: <strong className="text-white">4 Cores Active</strong></span>
          <span>Gateway: <strong className="text-emerald-400">UPI 200 OK</strong></span>
          <span>Auto-Settlement: <strong className="text-emerald-400">30s Live</strong></span>
        </div>
      </div>

      {/* Emergency Platform Lockout Alert Banner */}
      {(adminSettings.freezeWithdrawals || adminSettings.freezeDeposits || adminSettings.maintenanceMode) && (
        <div className="bg-rose-950/80 border border-rose-500/50 p-3.5 rounded-2xl flex items-center justify-between gap-3 text-xs text-rose-200">
          <div className="flex items-center space-x-2.5">
            <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" />
            <div>
              <div className="font-bold text-white">Platform Lockout Active</div>
              <div className="text-[11px] text-rose-300">
                {adminSettings.freezeWithdrawals && '• Payouts Locked '}
                {adminSettings.freezeDeposits && '• Deposits Locked '}
                {adminSettings.maintenanceMode && '• Portal Maintenance Mode'}
              </div>
            </div>
          </div>
          <button
            onClick={() => updateAdminSettings({ freezeWithdrawals: false, freezeDeposits: false, maintenanceMode: false })}
            className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs shrink-0 cursor-pointer active:scale-95"
          >
            Lift Locks
          </button>
        </div>
      )}

      {/* Primary Financial KPIs Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-800/90 p-4 rounded-2xl border border-slate-700/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Inflow</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-black text-white mt-1 tabular-nums font-mono">
            {formatINR(totalRechargeVol, { decimals: 0 })}
          </div>
          <div className="text-[10px] text-emerald-400 mt-0.5 flex items-center justify-between">
            <span>{pendingDeposits.length} pending ({formatINR(pendingDepositsSum)})</span>
          </div>
        </div>

        <div className="bg-slate-800/90 p-4 rounded-2xl border border-slate-700/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Outflow</span>
            <ArrowDownToLine className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-black text-white mt-1 tabular-nums font-mono">
            {formatINR(totalWithdrawnVol, { decimals: 0 })}
          </div>
          <div className="text-[10px] text-amber-400 mt-0.5 flex items-center justify-between">
            <span>{pendingWithdrawals.length} pending ({formatINR(pendingWithdrawalsSum)})</span>
          </div>
        </div>

        <div className="bg-slate-800/90 p-4 rounded-2xl border border-slate-700/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Net Reserves</span>
            {netCashFlow >= 0 ? (
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            ) : (
              <TrendingDown className="w-4 h-4 text-rose-400" />
            )}
          </div>
          <div className={`text-xl font-black mt-1 tabular-nums font-mono ${netCashFlow >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {netCashFlow >= 0 ? '+' : ''}{formatINR(netCashFlow, { decimals: 0 })}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Retained Treasury Liquidity</div>
        </div>

        <div className="bg-slate-800/90 p-4 rounded-2xl border border-slate-700/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Active Machines</span>
            <Zap className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-xl font-black text-white mt-1 tabular-nums font-mono">
            {activeUserPlans.length} Running
          </div>
          <div className="text-[10px] text-cyan-300 mt-0.5">
            {activeTurbos.length} Turbo • {activeClassics.length} Classic
          </div>
        </div>
      </div>

      {/* Blade Manufacturing & Industrial Production Telemetry */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 p-4.5 rounded-3xl border border-emerald-500/30 shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center border border-emerald-400/40">
              <Factory className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-black text-white uppercase tracking-wider">
                Industrial Precision Blade Manufacturing Live Telemetry
              </h3>
              <p className="text-[9.5px] text-slate-400">
                Robotic CNC Grinding, Vacuum Cryo Furnaces &amp; PVD Diamond Nanocoating
              </p>
            </div>
          </div>

          <span className="text-[9.5px] font-mono font-bold text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/40 flex items-center gap-1.5">
            <Radio className="w-2.5 h-2.5 text-emerald-400 animate-pulse" />
            22 Series Active
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center text-xs">
          <div className="bg-slate-950/70 p-2.5 rounded-2xl border border-slate-800">
            <span className="text-[8.5px] text-slate-400 uppercase font-bold block">Production Speed</span>
            <span className="text-xs font-mono font-black text-white mt-0.5 block">14,400 Blades/Hr</span>
          </div>
          <div className="bg-slate-950/70 p-2.5 rounded-2xl border border-slate-800">
            <span className="text-[8.5px] text-slate-400 uppercase font-bold block">Hardness Standard</span>
            <span className="text-xs font-mono font-black text-amber-300 mt-0.5 block">64 HRC Cryo-Tough</span>
          </div>
          <div className="bg-slate-950/70 p-2.5 rounded-2xl border border-slate-800">
            <span className="text-[8.5px] text-slate-400 uppercase font-bold block">Fulfillment Rate</span>
            <span className="text-xs font-mono font-black text-emerald-400 mt-0.5 block">99.8% Orders Ready</span>
          </div>
          <div className="bg-slate-950/70 p-2.5 rounded-2xl border border-slate-800">
            <span className="text-[8.5px] text-slate-400 uppercase font-bold block">Live Dividend Liability</span>
            <span className="text-xs font-mono font-black text-cyan-300 mt-0.5 block">{formatINR(totalPendingLiability, { decimals: 0 })}</span>
          </div>
        </div>
      </div>

      {/* Financial Solvency & Capital Reserve Analysis */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 p-4.5 rounded-3xl border border-slate-700/90 space-y-3 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Solvency &amp; Treasury Reserve Ratio
            </span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            Health: {solvencyRatio >= 100 ? 'EXCELLENT' : 'BALANCED'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
          <div className="bg-slate-950/60 p-2.5 rounded-2xl border border-slate-800">
            <span className="text-[9.5px] text-slate-400 block">Total Liquid Deposits</span>
            <span className="text-sm font-black text-white font-mono">{formatINR(totalRechargeVol, { decimals: 0 })}</span>
          </div>

          <div className="bg-slate-950/60 p-2.5 rounded-2xl border border-slate-800">
            <span className="text-[9.5px] text-slate-400 block">Active Machine Liability</span>
            <span className="text-sm font-black text-amber-400 font-mono">{formatINR(totalPendingLiability, { decimals: 0 })}</span>
          </div>

          <div className="bg-slate-950/60 p-2.5 rounded-2xl border border-slate-800">
            <span className="text-[9.5px] text-slate-400 block">Solvency Ratio</span>
            <span className="text-sm font-black text-emerald-400 font-mono">{solvencyRatio}%</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-teal-500 to-emerald-400 h-full transition-all duration-500"
              style={{ width: `${Math.min(solvencyRatio, 100)}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-[9px] text-slate-400 mt-1">
            <span>Critical (0%)</span>
            <span>Balanced (100%)</span>
            <span>Surplus (&gt;100%)</span>
          </div>
        </div>
      </div>

      {/* 7-Day Inflow vs Payout Velocity Chart */}
      <div className="bg-slate-800/90 p-4.5 rounded-3xl border border-slate-700/80 space-y-2.5 shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-white uppercase tracking-wider">
              7-Day Cash Flow Velocity (Inflow vs Payout)
            </div>
            <div className="text-[9.5px] text-slate-400">Green = Top-ups, Amber = Payouts</div>
          </div>
          <div className="flex items-center space-x-3 text-[10px]">
            <div className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500"></span>
              <span className="text-slate-300">Recharge</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-sm bg-amber-500"></span>
              <span className="text-slate-300">Withdraw</span>
            </div>
          </div>
        </div>

        {/* Visual SVG Bars */}
        <div className="pt-2">
          <div className="grid grid-cols-7 gap-2 items-end h-24 px-1 pb-2 border-b border-slate-700">
            {weeklyTrend.map((item, idx) => {
              const depositHeight = maxWeeklyVol > 0 ? (item.deposit / maxWeeklyVol) * 100 : 10;
              const withdrawHeight = maxWeeklyVol > 0 ? (item.withdraw / maxWeeklyVol) * 100 : 5;
              return (
                <div key={idx} className="flex flex-col items-center justify-end h-full group">
                  <div className="w-full flex justify-center space-x-1 items-end h-full">
                    {/* Inflow bar */}
                    <div
                      style={{ height: `${depositHeight}%` }}
                      className="w-2.5 sm:w-3.5 bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-sm group-hover:brightness-125 transition-all"
                      title={`Deposit: ₹${item.deposit}`}
                    ></div>
                    {/* Outflow bar */}
                    <div
                      style={{ height: `${withdrawHeight}%` }}
                      className="w-2.5 sm:w-3.5 bg-gradient-to-t from-amber-600 to-amber-400 rounded-t-sm group-hover:brightness-125 transition-all"
                      title={`Withdrawal: ₹${item.withdraw}`}
                    ></div>
                  </div>
                  <span className="text-[9.5px] text-slate-400 font-mono mt-1.5">{item.day}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Advanced Executive Fast 1-Click Operations Panel */}
      <div className="bg-slate-800/90 p-4.5 rounded-3xl border border-slate-700 space-y-3 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Executive 1-Click Command Center
            </span>
          </div>
          <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
            Instant Execution
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {/* 1. Run Daily Settlement */}
          <button
            onClick={() => runDailySettlement()}
            className="p-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-2xl font-bold text-[10.5px] flex flex-col items-center justify-center space-y-1 shadow-md shadow-emerald-700/20 active:scale-95 transition-all cursor-pointer"
            title="Execute daily dividend settlement across all running plans"
          >
            <Play className="w-3.5 h-3.5 text-amber-300" />
            <span>Settle Daily</span>
          </button>

          {/* 2. Settle Turbo Batches */}
          <button
            onClick={handleInstantSettleTurbos}
            disabled={isSettlingTurbo}
            className="p-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white rounded-2xl font-bold text-[10.5px] flex flex-col items-center justify-center space-y-1 shadow-md shadow-amber-700/20 active:scale-95 transition-all cursor-pointer"
            title="Scan & auto-credit mature turbo cycles immediately"
          >
            <Flame className={`w-3.5 h-3.5 text-yellow-200 ${isSettlingTurbo ? 'animate-bounce' : ''}`} />
            <span>{isSettlingTurbo ? 'Settling...' : 'Settle Turbos'}</span>
          </button>

          {/* 3. Approve Deposits */}
          <button
            onClick={() => approveAllPendingDeposits()}
            disabled={pendingDeposits.length === 0}
            className={`p-2.5 rounded-2xl font-bold text-[10.5px] flex flex-col items-center justify-center space-y-1 transition-all ${
              pendingDeposits.length > 0
                ? 'bg-teal-600 hover:bg-teal-500 text-white cursor-pointer active:scale-95 shadow-md shadow-teal-700/20'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
            title="1-Click Approve all pending UPI recharge receipts"
          >
            <Wallet className="w-3.5 h-3.5" />
            <span>Approve Deposits ({pendingDeposits.length})</span>
          </button>

          {/* 4. Approve Payouts */}
          <button
            onClick={() => approveAllPendingWithdrawals()}
            disabled={pendingWithdrawals.length === 0}
            className={`p-2.5 rounded-2xl font-bold text-[10.5px] flex flex-col items-center justify-center space-y-1 transition-all ${
              pendingWithdrawals.length > 0
                ? 'bg-amber-600 hover:bg-amber-500 text-white cursor-pointer active:scale-95 shadow-md shadow-amber-700/20'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
            title="1-Click Approve all pending IMPS withdrawal cashouts"
          >
            <ArrowDownToLine className="w-3.5 h-3.5" />
            <span>Approve Payouts ({pendingWithdrawals.length})</span>
          </button>

          {/* 5. Airdrop Bonus */}
          <button
            onClick={() => setShowAirdropModal(true)}
            className="p-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-2xl font-bold text-[10.5px] flex flex-col items-center justify-center space-y-1 shadow-md shadow-purple-700/20 active:scale-95 transition-all cursor-pointer"
            title="Broadcast instant cash bonus to users"
          >
            <Gift className="w-3.5 h-3.5 text-yellow-300" />
            <span>Airdrop Bonus</span>
          </button>

          {/* 6. Export CSV */}
          <button
            onClick={handleExportCSV}
            className="p-2.5 bg-slate-700 hover:bg-slate-600 text-slate-200 hover:text-white rounded-2xl font-bold text-[10.5px] flex flex-col items-center justify-center space-y-1 active:scale-95 transition-all cursor-pointer border border-slate-600"
            title="Export all financial records to CSV spreadsheet"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Real-Time Live Activity Event Stream */}
      <div className="bg-slate-800/90 p-4.5 rounded-3xl border border-slate-700 space-y-3 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Live Transaction &amp; Operations Stream
              </h4>
              <p className="text-[9.5px] text-slate-400">Real-time ledger events and platform activity</p>
            </div>
          </div>

          <div className="flex items-center space-x-1 overflow-x-auto no-scrollbar">
            {[
              { id: 'all', label: 'All' },
              { id: 'recharge', label: 'Top-ups' },
              { id: 'withdraw', label: 'Payouts' },
              { id: 'income', label: 'Dividends' },
              { id: 'plans', label: 'Purchases' }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFeedFilter(f.id as any)}
                className={`px-2 py-0.5 rounded-lg text-[9.5px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                  feedFilter === f.id
                    ? 'bg-emerald-500 text-slate-950 font-black'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Live List Stream */}
        <div className="space-y-1.5 max-h-60 overflow-y-auto no-scrollbar pr-1">
          {filteredFeed.length === 0 ? (
            <div className="text-center py-6 text-slate-500 text-xs">
              No transactions matching this filter.
            </div>
          ) : (
            filteredFeed.map((tx) => (
              <div
                key={tx.id}
                className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between text-xs hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center space-x-2.5 min-w-0">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                      tx.type === 'recharge'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : tx.type === 'withdraw'
                        ? 'bg-amber-500/20 text-amber-400'
                        : tx.type === 'daily_income'
                        ? 'bg-cyan-500/20 text-cyan-400'
                        : 'bg-purple-500/20 text-purple-400'
                    }`}
                  >
                    {tx.type === 'recharge' ? (
                      <Wallet className="w-3.5 h-3.5" />
                    ) : tx.type === 'withdraw' ? (
                      <ArrowDownToLine className="w-3.5 h-3.5" />
                    ) : tx.type === 'daily_income' ? (
                      <Zap className="w-3.5 h-3.5" />
                    ) : (
                      <Package className="w-3.5 h-3.5" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-white text-[11px] truncate">{tx.title}</div>
                    <div className="text-[9px] text-slate-400 font-mono mt-0.5">
                      {tx.date} • ID: {tx.id.slice(0, 14)}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0 pl-2">
                  <div
                    className={`font-mono font-black text-xs ${
                      tx.type === 'recharge' || tx.type === 'daily_income' || tx.type === 'team_commission'
                        ? 'text-emerald-400'
                        : tx.type === 'withdraw'
                        ? 'text-amber-400'
                        : 'text-slate-300'
                    }`}
                  >
                    {tx.type === 'recharge' || tx.type === 'daily_income' ? '+' : ''}
                    {formatINR(tx.amount)}
                  </div>
                  <span
                    className={`text-[8.5px] font-bold px-1.5 py-0.2 rounded-full uppercase ${
                      tx.status === 'success'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : tx.status === 'pending'
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-rose-500/20 text-rose-300'
                    }`}
                  >
                    {tx.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Advanced Quick Routing Cards (Support, Plans, Lucky Spin, Affiliates) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {/* Support Card */}
        <div
          onClick={() => onNavigateTab('support')}
          className="bg-slate-900 border border-slate-800 hover:border-emerald-500/40 p-3.5 rounded-2xl cursor-pointer transition-all active:scale-95 shadow-sm group"
        >
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center">
              <Headphones className="w-4 h-4" />
            </div>
            {pendingSupportCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-teal-400 text-slate-950 text-[9px] font-black">
                {pendingSupportCount} Pending
              </span>
            )}
          </div>
          <div className="mt-2">
            <h4 className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
              Support Desk
            </h4>
            <p className="text-[9.5px] text-slate-400 mt-0.5">Live inquiry resolution</p>
          </div>
        </div>

        {/* Products Card */}
        <div
          onClick={() => onNavigateTab('plans')}
          className="bg-slate-900 border border-slate-800 hover:border-emerald-500/40 p-3.5 rounded-2xl cursor-pointer transition-all active:scale-95 shadow-sm group"
        >
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <span className="text-[9.5px] font-mono text-emerald-400 font-bold">22 Plans</span>
          </div>
          <div className="mt-2">
            <h4 className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
              Products Catalog
            </h4>
            <p className="text-[9.5px] text-slate-400 mt-0.5">Blade pricing & yields</p>
          </div>
        </div>

        {/* Lucky Spin Card */}
        <div
          onClick={() => onNavigateTab('luckyspin')}
          className="bg-slate-900 border border-slate-800 hover:border-amber-500/40 p-3.5 rounded-2xl cursor-pointer transition-all active:scale-95 shadow-sm group"
        >
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Gift className="w-4 h-4" />
            </div>
            <span className="text-[9.5px] font-mono text-amber-400 font-bold">Active</span>
          </div>
          <div className="mt-2">
            <h4 className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">
              Lucky Spin Wheel
            </h4>
            <p className="text-[9.5px] text-slate-400 mt-0.5">Win rates & multipliers</p>
          </div>
        </div>

        {/* Affiliates Card */}
        <div
          onClick={() => onNavigateTab('affiliates')}
          className="bg-slate-900 border border-slate-800 hover:border-purple-500/40 p-3.5 rounded-2xl cursor-pointer transition-all active:scale-95 shadow-sm group"
        >
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Share2 className="w-4 h-4" />
            </div>
            <span className="text-[9.5px] font-mono text-purple-400 font-bold">3-Tier</span>
          </div>
          <div className="mt-2">
            <h4 className="text-xs font-bold text-white group-hover:text-purple-400 transition-colors">
              Affiliates &amp; VIP
            </h4>
            <p className="text-[9.5px] text-slate-400 mt-0.5">Referral commission matrix</p>
          </div>
        </div>
      </div>

      {/* Airdrop Bonus Modal */}
      {showAirdropModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-slate-900 border border-purple-500/40 rounded-3xl max-w-sm w-full p-5 space-y-4 shadow-2xl relative text-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Gift className="w-5 h-5 text-purple-400" />
                <h3 className="text-sm font-black">Global Investor Air-Drop</h3>
              </div>
              <button
                onClick={() => setShowAirdropModal(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">
                  Air-Drop Amount per Account (₹)
                </label>
                <input
                  type="number"
                  value={airdropAmount}
                  onChange={(e) => setAirdropAmount(e.target.value)}
                  placeholder="e.g. 100"
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono font-bold text-sm focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">
                  Credit Reason &amp; Title
                </label>
                <input
                  type="text"
                  value={airdropNote}
                  onChange={(e) => setAirdropNote(e.target.value)}
                  placeholder="e.g. Festival Special Bonus"
                  className="w-full p-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-2 border-t border-slate-800">
              <button
                onClick={handleExecuteAirdrop}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs active:scale-95 transition-all shadow-md cursor-pointer"
              >
                Disburse Air-Drop Now
              </button>
              <button
                onClick={() => setShowAirdropModal(false)}
                className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
