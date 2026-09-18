import React, { useState } from 'react';
import {
  Activity,
  Check,
  CheckCircle2,
  Clock,
  Code2,
  Copy,
  Cpu,
  Flame,
  Percent,
  Play,
  RotateCcw,
  Sliders,
  Terminal,
  Zap
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatINR } from '../../utils/currency';

export const AdminEngineTab: React.FC = () => {
  const {
    adminSettings,
    updateAdminSettings,
    userPlans,
    runDailySettlement,
    returnPlanCycle,
    showToast
  } = useApp();

  const [copiedCron, setCopiedCron] = useState(false);

  const activePlans = userPlans.filter((p) => p.status === 'active');
  const turboPlans = activePlans.filter((p) => p.durationMinutes || (p as any).category === 'turbo');
  const normalPlans = activePlans.filter((p) => !p.durationMinutes && (p as any).category !== 'turbo');

  const cronString = `* * * * * /usr/bin/php /home/u12345/public_html/cron_settle.php >> /dev/null 2>&1`;

  const copyCronCommand = () => {
    navigator.clipboard?.writeText(cronString);
    setCopiedCron(true);
    showToast('CRON command copied to clipboard!', 'info');
    setTimeout(() => setCopiedCron(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Engine Status Header */}
      <div className="bg-slate-800/90 p-5 rounded-3xl border border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-lg shadow-orange-950/40">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-bold text-white">Automated Settlement & Return Engine</h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                ACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Processes 1-minute turbo plans and 24-hour agricultural dividend distributions
            </p>
          </div>
        </div>

        <button
          onClick={() => runDailySettlement()}
          className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-2xl text-xs flex items-center space-x-2 shadow-lg shadow-emerald-700/20 active:scale-95 transition-all cursor-pointer shrink-0"
        >
          <Play className="w-4 h-4 text-amber-300" />
          <span>Execute Instant Settlement</span>
        </button>
      </div>

      {/* Engine Controls Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Turbo Auto-Credit Automation Toggle */}
        <div className="bg-slate-800/90 p-5 rounded-3xl border border-slate-700 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Flame className="w-4 h-4 text-amber-400" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Turbo Auto-Credit Engine
              </h4>
            </div>
            <span
              className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                adminSettings.turboAutoSettlement
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-slate-700 text-slate-400'
              }`}
            >
              {adminSettings.turboAutoSettlement ? 'AUTO-PILOT ON' : 'MANUAL CLAIM'}
            </span>
          </div>

          <p className="text-xs text-slate-400">
            When enabled, users with Flash Turbo products receive their full payout immediately upon plan expiry without needing to manually click claim.
          </p>

          <div className="pt-2">
            <button
              onClick={() =>
                updateAdminSettings({
                  turboAutoSettlement: !adminSettings.turboAutoSettlement
                })
              }
              className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                adminSettings.turboAutoSettlement
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'
                  : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
              }`}
            >
              {adminSettings.turboAutoSettlement ? 'Disable Auto-Settler' : 'Enable Turbo Auto-Pilot'}
            </button>
          </div>
        </div>

        {/* Global Return Multiplier */}
        <div className="bg-slate-800/90 p-5 rounded-3xl border border-slate-700 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-emerald-400" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Global Return Multiplier
              </h4>
            </div>
            <span className="text-xs font-mono font-black text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded-lg border border-amber-400/30">
              {adminSettings.globalReturnMultiplier || 1.0}x Boost
            </span>
          </div>

          <p className="text-xs text-slate-400">
            Dynamically scales dividend rates across all plans during festival or promotional campaigns.
          </p>

          <div className="pt-2 space-y-2">
            <input
              type="range"
              min="1.0"
              max="2.0"
              step="0.05"
              value={adminSettings.globalReturnMultiplier || 1.0}
              onChange={(e) =>
                updateAdminSettings({
                  globalReturnMultiplier: parseFloat(e.target.value)
                })
              }
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>1.0x (Standard)</span>
              <span>1.5x (Promo)</span>
              <span>2.0x (Double Return)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Real-Time Machine Monitor */}
      <div className="bg-slate-800/90 rounded-3xl border border-slate-700 p-5 space-y-3 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-sky-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Active Machines in Operation ({activePlans.length})
            </h4>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            {turboPlans.length} Turbo • {normalPlans.length} Long-Term
          </span>
        </div>

        {activePlans.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-500 bg-slate-900/50 rounded-2xl">
            No active user machines running currently.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {activePlans.map((up) => {
              const progress = Math.min(Math.round((up.daysClaimed / up.returnDays) * 100), 100);
              return (
                <div
                  key={up.id}
                  className="p-3.5 bg-slate-900/90 rounded-2xl border border-slate-800 text-xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white truncate">{up.title}</span>
                    <span
                      className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded ${
                        up.category === 'turbo'
                          ? 'bg-amber-400 text-slate-950'
                          : 'bg-emerald-500/20 text-emerald-400'
                      }`}
                    >
                      {up.durationMinutes ? `${up.durationMinutes}m Turbo` : `${up.returnDays}d Term`}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Plan Return:</span>
                    <span className="text-emerald-400 font-bold font-mono">{formatINR(up.dailyIncome)}</span>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-1">
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>Claimed: {up.daysClaimed} / {up.returnDays}</span>
                      <span>{progress}% Completed</span>
                    </div>
                  </div>

                  <div className="pt-1">
                    <button
                      id={`admin-return-plan-btn-${up.id}`}
                      type="button"
                      onClick={() => returnPlanCycle(up.id)}
                      className="w-full py-1.5 px-2 bg-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-slate-700 hover:border-rose-800/60 rounded-xl text-[10px] font-bold flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3 text-rose-400" />
                      <span>Return Plan & Refund Deposit ({formatINR(up.depositAmount)})</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Production Server CRON Instructions */}
      <div className="bg-slate-900/90 p-5 rounded-3xl border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Server CRON Automation String
            </h4>
          </div>
          <button
            onClick={copyCronCommand}
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center space-x-1 cursor-pointer"
          >
            {copiedCron ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedCron ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        <p className="text-xs text-slate-400">
          Add this entry to your Linux cPanel / server crontab (`crontab -e`) to execute background settlements every minute automatically:
        </p>

        <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 font-mono text-xs text-emerald-400 overflow-x-auto">
          {cronString}
        </div>
      </div>
    </div>
  );
};
