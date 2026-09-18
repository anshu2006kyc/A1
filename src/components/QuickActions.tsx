import React, { useState } from 'react';
import { Banknote, Headphones, Send, CreditCard } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { sfx } from '../utils/sound';
import { ServiceModal } from './ServiceModal';

export const QuickActions: React.FC = () => {
  const { setCurrentView, adminSettings } = useApp();
  const [showServiceModal, setShowServiceModal] = useState(false);

  return (
    <>
      <div className="grid grid-cols-4 gap-2.5 px-3.5 my-3.5">
        {/* Recharge - Direct navigation to Deposit Page */}
        <button
          id="action-recharge"
          onClick={() => {
            sfx.playTap();
            setCurrentView('recharge');
          }}
          className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-white shadow-xs border border-gray-100 hover:border-emerald-300 transition-all active:scale-95 cursor-pointer group hover:shadow-sm"
        >
          <div className="w-12 h-12 rounded-2xl btn-chamkila shadow-md shadow-emerald-500/30 flex items-center justify-center text-white group-hover:scale-105 transition-transform">
            <CreditCard className="w-6 h-6 stroke-[2.4] drop-shadow-xs" />
          </div>
          <span className="text-xs font-bold text-gray-800 mt-1.5">Recharge</span>
        </button>

        {/* Withdraw - Direct navigation to Withdrawal Page */}
        <button
          id="action-withdraw"
          onClick={() => {
            sfx.playTap();
            setCurrentView('withdraw');
          }}
          className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-white shadow-xs border border-gray-100 hover:border-emerald-300 transition-all active:scale-95 cursor-pointer group hover:shadow-sm"
        >
          <div className="w-12 h-12 rounded-2xl btn-chamkila shadow-md shadow-emerald-500/30 flex items-center justify-center text-white group-hover:scale-105 transition-transform">
            <Banknote className="w-6 h-6 stroke-[2.3] drop-shadow-xs" />
          </div>
          <span className="text-xs font-bold text-gray-800 mt-1.5">Withdraw</span>
        </button>

        {/* Service */}
        <button
          id="action-service"
          onClick={() => {
            sfx.playTap();
            setShowServiceModal(true);
          }}
          className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-white shadow-xs border border-gray-100 hover:border-emerald-300 transition-all active:scale-95 cursor-pointer group hover:shadow-sm"
        >
          <div className="w-12 h-12 rounded-2xl btn-chamkila-gold shadow-md shadow-amber-500/30 flex items-center justify-center text-slate-900 group-hover:scale-105 transition-transform">
            <Headphones className="w-6 h-6 stroke-[2.4] drop-shadow-xs" />
          </div>
          <span className="text-xs font-bold text-gray-800 mt-1.5">Service</span>
        </button>

        {/* Channel */}
        <a
          id="action-channel"
          href={adminSettings.telegramChannelUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => sfx.playTap()}
          className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-white shadow-xs border border-gray-100 hover:border-emerald-300 transition-all active:scale-95 cursor-pointer group hover:shadow-sm"
        >
          <div className="w-12 h-12 rounded-2xl btn-chamkila shadow-md shadow-emerald-500/30 flex items-center justify-center text-white group-hover:scale-105 transition-transform">
            <Send className="w-6 h-6 stroke-[2.4] drop-shadow-xs" />
          </div>
          <span className="text-xs font-bold text-gray-800 mt-1.5">Channel</span>
        </a>
      </div>

      {/* Online Customer Support Modal */}
      {showServiceModal && (
        <ServiceModal
          onClose={() => setShowServiceModal(false)}
          supportUrl={adminSettings.telegramSupportUrl}
          channelUrl={adminSettings.telegramChannelUrl}
          onOpenRecharge={() => {
            setShowServiceModal(false);
            setCurrentView('recharge');
          }}
          onOpenWithdraw={() => {
            setShowServiceModal(false);
            setCurrentView('withdraw');
          }}
        />
      )}
    </>
  );
};
