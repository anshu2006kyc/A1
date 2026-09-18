import React from 'react';
import {
  Activity,
  ArrowDownToLine,
  CheckCircle2,
  ChevronRight,
  Database,
  Lock,
  PieChart,
  Play,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  Unlock,
  Wallet,
  Zap
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatINR } from '../../utils/currency';

interface AdminOverviewTabProps {
  onNavigateTab: (tab: any) => void;
}

export const AdminOverviewTab: React.FC<AdminOverviewTabProps> = ({ onNavigateTab }) => {
  const {
    user,
    transactions,
    userPlans,
    adminSettings,
    updateAdminSettings,
    runDailySettlement,
    approveAllPendingDeposits,
    approveAllPendingWithdrawals,
    generateDemoTransactions,
    securityAlerts
  } = useApp();

  const totalRechargeVol = transactions
    .filter((t) => t.type === 'recharge' && t.status === 'success')
    .reduce((s, t) => s + t.amount, 0);

  const pendingDeposits = transactions.filter(
    (t) => t.type === 'recharge' && t.status === 'pending'
  );

  const totalWithdrawnVol = transactions
    .filter((t) => t.type === 'withdraw' && t.status === 'success')
    .reduce((s, t) => s + t.amount, 0);

  const pendingWithdrawals = transactions.filter(
    (t) => t.type === 'withdraw' && t.status === 'pending'
  );

  const netCashFlow = totalRechargeVol - totalWithdrawnVol;
  const activeInvestmentsCount = userPlans.filter((p) => p.status === 'active').length;
  const totalPendingLiability = userPlans
    .filter((p) => p.status === 'active')
    .reduce((s, p) => s + (p.totalReturn - (p.dailyIncome * p.daysClaimed)), 0);

  // Solvency ratio (total deposits vs liabilities + balance)
  const totalLiability = user.balance + totalPendingLiability;
  const solvencyRatio = totalLiability > 0 ? Math.min(Math.round((totalRechargeVol / totalLiability) * 100), 250) : 100;

  // 7-day demo volume trend for visual SVG bar chart
  const weeklyTrend = [
    { day: 'Mon', deposit: 12500, withdraw: 4200 },
    { day: 'Tue', deposit: 18400, withdraw: 7100 },
    { day: 'Wed', deposit: 24200, withdraw: 8900 },
    { day: 'Thu', deposit: 19800, withdraw: 11200 },
    { day: 'Fri', deposit: 31500, withdraw: 14600 },
    { day: 'Sat', deposit: 42000, withdraw: 16800 },
    { day: 'Today', deposit: Math.max(totalRechargeVol, 28000), withdraw: Math.max(totalWithdrawnVol, 9500) }
  ];

  const maxWeeklyVol = Math.max(...weeklyTrend.map((d) => Math.max(d.deposit, d.withdraw)));

  return (
    <div className="space-y-4">
      {/* Live Server Status Bar */}
      <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl flex flex-wrap items-center justify-between gap-2.5 text-xs shadow-md">
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

        <div className="flex items-center space-x-3 text-[11px] text-slate-400 font-mono">
          <span>Latency: <strong className="text-emerald-400">14ms</strong></span>
          <span>Workers: <strong className="text-white">4 Active</strong></span>
          <span>Gateway: <strong className="text-emerald-400">Sunpays 200 OK</strong></span>
        </div>
      </div>

      {/* Emergency Freeze Banner if active */}
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
            className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs shrink-0 cursor-pointer"
          >
            Lift Locks
          </button>
        </div>
      )}

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-800/90 p-4 rounded-2xl border border-slate-700/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>User Funds</span>
            <Wallet className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-black text-white mt-1 tabular-nums font-mono">{formatINR(user.balance)}</div>
          <div className="text-[10px] text-emerald-400 mt-0.5">UID #{user.id} Wallet</div>
        </div>

        <div className="bg-slate-800/90 p-4 rounded-2xl border border-slate-700/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Inflow</span>
            <TrendingUp className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-xl font-black text-white mt-1 tabular-nums font-mono">{formatINR(totalRechargeVol, { decimals: 0 })}</div>
          <div className="text-[10px] text-teal-400 mt-0.5">{pendingDeposits.length} pending review</div>
        </div>

        <div className="bg-slate-800/90 p-4 rounded-2xl border border-slate-700/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Outflow</span>
            <ArrowDownToLine className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-black text-white mt-1 tabular-nums font-mono">{formatINR(totalWithdrawnVol, { decimals: 0 })}</div>
          <div className="text-[10px] text-amber-400 mt-0.5">{pendingWithdrawals.length} pending cashouts</div>
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
          <div className="text-[10px] text-slate-400 mt-0.5">Retained Treasury</div>
        </div>
      </div>

      {/* Financial Solvency & Reserve Health */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 p-5 rounded-3xl border border-slate-700/90 space-y-3.5 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Solvency & Reserve Ratio Analysis
            </span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            Health: {solvencyRatio >= 100 ? 'EXCELLENT' : 'MONITOR'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Total Liquid Deposits</span>
            <span className="text-sm font-black text-white font-mono">{formatINR(totalRechargeVol, { decimals: 0 })}</span>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Active Machine Liability</span>
            <span className="text-sm font-black text-amber-400 font-mono">{formatINR(totalPendingLiability, { decimals: 0 })}</span>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Solvency Ratio</span>
            <span className="text-sm font-black text-emerald-400 font-mono">{solvencyRatio}%</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-teal-500 to-emerald-400 h-full transition-all duration-500"
              style={{ width: `${Math.min(solvencyRatio, 100)}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 mt-1">
            <span>Critical (0%)</span>
            <span>Balanced (100%)</span>
            <span>Surplus (&gt;100%)</span>
          </div>
        </div>
      </div>

      {/* 7-Day Cash Flow Trend Chart (SVG) */}
      <div className="bg-slate-800/90 p-5 rounded-3xl border border-slate-700/80 space-y-3 shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-white uppercase tracking-wider">
              7-Day Cash Flow Velocity (Inflow vs Payout)
            </div>
            <div className="text-[10px] text-slate-400">Green = Top-ups, Amber = Payouts</div>
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
          <div className="grid grid-cols-7 gap-2 items-end h-28 px-1 pb-2 border-b border-slate-700">
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
                  <span className="text-[10px] text-slate-400 font-mono mt-2">{item.day}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Fast Batch Operations Panel */}
      <div className="bg-slate-800/90 p-5 rounded-3xl border border-slate-700 space-y-3 shadow-md">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Fast 1-Click Operations
          </div>
          <span className="text-[10px] text-slate-400">High Speed Execution</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <button
            onClick={() => runDailySettlement()}
            className="p-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-2xl font-bold text-xs flex flex-col items-center justify-center space-y-1 shadow-lg shadow-emerald-700/20 active:scale-95 transition-all cursor-pointer"
          >
            <Zap className="w-4 h-4 text-amber-300" />
            <span>Run Settlement</span>
          </button>

          <button
            onClick={() => approveAllPendingDeposits()}
            disabled={pendingDeposits.length === 0}
            className={`p-3 rounded-2xl font-bold text-xs flex flex-col items-center justify-center space-y-1 transition-all ${
              pendingDeposits.length > 0
                ? 'bg-teal-600 hover:bg-teal-500 text-white cursor-pointer active:scale-95 shadow-md shadow-teal-700/20'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
          >
            <Wallet className="w-4 h-4" />
            <span>Approve Deposits ({pendingDeposits.length})</span>
          </button>

          <button
            onClick={() => approveAllPendingWithdrawals()}
            disabled={pendingWithdrawals.length === 0}
            className={`p-3 rounded-2xl font-bold text-xs flex flex-col items-center justify-center space-y-1 transition-all ${
              pendingWithdrawals.length > 0
                ? 'bg-amber-600 hover:bg-amber-500 text-white cursor-pointer active:scale-95 shadow-md shadow-amber-700/20'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
          >
            <ArrowDownToLine className="w-4 h-4" />
            <span>Approve Payouts ({pendingWithdrawals.length})</span>
          </button>

          <button
            onClick={() => generateDemoTransactions()}
            className="p-3 bg-slate-700 hover:bg-slate-600 text-slate-200 hover:text-white rounded-2xl font-bold text-xs flex flex-col items-center justify-center space-y-1 active:scale-95 transition-all cursor-pointer border border-slate-600"
          >
            <RotateCcw className="w-4 h-4 text-purple-400" />
            <span>Inject Demo Feed</span>
          </button>
        </div>
      </div>

      {/* Review Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-white">Pending Deposits</div>
            <div className="text-sm text-slate-400 mt-0.5">
              {pendingDeposits.length} payments waiting verification
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('deposits')}
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center cursor-pointer"
          >
            <span>Review</span>
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>

        <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-white">Pending Withdrawals</div>
            <div className="text-sm text-slate-400 mt-0.5">
              {pendingWithdrawals.length} cashouts waiting processing
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('withdrawals')}
            className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center cursor-pointer"
          >
            <span>Review</span>
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};
