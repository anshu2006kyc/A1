import React, { useState } from 'react';
import {
  ArrowDownLeft,
  ArrowDownToLine,
  Building2,
  Check,
  ChevronRight,
  Coins,
  Copy,
  CreditCard,
  Crown,
  Eye,
  EyeOff,
  History,
  Info,
  KeyRound,
  LogIn,
  LogOut,
  Package,
  Plus,
  QrCode,
  Receipt,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  User,
  UserCheck,
  UserPlus,
  Users,
  Wallet,
  Wifi
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatINR } from '../utils/currency';
import { maskPhone } from '../utils/phone';
import { sfx } from '../utils/sound';

export const ProfileView: React.FC = () => {
  const {
    user,
    userPlans,
    transactions,
    setCurrentView,
    setIsAdminOpen,
    showToast,
    resetAllData,
    navigateToTransactions,
    isLoggedIn,
    logoutUser,
    openAuthModal,
    registeredUsers,
    switchUser
  } = useApp();
  const [showBalance, setShowBalance] = useState<boolean>(true);
  const [showPhone, setShowPhone] = useState<boolean>(false);
  const [copiedPhone, setCopiedPhone] = useState<boolean>(false);
  const [copiedUid, setCopiedUid] = useState<boolean>(false);

  const rechargeTxCount = transactions.filter((t) => t.type === 'recharge').length;
  const withdrawTxCount = transactions.filter((t) => t.type === 'withdraw').length;
  const incomeTxCount = transactions.filter((t) =>
    ['checkin', 'daily_income', 'referral_commission'].includes(t.type)
  ).length;

  const handleLogout = () => {
    logoutUser();
  };

  const handleCopyPhone = () => {
    sfx.playTap();
    navigator.clipboard.writeText(user.phone);
    setCopiedPhone(true);
    showToast('Mobile number copied to clipboard!', 'info');
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  const userUid = `AKM-${user.phone.replace(/\D/g, '').slice(-6) || '884210'}`;

  const handleCopyUid = () => {
    sfx.playTap();
    navigator.clipboard.writeText(userUid);
    setCopiedUid(true);
    showToast('User ID copied to clipboard!', 'info');
    setTimeout(() => setCopiedUid(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-28 animate-fade-in font-sans">
      {/* Profile Top Bar */}
      <div className="bg-white p-4 border-b border-gray-100 flex items-center justify-between shadow-2xs">
        <div className="flex items-center space-x-3">
          <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-[#008f4c] via-[#00ba58] to-[#25d366] text-white flex items-center justify-center shadow-md shadow-emerald-600/20 shrink-0 border border-emerald-400/40">
            <User className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm font-extrabold text-gray-900 tracking-tight flex items-center space-x-1.5">
              <span>{user.name || maskPhone(user.phone, showPhone)}</span>
              {isLoggedIn ? (
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block ring-2 ring-emerald-200" title="Online" />
              ) : (
                <span className="text-[10px] text-gray-400 font-normal">(Guest)</span>
              )}
            </div>

            {/* Masked Mobile Number with Eye Toggle & Copy */}
            <div className="flex items-center space-x-1.5 mt-0.5">
              <span className="text-[11px] text-gray-600 font-mono font-bold tracking-tight">
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
          <button
            onClick={() => openAuthModal('login')}
            className="px-2.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold hover:bg-emerald-100 active:scale-95 transition-all flex items-center space-x-1 cursor-pointer"
            title="Switch / Sign In Account"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Account</span>
          </button>

          <button
            onClick={() => setCurrentView('bank')}
            className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center hover:bg-emerald-100 active:scale-95 transition-all cursor-pointer border border-emerald-200"
            title="Bank Details"
          >
            <Building2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Account Switch Bar if multiple registered accounts exist */}
      {registeredUsers.length > 1 && (
        <div className="bg-emerald-50/60 border-b border-emerald-100/60 px-4 py-2 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-1.5 text-emerald-800 font-bold text-[11px]">
            <Users className="w-3.5 h-3.5 text-emerald-600" />
            <span>Switch Account:</span>
          </div>
          <div className="flex items-center space-x-1.5 overflow-x-auto">
            {registeredUsers.slice(0, 3).map((u) => (
              <button
                key={u.id}
                onClick={() => switchUser(u.id)}
                className={`px-2 py-0.5 rounded-lg text-[10.5px] font-bold transition-all cursor-pointer truncate max-w-[110px] ${
                  u.id === user.id
                    ? 'bg-[#00ba58] text-white shadow-xs'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-emerald-200'
                }`}
              >
                {u.name ? u.name.split(' ')[0] : maskPhone(u.phone, false)}
              </button>
            ))}
            <button
              onClick={() => openAuthModal('register')}
              className="px-2 py-0.5 rounded-lg text-[10.5px] font-bold bg-white text-emerald-700 hover:bg-emerald-100 border border-dashed border-emerald-300 flex items-center space-x-0.5 cursor-pointer"
            >
              <Plus className="w-3 h-3" />
              <span>New</span>
            </button>
          </div>
        </div>
      )}

      <div className="p-3.5 space-y-3.5">
        {/* ADVANCE TITANIUM VIP PROFILE CARD */}
        <div className="bg-gradient-to-br from-[#0a1f16] via-[#072a1b] to-[#04150d] text-white p-5 rounded-3xl shadow-xl border border-emerald-500/30 relative overflow-hidden backdrop-blur-md">
          {/* Subtle Cyber Grid Accent Overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none"></div>

          {/* Top Row: EMV Gold Chip + NFC Waves + VIP Status Badge */}
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center space-x-2.5">
              {/* Authentic Golden EMV Chip Graphic */}
              <div className="w-10 h-7 rounded-md bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 p-[1.5px] shadow-sm shrink-0">
                <div className="w-full h-full rounded-[4px] bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-500 border border-amber-700/40 grid grid-cols-2 grid-rows-2 gap-[1.5px] p-[1.5px]">
                  <div className="border-r border-b border-amber-800/40 rounded-tl-[2px]" />
                  <div className="border-b border-amber-800/40 rounded-tr-[2px]" />
                  <div className="border-r border-amber-800/40 rounded-bl-[2px]" />
                  <div className="rounded-br-[2px]" />
                </div>
              </div>

              {/* NFC Contactless Wave */}
              <Wifi className="w-4 h-4 text-emerald-300/80 rotate-90" />

              <div className="flex flex-col">
                <span className="text-[9px] uppercase tracking-widest text-emerald-300 font-bold">
                  AKM Titanium Card
                </span>
                <span className="text-[10px] font-mono text-emerald-100/70 font-semibold">
                  Asset Vault
                </span>
              </div>
            </div>

            {/* VIP Tier Badge */}
            <div className="flex items-center space-x-1 bg-gradient-to-r from-amber-400 to-amber-300 text-slate-950 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm border border-amber-200">
              <Crown className="w-3 h-3" />
              <span>{user.memberLevel}</span>
            </div>
          </div>

          {/* Middle Row: Masked Mobile + UID (Hidden Number by Default) */}
          <div className="mt-4 pt-1 flex items-center justify-between relative z-10 border-b border-emerald-500/20 pb-3">
            <div>
              <span className="text-[9.5px] uppercase font-bold text-emerald-300/80 tracking-wider block">
                Cardholder Mobile
              </span>
              <div className="flex items-center space-x-2 mt-0.5">
                <span className="text-sm font-mono font-bold tracking-wider text-white">
                  {maskPhone(user.phone, showPhone)}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    sfx.playTap();
                    setShowPhone(!showPhone);
                  }}
                  className="text-emerald-300 hover:text-white transition-colors cursor-pointer"
                  title={showPhone ? 'Hide Mobile' : 'Show Mobile'}
                >
                  {showPhone ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[9.5px] uppercase font-bold text-emerald-300/80 tracking-wider block">
                Account UID
              </span>
              <button
                type="button"
                onClick={handleCopyUid}
                className="inline-flex items-center space-x-1 mt-0.5 bg-black/40 hover:bg-black/60 px-2 py-0.5 rounded-md text-[11px] font-mono text-emerald-200 border border-emerald-500/30 active:scale-95 transition-all cursor-pointer"
              >
                <span>{userUid}</span>
                {copiedUid ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-gray-400" />}
              </button>
            </div>
          </div>

          {/* Balance Display Section */}
          <div className="mt-3 flex items-baseline justify-between relative z-10">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-200/90">
                  Available Portfolio Balance
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
                  {showBalance ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>
              </div>
              <div className="text-3xl font-black mt-1 tracking-tight tabular-nums font-mono text-emerald-300 drop-shadow-sm">
                {showBalance ? formatINR(user.balance) : '₹ ••••••••'}
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-emerald-200/80 block">Active Plans</span>
              <span className="text-sm font-extrabold font-mono text-white">
                {userPlans.filter((p) => p.status === 'active').length} Running
              </span>
            </div>
          </div>

          {/* 4 Advance Metric Micro-Cards */}
          <div className="grid grid-cols-3 gap-2 mt-4 pt-3.5 border-t border-emerald-500/20 text-center relative z-10">
            <div className="bg-emerald-950/50 p-2 rounded-xl border border-emerald-500/20 backdrop-blur-xs">
              <span className="text-[9.5px] text-emerald-300 font-semibold block">Total Deposited</span>
              <span className="text-xs font-bold text-white mt-0.5 block tabular-nums font-mono">
                {showBalance ? formatINR(user.totalRecharge) : '•••'}
              </span>
            </div>

            <div className="bg-emerald-950/50 p-2 rounded-xl border border-emerald-500/20 backdrop-blur-xs">
              <span className="text-[9.5px] text-emerald-300 font-semibold block">Total Revenue</span>
              <span className="text-xs font-bold text-amber-300 mt-0.5 block tabular-nums font-mono">
                {showBalance ? formatINR(user.totalRevenue) : '•••'}
              </span>
            </div>

            <div className="bg-emerald-950/50 p-2 rounded-xl border border-emerald-500/20 backdrop-blur-xs">
              <span className="text-[9.5px] text-emerald-300 font-semibold block">Total Withdrawn</span>
              <span className="text-xs font-bold text-white mt-0.5 block tabular-nums font-mono">
                {showBalance ? formatINR(user.totalWithdraw) : '•••'}
              </span>
            </div>
          </div>

          {/* Quick Action Buttons on Profile Card */}
          <div className="grid grid-cols-2 gap-2 mt-3.5 relative z-10">
            <button
              id="profile-recharge-btn"
              onClick={() => {
                sfx.playTap();
                setCurrentView('recharge');
              }}
              className="bg-gradient-to-r from-[#00ba58] to-[#009c48] hover:brightness-110 text-white text-xs font-black py-2.5 px-3 rounded-xl shadow-md flex items-center justify-center space-x-1.5 active:scale-95 transition-all cursor-pointer border-t border-emerald-300/40"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Deposit Funds</span>
            </button>

            <button
              id="profile-withdraw-btn"
              onClick={() => {
                sfx.playTap();
                setCurrentView('withdraw');
              }}
              className="bg-slate-900/90 hover:bg-slate-900 text-emerald-200 text-xs font-black py-2.5 px-3 rounded-xl shadow-md flex items-center justify-center space-x-1.5 border border-emerald-500/40 active:scale-95 transition-all cursor-pointer"
            >
              <ArrowDownToLine className="w-4 h-4 stroke-[2.5]" />
              <span>Withdrawal</span>
            </button>
          </div>

          {/* Security Guarantee Bottom Pill */}
          <div className="mt-3.5 pt-2 border-t border-emerald-500/20 flex items-center justify-between text-[9.5px] text-emerald-300/80 font-mono">
            <div className="flex items-center space-x-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>256-Bit SSL Encrypted Vault</span>
            </div>
            <span>IMPS 24x7 Settlement</span>
          </div>
        </div>

        {/* Financial Records Quick Panel (Recharge, Income, Withdrawal Records) */}
        <div className="bg-white rounded-3xl p-4 border border-gray-100 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Receipt className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-xs font-black text-gray-900 tracking-tight">
                Account Records
              </h3>
            </div>
            <button
              id="profile-all-records-link"
              onClick={() => {
                sfx.playTap();
                navigateToTransactions('all');
              }}
              className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 flex items-center space-x-0.5 cursor-pointer"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
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
              className="p-3 rounded-2xl bg-gradient-to-b from-emerald-50/80 to-emerald-50/20 border border-emerald-100/90 hover:border-emerald-300 hover:shadow-sm active:scale-95 transition-all text-left cursor-pointer flex flex-col justify-between space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                  <ArrowDownLeft className="w-4 h-4 stroke-[2.5]" />
                </div>
                <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100/70 px-1.5 py-0.5 rounded-md font-mono">
                  {rechargeTxCount}
                </span>
              </div>
              <div>
                <span className="text-xs font-bold text-gray-900 block group-hover:text-emerald-700 transition-colors">
                  Recharge Record
                </span>
                <span className="text-[10px] text-gray-500 font-medium font-mono block mt-0.5">
                  {showBalance ? formatINR(user.totalRecharge) : '•••'}
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
              className="p-3 rounded-2xl bg-gradient-to-b from-amber-50/80 to-amber-50/20 border border-amber-100/90 hover:border-amber-300 hover:shadow-sm active:scale-95 transition-all text-left cursor-pointer flex flex-col justify-between space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <div className="w-7 h-7 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
                  <TrendingUp className="w-4 h-4 stroke-[2.5]" />
                </div>
                <span className="text-[9px] font-bold text-amber-800 bg-amber-100/80 px-1.5 py-0.5 rounded-md font-mono">
                  {incomeTxCount}
                </span>
              </div>
              <div>
                <span className="text-xs font-bold text-gray-900 block group-hover:text-amber-700 transition-colors">
                  Income Record
                </span>
                <span className="text-[10px] text-gray-500 font-medium font-mono block mt-0.5">
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
              className="p-3 rounded-2xl bg-gradient-to-b from-teal-50/80 to-teal-50/20 border border-teal-100/90 hover:border-teal-300 hover:shadow-sm active:scale-95 transition-all text-left cursor-pointer flex flex-col justify-between space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <div className="w-7 h-7 rounded-xl bg-slate-800 text-teal-300 flex items-center justify-center shadow-xs">
                  <ArrowDownToLine className="w-4 h-4 stroke-[2.5]" />
                </div>
                <span className="text-[9px] font-bold text-teal-800 bg-teal-100/80 px-1.5 py-0.5 rounded-md font-mono">
                  {withdrawTxCount}
                </span>
              </div>
              <div>
                <span className="text-xs font-bold text-gray-900 block group-hover:text-teal-700 transition-colors">
                  Withdrawal Record
                </span>
                <span className="text-[10px] text-gray-500 font-medium font-mono block mt-0.5">
                  {showBalance ? formatINR(user.totalWithdraw) : '•••'}
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
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <ArrowDownLeft className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-xs font-bold text-gray-800 block">Recharge Record</span>
                <span className="text-[10px] text-gray-400 block mt-0.5">
                  Deposit receipts, UPI confirmations & UTR slips
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-mono">
                {rechargeTxCount} {rechargeTxCount === 1 ? 'slip' : 'slips'}
              </span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
          </button>

          {/* Income Record */}
          <button
            id="menu-income-record"
            onClick={() => {
              sfx.playTap();
              navigateToTransactions('revenue');
            }}
            className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-xs font-bold text-gray-800 block">Income Record</span>
                <span className="text-[10px] text-gray-400 block mt-0.5">
                  Daily returns, bonuses & dividend history
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full font-mono">
                {incomeTxCount} {incomeTxCount === 1 ? 'record' : 'records'}
              </span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
          </button>

          {/* Withdrawal Record */}
          <button
            id="menu-withdrawal-record"
            onClick={() => {
              sfx.playTap();
              navigateToTransactions('withdraw');
            }}
            className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                <ArrowDownToLine className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-xs font-bold text-gray-800 block">Withdrawal Record</span>
                <span className="text-[10px] text-gray-400 block mt-0.5">
                  Bank IMPS payouts & clearance confirmations
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full font-mono">
                {withdrawTxCount} {withdrawTxCount === 1 ? 'payout' : 'payouts'}
              </span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
          </button>

          {/* Bank Account */}
          <button
            id="menu-bank"
            onClick={() => setCurrentView('bank')}
            className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Building2 className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-gray-800">Bank Account</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>

          {/* My Product */}
          <button
            id="menu-products"
            onClick={() => setCurrentView('myproducts')}
            className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Package className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-gray-800">My Investment Products</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>

          {/* All Financial Statements */}
          <button
            id="menu-transactions"
            onClick={() => navigateToTransactions('all')}
            className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <History className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-gray-800 block">All Financial Statements</span>
                <span className="text-[10px] text-gray-400 block mt-0.5">
                  Complete account audit trail & downloadable slips
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>

          {/* Security & Password */}
          <button
            id="menu-password"
            onClick={() => setCurrentView('password')}
            className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <KeyRound className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-gray-800">Security & Password</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>

          {/* About */}
          <button
            id="menu-about"
            onClick={() => setCurrentView('about')}
            className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Info className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-gray-800">About AKM Portal</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Action Logout / Reset */}
        <div className="space-y-2 pt-2">
          {isLoggedIn ? (
            <button
              id="profile-logout-btn"
              onClick={handleLogout}
              className="w-full py-3 bg-white hover:bg-rose-50 border border-gray-200 hover:border-rose-200 text-rose-600 font-bold text-xs rounded-2xl flex items-center justify-center space-x-2 active:scale-98 transition-all cursor-pointer shadow-2xs"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out Account</span>
            </button>
          ) : (
            <button
              onClick={() => openAuthModal('login')}
              className="w-full py-3 btn-chamkila text-white font-bold text-xs rounded-2xl flex items-center justify-center space-x-2 active:scale-98 transition-all cursor-pointer shadow-md"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In / Register</span>
            </button>
          )}

          <div className="text-center pt-2">
            <button
              onClick={() => setIsAdminOpen(true)}
              className="text-[10px] text-gray-400 hover:text-emerald-700 underline cursor-pointer"
            >
              Admin & Gateway Control Center
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

