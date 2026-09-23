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

export const AdminWithdrawalsTab: React.FC = () => {
  const {
    user,
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

  const withdrawals = transactions.filter((t) => t.type === 'withdraw');

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
            <span>Disbursed Total</span>
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

      {/* Search & Actions Bar */}
      <div className="bg-slate-800/90 p-4 rounded-3xl border border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by Order ID, bank account or amount..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto justify-between sm:justify-end">
          {/* Status Filter buttons */}
          <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-700 text-xs">
            {(['all', 'pending', 'success', 'failed'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-lg font-bold capitalize transition-all cursor-pointer ${
                  statusFilter === st
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {st}
                {st === 'pending' && pendingCount > 0 && (
                  <span className="ml-1 bg-amber-400 text-slate-950 px-1 rounded-full text-[9px] font-black">
                    {pendingCount}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Export Bank Batch CSV */}
          <button
            onClick={handleExportBankCSV}
            className="p-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl text-xs font-bold flex items-center space-x-1 cursor-pointer"
            title="Export Bank Payout File"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Bank Batch CSV</span>
          </button>

          {/* Batch Approve Pending */}
          {pendingCount > 0 && (
            <button
              onClick={() => approveAllPendingWithdrawals()}
              className="px-3 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer active:scale-95 transition-all"
            >
              Approve All ({pendingCount})
            </button>
          )}
        </div>
      </div>

      {/* Withdrawals List */}
      <div className="bg-slate-800/90 rounded-3xl border border-slate-700 overflow-hidden shadow-lg">
        <div className="p-4 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ArrowDownToLine className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Withdrawal Queue ({filteredWithdrawals.length})
            </h3>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">Bank IMPS / NEFT Settlement</span>
        </div>

        {filteredWithdrawals.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No withdrawal requests found matching the filter.
          </div>
        ) : (
          <div className="divide-y divide-slate-700/60">
            {filteredWithdrawals.map((tx) => (
              <div
                key={tx.id}
                className="p-4 hover:bg-slate-750 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-white font-mono">{tx.orderId || tx.id}</span>
                    <button
                      onClick={() => copyToClipboard(tx.orderId || tx.id, tx.id)}
                      className="text-slate-400 hover:text-white cursor-pointer"
                      title="Copy Order ID"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                    <span
                      className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                        tx.status === 'success'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : tx.status === 'pending'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {tx.status === 'success' ? 'Disbursed' : tx.status}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-400 flex items-center space-x-2 flex-wrap">
                    <span>{tx.createdAt}</span>
                    <span>•</span>
                    <span>To: {tx.method}</span>
                    <span>•</span>
                    <span>Beneficiary: {user.bankAccount?.holderName || 'Anshu Kumar'}</span>
                    <span>•</span>
                    <span>IFSC: <span className="font-mono text-slate-300">{user.bankAccount?.ifscCode || 'SBIN0001234'}</span></span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end space-x-4">
                  <div className="text-right">
                    <div className="text-base font-black text-amber-400 font-mono">
                      -{formatINR(tx.amount)}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Net Payout: {formatINR(tx.finalAmount || tx.amount)}
                    </div>
                  </div>

                  {tx.status === 'pending' && (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleOpenDisburse(tx)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center space-x-1 cursor-pointer shadow-md active:scale-95 transition-all"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Disburse</span>
                      </button>
                      <button
                        onClick={() => handleOpenReject(tx)}
                        className="px-3 py-1.5 bg-rose-600/80 hover:bg-rose-500 text-white font-bold rounded-xl text-xs flex items-center space-x-1 cursor-pointer active:scale-95 transition-all"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject & Refund</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Disbursal Confirmation Modal */}
      {disburseTx &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center space-x-3 pb-3 border-b border-slate-800">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">Disburse Bank Payout</h3>
                  <p className="text-[11px] text-slate-400 font-mono">Order #{disburseTx.orderId || disburseTx.id}</p>
                </div>
              </div>

              <form onSubmit={handleConfirmDisburse} className="space-y-3.5 text-xs">
                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Beneficiary:</span>
                    <strong className="text-white">{user.bankAccount?.holderName || 'Anshu Kumar'}</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Account Number:</span>
                    <strong className="text-white font-mono">{user.bankAccount?.accountNumber || '620336963812'}</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Bank IFSC:</span>
                    <strong className="text-white font-mono">{user.bankAccount?.ifscCode || 'SBIN0001234'}</strong>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-800">
                    <span className="text-slate-400">Net Amount to Credit:</span>
                    <strong className="text-base text-emerald-400 font-mono">{formatINR(disburseTx.finalAmount || disburseTx.amount)}</strong>
                  </div>
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">Bank IMPS RRN / Reference Number</label>
                  <input
                    type="text"
                    value={impsRrn}
                    onChange={(e) => setImpsRrn(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:border-emerald-500"
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
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-md cursor-pointer active:scale-95 transition-all"
                  >
                    Confirm & Mark Paid
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}

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
