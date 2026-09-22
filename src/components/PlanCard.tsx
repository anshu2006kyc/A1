import React, { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { Plan } from '../types';
import { formatINR } from '../utils/currency';

interface PlanCardProps {
  plan: Plan;
  activePurchasedCount?: number;
  onBuyClick: (plan: Plan) => void;
}

export const PlanCard: React.FC<PlanCardProps> = ({ plan, activePurchasedCount = 0, onBuyClick }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const isLimitReached = Boolean(plan.limit && activePurchasedCount >= plan.limit);

  return (
    <div className="relative bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between group">
      {/* Product Image Section */}
      <div className="relative h-32 bg-zinc-950 overflow-hidden flex items-center justify-center">
        {/* Tyre Image */}
        {plan.imageUrl && !imageError && (
          <img
            src={plan.imageUrl}
            alt={plan.title}
            referrerPolicy="no-referrer"
            loading="lazy"
            className={`w-full h-full object-cover object-center group-hover:scale-105 transition-all duration-500 ${
              imageLoaded ? 'opacity-90 scale-100' : 'opacity-0 scale-95'
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
        )}

        {/* Fallback Graphic if Image Loading or Error */}
        {(!plan.imageUrl || imageError || !imageLoaded) && (
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a4a25] via-[#0d6e37] to-[#128a47] flex flex-col items-center justify-center text-white p-2">
            <div className="flex items-center space-x-2">
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex flex-col items-center justify-center shadow-lg">
                <span className="text-[11px] font-black text-amber-300">AKM</span>
                <span className="text-[7.5px] font-bold text-emerald-200 uppercase tracking-widest">ASSET</span>
              </div>
            </div>
            <div className="text-[9px] font-bold tracking-widest text-emerald-100 uppercase mt-1.5">
              AKM WEALTH ASSETS
            </div>
          </div>
        )}

        {/* Subtle Vignette Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-black/30 pointer-events-none" />

        {/* Floating Brand Pill (Bottom-Left) */}
        <div className="absolute bottom-1.5 left-2 z-10 flex items-center space-x-1 bg-black/70 backdrop-blur-xs px-2 py-0.5 rounded-full border border-white/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          <span className="text-[9px] font-black tracking-wider text-emerald-300">AKM ENTERPRISES</span>
        </div>

        {/* Limit or Turbo Badge Top Right (Exact match to video) */}
        <div className={`absolute top-0 right-0 z-10 text-[10px] font-bold px-2.5 py-0.5 rounded-bl-xl border-l border-b backdrop-blur-xs max-w-[140px] truncate ${
          plan.durationMinutes
            ? 'bg-amber-400 text-amber-950 border-amber-300 font-black shadow-xs'
            : 'bg-[#00ba58] text-white border-[#00ba58]'
        }`}>
          {plan.durationMinutes === 1
            ? '⏱️ 1 Min'
            : plan.durationMinutes === 60
            ? '⏱️ 1 Hour'
            : plan.badge || (plan.durationMinutes ? `⚡ ${plan.durationMinutes}m` : `Limit ${plan.limit || 10}`)}
        </div>
      </div>

      {/* Plan Title Banner */}
      <div className={`text-white text-center py-1.5 px-2 text-xs font-bold tracking-wide line-clamp-1 ${
        plan.durationMinutes ? 'bg-emerald-950 border-b border-amber-400/30 text-amber-300' : 'bg-emerald-900/90'
      }`}>
        {plan.title}
      </div>

      {/* Metrics 4-Grid: Return Time, Deposit, Daily Return, Est. Total */}
      <div className="p-2.5 grid grid-cols-2 gap-y-2 gap-x-2 text-[11px]">
        <div>
          <span className="text-gray-400 block text-[10px]">Return Time</span>
          <span className={`font-bold text-xs ${plan.durationMinutes ? 'text-amber-600 font-black' : 'text-gray-900'}`}>
            {plan.durationMinutes
              ? plan.durationMinutes === 60
                ? '1 Hour'
                : plan.durationMinutes === 1
                ? '1 Minute'
                : `${plan.durationMinutes} Minutes`
              : `${plan.returnDays} Days`}
          </span>
        </div>

        <div className="text-right">
          <span className="text-gray-400 block text-[10px]">Deposit</span>
          <span className="font-bold text-gray-900 text-xs tabular-nums font-mono">
            {formatINR(plan.depositAmount, { decimals: 0 })}
          </span>
        </div>

        <div>
          <span className="text-gray-400 block text-[10px]">
            {plan.durationMinutes ? 'Plan Return' : 'Daily Return'}
          </span>
          <span className="font-extrabold text-[#00ba58] text-xs tabular-nums font-mono">
            {formatINR(plan.dailyIncome, { decimals: 0 })}
          </span>
        </div>

        <div className="text-right">
          <span className="text-gray-400 block text-[10px]">Est. Total</span>
          <span className="font-extrabold text-[#00ba58] text-xs tabular-nums font-mono">
            {formatINR(plan.totalReturn, { decimals: 0 })}
          </span>
        </div>
      </div>

      {/* Buy Now Button (Matches vibrant green button in video) */}
      <div className="p-2 pt-0">
        {isLimitReached ? (
          <button
            id={`buy-btn-${plan.id}`}
            disabled
            className="w-full py-2.5 px-3 rounded-xl bg-gray-100 text-gray-400 font-bold text-xs flex items-center justify-center space-x-1.5 cursor-not-allowed border border-gray-200"
          >
            <span>Limit Reached ({activePurchasedCount}/{plan.limit})</span>
          </button>
        ) : (
          <button
            id={`buy-btn-${plan.id}`}
            onClick={() => onBuyClick(plan)}
            className="w-full py-2.5 px-3 rounded-xl btn-chamkila text-white font-black text-xs flex items-center justify-center space-x-1.5 active:scale-[0.97] transition-all cursor-pointer shadow-md tracking-wide hover:brightness-110"
          >
            <ShoppingCart className="w-3.5 h-3.5 stroke-[2.4] drop-shadow-xs" />
            <span className="drop-shadow-xs">
              {activePurchasedCount > 0 ? `Buy Again (${activePurchasedCount}/${plan.limit})` : 'Buy Now'}
            </span>
          </button>
        )}
      </div>
    </div>
  );
};
