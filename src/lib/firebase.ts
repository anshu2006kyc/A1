import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  getDocFromServer,
  setDoc,
  getDocs,
  collection,
  onSnapshot
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { AdminSettings, Plan, Transaction, User, UserPlan } from '../types';

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || undefined);

// OperationType enum per Firebase skill guidelines
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

// Structured error handling interface per Firebase skill
export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map((provider) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('[Firebase Database Error]', JSON.stringify(errInfo));
  return errInfo;
}

// Track live database connection state
let _isDbOnline = false;
export function isDatabaseOnline(): boolean {
  return _isDbOnline;
}

// Validate connection to Firestore on initialization per Firebase skill directives
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    _isDbOnline = true;
    console.log('[Firebase] Firestore connected successfully to database:', firebaseConfig.firestoreDatabaseId);
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('[Firebase] Firestore client is offline, retrying...');
      _isDbOnline = false;
    } else {
      _isDbOnline = true;
      console.log('[Firebase] Firestore handshake active.');
    }
    return _isDbOnline;
  }
}

// Auto-run connection test
testFirestoreConnection();

/**
 * Recursively strips undefined values from an object or array to ensure
 * compliance with Firestore, which rejects documents containing `undefined`.
 */
export function sanitizeFirestoreData<T>(data: T): T {
  if (data === null || data === undefined) {
    return null as unknown as T;
  }
  if (Array.isArray(data)) {
    return data
      .filter((item) => item !== undefined)
      .map((item) => sanitizeFirestoreData(item)) as unknown as T;
  }
  if (typeof data === 'object') {
    const cleaned: Record<string, any> = {};
    for (const [key, value] of Object.entries(data as Record<string, any>)) {
      if (value !== undefined) {
        cleaned[key] = sanitizeFirestoreData(value);
      }
    }
    return cleaned as T;
  }
  return data;
}

// --- FIRESTORE PERSISTENCE SYNC HELPERS ---

export async function syncUserToFirestore(user: User): Promise<void> {
  const path = `users/${user.id}`;
  try {
    const userData = sanitizeFirestoreData({
      id: String(user.id),
      phone: user.phone || '',
      name: user.name || '',
      balance: typeof user.balance === 'number' && !isNaN(user.balance) ? user.balance : 0,
      totalRecharge: typeof user.totalRecharge === 'number' && !isNaN(user.totalRecharge) ? user.totalRecharge : 0,
      totalWithdraw: typeof user.totalWithdraw === 'number' && !isNaN(user.totalWithdraw) ? user.totalWithdraw : 0,
      totalRevenue: typeof user.totalRevenue === 'number' && !isNaN(user.totalRevenue) ? user.totalRevenue : 0,
      memberLevel: user.memberLevel || 'Member',
      vipLevel: typeof user.vipLevel === 'number' && !isNaN(user.vipLevel) ? user.vipLevel : 0,
      inviteCode: user.inviteCode || '',
      invitedBy: user.invitedBy || '',
      bankAccount: user.bankAccount ? sanitizeFirestoreData(user.bankAccount) : null,
      status: user.status || 'active',
      createdAt: user.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    await setDoc(doc(db, 'users', String(user.id)), userData, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function syncTransactionToFirestore(tx: Transaction): Promise<void> {
  const path = `transactions/${tx.id}`;
  try {
    const txData = sanitizeFirestoreData({
      id: String(tx.id),
      userId: String(tx.userId),
      type: tx.type,
      title: tx.title || '',
      method: tx.method || '',
      orderId: tx.orderId || '',
      amount: typeof tx.amount === 'number' && !isNaN(tx.amount) ? tx.amount : 0,
      finalAmount: typeof tx.finalAmount === 'number' && !isNaN(tx.finalAmount) ? tx.finalAmount : (typeof tx.amount === 'number' ? tx.amount : 0),
      status: tx.status,
      utrNumber: tx.utrNumber || '',
      createdAt: tx.createdAt || new Date().toISOString()
    });
    await setDoc(doc(db, 'transactions', String(tx.id)), txData, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function syncUserPlanToFirestore(userPlan: UserPlan): Promise<void> {
  const path = `userPlans/${userPlan.id}`;
  try {
    const data = sanitizeFirestoreData({
      ...userPlan,
      id: String(userPlan.id),
      durationMinutes: userPlan.durationMinutes ?? null,
      nextClaimTime: userPlan.nextClaimTime ?? null,
      lastClaimDate: userPlan.lastClaimDate ?? null,
      imageUrl: userPlan.imageUrl ?? '',
      updatedAt: new Date().toISOString()
    });
    await setDoc(doc(db, 'userPlans', String(userPlan.id)), data, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function syncPlanToFirestore(plan: Plan): Promise<void> {
  const path = `plans/${plan.id}`;
  try {
    const data = sanitizeFirestoreData({
      ...plan,
      id: String(plan.id),
      durationMinutes: plan.durationMinutes ?? null,
      imageUrl: plan.imageUrl ?? '',
      badge: plan.badge ?? '',
      updatedAt: new Date().toISOString()
    });
    await setDoc(doc(db, 'plans', String(plan.id)), data, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function syncAdminSettingsToFirestore(settings: AdminSettings): Promise<void> {
  const path = 'adminSettings/global';
  try {
    const data = sanitizeFirestoreData({
      ...settings,
      updatedAt: new Date().toISOString()
    });
    await setDoc(doc(db, 'adminSettings', 'global'), data, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

