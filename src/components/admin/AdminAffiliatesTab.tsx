import React, { useState } from 'react';
import {
  Share2,
  Users,
  Trophy,
  Award,
  DollarSign,
  TrendingUp,
  Percent,
  CheckCircle2,
  Gift,
  Search,
  Download,
  ShieldCheck,
  ChevronRight,
  UserCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatINR } from '../../utils/currency';

export const AdminAffiliatesTab: React.FC = () => {
  const {
    adminSettings,
    updateAdminSettings,
    registeredUsers,
    transactions,
    userPlans,
    showToast,
    adjustUserBalance,
    addAuditLog
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [bonusAmount, setBonusAmount] = useState<number>(500);
  const [selectedUserForBonus, setSelectedUserForBonus] = useState<number | null>(null);

  // Form states for multi-tier rates
  const [level1, setLevel1] = useState(adminSettings.commissionLevel1 || 10);
  const [level2, setLevel2] = useState(adminSettings.commissionLevel2 || 3);
  const [level3, setLevel3] = useState(adminSettings.commissionLevel3 || 1);
  const [welcomeBonus, setWelcomeBonus] = useState(50);
  const [minRefWithdraw, setMinRefWithdraw] = useState(200);

  const handleSaveRates = (e: React.FormEvent) => {
    e.preventDefault();
    updateAdminSettings({
      commissionLevel1: level1,
      commissionLevel2: level2,
      commissionLevel3: level3
    });
    showToast('Multi-tier referral rates updated successfully!', 'success');
  };

  // Calculate team downlines for registered users
  const affiliatesData = registeredUsers.map((u) => {
    // Find users invited by this user
    const directDownline = registeredUsers.filter(
      (child) => child.inviteCode && child.inviteCode === u.inviteCode
    );
    
    // Total deposit volume of direct downline
    const teamRechargeVolume = transactions
      .filter((t) => directDownline.some((d) => d.id === t.userId) && t.type === 'recharge' && t.status === 'success')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalCommissionEarned = Math.round((teamRechargeVolume * (level1 / 100)) * 100) / 100;

    return {
      user: u,
      directCount: directDownline.length,
      teamVolume: teamRechargeVolume,
      commissionEarned: totalCommissionEarned
    };
  });

  const filteredAffiliates = affiliatesData.filter(
    (a) =>
      a.user.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.user.inviteCode && a.user.inviteCode.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleAwardBonus = (userId: number, userName: string) => {
    if (bonusAmount <= 0) {
      showToast('Please enter a valid bonus amount', 'error');
      return;
    }

    adjustUserBalance(userId, bonusAmount, `Top Affiliate Leader Bonus awarded by Executive Admin`);
    addAuditLog('bonus', 'Affiliate Bonus Disbursed', `Credited ${formatINR(bonusAmount)} to ${userName} (User #${userId})`, bonusAmount, 'success');
    showToast(`Successfully credited ${formatINR(bonusAmount)} bonus to ${userName}!`, 'success');
    setSelectedUserForBonus(null);
  };

  const exportAffiliateData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(affiliatesData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `akm_affiliates_matrix_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Affiliates matrix exported successfully!', 'success');
  };

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 p-4 sm:p-5 rounded-3xl border border-emerald-500/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/25 shrink-0">
            <Share2 className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-black text-white tracking-tight">
                Referral & Multi-Tier Affiliate Matrix
              </h2>
              <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                3-Tier Auto Settlement
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Control 3-tier commission percentages, affiliate rewards, downline hierarchies, and instant bonus grants.
            </p>
          </div>
        </div>

        <button
          onClick={exportAffiliateData}
          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs flex items-center space-x-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Network Data</span>
        </button>
      </div>

      {/* Multi-Tier Rate Controls */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-lg">
        <form onSubmit={handleSaveRates} className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <Percent className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">
                3-Tier Commission Rates & Registration Incentives
              </h3>
            </div>
            <span className="text-[10px] text-slate-400 font-medium">
              Applied automatically when downline activates any plan
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Level 1 */}
            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-400">Level 1 (Direct Referral)</span>
                <span className="font-mono font-black text-white text-sm">{level1}%</span>
              </div>
              <p className="text-[10px] text-slate-400">
                Instant commission paid on direct invitee's plan purchases.
              </p>
              <div className="pt-2 flex items-center space-x-2">
                <input
                  type="range"
                  min="1"
                  max="30"
                  value={level1}
                  onChange={(e) => setLevel1(parseInt(e.target.value))}
                  className="w-full accent-emerald-500"
                />
                <input
                  type="number"
                  value={level1}
                  onChange={(e) => setLevel1(parseInt(e.target.value) || 0)}
                  className="w-14 p-1 rounded bg-slate-900 border border-slate-700 text-center text-white font-mono font-bold text-xs"
                />
              </div>
            </div>

            {/* Level 2 */}
            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-teal-400">Level 2 (Secondary Sub-Tier)</span>
                <span className="font-mono font-black text-white text-sm">{level2}%</span>
              </div>
              <p className="text-[10px] text-slate-400">
                Passive override commission from invitee's referrals.
              </p>
              <div className="pt-2 flex items-center space-x-2">
                <input
                  type="range"
                  min="0"
                  max="15"
                  value={level2}
                  onChange={(e) => setLevel2(parseInt(e.target.value))}
                  className="w-full accent-teal-500"
                />
                <input
                  type="number"
                  value={level2}
                  onChange={(e) => setLevel2(parseInt(e.target.value) || 0)}
                  className="w-14 p-1 rounded bg-slate-900 border border-slate-700 text-center text-white font-mono font-bold text-xs"
                />
              </div>
            </div>

            {/* Level 3 */}
            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-cyan-400">Level 3 (Tertiary Team)</span>
                <span className="font-mono font-black text-white text-sm">{level3}%</span>
              </div>
              <p className="text-[10px] text-slate-400">
                Deep hierarchy network rewards for master team builders.
              </p>
              <div className="pt-2 flex items-center space-x-2">
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={level3}
                  onChange={(e) => setLevel3(parseInt(e.target.value))}
                  className="w-full accent-cyan-500"
                />
                <input
                  type="number"
                  value={level3}
                  onChange={(e) => setLevel3(parseInt(e.target.value) || 0)}
                  className="w-14 p-1 rounded bg-slate-900 border border-slate-700 text-center text-white font-mono font-bold text-xs"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md active:scale-95 transition-all cursor-pointer"
            >
              Update Commission Protocol
            </button>
          </div>
        </form>
      </div>

      {/* Top Affiliates Leaderboard & Direct Bonus Dispenser */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2 mb-3">
          <div className="flex items-center space-x-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white">
              Top Affiliates & Team Builders Registry
            </h3>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by phone, name, or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {filteredAffiliates.length === 0 ? (
          <div className="text-center py-10 text-slate-500 text-xs">
            No affiliates found matching your query.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-[10px] text-slate-400 uppercase tracking-wider">
                  <th className="py-2.5 px-3">Affiliate User</th>
                  <th className="py-2.5 px-3">Invite Code</th>
                  <th className="py-2.5 px-3">Direct Invites</th>
                  <th className="py-2.5 px-3">Team Volume</th>
                  <th className="py-2.5 px-3">Estimated Profit</th>
                  <th className="py-2.5 px-3 text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {filteredAffiliates.map(({ user: affUser, directCount, teamVolume, commissionEarned }) => (
                  <tr key={affUser.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-2.5 px-3">
                      <div className="font-sans font-bold text-white">
                        {affUser.name || 'Member'}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {affUser.phone}
                      </div>
                    </td>

                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-amber-300 font-bold text-[10px] border border-slate-700">
                        {affUser.inviteCode || 'N/A'}
                      </span>
                    </td>

                    <td className="py-2.5 px-3 font-bold text-white">
                      {directCount} Members
                    </td>

                    <td className="py-2.5 px-3 font-bold text-emerald-400">
                      {formatINR(teamVolume)}
                    </td>

                    <td className="py-2.5 px-3 font-bold text-amber-400">
                      {formatINR(commissionEarned)}
                    </td>

                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => setSelectedUserForBonus(affUser.id)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/40 font-sans font-bold text-[10px] cursor-pointer active:scale-95 transition-all"
                      >
                        Award Bonus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Bonus Dispenser Modal */}
      {selectedUserForBonus !== null && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-sm rounded-3xl p-5 space-y-4 shadow-2xl">
            <div className="flex items-center space-x-2">
              <Gift className="w-5 h-5 text-amber-400" />
              <h3 className="text-sm font-bold text-white">
                Grant Direct Affiliate Reward Bonus
              </h3>
            </div>

            <p className="text-xs text-slate-300">
              Enter the bonus amount to disburse directly to this team leader's main wallet balance.
            </p>

            <div>
              <label className="text-slate-400 text-xs font-bold block mb-1">
                Bonus Amount (₹)
              </label>
              <input
                type="number"
                value={bonusAmount}
                onChange={(e) => setBonusAmount(parseFloat(e.target.value) || 0)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-emerald-400 font-mono font-bold text-base focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedUserForBonus(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const target = registeredUsers.find((u) => u.id === selectedUserForBonus);
                  handleAwardBonus(selectedUserForBonus, target?.name || 'Affiliate');
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md cursor-pointer active:scale-95 transition-all"
              >
                Confirm & Credit Wallet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
