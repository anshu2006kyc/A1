import React, { createContext, useContext, useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import {
  INITIAL_ADMIN_SETTINGS,
  INITIAL_AUDIT_LOGS,
  INITIAL_CHECKINS,
  INITIAL_PLANS,
  INITIAL_SECURITY_ALERTS,
  INITIAL_TEAM_MEMBERS,
  INITIAL_TRANSACTIONS,
  INITIAL_USER,
  INITIAL_USERS
} from '../data/initialData';
import {
  AdminSettings,
  AuditLog,
  BankAccount,
  CheckInRecord,
  Plan,
  SecurityAlert,
  TeamMember,
  Transaction,
  User,
  UserPlan
} from '../types';
import { formatINR } from '../utils/currency';
import { sfx } from '../utils/sound';

export type AppView =
  | 'home'
  | 'share'
  | 'checkin'
  | 'team'
  | 'profile'
  | 'recharge'
  | 'payment'
  | 'withdraw'
  | 'about'
  | 'bank'
  | 'myproducts'
  | 'transactions'
  | 'admin';

export type TransactionFilterType = 'all' | 'deposit' | 'withdraw' | 'revenue' | 'invest' | 'recharge' | 'income';

interface AppContextType {
  // Navigation
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  rechargePrefillAmount: number;
  setRechargePrefillAmount: (amount: number) => void;
  navigateToRecharge: (amount?: number) => void;
  transactionFilter: TransactionFilterType;
  setTransactionFilter: (filter: TransactionFilterType) => void;
  navigateToTransactions: (filter?: TransactionFilterType) => void;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;

  // User State & Auth
  user: User;
  registeredUsers: User[];
  isLoggedIn: boolean;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalInitialMode: 'login' | 'register' | 'forgot';
  openAuthModal: (mode?: 'login' | 'register' | 'forgot') => void;
  login: (phone: string, password?: string) => { success: boolean; message: string };
  loginWithOtp: (phone: string, otp: string) => { success: boolean; message: string };
  registerUser: (data: { phone: string; password?: string; tradePassword?: string; inviteCode?: string }) => { success: boolean; message: string };
  logoutUser: () => void;
  switchUser: (userId: number) => void;
  adminCreateUser: (userData: Partial<User>) => void;
  adminUpdateUser: (userId: number, updates: Partial<User>) => void;
  adminDeleteUser: (userId: number) => void;
  updateUserBalance: (amount: number, reason?: string) => void;
  updateBankAccount: (bank: BankAccount) => boolean;

  // Plans & Investments
  plans: Plan[];
  userPlans: UserPlan[];
  selectedCategory: 'turbo' | 'normal' | 'vip';
  setSelectedCategory: (cat: 'turbo' | 'normal' | 'vip') => void;
  buyPlan: (plan: Plan) => { success: boolean; message: string };
  claimPlanProfit: (userPlanId: string) => { success: boolean; amount: number };
  claimAllPlanProfits: () => { count: number; total: number };
  returnPlanCycle: (userPlanId: string) => { success: boolean; message: string; refundAmount?: number };

  // Check-In
  checkIns: CheckInRecord[];
  hasCheckedInToday: boolean;
  claimDailyCheckIn: () => { success: boolean; amount: number; message: string };
  streakDays: number;
  totalCheckInDays: number;
  totalCheckInEarned: number;
  claimedStreakMilestones: number[];
  claimStreakMilestone: (days: number, reward: number) => { success: boolean; amount: number; message: string };

  // Transactions
  transactions: Transaction[];
  initiateRecharge: (amount: number, channel: string, openModal?: boolean, customOrderId?: string) => { orderId: string };
  confirmDepositPayment: (orderId: string, utr?: string) => void;
  requestWithdrawal: (amount: number, payoutMethod?: 'bank' | 'upi', customAccount?: string) => { success: boolean; message: string };
  cancelWithdrawal: (txId: string) => { success: boolean; message?: string };

  // Team & Referrals
  teamMembers: TeamMember[];
  claimedTeamMilestones: string[];
  claimTeamMilestone: (questId: string, requiredActive: number, reward: number) => { success: boolean; message: string };

  // Admin Controls
  adminSettings: AdminSettings;
  updateAdminSettings: (settings: Partial<AdminSettings>) => void;
  approveDeposit: (txId: string) => void;
  rejectDeposit: (txId: string, reason?: string) => void;
  approveWithdrawal: (txId: string) => void;
  rejectWithdrawal: (txId: string, reason?: string) => void;
  runDailySettlement: () => { processed: number; totalCredited: number };
  addNewPlan: (plan: Omit<Plan, 'id'>) => void;
  updatePlan: (id: string, plan: Partial<Plan>) => void;
  deletePlan: (id: string) => void;
  resetAllData: () => void;

  // Audit Logs & Batch Tools
  auditLogs: AuditLog[];
  addAuditLog: (type: AuditLog['type'], title: string, details: string, amount?: number, status?: AuditLog['status']) => void;
  clearAuditLogs: () => void;
  approveAllPendingDeposits: () => number;
  approveAllPendingWithdrawals: () => number;
  generateDemoTransactions: () => void;

  // Security Alerts & Risk Management
  securityAlerts: SecurityAlert[];
  resolveSecurityAlert: (id: string) => void;
  clearSecurityAlerts: () => void;
  addSecurityAlert: (level: SecurityAlert['level'], title: string, message: string, sourceIp?: string) => void;

  // Advanced User Management
  debitUserBalance: (amount: number, reason: string) => boolean;
  toggleUserStatus: () => void;
  updateUserVipLevel: (level: string) => void;

  // Custom Live Ticker Management
  addTickerMessage: (msg: string) => void;
  removeTickerMessage: (index: number) => void;

  // Webhook Simulator
  simulateWebhook: (orderId: string, status: 'success' | 'failed') => void;

  // Full System Backup & Restore
  exportFullBackup: () => string;
  importFullBackup: (jsonStr: string) => boolean;

  // Global Toasts / Dialogs
  toast: { text: string; type: 'error' | 'success' | 'info' } | null;
  showToast: (text: string, type?: 'error' | 'success' | 'info') => void;
  clearToast: () => void;
  isAnnouncementOpen: boolean;
  setIsAnnouncementOpen: (open: boolean) => void;
  activeCheckoutModal: { orderId: string; amount: number; channel: string } | null;
  setActiveCheckoutModal: (data: { orderId: string; amount: number; channel: string } | null) => void;
  activePayment: {
    orderId: string;
    amount: number;
    channel: string;
    payUrl?: string | null;
    directUpiUrl?: string;
    createdAt: number;
  } | null;
  setActivePayment: (payment: {
    orderId: string;
    amount: number;
    channel: string;
    payUrl?: string | null;
    directUpiUrl?: string;
    createdAt: number;
  } | null) => void;
  openPaymentPage: (amount: number, channel?: string, customOrderId?: string, payUrl?: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

let idCounter = 0;
export const generateUniqueId = (prefix: string): string => {
  idCounter += 1;
  const rand = Math.random().toString(36).substring(2, 9);
  return `${prefix}-${Date.now()}-${idCounter}-${rand}`;
};

export const sanitizeTransactions = (list: Transaction[]): Transaction[] => {
  const seenIds = new Set<string>();
  return list.map((tx, idx) => {
    let id = tx.id;
    if (!id || seenIds.has(id)) {
      id = generateUniqueId(`${id || 'tx'}-${idx}`);
    }
    seenIds.add(id);
    return { ...tx, id };
  });
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation State
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [rechargePrefillAmount, setRechargePrefillAmount] = useState<number>(720);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<'turbo' | 'normal' | 'vip'>('normal');
  const [transactionFilter, setTransactionFilter] = useState<TransactionFilterType>('all');

  const navigateToRecharge = (amount?: number) => {
    if (amount && amount > 0) {
      setRechargePrefillAmount(amount);
    }
    setCurrentView('recharge');
  };

  const navigateToTransactions = (filter: TransactionFilterType = 'all') => {
    setTransactionFilter(filter);
    setCurrentView('transactions');
  };

  // Load / Persist User
  const [user, setUser] = useState<User>(() => {
    const saved = localStorage.getItem('akm_user') || localStorage.getItem('bkt_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  // Registered Users Registry
  const [registeredUsers, setRegisteredUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('akm_registered_users');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return INITIAL_USERS;
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const saved = localStorage.getItem('akm_is_logged_in');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalInitialMode, setAuthModalInitialMode] = useState<'login' | 'register' | 'forgot'>('login');

  const openAuthModal = (mode: 'login' | 'register' | 'forgot' = 'login') => {
    setAuthModalInitialMode(mode);
    setIsAuthModalOpen(true);
  };

  // Plans
  const [plans, setPlans] = useState<Plan[]>(() => {
    const saved = localStorage.getItem('akm_plans') || localStorage.getItem('bkt_plans');
    if (!saved) return INITIAL_PLANS;
    try {
      const parsed: Plan[] = JSON.parse(saved);
      // Merge in any plans from INITIAL_PLANS that aren't yet in localStorage (e.g. 1m to 60m turbo plans)
      const missingInitialPlans = INITIAL_PLANS.filter((ip) => !parsed.some((p) => p.id === ip.id));
      const combined = [...missingInitialPlans, ...parsed];
      return combined.map((p) => {
        const defaultPlan = INITIAL_PLANS.find((ip) => ip.id === p.id);
        return {
          ...p,
          imageUrl: p.imageUrl || defaultPlan?.imageUrl || 'https://images.unsplash.com/photo-1592838064575-70ed626d3a0e?auto=format&fit=crop&w=800&q=80'
        };
      });
    } catch {
      return INITIAL_PLANS;
    }
  });

  // User Purchased Plans
  const [userPlans, setUserPlans] = useState<UserPlan[]>(() => {
    const saved = localStorage.getItem('akm_user_plans') || localStorage.getItem('bkt_user_plans');
    if (!saved) return [];
    try {
      const parsed: UserPlan[] = JSON.parse(saved);
      const seen = new Set<string>();
      return parsed.map((up, idx) => {
        let id = up.id;
        if (!id || seen.has(id)) {
          id = generateUniqueId(`up-${idx}`);
        }
        seen.add(id);
        const matchingPlan = INITIAL_PLANS.find((p) => p.id === up.planId);
        return {
          ...up,
          id,
          imageUrl: up.imageUrl || matchingPlan?.imageUrl
        };
      });
    } catch {
      return [];
    }
  });

  // Check-in Records
  const [checkIns, setCheckIns] = useState<CheckInRecord[]>(() => {
    const saved = localStorage.getItem('akm_checkins') || localStorage.getItem('bkt_checkins');
    return saved ? JSON.parse(saved) : INITIAL_CHECKINS;
  });

  // Transactions (strictly deduplicated and sanitized)
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('akm_transactions') || localStorage.getItem('bkt_transactions');
    try {
      const parsed = saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
      return sanitizeTransactions(Array.isArray(parsed) ? parsed : INITIAL_TRANSACTIONS);
    } catch {
      return sanitizeTransactions(INITIAL_TRANSACTIONS);
    }
  });

  // Team
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() => {
    const saved = localStorage.getItem('akm_team') || localStorage.getItem('bkt_team');
    return saved ? JSON.parse(saved) : INITIAL_TEAM_MEMBERS;
  });

  // Admin Settings
  const [adminSettings, setAdminSettings] = useState<AdminSettings>(() => {
    const saved = localStorage.getItem('akm_admin_settings') || localStorage.getItem('bkt_admin_settings');
    return saved ? JSON.parse(saved) : INITIAL_ADMIN_SETTINGS;
  });

  // Audit Logs (real-time platform events)
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('akm_audit_logs') || localStorage.getItem('bkt_audit_logs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  useEffect(() => {
    localStorage.setItem('akm_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  const addAuditLog = (
    type: AuditLog['type'],
    title: string,
    details: string,
    amount?: number,
    status: AuditLog['status'] = 'info'
  ) => {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    const newLog: AuditLog = {
      id: generateUniqueId('log'),
      timestamp: timeStr,
      type,
      title,
      details,
      amount,
      status
    };
    setAuditLogs((prev) => [newLog, ...prev.slice(0, 79)]);
  };

  const clearAuditLogs = () => {
    setAuditLogs([]);
    showToast('Audit logs cleared', 'info');
  };

  // Security Alerts & Fraud Shield
  const [securityAlerts, setSecurityAlerts] = useState<SecurityAlert[]>(() => {
    const saved = localStorage.getItem('akm_security_alerts') || localStorage.getItem('bkt_security_alerts');
    return saved ? JSON.parse(saved) : INITIAL_SECURITY_ALERTS;
  });

  useEffect(() => {
    localStorage.setItem('akm_security_alerts', JSON.stringify(securityAlerts));
  }, [securityAlerts]);

  const resolveSecurityAlert = (id: string) => {
    setSecurityAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, resolved: true } : a))
    );
    showToast('Security alert marked as resolved', 'info');
  };

  const clearSecurityAlerts = () => {
    setSecurityAlerts([]);
    showToast('All security alerts cleared', 'info');
  };

  const addSecurityAlert = (
    level: SecurityAlert['level'],
    title: string,
    message: string,
    sourceIp: string = '127.0.0.1'
  ) => {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const newAlert: SecurityAlert = {
      id: generateUniqueId('sec'),
      timestamp: timeStr,
      level,
      title,
      message,
      sourceIp,
      resolved: false
    };
    setSecurityAlerts((prev) => [newAlert, ...prev.slice(0, 49)]);
  };

  // Claimed Streak & Team Milestones
  const [claimedStreakMilestones, setClaimedStreakMilestones] = useState<number[]>(() => {
    const saved = localStorage.getItem('akm_claimed_streak_milestones') || localStorage.getItem('bkt_claimed_streak_milestones');
    return saved ? JSON.parse(saved) : [];
  });

  const [claimedTeamMilestones, setClaimedTeamMilestones] = useState<string[]>(() => {
    const saved = localStorage.getItem('akm_claimed_team_milestones') || localStorage.getItem('bkt_claimed_team_milestones');
    return saved ? JSON.parse(saved) : [];
  });

  // Active Checkout Modal
  const [activeCheckoutModal, setActiveCheckoutModal] = useState<{
    orderId: string;
    amount: number;
    channel: string;
  } | null>(null);

  // Active Direct Payment Page State
  const [activePayment, setActivePayment] = useState<{
    orderId: string;
    amount: number;
    channel: string;
    payUrl?: string | null;
    directUpiUrl?: string;
    createdAt: number;
  } | null>(() => {
    try {
      const saved = sessionStorage.getItem('akm_active_payment');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      if (activePayment) {
        sessionStorage.setItem('akm_active_payment', JSON.stringify(activePayment));
      } else {
        sessionStorage.removeItem('akm_active_payment');
      }
    } catch {}
  }, [activePayment]);

  // Toast Notification
  const [toast, setToast] = useState<{ text: string; type: 'error' | 'success' | 'info' } | null>(null);
  const [isAnnouncementOpen, setIsAnnouncementOpen] = useState<boolean>(false);

  const clearToast = () => {
    setToast(null);
  };

  const showToast = (text: string, type: 'error' | 'success' | 'info' = 'info') => {
    if (!text || !text.trim()) {
      setToast(null);
      return;
    }
    setToast({ text, type });
    setTimeout(() => {
      setToast((prev) => (prev?.text === text ? null : prev));
    }, 3500);
  };

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('akm_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('akm_plans', JSON.stringify(plans));
  }, [plans]);

  useEffect(() => {
    localStorage.setItem('akm_user_plans', JSON.stringify(userPlans));
  }, [userPlans]);

  useEffect(() => {
    localStorage.setItem('akm_checkins', JSON.stringify(checkIns));
  }, [checkIns]);

  useEffect(() => {
    localStorage.setItem('akm_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('akm_team', JSON.stringify(teamMembers));
  }, [teamMembers]);

  useEffect(() => {
    localStorage.setItem('akm_admin_settings', JSON.stringify(adminSettings));
  }, [adminSettings]);

  useEffect(() => {
    localStorage.setItem('akm_claimed_streak_milestones', JSON.stringify(claimedStreakMilestones));
  }, [claimedStreakMilestones]);

  useEffect(() => {
    localStorage.setItem('akm_claimed_team_milestones', JSON.stringify(claimedTeamMilestones));
  }, [claimedTeamMilestones]);

  // Today's Date String (YYYY-MM-DD)
  const todayStr = new Date().toISOString().split('T')[0];
  const hasCheckedInToday = checkIns.some((c) => c.dateStr === todayStr);

  // Calculate real consecutive streak
  const calculateStreak = (): number => {
    if (checkIns.length === 0) return 0;
    const sortedDates: string[] = Array.from<string>(new Set(checkIns.map((c) => c.dateStr))).sort().reverse();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const latestDate = new Date(sortedDates[0]);
    latestDate.setHours(0, 0, 0, 0);

    const diffDays = Math.round((today.getTime() - latestDate.getTime()) / (1000 * 3600 * 24));
    // If last checkin was more than 1 day ago (missed yesterday and today), streak is broken
    if (diffDays > 1) {
      return 0;
    }

    let streak = 0;
    let cursor = new Date(latestDate);
    for (const dStr of sortedDates) {
      const d = new Date(dStr);
      d.setHours(0, 0, 0, 0);
      if (d.getTime() === cursor.getTime()) {
        streak++;
        cursor.setDate(cursor.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  };

  const streakDays = calculateStreak();
  const totalCheckInDays = checkIns.length;
  const totalCheckInEarned = checkIns.reduce((sum, c) => sum + c.amount, 0);

  // Update Balance
  const updateUserBalance = (delta: number, reason?: string) => {
    setUser((prev) => {
      const newBal = Math.max(0, Math.round((prev.balance + delta) * 100) / 100);
      const newRev = delta > 0 ? Math.round((prev.totalRevenue + delta) * 100) / 100 : prev.totalRevenue;
      return {
        ...prev,
        balance: newBal,
        totalRevenue: newRev
      };
    });
  };

  // Update Bank Account
  const updateBankAccount = (bank: BankAccount) => {
    setUser((prev) => ({
      ...prev,
      bankAccount: {
        ...bank,
        updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
      }
    }));
    showToast('Bank details updated successfully!', 'success');
    return true;
  };

  // User Auth & Session Handlers
  const login = (phone: string, password?: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    const found = registeredUsers.find(
      (u) => u.phone.replace(/\D/g, '') === cleanPhone || u.phone.replace(/\D/g, '').endsWith(cleanPhone.slice(-10))
    );
    if (!found) {
      return { success: false, message: 'No account registered with this mobile number. Please register first.' };
    }
    if (password && found.password && found.password !== password) {
      return { success: false, message: 'Invalid password. Please check and try again.' };
    }
    const updatedUser: User = { ...found, lastLogin: new Date().toISOString().replace('T', ' ').substring(0, 19) };
    setUser(updatedUser);
    setIsLoggedIn(true);
    localStorage.setItem('akm_is_logged_in', JSON.stringify(true));
    localStorage.setItem('akm_user', JSON.stringify(updatedUser));
    return { success: true, message: 'Login successful' };
  };

  const loginWithOtp = (phone: string, otp: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    if (otp !== '123456') {
      return { success: false, message: 'Invalid OTP code. Please enter 123456.' };
    }
    const found = registeredUsers.find(
      (u) => u.phone.replace(/\D/g, '') === cleanPhone || u.phone.replace(/\D/g, '').endsWith(cleanPhone.slice(-10))
    );
    if (found) {
      const updatedUser: User = { ...found, lastLogin: new Date().toISOString().replace('T', ' ').substring(0, 19) };
      setUser(updatedUser);
      setIsLoggedIn(true);
      localStorage.setItem('akm_is_logged_in', JSON.stringify(true));
      localStorage.setItem('akm_user', JSON.stringify(updatedUser));
      return { success: true, message: 'OTP Login successful' };
    } else {
      return registerUser({
        phone: `+91 ${cleanPhone.slice(-10)}`,
        password: 'password123',
        tradePassword: '123456'
      });
    }
  };

  const registerUser = (data: { phone: string; password?: string; tradePassword?: string; inviteCode?: string }) => {
    const cleanPhone = data.phone.replace(/\D/g, '');
    const exists = registeredUsers.some(
      (u) => u.phone.replace(/\D/g, '').endsWith(cleanPhone.slice(-10))
    );
    if (exists) {
      return { success: false, message: 'An account with this mobile number already exists. Please log in.' };
    }

    const newId = registeredUsers.reduce((max, u) => Math.max(max, u.id), 100) + 1;
    const newUser: User = {
      id: newId,
      phone: `+91 ${cleanPhone.slice(-10)}`,
      password: data.password || 'password123',
      tradePassword: data.tradePassword || '123456',
      name: `Investor_${cleanPhone.slice(-4)}`,
      balance: 28.0,
      totalRecharge: 0,
      totalRevenue: 28.0,
      memberLevel: 'Member',
      inviteCode: Math.floor(10000 + Math.random() * 90000).toString(),
      invitedBy: data.inviteCode || 'AKM888',
      status: 'active',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      lastLogin: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };

    const updatedList = [newUser, ...registeredUsers];
    setRegisteredUsers(updatedList);
    setUser(newUser);
    setIsLoggedIn(true);
    localStorage.setItem('akm_is_logged_in', JSON.stringify(true));
    localStorage.setItem('akm_user', JSON.stringify(newUser));
    localStorage.setItem('akm_registered_users', JSON.stringify(updatedList));

    // Welcome Bonus transaction
    const welcomeTx: Transaction = {
      id: generateUniqueId('tx-bonus'),
      userId: newId,
      type: 'referral_commission',
      title: 'AKM New Member Welcome Joining Bonus',
      method: 'Bonus Ledger Credit',
      orderId: `BONUS_${Date.now()}`,
      amount: 28.0,
      finalAmount: 28.0,
      status: 'success',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      adminRemark: 'System automated ₹28 registration reward'
    };
    setTransactions((prev) => [welcomeTx, ...prev]);

    return { success: true, message: 'Account registered successfully!' };
  };

  const logoutUser = () => {
    setIsLoggedIn(false);
    localStorage.setItem('akm_is_logged_in', JSON.stringify(false));
    sfx.playTap();
    showToast('Logged out of session', 'info');
  };

  const switchUser = (userId: number) => {
    const target = registeredUsers.find((u) => u.id === userId);
    if (target) {
      setUser(target);
      setIsLoggedIn(true);
      localStorage.setItem('akm_is_logged_in', JSON.stringify(true));
      localStorage.setItem('akm_user', JSON.stringify(target));
      showToast(`Switched account to ${target.name || target.phone}`, 'success');
    }
  };

  const adminCreateUser = (userData: Partial<User>) => {
    const newId = registeredUsers.reduce((max, u) => Math.max(max, u.id), 100) + 1;
    const phone = userData.phone || `+91 ${Math.floor(6000000000 + Math.random() * 3999999999)}`;
    const created: User = {
      id: newId,
      phone,
      password: userData.password || 'password123',
      tradePassword: userData.tradePassword || '123456',
      name: userData.name || `User ${newId}`,
      balance: userData.balance ?? 100,
      totalRecharge: userData.totalRecharge ?? 0,
      totalRevenue: userData.totalRevenue ?? 0,
      memberLevel: userData.memberLevel || 'Member',
      inviteCode: userData.inviteCode || Math.floor(10000 + Math.random() * 90000).toString(),
      status: userData.status || 'active',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      lastLogin: new Date().toISOString().replace('T', ' ').substring(0, 19),
      bankAccount: userData.bankAccount
    };
    const updated = [created, ...registeredUsers];
    setRegisteredUsers(updated);
    localStorage.setItem('akm_registered_users', JSON.stringify(updated));
    showToast(`Created user ${created.name} (${created.phone})!`, 'success');
  };

  const adminUpdateUser = (userId: number, updates: Partial<User>) => {
    const updated = registeredUsers.map((u) => {
      if (u.id === userId) {
        const merged = { ...u, ...updates };
        if (user.id === userId) {
          setUser(merged);
        }
        return merged;
      }
      return u;
    });
    setRegisteredUsers(updated);
    localStorage.setItem('akm_registered_users', JSON.stringify(updated));
    showToast('User profile updated successfully!', 'success');
  };

  const adminDeleteUser = (userId: number) => {
    if (registeredUsers.length <= 1) {
      showToast('Cannot delete the last remaining user', 'error');
      return;
    }
    const updated = registeredUsers.filter((u) => u.id !== userId);
    setRegisteredUsers(updated);
    localStorage.setItem('akm_registered_users', JSON.stringify(updated));
    if (user.id === userId) {
      setUser(updated[0]);
    }
    showToast('User removed from registry', 'info');
  };

  // Daily Check-In
  const claimDailyCheckIn = () => {
    if (hasCheckedInToday) {
      return { success: false, amount: 0, message: 'Already Claimed Today' };
    }

    const currentStreak = calculateStreak();
    const nextStreakDay = (currentStreak % 7) + 1;

    // 7-day progressive reward bonus map
    const streakBonusMap: Record<number, number> = {
      1: 0,
      2: 4,
      3: 8,
      4: 12,
      5: 18,
      6: 25,
      7: 40
    };

    const baseReward = adminSettings.dailyCheckInReward || 12;
    const bonus = streakBonusMap[nextStreakDay] || 0;
    const reward = baseReward + bonus;

    const now = new Date();
    const formatted = `${String(now.getDate()).padStart(2, '0')} ${now.toLocaleString('en-US', { month: 'short' })} ${now.getFullYear()} - ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}`;

    const newRecord: CheckInRecord = {
      id: generateUniqueId('chk'),
      userId: user.id,
      dateStr: todayStr,
      timestamp: formatted,
      amount: reward,
      status: 'success'
    };

    const newTx: Transaction = {
      id: generateUniqueId('tx-chk'),
      userId: user.id,
      type: 'checkin',
      title: `Daily Check-in (Day ${nextStreakDay})`,
      method: 'Daily Reward',
      orderId: generateUniqueId('ORD-CHK'),
      amount: reward,
      finalAmount: reward,
      status: 'success',
      createdAt: formatted
    };

    setCheckIns((prev) => [newRecord, ...prev]);
    setTransactions((prev) => sanitizeTransactions([newTx, ...prev]));
    updateUserBalance(reward, 'Daily Check-in');

    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.6 }
    });

    showToast(`Day ${nextStreakDay} Check-in Bonus +${formatINR(reward, { decimals: 0 })} Credited!`, 'success');
    return { success: true, amount: reward, message: `+${formatINR(reward, { decimals: 0 })} Added to balance!` };
  };

  // Claim Streak Milestone
  const claimStreakMilestone = (days: number, reward: number) => {
    if (claimedStreakMilestones.includes(days)) {
      showToast('Milestone bonus already claimed!', 'info');
      return { success: false, amount: 0, message: 'Already claimed' };
    }
    const currentStreak = calculateStreak();
    if (currentStreak < days) {
      showToast(`Reach ${days} days streak to unlock this reward!`, 'error');
      return { success: false, amount: 0, message: `Reach ${days} days streak` };
    }

    const now = new Date();
    const formatted = `${String(now.getDate()).padStart(2, '0')} ${now.toLocaleString('en-US', { month: 'short' })} ${now.getFullYear()} - ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}`;

    const newTx: Transaction = {
      id: generateUniqueId('tx-stk-mst'),
      userId: user.id,
      type: 'checkin',
      title: `Streak Milestone (${days} Days)`,
      method: 'Bonus Chest',
      orderId: generateUniqueId('ORD-STK'),
      amount: reward,
      finalAmount: reward,
      status: 'success',
      createdAt: formatted
    };

    setClaimedStreakMilestones((prev) => [...prev, days]);
    setTransactions((prev) => sanitizeTransactions([newTx, ...prev]));
    updateUserBalance(reward, `${days}-Day Streak Bonus`);

    confetti({
      particleCount: 110,
      spread: 75,
      origin: { y: 0.5 }
    });

    showToast(`+${formatINR(reward, { decimals: 0 })} ${days}-Day Streak Reward Claimed!`, 'success');
    return { success: true, amount: reward, message: 'Milestone claimed successfully!' };
  };

  // Claim Team Milestone Quest
  const claimTeamMilestone = (questId: string, requiredActive: number, reward: number) => {
    if (claimedTeamMilestones.includes(questId)) {
      showToast('Team quest reward already claimed!', 'info');
      return { success: false, message: 'Already claimed' };
    }

    const activeCount = teamMembers.filter((m) => m.rechargeAmount > 0).length;
    if (activeCount < requiredActive) {
      showToast(`Requires ${requiredActive} active members (Current: ${activeCount})`, 'error');
      return { success: false, message: 'Requirement not met' };
    }

    const now = new Date();
    const formatted = `${String(now.getDate()).padStart(2, '0')} ${now.toLocaleString('en-US', { month: 'short' })} ${now.getFullYear()} - ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}`;

    const newTx: Transaction = {
      id: generateUniqueId('tx-tm-qst'),
      userId: user.id,
      type: 'referral_commission',
      title: `Team Quest Bonus (${requiredActive} Active Members)`,
      method: 'Team Reward',
      orderId: generateUniqueId('ORD-TMQ'),
      amount: reward,
      finalAmount: reward,
      status: 'success',
      createdAt: formatted
    };

    setClaimedTeamMilestones((prev) => [...prev, questId]);
    setTransactions((prev) => sanitizeTransactions([newTx, ...prev]));
    updateUserBalance(reward, 'Team Quest Bonus');

    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.5 }
    });

    showToast(`+${formatINR(reward, { decimals: 0 })} Team Quest Bonus Claimed!`, 'success');
    return { success: true, message: 'Reward claimed successfully!' };
  };

  // Buy Plan
  const buyPlan = (plan: Plan) => {
    if (user.balance < plan.depositAmount) {
      return {
        success: false,
        message: `Insufficient balance (₹${user.balance.toFixed(0)} available). Please recharge to purchase.`
      };
    }

    // Check user plan limit (count active investments only, allow repurchase after completion)
    const activeCount = userPlans.filter((up) => String(up.planId) === String(plan.id) && up.status === 'active').length;
    if (plan.limit && activeCount >= plan.limit) {
      return {
        success: false,
        message: `Plan purchase limit reached (${activeCount}/${plan.limit} active). Please wait for active plan to finish.`
      };
    }

    // Deduct balance
    updateUserBalance(-plan.depositAmount, `Invest: ${plan.title}`);

    const now = new Date();
    const nowStr = now.toISOString().replace('T', ' ').substring(0, 19);
    const formattedDate = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()} - ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}`;
    const nextClaimTime = plan.durationMinutes
      ? Date.now() + plan.durationMinutes * 60 * 1000
      : undefined;

    const newUserPlan: UserPlan = {
      id: generateUniqueId(`up-${plan.id}`),
      userId: user.id,
      planId: plan.id,
      title: plan.title,
      depositAmount: plan.depositAmount,
      dailyIncome: plan.dailyIncome,
      totalReturn: plan.totalReturn,
      returnDays: plan.returnDays,
      durationMinutes: plan.durationMinutes,
      daysClaimed: 0,
      nextClaimTime,
      imageUrl: plan.imageUrl,
      status: 'active',
      purchasedAt: formattedDate
    };

    const newTx: Transaction = {
      id: generateUniqueId('tx-buy'),
      userId: user.id,
      type: 'plan_purchase',
      title: `Invest: ${plan.title}`,
      method: 'Wallet Balance',
      orderId: generateUniqueId('ORD-INV'),
      amount: -plan.depositAmount,
      finalAmount: plan.depositAmount,
      status: 'success',
      createdAt: formattedDate
    };

    setUserPlans((prev) => [newUserPlan, ...prev]);
    setTransactions((prev) => sanitizeTransactions([newTx, ...prev]));

    // Firestore async synchronization
    try {
      if (db) {
        setDoc(doc(db, 'userPlans', newUserPlan.id), newUserPlan, { merge: true }).catch(() => {});
        setDoc(doc(db, 'transactions', newTx.id), newTx, { merge: true }).catch(() => {});
        setDoc(doc(db, 'users', String(user.id)), {
          balance: Math.max(0, Math.round((user.balance - plan.depositAmount) * 100) / 100),
          updatedAt: nowStr
        }, { merge: true }).catch(() => {});
      }
    } catch {
      // offline fallback
    }

    showToast(`Successfully purchased ${plan.title}!`, 'success');
    return { success: true, message: 'Plan activated successfully!', userPlan: newUserPlan };
  };

  // Claim Plan Profit manually
  const claimPlanProfit = (userPlanId: string) => {
    const up = userPlans.find((p) => p.id === userPlanId);
    if (!up || up.status !== 'active') {
      return { success: false, amount: 0 };
    }

    if (up.durationMinutes) {
      if (up.nextClaimTime && Date.now() < up.nextClaimTime) {
        const remainingSec = Math.ceil((up.nextClaimTime - Date.now()) / 1000);
        const m = Math.floor(remainingSec / 60);
        const s = remainingSec % 60;
        showToast(`Plan in progress! ${m > 0 ? `${m}m ` : ''}${s}s remaining.`, 'info');
        return { success: false, amount: 0 };
      }
    } else {
      if (up.lastClaimDate === todayStr) {
        showToast("Today's profit has already been credited!", 'info');
        return { success: false, amount: 0 };
      }
    }

    const profit = up.durationMinutes ? up.totalReturn || up.dailyIncome : up.dailyIncome;
    const nextDaysClaimed = up.daysClaimed + 1;
    const isCompleted = up.durationMinutes ? true : nextDaysClaimed >= up.returnDays;

    setUserPlans((prev) =>
      prev.map((p) =>
        p.id === userPlanId
          ? {
              ...p,
              daysClaimed: up.durationMinutes ? p.returnDays : nextDaysClaimed,
              lastClaimDate: todayStr,
              status: isCompleted ? 'completed' : 'active'
            }
          : p
      )
    );

    const now = new Date();
    const formatted = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()} - ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}`;

    const newTx: Transaction = {
      id: generateUniqueId(`tx-prof-${userPlanId}`),
      userId: user.id,
      type: 'daily_income',
      title: up.durationMinutes ? `Turbo Return - ${up.title}` : `Daily Profit - ${up.title}`,
      method: 'System Return',
      orderId: generateUniqueId('RET'),
      amount: profit,
      finalAmount: profit,
      status: 'success',
      createdAt: formatted
    };

    setTransactions((prev) => sanitizeTransactions([newTx, ...prev]));
    updateUserBalance(profit, `${up.durationMinutes ? 'Turbo return' : 'Daily profit'} for ${up.title}`);

    confetti({
      particleCount: 50,
      spread: 50,
      origin: { y: 0.6 }
    });

    showToast(`+${formatINR(profit, { decimals: 0 })} Profit Collected!`, 'success');
    return { success: true, amount: profit };
  };

  // Claim all active plans profit at once
  const claimAllPlanProfits = () => {
    const claimable = userPlans.filter((p) => {
      if (p.status !== 'active') return false;
      if (p.durationMinutes) {
        return p.nextClaimTime ? Date.now() >= p.nextClaimTime : true;
      }
      return p.lastClaimDate !== todayStr;
    });

    if (claimable.length === 0) {
      showToast("No profits available to claim right now!", 'info');
      return { count: 0, total: 0 };
    }

    let totalAmount = 0;
    const now = new Date();
    const formatted = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()} - ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}`;

    const newTxs: Transaction[] = [];

    const updatedUserPlans = userPlans.map((up) => {
      const isEligible =
        up.status === 'active' &&
        (up.durationMinutes
          ? (up.nextClaimTime ? Date.now() >= up.nextClaimTime : true)
          : up.lastClaimDate !== todayStr);

      if (isEligible) {
        const profit = up.durationMinutes ? up.totalReturn || up.dailyIncome : up.dailyIncome;
        const nextDaysClaimed = up.daysClaimed + 1;
        const isCompleted = up.durationMinutes ? true : nextDaysClaimed >= up.returnDays;
        totalAmount += profit;

        newTxs.push({
          id: generateUniqueId(`tx-prof-${up.id}`),
          userId: user.id,
          type: 'daily_income',
          title: up.durationMinutes ? `Turbo Return - ${up.title}` : `Daily Profit - ${up.title}`,
          method: 'System Return',
          orderId: generateUniqueId('RET'),
          amount: profit,
          finalAmount: profit,
          status: 'success',
          createdAt: formatted
        });

        return {
          ...up,
          daysClaimed: up.durationMinutes ? up.returnDays : nextDaysClaimed,
          lastClaimDate: todayStr,
          status: isCompleted ? ('completed' as const) : ('active' as const)
        };
      }
      return up;
    });

    setUserPlans(updatedUserPlans);
    setTransactions((prev) => sanitizeTransactions([...newTxs, ...prev]));
    updateUserBalance(totalAmount, 'Batch profit collection');

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    showToast(`Claimed ${formatINR(totalAmount, { decimals: 0 })} from ${claimable.length} products!`, 'success');
    return { count: claimable.length, total: totalAmount };
  };

  // Return / refund a plan cycle early or on request
  const returnPlanCycle = (userPlanId: string) => {
    const target = userPlans.find((p) => p.id === userPlanId);
    if (!target) {
      showToast('Plan not found!', 'error');
      return { success: false, message: 'Plan not found' };
    }
    if (target.status !== 'active') {
      showToast('Only active plans can be returned!', 'info');
      return { success: false, message: 'Plan is already completed or returned' };
    }

    const refundAmount = target.depositAmount;

    setUserPlans((prev) =>
      prev.map((p) =>
        p.id === userPlanId
          ? {
              ...p,
              status: 'returned' as const
            }
          : p
      )
    );

    const now = new Date();
    const formatted = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()} - ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}`;

    const newTx: Transaction = {
      id: generateUniqueId(`tx-ret-${userPlanId}`),
      userId: user.id,
      type: 'daily_income',
      title: `Plan Returned: ${target.title}`,
      method: 'Deposit Refund',
      orderId: generateUniqueId('PLN-RET'),
      amount: refundAmount,
      finalAmount: refundAmount,
      status: 'success',
      createdAt: formatted
    };

    setTransactions((prev) => sanitizeTransactions([newTx, ...prev]));
    updateUserBalance(refundAmount, `Plan Returned & Deposit Refunded: ${target.title}`);

    addAuditLog(
      'system',
      'Plan Return & Refund',
      `Investment plan for "${target.title}" was returned. Full deposit of ${formatINR(refundAmount, { decimals: 0 })} was refunded to wallet.`,
      refundAmount,
      'success'
    );

    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.6 }
    });

    showToast(`Plan Returned! +${formatINR(refundAmount, { decimals: 0 })} refunded to wallet.`, 'success');
    return { success: true, message: `Plan returned successfully!`, refundAmount };
  };

  // Automated Turbo Settlement background worker
  useEffect(() => {
    if (!adminSettings.turboAutoSettlement) return;

    const checkInterval = setInterval(() => {
      const now = Date.now();
      const matureTurboPlan = userPlans.find(
        (up) =>
          up.status === 'active' &&
          Boolean(up.durationMinutes) &&
          Boolean(up.nextClaimTime) &&
          now >= (up.nextClaimTime || 0)
      );

      if (matureTurboPlan) {
        claimPlanProfit(matureTurboPlan.id);
      }
    }, 2000);

    return () => clearInterval(checkInterval);
  }, [adminSettings.turboAutoSettlement, userPlans]);

  // Initiate Recharge
  const initiateRecharge = (amount: number, channel: string, openModal: boolean = false, customOrderId?: string) => {
    if (adminSettings.freezeDeposits) {
      showToast('Deposit gateway is temporarily locked for maintenance by Admin.', 'error');
      return { orderId: '' };
    }

    if (user.status === 'suspended') {
      showToast('Your account is restricted. Contact support desk.', 'error');
      return { orderId: '' };
    }

    const orderId = customOrderId || `ORD${Date.now()}${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const formatted = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()} - ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}`;

    const newTx: Transaction = {
      id: generateUniqueId('tx-dep'),
      userId: user.id,
      type: 'recharge',
      title: `Topup - ${channel || 'Sunpays UPI'}`,
      method: channel || 'Sunpays UPI',
      orderId: orderId,
      amount: amount,
      finalAmount: amount,
      status: 'pending',
      createdAt: formatted
    };

    setTransactions((prev) => sanitizeTransactions([newTx, ...prev]));

    // Open checkout modal only if explicitly requested
    if (openModal) {
      setActiveCheckoutModal({
        orderId,
        amount,
        channel: channel || 'Sunpays UPI'
      });
    }

    return { orderId };
  };

  // Open Direct Payment Cashier Page Directly
  const openPaymentPage = (
    amount: number,
    channel: string = 'PAY-A Fast UPI',
    customOrderId?: string,
    payUrl?: string | null
  ) => {
    if (adminSettings.freezeDeposits) {
      showToast('Deposit gateway is temporarily locked for maintenance by Admin.', 'error');
      return;
    }
    if (user.status === 'suspended') {
      showToast('Your account is restricted. Contact support desk.', 'error');
      return;
    }

    const orderId = customOrderId || `ORD${Date.now()}${Math.floor(1000 + Math.random() * 9000)}`;
    initiateRecharge(amount, channel, false, orderId);

    const targetUpiId = adminSettings.upiId || 'akmpayments@okaxis';
    const directUpiUrl = `upi://pay?pa=${encodeURIComponent(targetUpiId)}&pn=${encodeURIComponent('AKM Investments')}&am=${amount}&cu=INR&tn=${encodeURIComponent(orderId)}`;

    setActivePayment({
      orderId,
      amount,
      channel,
      payUrl: payUrl || null,
      directUpiUrl,
      createdAt: Date.now()
    });

    sfx.playGatewayLaunch();
    setCurrentView('payment');
  };

  // Confirm Deposit Payment
  const confirmDepositPayment = (orderId: string, utr?: string) => {
    const tx = transactions.find((t) => t.orderId === orderId);
    if (!tx) return;

    // Credit balance
    updateUserBalance(tx.amount);
    setUser((prev) => ({
      ...prev,
      totalRecharge: Math.round((prev.totalRecharge + tx.amount) * 100) / 100
    }));

    // Update transaction to success
    setTransactions((prev) =>
      prev.map((t) =>
        t.orderId === orderId
          ? {
              ...t,
              status: 'success',
              utrNumber: utr || `UTR${Date.now()}`
            }
          : t
      )
    );

    // Multi-tier commission calculation for upline
    const l1Amt = Math.round((tx.amount * adminSettings.commissionLevel1) / 100);
    setTeamMembers((prev) =>
      prev.map((m) =>
        m.level === 1
          ? {
              ...m,
              rechargeAmount: m.rechargeAmount + tx.amount,
              commissionEarned: m.commissionEarned + l1Amt
            }
          : m
      )
    );

    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.5 }
    });

    showToast(`Recharge of ${formatINR(tx.amount, { decimals: 0 })} successful!`, 'success');
  };

  // Request Withdrawal (Supports Bank IMPS / NEFT and Instant UPI)
  const requestWithdrawal = (amount: number, payoutMethod: 'bank' | 'upi' = 'bank', customAccount?: string) => {
    if (adminSettings.freezeWithdrawals) {
      return {
        success: false,
        message: 'Withdrawals are temporarily locked for system audit by Admin. Please try again later.'
      };
    }

    if (user.status === 'suspended') {
      return {
        success: false,
        message: 'Your account is under compliance review. Withdrawals are paused.'
      };
    }

    const isUpi = payoutMethod === 'upi';
    const targetAccount = customAccount || (isUpi ? user.bankAccount?.upiId : user.bankAccount?.accountNumber);

    if (!targetAccount) {
      return {
        success: false,
        message: isUpi
          ? 'Please enter or bind your UPI ID (e.g. name@okaxis) first.'
          : 'Please bind your receiving Bank Account details first.'
      };
    }

    if (amount < adminSettings.minWithdraw) {
      return {
        success: false,
        message: `Minimum withdrawal is ${formatINR(adminSettings.minWithdraw, { decimals: 0 })}.`
      };
    }

    if (amount > adminSettings.maxWithdraw) {
      return {
        success: false,
        message: `Maximum withdrawal per transaction is ${formatINR(adminSettings.maxWithdraw, { decimals: 0 })}.`
      };
    }

    if (user.balance < amount) {
      return {
        success: false,
        message: 'Insufficient balance for withdrawal.'
      };
    }

    // Deduct user balance
    updateUserBalance(-amount, `Withdrawal: ${isUpi ? 'UPI' : 'Bank'}`);

    const fee = Math.round(((amount * adminSettings.withdrawFeePercent) / 100) * 100) / 100;
    const finalAmount = Math.max(0, amount - fee);
    const now = new Date();
    const formatted = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()} - ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}`;

    const methodLabel = isUpi
      ? `UPI (${targetAccount})`
      : `Bank (${targetAccount.slice(-4)})`;

    const newTx: Transaction = {
      id: generateUniqueId('tx-wd'),
      userId: user.id,
      type: 'withdraw',
      title: isUpi ? 'Withdrawal via UPI' : 'Withdrawal to Bank',
      method: methodLabel,
      payoutMethod,
      payoutAccount: targetAccount,
      orderId: generateUniqueId('WD'),
      amount: amount,
      finalAmount: finalAmount,
      status: 'pending',
      createdAt: formatted
    };

    setTransactions((prev) => sanitizeTransactions([newTx, ...prev]));
    showToast(`Withdrawal request for ${formatINR(amount)} submitted! Processing within window.`, 'success');
    return { success: true, message: 'Withdrawal request submitted successfully.' };
  };

  // User Cancel Pending Withdrawal
  const cancelWithdrawal = (txId: string) => {
    const tx = transactions.find((t) => t.id === txId && t.type === 'withdraw' && t.status === 'pending');
    if (!tx) {
      return { success: false, message: 'Withdrawal not found or already processed.' };
    }

    // Refund funds back to user balance immediately
    updateUserBalance(tx.amount, 'Withdrawal Cancelled');

    setTransactions((prev) =>
      prev.map((t) =>
        t.id === txId
          ? {
              ...t,
              status: 'failed',
              adminRemark: 'Cancelled by User - Funds Restored'
            }
          : t
      )
    );

    showToast(`Withdrawal cancelled! ${formatINR(tx.amount)} refunded to balance.`, 'success');
    return { success: true, message: 'Withdrawal cancelled and refunded.' };
  };

  // Admin Controls
  const updateAdminSettings = (newSettings: Partial<AdminSettings>) => {
    setAdminSettings((prev) => ({ ...prev, ...newSettings }));
    addAuditLog('system', 'System Settings Updated', 'Admin modified platform configuration', undefined, 'info');
    showToast('Admin settings updated!', 'success');
  };

  const approveDeposit = (txId: string) => {
    const tx = transactions.find((t) => t.id === txId);
    if (!tx || tx.status === 'success') return;

    updateUserBalance(tx.amount);
    setUser((prev) => ({
      ...prev,
      totalRecharge: Math.round((prev.totalRecharge + tx.amount) * 100) / 100
    }));

    setTransactions((prev) =>
      prev.map((t) => (t.id === txId ? { ...t, status: 'success' } : t))
    );
    addAuditLog('deposit', 'Deposit Approved', `Approved recharge for Order ${tx.orderId}`, tx.amount, 'success');
    showToast(`Approved deposit of ${formatINR(tx.amount, { decimals: 0 })}!`, 'success');
  };

  const rejectDeposit = (txId: string, reason?: string) => {
    const tx = transactions.find((t) => t.id === txId);
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === txId
          ? {
              ...t,
              status: 'failed',
              adminRemark: reason || 'Rejected by Admin'
            }
          : t
      )
    );
    addAuditLog('deposit', 'Deposit Rejected', `Rejected recharge for ${tx?.orderId || txId}: ${reason || 'Admin rejection'}`, tx?.amount, 'warning');
    showToast('Deposit rejected', 'info');
  };

  const approveWithdrawal = (txId: string) => {
    const tx = transactions.find((t) => t.id === txId);
    if (!tx || tx.status === 'success') return;

    setTransactions((prev) =>
      prev.map((t) => (t.id === txId ? { ...t, status: 'success' } : t))
    );
    addAuditLog('withdrawal', 'Withdrawal Approved', `Approved payout for Order ${tx.orderId}`, tx.amount, 'success');
    showToast(`Approved withdrawal of ${formatINR(tx.amount, { decimals: 0 })}!`, 'success');
  };

  const rejectWithdrawal = (txId: string, reason?: string) => {
    const tx = transactions.find((t) => t.id === txId);
    if (!tx) return;

    // Refund back to user
    updateUserBalance(tx.amount);

    setTransactions((prev) =>
      prev.map((t) =>
        t.id === txId
          ? {
              ...t,
              status: 'failed',
              adminRemark: reason || 'Rejected & Refunded by Admin'
            }
          : t
      )
    );
    addAuditLog('withdrawal', 'Withdrawal Rejected & Refunded', `Refunded ${tx.amount} to user: ${reason || 'Admin reject'}`, tx.amount, 'warning');
    showToast(`Withdrawal rejected. ${formatINR(tx.amount, { decimals: 0 })} refunded to user!`, 'info');
  };

  const approveAllPendingDeposits = () => {
    const pending = transactions.filter((t) => t.type === 'recharge' && t.status === 'pending');
    if (pending.length === 0) {
      showToast('No pending deposits to approve', 'info');
      return 0;
    }
    let totalAmt = 0;
    setTransactions((prev) =>
      prev.map((t) => {
        if (t.type === 'recharge' && t.status === 'pending') {
          totalAmt += t.amount;
          return { ...t, status: 'success' };
        }
        return t;
      })
    );
    updateUserBalance(totalAmt);
    setUser((prev) => ({
      ...prev,
      totalRecharge: Math.round((prev.totalRecharge + totalAmt) * 100) / 100
    }));
    addAuditLog('deposit', 'Batch Approved All Deposits', `Approved ${pending.length} pending deposits totalling ₹${totalAmt}`, totalAmt, 'success');
    showToast(`Batch approved ${pending.length} deposits (${formatINR(totalAmt, { decimals: 0 })})!`, 'success');
    return pending.length;
  };

  const approveAllPendingWithdrawals = () => {
    const pending = transactions.filter((t) => t.type === 'withdraw' && t.status === 'pending');
    if (pending.length === 0) {
      showToast('No pending withdrawals to approve', 'info');
      return 0;
    }
    let totalAmt = 0;
    setTransactions((prev) =>
      prev.map((t) => {
        if (t.type === 'withdraw' && t.status === 'pending') {
          totalAmt += t.amount;
          return { ...t, status: 'success' };
        }
        return t;
      })
    );
    addAuditLog('withdrawal', 'Batch Approved All Withdrawals', `Approved ${pending.length} pending payouts totalling ₹${totalAmt}`, totalAmt, 'success');
    showToast(`Batch approved ${pending.length} withdrawals (${formatINR(totalAmt, { decimals: 0 })})!`, 'success');
    return pending.length;
  };

  const generateDemoTransactions = () => {
    const demoItems: Transaction[] = [
      {
        id: generateUniqueId('tx-demo'),
        userId: user.id,
        type: 'recharge',
        title: 'Topup - SUNPAY UPI',
        method: 'SUNPAY',
        orderId: `ORD${Date.now()}_91`,
        amount: 1500,
        finalAmount: 1500,
        status: 'success',
        createdAt: 'Today - Just now'
      },
      {
        id: generateUniqueId('tx-demo'),
        userId: user.id,
        type: 'daily_income',
        title: 'Daily Profit - Agro Force Super',
        method: 'AKM Return',
        orderId: `RET${Date.now()}_92`,
        amount: 2200,
        finalAmount: 2200,
        status: 'success',
        createdAt: 'Today - 10 mins ago'
      },
      {
        id: generateUniqueId('tx-demo'),
        userId: user.id,
        type: 'withdraw',
        title: 'Withdrawal to Bank',
        method: 'IMPS Direct',
        orderId: `WD${Date.now()}_93`,
        amount: 850,
        finalAmount: 850,
        status: 'success',
        createdAt: 'Today - 25 mins ago'
      },
      {
        id: generateUniqueId('tx-demo'),
        userId: user.id,
        type: 'referral_commission',
        title: 'Level 1 Sponsor Commission',
        method: 'Team Reward',
        orderId: `COMM${Date.now()}_94`,
        amount: 375,
        finalAmount: 375,
        status: 'success',
        createdAt: 'Today - 40 mins ago'
      }
    ];
    setTransactions((prev) => sanitizeTransactions([...demoItems, ...prev]));
    addAuditLog('system', 'Demo Transactions Generated', 'Injected 4 live demo records for testing & showcase', undefined, 'info');
    showToast('Generated 4 new demo transactions!', 'success');
  };

  const runDailySettlement = () => {
    let processed = 0;
    let totalCredited = 0;

    const updatedUserPlans = userPlans.map((up) => {
      if (up.status === 'active') {
        const nextDays = up.daysClaimed + 1;
        const isCompleted = nextDays >= up.returnDays;
        processed += 1;
        totalCredited += up.dailyIncome;
        return {
          ...up,
          daysClaimed: nextDays,
          lastClaimDate: todayStr,
          status: isCompleted ? ('completed' as const) : ('active' as const)
        };
      }
      return up;
    });

    if (processed > 0) {
      setUserPlans(updatedUserPlans);
      updateUserBalance(totalCredited);

      const now = new Date();
      const formatted = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;

      const newTx: Transaction = {
        id: generateUniqueId('tx-settle'),
        userId: user.id,
        type: 'daily_income',
        title: `Auto Daily Settlement (${processed} Plans)`,
        method: 'Daily Return Engine',
        orderId: generateUniqueId('AUTO'),
        amount: totalCredited,
        finalAmount: totalCredited,
        status: 'success',
        createdAt: formatted
      };

      setTransactions((prev) => sanitizeTransactions([newTx, ...prev]));
      addAuditLog('settlement', 'Daily Settlement Executed', `Credited ${formatINR(totalCredited, { decimals: 0 })} across ${processed} plans`, totalCredited, 'success');
    }

    showToast(`Settlement completed: ${processed} plans credited ${formatINR(totalCredited, { decimals: 0 })}!`, 'success');
    return { processed, totalCredited };
  };

  const addNewPlan = (planData: Omit<Plan, 'id'>) => {
    const newPlan: Plan = {
      ...planData,
      id: generateUniqueId('plan-custom')
    };
    setPlans((prev) => [...prev, newPlan]);
    addAuditLog('plan', 'New Plan Created', `Created plan "${planData.title}" (₹${planData.depositAmount})`, planData.depositAmount, 'info');
    showToast(`New plan "${planData.title}" created!`, 'success');
  };

  const updatePlan = (id: string, updated: Partial<Plan>) => {
    setPlans((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updated } : p))
    );
    addAuditLog('plan', 'Plan Updated', `Modified parameters for plan ID ${id}`, undefined, 'info');
    showToast('Plan updated!', 'success');
  };

  const deletePlan = (id: string) => {
    setPlans((prev) => prev.filter((p) => p.id !== id));
    addAuditLog('plan', 'Plan Deleted', `Removed plan ID ${id} from catalog`, undefined, 'warning');
    showToast('Plan removed!', 'info');
  };

  // Advanced User Management
  const debitUserBalance = (amount: number, reason: string): boolean => {
    if (amount <= 0) {
      showToast('Debit amount must be greater than 0', 'error');
      return false;
    }
    if (user.balance < amount) {
      showToast(`User balance is only ${formatINR(user.balance)}, cannot debit ${formatINR(amount)}`, 'error');
      return false;
    }
    updateUserBalance(-amount, reason);
    addAuditLog('system', 'Admin Balance Debit', `Debited ${formatINR(amount)} from ${user.phone}. Reason: ${reason}`, amount, 'warning');
    showToast(`Successfully debited ${formatINR(amount)} from user wallet!`, 'info');
    return true;
  };

  const toggleUserStatus = () => {
    const nextStatus = user.status === 'active' ? 'suspended' : 'active';
    setUser((prev) => ({ ...prev, status: nextStatus }));
    addAuditLog(
      'system',
      'User Account Status Updated',
      `User ${user.phone} account marked as ${nextStatus.toUpperCase()}`,
      undefined,
      nextStatus === 'suspended' ? 'warning' : 'success'
    );
    showToast(`User account status: ${nextStatus.toUpperCase()}!`, nextStatus === 'suspended' ? 'error' : 'success');
  };

  const updateUserVipLevel = (level: string) => {
    setUser((prev) => ({ ...prev, memberLevel: level }));
    addAuditLog('system', 'VIP Tier Changed', `User ${user.phone} updated to tier: ${level}`, undefined, 'info');
    showToast(`User tier updated to ${level}!`, 'success');
  };

  // Custom Live Ticker Management
  const addTickerMessage = (msg: string) => {
    if (!msg.trim()) return;
    const current = adminSettings.tickerCustomMessages || [];
    const updated = [msg.trim(), ...current];
    updateAdminSettings({ tickerCustomMessages: updated });
    showToast('New ticker message published!', 'success');
  };

  const removeTickerMessage = (index: number) => {
    const current = adminSettings.tickerCustomMessages || [];
    const updated = current.filter((_, idx) => idx !== index);
    updateAdminSettings({ tickerCustomMessages: updated });
    showToast('Ticker message removed', 'info');
  };

  // Webhook Simulator
  const simulateWebhook = (orderId: string, status: 'success' | 'failed') => {
    const tx = transactions.find((t) => t.orderId === orderId);
    if (!tx) {
      showToast(`Order ID ${orderId} not found. Please verify.`, 'error');
      return;
    }
    if (status === 'success') {
      if (tx.status === 'success') {
        showToast('Transaction is already marked success', 'info');
        return;
      }
      confirmDepositPayment(orderId, `MCH_NOTIFY_${Date.now().toString().slice(-6)}`);
      addAuditLog('deposit', 'Sunpays Webhook Received', `Simulated HTTP 200 OK callback for Order ${orderId}`, tx.amount, 'success');
      showToast(`Webhook simulated: Order ${orderId} auto-credited ${formatINR(tx.amount)}!`, 'success');
    } else {
      setTransactions((prev) =>
        prev.map((t) => (t.orderId === orderId ? { ...t, status: 'failed', adminRemark: 'Gateway Webhook: FAILED' } : t))
      );
      addAuditLog('deposit', 'Sunpays Webhook Failed', `Gateway reported failure for Order ${orderId}`, tx.amount, 'error');
      showToast(`Webhook simulated: Order ${orderId} marked failed!`, 'info');
    }
  };

  // Full System Backup & Restore
  const exportFullBackup = (): string => {
    const backup = {
      timestamp: new Date().toISOString(),
      platform: 'AKM Agro & Energy Capital',
      user,
      plans,
      userPlans,
      transactions,
      teamMembers,
      adminSettings,
      auditLogs,
      securityAlerts
    };
    return JSON.stringify(backup, null, 2);
  };

  const importFullBackup = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (!parsed || !parsed.user || !Array.isArray(parsed.plans)) {
        showToast('Invalid backup file structure', 'error');
        return false;
      }
      setUser(parsed.user);
      setPlans(parsed.plans);
      if (Array.isArray(parsed.userPlans)) setUserPlans(parsed.userPlans);
      if (Array.isArray(parsed.transactions)) setTransactions(sanitizeTransactions(parsed.transactions));
      if (Array.isArray(parsed.teamMembers)) setTeamMembers(parsed.teamMembers);
      if (parsed.adminSettings) setAdminSettings(parsed.adminSettings);
      if (Array.isArray(parsed.auditLogs)) setAuditLogs(parsed.auditLogs);
      if (Array.isArray(parsed.securityAlerts)) setSecurityAlerts(parsed.securityAlerts);
      showToast('System state restored successfully from backup!', 'success');
      return true;
    } catch {
      showToast('JSON parse error in backup file', 'error');
      return false;
    }
  };

  const resetAllData = () => {
    ['akm_user', 'akm_plans', 'akm_user_plans', 'akm_checkins', 'akm_transactions', 'akm_team', 'akm_admin_settings', 'akm_audit_logs', 'akm_claimed_streak_milestones', 'akm_claimed_team_milestones', 'akm_security_alerts',
     'bkt_user', 'bkt_plans', 'bkt_user_plans', 'bkt_checkins', 'bkt_transactions', 'bkt_team', 'bkt_admin_settings', 'bkt_audit_logs', 'bkt_claimed_streak_milestones', 'bkt_claimed_team_milestones', 'bkt_security_alerts'
    ].forEach((key) => localStorage.removeItem(key));

    setUser(INITIAL_USER);
    setPlans(INITIAL_PLANS);
    setUserPlans([]);
    setCheckIns(INITIAL_CHECKINS);
    setTransactions(INITIAL_TRANSACTIONS);
    setTeamMembers(INITIAL_TEAM_MEMBERS);
    setAdminSettings(INITIAL_ADMIN_SETTINGS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setSecurityAlerts(INITIAL_SECURITY_ALERTS);

    showToast('Data reset to default demo state!', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        rechargePrefillAmount,
        setRechargePrefillAmount,
        navigateToRecharge,
        transactionFilter,
        setTransactionFilter,
        navigateToTransactions,
        isAdminOpen,
        setIsAdminOpen,
        user,
        registeredUsers,
        isLoggedIn,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalInitialMode,
        openAuthModal,
        login,
        loginWithOtp,
        registerUser,
        logoutUser,
        switchUser,
        adminCreateUser,
        adminUpdateUser,
        adminDeleteUser,
        updateUserBalance,
        updateBankAccount,
        plans,
        userPlans,
        selectedCategory,
        setSelectedCategory,
        buyPlan,
        claimPlanProfit,
        claimAllPlanProfits,
        returnPlanCycle,
        checkIns,
        hasCheckedInToday,
        claimDailyCheckIn,
        streakDays,
        totalCheckInDays,
        totalCheckInEarned,
        claimedStreakMilestones,
        claimStreakMilestone,
        transactions,
        initiateRecharge,
        confirmDepositPayment,
        requestWithdrawal,
        cancelWithdrawal,
        teamMembers,
        claimedTeamMilestones,
        claimTeamMilestone,
        adminSettings,
        updateAdminSettings,
        approveDeposit,
        rejectDeposit,
        approveWithdrawal,
        rejectWithdrawal,
        runDailySettlement,
        addNewPlan,
        updatePlan,
        deletePlan,
        resetAllData,
        auditLogs,
        addAuditLog,
        clearAuditLogs,
        approveAllPendingDeposits,
        approveAllPendingWithdrawals,
        generateDemoTransactions,
        securityAlerts,
        resolveSecurityAlert,
        clearSecurityAlerts,
        addSecurityAlert,
        debitUserBalance,
        toggleUserStatus,
        updateUserVipLevel,
        addTickerMessage,
        removeTickerMessage,
        simulateWebhook,
        exportFullBackup,
        importFullBackup,
        toast,
        showToast,
        clearToast,
        isAnnouncementOpen,
        setIsAnnouncementOpen,
        activeCheckoutModal,
        setActiveCheckoutModal,
        activePayment,
        setActivePayment,
        openPaymentPage
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
