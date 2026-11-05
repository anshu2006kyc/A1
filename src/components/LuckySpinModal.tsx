import React from 'react';
import { createPortal } from 'react-dom';
import { X, Trophy, HelpCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LuckySpinWheel } from './LuckySpinWheel';
import { sfx } from '../utils/sound';

export const LuckySpinModal: React.FC = () => {
  const { isLuckySpinOpen, setIsLuckySpinOpen } = useApp();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isLuckySpinOpen || typeof document === 'undefined' || !document.body) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-amber-300/60 my-auto animate-scale-up">
        {/* Top Gold Strip Accent */}
        <div className="h-2 w-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500" />

        {/* Modal Top Close Bar */}
        <div className="px-4 pt-3 flex items-center justify-between">
          <div className="flex items-center space-x-1 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
            <Trophy className="w-2.5 h-2.5 text-amber-600" />
            <span className="text-[7px] font-black uppercase tracking-wider text-amber-900 leading-none">
              AKM DAILY REWARD
            </span>
          </div>

          <button
            id="close-lucky-spin-modal-btn"
            type="button"
            onClick={() => {
              sfx.playTap();
              setIsLuckySpinOpen(false);
            }}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-900 flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Embedded Wheel Component */}
        <LuckySpinWheel onClose={() => setIsLuckySpinOpen(false)} isEmbedded={true} />

        {/* Rules Footer Accordion */}
        <div className="px-5 pb-5 pt-1 text-center">
          <div className="p-3 bg-amber-50/70 border border-amber-200/60 rounded-2xl text-[10.5px] text-amber-900 text-left space-y-1">
            <div className="font-black text-[11px] text-amber-950 flex items-center space-x-1 mb-1">
              <HelpCircle className="w-3 h-3 text-amber-600" />
              <span>Lucky Spin Rules</span>
            </div>
            <div>• Every registered user gets <strong>1 free spin every 24 hours</strong>.</div>
            <div>• Every spin is 100% guaranteed to land on a cash reward (up to ₹500).</div>
            <div>• Won amount is immediately credited into your main wallet balance.</div>
            <div>• Daily spin resets automatically at midnight (00:00 IST).</div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
