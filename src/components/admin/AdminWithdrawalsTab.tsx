import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  AlertCircle,
  ArrowDownToLine,
  Building2,
  CheckCircle2,
  Clock,
  Copy,
  Download,
  Filter,
  Search,
  ShieldCheck,
  XCircle,
  Zap
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatINR } from '../../utils/currency';
import { Transaction } from '../../types';
import { sortRecordsNewestFirst } from '../../utils/date';

export const AdminWithdrawalsTab: React.FC = () => {
  const {
    user,
    registeredUsers,
    transactions,
    approveWithdrawal,
    rejectWithdrawal,
    approveAllPendingWithdrawals,
    showToast
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'success' | 'failed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Reject Modal State
  const [rejectTx, setRejectTx] = useState<Transaction | null>(null);
  const [rejectReason, setRejectReason] = useState('Invalid IFSC or Account Number');
  const [customRejectReason, setCustomRejectReason] = useState('');

  // Disburse Modal State
  const [disburseTx, setDisburseTx] = useState<Transaction | null>(null);
  const [impsRrn, setImpsRrn] = useState('');

  const presetReasons = [
    'Invalid IFSC or Account Number',
    'Beneficiary Name Mismatch with Bank KYC',
    'Receiving Bank Server Down / Transaction Timeout',
    'Account Frozen or Restricted by User Bank',
    'Suspicious Arbitrage Activity - Under Audit',
    'Daily Withdrawal Frequency Limit Exceeded'
  ];

  const withdrawals = sortRecordsNewestFirst<Transaction>(transactions.filter((t) => t.type === 'withdraw'));

  const filteredWithdrawals = withdrawals.filter((tx) => {
    if (statusFilter !== 'all' && tx.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchOrder = tx.orderId?.toLowerCase().includes(q);
      const matchMethod = tx.method?.toLowerCase().includes(q);
      const matchAmount = tx.amount.toString().includes(q);
      return matchOrder || matchMethod || matchAmount;
    }
    return true;
  });

  const pendingList = withdrawals.filter((t) => t.status === 'pending');
  const pendingCount = pendingList.length;
  const pendingSum = pendingList.reduce((sum, t) => sum + (t.finalAmount || t.amount), 0);
  const successSum = withdrawals.filter((t) => t.status === 'success').reduce((sum, t) => sum + (t.finalAmount || t.amount), 0);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    showToast('Copied to clipboard!', 'info');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleOpenDisburse = (tx: Transaction) => {
    setDisburseTx(tx);
    setImpsRrn(`${Date.now().toString().slice(-12)}`);
  };

  const handleConfirmDisburse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!disburseTx) return;
    approveWithdrawal(disburseTx.id, impsRrn);
    showToast(`Disbursed ${formatINR(disburseTx.finalAmount || disburseTx.amount)} via IMPS RRN #${impsRrn}!`, 'success');
    setDisburseTx(null);
  };

  const handleOpenReject = (tx: Transaction) => {
    setRejectTx(tx);
    setRejectReason(presetReasons[0]);
    setCustomRejectReason('');
  };

  const handleConfirmReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectTx) return;
    const finalReason = customRejectReason.trim() || rejectReason;
    rejectWithdrawal(rejectTx.id, finalReason);
    setRejectTx(null);
  };

  const handleExportBankCSV = () => {
    if (withdrawals.length === 0) {
      showToast('No withdrawal records to export', 'info');
      return;
    }

    const headers = ['Order ID', 'Date', 'Gross Amount', 'Net Payout Amount', 'Beneficiary Name', 'Account Number', 'IFSC Code', 'Status'];
    const rows = withdrawals.map((w) => [
      w.orderId || w.id,
      `"${w.createdAt}"`,
      w.amount,
      w.finalAmount || w.amount,
      `"${user.bankAccount?.holderName || 'Anshu Kumar'}"`,
      `"${user.bankAccount?.accountNumber || '620336963812'}"`,
      `"${user.bankAccount?.ifscCode || 'SBIN0001234'}"`,
      w.status
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `bank_payout_batch_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Bank Payout CSV exported successfully!', 'success');
  };

  return (
    <div className="space-y-4">
      {/* Top Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="bg-slate-800/90 p-3.5 rounded-3xl border border-slate-700 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Pending Payouts</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-black text-amber-400 font-mono mt-1">
            {formatINR(pendingSum)}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">{pendingCount} requests awaiting dispatch</div>
        </div>

        <div className="bg-slate-800/90 p-3.5 rounded-3xl border border-slate-700 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Paid Total</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-black text-emerald-400 font-mono mt-1">
            {formatINR(successSum)}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Successful IMPS Payouts</div>
        </div>

        <div className="col-span-2 sm:col-span-1 bg-slate-800/90 p-3.5 rounded-3xl border border-slate-700 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>IMPS Speed</span>
            <Zap className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-xl font-black text-teal-400 font-mono mt-1">
            Instant (T+0)
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">NPCI Fast Payout Router</div>
        </div>
      </div>

      {/* Search & Actions Bar (Mobile Responsive) */}
      <div className="bg-slate-900/90 p-3 sm:p-4 rounded-2xl sm:rounded-3xl border border-slate-800 space-y-3 shadow-md">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by phone, Order ID, A/C or IFSC..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            {/* Export Bank Batch CSV */}
            <button
              onClick={handleExportBankCSV}
              className="p-2 sm:px-3 sm:py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center space-x-1.5 border border-slate-700 active:scale-95 transition-all cursor-pointer"
              title="Export Bank Payout File"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[11px] font-mono">Bank CSV</span>
            </button>

            {/* Batch Approve Pending */}
            {pendingCount > 0 && (
              <button
                onClick={() => approveAllPendingWithdrawals()}
                className="px-3 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 rounded-xl text-xs font-black shadow-md cursor-pointer active:scale-95 transition-all flex items-center space-x-1"
              >
                <Zap className="w-3.5 h-3.5 fill-slate-950" />
                <span>Disburse All ({pendingCount})</span>
              </button>
            )}
          </div>
        </div>

        {/* Status Filter Chips (Horizontal Scroll on Mobile) */}
        <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar pb-0.5">
          {(['all', 'pending', 'success', 'failed'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer whitespace-nowrap active:scale-95 shrink-0 ${
                statusFilter === st
                  ? 'bg-amber-400 text-slate-950 font-black shadow-sm ring-1 ring-amber-300'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {st === 'success' ? 'Paid' : st}
              {st === 'pending' && pendingCount > 0 && (
                <span className="ml-1.5 bg-slate-950 text-amber-300 px-1.5 py-0.2 rounded-full text-[9px] font-black">
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Withdrawals List */}
      <div className="bg-slate-900/90 rounded-2xl sm:rounded-3xl border border-slate-800 overflow-hidden shadow-lg">
        <div className="p-3.5 sm:p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ArrowDownToLine className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Payout Queue ({filteredWithdrawals.length})
            </h3>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">Bank IMPS / Fast Payout</span>
        </div>

        {filteredWithdrawals.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No withdrawal requests found matching the filter.
          </div>
        ) : (
          <div className="divide-y divide-slate-800/80">
            {filteredWithdrawals.map((tx, idx) => {
              const reqUser = registeredUsers.find((u) => u.id === tx.userId) || (tx.phone ? registeredUsers.find((u) => u.phone === tx.phone) : null) || user;
              const bankAcc = reqUser?.bankAccount || reqUser?.bankDetails;
              const holderName = bankAcc?.holderName || reqUser?.name || 'Account Holder';
              const accNumber = bankAcc?.accountNumber || 'Pending Account';
              const ifsc = bankAcc?.ifscCode || 'IFSC';
              const bankName = bankAcc?.bankName || 'Bank Transfer';

              return (
                <div
                  key={`wd-tx-${tx.id || 'tx'}-${idx}`}
                  className="p-3.5 sm:p-4 hover:bg-slate-850/60 transition-colors space-y-3 text-xs"
                >
                  {/* Top Row: Order ID, Status, Date */}
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center space-x-1.5">
                      <span className="font-bold text-white font-mono text-[11px] sm:text-xs">
                        {tx.orderId || tx.id}
                      </span>
                      <button
                        onClick={() => copyToClipboard(tx.orderId || tx.id, `ord-${tx.id}`)}
                        className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer active:scale-90 transition-all"
                        title="Copy Order ID"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                      {copiedId === `ord-${tx.id}` && (
                        <span className="text-[9px] text-emerald-400 font-bold">Copied!</span>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] text-slate-400 font-mono">{tx.createdAt}</span>
                      <span
                        className={`text-[9.5px] font-black uppercase px-2 py-0.5 rounded-full ${
                          tx.status === 'success'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : tx.status === 'pending'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse'
                            : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {tx.status === 'success' ? 'Paid' : tx.status}
                      </span>
                    </div>
                  </div>

                  {/* Middle Row: User & Bank Details Box (Mobile Friendly) */}
                  <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/90 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <div className="text-[10px] text-slate-400 font-medium">Beneficiary / User</div>
                      <div className="text-white font-bold flex items-center space-x-1.5 mt-0.5">
                        <span className="truncate">{holderName}</span>
                        {reqUser?.phone && (
                          <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-500/20">
                            {reqUser.phone}
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{bankName}</div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400 text-[10px]">A/C No:</span>
                        <div className="flex items-center space-x-1.5 font-mono font-bold text-white">
                          <span>{accNumber}</span>
                          <button
                            onClick={() => copyToClipboard(accNumber, `acc-${tx.id}`)}
                            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer active:scale-90 transition-all"
                            title="Copy Account Number"
                          >
                            <Copy className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400 text-[10px]">IFSC Code:</span>
                        <div className="flex items-center space-x-1.5 font-mono font-bold text-amber-300">
                          <span>{ifsc}</span>
                          <button
                            onClick={() => copyToClipboard(ifsc, `ifsc-${tx.id}`)}
                            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer active:scale-90 transition-all"
                            title="Copy IFSC Code"
                          >
                            <Copy className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Financial Amounts & Action Buttons */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
                    <div className="flex items-baseline space-x-3">
                      <div>
                        <span className="text-[9.5px] text-slate-400 block">Net Payout Amount</span>
                        <span className="text-base sm:text-lg font-black text-amber-400 font-mono tracking-tight">
                          {formatINR(tx.finalAmount || tx.amount)}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        Gross: {formatINR(tx.amount)}
                        {tx.finalAmount && tx.amount > tx.finalAmount && (
                          <span className="ml-1 text-slate-400">
                            (Fee: {formatINR(tx.amount - tx.finalAmount)})
                          </span>
                        )}
                      </div>
                    </div>

                    {tx.status === 'pending' && (
                      <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:space-x-2">
                        <button
                          onClick={() => handleOpenDisburse(tx)}
                          className="py-2.5 px-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold rounded-xl text-xs flex items-center justify-center space-x-1.5 shadow-md active:scale-95 transition-all cursor-pointer ring-1 ring-emerald-400/30"
                        >
                          <Zap className="w-3.5 h-3.5 fill-white" />
                          <span>1-Tap Disburse</span>
                        </button>
                        <button
                          onClick={() => handleOpenReject(tx)}
                          className="py-2.5 px-3 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 hover:text-white border border-rose-500/40 font-bold rounded-xl text-xs flex items-center justify-center space-x-1 cursor-pointer active:scale-95 transition-all"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Reject & Refund</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Disbursal Confirmation Modal */}
      {disburseTx && (() => {
        const disburseUser = registeredUsers.find((u) => u.id === disburseTx.userId) || 
          (disburseTx.phone ? registeredUsers.find((u) => u.phone === disburseTx.phone) : null) || user;
        const disburseBank = disburseUser?.bankAccount || disburseUser?.bankDetails || user.bankAccount;
        const disburseHolder = disburseBank?.holderName || disburseUser?.name || 'Account Holder';
        const disburseAccNo = disburseBank?.accountNumber || 'Pending Account';
        const disburseIfsc = disburseBank?.ifscCode || 'IFSC';
        const disburseBankName = disburseBank?.bankName || 'Bank Transfer';

        return createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
              <div className="flex items-center space-x-3 pb-3 border-b border-slate-800">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm sm:text-base font-black text-white truncate">Disburse Bank IMPS Payout</h3>
                  <p className="text-[11px] text-slate-400 font-mono truncate">Order #{disburseTx.orderId || disburseTx.id}</p>
                </div>
              </div>

              <form onSubmit={handleConfirmDisburse} className="space-y-3.5 text-xs">
                {/* Beneficiary Card with 1-Tap Copy */}
                <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[10.5px]">Beneficiary Name:</span>
                    <div className="flex items-center space-x-1.5 font-bold text-white">
                      <span>{disburseHolder}</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(disburseHolder, 'modal-name')}
                        className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer active:scale-90"
                        title="Copy Name"
                      >
                        <Copy className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[10.5px]">Bank Account No:</span>
                    <div className="flex items-center space-x-1.5 font-mono font-bold text-white">
                      <span>{disburseAccNo}</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(disburseAccNo, 'modal-acc')}
                        className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-emerald-400 hover:text-white cursor-pointer active:scale-90"
                        title="Copy Account Number"
                      >
                        <Copy className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[10.5px]">Bank IFSC:</span>
                    <div className="flex items-center space-x-1.5 font-mono font-bold text-amber-300">
                      <span>{disburseIfsc}</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(disburseIfsc, 'modal-ifsc')}
                        className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-white cursor-pointer active:scale-90"
                        title="Copy IFSC"
                      >
                        <Copy className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-slate-400 text-[10.5px]">
                    <span>Bank Institution:</span>
                    <strong className="text-slate-300">{disburseBankName}</strong>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Net Payout to Transfer:</span>
                      <strong className="text-base sm:text-lg text-emerald-400 font-mono font-black">
                        {formatINR(disburseTx.finalAmount || disburseTx.amount)}
                      </strong>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(String(disburseTx.finalAmount || disburseTx.amount), 'modal-amt')}
                      className="px-2 py-1 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-lg text-[10px] font-mono flex items-center space-x-1 cursor-pointer"
                    >
                      <Copy className="w-2.5 h-2.5" />
                      <span>Copy Amount</span>
                    </button>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-slate-300 font-bold block">Bank IMPS RRN / Reference Number</label>
                    <button
                      type="button"
                      onClick={() => setImpsRrn(`${Date.now().toString().slice(-12)}`)}
                      className="text-[10px] text-emerald-400 hover:underline font-mono cursor-pointer"
                    >
                      Generate New RRN
                    </button>
                  </div>
                  <input
                    type="text"
                    value={impsRrn}
                    onChange={(e) => setImpsRrn(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:border-emerald-500 text-xs"
                    placeholder="Enter 12-digit IMPS RRN or UTR"
                    required
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setDisburseTx(null)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white rounded-xl font-black shadow-md cursor-pointer active:scale-95 transition-all"
                  >
                    Confirm & Mark Disbursed
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        );
      })()}

      {/* Rejection Modal with Refund */}
      {rejectTx &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center space-x-3 pb-3 border-b border-slate-800">
                <div className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">Reject Withdrawal & Refund</h3>
                  <p className="text-[11px] text-slate-400 font-mono">Order #{rejectTx.orderId || rejectTx.id}</p>
                </div>
              </div>

              <form onSubmit={handleConfirmReject} className="space-y-3.5 text-xs">
                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">Refund to Wallet:</span>
                  <span className="text-sm font-black text-amber-400 font-mono">+{formatINR(rejectTx.amount)}</span>
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">Select Rejection Cause</label>
                  <select
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-bold focus:outline-none focus:border-rose-500"
                  >
                    {presetReasons.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">Custom Notes / Bank Error Code (Optional)</label>
                  <input
                    type="text"
                    value={customRejectReason}
                    onChange={(e) => setCustomRejectReason(e.target.value)}
                    placeholder="e.g. Beneficiary IFSC inactive at receiving branch"
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div className="p-3 bg-amber-950/30 border border-amber-500/30 rounded-2xl text-[11px] text-amber-300">
                  Note: The full deduction of {formatINR(rejectTx.amount)} will be immediately credited back to the user&apos;s wallet balance.
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setRejectTx(null)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold shadow-md cursor-pointer active:scale-95 transition-all"
                  >
                    Reject & Refund Wallet
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
