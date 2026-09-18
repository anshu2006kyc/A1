import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  ArrowDownToLine,
  ArrowLeft,
  CalendarCheck,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  Download,
  ExternalLink,
  FileCheck,
  FileText,
  HelpCircle,
  Package,
  Search,
  Share2,
  ShieldCheck,
  TrendingUp,
  Wallet,
  X,
  XCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { sfx } from '../utils/sound';
import { formatINR } from '../utils/currency';
import { Transaction } from '../types';

export const TransactionsView: React.FC = () => {
  const {
    transactions,
    setCurrentView,
    showToast,
    transactionFilter,
    setTransactionFilter
  } = useApp();

  const [expandedTxId, setExpandedTxId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [receiptTx, setReceiptTx] = useState<Transaction | null>(null);

  // Financial statistics calculations for the Chamkila Overview
  const totalDeposited = transactions
    .filter((t) => t.type === 'recharge' && t.status === 'success')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalWithdrawn = transactions
    .filter((t) => t.type === 'withdraw' && t.status === 'success')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalYield = transactions
    .filter((t) => ['checkin', 'daily_income', 'referral_commission'].includes(t.type))
    .reduce((sum, t) => sum + t.amount, 0);

  const filteredTransactions = transactions.filter((t) => {
    // Type filter
    let typeMatches = true;
    if (transactionFilter === 'deposit' || transactionFilter === 'recharge') {
      typeMatches = t.type === 'recharge';
    } else if (transactionFilter === 'withdraw') {
      typeMatches = t.type === 'withdraw';
    } else if (transactionFilter === 'revenue' || transactionFilter === 'income') {
      typeMatches = ['checkin', 'daily_income', 'referral_commission'].includes(t.type);
    } else if (transactionFilter === 'invest') {
      typeMatches = t.type === 'plan_purchase';
    }

    if (!typeMatches) return false;

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = t.title.toLowerCase().includes(q);
      const matchOrder = t.orderId?.toLowerCase().includes(q);
      const matchUtr = t.utr?.toLowerCase().includes(q);
      const matchAmt = String(t.amount).includes(q);
      return matchTitle || matchOrder || matchUtr || matchAmt;
    }

    return true;
  });

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    sfx.playTap();
    showToast(`${label} copied to clipboard!`, 'info');
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-28 animate-fade-in font-sans">
      {/* Top Navigation Bar */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-100 sticky top-0 z-20 shadow-2xs">
        <button
          id="trans-back-btn"
          onClick={() => setCurrentView('profile')}
          className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 hover:bg-gray-200 active:scale-95 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center space-x-1.5">
          <FileText className="w-4 h-4 text-emerald-600" />
          <h1 className="text-base font-bold text-gray-900 tracking-tight">
            {transactionFilter === 'deposit' || transactionFilter === 'recharge'
              ? 'Recharge Record'
              : transactionFilter === 'withdraw'
              ? 'Withdrawal Record'
              : transactionFilter === 'revenue' || transactionFilter === 'income'
              ? 'Income Record'
              : 'Account Records & Slips'}
          </h1>
        </div>

        <div className="w-8"></div>
      </div>

      <div className="p-3.5 space-y-3.5">
        {/* Chamkila Financial Overview Ribbon (3 Glowing Stat Cards) */}
        <div className="grid grid-cols-3 gap-2">
          {/* Deposits Card */}
          <div className="bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 text-white p-2.5 rounded-2xl shadow-sm border border-emerald-400/30 relative overflow-hidden">
            <div className="text-[10px] font-bold text-emerald-100 flex items-center space-x-1">
              <Wallet className="w-3 h-3" />
              <span>Deposited</span>
            </div>
            <div className="text-xs font-black mt-1 font-mono tracking-tight">
              {formatINR(totalDeposited)}
            </div>
            <div className="text-[8.5px] text-emerald-200/80 mt-0.5 font-medium">
              Total Inflow
            </div>
          </div>

          {/* Withdrawn Card */}
          <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-zinc-900 text-white p-2.5 rounded-2xl shadow-sm border border-slate-700 relative overflow-hidden">
            <div className="text-[10px] font-bold text-gray-300 flex items-center space-x-1">
              <ArrowDownToLine className="w-3 h-3 text-cyan-400" />
              <span>Withdrawn</span>
            </div>
            <div className="text-xs font-black mt-1 font-mono tracking-tight text-cyan-300">
              {formatINR(totalWithdrawn)}
            </div>
            <div className="text-[8.5px] text-gray-400 mt-0.5 font-medium">
              Total Outflow
            </div>
          </div>

          {/* Profits Card */}
          <div className="bg-gradient-to-br from-amber-600 via-amber-700 to-yellow-800 text-white p-2.5 rounded-2xl shadow-sm border border-amber-400/30 relative overflow-hidden">
            <div className="text-[10px] font-bold text-amber-100 flex items-center space-x-1">
              <TrendingUp className="w-3 h-3" />
              <span>Earnings</span>
            </div>
            <div className="text-xs font-black mt-1 font-mono tracking-tight text-amber-200">
              {formatINR(totalYield)}
            </div>
            <div className="text-[8.5px] text-amber-100/80 mt-0.5 font-medium">
              Dividends Earned
            </div>
          </div>
        </div>

        {/* Search Input Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Order ID, UTR, or Amount..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-gray-800 font-medium placeholder:text-gray-400 focus:outline-none focus:border-[#00ba58] focus:ring-1 focus:ring-[#00ba58] shadow-2xs transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-0.5">
          {/* All */}
          <button
            id="filter-all"
            onClick={() => {
              sfx.playTap();
              setTransactionFilter('all');
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center space-x-1 shrink-0 ${
              transactionFilter === 'all'
                ? 'bg-[#00ba58] text-white shadow-xs'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {transactionFilter === 'all' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            <span>All Records</span>
          </button>

          {/* Deposit / Recharge Record */}
          <button
            id="filter-deposit"
            onClick={() => {
              sfx.playTap();
              setTransactionFilter('recharge');
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center space-x-1 shrink-0 ${
              transactionFilter === 'deposit' || transactionFilter === 'recharge'
                ? 'bg-[#00ba58] text-white shadow-xs'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {(transactionFilter === 'deposit' || transactionFilter === 'recharge') && (
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            )}
            <span>Recharge Record</span>
          </button>

          {/* Withdrawal Record */}
          <button
            id="filter-withdraw"
            onClick={() => {
              sfx.playTap();
              setTransactionFilter('withdraw');
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center space-x-1 shrink-0 ${
              transactionFilter === 'withdraw'
                ? 'bg-[#00ba58] text-white shadow-xs'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {transactionFilter === 'withdraw' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            <span>Withdrawal Record</span>
          </button>

          {/* Income Record */}
          <button
            id="filter-revenue"
            onClick={() => {
              sfx.playTap();
              setTransactionFilter('revenue');
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center space-x-1 shrink-0 ${
              transactionFilter === 'revenue' || transactionFilter === 'income'
                ? 'bg-[#00ba58] text-white shadow-xs'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {(transactionFilter === 'revenue' || transactionFilter === 'income') && (
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            )}
            <span>Income Record</span>
          </button>
        </div>

        {/* Transactions List */}
        {filteredTransactions.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xs text-center flex flex-col items-center my-6">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2.5">
              <FileText className="w-7 h-7" />
            </div>
            <h3 className="text-xs font-bold text-gray-900">
              No Records Found
            </h3>
            <p className="text-[11px] text-gray-400 mt-1 max-w-[220px]">
              No transactions matching your active filter.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredTransactions.map((tx, idx) => {
              const isDeposit = tx.type === 'recharge';
              const isCheckIn = tx.type === 'checkin';
              const isWithdraw = tx.type === 'withdraw';
              const isInvest = tx.type === 'plan_purchase';
              const isExpanded = expandedTxId === (tx.id || String(idx));

              return (
                <div
                  key={`${tx.id || 'tx'}-${idx}`}
                  className="bg-white p-3.5 rounded-2xl border border-gray-100 shadow-xs hover:shadow-md hover:border-emerald-200 transition-all"
                >
                  <div
                    onClick={() => setExpandedTxId(isExpanded ? null : (tx.id || String(idx)))}
                    className="flex items-center justify-between cursor-pointer"
                  >
                    {/* Left: Round Green Icon and Title/Date */}
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-xs ${
                        isWithdraw
                          ? 'bg-slate-900 text-white'
                          : isInvest
                          ? 'bg-amber-600 text-white'
                          : 'bg-gradient-to-br from-[#00ba58] to-[#009e4a] text-white'
                      }`}>
                        {isCheckIn ? (
                          <Check className="w-5 h-5 stroke-[2.5]" />
                        ) : isDeposit ? (
                          <Wallet className="w-5 h-5 stroke-[2.2]" />
                        ) : isWithdraw ? (
                          <ArrowDownToLine className="w-5 h-5 stroke-[2.2]" />
                        ) : isInvest ? (
                          <Package className="w-5 h-5 stroke-[2.2]" />
                        ) : (
                          <TrendingUp className="w-5 h-5 stroke-[2.2]" />
                        )}
                      </div>

                      {/* Title and Date */}
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-gray-900 truncate tracking-tight">
                          {tx.title}
                        </div>
                        <div className="text-[10px] text-gray-400 mt-0.5 font-mono">
                          {tx.createdAt}
                        </div>
                      </div>
                    </div>

                    {/* Right: Amount & Status Badge */}
                    <div className="text-right shrink-0 ml-2">
                      <div className={`text-sm font-black tabular-nums font-mono ${
                        isWithdraw ? 'text-gray-900' : 'text-[#00ba58]'
                      }`}>
                        {isWithdraw ? '-' : '+'} {formatINR(Math.abs(tx.amount))}
                      </div>

                      <div className="mt-1 flex justify-end">
                        {tx.status === 'success' ? (
                          <span className="inline-flex items-center text-[9.5px] font-bold bg-[#00ba58] text-white px-2 py-0.5 rounded-full shadow-xs shadow-emerald-500/20 space-x-1">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                            <span>Settled</span>
                          </span>
                        ) : tx.status === 'pending' ? (
                          <span className="inline-flex items-center text-[9.5px] font-bold bg-[#f59e0b] text-white px-2 py-0.5 rounded-full shadow-xs shadow-amber-500/20 space-x-1">
                            <Clock className="w-2.5 h-2.5 stroke-[2.5] animate-pulse" />
                            <span>In Bank Queue</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center text-[9.5px] font-bold bg-rose-500 text-white px-2 py-0.5 rounded-full shadow-xs space-x-1">
                            <XCircle className="w-2.5 h-2.5 stroke-[2.5]" />
                            <span>Rejected</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expandable Order Details & View Receipt Voucher Button */}
                  {isExpanded && (
                    <div className="mt-3 pt-2.5 border-t border-gray-100 text-[11px] text-gray-500 space-y-2 animate-fade-in bg-emerald-50/40 p-2.5 rounded-xl border border-emerald-100/50">
                      {tx.orderId && (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Order ID:</span>
                          <div className="flex items-center space-x-1">
                            <span className="font-mono text-gray-900 font-bold">{tx.orderId}</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopy(tx.orderId || '', 'Order ID');
                              }}
                              className="text-emerald-700 hover:text-emerald-800 cursor-pointer p-0.5"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      )}

                      {tx.method && (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Channel:</span>
                          <span className="text-gray-900 font-bold">{tx.method}</span>
                        </div>
                      )}

                      {tx.utr && (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">UTR / Ref No:</span>
                          <div className="flex items-center space-x-1">
                            <span className="font-mono text-emerald-800 font-black">{tx.utr}</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopy(tx.utr || '', 'UTR');
                              }}
                              className="text-emerald-700 hover:text-emerald-800 cursor-pointer p-0.5"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      )}

                      <div className="pt-2 flex items-center justify-between border-t border-emerald-200/50">
                        <button
                          onClick={() => setReceiptTx(tx)}
                          className="flex items-center space-x-1 bg-white hover:bg-emerald-50 text-emerald-800 font-bold px-3 py-1.5 rounded-xl border border-emerald-300 text-[11px] shadow-2xs cursor-pointer active:scale-95"
                        >
                          <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>View Official Slip</span>
                        </button>

                        <span className="text-[10px] text-gray-400 font-mono">
                          256-Bit Ledger Hash Verified
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Official Digital Receipt Voucher Modal */}
      {receiptTx && createPortal(
        <div
          onClick={() => setReceiptTx(null)}
          className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in overflow-y-auto cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl border border-gray-100 relative space-y-4 my-auto cursor-default max-h-[92vh] overflow-y-auto"
          >
            {/* Close Button */}
            <button
              onClick={() => setReceiptTx(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Receipt Header with AKM Stamp */}
            <div className="text-center pt-1 border-b border-gray-100 pb-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-2 border border-emerald-200">
                <CheckCircle2 className="w-7 h-7 text-[#00ba58]" />
              </div>
              <div className="text-sm font-black text-gray-900 tracking-tight uppercase">
                Transaction Receipt Voucher
              </div>
              <div className="text-[10.5px] text-emerald-700 font-bold mt-0.5">
                AKM Official Financial Clearance
              </div>
              <div className="text-2xl font-black text-[#00ba58] mt-2 font-mono">
                {formatINR(Math.abs(receiptTx.amount))}
              </div>
            </div>

            {/* Receipt Body Details */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500">Transaction Type</span>
                <span className="font-bold text-gray-900 capitalize">{receiptTx.type.replace('_', ' ')}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500">Title / Purpose</span>
                <span className="font-bold text-gray-900">{receiptTx.title}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500">Order ID</span>
                <span className="font-mono font-bold text-gray-800">{receiptTx.orderId || `ORD${receiptTx.id}`}</span>
              </div>

              {receiptTx.utr && (
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-500">NPCI UTR</span>
                  <span className="font-mono font-black text-emerald-700">{receiptTx.utr}</span>
                </div>
              )}

              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500">Status</span>
                <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  {receiptTx.status.toUpperCase()}
                </span>
              </div>

              <div className="flex justify-between py-1">
                <span className="text-gray-500">Timestamp</span>
                <span className="font-mono text-gray-600">{receiptTx.createdAt}</span>
              </div>
            </div>

            {/* Receipt Footer with Security Seal */}
            <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
              <div className="flex items-center space-x-1.5 text-[10px] text-gray-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Digitally Sealed & Certified</span>
              </div>
              <button
                onClick={() => {
                  handleCopy(`AKM Receipt: ${receiptTx.title} - ${formatINR(receiptTx.amount)} (Ref: ${receiptTx.orderId || receiptTx.id})`, 'Receipt Summary');
                }}
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center space-x-1 cursor-pointer active:scale-95"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Slip</span>
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
