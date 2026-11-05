import React, { useState, useMemo } from 'react';
import {
  AlertTriangle,
  ArrowDownLeft,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Download,
  Filter,
  Layers,
  RefreshCw,
  Search,
  Shield,
  ShieldAlert,
  Sliders,
  Terminal,
  Trash2,
  UserCheck,
  UserX,
  Users,
  Wallet,
  Zap
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AuditLog, AuditActionCategory } from '../../types';
import { formatINR } from '../../utils/currency';
import { downloadCSV } from '../../utils/csvExport';

export const AdminLogsTab: React.FC = () => {
  const { auditLogs, clearAuditLogs, recordAuditLog, showToast, user } = useApp();

  const [categoryFilter, setCategoryFilter] = useState<'all' | AuditActionCategory>('all');
  const [severityFilter, setSeverityFilter] = useState<'all' | 'critical' | 'warning' | 'info' | 'success'>('all');
  const [adminFilter, setAdminFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Distinct Admin IDs in logs
  const distinctAdminIds = useMemo(() => {
    const set = new Set<string>();
    auditLogs.forEach((l) => {
      if (l.adminId !== undefined && l.adminId !== null) {
        set.add(String(l.adminId));
      }
    });
    return Array.from(set);
  }, [auditLogs]);

  // Metrics
  const stats = useMemo(() => {
    const total = auditLogs.length;
    const balanceAdjustCount = auditLogs.filter((l) => l.actionCategory === 'balance_adjust').length;
    const userStatusCount = auditLogs.filter((l) => l.actionCategory === 'user_status').length;
    const settingsCount = auditLogs.filter((l) => l.actionCategory === 'settings_update').length;
    const criticalCount = auditLogs.filter((l) => l.status === 'critical' || l.status === 'warning').length;
    return { total, balanceAdjustCount, userStatusCount, settingsCount, criticalCount };
  }, [auditLogs]);

  // Filtered list
  const filteredLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      // Category filter
      if (categoryFilter !== 'all' && log.actionCategory !== categoryFilter) return false;

      // Severity filter
      if (severityFilter !== 'all') {
        const logStatus = log.status || 'info';
        if (logStatus !== severityFilter) return false;
      }

      // Admin filter
      if (adminFilter !== 'all') {
        const logAdminId = String(log.adminId ?? 60);
        if (logAdminId !== adminFilter) return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const matchTitle = (log.title || '').toLowerCase().includes(q);
        const matchDetails = (log.details || '').toLowerCase().includes(q);
        const matchAdmin = String(log.adminId || '').toLowerCase().includes(q) || (log.adminName || '').toLowerCase().includes(q);
        const matchTarget = String(log.targetUserId || '').toLowerCase().includes(q) || (log.targetUserPhone || '').toLowerCase().includes(q);
        const matchIp = (log.ipAddress || '').toLowerCase().includes(q);
        return matchTitle || matchDetails || matchAdmin || matchTarget || matchIp;
      }

      return true;
    });
  }, [auditLogs, categoryFilter, severityFilter, adminFilter, searchQuery]);

  // Export CSV handler
  const handleExportCSV = () => {
    if (auditLogs.length === 0) {
      showToast('No audit logs to export', 'info');
      return;
    }

    const headers = [
      'Log ID',
      'Timestamp',
      'Admin User ID',
      'Admin Name',
      'Action Category',
      'Event Type',
      'Action Title',
      'Action Details',
      'Target User ID',
      'Target User Phone',
      'Old Value',
      'New Value',
      'Amount (₹)',
      'Source IP',
      'Status Severity'
    ];

    const rows = filteredLogs.map((l) => [
      l.id,
      l.timestamp || l.isoTimestamp || '',
      l.adminId ?? 60,
      l.adminName || 'Super Admin',
      l.actionCategory || 'system',
      l.type || 'system',
      l.title || '',
      l.details || '',
      l.targetUserId ?? '',
      l.targetUserPhone ?? '',
      l.oldValue ?? '',
      l.newValue ?? '',
      l.amount ?? '',
      l.ipAddress || '127.0.0.1',
      l.status || 'info'
    ]);

    downloadCSV('akm_admin_audit_trail', headers, rows);
    showToast(`Exported ${rows.length} audit trail records to CSV!`, 'success');
  };

  // Quick simulate sample admin action to demonstrate logging
  const handleSimulateAction = (type: 'balance' | 'status' | 'settings') => {
    if (type === 'balance') {
      recordAuditLog({
        actionCategory: 'balance_adjust',
        type: 'system',
        title: 'Manual Balance Credit (Audit Test)',
        details: `Administrator manually credited ₹5,000 to Investor account #105 (+91 9876543210). Reason: VIP Partner Bonus Allocation`,
        targetUserId: 105,
        targetUserPhone: '+91 9876543210',
        amount: 5000,
        oldValue: '₹12,450',
        newValue: '₹17,450',
        status: 'success'
      });
      showToast('Simulated manual balance adjustment audit log', 'success');
    } else if (type === 'status') {
      recordAuditLog({
        actionCategory: 'user_status',
        type: 'user',
        title: 'User Account Suspended for Compliance Review',
        details: `Administrator flagged and suspended User #102 (+91 8877665544) due to rapid repeated failed OTP attempts.`,
        targetUserId: 102,
        targetUserPhone: '+91 8877665544',
        oldValue: 'active',
        newValue: 'SUSPENDED',
        status: 'critical'
      });
      showToast('Simulated user status change audit log', 'info');
    } else {
      recordAuditLog({
        actionCategory: 'settings_update',
        type: 'config',
        title: 'Security & Payout Fee Rule Modified',
        details: `Administrator updated withdrawal transaction fee from 8% to 10% and toggled gateway fallback route.`,
        oldValue: 'Withdraw Fee: 8%',
        newValue: 'Withdraw Fee: 10%',
        status: 'warning'
      });
      showToast('Simulated platform settings modification audit log', 'info');
    }
  };

  const getCategoryBadge = (cat?: AuditActionCategory) => {
    switch (cat) {
      case 'balance_adjust':
        return {
          label: 'Balance Adjust',
          icon: Wallet,
          color: 'bg-amber-500/15 text-amber-300 border-amber-500/30'
        };
      case 'user_status':
        return {
          label: 'User Status',
          icon: UserCheck,
          color: 'bg-rose-500/15 text-rose-300 border-rose-500/30'
        };
      case 'settings_update':
        return {
          label: 'Settings Update',
          icon: Sliders,
          color: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30'
        };
      case 'plan_mutation':
        return {
          label: 'Plan Mutation',
          icon: Layers,
          color: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
        };
      case 'payout_action':
        return {
          label: 'Payout Action',
          icon: ArrowUpRight,
          color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
        };
      case 'deposit_action':
        return {
          label: 'Deposit Action',
          icon: ArrowDownLeft,
          color: 'bg-blue-500/15 text-blue-300 border-blue-500/30'
        };
      default:
        return {
          label: 'System Action',
          icon: Terminal,
          color: 'bg-slate-700/60 text-slate-300 border-slate-600/40'
        };
    }
  };

  const getSeverityBadge = (status?: AuditLog['status']) => {
    switch (status) {
      case 'critical':
      case 'error':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse';
      case 'warning':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'success':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Banner & KPI Stat Cards */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 p-4 sm:p-5 rounded-3xl border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Terminal className="w-4 h-4" />
              </div>
              <h2 className="text-sm sm:text-base font-black text-white tracking-wide">
                Administrative Audit Trail & Sensitive Action Log
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              Immutable journal recording manual balance adjustments, user status suspensions, settings edits, and admin user IDs.
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0 w-full sm:w-auto justify-end">
            <button
              onClick={handleExportCSV}
              className="py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all shadow-md shadow-emerald-600/20 cursor-pointer active:scale-95"
              title="Export complete audit trail to CSV file"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>

            {auditLogs.length > 0 && (
              <button
                onClick={() => setShowClearConfirm(true)}
                className="py-2 px-3 bg-rose-950/70 hover:bg-rose-900 text-rose-300 rounded-xl text-xs font-bold flex items-center space-x-1.5 border border-rose-800/60 transition-all cursor-pointer active:scale-95"
                title="Clear audit trail"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                <span className="hidden sm:inline">Clear</span>
              </button>
            )}
          </div>
        </div>

        {/* Metric Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-1">
          <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Records</div>
            <div className="text-lg font-black text-white mt-0.5 font-mono">{stats.total}</div>
            <div className="text-[9px] text-emerald-400 font-semibold mt-0.5">Live Journal Stream</div>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
            <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Balance Adjusts</div>
            <div className="text-lg font-black text-amber-300 mt-0.5 font-mono">{stats.balanceAdjustCount}</div>
            <div className="text-[9px] text-slate-400 font-medium mt-0.5">Credits / Debits</div>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
            <div className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">Status Changes</div>
            <div className="text-lg font-black text-rose-300 mt-0.5 font-mono">{stats.userStatusCount}</div>
            <div className="text-[9px] text-slate-400 font-medium mt-0.5">Bans / Unbans</div>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
            <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Settings Edits</div>
            <div className="text-lg font-black text-indigo-300 mt-0.5 font-mono">{stats.settingsCount}</div>
            <div className="text-[9px] text-slate-400 font-medium mt-0.5">Gateway & Fees</div>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800 col-span-2 sm:col-span-1">
            <div className="text-[10px] font-bold text-teal-400 uppercase tracking-wider">Active Admins</div>
            <div className="text-lg font-black text-teal-300 mt-0.5 font-mono">
              {Math.max(1, distinctAdminIds.length)}
            </div>
            <div className="text-[9px] text-slate-400 font-medium mt-0.5">Admin ID #{user.id || 60}</div>
          </div>
        </div>

        {/* Quick Simulation Bar for Testing & Demo */}
        <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center space-x-1.5 text-slate-400 text-[11px]">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Simulate sensitive action for verification:</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => handleSimulateAction('balance')}
              className="px-2 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg text-[10.5px] font-bold cursor-pointer active:scale-95 transition-all"
            >
              + Balance Debit/Credit
            </button>
            <button
              onClick={() => handleSimulateAction('status')}
              className="px-2 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-lg text-[10.5px] font-bold cursor-pointer active:scale-95 transition-all"
            >
              + User Suspension
            </button>
            <button
              onClick={() => handleSimulateAction('settings')}
              className="px-2 py-1 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-lg text-[10.5px] font-bold cursor-pointer active:scale-95 transition-all"
            >
              + Fee Adjustment
            </button>
          </div>
        </div>
      </div>

      {/* Search & Multi-Filter Control Console */}
      <div className="bg-slate-900/90 p-4 rounded-3xl border border-slate-800 shadow-md space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative w-full sm:flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by Admin ID, Target Phone, Title, keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Admin ID Dropdown Filter */}
          <div className="flex items-center space-x-2 w-full sm:w-auto shrink-0">
            <select
              value={adminFilter}
              onChange={(e) => setAdminFilter(e.target.value)}
              className="w-full sm:w-auto bg-slate-950 border border-slate-700/80 text-xs text-slate-200 py-2 px-3 rounded-xl focus:outline-none focus:border-emerald-500"
            >
              <option value="all">All Admin IDs</option>
              <option value="60">Admin #60 (Super Admin)</option>
              {distinctAdminIds
                .filter((id) => id !== '60')
                .map((id) => (
                  <option key={id} value={id}>
                    Admin #{id}
                  </option>
                ))}
            </select>

            {/* Severity Filter */}
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value as any)}
              className="w-full sm:w-auto bg-slate-950 border border-slate-700/80 text-xs text-slate-200 py-2 px-3 rounded-xl focus:outline-none focus:border-emerald-500"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical Only</option>
              <option value="warning">Warning Only</option>
              <option value="success">Success Only</option>
              <option value="info">Info Only</option>
            </select>
          </div>
        </div>

        {/* Action Category Horizontal Scroll Filter */}
        <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar pt-1">
          {(
            [
              { id: 'all', label: 'All Categories' },
              { id: 'balance_adjust', label: 'Balance Adjustments' },
              { id: 'user_status', label: 'User Status' },
              { id: 'settings_update', label: 'Settings Mod' },
              { id: 'plan_mutation', label: 'Plan Mutations' },
              { id: 'payout_action', label: 'Payout Decisions' },
              { id: 'deposit_action', label: 'Deposits' },
              { id: 'system', label: 'System' }
            ] as const
          ).map((cat) => {
            const isActive = categoryFilter === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer active:scale-95 ${
                  isActive
                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Audit Log Stream Feed */}
      <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-4 space-y-3 shadow-lg">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Audit Stream Journal ({filteredLogs.length} events)
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            Chronological Order (Newest First)
          </span>
        </div>

        {filteredLogs.length === 0 ? (
          <div className="py-12 text-center space-y-2">
            <Terminal className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="text-xs text-slate-400 font-medium">
              No audit records match your search or filter criteria.
            </p>
            <button
              onClick={() => {
                setCategoryFilter('all');
                setSeverityFilter('all');
                setAdminFilter('all');
                setSearchQuery('');
              }}
              className="text-xs text-emerald-400 hover:underline font-bold cursor-pointer"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredLogs.map((log) => {
              const categoryMeta = getCategoryBadge(log.actionCategory);
              const CategoryIcon = categoryMeta.icon;
              const severityClass = getSeverityBadge(log.status);

              return (
                <div
                  key={log.id}
                  className="bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800/90 hover:border-slate-700/80 transition-all space-y-2.5"
                >
                  {/* Top Bar: Category badge, Severity, Admin ID, Timestamp */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      {/* Action Category Badge */}
                      <span
                        className={`inline-flex items-center space-x-1 text-[10px] font-black uppercase px-2 py-0.5 rounded-lg border ${categoryMeta.color}`}
                      >
                        <CategoryIcon className="w-3 h-3" />
                        <span>{categoryMeta.label}</span>
                      </span>

                      {/* Severity Badge */}
                      <span
                        className={`text-[9.5px] font-black uppercase px-2 py-0.5 rounded-md border ${severityClass}`}
                      >
                        {log.status || 'info'}
                      </span>

                      {/* Admin User ID & Name Badge */}
                      <span className="inline-flex items-center space-x-1 text-[10.5px] font-mono font-bold bg-slate-800 text-teal-300 px-2 py-0.5 rounded-lg border border-slate-700">
                        <Shield className="w-3 h-3 text-teal-400" />
                        <span>Admin ID #{log.adminId ?? 60}</span>
                        {log.adminName && (
                          <span className="text-slate-400 font-normal">({log.adminName})</span>
                        )}
                      </span>
                    </div>

                    {/* Timestamp & IP */}
                    <div className="flex items-center space-x-2 text-[11px] text-slate-400 font-mono">
                      {log.ipAddress && (
                        <span className="hidden sm:inline text-slate-500">
                          IP: {log.ipAddress}
                        </span>
                      )}
                      <span className="flex items-center space-x-1 text-slate-300">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{log.timestamp}</span>
                      </span>
                    </div>
                  </div>

                  {/* Action Title & Target User */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="font-bold text-white text-xs sm:text-sm">
                      {log.title}
                    </div>

                    {/* Target User Info */}
                    {(log.targetUserId !== undefined || log.targetUserPhone) && (
                      <div className="inline-flex items-center space-x-1 text-[11px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-800/40 self-start sm:self-auto">
                        <Users className="w-3 h-3" />
                        <span>
                          Target: User #{log.targetUserId || 'N/A'}{' '}
                          {log.targetUserPhone ? `(${log.targetUserPhone})` : ''}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Detailed Description */}
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {log.details}
                  </p>

                  {/* Diff / Value Change Pill & Amount Row */}
                  {(log.oldValue !== undefined || log.newValue !== undefined || log.amount !== undefined) && (
                    <div className="pt-1 flex flex-wrap items-center justify-between gap-2 border-t border-slate-900 text-xs font-mono">
                      {/* Before / After Diff */}
                      {(log.oldValue !== undefined || log.newValue !== undefined) && (
                        <div className="flex items-center space-x-2 text-[11px]">
                          <span className="text-slate-500 font-medium">State Mutation:</span>
                          {log.oldValue !== undefined && (
                            <span className="px-1.5 py-0.5 rounded bg-rose-950/60 text-rose-300 border border-rose-800/40 line-through">
                              {String(log.oldValue)}
                            </span>
                          )}
                          <span className="text-slate-500">➔</span>
                          {log.newValue !== undefined && (
                            <span className="px-1.5 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800/40 font-bold">
                              {String(log.newValue)}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Amount tag */}
                      {log.amount !== undefined && (
                        <span className="ml-auto text-emerald-400 font-bold font-mono text-xs bg-emerald-950/50 px-2 py-0.5 rounded-lg border border-emerald-800/40">
                          {formatINR(log.amount)}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Confirmation Modal to Clear Logs */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center space-x-3 text-rose-400">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Clear Audit Trail?</h4>
                <p className="text-[11px] text-slate-400">This action will empty active local records.</p>
              </div>
            </div>
            <p className="text-xs text-slate-300">
              Are you sure you want to clear {auditLogs.length} audit logs? We recommend exporting a CSV backup first.
            </p>
            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  clearAuditLogs();
                  setShowClearConfirm(false);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold cursor-pointer shadow-md shadow-rose-600/30"
              >
                Confirm Clear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
