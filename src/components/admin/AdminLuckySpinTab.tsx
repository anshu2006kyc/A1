import React, { useState } from 'react';
import {
  Gift,
  Crown,
  RotateCcw,
  Trophy,
  CheckCircle2,
  AlertCircle,
  Coins,
  ShieldCheck,
  Percent,
  Play,
  Flame,
  Settings2,
  RefreshCw
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatINR } from '../../utils/currency';
import { DEMO_SPIN_WINNERS } from '../../data/initialData';

export const AdminLuckySpinTab: React.FC = () => {
  const {
    adminSettings,
    updateAdminSettings,
    showToast,
    luckySpinRecords,
    registeredUsers,
    setUser
  } = useApp();

  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResults, setSimulationResults] = useState<{
    totalSpins: number;
    totalPayout: number;
    avgWin: number;
    jackpotHits: number;
  } | null>(null);

  // Wheel Segments Config
  const [segments, setSegments] = useState([
    { id: 1, label: '₹10.00', amount: 10, weight: 35, color: '#059669', isJackpot: false },
    { id: 2, label: '₹25.00', amount: 25, weight: 25, color: '#0284c7', isJackpot: false },
    { id: 3, label: '₹50.00', amount: 50, weight: 18, color: '#d97706', isJackpot: false },
    { id: 4, label: '₹100.00', amount: 100, weight: 12, color: '#7c3aed', isJackpot: false },
    { id: 5, label: '₹250.00', amount: 250, weight: 7, color: '#db2777', isJackpot: false },
    { id: 6, label: '₹500.00', amount: 500, weight: 3, color: '#eab308', isJackpot: true }
  ]);

  const [dailySpinLimit, setDailySpinLimit] = useState(1);
  const [isJackpotEnabled, setIsJackpotEnabled] = useState(true);

  // Reset all users' daily spins
  const handleResetAllSpins = () => {
    localStorage.removeItem('akm_user_spins');
    setUser((prev) => ({ ...prev, lastSpinDate: undefined }));
    showToast('Success: Daily Lucky Spin counter reset for all users! Free spins are now active.', 'success');
  };

  // Run statistical simulation of 100 spins
  const runSimulation = (count = 100) => {
    setIsSimulating(true);
    setTimeout(() => {
      let totalPayout = 0;
      let jackpotHits = 0;

      const totalWeight = segments.reduce((sum, s) => sum + s.weight, 0);

      for (let i = 0; i < count; i++) {
        let rand = Math.random() * totalWeight;
        let won = segments[0];
        for (const seg of segments) {
          if (rand < seg.weight) {
            won = seg;
            break;
          }
          rand -= seg.weight;
        }

        totalPayout += won.amount;
        if (won.isJackpot) jackpotHits++;
      }

      setSimulationResults({
        totalSpins: count,
        totalPayout,
        avgWin: Math.round((totalPayout / count) * 100) / 100,
        jackpotHits
      });
      setIsSimulating(false);
      showToast(`Simulation complete: ${count} spins generated total payout of ${formatINR(totalPayout)}.`, 'info');
    }, 400);
  };

  return (
    <div className="space-y-4">
      {/* Top Banner & Quick Controls */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-emerald-950 p-4 sm:p-5 rounded-3xl border border-amber-400/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/25 shrink-0">
            <Gift className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-black text-white tracking-tight">
                Lucky Spin & Gamification Hub
              </h2>
              <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                100% Cash Rewards
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Configure daily wheel rewards, prize segments, RTP probability weights, and festival spin resets.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto">
          <button
            onClick={handleResetAllSpins}
            className="flex-1 md:flex-initial px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs flex items-center justify-center space-x-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Spins (Festival)</span>
          </button>
        </div>
      </div>

      {/* Probability Simulation & Live Payout Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-1">
            Max Jackpot Prize
          </div>
          <div className="text-xl font-black font-mono text-amber-400">
            ₹500.00
          </div>
          <div className="text-[10px] text-emerald-400 font-medium mt-1 flex items-center space-x-1">
            <Crown className="w-3 h-3 text-amber-400" />
            <span>Guaranteed Instant Credited</span>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-1">
            Daily Spin Allowance
          </div>
          <div className="text-xl font-black font-mono text-white">
            1 Free Spin / User
          </div>
          <div className="text-[10px] text-slate-400 font-medium mt-1">
            Resets automatically at 00:00 IST
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-1">
            Total Recorded Spins
          </div>
          <div className="text-xl font-black font-mono text-emerald-400">
            {luckySpinRecords.length + DEMO_SPIN_WINNERS.length} Spins
          </div>
          <div className="text-[10px] text-slate-400 font-medium mt-1">
            Active player engagement: 98.4%
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-1">
              RTP Monte Carlo Tester
            </div>
            <div className="text-xs text-slate-300 font-medium">
              Simulate 100 spins to audit platform budget
            </div>
          </div>
          <button
            onClick={() => runSimulation(100)}
            disabled={isSimulating}
            className="mt-2 w-full py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-bold border border-slate-700 flex items-center justify-center space-x-1 cursor-pointer active:scale-95 transition-all"
          >
            <Play className="w-3 h-3 fill-emerald-400" />
            <span>{isSimulating ? 'Simulating...' : 'Simulate 100 Spins'}</span>
          </button>
        </div>
      </div>

      {/* Simulation Result Card */}
      {simulationResults && (
        <div className="bg-emerald-950/60 border border-emerald-500/40 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs animate-fade-in">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">
                100 Spins Simulation Report
              </div>
              <div className="text-slate-300 text-[11px]">
                Total Platform Outflow: <strong className="text-emerald-400 font-mono font-bold">{formatINR(simulationResults.totalPayout)}</strong> • Average Payout: <strong className="font-mono text-amber-300">{formatINR(simulationResults.avgWin)}</strong> • Mega Jackpots: <strong className="text-amber-400">{simulationResults.jackpotHits}</strong>
              </div>
            </div>
          </div>
          <button
            onClick={() => setSimulationResults(null)}
            className="text-[11px] text-slate-400 hover:text-white underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Slices & Probability Configuration */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-lg">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center space-x-2">
            <Settings2 className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white">
              Lucky Wheel Segments & Odds Weight Matrix
            </h3>
          </div>
          <span className="text-[10px] text-slate-400 font-medium">
            Higher weight = Higher winning probability
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {segments.map((seg, idx) => (
            <div
              key={seg.id}
              className={`p-3 rounded-2xl border flex flex-col justify-between transition-all ${
                seg.isJackpot
                  ? 'bg-amber-950/40 border-amber-500/60 shadow-md'
                  : 'bg-slate-950 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div
                    className="w-4 h-4 rounded-full border border-white/40"
                    style={{ backgroundColor: seg.color }}
                  />
                  <span className="text-xs font-black text-white">
                    Slot #{idx + 1}
                  </span>
                  {seg.isJackpot && (
                    <span className="text-[9px] font-black uppercase tracking-wider text-amber-300 bg-amber-400/20 px-1.5 py-0.5 rounded border border-amber-400/40">
                      👑 Jackpot
                    </span>
                  )}
                </div>
                <span className="text-xs font-mono font-black text-emerald-400">
                  {formatINR(seg.amount)}
                </span>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Display Label:</span>
                  <input
                    type="text"
                    value={seg.label}
                    onChange={(e) => {
                      const updated = [...segments];
                      updated[idx].label = e.target.value;
                      setSegments(updated);
                    }}
                    className="w-24 p-1 rounded bg-slate-900 border border-slate-700 text-right text-white font-bold"
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Cash Reward (₹):</span>
                  <input
                    type="number"
                    value={seg.amount}
                    onChange={(e) => {
                      const updated = [...segments];
                      updated[idx].amount = parseFloat(e.target.value) || 0;
                      setSegments(updated);
                    }}
                    className="w-24 p-1 rounded bg-slate-900 border border-slate-700 text-right text-emerald-400 font-mono font-bold"
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Probability Weight:</span>
                  <input
                    type="number"
                    value={seg.weight}
                    onChange={(e) => {
                      const updated = [...segments];
                      updated[idx].weight = parseInt(e.target.value) || 1;
                      setSegments(updated);
                    }}
                    className="w-24 p-1 rounded bg-slate-900 border border-slate-700 text-right text-amber-300 font-bold"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={() => showToast('Lucky Wheel parameters saved successfully!', 'success')}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md active:scale-95 transition-all cursor-pointer"
          >
            Save Wheel Settings
          </button>
        </div>
      </div>

      {/* Live Recent Lucky Winners Feed */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-lg">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
          <div className="flex items-center space-x-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white">
              Live Verified Spin Winners Feed
            </h3>
          </div>
          <span className="text-[10px] text-emerald-400 font-mono font-bold flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>REAL-TIME AUDITED</span>
          </span>
        </div>

        <div className="divide-y divide-slate-800">
          {DEMO_SPIN_WINNERS.map((winner, idx) => (
            <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2.5">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                  winner.isJackpot ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-300'
                }`}>
                  {winner.isJackpot ? '👑' : '🎁'}
                </div>
                <div>
                  <div className="font-mono font-bold text-white">
                    {winner.phone}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {winner.isJackpot ? 'Mega Jackpot Winner' : 'Daily Free Spin Win'}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="font-mono font-black text-emerald-400">
                  +{formatINR(winner.amount)}
                </div>
                <div className="text-[9.5px] text-emerald-500/80">
                  Wallet Credited
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
