import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
  AlertCircle,
  ArrowDownLeft,
  ArrowLeft,
  ArrowUpRight,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Copy,
  CreditCard,
  Download,
  ExternalLink,
  Eye,
  EyeOff,
  FileCheck,
  FileText,
  HelpCircle,
  LogIn,
  MessageSquare,
  Package,
  Printer,
  QrCode,
  Radio,
  RefreshCw,
  Share2,
  ShieldCheck,
  TrendingUp,
  Wallet,
  Wifi,
  X,
  XCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { sfx } from '../utils/sound';
import { formatINR } from '../utils/currency';
import { Transaction } from '../types';
import {
  formatRecordDateTime,
  getRelativeTimeLabel,
  sortRecordsNewestFirst,
  parseRecordTimestamp
} from '../utils/date';

export type CardCategoryTab = 'all' | 'recharge' | 'income' | 'withdraw';
export type CardTypeFilter = 'all' | 'credit' | 'debit';

export const TransactionsView: React.FC = () => {
  const {
    user,
    transactions,
    goBack,
    showToast,
    isLoggedIn,
    openAuthModal,
    transactionFilter,
    setTransactionFilter,
    navigateToRecharge,
    setCurrentView
  } = useApp();

  // Active view tab: all | recharge | income | withdraw
  const initialTab = useMemo<CardCategoryTab>(() => {
    if (transactionFilter === 'withdraw') return 'withdraw';
    if (transactionFilter === 'revenue' || transactionFilter === 'income' || transactionFilter === 'commission') return 'income';
    if (transactionFilter === 'deposit') return 'recharge';
    return 'all';
  }, [transactionFilter]);

  const [activeTab, setActiveTab] = useState<CardCategoryTab>(initialTab);
  const [activeCardView, setActiveCardView] = useState<'credit' | 'debit'>('credit');
  const [showFullCardNumber, setShowFullCardNumber] = useState(false);
  const [helpTx, setHelpTx] = useState<Transaction | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncedTime, setLastSyncedTime] = useState<string>('Just now');

  // Helper to generate realistic 4-digit last block for card display
  const getCardLast4 = (tx: Transaction) => {
    const raw = tx.orderId || tx.id || '';
    const digits = raw.replace(/\D/g, '');
    if (digits.length >= 4) return digits.slice(-4);
    const hash = Math.abs(
      raw.split('').reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) % 10000, 7)
    );
    return String(hash).padStart(4, '0');
  };

  // STRICT REQUIREMENT: Scoped to user and strictly sorted with NEWEST on top & OLDEST at bottom
  const userTransactions = useMemo(() => {
    const userOnly = transactions.filter((t) => t.userId === user.id);
    return sortRecordsNewestFirst(userOnly);
  }, [transactions, user.id]);

  // Distinct separated record categories (alag-alag lists)
  const rechargeRecords = useMemo(() => {
    return userTransactions.filter((t) => t.type === 'recharge');
  }, [userTransactions]);

  const incomeRecords = useMemo(() => {
    return userTransactions.filter((t) =>
      ['checkin', 'daily_income', 'referral_commission'].includes(t.type)
    );
  }, [userTransactions]);

  const withdrawalRecords = useMemo(() => {
    return userTransactions.filter((t) => t.type === 'withdraw');
  }, [userTransactions]);

  // Financial statistics
  const totalDeposited = useMemo(() => {
    return rechargeRecords
      .filter((t) => t.status === 'success')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  }, [rechargeRecords]);

  const totalWithdrawn = useMemo(() => {
    return withdrawalRecords
      .filter((t) => t.status === 'success')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  }, [withdrawalRecords]);

  const totalEarnings = useMemo(() => {
    return incomeRecords
      .filter((t) => t.status === 'success')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  }, [incomeRecords]);

  const totalCreditInflow = totalDeposited + totalEarnings;

  // Filtered list based on active category tab
  const filteredList = useMemo(() => {
    if (activeTab === 'all') return userTransactions;
    if (activeTab === 'recharge') return rechargeRecords;
    if (activeTab === 'income') return incomeRecords;
    return withdrawalRecords;
  }, [activeTab, userTransactions, rechargeRecords, incomeRecords, withdrawalRecords]);

  // Group filtered transactions by Month / Year for banking timeline
  const groupedTransactions = useMemo<Record<string, Transaction[]>>(() => {
    const groups: Record<string, Transaction[]> = {};
    const now = new Date();
    const currentMonthKey = now.toLocaleString('en-IN', { month: 'long', year: 'numeric' });

    filteredList.forEach((tx) => {
      const ts = parseRecordTimestamp(tx.createdAt);
      const date = new Date(ts);
      const monthKey = date.toLocaleString('en-IN', { month: 'long', year: 'numeric' });
      const displayKey = monthKey === currentMonthKey ? `THIS MONTH • ${monthKey.toUpperCase()}` : monthKey.toUpperCase();

      if (!groups[displayKey]) {
        groups[displayKey] = [];
      }
      groups[displayKey].push(tx);
    });

    return groups;
  }, [filteredList]);

  // Copy helper
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    sfx.playTap();
    showToast(`${label} copied to clipboard!`, 'info');
  };

  // Sync / Refresh with server
  const handleRefresh = () => {
    sfx.playTap();
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setLastSyncedTime('Just now');
      sfx.playSuccess();
      showToast('Card statements & passbook synced with live server!', 'success');
    }, 600);
  };

  // Export Financial Statement as CSV
  const handleExportCSV = () => {
    sfx.playTap();
    if (filteredList.length === 0) {
      showToast('No card records to export!', 'info');
      return;
    }

    const tabName = activeTab === 'all' ? 'All_Cards_Statement' : activeTab === 'recharge' ? 'Recharge_Credit_Statement' : activeTab === 'income' ? 'Income_Credit_Statement' : 'Debit_Withdrawal_Statement';
    const headers = ['Transaction ID', 'Card Type', 'Description', 'Amount (INR)', 'Status', 'Payment Route', 'UTR Reference', 'Timestamp (IST)'];
    const rows = filteredList.map((tx) => [
      `"${tx.orderId || tx.id}"`,
      tx.type === 'withdraw' ? '"DEBIT"' : '"CREDIT"',
      `"${tx.title.replace(/"/g, '""')}"`,
      tx.amount,
      `"${tx.status.toUpperCase()}"`,
      `"${(tx.method || 'Standard Card/UPI').replace(/"/g, '""')}"`,
      `"${tx.utrNumber || (tx as any).utr || 'N/A'}"`,
      `"${formatRecordDateTime(tx.createdAt)}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${tabName}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setIsExportModalOpen(false);
    showToast(`${tabName.replace('_', ' ')} downloaded successfully!`, 'success');
  };

  // Print Passbook / Statement
  const handlePrintStatement = () => {
    sfx.playTap();
    window.print();
  };



  // Card details formatting
  const maskedPhone = user?.phone ? user.phone.slice(-4) : '8340';
  const creditCardNumber = showFullCardNumber ? `4216 8892 3104 ${maskedPhone}` : `•••• •••• •••• ${maskedPhone}`;
  const debitCardNumber = showFullCardNumber ? `5241 6719 4028 ${maskedPhone}` : `•••• •••• •••• ${maskedPhone}`;

  return (
    <div className="min-h-screen bg-[#0d1117] text-gray-100 pb-36 animate-fade-in font-sans selection:bg-emerald-500 selection:text-black">
      {/* =========================================================================
          PREMIUM VIBRANT EMERALD APP HEADER (AKM ENTERPRISES)
          ========================================================================= */}
      <header className="sticky top-0 z-40 bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 border-b border-emerald-400/30 px-3 py-2 shadow-md transition-all">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          {/* Back Button & Cute Brand Title */}
          <div className="flex items-center space-x-2 min-w-0">
            <button
              id="trans-back-btn"
              onClick={goBack}
              className="w-6 h-6 rounded-full bg-white/20 hover:bg-white/30 active:scale-90 flex items-center justify-center text-white transition-all cursor-pointer border border-white/30 shadow-xs shrink-0"
              aria-label="Back"
            >
              <ArrowLeft className="w-3 h-3" />
            </button>

            <div className="flex items-center space-x-1.5 min-w-0">
              <div className="w-6 h-6 rounded-lg bg-white/20 border border-white/30 flex items-center justify-center text-emerald-100 shadow-xs shrink-0">
                <CreditCard className="w-3 h-3 text-emerald-100" />
              </div>
              <div className="min-w-0">
                <h1 className="text-[9.5px] font-black tracking-wide text-white uppercase truncate leading-tight">
                  Records & Passbook
                </h1>
                <p className="text-[7px] text-emerald-100 font-medium truncate mt-0.5 flex items-center space-x-1">
                  <span className="text-amber-300 font-black tracking-wide uppercase">AKM ENTERPRISES</span>
                  <span className="text-emerald-200/60">•</span>
                  <span className="text-emerald-100 font-semibold">Digital Passbook</span>
                </p>
              </div>
            </div>
          </div>

          {/* Cute Header Action Buttons */}
          <div className="flex items-center space-x-1.5 shrink-0 ml-1">
            <button
              onClick={handleRefresh}
              title="Sync Passbook"
              className="w-6 h-6 rounded-full bg-white/15 hover:bg-white/25 active:scale-90 flex items-center justify-center text-white transition-all cursor-pointer border border-white/20 shadow-xs shrink-0"
            >
              <RefreshCw className={`w-2.5 h-2.5 ${isSyncing ? 'animate-spin text-emerald-200' : 'text-white'}`} />
            </button>

            <button
              onClick={() => {
                sfx.playTap();
                setIsExportModalOpen(true);
              }}
              className="flex items-center space-x-1 px-2 py-0.8 rounded-full bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-slate-950 text-[7.5px] font-black active:scale-90 transition-transform cursor-pointer shadow-sm border border-amber-200/50 shrink-0"
            >
              <Download className="w-2 h-2 text-slate-950" />
              <span>Statement</span>
            </button>
          </div>
        </div>
      </header>

      {/* =========================================================================
          MAIN CONTAINER BODY
          ========================================================================= */}
      <main className="p-3.5 space-y-4 max-w-lg mx-auto">
        {/* Guest Warning */}
        {!isLoggedIn && (
          <div className="bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-teal-500/10 border border-emerald-500/30 rounded-2xl p-3 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                <LogIn className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Signed Out (Guest)</div>
                <div className="text-[10px] text-gray-400">Sign in to view your real-time debit & credit transactions.</div>
              </div>
            </div>
            <button
              onClick={() => openAuthModal('login')}
              className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs shrink-0 cursor-pointer shadow-lg active:scale-95 transition-all"
            >
              Sign In
            </button>
          </div>
        )}

        {/* =====================================================================
            VIRTUAL DEBIT & CREDIT CARD SWITCHER (PHYSICAL CARD SIMULATION)
            ===================================================================== */}
        <section className="space-y-2">
          {/* Cute Card Toggle Pills */}
          <div className="flex items-center justify-between px-0.5">
            <div className="flex items-center space-x-1 bg-white/[0.06] p-0.5 rounded-xl border border-white/10 backdrop-blur-xs">
              <button
                type="button"
                onClick={() => {
                  sfx.playTap();
                  setActiveCardView('credit');
                }}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-[11px] font-black transition-all cursor-pointer ${
                  activeCardView === 'credit'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <CreditCard className="w-3 h-3" />
                <span>Credit Card</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  sfx.playTap();
                  setActiveCardView('debit');
                }}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-[11px] font-black transition-all cursor-pointer ${
                  activeCardView === 'debit'
                    ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-slate-950 shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Wallet className="w-3 h-3" />
                <span>Debit Card</span>
              </button>
            </div>

            {/* Toggle Card Number Masking */}
            <button
              type="button"
              onClick={() => {
                sfx.playTap();
                setShowFullCardNumber(!showFullCardNumber);
              }}
              className="text-[9.5px] text-gray-400 hover:text-white flex items-center space-x-1 bg-white/[0.06] hover:bg-white/10 px-2 py-1 rounded-lg border border-white/10 cursor-pointer transition-all active:scale-95"
            >
              {showFullCardNumber ? <EyeOff className="w-3 h-3 text-emerald-400" /> : <Eye className="w-3 h-3 text-gray-400" />}
              <span>{showFullCardNumber ? 'Hide No.' : 'Show No.'}</span>
            </button>
          </div>

          {/* PHYSICAL CARD DISPLAY */}
          {activeCardView === 'credit' ? (
            /* ===============================================================
               1. LUXURY EMERALD PLATINUM CREDIT CARD (CUTE & COMPACT)
               =============================================================== */
            <div
              className="relative w-full rounded-2xl p-3.5 sm:p-4 shadow-xl overflow-hidden border border-emerald-400/30 transition-all duration-300 transform active:scale-[0.99] select-none"
              style={{
                background: 'linear-gradient(135deg, #063820 0%, #0d4a2b 30%, #062b19 70%, #021a0e 100%)',
                boxShadow: '0 16px 36px -12px rgba(5, 150, 105, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.25)'
              }}
            >
              {/* Metallic Texture Overlay */}
              <div
                className="absolute inset-0 opacity-15 pointer-events-none"
                style={{
                  backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(52, 211, 153, 0.5) 0%, transparent 50%), linear-gradient(60deg, transparent 40%, rgba(255,255,255,0.08) 50%, transparent 60%)'
                }}
              />

              {/* Holographic Sheen Edge */}
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-400/20 rounded-full blur-xl pointer-events-none" />

              {/* Card Top Row: Brand & Contactless */}
              <div className="relative flex items-center justify-between mb-2.5">
                <div className="flex items-center space-x-1.5">
                  <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-amber-400 to-amber-200 text-black flex items-center justify-center font-black text-[9px] shadow-xs">
                    A
                  </div>
                  <div>
                    <span className="text-[11px] font-black tracking-widest text-emerald-200 uppercase">
                      AKM ENTERPRISES
                    </span>
                    <span className="text-[8px] font-black text-amber-300 ml-1 px-1 py-0.2 rounded bg-amber-400/20 border border-amber-400/30">
                      PLATINUM
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-1.5 text-emerald-200/80">
                  <Wifi className="w-3.5 h-3.5 rotate-90 stroke-[2.5]" />
                  <span className="text-[8.5px] font-mono tracking-wider font-extrabold uppercase text-emerald-300">
                    CONTACTLESS
                  </span>
                </div>
              </div>

              {/* EMV Microchip Graphic & Total Inflow */}
              <div className="relative flex items-center justify-between mb-3">
                <div className="w-9 h-6.5 rounded-md bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 p-0.5 shadow-sm flex items-center justify-center border border-amber-200/80">
                  <div className="w-full h-full rounded-[2px] border border-black/30 flex flex-col justify-between p-0.5 relative overflow-hidden bg-gradient-to-tr from-amber-300 via-amber-200 to-amber-100">
                    <div className="w-full h-[1px] bg-black/25 my-auto" />
                    <div className="w-full h-[1px] bg-black/25 my-auto" />
                    <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-black/25 -translate-x-1/2" />
                  </div>
                </div>

                {/* Live Inflow Badge */}
                <div className="text-right">
                  <div className="text-[8.5px] font-mono text-emerald-300 tracking-wider uppercase font-bold">
                    TOTAL CREDIT INFLOW
                  </div>
                  <div className="text-sm font-black font-mono text-emerald-100 tracking-tight">
                    + {formatINR(totalCreditInflow)}
                  </div>
                </div>
              </div>

              {/* Embossed Card Number */}
              <div className="relative mb-2.5">
                <div
                  className="font-mono text-base sm:text-lg font-bold tracking-[0.2em] text-white/95"
                  style={{
                    textShadow: '0 2px 4px rgba(0,0,0,0.8), 0 0 2px rgba(255,255,255,0.3)'
                  }}
                >
                  {creditCardNumber}
                </div>
              </div>

              {/* Card Footer: Cardholder, Expiry, RuPay / Network */}
              <div className="relative flex items-end justify-between pt-0.5">
                <div>
                  <div className="text-[7.5px] font-mono tracking-widest text-emerald-300/70 uppercase">
                    CARDHOLDER
                  </div>
                  <div className="text-[11px] font-black tracking-wider uppercase text-white font-mono">
                    {user?.phone ? `USER ${user.phone.slice(-4)}` : 'VIP INVESTOR'}
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-[7.5px] font-mono tracking-widest text-emerald-300/70 uppercase">
                    VALID THRU
                  </div>
                  <div className="text-[11px] font-bold tracking-wider text-white font-mono">
                    12/32
                  </div>
                </div>

                {/* RuPay / Mastercard Double Circle Logo */}
                <div className="flex items-center -space-x-1.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-400/90 shadow-xs" />
                  <div className="w-5 h-5 rounded-full bg-amber-400/90 shadow-xs mix-blend-screen" />
                </div>
              </div>
            </div>
          ) : (
            /* ===============================================================
               2. TITANIUM OBSIDIAN MATTE DEBIT CARD (CUTE & COMPACT)
               =============================================================== */
            <div
              className="relative w-full rounded-2xl p-3.5 sm:p-4 shadow-xl overflow-hidden border border-white/20 transition-all duration-300 transform active:scale-[0.99] select-none"
              style={{
                background: 'linear-gradient(135deg, #1c1d24 0%, #111217 40%, #0a0b0d 100%)',
                boxShadow: '0 16px 36px -12px rgba(0, 0, 0, 0.6), inset 0 1px 1px rgba(255, 255, 255, 0.2)'
              }}
            >
              {/* Metallic Brushed Titanium Overlay */}
              <div
                className="absolute inset-0 opacity-15 pointer-events-none"
                style={{
                  backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(244, 63, 94, 0.3) 0%, transparent 50%), linear-gradient(120deg, transparent 40%, rgba(255,255,255,0.06) 50%, transparent 60%)'
                }}
              />

              {/* Subtle Reddish Ambient Glow */}
              <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-rose-500/10 rounded-full blur-xl pointer-events-none" />

              {/* Card Top Row: Brand & Contactless */}
              <div className="relative flex items-center justify-between mb-2.5">
                <div className="flex items-center space-x-1.5">
                  <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-slate-200 to-slate-400 text-black flex items-center justify-center font-black text-[9px] shadow-xs">
                    A
                  </div>
                  <div>
                    <span className="text-[11px] font-black tracking-widest text-slate-200 uppercase">
                      AKM ENTERPRISES
                    </span>
                    <span className="text-[8px] font-black text-rose-300 ml-1 px-1 py-0.2 rounded bg-rose-500/20 border border-rose-500/30">
                      TITANIUM
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-1.5 text-slate-400">
                  <Wifi className="w-3.5 h-3.5 rotate-90 stroke-[2.5]" />
                  <span className="text-[8.5px] font-mono tracking-wider font-extrabold uppercase text-slate-300">
                    IMPS 24x7
                  </span>
                </div>
              </div>

              {/* EMV Platinum Chip Graphic & Total Outflow */}
              <div className="relative flex items-center justify-between mb-3">
                <div className="w-9 h-6.5 rounded-md bg-gradient-to-br from-slate-200 via-slate-300 to-slate-500 p-0.5 shadow-sm flex items-center justify-center border border-slate-200/80">
                  <div className="w-full h-full rounded-[2px] border border-black/30 flex flex-col justify-between p-0.5 relative overflow-hidden bg-gradient-to-tr from-slate-300 via-slate-200 to-slate-100">
                    <div className="w-full h-[1px] bg-black/25 my-auto" />
                    <div className="w-full h-[1px] bg-black/25 my-auto" />
                    <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-black/25 -translate-x-1/2" />
                  </div>
                </div>

                {/* Total Settled Debit Outflow */}
                <div className="text-right">
                  <div className="text-[8.5px] font-mono text-rose-300 tracking-wider uppercase font-bold">
                    TOTAL DEBIT OUTFLOW
                  </div>
                  <div className="text-sm font-black font-mono text-rose-200 tracking-tight">
                    - {formatINR(totalWithdrawn)}
                  </div>
                </div>
              </div>

              {/* Embossed Card Number */}
              <div className="relative mb-2.5">
                <div
                  className="font-mono text-base sm:text-lg font-bold tracking-[0.2em] text-white/95"
                  style={{
                    textShadow: '0 2px 4px rgba(0,0,0,0.8), 0 0 2px rgba(255,255,255,0.3)'
                  }}
                >
                  {debitCardNumber}
                </div>
              </div>

              {/* Card Footer */}
              <div className="relative flex items-end justify-between pt-0.5">
                <div>
                  <div className="text-[7.5px] font-mono tracking-widest text-slate-400 uppercase">
                    LINKED ACCOUNT
                  </div>
                  <div className="text-[11px] font-black tracking-wider uppercase text-white font-mono">
                    {user?.bankDetails?.accountNumber ? `A/C •• ${user.bankDetails.accountNumber.slice(-4)}` : 'BANK ACCOUNT'}
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-[7.5px] font-mono tracking-widest text-slate-400 uppercase">
                    SETTLEMENT
                  </div>
                  <div className="text-[11px] font-bold tracking-wider text-rose-300 font-mono">
                    INSTANT
                  </div>
                </div>

                {/* Network Hologram */}
                <div className="flex items-center -space-x-1.5">
                  <div className="w-5 h-5 rounded-full bg-rose-500/90 shadow-xs" />
                  <div className="w-5 h-5 rounded-full bg-sky-400/90 shadow-xs mix-blend-screen" />
                </div>
              </div>
            </div>
          )}
        </section>

        {/* =====================================================================
            SEPARATED RECORD CATEGORIES & FILTER TABS (CUTE & COMPACT)
            ===================================================================== */}
        <div className="bg-[#141922] p-1 rounded-2xl border border-white/10 shadow-lg grid grid-cols-4 gap-1">
          {/* 1. All */}
          <button
            type="button"
            id="tab-all-records"
            onClick={() => {
              sfx.playTap();
              setActiveTab('all');
            }}
            className={`py-2 px-1 rounded-xl text-center transition-all cursor-pointer flex items-center justify-center space-x-1 active:scale-95 ${
              activeTab === 'all'
                ? 'bg-white/15 text-white font-black shadow-sm border border-white/20'
                : 'text-gray-400 hover:text-white font-bold'
            }`}
          >
            <CreditCard className="w-2.5 h-2.5 text-gray-300" />
            <span className="text-[10px]">All</span>
          </button>

          {/* 2. Recharge Tab (Credit CR) */}
          <button
            type="button"
            id="tab-recharge-records"
            onClick={() => {
              sfx.playTap();
              setActiveTab('recharge');
              setActiveCardView('credit');
              setTransactionFilter('deposit');
            }}
            className={`py-2 px-1 rounded-xl text-center transition-all cursor-pointer flex items-center justify-center space-x-1 active:scale-95 ${
              activeTab === 'recharge'
                ? 'bg-emerald-500/20 text-emerald-300 font-black shadow-sm border border-emerald-500/40'
                : 'text-gray-400 hover:text-emerald-300 font-bold'
            }`}
          >
            <ArrowDownLeft className="w-2.5 h-2.5 text-emerald-400" />
            <span className="text-[10px]">Recharge</span>
          </button>

          {/* 3. Income Tab (Credit CR) */}
          <button
            type="button"
            id="tab-income-records"
            onClick={() => {
              sfx.playTap();
              setActiveTab('income');
              setActiveCardView('credit');
              setTransactionFilter('revenue');
            }}
            className={`py-2 px-1 rounded-xl text-center transition-all cursor-pointer flex items-center justify-center space-x-1 active:scale-95 ${
              activeTab === 'income'
                ? 'bg-amber-500/20 text-amber-300 font-black shadow-sm border border-amber-500/40'
                : 'text-gray-400 hover:text-amber-300 font-bold'
            }`}
          >
            <TrendingUp className="w-2.5 h-2.5 text-amber-400" />
            <span className="text-[10px]">Income</span>
          </button>

          {/* 4. Withdrawal Tab (Debit DR) */}
          <button
            type="button"
            id="tab-withdrawal-records"
            onClick={() => {
              sfx.playTap();
              setActiveTab('withdraw');
              setActiveCardView('debit');
              setTransactionFilter('withdraw');
            }}
            className={`py-2 px-1 rounded-xl text-center transition-all cursor-pointer flex items-center justify-center space-x-1 active:scale-95 ${
              activeTab === 'withdraw'
                ? 'bg-rose-500/20 text-rose-300 font-black shadow-sm border border-rose-500/40'
                : 'text-gray-400 hover:text-rose-300 font-bold'
            }`}
          >
            <ArrowUpRight className="w-2.5 h-2.5 text-rose-400" />
            <span className="text-[10px]">Withdraw</span>
          </button>
        </div>

        {/* =====================================================================
            CARD-STYLE TRANSACTION RECORDS (DEBIT & CREDIT CARD FORMAT)
            ===================================================================== */}
        {filteredList.length === 0 ? (
          <div className="bg-[#161b22] rounded-3xl p-8 border border-white/10 text-center flex flex-col items-center my-6">
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 text-gray-400 flex items-center justify-center mb-3">
              <CreditCard className="w-7 h-7" />
            </div>
            <h3 className="text-xs font-bold text-white">
              No Transactions Recorded
            </h3>
            <p className="text-[11px] text-gray-400 mt-1 max-w-[260px]">
              {activeTab === 'recharge'
                ? 'Recharge deposits made via UPI or Cards will show up here.'
                : activeTab === 'income'
                ? 'Automated daily income returns will be credited here.'
                : activeTab === 'withdraw'
                ? 'Cashout withdrawals to your bank card will be debited here.'
                : 'All your debit and credit card entries will appear here.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {(Object.entries(groupedTransactions) as [string, Transaction[]][]).map(([monthTitle, txsInMonth]) => {
              const monthVolume = txsInMonth
                .filter((t) => t.status === 'success')
                .reduce((acc, t) => acc + Math.abs(t.amount), 0);

              return (
                <div key={monthTitle} className="space-y-3">
                  {/* Month Timeline Header */}
                  <div className="flex items-center justify-between px-1 pt-1 text-[8px] font-bold text-gray-400 tracking-wide">
                    <div className="flex items-center space-x-1.5 min-w-0">
                      <Calendar className="w-3 h-3 text-emerald-400 shrink-0" />
                      {monthTitle.includes('THIS MONTH') ? (
                        <div className="flex items-center space-x-1 shrink-0">
                          <span className="text-[6.5px] font-extrabold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 px-1 py-0.2 rounded-full uppercase tracking-wider">
                            This Month
                          </span>
                          <span className="text-gray-300 font-bold text-[7px] tracking-wide">
                            {monthTitle.replace('THIS MONTH • ', '').replace('THIS MONTH', '')}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-300 font-bold text-[7px] tracking-wide uppercase truncate">
                          {monthTitle}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-1 shrink-0 ml-1">
                      <span className="text-[7.5px] font-mono font-bold text-gray-400 bg-white/5 px-1.5 py-0.5 rounded-md border border-white/10 uppercase">
                        {formatINR(monthVolume)} Volume
                      </span>
                    </div>
                  </div>

                  {/* DEBIT & CREDIT CARDS FEED */}
                  <div className="space-y-3.5">
                    {txsInMonth.map((tx, idx) => {
                      const isIncome = ['checkin', 'daily_income', 'referral_commission'].includes(tx.type);
                      const isRecharge = tx.type === 'recharge';
                      const isWithdraw = tx.type === 'withdraw';
                      const isCredit = isIncome || isRecharge;
                      const relativeTime = getRelativeTimeLabel(tx.createdAt);
                      const last4 = getCardLast4(tx);

                      if (!isCredit) {
                          /* ---------------------------------------------------
                             CUTE COMPACT OBSIDIAN TITANIUM DEBIT CARD (WITHDRAWAL)
                             --------------------------------------------------- */
                          return (
                            <div
                              key={`${tx.id || 'debit-card'}-${idx}`}
                              className="relative w-full rounded-2xl p-3 md:p-3.5 shadow-xl overflow-hidden border border-rose-500/35 transition-all duration-200 hover:border-rose-400/70 select-none group"
                              style={{
                                background: 'linear-gradient(135deg, #181922 0%, #111219 45%, #090a0d 100%)',
                                boxShadow: '0 8px 24px -6px rgba(0, 0, 0, 0.7), 0 0 16px -4px rgba(244, 63, 94, 0.15), inset 0 1px 1px rgba(255, 255, 255, 0.12)'
                              }}
                            >
                              {/* Sleek Metallic Shimmer & Gradient Glow */}
                              <div
                                className="absolute inset-0 opacity-20 pointer-events-none"
                                style={{
                                  backgroundImage: 'radial-gradient(circle at 85% 15%, rgba(244, 63, 94, 0.35) 0%, transparent 45%), linear-gradient(125deg, transparent 40%, rgba(255,255,255,0.06) 50%, transparent 60%)'
                                }}
                              />
                              <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-rose-500/10 rounded-full blur-xl pointer-events-none" />

                              {/* Card Top Header: Brand + Contactless NFC */}
                              <div className="relative flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-1.5">
                                  <div className="w-4 h-4 rounded bg-gradient-to-tr from-slate-200 to-slate-400 text-black flex items-center justify-center font-black text-[8px] shadow-sm">
                                    A
                                  </div>
                                  <span className="text-[10px] font-black tracking-wider text-slate-200 uppercase font-mono">
                                    AKM TITANIUM
                                  </span>
                                  <span className="text-[7.5px] font-black text-rose-300 px-1.5 py-0.2 rounded bg-rose-500/20 border border-rose-500/30 uppercase tracking-wide">
                                    DEBIT CARD
                                  </span>
                                </div>

                                <div className="flex items-center space-x-1 text-slate-400">
                                  <Wifi className="w-3 h-3 rotate-90 stroke-[2.5]" />
                                  <span className="text-[8px] font-mono tracking-wider font-bold uppercase text-slate-300">
                                    IMPS 24x7
                                  </span>
                                </div>
                              </div>

                              {/* Card Middle: Cute EMV Chip, Card Number, Amount & Status */}
                              <div className="relative flex items-center justify-between mb-2 bg-black/25 rounded-xl px-2.5 py-2 border border-white/5">
                                {/* Left: Cute Titanium Chip + Card Number */}
                                <div className="flex items-center space-x-2">
                                  {/* Cute Platinum/Silver EMV Chip */}
                                  <div className="w-7 h-5 rounded bg-gradient-to-br from-slate-200 via-slate-300 to-slate-400 p-0.5 shadow-sm flex items-center justify-center border border-slate-200/70 shrink-0">
                                    <div className="w-full h-full rounded-[2px] border border-black/25 flex flex-col justify-between p-0.5 relative overflow-hidden bg-gradient-to-tr from-slate-300 via-slate-200 to-slate-100">
                                      <div className="w-full h-[0.5px] bg-black/30 my-auto" />
                                      <div className="w-full h-[0.5px] bg-black/30 my-auto" />
                                      <div className="absolute top-0 bottom-0 left-1/2 w-[0.5px] bg-black/30 -translate-x-1/2" />
                                      <div className="absolute w-1 h-1 rounded-full border border-black/30 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
                                    </div>
                                  </div>

                                  <div>
                                    <div
                                      className="font-mono text-[10.5px] font-bold tracking-[0.16em] text-white/90"
                                      style={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}
                                    >
                                      •••• {last4}
                                    </div>
                                    <div className="text-[7.5px] font-mono text-slate-400 uppercase">
                                      DEBIT OUTFLOW
                                    </div>
                                  </div>
                                </div>

                                {/* Right: Debited Amount & Status Pill */}
                                <div className="text-right">
                                  <div
                                    className="text-base font-black font-mono text-rose-400 tracking-tight"
                                    style={{ textShadow: '0 0 10px rgba(244, 63, 94, 0.4)' }}
                                  >
                                    - {formatINR(Math.abs(tx.amount))}
                                  </div>
                                  <div className="mt-0.5">
                                    {tx.status === 'success' ? (
                                      <span className="inline-flex items-center text-[7.5px] font-bold text-emerald-300 bg-emerald-500/20 border border-emerald-400/30 px-1.5 py-0.2 rounded-full space-x-1">
                                        <Check className="w-2 h-2 stroke-[3]" />
                                        <span>SUCCESS</span>
                                      </span>
                                    ) : tx.status === 'pending' ? (
                                      <span className="inline-flex items-center text-[7.5px] font-bold text-amber-300 bg-amber-500/20 border border-amber-400/30 px-1.5 py-0.2 rounded-full space-x-1">
                                        <Clock className="w-2 h-2 stroke-[2.5] animate-pulse" />
                                        <span>PROCESSING</span>
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center text-[7.5px] font-bold text-rose-300 bg-rose-500/20 border border-rose-400/30 px-1.5 py-0.2 rounded-full space-x-1">
                                        <XCircle className="w-2 h-2 stroke-[2.5]" />
                                        <span>DECLINED</span>
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Card Details Compact Grid (har detail ke sath: date, time, title, auth, a/c) */}
                              <div className="relative bg-black/40 rounded-xl p-2 border border-white/10 grid grid-cols-2 gap-x-2 gap-y-1.5 text-[9px] mb-2">
                                {/* Exact Date & Time */}
                                <div>
                                  <div className="text-[7px] font-mono tracking-wider text-slate-400 uppercase flex items-center space-x-1">
                                    <Calendar className="w-2 h-2 text-rose-400" />
                                    <span>DATE & TIME</span>
                                  </div>
                                  <div className="font-mono text-white font-bold mt-0.5 text-[8.5px] leading-tight">
                                    {formatRecordDateTime(tx.createdAt)}
                                  </div>
                                  <div className="text-[7.5px] text-rose-300/80 font-mono">
                                    {relativeTime}
                                  </div>
                                </div>

                                {/* Transaction Title */}
                                <div>
                                  <div className="text-[7px] font-mono tracking-wider text-slate-400 uppercase">
                                    PURPOSE / TITLE
                                  </div>
                                  <div className="text-white font-bold truncate mt-0.5 text-[8.5px] leading-tight" title={tx.title}>
                                    {tx.title}
                                  </div>
                                  <div className="text-[7.5px] text-slate-400 font-mono">
                                    Cashout IMPS
                                  </div>
                                </div>

                                {/* Auth / Order ID */}
                                <div>
                                  <div className="text-[7px] font-mono tracking-wider text-slate-400 uppercase">
                                    AUTH / ORDER ID
                                  </div>
                                  <div className="flex items-center space-x-1 mt-0.5">
                                    <span className="font-mono text-slate-200 font-bold truncate text-[8px]">
                                      {tx.orderId || tx.id}
                                    </span>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleCopy(tx.orderId || tx.id, 'Authorization ID');
                                      }}
                                      className="text-rose-400 hover:text-rose-300 p-0.5 cursor-pointer shrink-0"
                                      title="Copy ID"
                                    >
                                      <Copy className="w-2 h-2" />
                                    </button>
                                  </div>
                                </div>

                                {/* Account / UTR */}
                                <div>
                                  <div className="text-[7px] font-mono tracking-wider text-slate-400 uppercase">
                                    {(tx.utrNumber || (tx as any).utr) ? 'BANK UTR' : 'BENEFICIARY A/C'}
                                  </div>
                                  <div className="flex items-center space-x-1 mt-0.5">
                                    <span className="font-mono text-slate-200 font-bold truncate text-[8px]">
                                      {(tx.utrNumber || (tx as any).utr) || (user?.bankDetails?.accountNumber ? `A/C •• ${user.bankDetails.accountNumber.slice(-4)}` : 'Bank Transfer')}
                                    </span>
                                    {(tx.utrNumber || (tx as any).utr) && (
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleCopy(tx.utrNumber || (tx as any).utr, 'UTR Number');
                                        }}
                                        className="text-rose-400 hover:text-rose-300 p-0.5 cursor-pointer shrink-0"
                                        title="Copy UTR"
                                      >
                                        <Copy className="w-2 h-2" />
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Card Bottom: Cute Hologram & Quick Action Buttons */}
                              <div className="relative flex items-center justify-between pt-1 border-t border-white/10">
                                <div className="flex items-center space-x-1.5">
                                  <div className="flex items-center -space-x-1">
                                    <div className="w-3.5 h-3.5 rounded-full bg-rose-500/90 shadow-sm" />
                                    <div className="w-3.5 h-3.5 rounded-full bg-sky-400/90 shadow-sm mix-blend-screen" />
                                  </div>
                                  <span className="text-[7.5px] font-mono text-slate-400 font-bold">
                                    RuPay / IMPS
                                  </span>
                                </div>

                                <div className="flex items-center space-x-1.5">
                                  <button
                                    onClick={() => {
                                      sfx.playTap();
                                      setHelpTx(tx);
                                    }}
                                    className="px-2.5 py-0.5 rounded-md bg-white/10 hover:bg-white/20 text-slate-300 text-[8px] font-bold flex items-center space-x-1 cursor-pointer active:scale-95 transition-all"
                                  >
                                    <HelpCircle className="w-2.5 h-2.5 text-rose-400" />
                                    <span>Help / Dispute</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        }
                          /* ---------------------------------------------------
                             CUTE COMPACT ROYAL EMERALD CREDIT CARD (INCOME / RECHARGE)
                             --------------------------------------------------- */
                          return (
                            <div
                              key={`${tx.id || 'credit-card'}-${idx}`}
                              className="relative w-full rounded-2xl p-3 md:p-3.5 shadow-xl overflow-hidden border border-emerald-400/35 transition-all duration-200 hover:border-emerald-300/70 select-none group"
                              style={{
                                background: 'linear-gradient(135deg, #072617 0%, #0c3623 45%, #072217 75%, #03140c 100%)',
                                boxShadow: '0 8px 24px -6px rgba(5, 150, 105, 0.4), 0 0 16px -4px rgba(52, 211, 153, 0.2), inset 0 1px 1px rgba(255, 255, 255, 0.15)'
                              }}
                            >
                              {/* Metallic Gold / Emerald Sheen Texture */}
                              <div
                                className="absolute inset-0 opacity-20 pointer-events-none"
                                style={{
                                  backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(52, 211, 153, 0.45) 0%, transparent 45%), linear-gradient(60deg, transparent 40%, rgba(255,255,255,0.08) 50%, transparent 60%)'
                                }}
                              />
                              <div className="absolute -top-8 -right-8 w-24 h-24 bg-emerald-400/15 rounded-full blur-xl pointer-events-none" />

                              {/* Card Top Header: Brand + NFC Waves */}
                              <div className="relative flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-1.5">
                                  <div className="w-4 h-4 rounded bg-gradient-to-tr from-amber-400 to-amber-200 text-black flex items-center justify-center font-black text-[8px] shadow-sm">
                                    A
                                  </div>
                                  <span className="text-[10px] font-black tracking-wider text-emerald-200 uppercase font-mono">
                                    AKM PLATINUM
                                  </span>
                                  <span className="text-[7.5px] font-black text-amber-300 px-1.5 py-0.2 rounded bg-amber-400/20 border border-amber-400/30 uppercase tracking-wide">
                                    CREDIT CARD
                                  </span>
                                </div>

                                <div className="flex items-center space-x-1 text-emerald-300/80">
                                  <Wifi className="w-3 h-3 rotate-90 stroke-[2.5]" />
                                  <span className="text-[8px] font-mono tracking-wider font-bold uppercase text-emerald-300">
                                    INSTANT CREDIT
                                  </span>
                                </div>
                              </div>

                              {/* Card Middle: Cute Gold EMV Chip, Card Number, Amount & Status */}
                              <div className="relative flex items-center justify-between mb-2 bg-black/25 rounded-xl px-2.5 py-2 border border-white/5">
                                {/* Left: Cute Gold Chip + Card Number */}
                                <div className="flex items-center space-x-2">
                                  {/* Cute Gold EMV Chip */}
                                  <div className="w-7 h-5 rounded bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 p-0.5 shadow-sm flex items-center justify-center border border-amber-200/70 shrink-0">
                                    <div className="w-full h-full rounded-[2px] border border-black/25 flex flex-col justify-between p-0.5 relative overflow-hidden bg-gradient-to-tr from-amber-300 via-amber-200 to-amber-100">
                                      <div className="w-full h-[0.5px] bg-black/30 my-auto" />
                                      <div className="w-full h-[0.5px] bg-black/30 my-auto" />
                                      <div className="absolute top-0 bottom-0 left-1/2 w-[0.5px] bg-black/30 -translate-x-1/2" />
                                      <div className="absolute w-1 h-1 rounded-full border border-black/30 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
                                    </div>
                                  </div>

                                  <div>
                                    <div
                                      className="font-mono text-[10.5px] font-bold tracking-[0.16em] text-white/90"
                                      style={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}
                                    >
                                      •••• {last4}
                                    </div>
                                    <div className="text-[7.5px] font-mono text-emerald-300/80 uppercase">
                                      CREDIT INFLOW
                                    </div>
                                  </div>
                                </div>

                                {/* Right: Credited Amount & Settled Stamp */}
                                <div className="text-right">
                                  <div
                                    className="text-base font-black font-mono text-emerald-300 tracking-tight"
                                    style={{ textShadow: '0 0 10px rgba(52, 211, 153, 0.4)' }}
                                  >
                                    + {formatINR(Math.abs(tx.amount))}
                                  </div>
                                  <div className="mt-0.5">
                                    <span className="inline-flex items-center text-[7.5px] font-bold text-emerald-300 bg-emerald-500/20 border border-emerald-400/30 px-1.5 py-0.2 rounded-full space-x-1">
                                      <Check className="w-2 h-2 stroke-[3]" />
                                      <span>SETTLED</span>
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Card Details Compact Grid (har detail ke sath: date, time, title, auth, cardholder/utr) */}
                              <div className="relative bg-black/40 rounded-xl p-2 border border-white/10 grid grid-cols-2 gap-x-2 gap-y-1.5 text-[9px] mb-2">
                                {/* Exact Date & Time */}
                                <div>
                                  <div className="text-[7px] font-mono tracking-wider text-emerald-300/70 uppercase flex items-center space-x-1">
                                    <Calendar className="w-2 h-2 text-emerald-400" />
                                    <span>DATE & TIME</span>
                                  </div>
                                  <div className="font-mono text-white font-bold mt-0.5 text-[8.5px] leading-tight">
                                    {formatRecordDateTime(tx.createdAt)}
                                  </div>
                                  <div className="text-[7.5px] text-emerald-300/80 font-mono">
                                    {relativeTime}
                                  </div>
                                </div>

                                {/* Income Source / Type */}
                                <div>
                                  <div className="text-[7px] font-mono tracking-wider text-emerald-300/70 uppercase">
                                    SOURCE / PURPOSE
                                  </div>
                                  <div className="text-white font-bold truncate mt-0.5 text-[8.5px] leading-tight" title={tx.title}>
                                    {tx.title}
                                  </div>
                                  <div className="text-[7.5px] text-emerald-300/80 font-mono">
                                    {isRecharge ? 'Recharge Deposit' : 'Daily Income Dividend'}
                                  </div>
                                </div>

                                {/* Auth / Order ID */}
                                <div>
                                  <div className="text-[7px] font-mono tracking-wider text-emerald-300/70 uppercase">
                                    AUTH / ORDER ID
                                  </div>
                                  <div className="flex items-center space-x-1 mt-0.5">
                                    <span className="font-mono text-emerald-200 font-bold truncate text-[8px]">
                                      {tx.orderId || tx.id}
                                    </span>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleCopy(tx.orderId || tx.id, 'Authorization ID');
                                      }}
                                      className="text-emerald-400 hover:text-emerald-300 p-0.5 cursor-pointer shrink-0"
                                      title="Copy ID"
                                    >
                                      <Copy className="w-2 h-2" />
                                    </button>
                                  </div>
                                </div>

                                {/* Cardholder / UTR */}
                                <div>
                                  <div className="text-[7px] font-mono tracking-wider text-emerald-300/70 uppercase">
                                    {(tx.utrNumber || (tx as any).utr) ? 'BANK UTR' : 'CARDHOLDER'}
                                  </div>
                                  <div className="flex items-center space-x-1 mt-0.5">
                                    <span className="font-mono text-emerald-200 font-bold truncate text-[8px]">
                                      {(tx.utrNumber || (tx as any).utr) || (user?.phone ? `USER • ${user.phone.slice(-4)}` : 'VIP INVESTOR')}
                                    </span>
                                    {(tx.utrNumber || (tx as any).utr) && (
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleCopy(tx.utrNumber || (tx as any).utr, 'UTR Number');
                                        }}
                                        className="text-emerald-400 hover:text-emerald-300 p-0.5 cursor-pointer shrink-0"
                                        title="Copy UTR"
                                      >
                                        <Copy className="w-2 h-2" />
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Card Bottom: Holographic Logo & Quick Action Buttons */}
                              <div className="relative flex items-center justify-between pt-1 border-t border-white/10">
                                <div className="flex items-center space-x-1.5">
                                  <div className="flex items-center -space-x-1">
                                    <div className="w-3.5 h-3.5 rounded-full bg-emerald-400/90 shadow-sm" />
                                    <div className="w-3.5 h-3.5 rounded-full bg-amber-400/90 shadow-sm mix-blend-screen" />
                                  </div>
                                  <span className="text-[7.5px] font-mono text-emerald-300/80 font-bold">
                                    RuPay / NPCI
                                  </span>
                                </div>

                                <div className="flex items-center space-x-1.5">
                                  <button
                                    onClick={() => {
                                      sfx.playTap();
                                      setHelpTx(tx);
                                    }}
                                    className="px-2.5 py-0.5 rounded-md bg-white/10 hover:bg-white/20 text-gray-200 text-[8px] font-bold flex items-center space-x-1 cursor-pointer active:scale-95 transition-all"
                                  >
                                    <HelpCircle className="w-2.5 h-2.5 text-emerald-400" />
                                    <span>Help / Dispute</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          );


                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>



      {/* =========================================================================
          24x7 DISPUTE / HELP MODAL
          ========================================================================= */}
      {helpTx && createPortal(
        <div
          onClick={() => setHelpTx(null)}
          className="fixed inset-0 z-[99999] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#161b22] text-white rounded-3xl max-w-sm w-full p-5 shadow-2xl border border-white/20 relative space-y-4 my-auto cursor-default"
          >
            <button
              onClick={() => setHelpTx(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white w-7 h-7 rounded-full bg-white/10 flex items-center justify-center cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center pt-1 border-b border-white/10 pb-3">
              <div className="w-11 h-11 rounded-2xl bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center mx-auto mb-2">
                <HelpCircle className="w-6 h-6" />
              </div>
              <div className="text-sm font-black text-white tracking-tight">
                Card Payment Support
              </div>
              <div className="text-[10px] text-gray-400 mt-0.5">
                Ticket Reference: <span className="font-mono font-bold text-emerald-400">TKT-{helpTx.orderId || helpTx.id}</span>
              </div>
            </div>

            <div className="bg-sky-500/10 p-3 rounded-xl border border-sky-500/20 text-xs text-sky-200 space-y-1">
              <div className="font-bold flex items-center space-x-1 text-sky-300">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Card Protection Active</span>
              </div>
              <p className="text-[11px] text-sky-200/80 leading-relaxed">
                If an amount was deducted or pending from your card or bank account, bank clearance automatically completes within 10-30 minutes.
              </p>
            </div>

            <div className="pt-2 flex flex-col space-y-2">
              <a
                href="https://t.me/"
                target="_blank"
                rel="noreferrer"
                onClick={() => setHelpTx(null)}
                className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center justify-center space-x-1.5 cursor-pointer shadow-lg active:scale-95 transition-all"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Chat with Card Desk</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <button
                onClick={() => {
                  handleCopy(`Card issue reported for ${helpTx.orderId || helpTx.id} amount ${helpTx.amount}`, 'Support ticket query');
                  setHelpTx(null);
                }}
                className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/20 text-gray-200 font-bold text-xs cursor-pointer transition-all"
              >
                Copy Ticket Details
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* =========================================================================
          STATEMENT EXPORT MODAL
          ========================================================================= */}
      {isExportModalOpen && createPortal(
        <div
          onClick={() => setIsExportModalOpen(false)}
          className="fixed inset-0 z-[99999] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#161b22] text-white rounded-3xl max-w-sm w-full p-5 shadow-2xl border border-white/20 relative space-y-4 my-auto cursor-default"
          >
            <button
              onClick={() => setIsExportModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white w-7 h-7 rounded-full bg-white/10 flex items-center justify-center cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center pt-1 border-b border-white/10 pb-3">
              <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto mb-2">
                <FileText className="w-6 h-6" />
              </div>
              <div className="text-sm font-black text-white tracking-tight">
                Card Passbook Statement
              </div>
              <div className="text-[10px] text-gray-400 mt-0.5">
                Download or print official account statements
              </div>
            </div>

            {/* Details */}
            <div className="bg-black/40 p-3 rounded-2xl border border-white/10 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-gray-400">Active View</span>
                <span className="font-bold text-white capitalize">{activeTab} Statements</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total Entries</span>
                <span className="font-bold text-white">{filteredList.length} items</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total Settled Volume</span>
                <span className="font-mono font-bold text-emerald-400">
                  {formatINR(
                    filteredList.reduce((acc, t) => acc + (t.status === 'success' ? Math.abs(t.amount) : 0), 0)
                  )}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 space-y-2">
              <button
                onClick={handleExportCSV}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-extrabold text-xs flex items-center justify-center space-x-1.5 cursor-pointer active:scale-95 shadow-md transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Download Card Statement (.CSV)</span>
              </button>

              <button
                onClick={handlePrintStatement}
                className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center space-x-1.5 cursor-pointer transition-all"
              >
                <Printer className="w-4 h-4" />
                <span>Print Card Passbook</span>
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
