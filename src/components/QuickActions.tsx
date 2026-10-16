import React, { useState } from 'react';
import { Banknote, Headphones, CreditCard } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { sfx } from '../utils/sound';
import { ServiceModal } from './ServiceModal';
import { TelegramIcon } from './BrandIcons';

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
          className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-white shadow-xs border border-gray-100 hover:border-[var(--brand-primary)] transition-all active:scale-95 cursor-pointer group hover:shadow-sm"
        >
          <div
            className="w-12 h-12 rounded-2xl btn-chamkila flex items-center justify-center text-white group-hover:scale-105 transition-transform"
            style={{ boxShadow: '0 4px 14px var(--brand-glow)' }}
          >
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
          className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-white shadow-xs border border-gray-100 hover:border-[var(--brand-primary)] transition-all active:scale-95 cursor-pointer group hover:shadow-sm"
        >
          <div
            className="w-12 h-12 rounded-2xl btn-chamkila flex items-center justify-center text-white group-hover:scale-105 transition-transform"
            style={{ boxShadow: '0 4px 14px var(--brand-glow)' }}
          >
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
          className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-white shadow-xs border border-gray-100 hover:border-amber-400 transition-all active:scale-95 cursor-pointer group hover:shadow-sm"
        >
          <div className="w-12 h-12 rounded-2xl btn-chamkila-gold shadow-md shadow-amber-500/30 flex items-center justify-center text-slate-900 group-hover:scale-105 transition-transform">
            <Headphones className="w-6 h-6 stroke-[2.4] drop-shadow-xs" />
          </div>
          <span className="text-xs font-bold text-gray-800 mt-1.5">Service</span>
        </button>

        {/* Channel - Official Real Telegram Channel Button */}
        <a
          id="action-channel"
          href={adminSettings.telegramChannelUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => sfx.playTap()}
          className="relative flex flex-col items-center justify-center p-2.5 rounded-2xl bg-white shadow-xs border border-gray-100 hover:border-[#229ED9] transition-all active:scale-95 cursor-pointer group hover:shadow-md"
          title="Join Official Telegram Channel"
        >
          <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#0088cc] via-[#229ED9] to-[#2BA6E1] shadow-md shadow-sky-500/35 flex items-center justify-center text-white group-hover:scale-105 transition-transform overflow-hidden animate-telegram-aura">
            {/* Ambient shimmer sweep */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />

            {/* Real Animated Telegram Icon */}
            <TelegramIcon
              animated={true}
              className="w-6 h-6 fill-white drop-shadow-xs group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:scale-110 transition-transform duration-200"
            />

            {/* Active live radar beacon */}
            <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-80" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white/95" />
            </span>
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
