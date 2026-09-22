import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  AlertTriangle,
  CheckCircle2,
  Database,
  Download,
  FileJson,
  RotateCcw,
  ShieldAlert,
  Trash2,
  Upload
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminBackupTab: React.FC = () => {
  const {
    exportFullBackup,
    importFullBackup,
    resetAllData,
    showToast
  } = useApp();

  const [importJsonText, setImportJsonText] = useState('');
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const handleExport = () => {
    const backupStr = exportFullBackup();
    const blob = new Blob([backupStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `akm_platform_backup_${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Platform JSON backup downloaded!', 'success');
  };

  const handleImport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!importJsonText.trim()) {
      showToast('Please paste valid JSON backup content', 'error');
      return;
    }
    const success = importFullBackup(importJsonText.trim());
    if (success) {
      setImportJsonText('');
    }
  };

  return (
    <div className="space-y-4">
      {/* Backup Header */}
      <div className="bg-slate-800/90 p-5 rounded-3xl border border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-700 flex items-center justify-center text-white shadow-lg shadow-teal-950/40">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Disaster Recovery & State Backup</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Export and restore all databases, wallet transactions, user machines & security flags
            </p>
          </div>
        </div>

        <button
          onClick={handleExport}
          className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-2xl text-xs flex items-center space-x-2 shadow-md active:scale-95 transition-all cursor-pointer shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Export Full JSON Snapshot</span>
        </button>
      </div>

      {/* Import / Restore Section */}
      <div className="bg-slate-800/90 p-5 rounded-3xl border border-slate-700 space-y-4 shadow-md">
        <div className="flex items-center space-x-2">
          <Upload className="w-4 h-4 text-sky-400" />
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">
            Restore Snapshot from JSON
          </h4>
        </div>

        <p className="text-xs text-slate-400">
          Paste the contents of a previously exported backup file to immediately reinstate platform state.
        </p>

        <form onSubmit={handleImport} className="space-y-3 text-xs">
          <textarea
            rows={5}
            placeholder="Paste raw JSON backup payload here..."
            value={importJsonText}
            onChange={(e) => setImportJsonText(e.target.value)}
            className="w-full p-3 bg-slate-950 border border-slate-700 rounded-2xl text-white font-mono text-[11px] focus:outline-none focus:border-emerald-500"
          />

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl text-xs shadow-md active:scale-95 transition-all cursor-pointer flex items-center space-x-1.5"
            >
              <FileJson className="w-4 h-4" />
              <span>Validate & Restore State</span>
            </button>
          </div>
        </form>
      </div>

      {/* Factory Reset Danger Zone */}
      <div className="bg-rose-950/40 p-5 rounded-3xl border border-rose-700/60 space-y-4">
        <div className="flex items-center space-x-2.5">
          <AlertTriangle className="w-5 h-5 text-rose-400" />
          <div>
            <h4 className="text-xs font-bold text-rose-200 uppercase tracking-wider">
              Danger Zone: Factory Reset Database
            </h4>
            <p className="text-xs text-rose-300/80 mt-0.5">
              Clears all local storage keys, active machines, custom plans, and resets to initial seed data.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-[11px] text-slate-400">
            Irreversible action. Make sure to download a backup first.
          </span>
          <button
            onClick={() => setShowConfirmReset(true)}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs flex items-center space-x-1.5 cursor-pointer active:scale-95 transition-all shadow-md shadow-rose-950/40"
          >
            <Trash2 className="w-4 h-4" />
            <span>Reset to Factory State</span>
          </button>
        </div>
      </div>

      {/* Confirm Reset Modal */}
      {showConfirmReset && createPortal(
        <div
          onClick={() => setShowConfirmReset(false)}
          className="fixed inset-0 z-[99999] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900 border border-rose-500/50 w-full max-w-md rounded-3xl p-5 space-y-4 shadow-2xl cursor-default"
          >
            <div className="flex items-center space-x-3 text-rose-400">
              <ShieldAlert className="w-6 h-6 shrink-0" />
              <h3 className="text-base font-black text-white">Confirm Factory Reset?</h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              This will erase all custom transactions, created plans, user balance modifications, and restore default demo seed data.
            </p>

            <div className="flex justify-end space-x-2 pt-2 text-xs">
              <button
                type="button"
                onClick={() => setShowConfirmReset(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowConfirmReset(false);
                  resetAllData();
                }}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl shadow-md cursor-pointer active:scale-95 transition-all"
              >
                Yes, Reset Everything
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
