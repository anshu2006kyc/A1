import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  AlertOctagon,
  AlertTriangle,
  Ban,
  Check,
  CheckCircle2,
  Copy,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  LockOpen,
  Plus,
  RotateCcw,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  Unlock,
  Zap
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatINR } from '../../utils/currency';

export const AdminRiskTab: React.FC = () => {
  const {
    adminSettings,
    updateAdminSettings,
    securityAlerts,
    resolveSecurityAlert,
    clearSecurityAlerts,
    addSecurityAlert,
    showToast
  } = useApp();

  const [showAddAlertModal, setShowAddAlertModal] = useState(false);
  const [alertLevel, setAlertLevel] = useState<'critical' | 'warning' | 'info'>('warning');
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertIp, setAlertIp] = useState('103.21.244.0');

  // Master Admin PIN Manager State
  const [showPin, setShowPin] = useState(false);
  const [newAdminPin, setNewAdminPin] = useState(adminSettings.adminPassword || '8340');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedPin, setCopiedPin] = useState(false);

  const handleUpdateAdminPin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPin = newAdminPin.trim();
    if (!cleanPin || cleanPin.length < 4) {
      showToast('Master Admin PIN must be at least 4 characters long', 'error');
      return;
    }
    updateAdminSettings({ adminPassword: cleanPin });
    showToast(`Master Admin PIN successfully updated to: ${cleanPin}`, 'success');
  };

  const handleCopyLink = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const pin = adminSettings.adminPassword || '8340';
    const link = `${origin}/?admin=${encodeURIComponent(pin)}`;
    navigator.clipboard?.writeText(link);
    setCopiedLink(true);
    showToast('1-Click Admin Access Link copied to clipboard!', 'success');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyPin = () => {
    const pin = adminSettings.adminPassword || '8340';
    navigator.clipboard?.writeText(pin);
    setCopiedPin(true);
    showToast(`Master PIN copied: ${pin}`, 'info');
    setTimeout(() => setCopiedPin(false), 2000);
  };

  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!alertTitle.trim() || !alertMessage.trim()) {
      showToast('Please fill out all fields', 'error');
      return;
    }
    addSecurityAlert(alertLevel, alertTitle, alertMessage, alertIp);
    setShowAddAlertModal(false);
    setAlertTitle('');
    setAlertMessage('');
    showToast('Security alert generated!', 'info');
  };

  return (
    <div className="space-y-4">
      {/* Emergency Kill Switches Header */}
      <div className="bg-slate-800/90 p-5 rounded-3xl border border-slate-700 space-y-4 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <AlertOctagon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Emergency Kill-Switches</h3>
              <p className="text-xs text-slate-400">Instant platform-wide restrictions in case of suspected breach or maintenance</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Freeze Withdrawals */}
          <div
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              adminSettings.freezeWithdrawals
                ? 'bg-rose-950/80 border-rose-600 shadow-md shadow-rose-950/40'
                : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
            }`}
            onClick={() => {
              const next = !adminSettings.freezeWithdrawals;
              updateAdminSettings({ freezeWithdrawals: next });
              showToast(next ? 'Withdrawals are now LOCKED!' : 'Withdrawals are now UNLOCKED!', next ? 'error' : 'success');
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">Freeze Withdrawals</span>
              {adminSettings.freezeWithdrawals ? (
                <Lock className="w-4 h-4 text-rose-400" />
              ) : (
                <Unlock className="w-4 h-4 text-emerald-400" />
              )}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              {adminSettings.freezeWithdrawals ? 'Active (All payouts blocked)' : 'Disabled (Payouts permitted)'}
            </div>
          </div>

          {/* Freeze Deposits */}
          <div
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              adminSettings.freezeDeposits
                ? 'bg-rose-950/80 border-rose-600 shadow-md shadow-rose-950/40'
                : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
            }`}
            onClick={() => {
              const next = !adminSettings.freezeDeposits;
              updateAdminSettings({ freezeDeposits: next });
              showToast(next ? 'Deposits are now LOCKED!' : 'Deposits are now OPEN!', next ? 'error' : 'success');
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">Freeze Deposits</span>
              {adminSettings.freezeDeposits ? (
                <Lock className="w-4 h-4 text-rose-400" />
              ) : (
                <Unlock className="w-4 h-4 text-emerald-400" />
              )}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              {adminSettings.freezeDeposits ? 'Active (Recharges halted)' : 'Disabled (Gateway open)'}
            </div>
          </div>

          {/* Maintenance Mode */}
          <div
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              adminSettings.maintenanceMode
                ? 'bg-amber-950/80 border-amber-600 shadow-md'
                : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
            }`}
            onClick={() => {
              const next = !adminSettings.maintenanceMode;
              updateAdminSettings({ maintenanceMode: next });
              showToast(next ? 'Platform in Maintenance Mode' : 'Maintenance Mode Lifted', next ? 'info' : 'success');
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">Maintenance Mode</span>
              {adminSettings.maintenanceMode ? (
                <AlertTriangle className="w-4 h-4 text-amber-400" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              )}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              {adminSettings.maintenanceMode ? 'Active (Banner visible to all)' : 'Disabled (Portal Normal)'}
            </div>
          </div>

          {/* Duplicate UTR Protection */}
          <div
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              adminSettings.duplicateUtrBlockEnabled
                ? 'bg-emerald-950/60 border-emerald-600'
                : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
            }`}
            onClick={() => {
              const next = !adminSettings.duplicateUtrBlockEnabled;
              updateAdminSettings({ duplicateUtrBlockEnabled: next });
              showToast(next ? 'Anti-Duplicate UTR Protection Enabled' : 'Anti-Duplicate UTR Protection Disabled', 'info');
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">Anti-Duplicate UTR</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              {adminSettings.duplicateUtrBlockEnabled ? 'Active (Re-used UTRs blocked)' : 'Off (Re-submissions allowed)'}
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* MASTER ADMIN ACCESS CODE & CREDENTIAL CONTROL                */}
      {/* ============================================================ */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-amber-950/40 p-5 rounded-3xl border border-amber-500/30 space-y-4 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-inner">
              <KeyRound className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-black text-white tracking-wide">Master Admin Access Code & PIN</h3>
                <span className="bg-amber-400/20 text-amber-300 text-[10px] font-black px-2 py-0.5 rounded-full border border-amber-400/30">
                  TOP SECURITY
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Current platform security passcode required to unlock the Admin Treasury Console
              </p>
            </div>
          </div>

          {/* Quick 1-Click Copy Access Link Button */}
          <button
            type="button"
            onClick={handleCopyLink}
            className="flex items-center justify-center space-x-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-4 py-2.5 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer shrink-0"
          >
            {copiedLink ? <Check className="w-4 h-4 text-slate-950" /> : <Copy className="w-4 h-4 text-slate-950" />}
            <span>{copiedLink ? 'Link Copied!' : 'Copy 1-Click Admin Link'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          {/* Card 1: Current Master PIN Display */}
          <div className="bg-slate-950/80 p-4 rounded-2xl border border-amber-500/20 flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Current Master PIN</span>
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="text-slate-400 hover:text-white p-1 rounded-md transition-colors cursor-pointer"
                title={showPin ? 'Hide PIN' : 'Reveal PIN'}
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-2xl font-black text-amber-400 tracking-widest">
                {showPin ? (adminSettings.adminPassword || '8340') : '••••'}
              </span>
              <button
                type="button"
                onClick={handleCopyPin}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg font-bold flex items-center space-x-1 cursor-pointer transition-colors"
              >
                {copiedPin ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedPin ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-[10px] text-slate-500">
              Default passcode: <code className="text-amber-300 font-bold">8340</code> (Also accepts: admin8340, 123456)
            </p>
          </div>

          {/* Card 2: Update PIN Form */}
          <form
            onSubmit={handleUpdateAdminPin}
            className="bg-slate-950/80 p-4 rounded-2xl border border-slate-700/80 flex flex-col justify-between space-y-3 md:col-span-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Change Master Admin PIN</span>
              <span className="text-[10px] text-slate-400">Min 4 characters or digits</span>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={newAdminPin}
                onChange={(e) => setNewAdminPin(e.target.value)}
                placeholder="Enter new Master PIN..."
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono text-sm tracking-wider focus:outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md active:scale-95 cursor-pointer whitespace-nowrap"
              >
                Save New PIN
              </button>
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400">
              <span>Syncs automatically across localStorage & Cloud DB</span>
              <button
                type="button"
                onClick={() => {
                  setNewAdminPin('8340');
                  updateAdminSettings({ adminPassword: '8340' });
                  showToast('Admin PIN reset to default: 8340', 'info');
                }}
                className="text-amber-400 hover:underline cursor-pointer"
              >
                Reset to 8340
              </button>
            </div>
          </form>
        </div>

        {/* Emergency Master Passcodes Info */}
        <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center space-x-2 text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Direct Browser Access: <code className="text-amber-300 font-mono bg-slate-900 px-1.5 py-0.5 rounded">https://your-domain.com/?admin=8340</code>
            </span>
          </div>
          <div className="text-[11px] text-slate-400">
            Emergency Master Passcode: <span className="font-mono text-white font-bold">REC-AKM-8340-9921</span>
          </div>
        </div>
      </div>

      {/* Thresholds & Rule Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-slate-800/90 p-5 rounded-3xl border border-slate-700 space-y-3">
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-sky-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">High-Value Withdrawal Flagging</h4>
          </div>

          <p className="text-xs text-slate-400">
            Cashout requests exceeding this amount require elevated manual approval and will trigger a critical risk alert.
          </p>

          <div className="flex items-center space-x-2 pt-1">
            <input
              type="number"
              value={adminSettings.highValueWithdrawThreshold || 5000}
              onChange={(e) =>
                updateAdminSettings({
                  highValueWithdrawThreshold: parseFloat(e.target.value) || 0
                })
              }
              className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
            />
            <span className="text-xs font-mono font-bold text-slate-400">INR</span>
          </div>
        </div>

        <div className="bg-slate-800/90 p-5 rounded-3xl border border-slate-700 space-y-3">
          <div className="flex items-center space-x-2">
            <Ban className="w-4 h-4 text-amber-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Minimum Tier For Withdrawal</h4>
          </div>

          <p className="text-xs text-slate-400">
            Enforce a minimum tier level required to request bank dispatches (Anti-Sybil / Farm bot protection).
          </p>

          <select
            value={adminSettings.minMemberLevelForWithdraw || 'Member'}
            onChange={(e) =>
              updateAdminSettings({
                minMemberLevelForWithdraw: e.target.value
              })
            }
            className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-bold text-xs focus:outline-none focus:border-emerald-500"
          >
            <option value="Member">Any Member (Standard)</option>
            <option value="VIP 1">VIP 1 or Higher</option>
            <option value="VIP 2">VIP 2 or Higher</option>
            <option value="VIP 3">VIP 3 or Higher</option>
          </select>
        </div>
      </div>

      {/* Live Security & Fraud Alerts Feed */}
      <div className="bg-slate-800/90 rounded-3xl border border-slate-700 p-5 space-y-4 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-slate-700">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Real-Time Security & Risk Alerts ({securityAlerts.length})
              </h4>
              <span className="text-[10px] text-slate-400">Monitors suspicious IPs, rapid calls & UTR collision attacks</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowAddAlertModal(true)}
              className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl text-xs font-bold flex items-center space-x-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Simulate Threat</span>
            </button>
            {securityAlerts.length > 0 && (
              <button
                onClick={clearSecurityAlerts}
                className="px-3 py-1.5 bg-rose-950 hover:bg-rose-900 text-rose-300 rounded-xl text-xs font-bold flex items-center space-x-1 border border-rose-800 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                <span>Clear All</span>
              </button>
            )}
          </div>
        </div>

        {securityAlerts.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No active security threats detected. Defense shield nominal.
          </div>
        ) : (
          <div className="divide-y divide-slate-700/60">
            {securityAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
                  alert.resolved ? 'opacity-50' : ''
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                        alert.level === 'critical'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : alert.level === 'warning'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                      }`}
                    >
                      {alert.level}
                    </span>
                    <span className="font-bold text-white">{alert.title}</span>
                    <span className="text-[10px] text-slate-400 font-mono">[{alert.timestamp}]</span>
                  </div>
                  <div className="text-[11px] text-slate-300">{alert.message}</div>
                  {alert.sourceIp && (
                    <div className="text-[10px] text-slate-400 font-mono">
                      Origin IP: <strong className="text-slate-200">{alert.sourceIp}</strong>
                    </div>
                  )}
                </div>

                <div>
                  {!alert.resolved ? (
                    <button
                      onClick={() => resolveSecurityAlert(alert.id)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center space-x-1 cursor-pointer active:scale-95 transition-all"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Resolve</span>
                    </button>
                  ) : (
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-1 rounded-lg border border-emerald-800/60">
                      Resolved
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Simulate Threat Modal */}
      {showAddAlertModal && createPortal(
        <div
          onClick={() => setShowAddAlertModal(false)}
          className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-3xl p-5 space-y-4 shadow-2xl cursor-default"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span>Simulate Security Incident</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAddAlertModal(false)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 bg-slate-800 rounded-lg cursor-pointer"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleCreateAlert} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Severity Level</label>
                <select
                  value={alertLevel}
                  onChange={(e) => setAlertLevel(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-bold focus:outline-none focus:border-emerald-500"
                >
                  <option value="critical">CRITICAL (High Risk / Fraud)</option>
                  <option value="warning">WARNING (Suspicious Pattern)</option>
                  <option value="info">INFO (Notice)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Alert Title</label>
                <input
                  type="text"
                  placeholder="e.g. Rapid Consecutive Withdrawals"
                  value={alertTitle}
                  onChange={(e) => setAlertTitle(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Message Description</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Account attempted 4 withdrawals within 90 seconds from unfamiliar ASN."
                  value={alertMessage}
                  onChange={(e) => setAlertMessage(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Source IP Address</label>
                <input
                  type="text"
                  value={alertIp}
                  onChange={(e) => setAlertIp(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddAlertModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold shadow-md cursor-pointer active:scale-95 transition-all"
                >
                  Publish Alert
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
