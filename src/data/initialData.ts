import { AdminSettings, CheckInRecord, Plan, SecurityAlert, TeamMember, Transaction, User } from '../types';

export const INITIAL_USER: User = {
  id: 60,
  phone: "+91 6203369638",
  password: "password123",
  tradePassword: "123456",
  name: "Anshu Kumar",
  role: "user",
  isAdmin: false,
  balance: 32.0,
  totalRecharge: 720.0,
  totalWithdraw: 280.0,
  totalRevenue: 32.0,
  memberLevel: "Member",
  vipLevel: 0,
  inviteCode: "46748",
  status: "active",
  createdAt: "2026-07-10 10:20:00",
  lastLogin: "2026-09-17 12:00:00",
  bankAccount: {
    holderName: "Anshu Kumar",
    accountNumber: "620336963812",
    ifscCode: "SBIN0001234",
    updatedAt: "2026-09-10 14:30:00"
  }
};

export const INITIAL_USERS: User[] = [
  INITIAL_USER,
  {
    id: 101,
    phone: "+91 9988776655",
    password: "password123",
    tradePassword: "123456",
    name: "Rajesh Sharma (VIP 3)",
    balance: 48500.0,
    totalRecharge: 55000,
    totalWithdraw: 0,
    totalRevenue: 28400,
    memberLevel: "VIP 3",
    vipLevel: 3,
    inviteCode: "VIP888",
    status: "active",
    createdAt: "2026-08-01 14:00:00",
    lastLogin: "2026-09-17 11:30:00",
    bankAccount: {
      holderName: "Rajesh Sharma",
      accountNumber: "998877665501",
      ifscCode: "HDFC0001890",
      bankName: "HDFC Bank",
      updatedAt: "2026-08-15 10:00:00"
    }
  },
  {
    id: 102,
    phone: "+91 9876543210",
    password: "password123",
    tradePassword: "123456",
    name: "Priya Verma",
    balance: 1450.0,
    totalRecharge: 2500,
    totalWithdraw: 0,
    totalRevenue: 680,
    memberLevel: "VIP 1",
    vipLevel: 1,
    inviteCode: "AKM999",
    status: "active",
    createdAt: "2026-08-20 09:15:00",
    lastLogin: "2026-09-16 18:40:00",
    bankAccount: {
      holderName: "Priya Verma",
      accountNumber: "987654321098",
      ifscCode: "ICIC0000456",
      bankName: "ICICI Bank",
      updatedAt: "2026-08-22 16:20:00"
    }
  }
];

export const INITIAL_PLANS: Plan[] = [
  {
    id: "plan-turbo-1m",
    title: "1 Minute Flash Express",
    category: "turbo",
    limit: 10,
    returnDays: 1,
    durationMinutes: 1,
    depositAmount: 200,
    dailyIncome: 250,
    totalReturn: 250,
    badge: "⚡ 1 Minute",
    imageUrl: "https://images.unsplash.com/photo-1592838064575-70ed626d3a0e?auto=format&fit=crop&w=800&q=80",
    isActive: true
  },
  {
    id: "plan-turbo-3m",
    title: "3 Minutes Turbo Speed",
    category: "turbo",
    limit: 10,
    returnDays: 1,
    durationMinutes: 3,
    depositAmount: 500,
    dailyIncome: 660,
    totalReturn: 660,
    badge: "⚡ 3 Minutes",
    imageUrl: "https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&w=800&q=80",
    isActive: true
  },
  {
    id: "plan-turbo-5m",
    title: "5 Minutes Quick Harvest",
    category: "turbo",
    limit: 10,
    returnDays: 1,
    durationMinutes: 5,
    depositAmount: 1000,
    dailyIncome: 1400,
    totalReturn: 1400,
    badge: "🔥 5 Minutes",
    imageUrl: "https://images.unsplash.com/photo-1530267981375-f0de937f5f13?auto=format&fit=crop&w=800&q=80",
    isActive: true
  },
  {
    id: "plan-turbo-10m",
    title: "10 Minutes Rapid Growth",
    category: "turbo",
    limit: 10,
    returnDays: 1,
    durationMinutes: 10,
    depositAmount: 2000,
    dailyIncome: 3000,
    totalReturn: 3000,
    badge: "⚡ 10 Minutes",
    imageUrl: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80",
    isActive: true
  },
  {
    id: "plan-turbo-15m",
    title: "15 Minutes Power Wheel",
    category: "turbo",
    limit: 10,
    returnDays: 1,
    durationMinutes: 15,
    depositAmount: 3500,
    dailyIncome: 5600,
    totalReturn: 5600,
    badge: "🚀 15 Minutes",
    imageUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=800&q=80",
    isActive: true
  },
  {
    id: "plan-turbo-30m",
    title: "30 Minutes Super Charge",
    category: "turbo",
    limit: 10,
    returnDays: 1,
    durationMinutes: 30,
    depositAmount: 5000,
    dailyIncome: 8500,
    totalReturn: 8500,
    badge: "💎 30 Minutes",
    imageUrl: "https://images.unsplash.com/photo-1616423640778-28d1b53229bd?auto=format&fit=crop&w=800&q=80",
    isActive: true
  },
  {
    id: "plan-turbo-45m",
    title: "45 Minutes Elite Accelerator",
    category: "turbo",
    limit: 10,
    returnDays: 1,
    durationMinutes: 45,
    depositAmount: 7500,
    dailyIncome: 13500,
    totalReturn: 13500,
    badge: "👑 45 Minutes",
    imageUrl: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=800&q=80",
    isActive: true
  },
  {
    id: "plan-turbo-60m",
    title: "60 Minutes (1 Hour) Titan Master",
    category: "turbo",
    limit: 10,
    returnDays: 1,
    durationMinutes: 60,
    depositAmount: 10000,
    dailyIncome: 19000,
    totalReturn: 19000,
    badge: "⚡ 1 Hour",
    imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
    isActive: true
  },
  {
    id: "plan-special-1",
    title: "Special Offer Plan",
    category: "normal",
    limit: 10,
    returnDays: 2,
    depositAmount: 720,
    dailyIncome: 4354,
    totalReturn: 8708,
    badge: "Limit 10",
    imageUrl: "https://images.unsplash.com/photo-1592838064575-70ed626d3a0e?auto=format&fit=crop&w=800&q=80",
    isActive: true
  },
  {
    id: "plan-product-1",
    title: "Product 1",
    category: "normal",
    limit: 10,
    returnDays: 30,
    depositAmount: 285,
    dailyIncome: 245,
    totalReturn: 7350,
    badge: "Limit 10",
    imageUrl: "https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&w=800&q=80",
    isActive: true
  },
  {
    id: "plan-product-2",
    title: "Product 2 - AKM Apex Premium",
    category: "normal",
    limit: 10,
    returnDays: 35,
    depositAmount: 520,
    dailyIncome: 480,
    totalReturn: 16800,
    badge: "Limit 10",
    imageUrl: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=800&q=80",
    isActive: true
  },
  {
    id: "plan-product-3",
    title: "Product 3 - AKM Sovereign Elite",
    category: "normal",
    limit: 10,
    returnDays: 40,
    depositAmount: 1000,
    dailyIncome: 960,
    totalReturn: 38400,
    badge: "Limit 10",
    imageUrl: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=800&q=80",
    isActive: true
  },
  {
    id: "plan-product-4",
    title: "Product 4 - AKM Capital Prime",
    category: "normal",
    limit: 5,
    returnDays: 45,
    depositAmount: 2000,
    dailyIncome: 2100,
    totalReturn: 94500,
    badge: "Limit 5",
    imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80",
    isActive: true
  },
  {
    id: "plan-product-5",
    title: "Product 5 - AKM Pinnacle Fund",
    category: "normal",
    limit: 5,
    returnDays: 50,
    depositAmount: 4785,
    dailyIncome: 5500,
    totalReturn: 275000,
    badge: "Limit 5",
    imageUrl: "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&w=800&q=80",
    isActive: true
  },
  {
    id: "plan-vip-1",
    title: "VIP 1 - AKM Wealth Matrix",
    category: "vip",
    limit: 5,
    returnDays: 1,
    depositAmount: 1500,
    dailyIncome: 2200,
    totalReturn: 2200,
    badge: "VIP 1 Exclusive",
    imageUrl: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&w=800&q=80",
    isActive: true
  },
  {
    id: "plan-vip-2",
    title: "VIP 2 - AKM Sovereign Ultra",
    category: "vip",
    limit: 3,
    returnDays: 3,
    depositAmount: 5000,
    dailyIncome: 8500,
    totalReturn: 25500,
    badge: "VIP 2 Exclusive",
    imageUrl: "https://images.unsplash.com/photo-1618042164219-62c820f10723?auto=format&fit=crop&w=800&q=80",
    isActive: true
  }
];

export const INITIAL_CHECKINS: CheckInRecord[] = [
  {
    id: "chk-5",
    userId: 60,
    dateStr: "2026-09-16",
    timestamp: "16 Sep 2026 - 11:09 AM",
    amount: 8,
    status: "success"
  },
  {
    id: "chk-4",
    userId: 60,
    dateStr: "2026-09-13",
    timestamp: "13 Sep 2026 - 09:53 PM",
    amount: 8,
    status: "success"
  },
  {
    id: "chk-3",
    userId: 60,
    dateStr: "2026-08-16",
    timestamp: "16 Aug 2026 - 05:19 PM",
    amount: 8,
    status: "success"
  },
  {
    id: "chk-2",
    userId: 60,
    dateStr: "2026-07-14",
    timestamp: "14 Jul 2026 - 11:36 AM",
    amount: 8,
    status: "success"
  },
  {
    id: "chk-1",
    userId: 60,
    dateStr: "2026-07-12",
    timestamp: "12 Jul 2026 - 10:53 PM",
    amount: 8,
    status: "success"
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: "tx-wd-payout-1",
    userId: 60,
    type: "withdraw",
    title: "Withdrawal to Bank (IMPS)",
    method: "Bank (63812)",
    payoutMethod: "bank",
    payoutAccount: "620336963812",
    orderId: "WD1726055400291",
    amount: 280.0,
    finalAmount: 266.0,
    status: "success",
    createdAt: "11/09/2026 - 02:15 PM"
  },
  {
    id: "tx-topup-0a",
    userId: 60,
    type: "recharge",
    title: "Topup - FF Pay",
    method: "FF Pay",
    orderId: "ORD17265444601192",
    amount: 720.0,
    finalAmount: 720.0,
    status: "pending",
    createdAt: "17/09/2026 - 03:41 AM"
  },
  {
    id: "tx-topup-0b",
    userId: 60,
    type: "recharge",
    title: "Topup - FF Pay",
    method: "FF Pay",
    orderId: "ORD17264653809021",
    amount: 720.0,
    finalAmount: 720.0,
    status: "pending",
    createdAt: "16/09/2026 - 05:43 AM"
  },
  {
    id: "tx-chk-5",
    userId: 60,
    type: "checkin",
    title: "daily check-in",
    method: "Bonus",
    orderId: "CHK-20260916-109",
    amount: 8.0,
    finalAmount: 8.0,
    status: "success",
    createdAt: "16/09/2026 - 11:09 AM"
  },
  {
    id: "tx-chk-4",
    userId: 60,
    type: "checkin",
    title: "daily check-in",
    method: "Bonus",
    orderId: "CHK-20260913-882",
    amount: 8.0,
    finalAmount: 8.0,
    status: "success",
    createdAt: "13/09/2026 - 09:53 PM"
  },
  {
    id: "tx-chk-3",
    userId: 60,
    type: "checkin",
    title: "daily check-in",
    method: "Bonus",
    orderId: "CHK-20260816-419",
    amount: 8.0,
    finalAmount: 8.0,
    status: "success",
    createdAt: "16/08/2026 - 05:19 PM"
  },
  {
    id: "tx-chk-2",
    userId: 60,
    type: "checkin",
    title: "daily check-in",
    method: "Bonus",
    orderId: "CHK-20260714-991",
    amount: 8.0,
    finalAmount: 8.0,
    status: "success",
    createdAt: "14/07/2026 - 11:36 AM"
  },
  {
    id: "tx-chk-1",
    userId: 60,
    type: "checkin",
    title: "daily check-in",
    method: "Bonus",
    orderId: "CHK-20260712-704",
    amount: 8.0,
    finalAmount: 8.0,
    status: "success",
    createdAt: "12/07/2026 - 10:53 PM"
  },
  {
    id: "tx-topup-1",
    userId: 60,
    type: "recharge",
    title: "Topup - FF Pay",
    method: "FF Pay",
    orderId: "ORD17262447008124",
    amount: 720.0,
    finalAmount: 720.0,
    status: "pending",
    createdAt: "13/09/2026 - 04:25 PM"
  },
  {
    id: "tx-topup-2",
    userId: 60,
    type: "recharge",
    title: "Topup - FF Pay",
    method: "FF Pay",
    orderId: "ORD17262445804391",
    amount: 720.0,
    finalAmount: 720.0,
    status: "pending",
    createdAt: "13/09/2026 - 04:23 PM"
  },
  {
    id: "tx-topup-3",
    userId: 60,
    type: "recharge",
    title: "Topup - FF Pay",
    method: "FF Pay",
    orderId: "ORD17238089405521",
    amount: 720.0,
    finalAmount: 720.0,
    status: "pending",
    createdAt: "16/08/2026 - 11:49 AM"
  },
  {
    id: "tx-topup-4",
    userId: 60,
    type: "recharge",
    title: "Topup - Ydfpay",
    method: "Ydfpay",
    orderId: "ORD17220800007892",
    amount: 720.0,
    finalAmount: 720.0,
    status: "pending",
    createdAt: "27/07/2026 - 06:33 PM"
  }
];

export const INITIAL_TEAM_MEMBERS: TeamMember[] = [
  {
    id: 101,
    phone: "+91 9876543210",
    level: 1,
    rechargeAmount: 720,
    commissionEarned: 180, // 25% of 720
    joinedAt: "2026-08-01",
    status: "active"
  },
  {
    id: 102,
    phone: "+91 8765432109",
    level: 1,
    rechargeAmount: 285,
    commissionEarned: 71.25,
    joinedAt: "2026-08-15",
    status: "active"
  },
  {
    id: 201,
    phone: "+91 7654321098",
    level: 2,
    rechargeAmount: 1000,
    commissionEarned: 30, // 3% of 1000
    joinedAt: "2026-08-20",
    status: "active"
  },
  {
    id: 301,
    phone: "+91 6543210987",
    level: 3,
    rechargeAmount: 2000,
    commissionEarned: 40, // 2% of 2000
    joinedAt: "2026-08-28",
    status: "active"
  }
];

export const INITIAL_ADMIN_SETTINGS: AdminSettings = {
  adminPassword: "8340",
  // Merchant details (LGPay / WatchGLB Gateway from User Configuration)
  merchantKey: "4abd8ad7b8a44bfcbeaa8ad8e30dae30",
  mchId: "100666859",
  notifyUrl: "/api/lgpay/notify",
  pageUrl: "/pay/success",
  gatewayApiUrl: "https://api.watchglb.com/pay/web",
  payType: "101",
  gatewayMode: "live", // Live automated gateway
  upiId: "akmpayments@okaxis",
  upiQrUrl: "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=akmpayments@okaxis&pn=AKM+Group&cu=INR",
  lgpayEnabled: true,
  lgpayMerchantId: "100666859",
  lgpayMerchantKey: "4abd8ad7b8a44bfcbeaa8ad8e30dae30",
  lgpayGatewayUrl: "https://api.watchglb.com/pay/web",
  lgpayPayType: "101",

  // Sunpays Gateway Integration
  sunpaysEnabled: true,
  sunpaysMerchantId: "353548",
  sunpaysPayinKey: "b6ff773b7d9d08bde80ef13ad8bd924cd3c9341aef4330f341272ee81b2ab6ad",
  sunpaysPayinSecret: "cd40986af39469dfca69eea8f3e5307f4b1293d9d9ec863f7c67d66e92a4ec2b",
  sunpaysPayoutKey: "354f21cf1f27cbadcf136fbd64e7fd1da6a4d95e1385ff704fa79b8060bae7a4",
  sunpaysPayoutSecret: "ed7350044c65779df3b9222756d765db20860ed843d6e9fb74722d693c8ef8a7",
  selectedDepositGateway: "all",
  defaultGateway: "watchpay",
  gatewayPriority: "lgpay_first",
  paymentOpenMode: "in_app",

  minRecharge: 285,
  minWithdraw: 150,
  maxWithdraw: 50000,
  withdrawFeePercent: 0, // 0% as standard or 5%
  withdrawStartTime: "07:00",
  withdrawEndTime: "17:00",

  dailyCheckInReward: 8,
  streakRewards: [
    { days: 3, reward: 15, label: "3 DAYS" },
    { days: 7, reward: 50, label: "7 WEEK" },
    { days: 15, reward: 150, label: "15 DAYS" },
    { days: 30, reward: 500, label: "30 MONTH" }
  ],

  commissionLevel1: 25,
  commissionLevel2: 3,
  commissionLevel3: 2,

  autoCreditDailyIncome: true,
  turboAutoSettlement: true,
  globalReturnMultiplier: 1.0,

  announcementTitle: "Official Platform Notice",
  announcementMessage: "Welcome to AKM ENTERPRISES! Instant UPI 24/7 channels are fully active. Earn daily returns with our high-return enterprise investment plans.",
  announcementEnabled: true,
  announcementTag: "IMPORTANT",

  maintenanceMode: false,
  freezeWithdrawals: false,
  freezeDeposits: false,
  duplicateUtrBlockEnabled: true,
  highValueWithdrawThreshold: 5000,
  minMemberLevelForWithdraw: 0,

  tickerCustomMessages: [
    "🔥 Member 98****3210 just withdrew ₹25,000 to SBI Bank account!",
    "⚡ 1-Minute Turbo Plan returns boosted by 130% daily profit!",
    "🛡️ 100% Instant UPI Auto-Credit webhook active for real-time deposits.",
    "🎁 Daily Check-in streak bonuses ready to claim in Wallet tab."
  ],

  telegramSupportUrl: "https://t.me/akm_official_support",
  telegramChannelUrl: "https://t.me/akm_official_channel",
  whatsappSupportUrl: "https://wa.me/916203369638",
  activeThemeId: "emerald"
};

export const INITIAL_SECURITY_ALERTS = [
  {
    id: "sec-1",
    timestamp: "5 mins ago",
    level: "info" as const,
    title: "Firewall Active",
    message: "Rate limiting enabled on /api/pay/notify endpoint. Max 10 req/sec per IP.",
    sourceIp: "103.21.244.0",
    resolved: true
  },
  {
    id: "sec-2",
    timestamp: "18 mins ago",
    level: "warning" as const,
    title: "Duplicate UTR Scan",
    message: "UTR verification filter blocked duplicate submission attempt on Order ORD_82910.",
    sourceIp: "49.36.128.91",
    resolved: true
  }
];

export const INITIAL_AUDIT_LOGS = [
  {
    id: "log-1",
    timestamp: "Just now",
    type: "system" as const,
    title: "Income Engine Booted",
    details: "Automated cron listener active on port 3000 with Instant UPI channel.",
    status: "success" as const
  },
  {
    id: "log-2",
    timestamp: "10 mins ago",
    type: "settlement" as const,
    title: "Daily Profit Auto-Settled",
    details: "Dispatched ₹50.00 daily dividend to active subscriber.",
    amount: 50,
    status: "success" as const
  },
  {
    id: "log-3",
    timestamp: "28 mins ago",
    type: "deposit" as const,
    title: "UPI Recharge Verified",
    details: "Automated callback verified transaction ORD17220800007892.",
    amount: 720,
    status: "success" as const
  },
  {
    id: "log-4",
    timestamp: "1 hour ago",
    type: "bonus" as const,
    title: "3-Tier Commission Credited",
    details: "Level 1 referral bonus of ₹180.00 disbursed to sponsor account.",
    amount: 180,
    status: "info" as const
  }
];
