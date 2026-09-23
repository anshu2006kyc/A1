import React, { useMemo, useState } from 'react';
import {
  Award,
  Calculator,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Coins,
  Copy,
  Gift,
  HelpCircle,
  Lock,
  QrCode,
  Search,
  Share2,
  ShieldCheck,
  TrendingUp,
  UserCheck,
  Users,
  Wallet,
  Zap
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { WhatsAppIcon, TelegramIcon } from '../components/BrandIcons';
import { formatINR } from '../utils/currency';
import { sfx } from '../utils/sound';

export const TeamView: React.FC = () => {
  const {
    user,
    teamMembers,
    adminSettings,
    setCurrentView,
    showToast,
    claimedTeamMilestones,
    claimTeamMilestone
  } = useApp();

  const [activeLevelTab, setActiveLevelTab] = useState<'all' | 1 | 2 | 3>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [showQrModal, setShowQrModal] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [calculatorAmount, setCalculatorAmount] = useState<number>(5000);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Invite code & link
  const inviteCode = user.inviteCode || 'AKM8821';
  const referralLink = `${window.location.origin}?ref=${inviteCode}`;

  // Copy handlers
  const handleCopyCode = () => {
    navigator.clipboard.writeText(inviteCode);
    setCopiedCode(true);
    sfx.click();
    showToast('Invitation Code copied to clipboard!', 'success');
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopiedLink(true);
    sfx.click();
    showToast('Referral link copied to clipboard!', 'success');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Social share
  const handleShareWhatsApp = () => {
    const text = `🔥 Earn daily returns with AKM ENTERPRISES Platform!
💰 Join my VIP team and start earning up to 30% daily returns.
👉 Use my Invitation Code: ${inviteCode}
🚀 Register link: ${referralLink}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleShareTelegram = () => {
    const text = `Earn daily guaranteed returns with AKM ENTERPRISES! Register using my code: ${inviteCode}`;
    window.open(`https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(text)}`, '_blank');
  };

  // Team metrics scoped strictly to current user's invite network
  const myTeamMembers = useMemo(() => {
    return teamMembers.filter((m) => !m.sponsorId || m.sponsorId === user.id);
  }, [teamMembers, user.id]);

  const l1Members = useMemo(() => myTeamMembers.filter((m) => m.level === 1), [myTeamMembers]);
  const l2Members = useMemo(() => myTeamMembers.filter((m) => m.level === 2), [myTeamMembers]);
  const l3Members = useMemo(() => myTeamMembers.filter((m) => m.level === 3), [myTeamMembers]);

  const totalMembers = myTeamMembers.length;
  const activeMembersCount = useMemo(() => myTeamMembers.filter((m) => m.rechargeAmount > 0).length, [myTeamMembers]);

  const l1RechargeTotal = useMemo(() => l1Members.reduce((sum, m) => sum + m.rechargeAmount, 0), [l1Members]);
  const l2RechargeTotal = useMemo(() => l2Members.reduce((sum, m) => sum + m.rechargeAmount, 0), [l2Members]);
  const l3RechargeTotal = useMemo(() => l3Members.reduce((sum, m) => sum + m.rechargeAmount, 0), [l3Members]);
  const totalTeamTurnover = l1RechargeTotal + l2RechargeTotal + l3RechargeTotal;

  const l1Commission = useMemo(() => l1Members.reduce((sum, m) => sum + m.commissionEarned, 0), [l1Members]);
  const l2Commission = useMemo(() => l2Members.reduce((sum, m) => sum + m.commissionEarned, 0), [l2Members]);
  const l3Commission = useMemo(() => l3Members.reduce((sum, m) => sum + m.commissionEarned, 0), [l3Members]);
  const totalCommission = l1Commission + l2Commission + l3Commission;

  // Filtered members list
  const filteredMembers = useMemo(() => {
    return myTeamMembers.filter((m) => {
      // Level filter
      if (activeLevelTab !== 'all' && m.level !== activeLevelTab) return false;

      // Status filter
      if (statusFilter === 'active' && m.rechargeAmount <= 0) return false;
      if (statusFilter === 'inactive' && m.rechargeAmount > 0) return false;

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        return m.phone.toLowerCase().includes(query);
      }

      return true;
    });
  }, [myTeamMembers, activeLevelTab, statusFilter, searchQuery]);

  // Quests configuration
  const teamQuests = [
    { id: 'quest-2-active', label: 'Invite 2 Active Members', requiredActive: 2, reward: 100 },
    { id: 'quest-5-active', label: 'Invite 5 Active Members', requiredActive: 5, reward: 350 },
    { id: 'quest-10-active', label: 'Invite 10 Active Members', requiredActive: 10, reward: 1000 },
    { id: 'quest-20-active', label: 'Invite 20 Active Members', requiredActive: 20, reward: 2500 }
  ];

  // Mask phone number for privacy
  const formatPhoneMask = (phone: string) => {
    const clean = phone.replace('+91 ', '');
    if (clean.length >= 10) {
      return `+91 ${clean.slice(0, 3)}****${clean.slice(7)}`;
    }
    return phone;
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-28 animate-fade-in">
      {/* Top Navigation */}
      <div className="bg-white px-4 py-3.5 flex items-center justify-between border-b border-gray-100 sticky top-0 z-20">
        <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-700">
          <Users className="w-4 h-4" />
        </div>
        <div className="text-center">
          <h1 className="text-base font-bold text-gray-900">Team Center</h1>
          <span className="text-[10px] text-emerald-600 font-medium">3-Tier Referral & Commission Engine</span>
        </div>
        <button
          onClick={() => setShowRules(!showRules)}
          className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center hover:bg-emerald-100 active:scale-95 transition-all cursor-pointer"
          title="Commission Rules"
        >
          <HelpCircle className="w-4 h-4" />
        </button>
      </div>

      {/* Main Container */}
      <div className="p-4 space-y-4">
        {/* Top Header Card: Ambassador Summary */}
        <div className="bg-gradient-to-br from-[#008f4c] via-[#00a859] to-[#0a6634] text-white p-5 rounded-3xl shadow-lg relative overflow-hidden">
          <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10 blur-xl pointer-events-none" />
          <div className="absolute -left-8 -bottom-8 w-32 h-32 rounded-full bg-emerald-950/20 blur-xl pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5 text-xs font-semibold text-emerald-100">
                <ShieldCheck className="w-4 h-4 text-emerald-300" />
                <span>VIP Team Leader</span>
              </div>
              <div className="inline-flex items-center space-x-1 bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white">
                <Award className="w-3 h-3 text-amber-300" />
                <span>Up to {adminSettings.commissionLevel1}% Rebate</span>
              </div>
            </div>

            <div className="mt-3">
              <span className="text-xs text-emerald-200 font-medium">Total Team Commission</span>
              <div className="flex items-baseline space-x-2 mt-0.5">
                <span className="text-3xl font-black tracking-tight tabular-nums font-mono text-white">
                  {formatINR(totalCommission)}
                </span>
                <span className="text-xs text-emerald-200 font-medium">Lifetime</span>
              </div>
            </div>

            {/* 4 Summary Metrics Badges */}
            <div className="grid grid-cols-4 gap-2 mt-4">
              <div className="bg-black/20 backdrop-blur-md p-2 rounded-2xl text-center border border-white/10">
                <div className="flex justify-center mb-0.5 text-emerald-200">
                  <Users className="w-3.5 h-3.5" />
                </div>
                <div className="text-sm font-black text-white">{totalMembers}</div>
                <div className="text-[8.5px] font-bold text-emerald-200 tracking-wider">MEMBERS</div>
              </div>

              <div className="bg-black/20 backdrop-blur-md p-2 rounded-2xl text-center border border-white/10">
                <div className="flex justify-center mb-0.5 text-amber-300">
                  <UserCheck className="w-3.5 h-3.5" />
                </div>
                <div className="text-sm font-black text-white">{activeMembersCount}</div>
                <div className="text-[8.5px] font-bold text-emerald-200 tracking-wider">ACTIVE</div>
              </div>

              <div className="bg-black/20 backdrop-blur-md p-2 rounded-2xl text-center border border-white/10">
                <div className="flex justify-center mb-0.5 text-emerald-200">
                  <TrendingUp className="w-3.5 h-3.5" />
                </div>
                <div className="text-sm font-black text-white tabular-nums font-mono">
                  {formatINR(totalTeamTurnover, { decimals: 0 })}
                </div>
                <div className="text-[8.5px] font-bold text-emerald-200 tracking-wider">TURNOVER</div>
              </div>

              <div className="bg-black/20 backdrop-blur-md p-2 rounded-2xl text-center border border-white/10">
                <div className="flex justify-center mb-0.5 text-yellow-300">
                  <Coins className="w-3.5 h-3.5" />
                </div>
                <div className="text-sm font-black text-white tabular-nums font-mono">
                  {formatINR(l1Commission, { decimals: 0 })}
                </div>
                <div className="text-[8.5px] font-bold text-emerald-200 tracking-wider">L1 BONUS</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Invite & Share Toolkit */}
        <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-900">Your Invitation Toolkit</span>
            <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
              Instant Credit
            </span>
          </div>

          {/* Invitation Code & Link Row */}
          <div className="grid grid-cols-2 gap-2">
            {/* Invite Code Box */}
            <div className="bg-gray-50 p-2.5 rounded-2xl border border-gray-100 flex items-center justify-between">
              <div>
                <span className="text-[9px] font-bold text-gray-400 block uppercase">Invite Code</span>
                <span className="text-sm font-black text-gray-900 font-mono tracking-wider">{inviteCode}</span>
              </div>
              <button
                onClick={handleCopyCode}
                className="p-2 rounded-xl bg-emerald-100 text-emerald-800 hover:bg-emerald-200 active:scale-95 transition-all cursor-pointer"
                title="Copy Code"
              >
                {copiedCode ? <Check className="w-4 h-4 stroke-[3]" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* Invite Link Box */}
            <div className="bg-gray-50 p-2.5 rounded-2xl border border-gray-100 flex items-center justify-between">
              <div className="truncate pr-1">
                <span className="text-[9px] font-bold text-gray-400 block uppercase">Invite Link</span>
                <span className="text-xs font-bold text-gray-800 truncate block">Copy Link</span>
              </div>
              <button
                onClick={handleCopyLink}
                className="p-2 rounded-xl bg-emerald-100 text-emerald-800 hover:bg-emerald-200 active:scale-95 transition-all cursor-pointer"
                title="Copy Link"
              >
                {copiedLink ? <Check className="w-4 h-4 stroke-[3]" /> : <Share2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Social Share Buttons with Large WhatsApp & Telegram Icons */}
          <div className="pt-2 space-y-2">
            <div className="grid grid-cols-2 gap-2.5">
              {/* Large WhatsApp Share Card */}
              <button
                onClick={handleShareWhatsApp}
                className="py-3 px-3 rounded-2xl bg-gradient-to-r from-[#25D366] to-[#1eb855] hover:brightness-105 text-white flex items-center space-x-3 shadow-md active:scale-95 transition-all cursor-pointer border border-[#25D366]/40"
              >
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0 shadow-xs">
                  <WhatsAppIcon className="w-6 h-6 fill-white drop-shadow-sm" />
                </div>
                <div className="text-left">
                  <span className="text-xs font-black block tracking-wide">WhatsApp</span>
                  <span className="text-[9.5px] text-white/90 font-medium block">Invite Friends</span>
                </div>
              </button>

              {/* Large Telegram Share Card */}
              <button
                onClick={handleShareTelegram}
                className="py-3 px-3 rounded-2xl bg-gradient-to-r from-[#0088cc] to-[#0074ad] hover:brightness-105 text-white flex items-center space-x-3 shadow-md active:scale-95 transition-all cursor-pointer border border-[#0088cc]/40"
              >
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0 shadow-xs">
                  <TelegramIcon className="w-6 h-6 fill-white drop-shadow-sm" />
                </div>
                <div className="text-left">
                  <span className="text-xs font-black block tracking-wide">Telegram</span>
                  <span className="text-[9.5px] text-white/90 font-medium block">Invite Channel</span>
                </div>
              </button>
            </div>

            {/* QR Code Option */}
            <button
              onClick={() => setShowQrModal(!showQrModal)}
              className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-xs flex items-center justify-center space-x-2 shadow-xs active:scale-95 transition-all cursor-pointer border border-slate-700"
            >
              <QrCode className="w-4 h-4 text-emerald-400" />
              <span>{showQrModal ? 'Hide Invite QR Code' : 'Show Referral QR Code'}</span>
            </button>
          </div>

          {/* Expandable QR Code Drawer */}
          {showQrModal && (
            <div className="pt-3 border-t border-gray-100 text-center flex flex-col items-center animate-fade-in">
              <div className="p-3 bg-white border-2 border-dashed border-emerald-300 rounded-2xl shadow-xs">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(referralLink)}`}
                  alt="Invite QR Code"
                  className="w-36 h-36 rounded-lg"
                />
              </div>
              <span className="text-[11px] text-gray-500 mt-2">
                Scan to register under code <span className="font-bold text-emerald-700">{inviteCode}</span>
              </span>
            </div>
          )}
        </div>

        {/* 3-Tier Commission Structure Cards */}
        <div className="grid grid-cols-3 gap-2">
          {/* Level 1 */}
          <div
            onClick={() => setActiveLevelTab(1)}
            className={`p-3 rounded-2xl border transition-all cursor-pointer text-center ${
              activeLevelTab === 1
                ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-400/40 shadow-sm'
                : 'bg-white border-gray-100 hover:border-emerald-200'
            }`}
          >
            <div className="inline-flex items-center space-x-1 text-[10px] font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
              <span>Level 1</span>
            </div>
            <div className="text-xl font-black text-emerald-600 mt-1">
              {adminSettings.commissionLevel1}%
            </div>
            <span className="text-[9.5px] text-gray-400 block">Direct Rebate</span>
            <div className="mt-2 pt-1.5 border-t border-gray-100 text-[10px] font-bold text-gray-700">
              {l1Members.length} Members
            </div>
          </div>

          {/* Level 2 */}
          <div
            onClick={() => setActiveLevelTab(2)}
            className={`p-3 rounded-2xl border transition-all cursor-pointer text-center ${
              activeLevelTab === 2
                ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-400/40 shadow-sm'
                : 'bg-white border-gray-100 hover:border-emerald-200'
            }`}
          >
            <div className="inline-flex items-center space-x-1 text-[10px] font-extrabold text-teal-800 bg-teal-100 px-2 py-0.5 rounded-full">
              <span>Level 2</span>
            </div>
            <div className="text-xl font-black text-emerald-600 mt-1">
              {adminSettings.commissionLevel2}%
            </div>
            <span className="text-[9.5px] text-gray-400 block">Indirect Rebate</span>
            <div className="mt-2 pt-1.5 border-t border-gray-100 text-[10px] font-bold text-gray-700">
              {l2Members.length} Members
            </div>
          </div>

          {/* Level 3 */}
          <div
            onClick={() => setActiveLevelTab(3)}
            className={`p-3 rounded-2xl border transition-all cursor-pointer text-center ${
              activeLevelTab === 3
                ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-400/40 shadow-sm'
                : 'bg-white border-gray-100 hover:border-emerald-200'
            }`}
          >
            <div className="inline-flex items-center space-x-1 text-[10px] font-extrabold text-cyan-800 bg-cyan-100 px-2 py-0.5 rounded-full">
              <span>Level 3</span>
            </div>
            <div className="text-xl font-black text-emerald-600 mt-1">
              {adminSettings.commissionLevel3}%
            </div>
            <span className="text-[9.5px] text-gray-400 block">Network Rebate</span>
            <div className="mt-2 pt-1.5 border-t border-gray-100 text-[10px] font-bold text-gray-700">
              {l3Members.length} Members
            </div>
          </div>
        </div>

        {/* Interactive Commission Rebate Calculator */}
        <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-gray-900">
              <Calculator className="w-4 h-4 text-emerald-600" />
              <span>Earnings Potential Calculator</span>
            </div>
            <span className="text-[10px] font-bold text-emerald-600 font-mono">
              ₹{calculatorAmount.toLocaleString()} Investment
            </span>
          </div>

          {/* Presets */}
          <div className="grid grid-cols-4 gap-1.5">
            {[1000, 5000, 10000, 50000].map((amt) => (
              <button
                key={amt}
                onClick={() => setCalculatorAmount(amt)}
                className={`py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  calculatorAmount === amt
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                ₹{amt >= 1000 ? `${amt / 1000}k` : amt}
              </button>
            ))}
          </div>

          {/* Calculator Breakdown Card */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50/50 p-3 rounded-2xl border border-emerald-100 text-xs space-y-1.5">
            <div className="flex justify-between items-center text-gray-700">
              <span>Level 1 Direct ({adminSettings.commissionLevel1}%):</span>
              <span className="font-bold text-emerald-700">
                +{formatINR(Math.round((calculatorAmount * adminSettings.commissionLevel1) / 100))}
              </span>
            </div>
            <div className="flex justify-between items-center text-gray-700">
              <span>Level 2 Indirect ({adminSettings.commissionLevel2}%):</span>
              <span className="font-bold text-teal-700">
                +{formatINR(Math.round((calculatorAmount * adminSettings.commissionLevel2) / 100))}
              </span>
            </div>
            <div className="flex justify-between items-center text-gray-700">
              <span>Level 3 Sub-team ({adminSettings.commissionLevel3}%):</span>
              <span className="font-bold text-cyan-700">
                +{formatINR(Math.round((calculatorAmount * adminSettings.commissionLevel3) / 100))}
              </span>
            </div>
            <div className="pt-2 border-t border-emerald-200/60 flex justify-between items-center font-bold text-emerald-900">
              <span>Total Potential Commission:</span>
              <span className="text-sm font-black font-mono text-emerald-700">
                +{formatINR(Math.round((calculatorAmount * (adminSettings.commissionLevel1 + adminSettings.commissionLevel2 + adminSettings.commissionLevel3)) / 100))}
              </span>
            </div>
          </div>
        </div>

        {/* Claimable Team Milestone Quests */}
        <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-gray-900">
              <Award className="w-4 h-4 text-amber-500" />
              <span>Team Leader Quests & Bonuses</span>
            </div>
            <span className="text-[10px] text-gray-400">
              Active: {activeMembersCount} Members
            </span>
          </div>

          <div className="space-y-2.5">
            {teamQuests.map((quest) => {
              const isClaimed = claimedTeamMilestones.includes(quest.id);
              const isUnlocked = activeMembersCount >= quest.requiredActive;
              const canClaim = isUnlocked && !isClaimed;
              const progressPercent = Math.min(100, Math.round((activeMembersCount / quest.requiredActive) * 100));

              return (
                <div
                  key={quest.id}
                  className={`p-3 rounded-2xl border transition-all ${
                    isClaimed
                      ? 'bg-gray-50 border-gray-200 opacity-80'
                      : canClaim
                      ? 'bg-gradient-to-r from-amber-50 to-emerald-50 border-amber-300 ring-1 ring-amber-300/60'
                      : 'bg-white border-gray-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-gray-900">{quest.label}</div>
                      <div className="text-[10px] text-gray-500 mt-0.5">
                        Progress: {activeMembersCount}/{quest.requiredActive} Active
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-black text-emerald-600 block tabular-nums">
                        +{formatINR(quest.reward, { decimals: 0 })}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden my-2">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isClaimed
                          ? 'bg-gray-400'
                          : isUnlocked
                          ? 'bg-emerald-500'
                          : 'bg-amber-400'
                      }`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>

                  {/* Action Button */}
                  <div className="flex justify-end">
                    {isClaimed ? (
                      <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2.5 py-0.5 rounded-full">
                        Claimed ✓
                      </span>
                    ) : canClaim ? (
                      <button
                        onClick={() => {
                          sfx.success();
                          claimTeamMilestone(quest.id, quest.requiredActive, quest.reward);
                        }}
                        className="px-3 py-1 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-600 text-white font-extrabold text-[10px] shadow-xs active:scale-95 transition-all cursor-pointer flex items-center space-x-1"
                      >
                        <Gift className="w-3 h-3" />
                        <span>Claim {formatINR(quest.reward, { decimals: 0 })} Bonus</span>
                      </button>
                    ) : (
                      <span className="text-[9.5px] text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full flex items-center space-x-1">
                        <Lock className="w-2.5 h-2.5" />
                        <span>{quest.requiredActive - activeMembersCount} more needed</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Team Members Directory Section */}
        <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-gray-900">
              <Users className="w-4 h-4 text-emerald-600" />
              <span>Team Members Directory</span>
            </div>
            <span className="text-[10px] text-gray-400">
              {filteredMembers.length} Members Listed
            </span>
          </div>

          {/* Level Switcher Filter Pills */}
          <div className="grid grid-cols-4 gap-1 p-1 bg-gray-100 rounded-2xl">
            <button
              onClick={() => setActiveLevelTab('all')}
              className={`py-1.5 text-center rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                activeLevelTab === 'all'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              All ({totalMembers})
            </button>
            <button
              onClick={() => setActiveLevelTab(1)}
              className={`py-1.5 text-center rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                activeLevelTab === 1
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              L1 ({l1Members.length})
            </button>
            <button
              onClick={() => setActiveLevelTab(2)}
              className={`py-1.5 text-center rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                activeLevelTab === 2
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              L2 ({l2Members.length})
            </button>
            <button
              onClick={() => setActiveLevelTab(3)}
              className={`py-1.5 text-center rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                activeLevelTab === 3
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              L3 ({l3Members.length})
            </button>
          </div>

          {/* Search Bar & Status Filter */}
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by phone number..."
                className="w-full pl-8 pr-3 py-2 bg-gray-50 rounded-xl text-xs border border-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-gray-50 text-gray-700 text-xs font-semibold py-2 px-2.5 rounded-xl border border-gray-200 focus:outline-none cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="active">Active (Paid)</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Member Cards List */}
          {filteredMembers.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-xs">
              No team members match the current filter.
            </div>
          ) : (
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {filteredMembers.map((m, idx) => {
                const isActive = m.rechargeAmount > 0;

                return (
                  <div
                    key={`${m.id}-${idx}`}
                    className="p-3 bg-gray-50/80 rounded-2xl border border-gray-100 hover:bg-gray-50 transition-colors flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                        m.level === 1
                          ? 'bg-emerald-100 text-emerald-800'
                          : m.level === 2
                          ? 'bg-teal-100 text-teal-800'
                          : 'bg-cyan-100 text-cyan-800'
                      }`}>
                        L{m.level}
                      </div>

                      <div>
                        <div className="flex items-center space-x-1.5">
                          <span className="text-xs font-bold text-gray-900">
                            {formatPhoneMask(m.phone)}
                          </span>
                          {isActive ? (
                            <span className="text-[8px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-full">
                              Active
                            </span>
                          ) : (
                            <span className="text-[8px] font-bold bg-gray-200 text-gray-600 px-1.5 py-0.2 rounded-full">
                              Registered
                            </span>
                          )}
                        </div>
                        <span className="text-[9.5px] text-gray-400 block mt-0.5">
                          Joined: {m.joinedAt}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-emerald-600 block tabular-nums font-mono">
                        +{formatINR(m.commissionEarned)}
                      </span>
                      <span className="text-[9.5px] text-gray-400 block tabular-nums">
                        Recharge: {formatINR(m.rechargeAmount, { decimals: 0 })}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Commission Rules & Settlement Info */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <button
            onClick={() => setShowRules(!showRules)}
            className="w-full p-4 flex items-center justify-between text-left cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center space-x-2 text-xs font-bold text-gray-900">
              <HelpCircle className="w-4 h-4 text-emerald-600" />
              <span>Team Rules & Rebate Settlement</span>
            </div>
            {showRules ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
          </button>

          {showRules && (
            <div className="px-4 pb-4 pt-1 text-[11px] text-gray-600 space-y-2 border-t border-gray-50 bg-gray-50/50">
              <div className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <span>
                  <strong>Level 1 ({adminSettings.commissionLevel1}%):</strong> Applied directly when your friends register with your invite code and recharge.
                </span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <span>
                  <strong>Level 2 ({adminSettings.commissionLevel2}%):</strong> Applied when your Level 1 friends invite their friends to recharge.
                </span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <span>
                  <strong>Level 3 ({adminSettings.commissionLevel3}%):</strong> Applied when Level 2 invites third-tier members.
                </span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <span>Commissions are automatically credited to your main balance instantly upon payment confirmation.</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
