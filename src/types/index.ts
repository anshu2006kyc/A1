export type PlanCategory = 'turbo' | 'normal' | 'vip';

export interface Plan {
  id: string;
  title: string;
  category: PlanCategory;
  limit: number;
  returnDays: number;
  durationMinutes?: number;
  depositAmount: number;
  dailyIncome: number;
  totalReturn: number;
  imageUrl?: string;
  badge?: string;
  isActive: boolean;
}

export interface BankAccount {
  holderName: string;
  accountNumber: string;
  ifscCode: string;
  bankName?: string;
  upiId?: string;
  payoutMethod?: 'bank' | 'upi';
  updatedAt: string;
}

export interface User {
  id: number;
  phone: string;
  password?: string;
  tradePassword?: string;
  name?: string;
  role?: 'admin' | 'user';
  isAdmin?: boolean;
  balance: number;
  totalRecharge: number;
  totalWithdraw?: number;
  totalRevenue: number;
  memberLevel: string;
  vipLevel?: number;
  inviteCode: string;
  invitedBy?: string;
  bankAccount?: BankAccount;
  status: 'active' | 'suspended';
  createdAt: string;
  lastLogin?: string;
}

export interface UserPlan {
  id: string;
  userId: number;
  planId: string;
  title: string;
  depositAmount: number;
  dailyIncome: number;
  totalReturn: number;
  returnDays: number;
  durationMinutes?: number;
  daysClaimed: number;
  lastClaimDate?: string;
  nextClaimTime?: number;
  imageUrl?: string;
  status: 'active' | 'completed' | 'returned';
  purchasedAt: string;
}

export type TransactionType = 'recharge' | 'withdraw' | 'checkin' | 'daily_income' | 'referral_commission' | 'plan_purchase';
export type TransactionStatus = 'success' | 'pending' | 'failed';

export interface Transaction {
  id: string;
  userId: number;
  type: TransactionType;
  title: string;
  method: string;
  orderId: string;
  amount: number;
  finalAmount: number;
  status: TransactionStatus;
  createdAt: string;
  utrNumber?: string;
  adminRemark?: string;
  gateway?: 'lgpay' | 'sunpays' | 'watchpay' | 'upi';
  payoutMethod?: 'bank' | 'upi';
  payoutAccount?: string;
  disbursedAt?: string;
}

export interface CheckInRecord {
  id: string;
  userId: number;
  dateStr: string; // YYYY-MM-DD
  timestamp: string; // e.g. "13 Sep 2026 - 09:53 PM"
  amount: number;
  status: 'success';
}

export interface TeamMember {
  id: number;
  phone: string;
  level: 1 | 2 | 3;
  rechargeAmount: number;
  commissionEarned: number;
  joinedAt: string;
  status: 'active' | 'inactive';
}

export interface StreakRewardConfig {
  days: number;
  reward: number;
  label: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  type: 'deposit' | 'withdrawal' | 'settlement' | 'bonus' | 'plan' | 'system';
  title: string;
  details: string;
  amount?: number;
  status: 'success' | 'warning' | 'info' | 'error';
}

export interface SecurityAlert {
  id: string;
  timestamp: string;
  level: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  sourceIp?: string;
  resolved: boolean;
}

export interface AdminSettings {
  adminPassword?: string;
  // LGPay / WatchGLB Gateway Credentials (User's Merchant Configuration)
  merchantKey: string;
  mchId: string;
  notifyUrl: string;
  pageUrl: string;
  gatewayApiUrl: string;
  payType: string;
  gatewayMode: 'simulation' | 'live';
  upiId: string;
  upiQrUrl: string;
  // WATCHPAY Gateway (WatchGLB API)
  lgpayEnabled: boolean;
  lgpayMerchantId: string;
  lgpayMerchantKey: string;
  lgpayGatewayUrl: string;
  lgpayPayType: string;
  watchpayEnabled?: boolean;
  watchpayMerchantId?: string;
  watchpayMerchantKey?: string;
  watchpayGatewayUrl?: string;

  // SUNPAY Gateway (ttpay.business)
  sunpaysEnabled: boolean;
  sunpaysMerchantId: string;
  sunpaysPayinKey: string;
  sunpaysPayinSecret: string;
  sunpaysPayoutKey: string;
  sunpaysPayoutSecret: string;
  selectedDepositGateway: 'lgpay' | 'sunpays' | 'watchpay' | 'all';
  defaultGateway?: 'watchpay' | 'sunpays' | 'auto';
  gatewayPriority: 'lgpay_first' | 'sunpays_first' | 'watchpay_first' | 'auto_failover';
  paymentOpenMode: 'in_app' | 'external'; // 'in_app' = Cashier screen inside app, 'external' = Open gateway link in browser tab
  
  // Platform limits & fees
  minRecharge: number;
  minWithdraw: number;
  maxWithdraw: number;
  withdrawFeePercent: number;
  withdrawStartTime: string;
  withdrawEndTime: string;
  
  // Daily check-in config
  dailyCheckInReward: number;
  streakRewards: StreakRewardConfig[];
  
  // Referral commissions
  commissionLevel1: number;
  commissionLevel2: number;
  commissionLevel3: number;
  
  // Automation & Returns
  autoCreditDailyIncome: boolean;
  turboAutoSettlement: boolean;
  globalReturnMultiplier: number;

  // Platform notification & Announcement modal
  announcementTitle: string;
  announcementMessage: string;
  announcementEnabled: boolean;
  announcementTag: string;

  // Security, Risk & platform control
  maintenanceMode: boolean;
  freezeWithdrawals: boolean;
  freezeDeposits: boolean;
  duplicateUtrBlockEnabled: boolean;
  highValueWithdrawThreshold: number;
  minMemberLevelForWithdraw: number;

  // Custom Live Ticker Feed
  tickerCustomMessages: string[];
  
  // Social links
  telegramSupportUrl: string;
  telegramChannelUrl: string;
  whatsappSupportUrl: string;

  // Theme & Appearance Customization
  activeThemeId?: string;
}
