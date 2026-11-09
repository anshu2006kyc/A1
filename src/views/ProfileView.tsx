import React, { useMemo, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  ArrowDownLeft,
  Award,
  Banknote,
  Bell,
  Building2,
  Check,
  CheckCircle2,
  ChevronRight,
  Coins,
  Copy,
  CreditCard,
  Crown,
  Eye,
  EyeOff,
  Flame,
  Gift,
  History as HistoryIcon,
  Info,
  KeyRound,
  Lock,
  LogIn,
  LogOut,
  Package,
  Plus,
  QrCode,
  Receipt,
  RotateCw,
  Share2,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  Target,
  TrendingUp,
  Trophy,
  User,
  UserCheck,
  UserPlus,
  Users,
  Vibrate,
  Wallet,
  Wifi,
  X,
  Zap
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatINR } from '../utils/currency';
import { maskPhone } from '../utils/phone';
import { sfx } from '../utils/sound';
import { hapticSuccess, hapticTap } from '../utils/haptics';
import { AdminAuthModal } from '../components/AdminAuthModal';
import { RealSupportHeadsetIcon } from '../components/BrandIcons';

interface VipTierConfig {
  level: number;
  name: string;
  minInvestment: number;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  gradient: string;
  perks: string[];
  highlight: string;
}

const VIP_TIER_CONFIG: VipTierConfig[] = [
  {
    level: 0,
    name: 'Member',
    minInvestment: 0,
    badgeBg: 'bg-slate-800',
    badgeText: 'text-slate-300',
    badgeBorder: 'border-slate-700',
    gradient: 'from-slate-600 to-slate-400',
    perks: ['Standard Daily Plan Returns', '1x Daily Lucky Wheel Spin', '24x7 Portfolio Tracking'],
    highlight: 'Standard Yield'
  },
  {
    level: 1,
    name: 'VIP 1',
    minInvestment: 1000,
    badgeBg: 'bg-amber-950/80',
    badgeText: 'text-amber-300',
    badgeBorder: 'border-amber-500/40',
    gradient: 'from-amber-600 via-amber-500 to-yellow-400',
    perks: ['+0.5% Daily Interest Boost', 'Priority Payout Processing', 'Bronze VIP Investor Badge'],
    highlight: '+0.5% Return Boost'
  },
  {
    level: 2,
    name: 'VIP 2',
    minInvestment: 5000,
    badgeBg: 'bg-sky-950/80',
    badgeText: 'text-sky-300',
    badgeBorder: 'border-sky-500/40',
    gradient: 'from-sky-600 via-cyan-500 to-teal-400',
    perks: ['+1.0% Daily Interest Boost', 'Zero Withdrawal Processing Fees', 'Access to VIP Fast Pools'],
    highlight: '+1.0% Boost & 0% Fee'
  },
  {
    level: 3,
    name: 'VIP 3',
    minInvestment: 15000,
    badgeBg: 'bg-purple-950/80',
    badgeText: 'text-purple-300',
    badgeBorder: 'border-purple-500/40',
    gradient: 'from-purple-600 via-fuchsia-500 to-pink-400',
    perks: ['+1.5% Daily Interest Boost', 'Dedicated Relationship Manager', 'Direct Instant IMPS Routing'],
    highlight: '+1.5% Boost & Dedicated RM'
  },
  {
    level: 4,
    name: 'VIP 4',
    minInvestment: 50000,
    badgeBg: 'bg-rose-950/80',
    badgeText: 'text-rose-300',
    badgeBorder: 'border-rose-500/40',
    gradient: 'from-rose-600 via-orange-500 to-amber-400',
    perks: ['+2.5% Daily Interest Boost', 'Unlimited Daily Withdrawals', 'VIP Priority Node Routing'],
    highlight: '+2.5% Boost & Unlimited Payouts'
  },
  {
    level: 5,
    name: 'VIP 5 (Crown)',
    minInvestment: 150000,
    badgeBg: 'bg-yellow-950/90',
    badgeText: 'text-yellow-300',
    badgeBorder: 'border-yellow-400/50',
    gradient: 'from-amber-500 via-yellow-400 to-amber-300',
    perks: ['Maximum Profit Multiplier', 'Zero Platform Fees Across All Gateways', 'Personal VIP Concierge 24x7'],
    highlight: 'Max VIP Prestige & Concierge'
  }
];

export const ProfileView: React.FC = () => {
  const {
    user,
    isAdminUser,
    userPlans,
    transactions,
    teamMembers,
    streakDays,
    checkIns,
    luckySpinRecords,
    setIsLuckySpinOpen,
    setCurrentView,
    setIsAdminOpen,
    isNotificationModalOpen,
    setIsNotificationModalOpen,
    unreadNotificationCount,
    showToast,
    resetAllData,
    navigateToTransactions,
    isLoggedIn,
    logoutUser,
    openAuthModal,
    refreshUserBalance,
    isBalanceRefreshing,
    setIsSupportModalOpen,
    isHapticEnabled,
    toggleHapticFeedback,
    isHapticSupported
  } = useApp();
  const [showBalance, setShowBalance] = useState<boolean>(true);
  const [showPhone, setShowPhone] = useState<boolean>(false);
  const [copiedPhone, setCopiedPhone] = useState<boolean>(false);
  const [copiedUid, setCopiedUid] = useState<boolean>(false);
  const [showAdminAuthModal, setShowAdminAuthModal] = useState<boolean>(false);
  const [secretTapCount, setSecretTapCount] = useState<number>(0);

  const handleSecretTap = () => {
    const next = secretTapCount + 1;
    if (next >= 5) {
      setSecretTapCount(0);
      setShowAdminAuthModal(true);
    } else {
      setSecretTapCount(next);
      setTimeout(() => setSecretTapCount(0), 3000);
    }
  };

  const handleLogout = () => {
    logoutUser();
  };

  const handleCopyPhone = () => {
    sfx.playTap();
    hapticSuccess();
    navigator.clipboard.writeText(user.phone);
    setCopiedPhone(true);
    showToast('Mobile number copied to clipboard!', 'info');
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  const userUid = `AKM-${user.phone.replace(/\D/g, '').slice(-6) || '884210'}`;

  const handleCopyUid = () => {
    sfx.playTap();
    hapticSuccess();
    navigator.clipboard.writeText(userUid);
    setCopiedUid(true);
    showToast('User ID copied to clipboard!', 'info');
    setTimeout(() => setCopiedUid(false), 2000);
  };

  // Effective recorded withdrawal amount from user stats and user-scoped transactions
  const userTransactions = transactions.filter((t) => t.userId === user.id);

  const recordedWithdrawals = userTransactions
    .filter((t) => t.type === 'withdraw' && t.status !== 'failed')
    .reduce((sum, t) => sum + t.amount, 0);

  const effectiveTotalWithdraw = Math.max(
    typeof user.totalWithdraw === 'number' ? user.totalWithdraw : 0,
    recordedWithdrawals
  );

  const recordedRecharges = userTransactions
    .filter((t) => t.type === 'recharge' && t.status === 'success')
    .reduce((sum, t) => sum + t.amount, 0);

  const effectiveTotalRecharge = Math.max(
    typeof user.totalRecharge === 'number' ? user.totalRecharge : 0,
    recordedRecharges
  );

  // VIP Progression Metrics & Tier Calculations
  const [showVipModal, setShowVipModal] = useState<boolean>(false);

  const totalInvestedInPlans = userPlans
    .filter((p) => p.userId === user.id)
    .reduce((sum, p) => sum + p.depositAmount, 0);

  const qualifyingInvestment = Math.max(effectiveTotalRecharge, totalInvestedInPlans);

  const tierIndexFromName = (() => {
    const raw = (user.memberLevel || '').toUpperCase();
    if (raw.includes('VIP 5') || raw.includes('SUPER')) return 5;
    if (raw.includes('VIP 4')) return 4;
    if (raw.includes('VIP 3')) return 3;
    if (raw.includes('VIP 2')) return 2;
    if (raw.includes('VIP 1')) return 1;
    return 0;
  })();

  const tierIndexFromInvestment = (() => {
    for (let i = VIP_TIER_CONFIG.length - 1; i >= 0; i--) {
      if (qualifyingInvestment >= VIP_TIER_CONFIG[i].minInvestment) {
        return i;
      }
    }
    return 0;
  })();

  const currentTierIndex = Math.max(
    tierIndexFromName,
    typeof user.vipLevel === 'number' ? user.vipLevel : 0,
    tierIndexFromInvestment
  );

  const currentTier = VIP_TIER_CONFIG[currentTierIndex] || VIP_TIER_CONFIG[0];
  const isMaxTier = currentTierIndex >= VIP_TIER_CONFIG.length - 1;
  const nextTier = isMaxTier ? null : VIP_TIER_CONFIG[currentTierIndex + 1];

  const currentTierMin = currentTier.minInvestment;
  const nextTierTarget = nextTier ? nextTier.minInvestment : currentTierMin;
  const neededMore = nextTier ? Math.max(0, nextTierTarget - qualifyingInvestment) : 0;

  const progressPercent = isMaxTier
    ? 100
    : Math.min(100, Math.max(6, ((qualifyingInvestment - currentTierMin) / (nextTierTarget - currentTierMin)) * 100));

  // ==========================================
  // ACHIEVEMENT & MILESTONES SYSTEM
  // ==========================================
  interface AchievementBadge {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    icon: 'Package' | 'Flame' | 'Users' | 'Wallet' | 'Gift' | 'Crown';
    targetValue: number;
    currentValue: number;
    progressPercent: number;
    progressText: string;
    isUnlocked: boolean;
    perkText: string;
    tier: 'gold' | 'ruby' | 'emerald' | 'sapphire' | 'purple' | 'titanium';
    accentColor: string;
    borderGlow: string;
    bgGradient: string;
    targetView: 'home' | 'checkin' | 'team' | 'recharge' | 'myproducts';
    actionCta: string;
  }

  const [selectedAchievement, setSelectedAchievement] = useState<AchievementBadge | null>(null);
  const [achievementFilter, setAchievementFilter] = useState<'all' | 'unlocked' | 'locked'>('all');

  const myTeamCount = useMemo(() => {
    return teamMembers.filter((m) => m.sponsorId === user.id).length;
  }, [teamMembers, user.id]);

  const userPurchasedCount = useMemo(() => {
    return userPlans.filter((p) => p.userId === user.id).length;
  }, [userPlans, user.id]);

  const userCheckInCount = useMemo(() => {
    return Math.max(streakDays || 0, checkIns.filter((c) => c.userId === user.id).length);
  }, [streakDays, checkIns, user.id]);

  const userSpinCount = useMemo(() => {
    return luckySpinRecords.filter((r) => r.userId === user.id).length;
  }, [luckySpinRecords, user.id]);

  const achievementsList: AchievementBadge[] = useMemo(() => {
    return [
      {
        id: 'first_investment',
        title: 'First Investment',
        subtitle: 'Portfolio Genesis',
        description: 'Take your first step towards wealth growth by activating an enterprise investment plan.',
        icon: 'Package',
        targetValue: 1,
        currentValue: userPurchasedCount,
        progressPercent: userPurchasedCount >= 1 ? 100 : 0,
        progressText: `${Math.min(1, userPurchasedCount)}/1 Plan`,
        isUnlocked: userPurchasedCount >= 1,
        perkText: 'Investor Status • +₹50 Welcome Allocation',
        tier: 'gold',
        accentColor: '#f59e0b',
        borderGlow: 'border-amber-400/40 shadow-amber-500/15',
        bgGradient: 'from-amber-500/15 via-yellow-500/10 to-transparent',
        targetView: 'home',
        actionCta: 'Explore Plans'
      },
      {
        id: 'seven_day_streak',
        title: '7-Day Streak',
        subtitle: 'Daily Dedication',
        description: 'Maintain an unbroken daily attendance record for 7 consecutive days in the Check-In center.',
        icon: 'Flame',
        targetValue: 7,
        currentValue: Math.min(7, userCheckInCount),
        progressPercent: Math.min(100, Math.round((Math.min(7, userCheckInCount) / 7) * 100)),
        progressText: `${Math.min(7, userCheckInCount)}/7 Days`,
        isUnlocked: userCheckInCount >= 7,
        perkText: 'Streak Champion Badge • 2x Check-In Dividend Bonus',
        tier: 'ruby',
        accentColor: '#ef4444',
        borderGlow: 'border-rose-400/40 shadow-rose-500/15',
        bgGradient: 'from-rose-500/15 via-red-500/10 to-transparent',
        targetView: 'checkin',
        actionCta: 'Check-In Today'
      },
      {
        id: 'referred_5_friends',
        title: 'Referred 5 Friends',
        subtitle: 'Team Ambassador',
        description: 'Introduce 5 or more friends to the platform using your unique referral invitation code.',
        icon: 'Users',
        targetValue: 5,
        currentValue: Math.min(5, myTeamCount),
        progressPercent: Math.min(100, Math.round((Math.min(5, myTeamCount) / 5) * 100)),
        progressText: `${Math.min(5, myTeamCount)}/5 Friends`,
        isUnlocked: myTeamCount >= 5,
        perkText: 'Ambassador Rank • Priority L1-L3 Rebate Clearance',
        tier: 'emerald',
        accentColor: '#10b981',
        borderGlow: 'border-emerald-400/40 shadow-emerald-500/15',
        bgGradient: 'from-emerald-500/15 via-teal-500/10 to-transparent',
        targetView: 'team',
        actionCta: 'Invite Friends'
      },
      {
        id: 'first_deposit',
        title: 'Capital Booster',
        subtitle: 'First UPI Deposit',
        description: 'Complete your first successful recharge into your platform balance via fast UPI.',
        icon: 'Wallet',
        targetValue: 1,
        currentValue: effectiveTotalRecharge > 0 ? 1 : 0,
        progressPercent: effectiveTotalRecharge > 0 ? 100 : 0,
        progressText: effectiveTotalRecharge > 0 ? 'Completed' : '0/1 Deposit',
        isUnlocked: effectiveTotalRecharge > 0,
        perkText: 'Instant Cashier Clearance • Funder Trust Shield',
        tier: 'sapphire',
        accentColor: '#0ea5e9',
        borderGlow: 'border-sky-400/40 shadow-sky-500/15',
        bgGradient: 'from-sky-500/15 via-cyan-500/10 to-transparent',
        targetView: 'recharge',
        actionCta: 'Recharge Wallet'
      },
      {
        id: 'lucky_spinner',
        title: 'Fortune Seeker',
        subtitle: 'Wheel Enthusiast',
        description: 'Spin the Daily Lucky Wheel 3 times to discover cash drops, multipliers, and jackpot prizes.',
        icon: 'Gift',
        targetValue: 3,
        currentValue: Math.min(3, userSpinCount),
        progressPercent: Math.min(100, Math.round((Math.min(3, userSpinCount) / 3) * 100)),
        progressText: `${Math.min(3, userSpinCount)}/3 Spins`,
        isUnlocked: userSpinCount >= 3,
        perkText: 'High Roller Tag • Higher Jackpot Probability Tier',
        tier: 'purple',
        accentColor: '#a855f7',
        borderGlow: 'border-purple-400/40 shadow-purple-500/15',
        bgGradient: 'from-purple-500/15 via-fuchsia-500/10 to-transparent',
        targetView: 'home',
        actionCta: 'Spin Lucky Wheel'
      },
      {
        id: 'wealth_club',
        title: 'Wealth Club',
        subtitle: '₹1,000+ Earnings Club',
        description: 'Accumulate ₹1,000 or more in combined plan profits, referrals, and daily dividends.',
        icon: 'Crown',
        targetValue: 1000,
        currentValue: Math.min(1000, user.totalRevenue || 0),
        progressPercent: Math.min(100, Math.round((Math.min(1000, user.totalRevenue || 0) / 1000) * 100)),
        progressText: `${formatINR(Math.min(1000, user.totalRevenue || 0))}/₹1,000`,
        isUnlocked: (user.totalRevenue || 0) >= 1000,
        perkText: 'Elite Club Privileges • Dedicated VIP Support Desk',
        tier: 'titanium',
        accentColor: '#eab308',
        borderGlow: 'border-yellow-400/40 shadow-yellow-500/15',
        bgGradient: 'from-yellow-500/15 via-amber-500/10 to-transparent',
        targetView: 'myproducts',
        actionCta: 'View Earnings'
      }
    ];
  }, [userPurchasedCount, userCheckInCount, myTeamCount, effectiveTotalRecharge, userSpinCount, user.totalRevenue]);

  const unlockedCount = useMemo(() => {
    return achievementsList.filter((a) => a.isUnlocked).length;
  }, [achievementsList]);

  const totalAchievements = achievementsList.length;
  const overallAchievementPercent = Math.round((unlockedCount / totalAchievements) * 100);

  const nextUnlockTeaser = useMemo(() => {
    return achievementsList.find((a) => !a.isUnlocked);
  }, [achievementsList]);

  const filteredAchievements = useMemo(() => {
    if (achievementFilter === 'unlocked') return achievementsList.filter((a) => a.isUnlocked);
    if (achievementFilter === 'locked') return achievementsList.filter((a) => !a.isUnlocked);
    return achievementsList;
  }, [achievementsList, achievementFilter]);

  const handleOpenBadge = (badge: AchievementBadge) => {
    sfx.playTap();
    hapticTap();
    setSelectedAchievement(badge);
    if (badge.isUnlocked) {
      try {
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.55 }
        });
      } catch {}
    }
  };

  const handleShareBadge = (badge: AchievementBadge) => {
    sfx.playTap();
    const shareText = `🏆 I just achieved the "${badge.title}" Milestone on AKM ENTERPRISES!\nPerk Unlocked: ${badge.perkText}\n💰 Join my VIP team: ${window.location.origin}?ref=${user.inviteCode || 'AKM8821'}`;
    try {
      const a = document.createElement('a');
      a.href = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      showToast('Opening WhatsApp to share achievement!', 'success');
    } catch {
      navigator.clipboard.writeText(shareText);
      showToast('Achievement copied to clipboard!', 'info');
    }
  };

  const renderBadgeIcon = (icon: AchievementBadge['icon'], className: string = 'w-5 h-5') => {
    switch (icon) {
      case 'Package':
        return <Package className={className} />;
      case 'Flame':
        return <Flame className={className} />;
      case 'Users':
        return <Users className={className} />;
      case 'Wallet':
        return <Wallet className={className} />;
      case 'Gift':
        return <Gift className={className} />;
      case 'Crown':
        return <Crown className={className} />;
      default:
        return <Award className={className} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-28 animate-fade-in font-sans">
      {/* Profile Top Bar */}
      <div className="bg-white p-4 border-b border-gray-100 flex items-center justify-between shadow-2xs">
        <div className="flex items-center space-x-3">
          <div
            className="w-13 h-13 rounded-2xl text-white flex items-center justify-center shrink-0 border border-white/20"
            style={{
              background: 'var(--brand-chamkila-gradient)',
              boxShadow: '0 4px 14px var(--brand-glow)'
            }}
          >
            <User className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-gray-900 tracking-tight flex items-center space-x-1.5">
              <span>{user.name || maskPhone(user.phone, showPhone)}</span>
              {isLoggedIn ? (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block ring-2 ring-emerald-200" title="Online" />
              ) : (
                <span className="text-[8px] text-gray-400 font-normal">(Guest)</span>
              )}
            </div>

            {/* Masked Mobile Number with Eye Toggle & Copy */}
            <div className="flex items-center space-x-1.5 mt-0.5">
              <span className="text-[9px] text-gray-600 font-mono font-bold tracking-tight">
                {maskPhone(user.phone, showPhone)}
              </span>
              <button
                type="button"
                onClick={() => {
                  sfx.playTap();
                  setShowPhone(!showPhone);
                }}
                className="text-gray-400 hover:text-emerald-700 transition-colors cursor-pointer p-0.5"
                title={showPhone ? 'Hide Mobile Number' : 'Show Mobile Number'}
              >
                {showPhone ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
              <button
                type="button"
                onClick={handleCopyPhone}
                className="text-gray-400 hover:text-emerald-700 transition-colors cursor-pointer p-0.5"
                title="Copy Mobile"
              >
                {copiedPhone ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {!isLoggedIn && (
            <button
              onClick={() => openAuthModal('login')}
              className="px-2.5 py-1.5 rounded-xl border text-[11px] font-bold active:scale-95 transition-all flex items-center space-x-1 cursor-pointer"
              style={{
                backgroundColor: 'var(--theme-color-50, #ecfdf5)',
                borderColor: 'var(--theme-color-200, #a7f3d0)',
                color: 'var(--brand-primary)',
              }}
              title="Sign In"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign In</span>
            </button>
          )}

          <button
            onClick={() => setCurrentView('bank')}
            className="w-9 h-9 rounded-xl flex items-center justify-center active:scale-95 transition-all cursor-pointer border"
            style={{
              backgroundColor: 'var(--theme-color-50, #ecfdf5)',
              borderColor: 'var(--theme-color-200, #a7f3d0)',
              color: 'var(--brand-primary)',
            }}
            title="Bank Details"
          >
            <Building2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-3.5 space-y-3.5">
        {!isLoggedIn && (
          <div
            className="border rounded-2xl p-3 flex items-center justify-between"
            style={{
              background: 'linear-gradient(to right, rgba(245, 158, 11, 0.08), var(--theme-color-50, #ecfdf5))',
              borderColor: 'var(--brand-glow)',
            }}
          >
            <div className="flex items-center space-x-2.5">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: 'var(--theme-color-100)', color: 'var(--brand-secondary)' }}
              >
                <LogIn className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] font-bold text-gray-900">Guest Mode (Logged Out)</div>
                <div className="text-[8.5px] text-gray-500">Sign in to access your wallet, plans & withdrawal records.</div>
              </div>
            </div>
            <button
              onClick={() => openAuthModal('login')}
              className="px-2.5 py-1.2 rounded-xl btn-chamkila text-white font-bold text-[10px] shrink-0 cursor-pointer shadow-xs active:scale-95 transition-all"
            >
              Sign In
            </button>
          </div>
        )}

        {/* ADVANCE TITANIUM VIP PROFILE CARD (COMPACT & SLEEK) */}
        <div
          className="text-white p-3.5 rounded-2xl shadow-lg border relative overflow-hidden backdrop-blur-md"
          style={{
            background: 'var(--brand-dark-gradient, linear-gradient(135deg, #0a1f16 0%, #072a1b 50%, #04150d 100%))',
            borderColor: 'var(--brand-primary)',
          }}
        >
          {/* Subtle Cyber Grid Accent Overlay */}
          <div
            className="absolute inset-0 [background-size:14px_14px] opacity-10 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(var(--brand-primary) 1px, transparent 1px)'
            }}
          />

          {/* Top Row: EMV Gold Chip + Member Tier + UID */}
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center space-x-2">
              {/* Authentic Golden EMV Chip Graphic */}
              <div className="w-8 h-5.5 rounded bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 p-[1px] shadow-xs shrink-0">
                <div className="w-full h-full rounded-[3px] bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-500 border border-amber-700/40 grid grid-cols-2 grid-rows-2 gap-[1px] p-[1px]">
                  <div className="border-r border-b border-amber-800/40 rounded-tl-[1px]" />
                  <div className="border-b border-amber-800/40 rounded-tr-[1px]" />
                  <div className="border-r border-amber-800/40 rounded-bl-[1px]" />
                  <div className="rounded-br-[1px]" />
                </div>
              </div>

              <Wifi className="w-3.5 h-3.5 text-emerald-300/80 rotate-90" />

              <div className="flex items-center space-x-1.5">
                <span className="text-[9px] font-mono font-bold text-white tracking-wide">
                  {maskPhone(user.phone, showPhone)}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    sfx.playTap();
                    setShowPhone(!showPhone);
                  }}
                  className="text-emerald-300/80 hover:text-white transition-colors cursor-pointer p-0.5"
                  title={showPhone ? 'Hide Mobile' : 'Show Mobile'}
                >
                  {showPhone ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                </button>
              </div>
            </div>

            {/* Right: UID */}
            <div className="flex items-center space-x-1.5">
              <button
                type="button"
                onClick={handleCopyUid}
                className="inline-flex items-center space-x-1 bg-black/35 hover:bg-black/50 px-1.5 py-0.5 rounded text-[8.5px] font-mono text-emerald-200 border border-emerald-500/25 active:scale-95 transition-all cursor-pointer"
                title="Copy UID"
              >
                <span>{userUid}</span>
                {copiedUid ? <Check className="w-2.5 h-2.5 text-emerald-400" /> : <Copy className="w-2.5 h-2.5 text-gray-400" />}
              </button>
            </div>
          </div>

          {/* Balance & Active Plans Row */}
          <div className="mt-2.5 pt-2 border-t border-emerald-500/20 flex items-baseline justify-between relative z-10">
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-[7.5px] uppercase font-bold tracking-wider text-emerald-300/85">
                  Portfolio Balance
                </span>
                <button
                  type="button"
                  onClick={() => {
                    sfx.playTap();
                    setShowBalance(!showBalance);
                  }}
                  className="text-emerald-300 hover:text-white transition-colors cursor-pointer"
                  title={showBalance ? 'Hide Balance' : 'Show Balance'}
                >
                  {showBalance ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sfx.playTap();
                    refreshUserBalance(false);
                  }}
                  className={`text-emerald-300 hover:text-white transition-transform active:scale-90 cursor-pointer ${
                    isBalanceRefreshing ? 'animate-spin text-amber-300' : ''
                  }`}
                  title="Refresh wallet balance & live income (Auto-polls every 30s)"
                >
                  <RotateCw className="w-3 h-3" />
                </button>
                <span className="text-[7px] font-mono text-emerald-300/80 bg-emerald-950/60 px-1 py-0.2 rounded border border-emerald-500/25 flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-emerald-400 animate-ping inline-block" />
                  30s Live
                </span>
              </div>
              <div className="text-[17px] font-extrabold tracking-tight tabular-nums font-mono text-emerald-300 drop-shadow-xs mt-0.5">
                {showBalance ? formatINR(user.balance) : '₹ ••••••••'}
              </div>
            </div>

            <div className="text-right">
              <span className="text-[7.5px] text-emerald-200/70 block uppercase font-medium">Active Plans</span>
              <span className="text-[10px] font-bold font-mono text-white">
                {userPlans.filter((p) => p.userId === user.id && p.status === 'active').length} Running
              </span>
            </div>
          </div>

          {/* 3 Metric Micro-Cards (Compact) */}
          <div className="grid grid-cols-3 gap-1.5 mt-2 pt-2 border-t border-emerald-500/20 text-center relative z-10">
            <div className="bg-emerald-950/40 py-1 px-1.5 rounded-lg border border-emerald-500/15">
              <span className="text-[7.5px] text-emerald-300/80 font-medium block">Deposited</span>
              <span className="text-[9px] font-bold text-white mt-0.5 block tabular-nums font-mono">
                {showBalance ? formatINR(effectiveTotalRecharge) : '•••'}
              </span>
            </div>

            <div className="bg-emerald-950/40 py-1 px-1.5 rounded-lg border border-emerald-500/15">
              <span className="text-[7.5px] text-emerald-300/80 font-medium block">Revenue</span>
              <span className="text-[9px] font-bold text-amber-300 mt-0.5 block tabular-nums font-mono">
                {showBalance ? formatINR(user.totalRevenue) : '•••'}
              </span>
            </div>

            <div className="bg-emerald-950/40 py-1 px-1.5 rounded-lg border border-emerald-500/15">
              <span className="text-[7.5px] text-emerald-300/80 font-medium block">Withdrawn</span>
              <span className="text-[9px] font-bold text-white mt-0.5 block tabular-nums font-mono">
                {showBalance ? formatINR(effectiveTotalWithdraw) : '•••'}
              </span>
            </div>
          </div>

          {/* Quick Action Buttons on Profile Card (Shiny Chamkila, Sleek Height) */}
          <div className="grid grid-cols-2 gap-2 mt-2.5 relative z-10">
            <button
              id="profile-recharge-btn"
              onClick={() => {
                sfx.playTap();
                setCurrentView('recharge');
              }}
              className="btn-chamkila text-white text-[10px] font-bold py-1.5 px-3 rounded-xl shadow-md flex items-center justify-center space-x-1.5 active:scale-95 transition-all cursor-pointer border-t border-emerald-300/40"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Recharge</span>
            </button>

            <button
              id="profile-withdraw-btn"
              onClick={() => {
                sfx.playTap();
                setCurrentView('withdraw');
              }}
              className="btn-chamkila-dark text-teal-300 text-[10px] font-bold py-1.5 px-3 rounded-xl shadow-md flex items-center justify-center space-x-1.5 border border-teal-500/40 active:scale-95 transition-all cursor-pointer"
            >
              <Banknote className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Withdraw</span>
            </button>
          </div>

          {/* Security Guarantee Bottom Pill */}
          <div className="mt-2 pt-1.5 border-t border-emerald-500/15 flex items-center justify-between text-[7.5px] text-emerald-300/70 font-mono">
            <div className="flex items-center space-x-1">
              <ShieldCheck className="w-2 h-2 text-emerald-400" />
              <span>SSL 256-Bit • Enterprise Vault</span>
            </div>
            <span>IMPS 24x7 Settlement</span>
          </div>
        </div>

        {/* VIP PROGRESSION VISUAL INDICATOR (SMOOTH PROGRESS BAR & NEXT TIER GOAL) */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 p-4 rounded-3xl border border-amber-500/35 shadow-lg relative overflow-hidden">
          {/* Subtle Cyber Grid Accent */}
          <div
            className="absolute inset-0 [background-size:14px_14px] opacity-10 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(var(--brand-primary) 1px, transparent 1px)'
            }}
          />
          {/* Ambient Corner Glow */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-amber-500/20 via-emerald-500/10 to-transparent rounded-full blur-2xl pointer-events-none" />

          {/* Header Row: Tier Badges & Ladder Modal Trigger */}
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-300 p-0.5 shadow-md shadow-amber-500/25 flex items-center justify-center shrink-0">
                <Crown className="w-5 h-5 text-slate-950 fill-amber-950" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-[10px] font-black text-white tracking-wide">
                    {currentTier.name}
                  </span>
                  <span className={`text-[7.5px] font-black px-1.5 py-0.5 rounded-full border ${currentTier.badgeBg} ${currentTier.badgeText} ${currentTier.badgeBorder} tracking-wide`}>
                    ACTIVE
                  </span>
                </div>
                <div className="text-[8.5px] text-slate-400 mt-0.5">
                  Invested: <span className="font-mono font-bold text-emerald-300">{formatINR(qualifyingInvestment)}</span>
                </div>
              </div>
            </div>

            {/* Right: Next Tier Goal or Max Badge */}
            <div className="text-right">
              {isMaxTier ? (
                <span className="text-[8.5px] font-black text-amber-300 bg-amber-500/20 px-2 py-0.8 rounded-xl border border-amber-400/40 flex items-center gap-1 shadow-xs">
                  <Crown className="w-3 h-3 text-amber-300" />
                  MAX TIER
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    sfx.playTap();
                    setShowVipModal(true);
                  }}
                  className="text-[8.5px] font-bold text-amber-300 hover:text-amber-200 bg-amber-500/15 hover:bg-amber-500/25 px-2 py-0.8 rounded-xl border border-amber-400/30 transition-all flex items-center gap-1 cursor-pointer active:scale-95 shadow-xs"
                  title="View All VIP Privileges"
                >
                  <span>Next: {nextTier?.name}</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Smooth Progress Bar */}
          <div className="mt-3 relative z-10">
            <div className="flex items-center justify-between text-[8px] font-mono mb-1">
              <span className="text-slate-400 flex items-center gap-1">
                <span>Tier Progress:</span>
                <strong className="text-white font-bold">{progressPercent.toFixed(0)}%</strong>
              </span>
              {!isMaxTier && (
                <span className="text-amber-300 font-bold">
                  Next Tier Goal: {formatINR(nextTier?.minInvestment || 0)}
                </span>
              )}
            </div>

            {/* Smooth Track */}
            <div className="h-2.5 w-full bg-slate-950/80 rounded-full border border-slate-700/70 p-0.5 overflow-hidden relative shadow-inner">
              <div
                className={`h-full rounded-full transition-all duration-700 ease-out relative bg-gradient-to-r ${currentTier.gradient} shadow-xs`}
                style={{ width: `${progressPercent}%` }}
              >
                {/* Continuous Shimmer Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/35 to-transparent -translate-x-full animate-pulse" />
              </div>
            </div>
          </div>

          {/* Bottom Context & Action Row */}
          <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between relative z-10 text-xs">
            <div className="flex-1 pr-2">
              {isMaxTier ? (
                <div className="text-[9px] text-emerald-300 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Maximum VIP privileges unlocked • 0% Fees & Concierge active!</span>
                </div>
              ) : (
                <div>
                  <div className="text-[9px] font-bold text-white flex items-center gap-1 flex-wrap">
                    <span>Invest</span>
                    <span className="text-amber-300 font-mono font-black">{formatINR(neededMore)}</span>
                    <span>more to reach</span>
                    <span className="text-emerald-400 font-extrabold">{nextTier?.name}</span>
                  </div>
                  <div className="text-[8px] text-slate-400 mt-0.5 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
                    <span>Next Perk:</span>
                    <span className="text-amber-200/95 font-medium">{nextTier?.highlight}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Actions: View Perks & Quick Upgrade */}
            <div className="flex items-center space-x-1.5 shrink-0">
              <button
                type="button"
                onClick={() => {
                  sfx.playTap();
                  setShowVipModal(true);
                }}
                className="px-2 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-[9px] font-bold border border-slate-700 transition-all cursor-pointer active:scale-95"
              >
                Perks
              </button>
              {!isMaxTier && (
                <button
                  type="button"
                  onClick={() => {
                    sfx.playTap();
                    setCurrentView('home');
                  }}
                  className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-[9px] shadow-md shadow-amber-500/25 active:scale-95 transition-all cursor-pointer flex items-center space-x-1"
                >
                  <Zap className="w-3 h-3 fill-slate-950" />
                  <span>Invest</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* INVESTOR ACHIEVEMENTS & MILESTONES SYSTEM                    */}
        {/* ============================================================ */}
        <div className="bg-white rounded-3xl p-4 border border-gray-100 shadow-xs space-y-3.5">
          {/* Header Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center text-white shadow-xs"
                style={{
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  boxShadow: '0 2px 8px rgba(245, 158, 11, 0.25)'
                }}
              >
                <Trophy className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <h3 className="text-[10.5px] font-bold text-gray-900 tracking-tight">
                    Investor Achievements
                  </h3>
                  <span className="text-[7.5px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded-md border border-amber-200/60">
                    Prestige Hub
                  </span>
                </div>
                <p className="text-[8px] text-gray-400 mt-0.5">
                  Unlock milestone badges to claim status & engagement perks
                </p>
              </div>
            </div>

            {/* Unlocked Count Badge */}
            <div className="text-right">
              <div className="inline-flex items-center space-x-1 bg-emerald-50 text-emerald-800 px-2 py-0.8 rounded-full text-[8.5px] font-bold border border-emerald-200/60 shadow-2xs">
                <Award className="w-3 h-3 text-emerald-600" />
                <span>{unlockedCount} / {totalAchievements} Unlocked</span>
              </div>
            </div>
          </div>

          {/* Overall Completion Track */}
          <div className="bg-gray-50/80 p-2.5 rounded-2xl border border-gray-100/90 space-y-1.5">
            <div className="flex items-center justify-between text-[8px]">
              <span className="text-gray-500 font-semibold flex items-center gap-1">
                <Target className="w-3 h-3 text-emerald-600" />
                <span>Milestone Completion Progress</span>
              </span>
              <span className="font-mono font-bold text-gray-900">{overallAchievementPercent}%</span>
            </div>

            <div className="h-1.5 w-full bg-gray-200/80 rounded-full overflow-hidden p-[1px]">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600"
                style={{ width: `${Math.max(5, overallAchievementPercent)}%` }}
              />
            </div>

            {/* Next Milestone Teaser Banner */}
            {nextUnlockTeaser && (
              <div
                onClick={() => handleOpenBadge(nextUnlockTeaser)}
                className="pt-0.5 flex items-center justify-between text-[8px] text-gray-600 cursor-pointer hover:text-emerald-700 transition-colors"
              >
                <div className="flex items-center space-x-1 truncate pr-2">
                  <span className="font-bold text-emerald-700">Next:</span>
                  <span className="font-semibold text-gray-800">{nextUnlockTeaser.title}</span>
                  <span className="text-gray-400 font-mono">({nextUnlockTeaser.progressText})</span>
                </div>
                <span className="text-[7.5px] font-bold text-emerald-600 shrink-0 flex items-center">
                  <span>View</span>
                  <ChevronRight className="w-2.5 h-2.5" />
                </span>
              </div>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex items-center space-x-1.5 text-xs">
            <button
              onClick={() => setAchievementFilter('all')}
              className={`px-2 py-0.8 rounded-xl text-[8.5px] font-bold transition-all cursor-pointer ${
                achievementFilter === 'all'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-gray-100 text-gray-500 hover:text-gray-900'
              }`}
            >
              All ({totalAchievements})
            </button>
            <button
              onClick={() => setAchievementFilter('unlocked')}
              className={`px-2 py-0.8 rounded-xl text-[8.5px] font-bold transition-all cursor-pointer ${
                achievementFilter === 'unlocked'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-gray-100 text-gray-500 hover:text-gray-900'
              }`}
            >
              Unlocked ({unlockedCount})
            </button>
            <button
              onClick={() => setAchievementFilter('locked')}
              className={`px-2 py-0.8 rounded-xl text-[8.5px] font-bold transition-all cursor-pointer ${
                achievementFilter === 'locked'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-gray-100 text-gray-500 hover:text-gray-900'
              }`}
            >
              Locked ({totalAchievements - unlockedCount})
            </button>
          </div>

          {/* Badges Grid (2 Columns on mobile, 3 Columns on sm) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-0.5">
            {filteredAchievements.map((badge) => {
              const isUnlocked = badge.isUnlocked;
              return (
                <div
                  key={badge.id}
                  onClick={() => handleOpenBadge(badge)}
                  className={`p-2.5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group flex flex-col justify-between ${
                    isUnlocked
                      ? 'bg-white border-emerald-200/80 shadow-xs hover:border-emerald-400 hover:shadow-md'
                      : 'bg-gray-50/70 border-gray-200/60 opacity-85 hover:opacity-100'
                  }`}
                >
                  {/* Subtle Background Tint */}
                  {isUnlocked && (
                    <div
                      className="absolute inset-0 opacity-5 pointer-events-none"
                      style={{ backgroundColor: badge.accentColor }}
                    />
                  )}

                  {/* Top Row: Icon Container & Status Badge */}
                  <div className="flex items-start justify-between relative z-10">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 ${
                        isUnlocked
                          ? 'text-white shadow-sm'
                          : 'bg-gray-200 text-gray-400'
                      }`}
                      style={{
                        backgroundColor: isUnlocked ? badge.accentColor : undefined
                      }}
                    >
                      {renderBadgeIcon(badge.icon, 'w-4 h-4')}
                    </div>

                    {isUnlocked ? (
                      <span className="inline-flex items-center space-x-0.5 bg-emerald-100 text-emerald-800 text-[7.5px] font-black px-1.5 py-0.5 rounded-full border border-emerald-300/60">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                        <span>UNLOCKED</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-0.5 bg-gray-200 text-gray-600 text-[7.5px] font-bold px-1.5 py-0.5 rounded-full">
                        <Lock className="w-2.5 h-2.5" />
                        <span>{badge.progressText}</span>
                      </span>
                    )}
                  </div>

                  {/* Title & Subtitle */}
                  <div className="mt-2 relative z-10">
                    <h4 className={`text-[10px] font-bold tracking-tight leading-snug ${isUnlocked ? 'text-gray-900' : 'text-gray-700'}`}>
                      {badge.title}
                    </h4>
                    <span className="text-[7.5px] text-gray-400 block mt-0.5">
                      {badge.subtitle}
                    </span>
                  </div>

                  {/* Bottom Metric / Progress */}
                  <div className="mt-2 pt-1.5 border-t border-gray-100 relative z-10">
                    {isUnlocked ? (
                      <div className="flex items-center justify-between text-[7.5px] text-emerald-700 font-bold">
                        <span className="truncate pr-1">Active Perk</span>
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[7px] text-gray-400 font-mono">
                          <span>Progress</span>
                          <span>{badge.progressPercent}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${Math.max(8, badge.progressPercent)}%`,
                              backgroundColor: badge.accentColor
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Financial Records Quick Panel (Recharge, Income, Withdrawal Records) */}
        <div className="bg-white rounded-3xl p-4 border border-gray-100 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div
                className="w-6 h-6 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: 'var(--theme-color-50, #ecfdf5)', color: 'var(--brand-primary)' }}
              >
                <Receipt className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-[10.5px] font-bold text-gray-900 tracking-tight">
                Account Records
              </h3>
            </div>
            <button
              id="profile-all-records-link"
              onClick={() => {
                sfx.playTap();
                navigateToTransactions('all');
              }}
              className="text-[9px] font-bold flex items-center space-x-0.5 cursor-pointer"
              style={{ color: 'var(--brand-primary)' }}
            >
              <span>View All</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {/* Recharge Record Card */}
            <button
              id="profile-recharge-record-card"
              onClick={() => {
                sfx.playTap();
                navigateToTransactions('deposit');
              }}
              className="p-2.5 rounded-2xl border hover:shadow-sm active:scale-95 transition-all text-left cursor-pointer flex flex-col justify-between space-y-1.5 group"
              style={{
                background: 'linear-gradient(to bottom, var(--theme-color-50, #ecfdf5), white)',
                borderColor: 'var(--theme-color-200, #a7f3d0)',
              }}
            >
              <div className="flex items-center justify-between">
                <div
                  className="w-6.5 h-6.5 rounded-xl text-white flex items-center justify-center shadow-xs"
                  style={{ backgroundColor: 'var(--brand-primary)' }}
                >
                  <ArrowDownLeft className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
              </div>
              <div>
                <span className="text-[9.5px] font-bold text-gray-900 block transition-colors">
                  Recharge Record
                </span>
                <span
                  className="text-[8.5px] font-bold font-mono block mt-0.5"
                  style={{ color: 'var(--brand-primary)' }}
                >
                  {showBalance ? formatINR(effectiveTotalRecharge) : '•••'}
                </span>
              </div>
            </button>

            {/* Income Record Card */}
            <button
              id="profile-income-record-card"
              onClick={() => {
                sfx.playTap();
                navigateToTransactions('revenue');
              }}
              className="p-2.5 rounded-2xl bg-gradient-to-b from-amber-50/80 to-amber-50/20 border border-amber-100/90 hover:border-amber-300 hover:shadow-sm active:scale-95 transition-all text-left cursor-pointer flex flex-col justify-between space-y-1.5 group"
            >
              <div className="flex items-center justify-between">
                <div className="w-6.5 h-6.5 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
                  <TrendingUp className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
              </div>
              <div>
                <span className="text-[9.5px] font-bold text-gray-900 block group-hover:text-amber-700 transition-colors">
                  Income Record
                </span>
                <span className="text-[8.5px] text-amber-700 font-bold font-mono block mt-0.5">
                  {showBalance ? formatINR(user.totalRevenue) : '•••'}
                </span>
              </div>
            </button>

            {/* Withdrawal Record Card */}
            <button
              id="profile-withdrawal-record-card"
              onClick={() => {
                sfx.playTap();
                navigateToTransactions('withdraw');
              }}
              className="p-2.5 rounded-2xl bg-gradient-to-b from-teal-50/80 to-teal-50/20 border border-teal-100/90 hover:border-teal-300 hover:shadow-sm active:scale-95 transition-all text-left cursor-pointer flex flex-col justify-between space-y-1.5 group"
            >
              <div className="flex items-center justify-between">
                <div className="w-6.5 h-6.5 rounded-xl bg-slate-800 text-teal-300 flex items-center justify-center shadow-xs">
                  <Banknote className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
              </div>
              <div>
                <span className="text-[9.5px] font-bold text-gray-900 block group-hover:text-teal-700 transition-colors">
                  Withdrawal Record
                </span>
                <span className="text-[8.5px] text-teal-700 font-bold font-mono block mt-0.5">
                  {showBalance ? formatINR(effectiveTotalWithdraw) : '•••'}
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Menu Navigation List */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden divide-y divide-gray-50">
          {/* Recharge Record */}
          <button
            id="menu-recharge-record"
            onClick={() => {
              sfx.playTap();
              navigateToTransactions('deposit');
            }}
            className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center space-x-3">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: 'var(--theme-color-50, #ecfdf5)', color: 'var(--brand-primary)' }}
              >
                <ArrowDownLeft className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-gray-800 block">Recharge Record</span>
                <span className="text-[8.5px] text-gray-400 block mt-0.5">
                  Deposit receipts & payment confirmations
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold font-mono" style={{ color: 'var(--brand-primary)' }}>
                {showBalance ? formatINR(effectiveTotalRecharge) : '•••'}
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            </div>
          </button>

          {/* Income Record */}
          <button
            id="menu-income-record"
            onClick={() => {
              sfx.playTap();
              navigateToTransactions('revenue');
            }}
            className="w-full p-3.5 flex items-center justify-between hover:bg-gray-50 transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-gray-800 block">Income Record</span>
                <span className="text-[8.5px] text-gray-400 block mt-0.5">
                  Daily returns, bonuses & dividend history
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold text-amber-700 font-mono">
                {showBalance ? formatINR(user.totalRevenue) : '•••'}
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            </div>
          </button>

          {/* Withdrawal Record */}
          <button
            id="menu-withdrawal-record"
            onClick={() => {
              sfx.playTap();
              navigateToTransactions('withdraw');
            }}
            className="w-full p-3.5 flex items-center justify-between hover:bg-gray-50 transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                <Banknote className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-gray-800 block">Withdrawal Record</span>
                <span className="text-[8.5px] text-gray-400 block mt-0.5">
                  Bank IMPS payouts & clearance confirmations
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold text-teal-700 font-mono">
                {showBalance ? formatINR(effectiveTotalWithdraw) : '•••'}
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            </div>
          </button>

          {/* Bank Account */}
          <button
            id="menu-bank"
            onClick={() => setCurrentView('bank')}
            className="w-full p-3.5 flex items-center justify-between hover:bg-gray-50 transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center space-x-3">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: 'var(--theme-color-50, #ecfdf5)', color: 'var(--brand-primary)' }}
              >
                <Building2 className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold text-gray-800">Bank Account</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          </button>

          {/* My Product */}
          <button
            id="menu-products"
            onClick={() => setCurrentView('myproducts')}
            className="w-full p-3.5 flex items-center justify-between hover:bg-gray-50 transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center space-x-3">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: 'var(--theme-color-50, #ecfdf5)', color: 'var(--brand-primary)' }}
              >
                <Package className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold text-gray-800">My Investment Products</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          </button>

          {/* Alerts & Notifications Center */}
          <button
            id="menu-notifications"
            onClick={() => {
              sfx.playTap();
              setIsNotificationModalOpen(true);
            }}
            className="w-full p-3.5 flex items-center justify-between hover:bg-gray-50 transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center space-x-3">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center bg-amber-50 text-amber-600 relative"
              >
                <Bell className="w-4 h-4" />
                {unreadNotificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-400 text-slate-950 font-black text-[7.5px] rounded-full flex items-center justify-center ring-1 ring-white shadow-xs animate-pulse">
                    {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
                  </span>
                )}
              </div>
              <div>
                <span className="text-[11px] font-bold text-gray-800 block">Alerts & Notifications</span>
                <span className="text-[8.5px] text-gray-400 block mt-0.5">
                  Interest credits & withdrawal status tracker
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {unreadNotificationCount > 0 ? (
                <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                  {unreadNotificationCount} New
                </span>
              ) : (
                <span className="text-[9px] text-emerald-600 font-bold">Active</span>
              )}
              <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            </div>
          </button>

          {/* All Financial Statements */}
          <button
            id="menu-transactions"
            onClick={() => navigateToTransactions('all')}
            className="w-full p-3.5 flex items-center justify-between hover:bg-gray-50 transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center space-x-3">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: 'var(--theme-color-50, #ecfdf5)', color: 'var(--brand-primary)' }}
              >
                <HistoryIcon className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-gray-800 block">All Financial Statements</span>
                <span className="text-[8.5px] text-gray-400 block mt-0.5">
                  Complete account audit trail & statements
                </span>
              </div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          </button>

          {/* Security & Password */}
          <button
            id="menu-password"
            onClick={() => setCurrentView('password')}
            className="w-full p-3.5 flex items-center justify-between hover:bg-gray-50 transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center space-x-3">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: 'var(--theme-color-50, #ecfdf5)', color: 'var(--brand-primary)' }}
              >
                <KeyRound className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold text-gray-800">Security & Password</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          </button>

          {/* Haptic Vibration Feedback Toggle */}
          <div
            id="menu-haptic-feedback"
            onClick={() => toggleHapticFeedback()}
            className="w-full p-3.5 flex items-center justify-between hover:bg-gray-50/80 transition-colors text-left cursor-pointer select-none"
          >
            <div className="flex items-center space-x-3">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors shrink-0"
                style={{
                  backgroundColor: isHapticEnabled
                    ? 'var(--theme-color-50, #ecfdf5)'
                    : '#f3f4f6',
                  color: isHapticEnabled ? 'var(--brand-primary, #059669)' : '#9ca3af'
                }}
              >
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-[11px] font-bold text-gray-800 block">Haptic Vibration</span>
                  <span
                    className={`text-[8px] font-extrabold px-1.5 py-0.2 rounded-full border transition-colors ${
                      isHapticEnabled
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-gray-100 text-gray-500 border-gray-200'
                    }`}
                  >
                    {isHapticEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                  {!isHapticSupported && (
                    <span className="text-[7.5px] font-semibold px-1.5 py-0.2 rounded bg-amber-50 text-amber-700 border border-amber-200">
                      Browser Limited
                    </span>
                  )}
                </div>
                <span className="text-[8.5px] text-gray-400 block mt-0.5">
                  Tactile vibration on buttons, taps & actions
                </span>
              </div>
            </div>

            {/* Accessible iOS / Material Toggle Switch */}
            <button
              id="haptic-toggle-switch"
              type="button"
              role="switch"
              aria-checked={isHapticEnabled}
              aria-label="Toggle haptic vibration feedback"
              onClick={(e) => {
                e.stopPropagation();
                toggleHapticFeedback();
              }}
              className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500/30 ${
                isHapticEnabled ? 'bg-emerald-600' : 'bg-gray-200'
              }`}
            >
              <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  isHapticEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Customer Support & Helpdesk */}
          <button
            id="menu-support-helpdesk"
            onClick={() => {
              sfx.playTap();
              setIsSupportModalOpen(true);
            }}
            className="w-full p-3.5 flex items-center justify-between hover:bg-gray-50 transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center space-x-3">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center text-emerald-700 bg-emerald-50"
              >
                <RealSupportHeadsetIcon className="w-4 h-4" size={16} />
              </div>
              <div>
                <span className="text-[11px] font-bold text-gray-800 block">Customer Support & Helpdesk</span>
                <span className="text-[8.5px] text-gray-400 block mt-0.5">
                  24/7 Live ticket assistance & investment inquiries
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="text-[8px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                24/7 Live
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            </div>
          </button>

          {/* About */}
          <button
            id="menu-about"
            onClick={() => setCurrentView('about')}
            className="w-full p-3.5 flex items-center justify-between hover:bg-gray-50 transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center space-x-3">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: 'var(--theme-color-50, #ecfdf5)', color: 'var(--brand-primary)' }}
              >
                <Info className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold text-gray-800">About AKM Enterprises</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          </button>
        </div>

        {/* Action Logout / Reset */}
        <div className="space-y-2 pt-1.5">
          {isLoggedIn ? (
            <button
              id="profile-logout-btn"
              onClick={handleLogout}
              className="w-full py-2.5 bg-white hover:bg-rose-50 border border-gray-200 hover:border-rose-200 text-rose-600 font-bold text-[10.5px] rounded-xl flex items-center justify-center space-x-2 active:scale-98 transition-all cursor-pointer shadow-2xs"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out Account</span>
            </button>
          ) : (
            <button
              onClick={() => openAuthModal('login')}
              className="w-full py-2.5 btn-chamkila text-white font-bold text-[10.5px] rounded-xl flex items-center justify-center space-x-2 active:scale-98 transition-all cursor-pointer shadow-md"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In / Register</span>
            </button>
          )}

          {/* Admin Control Center - Strictly visible ONLY to verified Admins */}
          {isAdminUser ? (
            <div className="text-center pt-1.5">
              <button
                onClick={() => setIsAdminOpen(true)}
                className="text-[10px] font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-full border border-amber-300 cursor-pointer shadow-xs inline-flex items-center space-x-1.5 transition-all active:scale-95"
              >
                <Lock className="w-3 h-3 text-amber-600" />
                <span>🔐 Admin & Gateway Control Center</span>
              </button>
            </div>
          ) : (
            <div className="text-center pt-2 pb-1">
              <button
                type="button"
                onClick={handleSecretTap}
                className="text-[7.5px] text-gray-300 hover:text-gray-400 select-none cursor-default transition-colors font-mono"
                title="AKM ENTERPRISES Secure System"
              >
                AKM ENTERPRISES LTD • SECURE PROTOCOL • 256-BIT SSL
              </button>
            </div>
          )}

          <AdminAuthModal
            isOpen={showAdminAuthModal}
            onClose={() => setShowAdminAuthModal(false)}
            onSuccess={() => setIsAdminOpen(true)}
          />

          {/* VIP Privileges Hierarchy & Benefits Modal */}
          {showVipModal && (
            <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
              <div className="bg-slate-900 border border-amber-500/35 rounded-3xl w-full max-w-md max-h-[85vh] flex flex-col shadow-2xl overflow-hidden relative text-white">
                {/* Modal Header */}
                <div className="p-3.5 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950/60">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 p-0.5 shadow-md flex items-center justify-center shrink-0">
                      <Crown className="w-3.5 h-3.5 text-slate-950 fill-amber-950" />
                    </div>
                    <div>
                      <h3 className="text-xs font-black text-white">VIP Tier Privileges</h3>
                      <p className="text-[9px] text-slate-400">Exclusive investor rewards & withdrawal benefits</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      sfx.playTap();
                      setShowVipModal(false);
                    }}
                    className="w-6 h-6 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Current Status Bar */}
                <div className="px-3.5 py-2 bg-slate-950/70 border-b border-slate-800/80 flex items-center justify-between text-[11px]">
                  <div>
                    <span className="text-[8.5px] text-slate-400 block">Your Current Tier</span>
                    <span className="text-[11px] font-black text-amber-300 flex items-center gap-1">
                      <span>{currentTier.name}</span>
                      <span className="text-[8px] text-emerald-400 font-normal">({formatINR(qualifyingInvestment)} invested)</span>
                    </span>
                  </div>
                  {!isMaxTier && (
                    <div className="text-right">
                      <span className="text-[8.5px] text-slate-400 block">Next Unlock ({nextTier?.name})</span>
                      <span className="text-[11px] font-mono font-bold text-emerald-300">
                        +{formatINR(neededMore)} more
                      </span>
                    </div>
                  )}
                </div>

                {/* Scrollable Tier List */}
                <div className="p-3.5 overflow-y-auto space-y-2.5 max-h-[55vh]">
                  {VIP_TIER_CONFIG.map((tier) => {
                    const isCurrent = tier.level === currentTier.level;
                    const isUnlocked = qualifyingInvestment >= tier.minInvestment;
                    return (
                      <div
                        key={tier.level}
                        className={`p-2.5 rounded-2xl border transition-all ${
                          isCurrent
                            ? 'bg-gradient-to-r from-amber-950/40 via-slate-900 to-emerald-950/40 border-amber-500/50 shadow-md ring-1 ring-amber-500/20'
                            : isUnlocked
                            ? 'bg-slate-950/50 border-emerald-500/30'
                            : 'bg-slate-950/20 border-slate-800 opacity-80'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center space-x-1.5">
                            <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full border ${tier.badgeBg} ${tier.badgeText} ${tier.badgeBorder}`}>
                              {tier.name}
                            </span>
                            <span className="text-[10px] font-mono text-slate-300 font-bold">
                              {tier.minInvestment === 0 ? 'Free Entry' : `Min Invest ${formatINR(tier.minInvestment)}`}
                            </span>
                          </div>
                          <div>
                            {isCurrent ? (
                              <span className="text-[8.5px] font-black text-amber-300 bg-amber-500/20 px-1.5 py-0.5 rounded-full border border-amber-500/40">
                                Current
                              </span>
                            ) : isUnlocked ? (
                              <span className="text-[8.5px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-0.5">
                                <CheckCircle2 className="w-2.5 h-2.5" />
                                Unlocked
                              </span>
                            ) : (
                              <span className="text-[8.5px] font-medium text-slate-400">
                                Need {formatINR(Math.max(0, tier.minInvestment - qualifyingInvestment))}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="space-y-1">
                          {tier.perks.map((perk, idx) => (
                            <div key={idx} className="flex items-center space-x-1.5 text-[9.5px] text-slate-300">
                              <CheckCircle2 className={`w-3 h-3 shrink-0 ${isUnlocked ? 'text-emerald-400' : 'text-slate-600'}`} />
                              <span>{perk}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Modal Footer */}
                <div className="p-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
                  <span className="text-[9px] text-slate-400">
                    Tier unlocks automatically upon plan investment.
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      sfx.playTap();
                      setShowVipModal(false);
                      setCurrentView('home');
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-[11px] shadow-md shadow-amber-500/25 active:scale-95 transition-all cursor-pointer flex items-center space-x-1"
                  >
                    <Zap className="w-3 h-3 fill-slate-950" />
                    <span>Invest to Level Up</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* ACHIEVEMENT BADGE SHOWCASE & CERTIFICATE MODAL               */}
          {/* ============================================================ */}
          {selectedAchievement && (
            <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
              <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl relative animate-scale-up text-white">
                {/* Background Glow */}
                <div
                  className="absolute -top-24 -left-24 w-48 h-48 rounded-full blur-3xl opacity-30 pointer-events-none"
                  style={{ backgroundColor: selectedAchievement.accentColor }}
                />

                {/* Top Action Row */}
                <div className="p-3.5 flex items-center justify-between relative z-10 border-b border-slate-800">
                  <div className="flex items-center space-x-2">
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-300">
                      Milestone Certificate
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedAchievement(null)}
                    className="p-1 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-4 text-center relative z-10 space-y-3">
                  {/* Giant Badge Emblem */}
                  <div className="relative inline-block mx-auto">
                    <div
                      className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white mx-auto shadow-2xl border-2 transition-transform ${
                        selectedAchievement.isUnlocked
                          ? 'border-white/40 ring-4'
                          : 'border-slate-700 bg-slate-800 text-slate-500'
                      }`}
                      style={{
                        backgroundColor: selectedAchievement.isUnlocked ? selectedAchievement.accentColor : undefined,
                        boxShadow: selectedAchievement.isUnlocked ? `0 10px 30px ${selectedAchievement.accentColor}55` : undefined
                      }}
                    >
                      {renderBadgeIcon(selectedAchievement.icon, 'w-8 h-8')}
                    </div>

                    {selectedAchievement.isUnlocked && (
                      <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center text-white shadow-md">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm font-black tracking-tight text-white">
                      {selectedAchievement.title}
                    </h3>
                    <span
                      className="text-[10.5px] font-bold block mt-0.5"
                      style={{ color: selectedAchievement.accentColor }}
                    >
                      {selectedAchievement.subtitle}
                    </span>
                  </div>

                  <p className="text-[10.5px] text-slate-300 leading-relaxed px-2">
                    {selectedAchievement.description}
                  </p>

                  {/* Status & Progress Box */}
                  <div className="bg-slate-950/70 p-2.5 rounded-2xl border border-slate-800 text-left space-y-1.5">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-slate-400 font-medium">Achievement Status</span>
                      {selectedAchievement.isUnlocked ? (
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Earned & Active</span>
                        </span>
                      ) : (
                        <span className="text-amber-400 font-bold font-mono">
                          {selectedAchievement.progressText} ({selectedAchievement.progressPercent}%)
                        </span>
                      )}
                    </div>

                    {!selectedAchievement.isUnlocked && (
                      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.max(6, selectedAchievement.progressPercent)}%`,
                            backgroundColor: selectedAchievement.accentColor
                          }}
                        />
                      </div>
                    )}

                    <div className="pt-1 border-t border-slate-800/80">
                      <span className="text-[8.5px] text-slate-400 block uppercase font-bold tracking-wider">
                        Perk & Reward:
                      </span>
                      <span className="text-[9.5px] font-bold text-emerald-300 block mt-0.5">
                        {selectedAchievement.perkText}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Modal Footer Buttons */}
                <div className="p-3 border-t border-slate-800 bg-slate-950/80 flex items-center space-x-2">
                  {selectedAchievement.isUnlocked ? (
                    <button
                      onClick={() => handleShareBadge(selectedAchievement)}
                      className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-110 text-white font-bold text-[10.5px] flex items-center justify-center space-x-1.5 shadow-md shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer"
                    >
                      <Share2 className="w-3 h-3" />
                      <span>Share on WhatsApp</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        sfx.playTap();
                        const targetView = selectedAchievement.targetView;
                        const targetId = selectedAchievement.id;
                        setSelectedAchievement(null);
                        if (targetId === 'lucky_spinner') {
                          setIsLuckySpinOpen(true);
                        } else {
                          setCurrentView(targetView);
                        }
                      }}
                      className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:brightness-110 text-slate-950 font-black text-[10.5px] flex items-center justify-center space-x-1.5 shadow-md shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
                    >
                      <Zap className="w-3 h-3 fill-slate-950" />
                      <span>{selectedAchievement.actionCta}</span>
                    </button>
                  )}

                  <button
                    onClick={() => setSelectedAchievement(null)}
                    className="py-2 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-[10.5px] transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

