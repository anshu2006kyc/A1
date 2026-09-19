import React, { useState } from 'react';
import { Shield, ShieldAlert, Lock, X, KeyRound, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { sfx } from '../utils/sound';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { unlockAdminSession, setIsAdminOpen, showToast } = useApp();
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin.trim()) {
      setError('Please enter Admin Master PIN');
      return;
    }

    setIsLoading(true);
    setError('');

    setTimeout(() => {
      const success = unlockAdminSession(pin.trim());
      setIsLoading(false);

      if (success) {
        sfx.playSuccess();
        showToast('Admin Session Authorized', 'success');
        setPin('');
        onClose();
        setIsAdminOpen(true);
        if (onSuccess) onSuccess();
      } else {
        sfx.playError();
        setError('Incorrect Admin Security PIN. Access denied.');
      }
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-amber-500/30 w-full max-w-sm rounded-3xl p-6 shadow-2xl text-white relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center space-y-2 mb-5">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
            <Lock className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-black tracking-wide text-white">
            Admin Access Authorization
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
            Authorized personnel only. Enter Master Security PIN to unlock the treasury console.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[11px] font-semibold text-slate-300 block mb-1.5 flex items-center space-x-1">
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              <span>Master Admin PIN / Password</span>
            </label>
            <input
              type="password"
              autoFocus
              placeholder="Enter PIN..."
              value={pin}
              onChange={(e) => {
                setPin(e.target.value);
                if (error) setError('');
              }}
              className="w-full px-4 py-3 bg-slate-950/80 border border-slate-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl text-white font-mono text-center tracking-widest text-lg outline-none transition-all placeholder:text-slate-600 placeholder:tracking-normal placeholder:text-xs"
            />
          </div>

          {error && (
            <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center space-x-2 text-rose-400 text-xs">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !pin.trim()}
            className="w-full py-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-black rounded-xl text-sm transition-all cursor-pointer shadow-lg active:scale-98 flex items-center justify-center space-x-1.5"
          >
            <span>{isLoading ? 'Verifying...' : 'Unlock Admin Console'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
