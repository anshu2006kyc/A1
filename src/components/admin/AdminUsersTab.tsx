import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Ban,
  Building2,
  CheckCircle2,
  CreditCard,
  Download,
  Edit,
  Eye,
  Filter,
  Gift,
  KeyRound,
  Lock,
  LogIn,
  MinusCircle,
  Phone,
  Plus,
  PlusCircle,
  Search,
  Shield,
  ShieldAlert,
  Sparkles,
  Trash2,
  Unlock,
  UserCheck,
  UserPlus,
  Users,
  UserX,
  Wallet,
  Zap
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { User } from '../../types';
import { formatINR } from '../../utils/currency';

export const AdminUsersTab: React.FC = () => {
  const {
    user,
    registeredUsers,
    switchUser,
    adminCreateUser,
    adminUpdateUser,
    adminDeleteUser,
    updateUserBalance,
    debitUserBalance,
    userPlans,
    transactions,
    showToast
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended' | 'vip' | 'high_balance' | 'zero_balance'>('all');
  const [selectedUserId, setSelectedUserId] = useState<number>(user.id);

  // Balance adjust modal state
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [adjustTargetUser, setAdjustTargetUser] = useState<User | null>(null);
  const [adjustType, setAdjustType] = useState<'credit' | 'debit'>('credit');
  const [adjustAmount, setAdjustAmount] = useState('');
  const [adjustReason, setAdjustReason] = useState('Admin Bonus / Correction');

  // Bulk Bonus modal state
  const [showBulkBonusModal, setShowBulkBonusModal] = useState(false);
  const [bulkBonusAmount, setBulkBonusAmount] = useState('50');
  const [bulkBonusReason, setBulkBonusReason] = useState('Diwali & Performance Platform Bonus');
  const [bulkBonusTarget, setBulkBonusTarget] = useState<'all' | 'active' | 'vip'>('active');

  // Create User modal state
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserPhone, setNewUserPhone] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('password123');
  const [newUserTradePass, setNewUserTradePass] = useState('123456');
  const [newUserBalance, setNewUserBalance] = useState('100');
  const [newUserLevel, setNewUserLevel] = useState('Member');

  const vipTiers = ['Member', 'VIP 1', 'VIP 2', 'VIP 3', 'VIP 4', 'VIP 5'];

  // Current selected user object
  const selectedUser = registeredUsers.find((u) => u.id === selectedUserId) || user;
  const userTransactions = transactions.filter((t) => t.userId === selectedUser.id);
  const activePlans = userPlans.filter((p) => p.status === 'active');

  // Filtered users list
  const filteredUsers = registeredUsers.filter((u) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      u.phone.toLowerCase().includes(q) ||
      (u.name && u.name.toLowerCase().includes(q)) ||
      u.id.toString().includes(q) ||
      u.inviteCode.toLowerCase().includes(q) ||
      u.memberLevel.toLowerCase().includes(q);

    let matchesStatus = true;
    if (statusFilter === 'active') {
      matchesStatus = u.status !== 'suspended';
    } else if (statusFilter === 'suspended') {
      matchesStatus = u.status === 'suspended';
    } else if (statusFilter === 'vip') {
      matchesStatus = Boolean(u.memberLevel && u.memberLevel !== 'Member');
    } else if (statusFilter === 'high_balance') {
      matchesStatus = (u.balance || 0) >= 1000;
    } else if (statusFilter === 'zero_balance') {
      matchesStatus = (u.balance || 0) <= 0;
    }

    return matchesQuery && matchesStatus;
  });

  const totalBalanceAllUsers = registeredUsers.reduce((sum, u) => sum + (u.balance || 0), 0);
  const totalRechargeAllUsers = registeredUsers.reduce((sum, u) => sum + (u.totalRecharge || 0), 0);

  const handleExportUsersCSV = () => {
    if (registeredUsers.length === 0) {
      showToast('No user records found to export', 'info');
      return;
    }

    const headers = ['UID', 'Mobile Number', 'Name', 'Role', 'Status', 'VIP Level', 'Wallet Balance', 'Total Recharge', 'Total Withdraw', 'Total Revenue', 'Invite Code', 'Registration Date'];
    const rows = registeredUsers.map((u) => [
      u.id,
      `"${u.phone}"`,
      `"${u.name || ''}"`,
      u.role || 'user',
      u.status || 'active',
      `"${u.memberLevel || 'Member'}"`,
      u.balance || 0,
      u.totalRecharge || 0,
      u.totalWithdraw || 0,
      u.totalRevenue || 0,
      `"${u.inviteCode || ''}"`,
      `"${u.createdAt || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `akm_users_registry_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${registeredUsers.length} user records to CSV!`, 'success');
  };

  const handleBulkBonusSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const bonusAmt = parseFloat(bulkBonusAmount);
    if (isNaN(bonusAmt) || bonusAmt <= 0) {
      showToast('Please enter a valid bonus amount greater than 0', 'error');
      return;
    }

    let targets = registeredUsers;
    if (bulkBonusTarget === 'active') {
      targets = registeredUsers.filter((u) => u.status !== 'suspended');
    } else if (bulkBonusTarget === 'vip') {
      targets = registeredUsers.filter((u) => u.memberLevel && u.memberLevel !== 'Member');
    }

    if (targets.length === 0) {
      showToast('No eligible users found for bonus distribution', 'info');
      return;
    }

    targets.forEach((tgt) => {
      if (tgt.id === user.id) {
        updateUserBalance(bonusAmt, bulkBonusReason);
      } else {
        adminUpdateUser(tgt.id, {
          balance: (tgt.balance || 0) + bonusAmt,
          totalRevenue: (tgt.totalRevenue || 0) + bonusAmt
        });
      }
    });

    showToast(`Successfully disbursed ${formatINR(bonusAmt)} bonus to ${targets.length} users!`, 'success');
    setShowBulkBonusModal(false);
  };

  const handleOpenAdjust = (target: User, type: 'credit' | 'debit') => {
    setAdjustTargetUser(target);
    setAdjustType(type);
    setAdjustAmount('');
    setAdjustReason(type === 'credit' ? 'Admin Treasury Bonus Credit' : 'Admin Balance Adjustment');
    setShowAdjustModal(true);
  };

  const handleAdjustBalance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustTargetUser) return;
    const amount = parseFloat(adjustAmount);
    if (isNaN(amount) || amount <= 0) {
      showToast('Please enter a valid amount greater than 0', 'error');
      return;
    }

    if (adjustType === 'credit') {
      if (adjustTargetUser.id === user.id) {
        updateUserBalance(amount, adjustReason || 'Admin Manual Credit');
      } else {
        adminUpdateUser(adjustTargetUser.id, {
          balance: (adjustTargetUser.balance || 0) + amount,
          totalRevenue: (adjustTargetUser.totalRevenue || 0) + amount
        });
      }
      showToast(`Credited ${formatINR(amount)} to ${adjustTargetUser.name || adjustTargetUser.phone}!`, 'success');
    } else {
      if (adjustTargetUser.id === user.id) {
        const ok = debitUserBalance(amount, adjustReason || 'Admin Manual Debit');
        if (!ok) return;
      } else {
        const curBal = adjustTargetUser.balance || 0;
        if (curBal < amount) {
          showToast(`User balance (${formatINR(curBal)}) is insufficient to debit ${formatINR(amount)}`, 'error');
          return;
        }
        adminUpdateUser(adjustTargetUser.id, {
          balance: curBal - amount
        });
        showToast(`Debited ${formatINR(amount)} from ${adjustTargetUser.name || adjustTargetUser.phone}!`, 'info');
      }
    }

    setAdjustAmount('');
    setShowAdjustModal(false);
  };

  const handleCreateUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = newUserPhone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      showToast('Please enter a valid 10-digit mobile number', 'error');
      return;
    }

    const bal = parseFloat(newUserBalance) || 0;
    adminCreateUser({
      phone: `+91 ${cleanPhone.slice(-10)}`,
      name: newUserName.trim() || `User_${cleanPhone.slice(-4)}`,
      password: newUserPassword || 'password123',
      tradePassword: newUserTradePass || '123456',
      balance: bal,
      totalRecharge: bal,
      totalRevenue: bal,
      memberLevel: newUserLevel,
      status: 'active'
    });

    setNewUserPhone('');
    setNewUserName('');
    setNewUserBalance('100');
    setShowAddUserModal(false);
  };

  const handleToggleFreeze = (target: User) => {
    const newStatus = target.status === 'suspended' ? 'active' : 'suspended';
    adminUpdateUser(target.id, { status: newStatus });
    showToast(`User ${target.phone} is now ${newStatus.toUpperCase()}`, 'info');
  };

  const handleChangeVip = (target: User, tier: string) => {
    adminUpdateUser(target.id, { memberLevel: tier });
    showToast(`Updated ${target.phone} VIP tier to ${tier}`, 'success');
  };

  return (
    <div className="space-y-4">
      {/* Top Executive Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-slate-900/90 p-3.5 rounded-3xl border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Accounts</span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-black text-white mt-1">{registeredUsers.length}</div>
          <div className="text-[10px] text-emerald-400 mt-0.5 font-semibold">Active Database Records</div>
        </div>

        <div className="bg-slate-900/90 p-3.5 rounded-3xl border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Aggregated Balances</span>
            <Wallet className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-xl font-black text-emerald-400 font-mono mt-1">
            {formatINR(totalBalanceAllUsers, { decimals: 0 })}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Held in User Wallets</div>
        </div>

        <div className="bg-slate-900/90 p-3.5 rounded-3xl border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Recharges</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-black text-amber-400 font-mono mt-1">
            {formatINR(totalRechargeAllUsers, { decimals: 0 })}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Cumulative Inflow</div>
        </div>

        <div className="bg-slate-900/90 p-3.5 rounded-3xl border border-slate-800 shadow-md flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="text-xs text-slate-400">Current Live Session</div>
            <div className="text-sm font-black text-white mt-0.5 truncate max-w-[130px]">
              {user.name || user.phone}
            </div>
            <div className="text-[10px] text-emerald-400 font-mono">UID #{user.id}</div>
          </div>
          <div className="flex items-center space-x-1.5 shrink-0">
            <button
              onClick={handleExportUsersCSV}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-bold flex items-center space-x-1 border border-slate-700 active:scale-95 transition-all cursor-pointer"
              title="Export all users to CSV spreadsheet"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
            <button
              onClick={() => setShowBulkBonusModal(true)}
              className="px-2.5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 rounded-xl text-xs font-black flex items-center space-x-1 shadow-md active:scale-95 transition-all cursor-pointer"
              title="Disburse instant festival / event bonus to users"
            >
              <Gift className="w-3.5 h-3.5" />
              <span>Bulk Bonus</span>
            </button>
            <button
              onClick={() => setShowAddUserModal(true)}
              className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1 shadow-md active:scale-95 transition-all cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add User</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-slate-900/90 p-4 rounded-3xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3 shadow-md">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by phone, name, UID, or invite code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center space-x-1.5 w-full md:w-auto overflow-x-auto text-xs pb-1 md:pb-0">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-2.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
              statusFilter === 'all'
                ? 'bg-slate-700 text-white'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            All ({registeredUsers.length})
          </button>
          <button
            onClick={() => setStatusFilter('active')}
            className={`px-2.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
              statusFilter === 'active'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-950 text-slate-400 hover:text-emerald-400 border border-slate-800'
            }`}
          >
            Active ({registeredUsers.filter((u) => u.status !== 'suspended').length})
          </button>
          <button
            onClick={() => setStatusFilter('vip')}
            className={`px-2.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
              statusFilter === 'vip'
                ? 'bg-amber-500 text-slate-950 font-black'
                : 'bg-slate-950 text-slate-400 hover:text-amber-400 border border-slate-800'
            }`}
          >
            VIP ({registeredUsers.filter((u) => u.memberLevel && u.memberLevel !== 'Member').length})
          </button>
          <button
            onClick={() => setStatusFilter('high_balance')}
            className={`px-2.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
              statusFilter === 'high_balance'
                ? 'bg-teal-600 text-white'
                : 'bg-slate-950 text-slate-400 hover:text-teal-400 border border-slate-800'
            }`}
          >
            Bal &ge; ₹1K ({registeredUsers.filter((u) => (u.balance || 0) >= 1000).length})
          </button>
          <button
            onClick={() => setStatusFilter('zero_balance')}
            className={`px-2.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
              statusFilter === 'zero_balance'
                ? 'bg-slate-600 text-white'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Zero Bal ({registeredUsers.filter((u) => (u.balance || 0) <= 0).length})
          </button>
          <button
            onClick={() => setStatusFilter('suspended')}
            className={`px-2.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
              statusFilter === 'suspended'
                ? 'bg-rose-600 text-white'
                : 'bg-slate-950 text-slate-400 hover:text-rose-400 border border-slate-800'
            }`}
          >
            Frozen ({registeredUsers.filter((u) => u.status === 'suspended').length})
          </button>
        </div>
      </div>

      {/* Main Grid: User Accounts Directory + Selected User Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Accounts Directory (5 cols on lg) */}
        <div className="lg:col-span-5 bg-slate-900/90 rounded-3xl border border-slate-800 p-4 space-y-3 shadow-lg flex flex-col">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-1.5">
              <Users className="w-4 h-4 text-emerald-400" />
              <span>Registered Accounts ({filteredUsers.length})</span>
            </h3>
            <span className="text-[10px] text-slate-400">Click to inspect</span>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {filteredUsers.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                No registered users match your criteria.
              </div>
            ) : (
              filteredUsers.map((u) => {
                const isSelected = u.id === selectedUser.id;
                const isCurrentLive = u.id === user.id;

                return (
                  <div
                    key={u.id}
                    onClick={() => setSelectedUserId(u.id)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-slate-800/90 border-emerald-500/60 shadow-md ring-1 ring-emerald-500/30'
                        : 'bg-slate-950/60 border-slate-800 hover:bg-slate-800/40 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-xs">
                          {u.name ? u.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div>
                          <div className="flex items-center space-x-1.5">
                            <span className="text-xs font-bold text-white">{u.name || u.phone}</span>
                            {isCurrentLive && (
                              <span className="text-[9px] font-black px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                Live Session
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                            {u.phone} • UID #{u.id}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-xs font-black text-emerald-400 font-mono">
                          {formatINR(u.balance)}
                        </div>
                        <span
                          className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-full uppercase ${
                            u.status === 'suspended'
                              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                              : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {u.status === 'suspended' ? 'Frozen' : u.memberLevel}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Selected User Deep Control Panel (7 cols on lg) */}
        <div className="lg:col-span-7 bg-slate-900/90 rounded-3xl border border-slate-800 p-5 space-y-5 shadow-lg">
          {/* User Header & Fast Switch */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white font-black text-lg shadow-md shadow-emerald-950/40 shrink-0">
                {selectedUser.name ? selectedUser.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-base font-black text-white">{selectedUser.name || selectedUser.phone}</h3>
                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      selectedUser.status === 'suspended'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}
                  >
                    {selectedUser.status === 'suspended' ? 'FROZEN / SUSPENDED' : 'ACTIVE'}
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-0.5 flex flex-wrap items-center gap-2">
                  <span className="font-mono">{selectedUser.phone}</span>
                  <span>•</span>
                  <span>UID: #{selectedUser.id}</span>
                  <span>•</span>
                  <span>Invite: {selectedUser.inviteCode}</span>
                </div>
              </div>
            </div>

            {/* Top Right Action Pills */}
            <div className="flex items-center space-x-2">
              {selectedUser.id !== user.id && (
                <button
                  onClick={() => switchUser(selectedUser.id)}
                  className="px-3 py-1.5 bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 border border-emerald-500/40 transition-all cursor-pointer"
                  title="Switch live session to this user"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Switch Session</span>
                </button>
              )}

              <button
                onClick={() => handleToggleFreeze(selectedUser)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                  selectedUser.status === 'suspended'
                    ? 'bg-emerald-950 text-emerald-300 hover:bg-emerald-900 border border-emerald-800'
                    : 'bg-rose-950 text-rose-300 hover:bg-rose-900 border border-rose-800'
                }`}
              >
                {selectedUser.status === 'suspended' ? (
                  <>
                    <Unlock className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Unfreeze</span>
                  </>
                ) : (
                  <>
                    <Ban className="w-3.5 h-3.5 text-rose-400" />
                    <span>Freeze</span>
                  </>
                )}
              </button>

              {registeredUsers.length > 1 && (
                <button
                  onClick={() => {
                    if (window.confirm(`Are you sure you want to remove user ${selectedUser.name || selectedUser.phone}?`)) {
                      adminDeleteUser(selectedUser.id);
                    }
                  }}
                  className="p-2 bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 rounded-xl transition-colors cursor-pointer border border-slate-700"
                  title="Delete User"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Financial Cards & Quick Balance Adjustment */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Available Balance</span>
              <span className="text-base font-black text-emerald-400 font-mono">
                {formatINR(selectedUser.balance)}
              </span>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Total Recharge</span>
              <span className="text-base font-black text-teal-400 font-mono">
                {formatINR(selectedUser.totalRecharge, { decimals: 0 })}
              </span>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Total Revenue Earned</span>
              <span className="text-base font-black text-amber-400 font-mono">
                {formatINR(selectedUser.totalRevenue, { decimals: 0 })}
              </span>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block">VIP Level Override</span>
              <select
                value={selectedUser.memberLevel}
                onChange={(e) => handleChangeVip(selectedUser, e.target.value)}
                className="mt-1 w-full bg-slate-900 border border-slate-700 text-xs text-white rounded-lg p-1 font-bold focus:outline-none focus:border-emerald-500"
              >
                {vipTiers.map((tier) => (
                  <option key={tier} value={tier}>
                    {tier}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Balance Modifier Bar */}
          <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-xs font-bold text-white">Manual Balance Operations</div>
              <div className="text-[10px] text-slate-400">Directly add or deduct user balance record</div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleOpenAdjust(selectedUser, 'credit')}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Credit Balance</span>
              </button>
              <button
                onClick={() => handleOpenAdjust(selectedUser, 'debit')}
                className="px-3.5 py-1.5 bg-rose-950 hover:bg-rose-900 text-rose-300 rounded-xl text-xs font-bold flex items-center space-x-1.5 border border-rose-800 shadow-sm active:scale-95 transition-all cursor-pointer"
              >
                <MinusCircle className="w-4 h-4 text-rose-400" />
                <span>Debit Balance</span>
              </button>
            </div>
          </div>

          {/* Security & Password Credentials */}
          <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center space-x-2 text-xs font-bold text-white">
              <KeyRound className="w-4 h-4 text-amber-400" />
              <span>Authentication & Security Credentials</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
              <div>
                <span className="text-[10px] text-slate-400 block">Login Password</span>
                <span className="font-mono text-white font-bold bg-slate-900 px-2 py-1 rounded-md inline-block border border-slate-800 mt-0.5">
                  {selectedUser.password || 'password123'}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Withdrawal PIN / Trade Pass</span>
                <span className="font-mono text-amber-400 font-bold bg-slate-900 px-2 py-1 rounded-md inline-block border border-slate-800 mt-0.5">
                  {selectedUser.tradePassword || '123456'}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Last Active Session</span>
                <span className="text-slate-300 font-mono text-[11px] block mt-1">
                  {selectedUser.lastLogin || selectedUser.createdAt || 'Active Now'}
                </span>
              </div>
            </div>
          </div>

          {/* Bank Account Details */}
          <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center space-x-2 text-xs font-bold text-white">
              <CreditCard className="w-4 h-4 text-sky-400" />
              <span>Bound Banking Information</span>
            </div>
            {selectedUser.bankAccount && selectedUser.bankAccount.accountNumber ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
                <div>
                  <span className="text-[10px] text-slate-400 block">Beneficiary Name</span>
                  <span className="font-bold text-white">{selectedUser.bankAccount.holderName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Bank Account Number</span>
                  <span className="font-mono text-white font-bold">{selectedUser.bankAccount.accountNumber}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">IFSC Code</span>
                  <span className="font-mono text-emerald-400 font-bold">{selectedUser.bankAccount.ifscCode}</span>
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-500 italic">No bank account bound yet by this user.</div>
            )}
          </div>
        </div>
      </div>

      {/* Manual Balance Credit / Debit Modal */}
      {showAdjustModal && adjustTargetUser && createPortal(
        <div
          onClick={() => setShowAdjustModal(false)}
          className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-3xl p-5 space-y-4 shadow-2xl cursor-default"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                {adjustType === 'credit' ? (
                  <PlusCircle className="w-5 h-5 text-emerald-400" />
                ) : (
                  <MinusCircle className="w-5 h-5 text-rose-400" />
                )}
                <h3 className="text-sm font-bold text-white">
                  {adjustType === 'credit' ? 'Credit' : 'Debit'} User Balance
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAdjustModal(false)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 bg-slate-800 rounded-lg cursor-pointer"
              >
                Close
              </button>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
              <div className="text-slate-400">Target Account:</div>
              <div className="font-bold text-white text-sm mt-0.5">
                {adjustTargetUser.name || adjustTargetUser.phone} ({adjustTargetUser.phone})
              </div>
              <div className="text-emerald-400 font-mono mt-1 font-bold">
                Current Balance: {formatINR(adjustTargetUser.balance)}
              </div>
            </div>

            <form onSubmit={handleAdjustBalance} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Adjustment Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAdjustType('credit')}
                    className={`py-2 rounded-xl font-bold flex items-center justify-center space-x-1 cursor-pointer transition-all ${
                      adjustType === 'credit'
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'bg-slate-950 text-slate-400 border border-slate-700'
                    }`}
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Credit (+)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjustType('debit')}
                    className={`py-2 rounded-xl font-bold flex items-center justify-center space-x-1 cursor-pointer transition-all ${
                      adjustType === 'debit'
                        ? 'bg-rose-600 text-white shadow-md'
                        : 'bg-slate-950 text-slate-400 border border-slate-700'
                    }`}
                  >
                    <MinusCircle className="w-4 h-4" />
                    <span>Debit (-)</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Adjustment Amount (₹)</label>
                <input
                  type="number"
                  step="any"
                  placeholder="e.g. 500"
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Reason / Reference Remark</label>
                <input
                  type="text"
                  placeholder="e.g. Compensation bonus, KYC reward, Correction"
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAdjustModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 rounded-xl font-bold text-white shadow-md active:scale-95 transition-all cursor-pointer ${
                    adjustType === 'credit'
                      ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-700/30'
                      : 'bg-rose-600 hover:bg-rose-500 shadow-rose-700/30'
                  }`}
                >
                  Confirm {adjustType === 'credit' ? 'Credit' : 'Debit'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Add New User Modal */}
      {showAddUserModal && createPortal(
        <div
          onClick={() => setShowAddUserModal(false)}
          className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-3xl p-5 space-y-4 shadow-2xl cursor-default"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <UserPlus className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Create New User Account</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddUserModal(false)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 bg-slate-800 rounded-lg cursor-pointer"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleCreateUserSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Mobile Number (10 digits)</label>
                <input
                  type="tel"
                  placeholder="e.g. 9876543210"
                  value={newUserPhone}
                  onChange={(e) => setNewUserPhone(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Investor Display Name</label>
                <input
                  type="text"
                  placeholder="e.g. Vikram Sharma"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Login Password</label>
                  <input
                    type="text"
                    value={newUserPassword}
                    onChange={(e) => setNewUserPassword(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Trade Pass (6 digits)</label>
                  <input
                    type="text"
                    value={newUserTradePass}
                    onChange={(e) => setNewUserTradePass(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Starting Balance (₹)</label>
                  <input
                    type="number"
                    step="any"
                    value={newUserBalance}
                    onChange={(e) => setNewUserBalance(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Member Level</label>
                  <select
                    value={newUserLevel}
                    onChange={(e) => setNewUserLevel(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-bold focus:outline-none focus:border-emerald-500"
                  >
                    {vipTiers.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-md cursor-pointer active:scale-95 transition-all"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Bulk Bonus Modal */}
      {showBulkBonusModal &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center space-x-3 pb-3 border-b border-slate-800">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30 shadow-xs">
                  <Gift className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">Disburse Bulk Festival Bonus</h3>
                  <p className="text-[11px] text-slate-400">Credit rewards across multiple user accounts in one action</p>
                </div>
              </div>

              <form onSubmit={handleBulkBonusSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Target Recipients</label>
                  <select
                    value={bulkBonusTarget}
                    onChange={(e: any) => setBulkBonusTarget(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-bold focus:outline-none focus:border-amber-500"
                  >
                    <option value="active">All Active Accounts ({registeredUsers.filter(u => u.status !== 'suspended').length} users)</option>
                    <option value="vip">VIP Members Only ({registeredUsers.filter(u => u.memberLevel && u.memberLevel !== 'Member').length} users)</option>
                    <option value="all">Entire Registry ({registeredUsers.length} users)</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">Bonus Amount per User (₹)</label>
                  <input
                    type="number"
                    step="any"
                    value={bulkBonusAmount}
                    onChange={(e) => setBulkBonusAmount(e.target.value)}
                    placeholder="e.g. 50"
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-base font-bold focus:outline-none focus:border-amber-500"
                    required
                  />
                  <div className="flex items-center gap-1.5 mt-1.5">
                    {['25', '50', '100', '200', '500'].map((amt) => (
                      <button
                        type="button"
                        key={amt}
                        onClick={() => setBulkBonusAmount(amt)}
                        className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[10px] font-mono cursor-pointer"
                      >
                        +₹{amt}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">Audit Record Remark</label>
                  <input
                    type="text"
                    value={bulkBonusReason}
                    onChange={(e) => setBulkBonusReason(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <div className="bg-amber-950/40 border border-amber-500/30 p-3 rounded-2xl text-[11px] text-amber-200">
                  Total Treasury Disbursement: <strong className="text-white font-mono">{formatINR((parseFloat(bulkBonusAmount) || 0) * (bulkBonusTarget === 'vip' ? registeredUsers.filter(u => u.memberLevel && u.memberLevel !== 'Member').length : bulkBonusTarget === 'all' ? registeredUsers.length : registeredUsers.filter(u => u.status !== 'suspended').length))}</strong>
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowBulkBonusModal(false)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 rounded-xl font-black shadow-lg cursor-pointer active:scale-95 transition-all"
                  >
                    Disburse Bonus Now
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};
