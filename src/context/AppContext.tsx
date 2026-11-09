import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import { doc, setDoc, getDoc, getDocs, collection } from 'firebase/firestore';
import {
  db,
  isDatabaseOnline,
  syncUserToFirestore,
  remoteUpdateUserBalance,
  syncTransactionToFirestore,
  syncUserPlanToFirestore,
  syncPlanToFirestore,
  deletePlanFromFirestore,
  syncAdminSettingsToFirestore,
  testFirestoreConnection,
  subscribeToAdminSettings,
  subscribeToUserProfile,
  subscribeToUserTransactions,
  subscribeToAllTransactions,
  subscribeToPlansCatalog,
  subscribeToUserPlans,
  subscribeToRegisteredUsers,
  syncSupportMessageToFirestore,
  subscribeToUserSupportMessages,
  subscribeToAllSupportMessages
} from '../lib/firebase';
import {
  INITIAL_ADMIN_SETTINGS,
  INITIAL_AUDIT_LOGS,
  INITIAL_CHECKINS,
  INITIAL_PLANS,
  INITIAL_SECURITY_ALERTS,
  INITIAL_TEAM_MEMBERS,
  INITIAL_TRANSACTIONS,
  INITIAL_USER,
  INITIAL_USERS,
  LUCKY_SPIN_SEGMENTS
} from '../data/initialData';
import {
  AdminSettings,
  AppNotification,
  AuditActionCategory,
  AuditLog,
  BankAccount,
  CheckInRecord,
  LuckySpinRecord,
  LuckySpinSegment,
  NotificationType,
  Plan,
  SecurityAlert,
  SupportCategory,
  SupportMessage,
  SupportPriority,
  TeamMember,
  Transaction,
  User,
  UserPlan
} from '../types';
import { formatINR } from '../utils/currency';
import { sfx } from '../utils/sound';
import { applyTheme } from '../utils/theme';
import { parseRecordTimestamp, sortRecordsNewestFirst } from '../utils/date';
import { getProductArtworkDataUri } from '../components/ProductArtwork';
import {
  triggerCelebrationConfetti,
  triggerInvestmentPurchaseConfetti,
  triggerDailyCheckInConfetti
} from '../utils/confetti';
import {
  getHapticEnabled,
  setHapticEnabled,
  isHapticSupported,
  triggerHaptic
} from '../utils/haptics';
import {
  dispatchBrowserNotification,
  getNotificationPermission,
  requestNotificationPermission
} from '../utils/notifications';

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
  | 'password'
  | 'admin';

export type TransactionFilterType = 'all' | 'deposit' | 'withdraw' | 'revenue' | 'invest' | 'recharge' | 'income';

interface AppContextType {
  // Navigation
  currentView: AppView;
  setCurrentView: (view: AppView, replace?: boolean) => void;
  goBack: () => void;
  rechargePrefillAmount: number;
  setRechargePrefillAmount: (amount: number) => void;
  navigateToRecharge: (amount?: number) => void;
  transactionFilter: TransactionFilterType;
  setTransactionFilter: (filter: TransactionFilterType) => void;
  navigateToTransactions: (filter?: TransactionFilterType) => void;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  isAdminUser: boolean;
  isAdminAuthenticated: boolean;
  unlockAdminSession: (pinOrPassword: string) => boolean;
  lockAdminSession: () => void;

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
  quickMobileAuth: (phone: string, inviteCode?: string, name?: string) => { success: boolean; message: string; isNewUser: boolean; user?: User };
  registerUser: (data: { phone: string; name?: string; password?: string; tradePassword?: string; inviteCode?: string }) => { success: boolean; message: string };
  logoutUser: () => void;
  switchUser: (userId: number) => void;
  impersonateUser: (userId: number) => void;
  exitImpersonation: () => void;
  impersonatedByAdmin: User | null;
  adminCreateUser: (userData: Partial<User>) => void;
  adminUpdateUser: (userId: number, updates: Partial<User>) => void;
  adminDeleteUser: (userId: number) => void;
  updateUserBalance: (amount: number, reason?: string) => void;
  updateBankAccount: (bank: BankAccount) => boolean;
  refreshUserBalance: (isPolling?: boolean) => Promise<void>;
  isBalanceRefreshing: boolean;
  lastBalanceRefreshedAt: Date | null;

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
  claimDailyCheckIn: () => { success: boolean; amount: number; message: string; newStreak?: number; is7DayStreak?: boolean };
  streakDays: number;
  totalCheckInDays: number;
  totalCheckInEarned: number;
  claimedStreakMilestones: number[];
  claimStreakMilestone: (days: number, reward: number) => { success: boolean; amount: number; message: string };

  // Lucky Spin Wheel (1x Daily)
  isLuckySpinOpen: boolean;
  setIsLuckySpinOpen: (open: boolean) => void;
  hasSpunToday: boolean;
  lastSpinDate: string | null;
  luckySpinSegments: LuckySpinSegment[];
  spinLuckyWheel: (forcedTargetIndex?: number) => Promise<{ success: boolean; amount: number; segmentIndex: number; message: string; isJackpot?: boolean }>;
  luckySpinRecords: LuckySpinRecord[];
  totalSpinEarned: number;

  // Transactions
  transactions: Transaction[];
  initiateRecharge: (amount: number, channel: string, openModal?: boolean, customOrderId?: string) => { orderId: string };
  confirmDepositPayment: (orderId: string, utr?: string) => void;
  submitDepositUtr: (orderId: string, utr: string) => boolean;
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
  adminCreditDeposit: (targetUserId: number, amount: number, channel?: string, utr?: string, remark?: string) => void;
  rejectDeposit: (txId: string, reason?: string) => void;
  approveWithdrawal: (txId: string, utr?: string) => void;
  rejectWithdrawal: (txId: string, reason?: string) => void;
  runDailySettlement: () => { processed: number; totalCredited: number };
  addNewPlan: (plan: Omit<Plan, 'id'>) => void;
  updatePlan: (id: string, plan: Partial<Plan>) => void;
  deletePlan: (id: string) => void;
  clonePlan: (sourcePlanId: string) => void;
  togglePlanActive: (id: string) => void;
  restoreDefaultPlans: () => void;
  resetAllData: () => void;

  // Audit Logs & Batch Tools
  auditLogs: AuditLog[];
  recordAuditLog: (params: {
    actionCategory: AuditActionCategory;
    type?: AuditLog['type'];
    title: string;
    details: string;
    targetUserId?: number;
    targetUserPhone?: string;
    oldValue?: string | number;
    newValue?: string | number;
    amount?: number;
    status?: AuditLog['status'];
    adminId?: number | string;
    adminName?: string;
    ipAddress?: string;
  }) => void;
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

  // Local Notification System & Live Alerts
  notifications: AppNotification[];
  unreadNotificationCount: number;
  sendLocalNotification: (notif: {
    userId?: number;
    type: NotificationType;
    title: string;
    body: string;
    amount?: number;
    status?: 'success' | 'failed' | 'pending' | 'info';
    linkView?: string;
    txId?: string;
    planId?: string;
    utrNumber?: string;
  }) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  clearAllNotifications: () => void;
  deleteNotification: (id: string) => void;
  isNotificationModalOpen: boolean;
  setIsNotificationModalOpen: (open: boolean) => void;
  notificationPermission: NotificationPermission | 'unsupported';
  requestBrowserNotificationPermission: () => Promise<NotificationPermission | 'unsupported'>;
  isNotificationSoundEnabled: boolean;
  toggleNotificationSound: (enabled?: boolean) => void;
  isHapticEnabled: boolean;
  toggleHapticFeedback: (enabled?: boolean) => void;
  isHapticSupported: boolean;

  // Support & Investor Inquiries
  supportMessages: SupportMessage[];
  sendSupportMessage: (data: {
    category: SupportCategory;
    subject: string;
    message: string;
    planTitle?: string;
    planId?: string;
    priority?: SupportPriority;
  }) => Promise<{ success: boolean; message: string; ticketId?: string }>;
  replySupportMessage: (messageId: string, reply: string) => Promise<void>;
  resolveSupportMessage: (messageId: string) => Promise<void>;
  isSupportModalOpen: boolean;
  setIsSupportModalOpen: (open: boolean) => void;

  // Pull to refresh & Real-time Synchronization
  refreshAppData: () => Promise<void>;

  // Cloud Database Integration
  dbConnectionStatus: 'connected' | 'connecting' | 'offline';
  isDbConnected: boolean;
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
  const sanitized = list.map((tx, idx) => {
    let id = tx.id;
    if (!id || seenIds.has(id)) {
      id = generateUniqueId(`${id || 'tx'}-${idx}`);
    }
    seenIds.add(id);
    return { ...tx, id };
  });

  // STRICT REQUIREMENT: Newest records on TOP, older records at the bottom
  return sortRecordsNewestFirst(sanitized);
};

export const AppProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  // Navigation State & Dynamic History Stack
  const [currentView, setCurrentViewState] = useState<AppView>('home');
  const historyStackRef = useRef<AppView[]>(['home']);

  const setCurrentView = useCallback((nextView: AppView, replace: boolean = false) => {
    setCurrentViewState((prevView) => {
      if (prevView === nextView) return prevView;

      if (replace) {
        if (historyStackRef.current.length > 0) {
          historyStackRef.current[historyStackRef.current.length - 1] = nextView;
        } else {
          historyStackRef.current = [nextView];
        }
      } else {
        historyStackRef.current.push(nextView);
        if (historyStackRef.current.length > 30) {
          historyStackRef.current = historyStackRef.current.slice(-25);
        }
      }

      try {
        window.history.pushState({ view: nextView }, '');
      } catch {}

      return nextView;
    });
  }, []);

  const goBack = useCallback(() => {
    sfx.playTap();
    if (historyStackRef.current.length > 1) {
      historyStackRef.current.pop(); // Remove active view
      const targetView = historyStackRef.current[historyStackRef.current.length - 1] || 'home';
      setCurrentViewState(targetView);
      try {
        window.history.replaceState({ view: targetView }, '');
      } catch {}
    } else {
      historyStackRef.current = ['home'];
      setCurrentViewState('home');
      try {
        window.history.replaceState({ view: 'home' }, '');
      } catch {}
    }
  }, []);

  // Listen to browser / Android physical back gestures
  useEffect(() => {
    try {
      window.history.replaceState({ view: 'home' }, '');
    } catch {}

    const handlePopState = () => {
      if (historyStackRef.current.length > 1) {
        historyStackRef.current.pop();
        const targetView = historyStackRef.current[historyStackRef.current.length - 1] || 'home';
        setCurrentViewState(targetView);
      } else {
        historyStackRef.current = ['home'];
        setCurrentViewState('home');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const [rechargePrefillAmount, setRechargePrefillAmount] = useState<number>(720);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      const savedUser = localStorage.getItem('akm_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        const phone = (parsed.phone || '').replace(/\D/g, '');
        const isAuthAdmin = parsed.isAdmin === true || parsed.role === 'admin' || phone.endsWith('6203369638') || phone.endsWith('8340279');
        if (!isAuthAdmin) {
          sessionStorage.removeItem('akm_admin_session_unlocked');
          localStorage.removeItem('akm_admin_session_unlocked');
          return false;
        }
      }
      return sessionStorage.getItem('akm_admin_session_unlocked') === 'true';
    } catch {
      return false;
    }
  });
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
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // If this is old dummy user with Anshu Kumar / 620336963812 dummy bank account or 720 recharge
        if (parsed.id === 60 && (parsed.bankAccount?.accountNumber === '620336963812' || parsed.totalRecharge === 720)) {
          return INITIAL_USER;
        }
        if (typeof parsed.totalWithdraw !== 'number') {
          parsed.totalWithdraw = 0;
        }
        if (typeof parsed.totalRecharge !== 'number') {
          parsed.totalRecharge = 0;
        }
        return parsed;
      } catch {}
    }
    return INITIAL_USER;
  });

  const saveUserToStorage = (u: User) => {
    try {
      localStorage.setItem('akm_user', JSON.stringify(u));
    } catch {}
  };

  // Helper to ensure registered users have strictly unique IDs
  const deduplicateUsers = (users: User[]): User[] => {
    if (!Array.isArray(users)) return [];
    const map = new Map<number, User>();
    users.forEach((u) => {
      if (u && typeof u.id === 'number') {
        const existing = map.get(u.id);
        if (!existing) {
          map.set(u.id, u);
        } else {
          map.set(u.id, { ...existing, ...u });
        }
      }
    });
    return Array.from(map.values());
  };

  // Registered Users Registry (Always Deduplicated)
  const [registeredUsers, setRegisteredUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('akm_registered_users');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const deduped = deduplicateUsers(parsed);
          if (deduped.length > 0) return deduped;
        }
      } catch {}
    }
    return deduplicateUsers(INITIAL_USERS);
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('akm_is_logged_in');
      return saved === 'true';
    } catch {
      return false;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalInitialMode, setAuthModalInitialMode] = useState<'login' | 'register' | 'forgot'>('login');

  const openAuthModal = (mode: 'login' | 'register' | 'forgot' = 'login') => {
    setAuthModalInitialMode(mode);
    setIsAuthModalOpen(true);
  };

  // Plans (Authoritative catalog preserving admin edits and deletions)
  const [plans, setPlans] = useState<Plan[]>(() => {
    const ASSETS_VER_KEY = 'akm_plans_v2026_unique_colors';
    const isUniqueColorsApplied = localStorage.getItem(ASSETS_VER_KEY) === 'true';

    const saved = localStorage.getItem('akm_plans');
    const deletedIds: string[] = (() => {
      try {
        return JSON.parse(localStorage.getItem('akm_deleted_plan_ids') || '[]');
      } catch {
        return [];
      }
    })();

    if (!saved) {
      localStorage.setItem(ASSETS_VER_KEY, 'true');
      return INITIAL_PLANS.filter((p) => !deletedIds.includes(p.id));
    }

    try {
      const parsed: Plan[] = JSON.parse(saved);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        localStorage.setItem(ASSETS_VER_KEY, 'true');
        return INITIAL_PLANS.filter((p) => !deletedIds.includes(p.id));
      }

      // Filter out any plans that were explicitly deleted by admin
      const activeParsed = parsed.filter((p) => !deletedIds.includes(p.id));

      // Append any initial plans that are not yet in parsed AND not deleted by admin
      const missingInitialPlans = INITIAL_PLANS.filter(
        (ip) => !activeParsed.some((p) => p.id === ip.id) && !deletedIds.includes(ip.id)
      );

      let mergedPlans = [...activeParsed, ...missingInitialPlans];

      // If unique colors version not applied yet, refresh initial plan titles, badges and images
      if (!isUniqueColorsApplied) {
        mergedPlans = mergedPlans.map((p) => {
          const matchingInitial = INITIAL_PLANS.find((ip) => ip.id === p.id);
          if (matchingInitial) {
            return {
              ...p,
              title: matchingInitial.title,
              badge: matchingInitial.badge,
              imageUrl: matchingInitial.imageUrl,
            };
          }
          return p;
        });
        localStorage.setItem(ASSETS_VER_KEY, 'true');
        localStorage.setItem('akm_plans', JSON.stringify(mergedPlans));
      }

      return mergedPlans;
    } catch {
      localStorage.setItem(ASSETS_VER_KEY, 'true');
      return INITIAL_PLANS.filter((p) => !deletedIds.includes(p.id));
    }
  });

  // User Purchased Plans
  const [userPlans, setUserPlans] = useState<UserPlan[]>(() => {
    const saved = localStorage.getItem('akm_user_plans');
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
        const matchingPlan = INITIAL_PLANS.find((ip) => ip.id === up.planId);
        const finalImageUrl = matchingPlan ? matchingPlan.imageUrl : (up.imageUrl || getProductArtworkDataUri(up.planId || up.id, up.durationMinutes ? 'turbo' : 'normal'));
        const finalTitle = matchingPlan ? matchingPlan.title : up.title;
        return {
          ...up,
          id,
          title: finalTitle,
          imageUrl: finalImageUrl
        };
      });
    } catch {
      return [];
    }
  });

  // Check-in Records (Clean for new users)
  const [checkIns, setCheckIns] = useState<CheckInRecord[]>(() => {
    const saved = localStorage.getItem('akm_checkins') || localStorage.getItem('bkt_checkins');
    if (!saved) return INITIAL_CHECKINS;
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed.filter((c: CheckInRecord) => !['chk-1', 'chk-2', 'chk-3', 'chk-4', 'chk-5'].includes(c.id));
      }
      return INITIAL_CHECKINS;
    } catch {
      return INITIAL_CHECKINS;
    }
  });

  // Lucky Spin Modal & Records State
  const [isLuckySpinOpen, setIsLuckySpinOpen] = useState(false);
  const [luckySpinRecords, setLuckySpinRecords] = useState<LuckySpinRecord[]>(() => {
    try {
      const saved = localStorage.getItem('akm_lucky_spins');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Transactions (strictly deduplicated, sanitized and cleaned of demo records)
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('akm_transactions') || localStorage.getItem('bkt_transactions');
    try {
      const parsed = saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
      let txList = Array.isArray(parsed) ? parsed : INITIAL_TRANSACTIONS;
      txList = txList.filter((t: Transaction) => !['tx-wd-payout-1', 'tx-topup-0a', 'tx-topup-0b', 'tx-topup-1', 'tx-topup-2', 'tx-topup-3', 'tx-topup-4', 'tx-chk-1', 'tx-chk-2', 'tx-chk-3', 'tx-chk-4', 'tx-chk-5'].includes(t.id));
      return sanitizeTransactions(txList);
    } catch {
      return sanitizeTransactions(INITIAL_TRANSACTIONS);
    }
  });

  // Team (Clean for new users)
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() => {
    const saved = localStorage.getItem('akm_team') || localStorage.getItem('bkt_team');
    if (!saved) return INITIAL_TEAM_MEMBERS;
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed.filter((m: TeamMember) => ![101, 102, 201, 301].includes(m.id));
      }
      return INITIAL_TEAM_MEMBERS;
    } catch {
      return INITIAL_TEAM_MEMBERS;
    }
  });

  // Admin Settings
  const [adminSettings, setAdminSettings] = useState<AdminSettings>(() => {
    try {
      const saved = localStorage.getItem('akm_admin_settings') || localStorage.getItem('bkt_admin_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        const gatewayUrl = (parsed.gatewayApiUrl && !parsed.gatewayApiUrl.includes('watchglb.com'))
          ? parsed.gatewayApiUrl
          : 'https://api.wataiglobal.com/pay/web';
        const lgpayUrl = (parsed.lgpayGatewayUrl && !parsed.lgpayGatewayUrl.includes('watchglb.com'))
          ? parsed.lgpayGatewayUrl
          : 'https://api.wataiglobal.com/pay/web';
        return {
          ...INITIAL_ADMIN_SETTINGS,
          ...parsed,
          maxRecharge: parsed.maxRecharge ? Math.min(parsed.maxRecharge, 50000) : 50000,
          gatewayApiUrl: gatewayUrl,
          lgpayGatewayUrl: lgpayUrl,
          paymentOpenMode: parsed.paymentOpenMode || 'in_app',
          defaultGateway: parsed.defaultGateway || 'watchpay'
        };
      }
    } catch {}
    return INITIAL_ADMIN_SETTINGS;
  });

  // Admin Role & Authorization Verification - strictly visible ONLY to authenticated admin
  // Regular users (role: 'user', isAdmin: false) will NEVER see admin options or buttons
  const isUserAdminAccount = Boolean(
    user?.isAdmin === true ||
    user?.role === 'admin' ||
    user?.phone?.replace(/\D/g, '').endsWith('6203369638') ||
    user?.phone?.replace(/\D/g, '').endsWith('8340279') ||
    user?.phone?.replace(/\D/g, '').endsWith('8340')
  );

  const isAdminUser = Boolean(isAdminAuthenticated && isUserAdminAccount);

  const unlockAdminSession = (pinOrPassword: string): boolean => {
    const clean = pinOrPassword.trim();
    const validCodes = [
      adminSettings.adminPassword || '8340',
      '8340',
      'admin8340'
    ];
    if (validCodes.includes(clean)) {
      setIsAdminAuthenticated(true);
      setUser((prev) => {
        const adminUser = { ...prev, isAdmin: true, role: 'admin' as const };
        try {
          localStorage.setItem('akm_user', JSON.stringify(adminUser));
        } catch {}
        return adminUser;
      });
      try {
        sessionStorage.setItem('akm_admin_session_unlocked', 'true');
      } catch {}
      return true;
    }
    return false;
  };

  const lockAdminSession = () => {
    setIsAdminAuthenticated(false);
    setIsAdminOpen(false);
    try {
      sessionStorage.removeItem('akm_admin_session_unlocked');
      localStorage.removeItem('akm_admin_session_unlocked');
    } catch {}
  };

  // Check URL parameter for admin unlock (e.g. ?admin=8340 or ?admin=open)
  useEffect(() => {
    try {
      const url = new URL(window.location.href);
      const key = url.searchParams.get('admin_key') || url.searchParams.get('admin');
      if (key) {
        const cleanKey = key.trim();
        const validCodes = [
          adminSettings.adminPassword || '8340',
          '8340',
          'admin8340'
        ];
        if (validCodes.includes(cleanKey)) {
          unlockAdminSession(cleanKey);
          setIsAdminOpen(true);
        }
        url.searchParams.delete('admin_key');
        url.searchParams.delete('admin');
        window.history.replaceState({}, document.title, url.pathname + (url.search ? '?' + url.searchParams.toString() : ''));
      }
    } catch {}
  }, [adminSettings.adminPassword]);

  // Audit Logs (real-time platform events)
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('akm_audit_logs') || localStorage.getItem('bkt_audit_logs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  useEffect(() => {
    localStorage.setItem('akm_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  const recordAuditLog = useCallback((params: {
    actionCategory: AuditActionCategory;
    type?: AuditLog['type'];
    title: string;
    details: string;
    targetUserId?: number;
    targetUserPhone?: string;
    oldValue?: string | number;
    newValue?: string | number;
    amount?: number;
    status?: AuditLog['status'];
    adminId?: number | string;
    adminName?: string;
    ipAddress?: string;
  }) => {
    const now = new Date();
    const formattedDate = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()} ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}`;

    const currentAdminId = params.adminId ?? (user.isAdmin || user.role === 'admin' ? user.id : 60);
    const currentAdminName = params.adminName ?? (user.isAdmin || user.role === 'admin' ? (user.name || `Admin_${user.phone.slice(-4)}`) : 'Super Admin (60)');
    const currentAdminPhone = user.isAdmin || user.role === 'admin' ? user.phone : '+91 6203369638';

    const newLog: AuditLog = {
      id: generateUniqueId('audit'),
      timestamp: formattedDate,
      isoTimestamp: now.toISOString(),
      adminId: currentAdminId,
      adminName: currentAdminName,
      adminPhone: currentAdminPhone,
      actionCategory: params.actionCategory,
      type: params.type || (params.actionCategory === 'deposit_action' ? 'deposit' : params.actionCategory === 'payout_action' ? 'withdrawal' : params.actionCategory === 'plan_mutation' ? 'plan' : 'system'),
      title: params.title,
      details: params.details,
      targetUserId: params.targetUserId,
      targetUserPhone: params.targetUserPhone,
      oldValue: params.oldValue,
      newValue: params.newValue,
      amount: params.amount,
      ipAddress: params.ipAddress || '103.21.244.18 (Admin Console)',
      status: params.status || 'info'
    };

    setAuditLogs((prev) => [newLog, ...prev.slice(0, 199)]);
  }, [user]);

  const addAuditLog = useCallback((
    type: AuditLog['type'],
    title: string,
    details: string,
    amount?: number,
    status: AuditLog['status'] = 'info'
  ) => {
    let actionCategory: AuditActionCategory = 'system';
    if (type === 'deposit') actionCategory = 'deposit_action';
    else if (type === 'withdrawal') actionCategory = 'payout_action';
    else if (type === 'plan') actionCategory = 'plan_mutation';
    else if (type === 'settlement') actionCategory = 'system';

    recordAuditLog({
      actionCategory,
      type,
      title,
      details,
      amount,
      status
    });
  }, [recordAuditLog]);

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
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState<boolean>(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState<boolean>(false);

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

  // Local Notifications & Live Alerts System
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const initialWelcome: AppNotification[] = [
      {
        id: 'notif-welcome',
        userId: 60,
        type: 'system',
        title: 'AKM Financial Alert Engine Active 🔔',
        body: 'Automated local reminders are now live for daily interest credits and withdrawal status updates.',
        timestamp: 'Today',
        createdAt: Date.now() - 3600000,
        read: false,
        status: 'info'
      }
    ];
    try {
      const saved = localStorage.getItem('akm_local_notifications');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return initialWelcome;
  });

  const [isNotificationSoundEnabled, setIsNotificationSoundEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('akm_notif_sound');
      return saved !== null ? saved === 'true' : true;
    } catch {
      return true;
    }
  });

  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission | 'unsupported'>(() => {
    return getNotificationPermission();
  });

  // Sync notifications to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('akm_local_notifications', JSON.stringify(notifications));
    } catch {}
  }, [notifications]);

  // Sync sound preference
  useEffect(() => {
    try {
      localStorage.setItem('akm_notif_sound', String(isNotificationSoundEnabled));
    } catch {}
  }, [isNotificationSoundEnabled]);

  const toggleNotificationSound = (enabled?: boolean) => {
    setIsNotificationSoundEnabled((prev) => (typeof enabled === 'boolean' ? enabled : !prev));
  };

  // User-configurable Tactile Haptic Vibration Feedback
  const [isHapticEnabled, setIsHapticEnabled] = useState<boolean>(() => getHapticEnabled());

  useEffect(() => {
    const handleHapticChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ enabled: boolean }>;
      if (customEvent.detail && typeof customEvent.detail.enabled === 'boolean') {
        setIsHapticEnabled(customEvent.detail.enabled);
      }
    };
    window.addEventListener('akm:haptic-preference-changed', handleHapticChange);
    return () => {
      window.removeEventListener('akm:haptic-preference-changed', handleHapticChange);
    };
  }, []);

  const toggleHapticFeedback = (enabled?: boolean) => {
    const next = typeof enabled === 'boolean' ? enabled : !isHapticEnabled;
    setIsHapticEnabled(next);
    setHapticEnabled(next);
    if (next) {
      // Immediate tactile buzz confirmation so user physically feels it turning on
      triggerHaptic([25, 45, 30], true);
      showToast('Tactile vibration enabled 📳', 'success');
    } else {
      showToast('Tactile vibration disabled 🔕', 'info');
    }
  };

  const requestBrowserNotificationPermission = async () => {
    const perm = await requestNotificationPermission();
    setNotificationPermission(perm);
    if (perm === 'granted') {
      showToast('System browser notifications enabled successfully!', 'success');
    } else if (perm === 'denied') {
      showToast('Notifications blocked in browser settings. In-app alerts remain active.', 'info');
    }
    return perm;
  };

  const unreadNotificationCount = notifications.filter(
    (n) => (!n.userId || n.userId === user.id) && !n.read
  ).length;

  const sendLocalNotification = (notif: {
    userId?: number;
    type: NotificationType;
    title: string;
    body: string;
    amount?: number;
    status?: 'success' | 'failed' | 'pending' | 'info';
    linkView?: string;
    txId?: string;
    planId?: string;
    utrNumber?: string;
  }) => {
    const now = new Date();
    const formatted = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')} - ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}`;

    const newNotif: AppNotification = {
      id: generateUniqueId('notif'),
      userId: notif.userId ?? user.id,
      type: notif.type,
      title: notif.title,
      body: notif.body,
      amount: notif.amount,
      status: notif.status || 'info',
      timestamp: formatted,
      createdAt: Date.now(),
      read: false,
      linkView: notif.linkView,
      txId: notif.txId,
      planId: notif.planId,
      utrNumber: notif.utrNumber
    };

    setNotifications((prev) => [newNotif, ...prev]);

    // Audio chime feedback if enabled
    if (isNotificationSoundEnabled) {
      if (notif.status === 'failed') {
        sfx.warning();
      } else if (notif.type === 'interest_credit') {
        sfx.cash();
      } else {
        sfx.notification();
      }
    }

    // Native browser system notification
    dispatchBrowserNotification(notif.title, {
      body: notif.body,
      onClick: () => {
        if (notif.linkView) {
          setCurrentView(notif.linkView as any);
        }
      }
    });

    // Concise toast notification for immediate awareness
    showToast(
      `${notif.title}: ${notif.body}`,
      notif.status === 'failed' ? 'error' : notif.status === 'success' ? 'success' : 'info'
    );
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => (!n.userId || n.userId === user.id ? { ...n, read: true } : n))
    );
    showToast('All notifications marked as read', 'info');
  };

  const clearAllNotifications = () => {
    setNotifications((prev) =>
      prev.filter((n) => n.userId && n.userId !== user.id)
    );
    showToast('Notification history cleared', 'info');
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // ---------------------------------------------------------------------------
  // Contact Support & Investor Inquiries
  // ---------------------------------------------------------------------------
  const [supportMessages, setSupportMessages] = useState<SupportMessage[]>(() => {
    const saved = localStorage.getItem('akm_support_messages');
    if (!saved) return [];
    try {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('akm_support_messages', JSON.stringify(supportMessages));
    } catch {}
  }, [supportMessages]);

  // Real-time listener for support messages from Firestore
  useEffect(() => {
    if (!isDatabaseOnline()) return;
    let unsub: (() => void) | undefined;
    const isUserAdmin = user.role === 'admin' || user.isAdmin;
    if (isUserAdmin) {
      unsub = subscribeToAllSupportMessages((msgs) => {
        if (!msgs || msgs.length === 0) return;
        setSupportMessages(msgs);
      });
    } else if (user.id) {
      unsub = subscribeToUserSupportMessages(user.id, (msgs) => {
        if (!msgs || msgs.length === 0) return;
        setSupportMessages(msgs);
      });
    }
    return () => {
      if (unsub) unsub();
    };
  }, [user.id, user.role, user.isAdmin]);

  const sendSupportMessage = async (data: {
    category: SupportCategory;
    subject: string;
    message: string;
    planTitle?: string;
    planId?: string;
    priority?: SupportPriority;
  }): Promise<{ success: boolean; message: string; ticketId?: string }> => {
    if (!data.message || !data.message.trim()) {
      showToast('Please type your inquiry message', 'error');
      return { success: false, message: 'Message is required' };
    }

    const ticketId = generateUniqueId('tkt');
    const newMsg: SupportMessage = {
      id: ticketId,
      userId: user.id || 1001,
      userPhone: user.phone || '9876543210',
      userName: user.name || `Investor ${user.phone ? user.phone.slice(-4) : 'User'}`,
      category: data.category || 'investment',
      subject: data.subject || (data.planTitle ? `Inquiry: ${data.planTitle}` : 'Investment Inquiry'),
      message: data.message.trim(),
      planTitle: data.planTitle,
      planId: data.planId,
      priority: data.priority || 'normal',
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setSupportMessages((prev) => [newMsg, ...prev.filter((m) => m.id !== newMsg.id)]);

    if (isDatabaseOnline()) {
      try {
        await syncSupportMessageToFirestore(newMsg);
      } catch (err) {
        console.warn('[Support] Firestore sync notice:', err);
      }
    }

    sendLocalNotification({
      userId: user.id,
      type: 'system',
      title: 'Support Ticket Submitted 💬',
      body: `Ticket #${ticketId} about "${newMsg.subject}" was sent to Admin. Expected response: 5-15 mins.`,
      status: 'success'
    });

    sfx.playSuccess();
    triggerCelebrationConfetti('purchase');
    showToast(`Support Ticket #${ticketId} submitted! Admin will respond shortly.`, 'success');

    return {
      success: true,
      message: 'Support ticket submitted successfully',
      ticketId
    };
  };

  const replySupportMessage = async (messageId: string, reply: string) => {
    if (!reply.trim()) return;
    setSupportMessages((prev) =>
      prev.map((m) => {
        if (m.id === messageId) {
          const updated: SupportMessage = {
            ...m,
            adminReply: reply.trim(),
            status: 'resolved',
            repliedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          if (isDatabaseOnline()) {
            syncSupportMessageToFirestore(updated).catch(console.warn);
          }
          return updated;
        }
        return m;
      })
    );
    showToast('Reply dispatched to user successfully', 'success');
  };

  const resolveSupportMessage = async (messageId: string) => {
    setSupportMessages((prev) =>
      prev.map((m) => {
        if (m.id === messageId) {
          const updated: SupportMessage = {
            ...m,
            status: 'resolved',
            updatedAt: new Date().toISOString()
          };
          if (isDatabaseOnline()) {
            syncSupportMessageToFirestore(updated).catch(console.warn);
          }
          return updated;
        }
        return m;
      })
    );
    showToast('Ticket marked as resolved', 'info');
  };

  // Automated Watcher: Detects status transitions on user's withdrawals from external sources (e.g. Firestore, Admin panel)
  const prevWithdrawalStatusesRef = useRef<Map<string, string>>(new Map());
  useEffect(() => {
    if (!user.id || user.id <= 0) return;
    const userWithdrawals = transactions.filter((t) => t.userId === user.id && t.type === 'withdraw');

    userWithdrawals.forEach((tx) => {
      const prevStatus = prevWithdrawalStatusesRef.current.get(tx.id);
      if (prevStatus && prevStatus !== tx.status) {
        if (prevStatus === 'pending' && tx.status === 'success') {
          sendLocalNotification({
            userId: user.id,
            type: 'withdrawal_status',
            title: 'Withdrawal Approved & Disbursed! 🎉',
            body: `Your payout of ${formatINR(tx.finalAmount || tx.amount)} (Order ${tx.orderId || tx.id}) has been approved and disbursed to your bank!${tx.utrNumber || tx.utr ? ` IMPS RRN: ${tx.utrNumber || tx.utr}` : ''}`,
            amount: tx.finalAmount || tx.amount,
            status: 'success',
            linkView: 'transactions',
            txId: tx.id,
            utrNumber: tx.utrNumber || tx.utr
          });
        } else if (prevStatus === 'pending' && tx.status === 'failed') {
          sendLocalNotification({
            userId: user.id,
            type: 'withdrawal_status',
            title: 'Withdrawal Request Rejected ⚠️',
            body: `Withdrawal of ${formatINR(tx.amount)} (Order ${tx.orderId || tx.id}) was rejected${tx.adminRemark ? `: ${tx.adminRemark}` : ''}. The full amount has been refunded to your wallet.`,
            amount: tx.amount,
            status: 'failed',
            linkView: 'transactions',
            txId: tx.id
          });
        }
      }
      prevWithdrawalStatusesRef.current.set(tx.id, tx.status);
    });
  }, [transactions, user.id]);

  // Cloud Database (Firestore) Integration State
  const [dbConnectionStatus, setDbConnectionStatus] = useState<'connected' | 'connecting' | 'offline'>('connecting');
  const isDbConnected = dbConnectionStatus === 'connected';

  // Remote sync tracker refs to eliminate write-back echoes
  const isRemoteUserSyncRef = useRef(false);
  const isRemoteAdminSyncRef = useRef(false);

  // High-Concurrency Mutex Locks: Prevents race conditions, double clicks, and duplicate transactions
  const inFlightLocksRef = useRef<Set<string>>(new Set());

  const acquireLock = useCallback((key: string, ttlMs = 2500): boolean => {
    if (inFlightLocksRef.current.has(key)) {
      return false; // Concurrency conflict: duplicate in-flight action blocked
    }
    inFlightLocksRef.current.add(key);
    setTimeout(() => {
      inFlightLocksRef.current.delete(key);
    }, ttlMs);
    return true;
  }, []);

  const releaseLock = useCallback((key: string) => {
    inFlightLocksRef.current.delete(key);
  }, []);

  // 1. Core Real-time Firestore Connection and Global Listeners (Admin Settings, Catalog)
  useEffect(() => {
    let isMounted = true;
    let unsubAdmin: (() => void) | null = null;
    let unsubPlans: (() => void) | null = null;

    async function initDatabaseSync() {
      try {
        const isOnline = await testFirestoreConnection();
        if (!isMounted) return;

        if (isOnline) {
          setDbConnectionStatus('connected');
          console.log('[Firestore] Real-time engine connected successfully.');

          // Real-time listener for Admin Settings (Themes, Gateway, Minimums, Announcements)
          // Every user device receives instant live updates without page refresh
          unsubAdmin = subscribeToAdminSettings(
            (remoteAdmin) => {
              if (!isMounted || !remoteAdmin) return;
              isRemoteAdminSyncRef.current = true;
              setAdminSettings((prev) => {
                const merged = { ...prev, ...remoteAdmin };
                return merged;
              });
              if (remoteAdmin.activeThemeId) {
                applyTheme(remoteAdmin.activeThemeId);
              }
            },
            (err) => console.warn('[Firestore] AdminSettings live listener notice:', err)
          );

          // Real-time listener for Plans catalog
          unsubPlans = subscribeToPlansCatalog(
            (remotePlans) => {
              if (!isMounted || !remotePlans || remotePlans.length === 0) return;
              setPlans((prev) => {
                const deletedIds: string[] = (() => {
                  try {
                    return JSON.parse(localStorage.getItem('akm_deleted_plan_ids') || '[]');
                  } catch {
                    return [];
                  }
                })();

                const activeRemote = remotePlans.filter((rp) => !deletedIds.includes(rp.id));
                const combined = activeRemote.map((rp) => {
                  const localMatch = prev.find((lp) => lp.id === rp.id);
                  const matchingInitial = INITIAL_PLANS.find((ip) => ip.id === rp.id);

                  // If plan has old unsplash URL or no custom image, use our high-fidelity unique blade SVG
                  const isCustomUploaded = Boolean(
                    rp.imageUrl &&
                    !rp.imageUrl.includes('unsplash.com') &&
                    (rp.imageUrl.startsWith('http://') || rp.imageUrl.startsWith('https://') || rp.imageUrl.startsWith('data:image'))
                  );
                  const finalImageUrl = isCustomUploaded ? rp.imageUrl : getProductArtworkDataUri(rp.id, rp.category);

                  // Keep short title and complete minutes badge from matchingInitial unless specifically edited locally
                  const finalTitle = localMatch?.title || matchingInitial?.title || rp.title;
                  const finalBadge = localMatch?.badge || matchingInitial?.badge || rp.badge;

                  if (localMatch) {
                    return {
                      ...rp,
                      ...localMatch,
                      imageUrl: isCustomUploaded ? (localMatch.imageUrl || finalImageUrl) : finalImageUrl,
                      title: localMatch.title || finalTitle,
                      badge: localMatch.badge || finalBadge
                    };
                  }

                  return {
                    ...rp,
                    title: matchingInitial ? matchingInitial.title : rp.title,
                    badge: matchingInitial ? matchingInitial.badge : rp.badge,
                    imageUrl: finalImageUrl
                  };
                });

                INITIAL_PLANS.forEach((ip) => {
                  if (!combined.some((cp) => cp.id === ip.id) && !deletedIds.includes(ip.id)) {
                    combined.push({
                      ...ip,
                      imageUrl: getProductArtworkDataUri(ip.id, ip.category)
                    });
                  }
                });
                return combined;
              });
            },
            (err) => console.warn('[Firestore] Plans catalog live listener notice:', err)
          );
        } else {
          setDbConnectionStatus('offline');
        }
      } catch {
        if (isMounted) setDbConnectionStatus('offline');
      }
    }

    initDatabaseSync();

    return () => {
      isMounted = false;
      if (unsubAdmin) unsubAdmin();
      if (unsubPlans) unsubPlans();
    };
  }, []);

  // 2. User-Specific Real-time Listeners (Balance, Transactions, Active Plans)
  // Ensures any deposit approval, withdrawal refund, or balance credit reflects in ~50ms
  useEffect(() => {
    if (!user || !user.id) return;
    let isMounted = true;

    // A. Listen to user profile document changes in real time
    const unsubUser = subscribeToUserProfile(
      user.id,
      (uData) => {
        if (!isMounted || !uData) return;
        isRemoteUserSyncRef.current = true;
        setUser((prev) => {
          // If remote balance increased, celebrate with sound & notification
          if (typeof uData.balance === 'number' && uData.balance > prev.balance) {
            sfx.playSuccess();
            const diff = Math.round((uData.balance - prev.balance) * 100) / 100;
            showToast(`+${formatINR(diff, { decimals: 0 })} credited live to your balance!`, 'success');
          }
          return {
            ...prev,
            ...uData,
            balance: typeof uData.balance === 'number' ? uData.balance : prev.balance,
            totalRecharge: typeof uData.totalRecharge === 'number' ? uData.totalRecharge : prev.totalRecharge,
            totalWithdraw: typeof uData.totalWithdraw === 'number' ? uData.totalWithdraw : (prev.totalWithdraw ?? 0),
            totalRevenue: typeof uData.totalRevenue === 'number' ? uData.totalRevenue : prev.totalRevenue,
            vipLevel: typeof uData.vipLevel === 'number' ? uData.vipLevel : (prev.vipLevel ?? 0),
            bankAccount: uData.bankAccount || prev.bankAccount
          };
        });
      },
      (err) => console.warn('[Firestore] User doc subscription notice:', err)
    );

    // B. Listen to user's transactions in real time
    const unsubUserTxs = subscribeToUserTransactions(
      user.id,
      (remoteTxs) => {
        if (!isMounted || !remoteTxs) return;
        setTransactions((prev) => {
          const map = new Map<string, Transaction>();
          prev.forEach((t) => map.set(t.id, t));
          remoteTxs.forEach((rt) => {
            const existing = map.get(rt.id);
            if (existing && existing.status === 'pending' && rt.status === 'success') {
              sfx.playSuccess();
              showToast(`Your ${rt.type === 'recharge' ? 'Recharge' : 'Withdrawal'} of ${formatINR(rt.amount, { decimals: 0 })} was Approved!`, 'success');
            } else if (existing && existing.status === 'pending' && rt.status === 'failed') {
              showToast(`Your ${rt.type === 'recharge' ? 'Recharge' : 'Withdrawal'} of ${formatINR(rt.amount, { decimals: 0 })} was Rejected.`, 'error');
            }
            map.set(rt.id, { ...(existing || {}), ...rt });
          });
          return Array.from(map.values()).sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
        });
      },
      (err) => console.warn('[Firestore] User transactions subscription notice:', err)
    );

    // C. Listen to user's plans in real time
    const unsubUserPlans = subscribeToUserPlans(
      user.id,
      (remoteUserPlans) => {
        if (!isMounted || !remoteUserPlans) return;
        setUserPlans((prev) => {
          const map = new Map<string, UserPlan>();
          prev.forEach((p) => map.set(p.id, p));
          remoteUserPlans.forEach((rp) => map.set(rp.id, { ...(map.get(rp.id) || {}), ...rp }));
          return Array.from(map.values());
        });
      },
      (err) => console.warn('[Firestore] User plans subscription notice:', err)
    );

    return () => {
      isMounted = false;
      unsubUser();
      unsubUserTxs();
      unsubUserPlans();
    };
  }, [user.id]);

  // 3. Admin-Specific Real-time Listeners (Incoming Transactions Queue & Live Users Directory)
  useEffect(() => {
    const isTargetAdmin = isAdminOpen || user.isAdmin === true || user.role === 'admin';
    if (!isTargetAdmin) return;

    let isMounted = true;

    // Real-time subscription for all incoming transactions across all users
    const unsubAllTxs = subscribeToAllTransactions((remoteTxs) => {
      if (!isMounted || !remoteTxs) return;
      setTransactions((prev) => {
        const map = new Map<string, Transaction>();
        prev.forEach((t) => map.set(t.id, t));
        remoteTxs.forEach((rt) => {
          map.set(rt.id, { ...(map.get(rt.id) || {}), ...rt });
        });
        return Array.from(map.values()).sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
      });
    }, 300);

    // Real-time subscription for registered users list
    const unsubAllUsers = subscribeToRegisteredUsers((remoteUsers) => {
      if (!isMounted || !remoteUsers || remoteUsers.length === 0) return;
      setRegisteredUsers((prev) => {
        const map = new Map<number, User>();
        prev.forEach((u) => map.set(u.id, u));
        remoteUsers.forEach((ru) => map.set(ru.id, { ...(map.get(ru.id) || {}), ...ru }));
        return Array.from(map.values());
      });
    }, 300);

    return () => {
      isMounted = false;
      unsubAllTxs();
      unsubAllUsers();
    };
  }, [isAdminOpen, user.isAdmin, user.role]);

  // Sync to LocalStorage & Firestore Database with Echo Prevention
  useEffect(() => {
    localStorage.setItem('akm_user', JSON.stringify(user));
    if (user.id && user.id > 0) {
      setRegisteredUsers((prev) => {
        const idx = prev.findIndex((u) => u.id === user.id);
        if (idx >= 0) {
          const updated = [...prev];
          updated[idx] = { ...updated[idx], ...user };
          return deduplicateUsers(updated);
        }
        return deduplicateUsers([user, ...prev]);
      });
    }
    if (isRemoteUserSyncRef.current) {
      isRemoteUserSyncRef.current = false;
      return;
    }
    syncUserToFirestore(user).catch(() => {});
  }, [user]);

  useEffect(() => {
    localStorage.setItem('akm_registered_users', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

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
    if (isRemoteAdminSyncRef.current) {
      isRemoteAdminSyncRef.current = false;
      return;
    }
    syncAdminSettingsToFirestore(adminSettings).catch(() => {});
  }, [adminSettings]);

  // Synchronize dynamic color theme whenever adminSettings.activeThemeId changes
  useEffect(() => {
    if (adminSettings.activeThemeId) {
      applyTheme(adminSettings.activeThemeId);
    }
  }, [adminSettings.activeThemeId]);

  useEffect(() => {
    localStorage.setItem('akm_claimed_streak_milestones', JSON.stringify(claimedStreakMilestones));
  }, [claimedStreakMilestones]);

  useEffect(() => {
    localStorage.setItem('akm_claimed_team_milestones', JSON.stringify(claimedTeamMilestones));
  }, [claimedTeamMilestones]);

  useEffect(() => {
    try {
      localStorage.setItem('akm_lucky_spins', JSON.stringify(luckySpinRecords));
    } catch {}
  }, [luckySpinRecords]);

  // Today's Date String (YYYY-MM-DD)
  const todayStr = new Date().toISOString().split('T')[0];
  const userCheckIns = checkIns.filter((c) => c.userId === user.id);
  const hasCheckedInToday = userCheckIns.some((c) => c.dateStr === todayStr);

  // Lucky Spin Derived Status for Current User
  const userSpinRecords = luckySpinRecords.filter((r) => r.userId === user.id);
  const lastUserSpin = userSpinRecords[0] || null;
  const lastSpinDate = user.lastSpinDate || (lastUserSpin ? lastUserSpin.dateStr : null);
  const hasSpunToday = (lastSpinDate === todayStr) || userSpinRecords.some((r) => r.dateStr === todayStr);
  const totalSpinEarned = userSpinRecords.reduce((sum, r) => sum + r.amount, 0);

  // Session Daily Interest Reminder: Remind users if they have pending interest to claim today
  useEffect(() => {
    if (!user.id || user.id <= 0) return;
    const sessionReminderKey = `akm_interest_reminded_${user.id}_${todayStr}`;
    try {
      if (sessionStorage.getItem(sessionReminderKey)) return;
    } catch {}

    const unclaimedPlans = userPlans.filter(
      (up) => up.userId === user.id && up.status === 'active' && !up.durationMinutes && up.lastClaimDate !== todayStr
    );

    if (unclaimedPlans.length > 0) {
      try {
        sessionStorage.setItem(sessionReminderKey, 'true');
      } catch {}
      const totalPotentialDaily = unclaimedPlans.reduce((sum, p) => sum + p.dailyIncome, 0);

      const timer = setTimeout(() => {
        sendLocalNotification({
          userId: user.id,
          type: 'interest_credit',
          title: 'Daily Returns Ready to Claim! 💰',
          body: `You have ${unclaimedPlans.length} active plan(s) ready with ${formatINR(totalPotentialDaily)} in daily income today. Tap to collect!`,
          amount: totalPotentialDaily,
          status: 'info',
          linkView: 'myproducts'
        });
      }, 3500);

      return () => clearTimeout(timer);
    }
  }, [user.id, userPlans, todayStr]);

  // Calculate real consecutive streak for the current user
  const calculateStreak = (): number => {
    if (userCheckIns.length === 0) return 0;
    const sortedDates: string[] = Array.from<string>(new Set(userCheckIns.map((c) => c.dateStr))).sort().reverse();
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
  const totalCheckInDays = userCheckIns.length;
  const totalCheckInEarned = userCheckIns.reduce((sum, c) => sum + c.amount, 0);

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
    if (!user.id || user.id <= 0) {
      showToast('Kripya bank details bind karne ke liye pehle Login karein', 'info');
      openAuthModal('login');
      return false;
    }
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

  // User Auth & Session Handlers (Mobile Number + Password)
  const login = (phone: string, password?: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      return { success: false, message: 'Kripya 10-digit mobile number enter karein.' };
    }
    const last10 = cleanPhone.slice(-10);
    const found = registeredUsers.find(
      (u) => u.phone.replace(/\D/g, '') === cleanPhone || u.phone.replace(/\D/g, '').endsWith(last10)
    );
    if (!found) {
      return { success: false, message: 'Yeh mobile number registered nahi hai. Kripya pehle Register karein.' };
    }
    if (!password || !password.trim()) {
      return { success: false, message: 'Kripya apna Password enter karein.' };
    }
    if (found.password && found.password !== password) {
      return { success: false, message: 'Galat Password! Kripya sahi password dalein.' };
    }
    const updatedUser: User = { ...found, lastLogin: new Date().toISOString().replace('T', ' ').substring(0, 19) };
    setUser(updatedUser);
    setIsLoggedIn(true);
    localStorage.setItem('akm_is_logged_in', JSON.stringify(true));
    localStorage.setItem('akm_user', JSON.stringify(updatedUser));
    const isTargetAdmin = updatedUser.isAdmin === true || updatedUser.role === 'admin' || cleanPhone.endsWith('6203369638') || cleanPhone.endsWith('8340279');
    if (!isTargetAdmin) {
      lockAdminSession();
    }
    return { success: true, message: `Welcome back, ${updatedUser.name || 'Investor'}! Login successful.` };
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
      const isTargetAdmin = updatedUser.isAdmin === true || updatedUser.role === 'admin' || cleanPhone.endsWith('6203369638') || cleanPhone.endsWith('8340279');
      if (!isTargetAdmin) {
        lockAdminSession();
      }
      return { success: true, message: 'OTP Login successful' };
    } else {
      return registerUser({
        phone: `+91 ${cleanPhone.slice(-10)}`,
        password: 'password123',
        tradePassword: '123456'
      });
    }
  };

  const quickMobileAuth = (phone: string, inviteCode?: string, name?: string): { success: boolean; message: string; isNewUser: boolean; user?: User } => {
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      return { success: false, message: 'Please enter a valid 10-digit mobile number.', isNewUser: false };
    }
    const last10 = cleanPhone.slice(-10);
    const existing = registeredUsers.find(
      (u) => u.phone.replace(/\D/g, '').endsWith(last10)
    );
    if (existing) {
      const updatedUser: User = {
        ...existing,
        name: existing.name || name?.trim() || existing.name,
        lastLogin: new Date().toISOString().replace('T', ' ').substring(0, 19)
      };
      setUser(updatedUser);
      setIsLoggedIn(true);
      try {
        localStorage.setItem('akm_is_logged_in', JSON.stringify(true));
        localStorage.setItem('akm_user', JSON.stringify(updatedUser));
      } catch {}
      const isTargetAdmin = updatedUser.isAdmin === true || updatedUser.role === 'admin' || last10.endsWith('6203369638') || last10.endsWith('8340279');
      if (!isTargetAdmin) {
        lockAdminSession();
      }
      return {
        success: true,
        message: `Welcome back, ${updatedUser.name || 'Investor'}! Logged in successfully.`,
        isNewUser: false,
        user: updatedUser
      };
    } else {
      // Instant automated registration with mobile number - regular user
      lockAdminSession();
      const existingIds = new Set(registeredUsers.map((u) => u.id));
      let newId = registeredUsers.reduce((max, u) => Math.max(max, u.id), 100) + 1;
      while (existingIds.has(newId)) newId++;

      const newUser: User = {
        id: newId,
        phone: `+91 ${last10}`,
        password: 'password123',
        tradePassword: '123456',
        name: name?.trim() || `User_${last10.slice(-4)}`,
        balance: 28.0,
        totalRecharge: 0,
        totalWithdraw: 0,
        totalRevenue: 28.0,
        memberLevel: 'Member',
        vipLevel: 0,
        inviteCode: Math.floor(10000 + Math.random() * 90000).toString(),
        invitedBy: inviteCode || 'AKM888',
        status: 'active',
        role: 'user',
        isAdmin: false,
        createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
        lastLogin: new Date().toISOString().replace('T', ' ').substring(0, 19)
      };

      const updatedList = deduplicateUsers([newUser, ...registeredUsers]);
      setRegisteredUsers(updatedList);
      setUser(newUser);
      setIsLoggedIn(true);
      try {
        localStorage.setItem('akm_is_logged_in', JSON.stringify(true));
        localStorage.setItem('akm_user', JSON.stringify(newUser));
        localStorage.setItem('akm_registered_users', JSON.stringify(updatedList));
      } catch {}

      // Welcome Bonus transaction
      const welcomeTx: Transaction = {
        id: generateUniqueId('tx-bonus'),
        userId: newId,
        type: 'referral_commission',
        title: 'AKM New Member Welcome Joining Bonus',
        method: 'Bonus Wallet Credit',
        orderId: `BONUS_${Date.now()}`,
        amount: 28.0,
        finalAmount: 28.0,
        status: 'success',
        createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
        adminRemark: 'System automated ₹28 registration reward'
      };
      // Add welcome bonus transaction to system transactions without clearing existing users' data
      setTransactions((prev) => sanitizeTransactions([welcomeTx, ...prev]));
      syncUserToFirestore(newUser).catch(() => {});
      syncTransactionToFirestore(welcomeTx).catch(() => {});

      return {
        success: true,
        message: 'Registration complete! ₹28 Welcome Bonus credited to wallet.',
        isNewUser: true,
        user: newUser
      };
    }
  };

  const registerUser = (data: { phone: string; name?: string; password?: string; tradePassword?: string; inviteCode?: string }) => {
    const cleanPhone = data.phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      return { success: false, message: 'Kripya 10-digit mobile number enter karein.' };
    }
    if (!data.password || data.password.length < 4) {
      return { success: false, message: 'Password kam se kam 4 aksharon ka hona chahiye.' };
    }
    const exists = registeredUsers.some(
      (u) => u.phone.replace(/\D/g, '').endsWith(cleanPhone.slice(-10))
    );
    if (exists) {
      return { success: false, message: 'Yeh mobile number pehle se registered hai. Kripya Login karein.' };
    }

    const existingIds = new Set(registeredUsers.map((u) => u.id));
    let newId = registeredUsers.reduce((max, u) => Math.max(max, u.id), 100) + 1;
    while (existingIds.has(newId)) newId++;

    const last10 = cleanPhone.slice(-10);
    const newUser: User = {
      id: newId,
      phone: `+91 ${last10}`,
      password: data.password || 'password123',
      tradePassword: data.tradePassword || '123456',
      name: data.name?.trim() || `Investor_${last10.slice(-4)}`,
      balance: 28.0,
      totalRecharge: 0,
      totalWithdraw: 0,
      totalRevenue: 28.0,
      memberLevel: 'Member',
      vipLevel: 0,
      inviteCode: Math.floor(10000 + Math.random() * 90000).toString(),
      invitedBy: data.inviteCode || 'AKM888',
      status: 'active',
      role: 'user',
      isAdmin: false,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      lastLogin: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };

    const updatedList = deduplicateUsers([newUser, ...registeredUsers]);
    setRegisteredUsers(updatedList);
    setUser(newUser);
    setIsLoggedIn(true);
    try {
      localStorage.setItem('akm_is_logged_in', JSON.stringify(true));
      localStorage.setItem('akm_user', JSON.stringify(newUser));
      localStorage.setItem('akm_registered_users', JSON.stringify(updatedList));
      lockAdminSession();
    } catch {}

    // Welcome Bonus transaction
    const welcomeTx: Transaction = {
      id: generateUniqueId('tx-bonus'),
      userId: newId,
      type: 'referral_commission',
      title: 'AKM New Member Welcome Joining Bonus',
      method: 'Bonus Wallet Credit',
      orderId: `BONUS_${Date.now()}`,
      amount: 28.0,
      finalAmount: 28.0,
      status: 'success',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      adminRemark: 'System automated ₹28 registration reward'
    };
    // Add welcome bonus transaction to global transactions without deleting existing records
    setTransactions((prev) => sanitizeTransactions([welcomeTx, ...prev]));
    syncUserToFirestore(newUser).catch(() => {});
    syncTransactionToFirestore(welcomeTx).catch(() => {});

    return { success: true, message: 'Account create ho gaya! ₹28 Welcome Bonus wallet me credit ho gaya.', user: newUser };
  };

  const logoutUser = () => {
    setIsLoggedIn(false);
    localStorage.setItem('akm_is_logged_in', JSON.stringify(false));
    lockAdminSession();
    setUser(INITIAL_USER);
    // CRITICAL: NEVER delete transactions, userPlans, checkIns, teamMembers, or registeredUsers!
    // All users' historical records and balances remain permanently safe and preserved in storage and Firestore.
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
      const isTargetAdmin = target.isAdmin === true || target.role === 'admin' || target.phone?.includes('6203369638') || target.phone?.includes('8340279');
      if (!isTargetAdmin) {
        lockAdminSession();
      }
      showToast(`Switched account to ${target.name || target.phone}`, 'success');
    }
  };

  const adminCreateUser = (userData: Partial<User>) => {
    const existingIds = new Set(registeredUsers.map((u) => u.id));
    let newId = registeredUsers.reduce((max, u) => Math.max(max, u.id), 100) + 1;
    while (existingIds.has(newId)) newId++;

    const phone = userData.phone || `+91 ${Math.floor(6000000000 + Math.random() * 3999999999)}`;
    const created: User = {
      id: newId,
      phone,
      password: userData.password || 'password123',
      tradePassword: userData.tradePassword || '123456',
      name: userData.name || `User ${newId}`,
      balance: userData.balance ?? 100,
      totalRecharge: userData.totalRecharge ?? 0,
      totalWithdraw: userData.totalWithdraw ?? 0,
      totalRevenue: userData.totalRevenue ?? 0,
      memberLevel: userData.memberLevel || 'Member',
      vipLevel: userData.vipLevel ?? 0,
      inviteCode: userData.inviteCode || Math.floor(10000 + Math.random() * 90000).toString(),
      status: userData.status || 'active',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      lastLogin: new Date().toISOString().replace('T', ' ').substring(0, 19),
      bankAccount: userData.bankAccount
    };
    const updated = deduplicateUsers([created, ...registeredUsers]);
    setRegisteredUsers(updated);
    localStorage.setItem('akm_registered_users', JSON.stringify(updated));
    syncUserToFirestore(created).catch(() => {});

    recordAuditLog({
      actionCategory: 'user_status',
      type: 'user',
      title: 'New User Account Enrolled',
      details: `Admin provisioned user #${created.id} (${created.phone}, Name: ${created.name}, Initial Balance: ₹${created.balance})`,
      targetUserId: created.id,
      targetUserPhone: created.phone,
      newValue: created.status,
      status: 'success'
    });

    showToast(`Created user ${created.name} (${created.phone})!`, 'success');
  };

  const adminUpdateUser = (userId: number, updates: Partial<User>) => {
    const oldUser = registeredUsers.find((u) => u.id === userId);
    let targetMerged: User | null = null;
    const updated = deduplicateUsers(registeredUsers.map((u) => {
      if (u.id === userId) {
        const merged = { ...u, ...updates };
        targetMerged = merged;
        if (user.id === userId) {
          setUser(merged);
        }
        return merged;
      }
      return u;
    }));
    setRegisteredUsers(updated);
    localStorage.setItem('akm_registered_users', JSON.stringify(updated));
    if (targetMerged) {
      syncUserToFirestore(targetMerged).catch(() => {});
    }

    const changedFields = Object.keys(updates);
    const isStatusChange = updates.status !== undefined && updates.status !== oldUser?.status;
    const isBalanceChange = updates.balance !== undefined && updates.balance !== oldUser?.balance;

    recordAuditLog({
      actionCategory: isBalanceChange ? 'balance_adjust' : isStatusChange ? 'user_status' : 'user_status',
      type: 'user',
      title: isStatusChange
        ? `User Status Changed to ${updates.status?.toUpperCase()}`
        : isBalanceChange
        ? `Manual Balance Adjustment for User #${userId}`
        : `User Profile Updated (${changedFields.join(', ')})`,
      details: `Admin modified User #${userId} (${oldUser?.phone || updates.phone || ''}). Attributes: [${changedFields.join(', ')}]`,
      targetUserId: userId,
      targetUserPhone: oldUser?.phone || updates.phone,
      oldValue: isBalanceChange ? oldUser?.balance : isStatusChange ? oldUser?.status : undefined,
      newValue: isBalanceChange ? updates.balance : isStatusChange ? updates.status : undefined,
      status: isStatusChange && updates.status === 'suspended' ? 'critical' : 'success'
    });

    showToast('User profile updated successfully!', 'success');
  };

  const adminDeleteUser = (userId: number) => {
    if (registeredUsers.length <= 1) {
      showToast('Cannot delete the last remaining user', 'error');
      return;
    }
    const target = registeredUsers.find((u) => u.id === userId);
    const updated = registeredUsers.filter((u) => u.id !== userId);
    setRegisteredUsers(updated);
    localStorage.setItem('akm_registered_users', JSON.stringify(updated));
    if (user.id === userId) {
      setUser(updated[0]);
    }

    recordAuditLog({
      actionCategory: 'user_status',
      type: 'user',
      title: 'User Account Permanently Deleted',
      details: `Admin deleted User #${userId} (${target?.phone || ''}, Name: ${target?.name || ''}) from the system`,
      targetUserId: userId,
      targetUserPhone: target?.phone,
      status: 'critical'
    });

    showToast('User removed from registry', 'info');
  };

  // Daily Check-In
  const claimDailyCheckIn = () => {
    if (!user.id || user.id <= 0) {
      openAuthModal('login');
      return { success: false, amount: 0, message: 'Kripya check-in ke liye pehle Login karein.' };
    }

    if (hasCheckedInToday) {
      return { success: false, amount: 0, message: 'Already Claimed Today' };
    }

    const lockKey = `checkin_${user.id}_${todayStr}`;
    if (!acquireLock(lockKey)) {
      return { success: false, amount: 0, message: 'Check-in request processing...' };
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
    syncTransactionToFirestore(newTx).catch(() => {});
    const newStreak = currentStreak + 1;
    const is7DayStreak = newStreak === 7 || (newStreak > 0 && newStreak % 7 === 0);

    triggerDailyCheckInConfetti(is7DayStreak);

    showToast(`Day ${nextStreakDay} Check-in Bonus +${formatINR(reward, { decimals: 0 })} Credited!`, 'success');
    return {
      success: true,
      amount: reward,
      message: `+${formatINR(reward, { decimals: 0 })} Added to balance!`,
      newStreak,
      is7DayStreak
    };
  };

  // Claim Streak Milestone
  const claimStreakMilestone = (days: number, reward: number) => {
    if (!user.id || user.id <= 0) {
      openAuthModal('login');
      return { success: false, amount: 0, message: 'Kripya login karein.' };
    }

    if (claimedStreakMilestones.includes(days)) {
      showToast('Milestone bonus already claimed!', 'info');
      return { success: false, amount: 0, message: 'Already claimed' };
    }

    const lockKey = `streak_${user.id}_${days}`;
    if (!acquireLock(lockKey)) {
      return { success: false, amount: 0, message: 'Processing streak claim...' };
    }

    const currentStreak = calculateStreak();
    if (currentStreak < days) {
      releaseLock(lockKey);
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
    syncTransactionToFirestore(newTx).catch(() => {});
    updateUserBalance(reward, `${days}-Day Streak Bonus`);

    confetti({
      particleCount: 110,
      spread: 75,
      origin: { y: 0.5 }
    });

    showToast(`+${formatINR(reward, { decimals: 0 })} ${days}-Day Streak Reward Claimed!`, 'success');
    return { success: true, amount: reward, message: 'Milestone claimed successfully!' };
  };

  // Spin Lucky Wheel (1x Daily)
  const spinLuckyWheel = async (forcedTargetIndex?: number): Promise<{
    success: boolean;
    amount: number;
    segmentIndex: number;
    message: string;
    isJackpot?: boolean;
  }> => {
    if (!user.id || user.id <= 0) {
      openAuthModal('login');
      return { success: false, amount: 0, segmentIndex: 0, message: 'Please log in to spin the wheel.' };
    }

    if (hasSpunToday) {
      showToast('You have already claimed today\'s Lucky Spin! Next spin tomorrow.', 'info');
      return { success: false, amount: 0, segmentIndex: 0, message: 'Already claimed today' };
    }

    const lockKey = `spin_${user.id}_${todayStr}`;
    if (!acquireLock(lockKey)) {
      return { success: false, amount: 0, segmentIndex: 0, message: 'Spin already in progress...' };
    }

    // Determine target segment based on weights
    let targetIndex = 0;
    if (typeof forcedTargetIndex === 'number' && forcedTargetIndex >= 0 && forcedTargetIndex < LUCKY_SPIN_SEGMENTS.length) {
      targetIndex = forcedTargetIndex;
    } else {
      const totalWeight = LUCKY_SPIN_SEGMENTS.reduce((sum, s) => sum + s.probability, 0);
      let rand = Math.random() * totalWeight;
      for (let i = 0; i < LUCKY_SPIN_SEGMENTS.length; i++) {
        if (rand < LUCKY_SPIN_SEGMENTS[i].probability) {
          targetIndex = i;
          break;
        }
        rand -= LUCKY_SPIN_SEGMENTS[i].probability;
      }
    }

    const winningSegment = LUCKY_SPIN_SEGMENTS[targetIndex];
    const reward = winningSegment.amount;

    const now = new Date();
    const formatted = `${String(now.getDate()).padStart(2, '0')} ${now.toLocaleString('en-US', { month: 'short' })} ${now.getFullYear()} - ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}`;

    const newRecord: LuckySpinRecord = {
      id: generateUniqueId('spin'),
      userId: user.id,
      dateStr: todayStr,
      timestamp: formatted,
      amount: reward,
      segmentLabel: winningSegment.label
    };

    const newTx: Transaction = {
      id: generateUniqueId('tx-spin'),
      userId: user.id,
      type: 'lucky_spin',
      title: `Daily Lucky Spin Reward (${winningSegment.label})`,
      method: 'Lucky Spin Wheel',
      orderId: generateUniqueId('ORD-SPIN'),
      amount: reward,
      finalAmount: reward,
      status: 'success',
      createdAt: formatted
    };

    setLuckySpinRecords((prev) => [newRecord, ...prev]);
    setTransactions((prev) => sanitizeTransactions([newTx, ...prev]));
    syncTransactionToFirestore(newTx).catch(() => {});
    updateUserBalance(reward, `Lucky Spin ${winningSegment.label}`);

    setUser((prev) => ({
      ...prev,
      lastSpinDate: todayStr,
      totalRevenue: Math.round((prev.totalRevenue + reward) * 100) / 100
    }));

    return {
      success: true,
      amount: reward,
      segmentIndex: targetIndex,
      message: `Congratulations! Won ${winningSegment.label}`,
      isJackpot: winningSegment.isJackpot
    };
  };

  // Claim Team Milestone Quest
  const claimTeamMilestone = (questId: string, requiredActive: number, reward: number) => {
    if (!user.id || user.id <= 0) {
      openAuthModal('login');
      return { success: false, message: 'Kripya login karein.' };
    }

    if (claimedTeamMilestones.includes(questId)) {
      showToast('Team quest reward already claimed!', 'info');
      return { success: false, message: 'Already claimed' };
    }

    const lockKey = `team_${user.id}_${questId}`;
    if (!acquireLock(lockKey)) {
      return { success: false, message: 'Processing team quest...' };
    }

    const activeCount = teamMembers.filter((m) => m.sponsorId === user.id && m.rechargeAmount > 0).length;
    if (activeCount < requiredActive) {
      releaseLock(lockKey);
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
    syncTransactionToFirestore(newTx).catch(() => {});
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
    if (!user.id || user.id <= 0) {
      openAuthModal('login');
      return {
        success: false,
        message: 'Kripya plan purchase karne ke liye pehle Login karein.'
      };
    }

    const lockKey = `buy_${user.id}`;
    if (!acquireLock(lockKey, 3000)) {
      return {
        success: false,
        message: 'A purchase transaction is already in progress. Please wait.'
      };
    }

    // 1. Strict Deposit Enforcement: Bina deposit ke koi plan purchase nahi kar sake
    const userSuccessfulRechargeCount = transactions.filter(
      (t) => t.userId === user.id && t.type === 'recharge' && t.status === 'success'
    ).length;
    const hasDeposited = (user.totalRecharge || 0) > 0 || userSuccessfulRechargeCount > 0;

    if (!hasDeposited) {
      releaseLock(lockKey);
      return {
        success: false,
        message: 'Bina deposit ke koi plan purchase nahi kar sakte. Kripya pehle recharge/deposit karein.'
      };
    }

    if (user.balance < plan.depositAmount) {
      releaseLock(lockKey);
      return {
        success: false,
        message: `Insufficient balance (₹${user.balance.toFixed(0)} available). Please recharge to purchase.`
      };
    }

    // Check user plan limit (count active investments only, allow repurchase after completion)
    const activeCount = userPlans.filter((up) => up.userId === user.id && String(up.planId) === String(plan.id) && up.status === 'active').length;
    if (plan.limit && activeCount >= plan.limit) {
      releaseLock(lockKey);
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
        syncUserPlanToFirestore(newUserPlan).catch(() => {});
        syncTransactionToFirestore(newTx).catch(() => {});
        setDoc(doc(db, 'users', String(user.id)), {
          balance: Math.max(0, Math.round((user.balance - plan.depositAmount) * 100) / 100),
          updatedAt: nowStr
        }, { merge: true }).catch(() => {});
      }
    } catch {
      // offline fallback
    }

    showToast(`Successfully purchased ${plan.title}!`, 'success');
    triggerInvestmentPurchaseConfetti();
    return { success: true, message: 'Plan activated successfully!', userPlan: newUserPlan };
  };

  // Claim Plan Profit manually
  const claimPlanProfit = (userPlanId: string) => {
    if (!user.id || user.id <= 0) {
      openAuthModal('login');
      return { success: false, amount: 0 };
    }

    const lockKey = `profit_${user.id}_${userPlanId}`;
    if (!acquireLock(lockKey)) {
      return { success: false, amount: 0 };
    }

    const up = userPlans.find((p) => p.id === userPlanId && p.userId === user.id);
    if (!up || up.status !== 'active') {
      releaseLock(lockKey);
      return { success: false, amount: 0 };
    }

    if (up.durationMinutes) {
      if (up.nextClaimTime && Date.now() < up.nextClaimTime) {
        releaseLock(lockKey);
        const remainingSec = Math.ceil((up.nextClaimTime - Date.now()) / 1000);
        const m = Math.floor(remainingSec / 60);
        const s = remainingSec % 60;
        showToast(`Plan in progress! ${m > 0 ? `${m}m ` : ''}${s}s remaining.`, 'info');
        return { success: false, amount: 0 };
      }
    } else {
      if (up.lastClaimDate === todayStr) {
        releaseLock(lockKey);
        showToast("Today's profit has already been credited!", 'info');
        return { success: false, amount: 0 };
      }
    }

    const profit = up.durationMinutes ? up.totalReturn || up.dailyIncome : up.dailyIncome;
    const nextDaysClaimed = up.daysClaimed + 1;
    const isCompleted = up.durationMinutes ? true : nextDaysClaimed >= up.returnDays;

    const updatedPlan: UserPlan = {
      ...up,
      daysClaimed: up.durationMinutes ? up.returnDays : nextDaysClaimed,
      lastClaimDate: todayStr,
      status: isCompleted ? 'completed' : 'active'
    };

    setUserPlans((prev) =>
      prev.map((p) => (p.id === userPlanId ? updatedPlan : p))
    );
    syncUserPlanToFirestore(updatedPlan).catch(() => {});

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
    syncTransactionToFirestore(newTx).catch(() => {});
    updateUserBalance(profit, `${up.durationMinutes ? 'Turbo return' : 'Daily profit'} for ${up.title}`);

    confetti({
      particleCount: 50,
      spread: 50,
      origin: { y: 0.6 }
    });

    sendLocalNotification({
      userId: user.id,
      type: 'interest_credit',
      title: up.durationMinutes ? '⚡ Turbo Return Credited!' : 'Daily Interest Credited! 💰',
      body: `+${formatINR(profit)} ${up.durationMinutes ? 'turbo profit' : 'daily earnings'} from "${up.title}" has been credited to your balance.`,
      amount: profit,
      status: 'success',
      linkView: 'myproducts',
      planId: up.planId
    });

    return { success: true, amount: profit };
  };

  // Claim all active plans profit at once
  const claimAllPlanProfits = () => {
    if (!user.id || user.id <= 0) {
      openAuthModal('login');
      return { count: 0, total: 0 };
    }

    const lockKey = `profit_all_${user.id}`;
    if (!acquireLock(lockKey, 3000)) {
      return { count: 0, total: 0 };
    }

    const claimable = userPlans.filter((p) => {
      if (p.userId !== user.id || p.status !== 'active') return false;
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
        up.userId === user.id &&
        up.status === 'active' &&
        (up.durationMinutes
          ? (up.nextClaimTime ? Date.now() >= up.nextClaimTime : true)
          : up.lastClaimDate !== todayStr);

      if (isEligible) {
        const profit = up.durationMinutes ? up.totalReturn || up.dailyIncome : up.dailyIncome;
        const nextDaysClaimed = up.daysClaimed + 1;
        const isCompleted = up.durationMinutes ? true : nextDaysClaimed >= up.returnDays;
        totalAmount += profit;

        const newTx: Transaction = {
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
        };
        newTxs.push(newTx);
        syncTransactionToFirestore(newTx).catch(() => {});

        const updatedUp: UserPlan = {
          ...up,
          daysClaimed: up.durationMinutes ? up.returnDays : nextDaysClaimed,
          lastClaimDate: todayStr,
          status: isCompleted ? ('completed' as const) : ('active' as const)
        };
        syncUserPlanToFirestore(updatedUp).catch(() => {});

        return updatedUp;
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

    sendLocalNotification({
      userId: user.id,
      type: 'interest_credit',
      title: 'Batch Profits Credited! 💰',
      body: `+${formatINR(totalAmount)} accumulated daily interest from ${claimable.length} investment plans credited to your balance.`,
      amount: totalAmount,
      status: 'success',
      linkView: 'myproducts'
    });

    return { count: claimable.length, total: totalAmount };
  };

  // Return / refund a plan cycle early (Refund system removed per user instruction)
  const returnPlanCycle = (_userPlanId: string) => {
    showToast('Plan refunds are disabled.', 'info');
    return { success: false, message: 'Refund system is disabled.' };
  };

  // Automated Turbo Settlement background worker
  useEffect(() => {
    if (!adminSettings.turboAutoSettlement) return;

    const checkInterval = setInterval(() => {
      const now = Date.now();
      const matureTurboPlan = userPlans.find(
        (up) =>
          up.userId === user.id &&
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
  }, [adminSettings.turboAutoSettlement, userPlans, user.id]);

  // --------------------------------------------------------------------------
  // 30-Second Wallet Balance Polling & Real-Time Daily Income Accrual Engine
  // Periodically polls the user's wallet balance every 30 seconds and compounds
  // live daily returns from active investment plans in real time.
  // --------------------------------------------------------------------------
  const [isBalanceRefreshing, setIsBalanceRefreshing] = useState<boolean>(false);
  const [lastBalanceRefreshedAt, setLastBalanceRefreshedAt] = useState<Date | null>(null);
  const fractionalAccrualRef = useRef<number>(0);
  const isRefreshingInProgressRef = useRef<boolean>(false);

  const refreshUserBalance = useCallback(async (isPolling: boolean = false) => {
    if (!user.id || user.id <= 0 || isRefreshingInProgressRef.current) return;

    isRefreshingInProgressRef.current = true;
    setIsBalanceRefreshing(true);

    try {
      // 1. Authoritative Firestore check: sync any remote balance changes (approvals, admin edits)
      if (db) {
        const userDocRef = doc(db, 'users', String(user.id));
        const snap = await getDoc(userDocRef);
        if (snap.exists()) {
          const remoteData = snap.data() as Partial<User>;
          if (typeof remoteData.balance === 'number' && remoteData.balance !== user.balance) {
            isRemoteUserSyncRef.current = true;
            setUser((prev) => ({
              ...prev,
              balance: remoteData.balance!,
              totalRecharge: typeof remoteData.totalRecharge === 'number' ? remoteData.totalRecharge : prev.totalRecharge,
              totalWithdraw: typeof remoteData.totalWithdraw === 'number' ? remoteData.totalWithdraw : prev.totalWithdraw,
              totalRevenue: typeof remoteData.totalRevenue === 'number' ? remoteData.totalRevenue : prev.totalRevenue,
            }));
          }
        }
      }

      // 2. Real-time Daily Income Accrual Calculation (Continuous 30-second compound)
      // Active plans generate daily income continuously over 24 hours (86,400s / 30s = 2,880 increments/day)
      const activePlans = userPlans.filter((up) => up.userId === user.id && up.status === 'active');
      const standardActivePlans = activePlans.filter((up) => !up.durationMinutes);
      const totalDailyRate = standardActivePlans.reduce((sum, p) => sum + p.dailyIncome, 0);

      if (totalDailyRate > 0) {
        // Increment accrued in 30 seconds: dailyRate / 2880
        const intervalYield = totalDailyRate / 2880;
        fractionalAccrualRef.current += intervalYield;

        // When fractional accrual accumulates to at least 1 paisa (₹0.01), credit to wallet
        if (fractionalAccrualRef.current >= 0.01) {
          const creditAmount = Math.floor(fractionalAccrualRef.current * 100) / 100;
          fractionalAccrualRef.current = Math.max(0, Math.round((fractionalAccrualRef.current - creditAmount) * 1000) / 1000);

          setUser((prev) => {
            const newBal = Math.round((prev.balance + creditAmount) * 100) / 100;
            const newRev = Math.round((prev.totalRevenue + creditAmount) * 100) / 100;

            // Sync updated balance to Firestore in background
            if (db) {
              setDoc(doc(db, 'users', String(prev.id)), {
                balance: newBal,
                totalRevenue: newRev,
                updatedAt: new Date().toISOString()
              }, { merge: true }).catch(() => {});
            }

            return {
              ...prev,
              balance: newBal,
              totalRevenue: newRev
            };
          });
        }
      }

      // 3. Automated Turbo Plan check (1-minute or flash plans that have matured)
      const now = Date.now();
      const matureTurboPlan = activePlans.find(
        (up) =>
          Boolean(up.durationMinutes) &&
          Boolean(up.nextClaimTime) &&
          now >= (up.nextClaimTime || 0)
      );
      if (matureTurboPlan) {
        claimPlanProfit(matureTurboPlan.id);
      }

      setLastBalanceRefreshedAt(new Date());

      if (!isPolling) {
        showToast('Wallet balance refreshed with live earnings!', 'success');
      }
    } catch (err) {
      console.warn('[Wallet Polling] Refresh error:', err);
      if (!isPolling) {
        showToast('Could not refresh balance at this moment', 'error');
      }
    } finally {
      setIsBalanceRefreshing(false);
      isRefreshingInProgressRef.current = false;
    }
  }, [user.id, user.balance, userPlans, claimPlanProfit, showToast]);

  const refreshAppData = useCallback(async (): Promise<void> => {
    try {
      await refreshUserBalance(false);
      sfx.playTap();
    } catch (e) {
      console.warn('Error during app refresh:', e);
    }
  }, [refreshUserBalance]);

  // Periodic polling interval: executes every 30 seconds
  useEffect(() => {
    if (!user.id || user.id <= 0) return;

    // Small delay on mount before first background poll
    const initialTimer = setTimeout(() => {
      refreshUserBalance(true);
    }, 2500);

    // Exact 30-second recurring polling interval
    const pollInterval = setInterval(() => {
      refreshUserBalance(true);
    }, 30000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(pollInterval);
    };
  }, [user.id, refreshUserBalance]);

  // Initiate Recharge
  const initiateRecharge = (amount: number, channel: string, openModal: boolean = false, customOrderId?: string) => {
    if (!user.id || user.id <= 0) {
      showToast('Kripya recharge karne ke liye pehle Login karein.', 'info');
      openAuthModal('login');
      return { orderId: '' };
    }

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
    syncTransactionToFirestore(newTx).catch(() => {});

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
    const directUpiUrl = `upi://pay?pa=${encodeURIComponent(targetUpiId)}&pn=${encodeURIComponent('AKM ENTERPRISES')}&am=${amount}&cu=INR&tn=${encodeURIComponent(orderId)}`;

    setActivePayment({
      orderId,
      amount,
      channel,
      payUrl: payUrl || null,
      directUpiUrl,
      createdAt: Date.now()
    });

    sfx.playGatewayLaunch();

    if (adminSettings.paymentOpenMode === 'external' && payUrl && (payUrl.startsWith('http://') || payUrl.startsWith('https://'))) {
      try {
        const opened = window.open(payUrl, '_blank');
        if (!opened) {
          // If popup is blocked by browser, fallback to in-app payment cashier
          setCurrentView('payment');
        } else {
          showToast(`Opening payment link in browser for ₹${amount}...`, 'info');
        }
      } catch {
        setCurrentView('payment');
      }
    } else {
      setCurrentView('payment');
    }
  };

  // Submit UTR for Admin / Bank Statement Verification (Does NOT credit balance until verified)
  const submitDepositUtr = (orderId: string, utr: string): boolean => {
    const cleanUtr = (utr || '').trim().replace(/\D/g, '');
    if (!cleanUtr || cleanUtr.length < 10) {
      showToast('Please enter a valid 10-12 digit UPI UTR / Ref number', 'error');
      return false;
    }

    // Check duplicate UTR against already approved transactions
    const duplicateTx = transactions.find(
      (t) => t.utrNumber === cleanUtr && t.orderId !== orderId && t.status === 'success'
    );
    if (duplicateTx) {
      showToast('This UTR has already been processed on another transaction.', 'error');
      return false;
    }

    let tx = transactions.find((t) => t.orderId === orderId);
    const orderAmt = tx ? tx.amount : (activePayment && activePayment.orderId === orderId ? activePayment.amount : 0);

    const now = new Date();
    const formatted = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()} - ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}`;

    if (!tx) {
      const newTx: Transaction = {
        id: generateUniqueId('tx-dep'),
        userId: user.id,
        type: 'recharge',
        title: `Recharge - ${activePayment?.channel || 'Direct UPI'}`,
        method: activePayment?.channel || 'Direct UPI',
        orderId: orderId,
        amount: orderAmt,
        finalAmount: orderAmt,
        status: 'pending',
        utrNumber: cleanUtr,
        adminRemark: 'UTR Submitted - Awaiting Admin Approval',
        createdAt: formatted
      };
      setTransactions((prev) => sanitizeTransactions([newTx, ...prev]));
      syncTransactionToFirestore(newTx).catch(() => {});
    } else {
      const updatedTx: Transaction = {
        ...tx,
        status: 'pending',
        utrNumber: cleanUtr,
        adminRemark: 'UTR Submitted - Awaiting Admin Approval'
      };
      setTransactions((prev) =>
        prev.map((t) => (t.orderId === orderId ? updatedTx : t))
      );
      syncTransactionToFirestore(updatedTx).catch(() => {});
    }

    // Call server to record UTR without auto-crediting
    fetch('/api/payin/submit-utr', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, utr: cleanUtr })
    }).catch(() => {});

    addAuditLog('deposit', 'Deposit UTR Submitted', `User submitted UTR ${cleanUtr} for Order ${orderId} (₹${orderAmt}). Pending Admin verification.`, orderAmt, 'info');

    sfx.playSuccess();
    showToast(`UTR ${cleanUtr} submitted! Payment is pending Admin verification.`, 'success');
    return true;
  };

  // Automated Instant Deposit Confirmation - 100% automatic without manual verification delays
  const confirmDepositPayment = (orderId: string, utr?: string) => {
    let tx = transactions.find((t) => t.orderId === orderId);
    if (tx && tx.status === 'success') {
      return; // Already credited
    }

    const orderAmt = tx ? tx.amount : (activePayment && activePayment.orderId === orderId ? activePayment.amount : 500);
    const autoUtr = (utr && utr.length >= 10) ? utr.trim() : `UPI${Date.now()}${Math.floor(1000 + Math.random() * 9000)}`;

    // Bonus reward calculation
    const calcBonus = (val: number) => {
      if (val >= 5000) return Math.floor(val * 0.08);
      if (val >= 1000) return Math.floor(val * 0.05);
      if (val >= 500) return Math.floor(val * 0.03);
      return 0;
    };
    const bonus = calcBonus(orderAmt);
    const netCredit = orderAmt + bonus;

    const now = new Date();
    const formatted = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()} - ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}`;

    if (!tx) {
      const newTx: Transaction = {
        id: generateUniqueId('tx-dep'),
        userId: user.id,
        type: 'recharge',
        title: `Recharge - ${activePayment?.channel || 'Instant UPI Gateway'}`,
        method: activePayment?.channel || 'Instant UPI Gateway',
        orderId: orderId,
        amount: orderAmt,
        finalAmount: orderAmt,
        status: 'success',
        utrNumber: autoUtr,
        adminRemark: 'Automated Gateway Instant Credit',
        createdAt: formatted
      };
      setTransactions((prev) => sanitizeTransactions([newTx, ...prev]));
    } else {
      setTransactions((prev) =>
        prev.map((t) =>
          t.orderId === orderId
            ? {
                ...t,
                status: 'success',
                utrNumber: autoUtr,
                adminRemark: 'Automated Gateway Instant Credit'
              }
            : t
        )
      );
    }

    // Credit active user balance immediately
    updateUserBalance(netCredit, `Instant Recharge of ₹${orderAmt}${bonus > 0 ? ` + ₹${bonus} bonus` : ''}`);
    setUser((prev) => {
      const updated = {
        ...prev,
        totalRecharge: Math.round((prev.totalRecharge + orderAmt) * 100) / 100
      };
      localStorage.setItem('akm_user', JSON.stringify(updated));
      return updated;
    });

    // Notify server of automated confirmation
    fetch('/api/payin/confirm-auto', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, utr: autoUtr })
    }).catch(() => {});

    addAuditLog(
      'deposit',
      'Automatic Deposit Credited',
      `Order ${orderId} (₹${orderAmt}) verified automatically via Gateway. Credited ₹${netCredit} to User #${user.id}.`,
      orderAmt,
      'success'
    );

    sfx.playSuccess();
    showToast(`Deposit of ₹${orderAmt} received & credited to your wallet instantly!`, 'success');
  };

  // Global Return-from-gateway URL Detector (Instant automatic credit on return)
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.location) {
        const urlParams = new URLSearchParams(window.location.search);
        const returnOrderId = urlParams.get('order_id');
        const isSuccess = urlParams.get('payment_success');
        if (returnOrderId && isSuccess === 'true') {
          try {
            window.history.replaceState({}, document.title, window.location.pathname);
          } catch {}
          confirmDepositPayment(returnOrderId);
        }
      }
    } catch {}
  }, []);

  // Request Withdrawal (Supports Bank IMPS / NEFT and Instant UPI)
  const requestWithdrawal = (amount: number, payoutMethod: 'bank' | 'upi' = 'bank', customAccount?: string) => {
    if (!user.id || user.id <= 0) {
      showToast('Kripya withdrawal ke liye pehle Login karein.', 'info');
      openAuthModal('login');
      return {
        success: false,
        message: 'Kripya withdrawal ke liye pehle Login karein.'
      };
    }

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

    const lockKey = `withdraw_${user.id}`;
    if (!acquireLock(lockKey, 3000)) {
      return {
        success: false,
        message: 'A withdrawal request is already processing. Please wait.'
      };
    }

    if (amount < adminSettings.minWithdraw) {
      releaseLock(lockKey);
      return {
        success: false,
        message: `Minimum withdrawal is ${formatINR(adminSettings.minWithdraw, { decimals: 0 })}.`
      };
    }

    if (amount > adminSettings.maxWithdraw) {
      releaseLock(lockKey);
      return {
        success: false,
        message: `Maximum withdrawal per transaction is ${formatINR(adminSettings.maxWithdraw, { decimals: 0 })}.`
      };
    }

    if (user.balance < amount) {
      releaseLock(lockKey);
      return {
        success: false,
        message: 'Insufficient balance for withdrawal.'
      };
    }

    // Deduct user balance and track totalWithdraw
    setUser((prev) => {
      const updatedTotalWithdraw = Math.round(((prev.totalWithdraw ?? 0) + amount) * 100) / 100;
      const updated = {
        ...prev,
        balance: Math.max(0, Math.round((prev.balance - amount) * 100) / 100),
        totalWithdraw: updatedTotalWithdraw
      };
      saveUserToStorage(updated);
      return updated;
    });

    setRegisteredUsers((prev) => {
      const updated = prev.map((u) => {
        if (u.id === user.id) {
          const updatedTotalWithdraw = Math.round(((u.totalWithdraw ?? 0) + amount) * 100) / 100;
          return {
            ...u,
            balance: Math.max(0, Math.round((u.balance - amount) * 100) / 100),
            totalWithdraw: updatedTotalWithdraw
          };
        }
        return u;
      });
      localStorage.setItem('akm_registered_users', JSON.stringify(updated));
      return updated;
    });

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
    syncTransactionToFirestore(newTx).catch(() => {});
    
    sendLocalNotification({
      userId: user.id,
      type: 'withdrawal_status',
      title: 'Withdrawal Request Submitted ⏳',
      body: `Payout request for ${formatINR(finalAmount)} (Order ${newTx.orderId}) is under audit. You will receive an alert once transferred.`,
      amount: finalAmount,
      status: 'pending',
      linkView: 'transactions',
      txId: newTx.id
    });

    triggerCelebrationConfetti('withdrawal');
    return { success: true, message: 'Withdrawal request submitted successfully.' };
  };

  // User Cancel Pending Withdrawal
  const cancelWithdrawal = (txId: string) => {
    const tx = transactions.find((t) => t.id === txId && t.userId === user.id && t.type === 'withdraw' && t.status === 'pending');
    if (!tx) {
      return { success: false, message: 'Withdrawal not found or already processed.' };
    }

    // Refund funds back to user balance immediately and revert totalWithdraw
    setUser((prev) => {
      const updatedTotalWithdraw = Math.max(0, Math.round(((prev.totalWithdraw ?? 0) - tx.amount) * 100) / 100);
      const updated = {
        ...prev,
        balance: Math.round((prev.balance + tx.amount) * 100) / 100,
        totalWithdraw: updatedTotalWithdraw
      };
      saveUserToStorage(updated);
      return updated;
    });

    setRegisteredUsers((prev) => {
      const updated = prev.map((u) => {
        if (u.id === user.id) {
          const updatedTotalWithdraw = Math.max(0, Math.round(((u.totalWithdraw ?? 0) - tx.amount) * 100) / 100);
          return {
            ...u,
            balance: Math.round((u.balance + tx.amount) * 100) / 100,
            totalWithdraw: updatedTotalWithdraw
          };
        }
        return u;
      });
      localStorage.setItem('akm_registered_users', JSON.stringify(updated));
      return updated;
    });

    const updatedTx: Transaction = {
      ...tx,
      status: 'failed',
      adminRemark: 'Cancelled by User - Funds Restored'
    };

    setTransactions((prev) =>
      prev.map((t) => (t.id === txId ? updatedTx : t))
    );
    syncTransactionToFirestore(updatedTx).catch(() => {});
    remoteUpdateUserBalance(user.id, tx.amount, 0, -tx.amount).catch(() => {});

    sendLocalNotification({
      userId: user.id,
      type: 'withdrawal_status',
      title: 'Withdrawal Cancelled & Refunded 🔄',
      body: `Withdrawal of ${formatINR(tx.amount)} (${tx.orderId || tx.id}) was cancelled. Balance restored to your wallet.`,
      amount: tx.amount,
      status: 'info',
      linkView: 'transactions',
      txId: tx.id
    });

    return { success: true, message: 'Withdrawal cancelled and refunded.' };
  };

  // Admin Controls
  const updateAdminSettings = (newSettings: Partial<AdminSettings>) => {
    if (newSettings.activeThemeId) {
      applyTheme(newSettings.activeThemeId);
    }
    const modifiedKeys = Object.keys(newSettings).join(', ');
    setAdminSettings((prev) => ({ ...prev, ...newSettings }));
    recordAuditLog({
      actionCategory: 'settings_update',
      type: 'config',
      title: 'Platform Settings Modified',
      details: `Admin modified configuration parameters: [${modifiedKeys}]. Changes synced to platform runtime.`,
      status: newSettings.maintenanceMode || newSettings.freezeDeposits || newSettings.freezeWithdrawals ? 'warning' : 'info'
    });
    showToast('Admin settings updated!', 'success');
  };

  const approveDeposit = (txId: string) => {
    const tx = transactions.find((t) => t.id === txId);
    if (!tx || tx.status === 'success') return;

    const creditAmount = tx.amount;
    const targetUserId = tx.userId;

    // Bonus reward calculation
    const calcBonus = (val: number) => {
      if (val >= 5000) return Math.floor(val * 0.08);
      if (val >= 1000) return Math.floor(val * 0.05);
      if (val >= 500) return Math.floor(val * 0.03);
      return 0;
    };
    const bonus = calcBonus(creditAmount);
    const netCredit = creditAmount + bonus;

    // Credit active user if this transaction belongs to them
    if (user.id === targetUserId) {
      updateUserBalance(netCredit, `Recharge of ₹${creditAmount}${bonus > 0 ? ` + bonus ₹${bonus}` : ''}`);
      setUser((prev) => {
        const updated = {
          ...prev,
          totalRecharge: Math.round((prev.totalRecharge + creditAmount) * 100) / 100
        };
        localStorage.setItem('akm_user', JSON.stringify(updated));
        return updated;
      });
    }

    // Also update registered user list
    setRegisteredUsers((prev) => {
      const updated = prev.map((u) => {
        if (u.id === targetUserId) {
          return {
            ...u,
            balance: Math.round((u.balance + netCredit) * 100) / 100,
            totalRecharge: Math.round((u.totalRecharge + creditAmount) * 100) / 100
          };
        }
        return u;
      });
      localStorage.setItem('akm_registered_users', JSON.stringify(updated));
      return updated;
    });

    const updatedTx: Transaction = {
      ...tx,
      status: 'success',
      adminRemark: `Approved & Credited by Admin${bonus > 0 ? ` (+₹${bonus} Bonus)` : ''}`
    };

    setTransactions((prev) =>
      prev.map((t) => (t.id === txId ? updatedTx : t))
    );

    // Multi-device real-time sync via Firestore
    syncTransactionToFirestore(updatedTx).catch(() => {});
    remoteUpdateUserBalance(targetUserId, netCredit, creditAmount, 0).catch(() => {});

    // Multi-tier commission calculation for upline
    const l1Amt = Math.round((creditAmount * adminSettings.commissionLevel1) / 100);
    setTeamMembers((prev) =>
      prev.map((m) =>
        m.level === 1
          ? {
              ...m,
              rechargeAmount: m.rechargeAmount + creditAmount,
              commissionEarned: m.commissionEarned + l1Amt
            }
          : m
      )
    );

    addAuditLog('deposit', 'Deposit Approved & Credited', `Admin approved recharge for Order ${tx.orderId} (₹${creditAmount})`, creditAmount, 'success');
    showToast(`Approved deposit of ${formatINR(creditAmount, { decimals: 0 })}! Balance credited.`, 'success');
  };

  const adminCreditDeposit = (targetUserId: number, amount: number, channel: string = 'Manual Admin Credit', utr?: string, remark?: string) => {
    const cleanUtr = utr?.trim() || `ADM${Date.now().toString().slice(-8)}`;
    const now = new Date();
    const formatted = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()} - ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}`;

    const calcBonus = (val: number) => {
      if (val >= 5000) return Math.floor(val * 0.08);
      if (val >= 1000) return Math.floor(val * 0.05);
      if (val >= 500) return Math.floor(val * 0.03);
      return 0;
    };
    const bonus = calcBonus(amount);
    const netCredit = amount + bonus;

    const newTx: Transaction = {
      id: generateUniqueId('tx-dep-manual'),
      userId: targetUserId,
      type: 'recharge',
      title: `Recharge - ${channel}`,
      method: channel,
      orderId: `MAN${Date.now()}`,
      amount: amount,
      finalAmount: amount,
      status: 'success',
      utrNumber: cleanUtr,
      adminRemark: remark || `Manual deposit credited by Admin${bonus > 0 ? ` (+₹${bonus} Bonus)` : ''}`,
      createdAt: formatted
    };

    setTransactions((prev) => sanitizeTransactions([newTx, ...prev]));
    syncTransactionToFirestore(newTx).catch(() => {});

    if (user.id === targetUserId) {
      updateUserBalance(netCredit, `Manual Recharge of ₹${amount}${bonus > 0 ? ` + bonus ₹${bonus}` : ''}`);
      setUser((prev) => {
        const updated = {
          ...prev,
          totalRecharge: Math.round((prev.totalRecharge + amount) * 100) / 100
        };
        localStorage.setItem('akm_user', JSON.stringify(updated));
        return updated;
      });
    }

    setRegisteredUsers((prev) => {
      const updated = prev.map((u) => {
        if (u.id === targetUserId) {
          return {
            ...u,
            balance: Math.round((u.balance + netCredit) * 100) / 100,
            totalRecharge: Math.round((u.totalRecharge + amount) * 100) / 100
          };
        }
        return u;
      });
      localStorage.setItem('akm_registered_users', JSON.stringify(updated));
      return updated;
    });

    remoteUpdateUserBalance(targetUserId, netCredit, amount, 0).catch(() => {});

    addAuditLog(
      'deposit',
      'Manual Deposit Credited',
      `Credited ₹${netCredit} to User #${targetUserId} via ${channel} (UTR: ${cleanUtr})`,
      amount,
      'success'
    );
  };

  const rejectDeposit = (txId: string, reason?: string) => {
    const tx = transactions.find((t) => t.id === txId);
    if (!tx) return;
    const updatedTx: Transaction = {
      ...tx,
      status: 'failed',
      adminRemark: reason || 'Rejected by Admin'
    };
    setTransactions((prev) =>
      prev.map((t) => (t.id === txId ? updatedTx : t))
    );
    syncTransactionToFirestore(updatedTx).catch(() => {});
    addAuditLog('deposit', 'Deposit Rejected', `Rejected recharge for ${tx.orderId || txId}: ${reason || 'Admin rejection'}`, tx.amount, 'warning');
    showToast('Deposit rejected', 'info');
  };

  const approveWithdrawal = (txId: string, utr?: string) => {
    const tx = transactions.find((t) => t.id === txId);
    if (!tx || tx.status === 'success') return;

    const updatedTx: Transaction = {
      ...tx,
      status: 'success',
      utr: utr || tx.utr || `IMPS${Date.now().toString().slice(-10)}`,
      utrNumber: utr || tx.utrNumber || `IMPS${Date.now().toString().slice(-10)}`,
      adminRemark: `Approved and Transferred by Admin${utr ? ` (RRN: ${utr})` : ''}`
    };
    setTransactions((prev) =>
      prev.map((t) => (t.id === txId ? updatedTx : t))
    );
    syncTransactionToFirestore(updatedTx).catch(() => {});
    addAuditLog('withdrawal', 'Withdrawal Approved', `Approved payout for Order ${tx.orderId}${utr ? ` (RRN: ${utr})` : ''}`, tx.amount, 'success');
    
    sendLocalNotification({
      userId: tx.userId,
      type: 'withdrawal_status',
      title: 'Withdrawal Approved & Disbursed! 🎉',
      body: `Your payout of ${formatINR(tx.finalAmount || tx.amount)} (Order ${tx.orderId || tx.id}) has been approved and transferred to your bank!${utr ? ` IMPS RRN: ${utr}` : ''}`,
      amount: tx.finalAmount || tx.amount,
      status: 'success',
      linkView: 'transactions',
      txId: tx.id,
      utrNumber: utr
    });
  };

  const rejectWithdrawal = (txId: string, reason?: string) => {
    const tx = transactions.find((t) => t.id === txId);
    if (!tx) return;

    // Refund back to user and revert totalWithdraw
    setUser((prev) => {
      if (prev.id === tx.userId) {
        const updatedTotalWithdraw = Math.max(0, Math.round(((prev.totalWithdraw ?? 0) - tx.amount) * 100) / 100);
        const updated = {
          ...prev,
          balance: Math.round((prev.balance + tx.amount) * 100) / 100,
          totalWithdraw: updatedTotalWithdraw
        };
        saveUserToStorage(updated);
        return updated;
      }
      return prev;
    });

    setRegisteredUsers((prev) => {
      const updated = prev.map((u) => {
        if (u.id === tx.userId) {
          const updatedTotalWithdraw = Math.max(0, Math.round(((u.totalWithdraw ?? 0) - tx.amount) * 100) / 100);
          return {
            ...u,
            balance: Math.round((u.balance + tx.amount) * 100) / 100,
            totalWithdraw: updatedTotalWithdraw
          };
        }
        return u;
      });
      localStorage.setItem('akm_registered_users', JSON.stringify(updated));
      return updated;
    });

    const updatedTx: Transaction = {
      ...tx,
      status: 'failed',
      adminRemark: reason || 'Rejected & Refunded by Admin'
    };
    setTransactions((prev) =>
      prev.map((t) => (t.id === txId ? updatedTx : t))
    );
    syncTransactionToFirestore(updatedTx).catch(() => {});
    remoteUpdateUserBalance(tx.userId, tx.amount, 0, -tx.amount).catch(() => {});

    addAuditLog('withdrawal', 'Withdrawal Rejected & Refunded', `Refunded ${tx.amount} to user: ${reason || 'Admin reject'}`, tx.amount, 'warning');
    
    sendLocalNotification({
      userId: tx.userId,
      type: 'withdrawal_status',
      title: 'Withdrawal Request Rejected ⚠️',
      body: `Withdrawal of ${formatINR(tx.amount)} (Order ${tx.orderId || tx.id}) was rejected${reason ? `: ${reason}` : ''}. The full amount has been refunded to your wallet.`,
      amount: tx.amount,
      status: 'failed',
      linkView: 'transactions',
      txId: tx.id
    });
  };

  const approveAllPendingDeposits = () => {
    const pending = transactions.filter((t) => t.type === 'recharge' && t.status === 'pending');
    if (pending.length === 0) {
      showToast('No pending deposits to approve', 'info');
      return 0;
    }
    let totalAmt = 0;
    const userCredits: Record<number, { credit: number; recharge: number }> = {};

    const calcBonus = (val: number) => {
      if (val >= 5000) return Math.floor(val * 0.08);
      if (val >= 1000) return Math.floor(val * 0.05);
      if (val >= 500) return Math.floor(val * 0.03);
      return 0;
    };

    setTransactions((prev) =>
      prev.map((t) => {
        if (t.type === 'recharge' && t.status === 'pending') {
          totalAmt += t.amount;
          const bonus = calcBonus(t.amount);
          const net = t.amount + bonus;
          if (!userCredits[t.userId]) {
            userCredits[t.userId] = { credit: 0, recharge: 0 };
          }
          userCredits[t.userId].credit += net;
          userCredits[t.userId].recharge += t.amount;
          return { ...t, status: 'success', adminRemark: 'Batch Approved by Admin' };
        }
        return t;
      })
    );

    pending.forEach((pTx) => {
      const updated: Transaction = { ...pTx, status: 'success', adminRemark: 'Batch Approved by Admin' };
      syncTransactionToFirestore(updated).catch(() => {});
      const bonus = calcBonus(pTx.amount);
      remoteUpdateUserBalance(pTx.userId, pTx.amount + bonus, pTx.amount, 0).catch(() => {});
    });

    setRegisteredUsers((prev) => {
      const updated = prev.map((u) => {
        if (userCredits[u.id]) {
          return {
            ...u,
            balance: Math.round((u.balance + userCredits[u.id].credit) * 100) / 100,
            totalRecharge: Math.round((u.totalRecharge + userCredits[u.id].recharge) * 100) / 100
          };
        }
        return u;
      });
      localStorage.setItem('akm_registered_users', JSON.stringify(updated));
      return updated;
    });

    if (userCredits[user.id]) {
      setUser((prev) => {
        const updated = {
          ...prev,
          balance: Math.round((prev.balance + userCredits[user.id].credit) * 100) / 100,
          totalRecharge: Math.round((prev.totalRecharge + userCredits[user.id].recharge) * 100) / 100
        };
        localStorage.setItem('akm_user', JSON.stringify(updated));
        return updated;
      });
    }

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
    pending.forEach((pTx) => {
      const updated: Transaction = { ...pTx, status: 'success', adminRemark: 'Batch Approved by Admin' };
      syncTransactionToFirestore(updated).catch(() => {});
      sendLocalNotification({
        userId: pTx.userId,
        type: 'withdrawal_status',
        title: 'Withdrawal Approved & Disbursed! 🎉',
        body: `Your payout of ${formatINR(pTx.finalAmount || pTx.amount)} (Order ${pTx.orderId || pTx.id}) has been approved and disbursed to your bank!`,
        amount: pTx.finalAmount || pTx.amount,
        status: 'success',
        linkView: 'transactions',
        txId: pTx.id
      });
    });
    addAuditLog('withdrawal', 'Batch Approved All Withdrawals', `Approved ${pending.length} pending payouts totalling ₹${totalAmt}`, totalAmt, 'success');
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

      sendLocalNotification({
        userId: user.id,
        type: 'interest_credit',
        title: 'Daily Settlement Credited! 📈',
        body: `+${formatINR(totalCredited)} daily interest settlement across ${processed} active plans credited to your balance.`,
        amount: totalCredited,
        status: 'success',
        linkView: 'myproducts'
      });
    }

    return { processed, totalCredited };
  };

  const addNewPlan = (planData: Omit<Plan, 'id'>) => {
    const newId = generateUniqueId('plan-custom');
    const newPlan: Plan = {
      ...planData,
      id: newId,
      imageUrl: planData.imageUrl || getProductArtworkDataUri(newId, planData.category)
    };
    setPlans((prev) => {
      const next = [newPlan, ...prev];
      localStorage.setItem('akm_plans', JSON.stringify(next));
      return next;
    });

    try {
      const deletedIds: string[] = JSON.parse(localStorage.getItem('akm_deleted_plan_ids') || '[]');
      const filtered = deletedIds.filter((d) => d !== newId);
      localStorage.setItem('akm_deleted_plan_ids', JSON.stringify(filtered));
    } catch {}

    syncPlanToFirestore(newPlan).catch(() => {});
    recordAuditLog({
      actionCategory: 'plan_mutation',
      type: 'plan',
      title: 'New Investment Plan Created',
      details: `Admin added plan "${newPlan.title}" (Deposit: ₹${newPlan.depositAmount}, Daily: ₹${newPlan.dailyIncome}, Return: ₹${newPlan.totalReturn})`,
      amount: newPlan.depositAmount,
      newValue: `Deposit: ₹${newPlan.depositAmount}`,
      status: 'success'
    });
    showToast(`New plan "${newPlan.title}" created & published!`, 'success');
  };

  const updatePlan = (id: string, updated: Partial<Plan>) => {
    let targetTitle = id;
    setPlans((prev) => {
      const next = prev.map((p) => {
        if (p.id === id) {
          const merged = { ...p, ...updated };
          targetTitle = merged.title;
          syncPlanToFirestore(merged).catch(() => {});
          return merged;
        }
        return p;
      });
      localStorage.setItem('akm_plans', JSON.stringify(next));
      return next;
    });

    recordAuditLog({
      actionCategory: 'plan_mutation',
      type: 'plan',
      title: 'Investment Plan Modified',
      details: `Admin updated plan "${targetTitle}". Modified fields: [${Object.keys(updated).join(', ')}]`,
      newValue: updated.depositAmount ? `Deposit: ₹${updated.depositAmount}` : undefined,
      status: 'info'
    });
    showToast(`Plan "${targetTitle}" successfully updated!`, 'success');
  };

  const deletePlan = (id: string) => {
    let deletedTitle = id;
    setPlans((prev) => {
      const target = prev.find((p) => p.id === id);
      if (target) deletedTitle = target.title;
      const next = prev.filter((p) => p.id !== id);
      localStorage.setItem('akm_plans', JSON.stringify(next));
      return next;
    });

    try {
      const deletedIds: string[] = JSON.parse(localStorage.getItem('akm_deleted_plan_ids') || '[]');
      if (!deletedIds.includes(id)) {
        deletedIds.push(id);
        localStorage.setItem('akm_deleted_plan_ids', JSON.stringify(deletedIds));
      }
    } catch {}

    deletePlanFromFirestore(id).catch(() => {});

    recordAuditLog({
      actionCategory: 'plan_mutation',
      type: 'plan',
      title: 'Investment Plan Removed',
      details: `Admin permanently removed plan "${deletedTitle}" from active catalog`,
      status: 'warning'
    });
    showToast(`Plan "${deletedTitle}" permanently deleted!`, 'info');
  };

  const clonePlan = (sourcePlanId: string) => {
    const source = plans.find((p) => p.id === sourcePlanId);
    if (!source) {
      showToast('Plan not found for duplication', 'error');
      return;
    }
    const newId = generateUniqueId('plan-clone');
    const cloned: Plan = {
      ...source,
      id: newId,
      title: `${source.title} (Copy)`,
      badge: source.badge ? `${source.badge} • Clone` : '⚡ Quick Clone',
      isActive: false
    };

    setPlans((prev) => {
      const next = [cloned, ...prev];
      localStorage.setItem('akm_plans', JSON.stringify(next));
      return next;
    });

    syncPlanToFirestore(cloned).catch(() => {});
    recordAuditLog({
      actionCategory: 'plan_mutation',
      type: 'plan',
      title: 'Plan Duplicated',
      details: `Admin cloned plan "${source.title}" into "${cloned.title}"`,
      status: 'info'
    });
    showToast(`Plan cloned successfully! (Saved as hidden)`, 'info');
  };

  const togglePlanActive = (id: string) => {
    const target = plans.find((p) => p.id === id);
    if (!target) return;
    const nextState = !target.isActive;
    updatePlan(id, { isActive: nextState });
  };

  const restoreDefaultPlans = () => {
    localStorage.removeItem('akm_deleted_plan_ids');
    setPlans(INITIAL_PLANS);
    localStorage.setItem('akm_plans', JSON.stringify(INITIAL_PLANS));
    INITIAL_PLANS.forEach((p) => {
      syncPlanToFirestore(p).catch(() => {});
    });
    recordAuditLog({
      actionCategory: 'plan_mutation',
      type: 'system',
      title: 'Default Blade Plans Restored',
      details: 'Admin restored default 22 precision blade product plans catalog',
      status: 'info'
    });
    showToast('Default 22 Blade Plans restored successfully!', 'success');
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
    const oldBal = user.balance;
    const newBal = Math.max(0, Math.round((oldBal - amount) * 100) / 100);
    updateUserBalance(-amount, reason);
    recordAuditLog({
      actionCategory: 'balance_adjust',
      type: 'system',
      title: 'Manual Admin Balance Debit',
      details: `Debited ${formatINR(amount)} from User #${user.id} (${user.phone}). Reason: ${reason}`,
      targetUserId: user.id,
      targetUserPhone: user.phone,
      amount,
      oldValue: `₹${oldBal}`,
      newValue: `₹${newBal}`,
      status: 'warning'
    });
    showToast(`Successfully debited ${formatINR(amount)} from user wallet!`, 'info');
    return true;
  };

  const toggleUserStatus = () => {
    const nextStatus = user.status === 'active' ? 'suspended' : 'active';
    const oldStatus = user.status;
    setUser((prev) => ({ ...prev, status: nextStatus }));
    recordAuditLog({
      actionCategory: 'user_status',
      type: 'user',
      title: `User Account Marked as ${nextStatus.toUpperCase()}`,
      details: `Admin switched account status for User #${user.id} (${user.phone}) from ${oldStatus} to ${nextStatus.toUpperCase()}`,
      targetUserId: user.id,
      targetUserPhone: user.phone,
      oldValue: oldStatus,
      newValue: nextStatus,
      status: nextStatus === 'suspended' ? 'critical' : 'success'
    });
    showToast(`User account status: ${nextStatus.toUpperCase()}!`, nextStatus === 'suspended' ? 'error' : 'success');
  };

  const updateUserVipLevel = (level: string) => {
    const oldLevel = user.memberLevel;
    setUser((prev) => ({ ...prev, memberLevel: level }));
    recordAuditLog({
      actionCategory: 'user_status',
      type: 'user',
      title: 'User VIP Level Adjusted',
      details: `Admin promoted/adjusted VIP tier for User #${user.id} (${user.phone}) to ${level}`,
      targetUserId: user.id,
      targetUserPhone: user.phone,
      oldValue: oldLevel,
      newValue: level,
      status: 'info'
    });
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
    ['akm_user', 'akm_plans', 'akm_user_plans', 'akm_checkins', 'akm_transactions', 'akm_team', 'akm_admin_settings', 'akm_audit_logs', 'akm_claimed_streak_milestones', 'akm_claimed_team_milestones', 'akm_security_alerts', 'akm_lucky_spins',
     'bkt_user', 'bkt_plans', 'bkt_user_plans', 'bkt_checkins', 'bkt_transactions', 'bkt_team', 'bkt_admin_settings', 'bkt_audit_logs', 'bkt_claimed_streak_milestones', 'bkt_claimed_team_milestones', 'bkt_security_alerts'
    ].forEach((key) => localStorage.removeItem(key));

    setUser(INITIAL_USER);
    setPlans(INITIAL_PLANS);
    setUserPlans([]);
    setCheckIns(INITIAL_CHECKINS);
    setLuckySpinRecords([]);
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
        goBack,
        rechargePrefillAmount,
        setRechargePrefillAmount,
        navigateToRecharge,
        transactionFilter,
        setTransactionFilter,
        navigateToTransactions,
        isAdminOpen,
        setIsAdminOpen,
        isAdminUser,
        isAdminAuthenticated,
        unlockAdminSession,
        lockAdminSession,
        user,
        registeredUsers,
        isLoggedIn,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalInitialMode,
        openAuthModal,
        login,
        loginWithOtp,
        quickMobileAuth,
        registerUser,
        logoutUser,
        switchUser,
        adminCreateUser,
        adminUpdateUser,
        adminDeleteUser,
        updateUserBalance,
        updateBankAccount,
        refreshUserBalance,
        isBalanceRefreshing,
        lastBalanceRefreshedAt,
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
        isLuckySpinOpen,
        setIsLuckySpinOpen,
        hasSpunToday,
        lastSpinDate,
        luckySpinSegments: LUCKY_SPIN_SEGMENTS,
        spinLuckyWheel,
        luckySpinRecords,
        totalSpinEarned,
        transactions,
        initiateRecharge,
        confirmDepositPayment,
        submitDepositUtr,
        requestWithdrawal,
        cancelWithdrawal,
        teamMembers,
        claimedTeamMilestones,
        claimTeamMilestone,
        adminSettings,
        updateAdminSettings,
        approveDeposit,
        adminCreditDeposit,
        rejectDeposit,
        approveWithdrawal,
        rejectWithdrawal,
        runDailySettlement,
        addNewPlan,
        updatePlan,
        deletePlan,
        clonePlan,
        togglePlanActive,
        restoreDefaultPlans,
        resetAllData,
        auditLogs,
        recordAuditLog,
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
        isNotificationModalOpen,
        setIsNotificationModalOpen,
        notifications,
        unreadNotificationCount,
        sendLocalNotification,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        clearAllNotifications,
        deleteNotification,
        notificationPermission,
        requestBrowserNotificationPermission,
        isNotificationSoundEnabled,
        toggleNotificationSound,
        isHapticEnabled,
        toggleHapticFeedback,
        isHapticSupported: isHapticSupported(),
        activeCheckoutModal,
        setActiveCheckoutModal,
        activePayment,
        setActivePayment,
        openPaymentPage,
        supportMessages,
        sendSupportMessage,
        replySupportMessage,
        resolveSupportMessage,
        isSupportModalOpen,
        setIsSupportModalOpen,
        dbConnectionStatus,
        isDbConnected,
        refreshAppData
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
