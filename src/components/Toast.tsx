import React from 'react';
import { AlertCircle, CheckCircle2, ChevronRight, Info, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Toast: React.FC = () => {
  const { toast, clearToast, setCurrentView } = useApp();

  if (!toast || !toast.text) return null;

  const isInsufficient = toast.text.toLowerCase().includes('insufficient');

  return (
    <div className="fixed top-4 left-0 right-0 z-50 px-4 flex justify-center pointer-events-none animate-slide-down">
      <div
        className={`pointer-events-auto max-w-sm w-full p-3.5 rounded-2xl shadow-xl flex items-start space-x-3 border backdrop-blur-md transition-all ${
          toast.type === 'error'
            ? 'bg-rose-50/95 border-rose-200 text-rose-900'
            : toast.type === 'success'
            ? 'bg-emerald-50/95 border-emerald-200 text-emerald-900'
            : 'bg-zinc-900/95 border-zinc-700 text-white'
        }`}
      >
        <div className="mt-0.5 shrink-0">
          {toast.type === 'error' ? (
            <AlertCircle className="w-5 h-5 text-rose-600" />
          ) : toast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          ) : (
            <Info className="w-5 h-5 text-zinc-300" />
          )}
        </div>

        <div className="flex-1">
          <div className="text-xs font-bold uppercase tracking-wider opacity-75">
            {toast.type === 'error' ? 'ERROR' : toast.type === 'success' ? 'SUCCESS' : 'NOTICE'}
          </div>
          <p className="text-xs font-medium mt-0.5 leading-relaxed">{toast.text}</p>

          {isInsufficient && (
            <button
              onClick={() => {
                clearToast();
                setCurrentView('recharge');
              }}
              className="mt-2 inline-flex items-center space-x-1 bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold px-3 py-1 rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <span>Recharge Wallet</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          )}
        </div>

        <button
          id="toast-close-btn"
          onClick={() => clearToast()}
          className="p-1.5 rounded-full hover:bg-black/10 text-gray-500 hover:text-gray-800 transition-colors cursor-pointer active:scale-90"
          title="Dismiss notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
