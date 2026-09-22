import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  AlertCircle,
  CheckCircle2,
  Copy,
  Download,
  Filter,
  Plus,
  PlusCircle,
  Search,
  Wallet,
  XCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatINR } from '../../utils/currency';
import { Transaction } from '../../types';

export const AdminDepositsTab: React.FC = () => {
  const {
    transactions,
    registeredUsers,
    user,
    approveDeposit,
    rejectDeposit,
    approveAllPendingDeposits,
    showToast
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'success' | 'failed'>('all');
  const [channelFilter, setChannelFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Reject Modal State
  const [rejectTx, setRejectTx] = useState<Transaction | null>(null);
  const [rejectReason, setRejectReason] = useState('Duplicate UTR Reference Number');
  const [customRejectReason, setCustomRejectReason] = useState('');

  // Manual Deposit Modal State
  const [showManualDepositModal, setShowManualDepositModal] = useState(false);
  const [manualTargetUserId, setManualTargetUserId] = useState<number>(user.id);
  const [manualAmount, setManualAmount] = useState('500');
  const [manualUtr, setManualUtr] = useState('');
  const [manualChannel, setManualChannel] = useState('Manual UPI / Cash');

  const presetReasons = [
    'Duplicate UTR Reference Number',
    'Bank Reference Not Found in Statement',
    'Payment Screenshot Unclear or Illegible',
    'Underpaid / Amount Mismatch with Gateway',
    'Transferred to Old / Closed UPI VPA',
    'Suspicious Account / Velocity Violation'
  ];

  const deposits = transactions.filter((t) => t.type === 'recharge');

  const filteredDeposits = deposits.filter((tx) => {
    if (statusFilter !== 'all' && tx.status !== statusFilter) return false;
    if (channelFilter !== 'all') {
      const m = (tx.method || '').toLowerCase();
      if (channelFilter === 'channel1' && !m.includes('watch') && !m.includes('channel 1') && !m.includes('fast')) return false;
      if (channelFilter === 'channel2' && !m.includes('sun') && !m.includes('channel 2') && !m.includes('express')) return false;
      if (channelFilter === 'manual' && !m.includes('manual') && !m.includes('cash')) return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchOrder = tx.orderId?.toLowerCase().includes(q);
      const matchUtr = tx.utrNumber?.toLowerCase().includes(q);
      const matchAmount = tx.amount.toString().includes(q);
      const matchChannel = tx.method?.toLowerCase().includes(q);
      return matchOrder || matchUtr || matchAmount || matchChannel;
    }
    return true;
  });

  const pendingCount = deposits.filter((t) => t.status === 'pending').length;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    showToast('Copied to clipboard!', 'info');
    setTimeout(() => setCopiedId(null), 2000);
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
    rejectDeposit(rejectTx.id, finalReason);
    setRejectTx(null);
  };

  const handleCreateManualDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(manualAmount);
    if (isNaN(amt) || amt <= 0) {
      showToast('Please enter a valid amount', 'error');
      return;
    }

    const utr = manualUtr.trim() || `OFF${Date.now().toString().slice(-10)}`;
    const targetUser = registeredUsers.find((u) => u.id === manualTargetUserId) || user;

    // Simulate instant approved deposit
    approveDeposit(`TX-${Date.now()}`);
    showToast(`Credited ${formatINR(amt)} manual deposit to ${targetUser.name || targetUser.phone}!`, 'success');
    setShowManualDepositModal(false);
    setManualUtr('');
  };

  const handleExportCSV = () => {
    if (deposits.length === 0) {
      showToast('No deposit records to export', 'info');
      return;
    }

    const headers = ['Order ID', 'Date & Time', 'Amount (INR)', 'Channel', 'Status', 'UTR Number', 'Remark'];
    const rows = deposits.map((d) => [
      d.orderId || d.id,
      `"${d.createdAt}"`,
      d.amount,
      d.method || 'Sunpays UPI',
      d.status,
      d.utrNumber || 'N/A',
      `"${d.adminRemark || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `deposits_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Deposits CSV exported successfully!', 'success');
  };

  return (
    <div className="space-y-4">
      {/* Search & Actions Bar */}
      <div className="bg-slate-800/90 p-4 rounded-3xl border border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by Order ID, UTR or amount..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          {/* Status Filter buttons */}
          <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-700 text-xs">
            {(['all', 'pending', 'success', 'failed'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-lg font-bold capitalize transition-all cursor-pointer ${
                  statusFilter === st
                    ? 'bg-emerald-500 text-white shadow-sm'
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

          {/* Channel Filter Selector */}
          <select
            value={channelFilter}
            onChange={(e) => setChannelFilter(e.target.value)}
            aria-label="Filter deposits by channel"
            className="bg-slate-900 border border-slate-700 text-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-bold focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option value="all">All Channels</option>
            <option value="channel1">Fast Pay (Channel 1)</option>
            <option value="channel2">Express Pay (Channel 2)</option>
            <option value="manual">Manual UPI / Offline</option>
          </select>

          {/* Manual Deposit Button */}
          <button
            onClick={() => setShowManualDepositModal(true)}
            className="px-2.5 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-bold flex items-center space-x-1 active:scale-95 transition-all cursor-pointer"
            title="Record an offline or direct bank deposit"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Manual Inflow</span>
          </button>

          {/* Export to CSV */}
          <button
            onClick={handleExportCSV}
            className="p-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl text-xs font-bold flex items-center space-x-1 cursor-pointer"
            title="Export Deposits to CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">CSV</span>
          </button>

          {/* Batch Approve Pending */}
          {pendingCount > 0 && (
            <button
              onClick={() => approveAllPendingDeposits()}
              className="px-3 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer active:scale-95 transition-all"
            >
              Approve All ({pendingCount})
            </button>
          )}
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-slate-800/90 rounded-3xl border border-slate-700 overflow-hidden shadow-lg">
        <div className="p-4 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Wallet className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Deposit Records ({filteredDeposits.length})
            </h3>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">Automated Instant Gateway</span>
        </div>

        {filteredDeposits.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No deposit transactions found matching the filter.
          </div>
        ) : (
          <div className="divide-y divide-slate-700/60">
            {filteredDeposits.map((tx) => (
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
                      {tx.status}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-400 flex items-center space-x-2 flex-wrap">
                    <span>{tx.createdAt}</span>
                    <span>•</span>
                    <span>
                      Channel:{' '}
                      {(tx.method || '').toLowerCase().includes('watch')
                        ? 'Fast Pay (Channel 1)'
                        : (tx.method || '').toLowerCase().includes('sun')
                        ? 'Express Pay (Channel 2)'
                        : tx.method || 'Instant UPI'}
                    </span>
                    {tx.utrNumber && (
                      <>
                        <span>•</span>
                        <span className="text-emerald-400 font-mono">UTR: {tx.utrNumber}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end space-x-4">
                  <div className="text-right">
                    <div className="text-base font-black text-emerald-400 font-mono">
                      +{formatINR(tx.amount)}
                    </div>
                  </div>

                  {tx.status === 'pending' && (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => approveDeposit(tx.id)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center space-x-1 cursor-pointer shadow-md active:scale-95 transition-all"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Credit</span>
                      </button>
                      <button
                        onClick={() => handleOpenReject(tx)}
                        className="px-3 py-1.5 bg-rose-600/80 hover:bg-rose-500 text-white font-bold rounded-xl text-xs flex items-center space-x-1 cursor-pointer active:scale-95 transition-all"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rejection Modal with Preset Reasons */}
      {rejectTx &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center space-x-3 pb-3 border-b border-slate-800">
                <div className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">Reject Deposit Request</h3>
                  <p className="text-[11px] text-slate-400 font-mono">Order #{rejectTx.orderId || rejectTx.id}</p>
                </div>
              </div>

              <form onSubmit={handleConfirmReject} className="space-y-3.5 text-xs">
                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">Claimed Amount:</span>
                  <span className="text-sm font-black text-emerald-400 font-mono">{formatINR(rejectTx.amount)}</span>
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
                  <label className="text-slate-300 font-bold block mb-1">Custom Notes / Proof Clarification (Optional)</label>
                  <input
                    type="text"
                    value={customRejectReason}
                    onChange={(e) => setCustomRejectReason(e.target.value)}
                    placeholder="e.g. Bank statement shows no credit for UTR on 21st Sep"
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                  />
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
                    Confirm Rejection
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}

      {/* Manual Deposit Entry Modal */}
      {showManualDepositModal &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center space-x-3 pb-3 border-b border-slate-800">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                  <PlusCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">Manual Offline Deposit Entry</h3>
                  <p className="text-[11px] text-slate-400">Record cash/direct bank transfers and credit user directly</p>
                </div>
              </div>

              <form onSubmit={handleCreateManualDeposit} className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Target Registered User</label>
                  <select
                    value={manualTargetUserId}
                    onChange={(e) => setManualTargetUserId(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-bold focus:outline-none focus:border-emerald-500"
                  >
                    {registeredUsers.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name || u.phone} (UID #{u.id}) • Bal: {formatINR(u.balance || 0)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-slate-300 font-bold block mb-1">Amount (₹)</label>
                    <input
                      type="number"
                      step="any"
                      value={manualAmount}
                      onChange={(e) => setManualAmount(e.target.value)}
                      placeholder="e.g. 500"
                      className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono font-bold focus:outline-none focus:border-emerald-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 font-bold block mb-1">Inflow Channel</label>
                    <select
                      value={manualChannel}
                      onChange={(e) => setManualChannel(e.target.value)}
                      className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-bold focus:outline-none focus:border-emerald-500"
                    >
                      <option value="Manual UPI / Cash">Manual UPI</option>
                      <option value="Direct IMPS / NEFT">Bank IMPS/NEFT</option>
                      <option value="Cash Deposit at Office">Cash Counter</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">Bank UTR / Reference ID</label>
                  <input
                    type="text"
                    value={manualUtr}
                    onChange={(e) => setManualUtr(e.target.value)}
                    placeholder="e.g. 423589123049 (Leave empty for auto)"
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowManualDepositModal(false)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-md cursor-pointer active:scale-95 transition-all"
                  >
                    Credit User Balance
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
