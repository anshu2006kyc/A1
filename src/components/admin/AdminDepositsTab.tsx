import React, { useState } from 'react';
import {
  CheckCircle2,
  Copy,
  Download,
  Filter,
  Search,
  Wallet,
  XCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatINR } from '../../utils/currency';

export const AdminDepositsTab: React.FC = () => {
  const {
    transactions,
    approveDeposit,
    rejectDeposit,
    approveAllPendingDeposits,
    showToast
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'success' | 'failed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const deposits = transactions.filter((t) => t.type === 'recharge');

  const filteredDeposits = deposits.filter((tx) => {
    if (statusFilter !== 'all' && tx.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchOrder = tx.orderId?.toLowerCase().includes(q);
      const matchUtr = tx.utrNumber?.toLowerCase().includes(q);
      const matchAmount = tx.amount.toString().includes(q);
      return matchOrder || matchUtr || matchAmount;
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

        <div className="flex items-center space-x-2 w-full sm:w-auto justify-between sm:justify-end">
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
              Deposit Ledger ({filteredDeposits.length})
            </h3>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">Sunpays Instant Gateway</span>
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
                    <span>Channel: {tx.method || 'Sunpays UPI'}</span>
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
                        onClick={() => rejectDeposit(tx.id, 'Payment verification failed')}
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
    </div>
  );
};
