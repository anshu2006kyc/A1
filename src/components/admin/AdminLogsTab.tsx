import React, { useState } from 'react';
import {
  Clock,
  Download,
  FileText,
  Filter,
  Search,
  Terminal,
  Trash2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AuditLog } from '../../types';
import { formatINR } from '../../utils/currency';

export const AdminLogsTab: React.FC = () => {
  const { auditLogs, clearAuditLogs, showToast } = useApp();

  const [categoryFilter, setCategoryFilter] = useState<'all' | AuditLog['type']>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = auditLogs.filter((log) => {
    if (categoryFilter !== 'all' && log.type !== categoryFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = log.title.toLowerCase().includes(q);
      const matchDetails = log.details.toLowerCase().includes(q);
      return matchTitle || matchDetails;
    }
    return true;
  });

  const handleExportCSV = () => {
    if (auditLogs.length === 0) {
      showToast('No logs to export', 'info');
      return;
    }

    const headers = ['Timestamp', 'Type', 'Title', 'Details', 'Amount', 'Status'];
    const rows = auditLogs.map((l) => [
      `"${l.timestamp}"`,
      l.type,
      `"${l.title}"`,
      `"${l.details}"`,
      l.amount || '',
      l.status || 'info'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.href = encodedUri;
    link.download = `audit_logs_${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Audit logs CSV exported!', 'success');
  };

  return (
    <div className="space-y-4">
      {/* Search & Actions Bar */}
      <div className="bg-slate-800/90 p-4 rounded-3xl border border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search audit trail..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto justify-between sm:justify-end">
          {/* Category Filter */}
          <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-700 text-xs overflow-x-auto">
            {(['all', 'deposit', 'withdraw', 'settlement', 'plan', 'system'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-2.5 py-1 rounded-lg font-bold capitalize transition-all cursor-pointer whitespace-nowrap ${
                  categoryFilter === cat
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportCSV}
            className="p-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl text-xs font-bold flex items-center space-x-1 cursor-pointer"
            title="Export CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">CSV</span>
          </button>

          {auditLogs.length > 0 && (
            <button
              onClick={clearAuditLogs}
              className="p-2 bg-rose-950 hover:bg-rose-900 text-rose-300 rounded-xl text-xs font-bold flex items-center space-x-1 border border-rose-800 cursor-pointer"
              title="Clear Logs"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-400" />
            </button>
          )}
        </div>
      </div>

      {/* Logs Feed */}
      <div className="bg-slate-800/90 rounded-3xl border border-slate-700 p-4 space-y-3 shadow-lg">
        <div className="flex items-center justify-between pb-3 border-b border-slate-700">
          <div className="flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Immutable Platform Telemetry ({filteredLogs.length})
            </h3>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">Live Event Stream</span>
        </div>

        {filteredLogs.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No audit records match the current filter.
          </div>
        ) : (
          <div className="divide-y divide-slate-700/60 font-mono text-xs">
            {filteredLogs.map((log) => (
              <div key={log.id} className="py-3 flex items-start justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-400 text-[10px]">[{log.timestamp}]</span>
                    <span
                      className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                        log.status === 'success'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : log.status === 'warning'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : log.status === 'error'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : 'bg-slate-700 text-slate-300'
                      }`}
                    >
                      {log.type}
                    </span>
                    <span className="font-bold text-white text-xs">{log.title}</span>
                  </div>
                  <p className="text-[11px] text-slate-300">{log.details}</p>
                </div>

                {log.amount && (
                  <span className="text-emerald-400 font-bold font-mono text-xs shrink-0">
                    {formatINR(log.amount)}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
