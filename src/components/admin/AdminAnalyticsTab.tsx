import React from 'react';
import {
  BarChart3,
  CheckCircle2,
  Clock,
  Layers,
  Percent,
  TrendingUp,
  Users,
  Wallet,
  Zap
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatINR } from '../../utils/currency';

export const AdminAnalyticsTab: React.FC = () => {
  const {
    transactions,
    userPlans,
    plans,
    teamMembers,
    adminSettings,
    streakDays,
    totalCheckInDays,
    totalCheckInEarned
  } = useApp();

  // Transactions calculations
  const successfulDeposits = transactions.filter(
    (t) => t.type === 'recharge' && t.status === 'success'
  );
  const totalDepositAmount = successfulDeposits.reduce((acc, t) => acc + t.amount, 0);
  const avgDepositSize = successfulDeposits.length > 0 ? Math.round(totalDepositAmount / successfulDeposits.length) : 0;

  const successfulWithdrawals = transactions.filter(
    (t) => t.type === 'withdraw' && t.status === 'success'
  );
  const totalWithdrawAmount = successfulWithdrawals.reduce((acc, t) => acc + t.amount, 0);
  const avgWithdrawSize = successfulWithdrawals.length > 0 ? Math.round(totalWithdrawAmount / successfulWithdrawals.length) : 0;

  // Plan categories volume distribution
  const turboPlansCount = userPlans.filter((p) => p.category === 'turbo').length;
  const normalPlansCount = userPlans.filter((p) => p.category === 'normal').length;
  const vipPlansCount = userPlans.filter((p) => p.category === 'vip').length;
  const totalInvestments = userPlans.length || 1;

  const turboPercent = Math.round((turboPlansCount / totalInvestments) * 100);
  const normalPercent = Math.round((normalPlansCount / totalInvestments) * 100);
  const vipPercent = Math.max(0, 100 - turboPercent - normalPercent);

  // Referral breakdown
  const tier1Members = teamMembers.filter((m) => m.level === 1);
  const tier2Members = teamMembers.filter((m) => m.level === 2);
  const tier3Members = teamMembers.filter((m) => m.level === 3);

  const totalTier1Commission = tier1Members.reduce((s, m) => s + m.commissionEarned, 0);
  const totalTier2Commission = tier2Members.reduce((s, m) => s + m.commissionEarned, 0);
  const totalTier3Commission = tier3Members.reduce((s, m) => s + m.commissionEarned, 0);

  return (
    <div className="space-y-4">
      {/* Overview Banner */}
      <div className="bg-slate-800/90 p-4 rounded-3xl border border-slate-700 flex items-center justify-between shadow-md">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Financial & Product Analytics</h3>
            <p className="text-xs text-slate-400">Deep telemetry on revenue curves, user retention & channel performance</p>
          </div>
        </div>
      </div>

      {/* Ticket Size & Velocity Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-slate-800/90 p-4 rounded-2xl border border-slate-700">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Avg. Deposit Size</span>
            <Wallet className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-black text-white mt-1 font-mono">{formatINR(avgDepositSize, { decimals: 0 })}</div>
          <div className="text-[10px] text-emerald-400 mt-0.5">{successfulDeposits.length} successful deposits</div>
        </div>

        <div className="bg-slate-800/90 p-4 rounded-2xl border border-slate-700">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Avg. Payout Size</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-black text-white mt-1 font-mono">{formatINR(avgWithdrawSize, { decimals: 0 })}</div>
          <div className="text-[10px] text-amber-400 mt-0.5">{successfulWithdrawals.length} completed cashouts</div>
        </div>

        <div className="bg-slate-800/90 p-4 rounded-2xl border border-slate-700">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Withdraw Fee Collected</span>
            <Percent className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-xl font-black text-white mt-1 font-mono">
            {formatINR(Math.round((totalWithdrawAmount * adminSettings.withdrawFeePercent) / 100), { decimals: 0 })}
          </div>
          <div className="text-[10px] text-sky-400 mt-0.5">{adminSettings.withdrawFeePercent}% Platform Margin</div>
        </div>
      </div>

      {/* Plan Category Share */}
      <div className="bg-slate-800/90 p-5 rounded-3xl border border-slate-700 space-y-4 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Product Category Breakdown</h4>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">{userPlans.length} Active Machines</span>
        </div>

        {/* Multi-segment progress bar */}
        <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden flex">
          <div style={{ width: `${turboPercent}%` }} className="bg-amber-400 h-full" title={`Turbo: ${turboPercent}%`}></div>
          <div style={{ width: `${normalPercent}%` }} className="bg-emerald-500 h-full" title={`Normal: ${normalPercent}%`}></div>
          <div style={{ width: `${vipPercent}%` }} className="bg-purple-500 h-full" title={`VIP: ${vipPercent}%`}></div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
            <span className="inline-block w-2 h-2 rounded-full bg-amber-400 mr-1.5"></span>
            <span className="text-slate-300 font-bold">Turbo Flash</span>
            <div className="text-lg font-black text-white mt-1">{turboPlansCount} ({turboPercent}%)</div>
          </div>
          <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 mr-1.5"></span>
            <span className="text-slate-300 font-bold">Agriculture</span>
            <div className="text-lg font-black text-white mt-1">{normalPlansCount} ({normalPercent}%)</div>
          </div>
          <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
            <span className="inline-block w-2 h-2 rounded-full bg-purple-500 mr-1.5"></span>
            <span className="text-slate-300 font-bold">VIP Industrial</span>
            <div className="text-lg font-black text-white mt-1">{vipPlansCount} ({vipPercent}%)</div>
          </div>
        </div>
      </div>

      {/* Retention & Team Affiliate Telemetry */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Retention & Daily Check-in */}
        <div className="bg-slate-800/90 p-5 rounded-3xl border border-slate-700 space-y-3">
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">User Retention & Activity</h4>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between p-2.5 bg-slate-900/60 rounded-xl border border-slate-800">
              <span className="text-slate-400">Current Check-in Streak:</span>
              <span className="font-bold text-amber-400 font-mono">{streakDays} Consecutive Days</span>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-slate-900/60 rounded-xl border border-slate-800">
              <span className="text-slate-400">Total Check-in Days:</span>
              <span className="font-bold text-white font-mono">{totalCheckInDays} Days</span>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-slate-900/60 rounded-xl border border-slate-800">
              <span className="text-slate-400">Total Check-in Bonus Paid:</span>
              <span className="font-bold text-emerald-400 font-mono">{formatINR(totalCheckInEarned)}</span>
            </div>
          </div>
        </div>

        {/* Affiliate Tier Distribution */}
        <div className="bg-slate-800/90 p-5 rounded-3xl border border-slate-700 space-y-3">
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-indigo-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Multi-Tier Affiliate Earnings</h4>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between p-2.5 bg-slate-900/60 rounded-xl border border-slate-800">
              <div>
                <span className="font-bold text-white">Tier 1 Direct ({adminSettings.commissionLevel1}%)</span>
                <span className="text-[10px] text-slate-400 block">{tier1Members.length} active referrers</span>
              </div>
              <span className="font-bold text-emerald-400 font-mono">{formatINR(totalTier1Commission)}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-slate-900/60 rounded-xl border border-slate-800">
              <div>
                <span className="font-bold text-white">Tier 2 Sub-network ({adminSettings.commissionLevel2}%)</span>
                <span className="text-[10px] text-slate-400 block">{tier2Members.length} active members</span>
              </div>
              <span className="font-bold text-emerald-400 font-mono">{formatINR(totalTier2Commission)}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-slate-900/60 rounded-xl border border-slate-800">
              <div>
                <span className="font-bold text-white">Tier 3 Deep Network ({adminSettings.commissionLevel3}%)</span>
                <span className="text-[10px] text-slate-400 block">{tier3Members.length} active members</span>
              </div>
              <span className="font-bold text-emerald-400 font-mono">{formatINR(totalTier3Commission)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
