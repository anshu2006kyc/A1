import React, { useState } from 'react';
import { ShoppingCart, ShieldCheck } from 'lucide-react';
import { Plan } from '../types';
import { formatINR } from '../utils/currency';
import { getProductArtworkDataUri } from './ProductArtwork';

interface PlanCardProps {
  plan: Plan;
  activePurchasedCount?: number;
  onBuyClick: (plan: Plan) => void;
}

export const PlanCard: React.FC<PlanCardProps> = ({ plan, activePurchasedCount = 0, onBuyClick }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const isLimitReached = Boolean(plan.limit && activePurchasedCount >= plan.limit);

  React.useEffect(() => {
    setImageError(false);
  }, [plan.imageUrl]);

  // Real photographic asset with graceful SVG fallback on load failure
  const reliableImageSrc = !imageError && plan.imageUrl ? plan.imageUrl : getProductArtworkDataUri(plan.id, plan.category);

  return (
    <div className="relative bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between group">
      {/* Product Image Section */}
      <div className="relative h-32 bg-zinc-950 overflow-hidden flex items-center justify-center">
        {/* Machine / Equipment / Bullion High-Trust Artwork */}
        <img
          src={reliableImageSrc}
          alt={plan.title}
          referrerPolicy="no-referrer"
          loading="eager"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          onError={() => setImageError(true)}
        />

        {/* Subtle Vignette Gradient for Depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/30 pointer-events-none" />

        {/* Floating Brand Pill (Bottom-Left) - Sleek Ultra-Micro Branding Text */}
        <div className="absolute bottom-1.5 left-1.5 z-10 flex items-center space-x-0.5 bg-black/85 backdrop-blur-md px-1 py-0.5 rounded-full border border-white/20 shadow-xs">
          <span className="w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: 'var(--brand-primary)' }} />
          <span className="text-[5px] sm:text-[5.5px] font-black tracking-wider text-white/95 uppercase leading-none">
            AKM ENTERPRISES
          </span>
        </div>

        {/* Official Capital Security Seal (Bottom-Right) - Sleek Ultra-Micro Text */}
        <div className="absolute bottom-1.5 right-1.5 z-10 flex items-center space-x-0.5 bg-black/85 backdrop-blur-md px-1 py-0.5 rounded-full border border-emerald-400/40 shadow-xs">
          <ShieldCheck className="w-1.5 h-1.5 text-emerald-400 shrink-0" />
          <span className="text-[5px] sm:text-[5.5px] font-black text-emerald-300 tracking-wider leading-none">100% SECURE</span>
        </div>

        {/* Floating Price Tag with Paise (Top-Left) - Ultra-Micro Compact Text Size */}
        <div className="absolute top-1.5 left-1.5 z-10 flex items-center space-x-0.5 bg-black/85 backdrop-blur-md px-1 py-0.5 rounded-full border border-emerald-400/30 shadow-xs">
          <span className="w-0.5 h-0.5 rounded-full bg-emerald-400" />
          <span className="text-[5px] sm:text-[5.5px] font-black font-mono text-emerald-300 tracking-tight leading-none">
            {formatINR(plan.depositAmount)}
          </span>
        </div>

        {/* Limit or Turbo Badge (Top-Right) - Sleek Compact Corner Tag */}
        <div
          className={`absolute top-0 right-0 z-10 text-[6.5px] sm:text-[7px] font-bold px-1.5 py-0.5 rounded-bl-lg border-l border-b backdrop-blur-xs max-w-[120px] truncate text-white leading-none ${
            plan.durationMinutes
              ? 'bg-amber-400 text-amber-950 border-amber-300 font-black shadow-xs'
              : ''
          }`}
          style={!plan.durationMinutes ? { backgroundColor: 'var(--brand-primary)', borderColor: 'var(--brand-primary)' } : undefined}
        >
          {plan.durationMinutes === 1
            ? '⏱️ 1 Min'
            : plan.durationMinutes === 60
            ? '⏱️ 1 Hour'
            : plan.badge || (plan.durationMinutes ? `⚡ ${plan.durationMinutes}m` : `Limit ${plan.limit || 10}`)}
        </div>
      </div>

      {/* Plan Title Banner - Short One Line */}
      <div
        className={`text-white text-center py-1 px-1.5 text-[9.5px] font-bold tracking-tight truncate whitespace-nowrap overflow-hidden text-ellipsis ${
          plan.durationMinutes ? 'bg-black/85 border-b border-amber-400/30 text-amber-300' : ''
        }`}
        style={!plan.durationMinutes ? { background: 'var(--brand-dark-gradient, #064e3b)' } : undefined}
        title={plan.title}
      >
        {plan.title.replace(/\s*•\s*.*$/, '').trim()}
      </div>

      {/* Metrics 4-Grid: Return Time, Deposit, Daily Return, Est. Total */}
      <div className="p-2.5 grid grid-cols-2 gap-y-2 gap-x-2 text-[10px]">
        <div>
          <span className="text-gray-400 block text-[8.5px]">Return Time</span>
          <span className={`font-bold text-[10px] ${plan.durationMinutes ? 'text-amber-600 font-black' : 'text-gray-900'}`}>
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
          <span className="text-gray-400 block text-[8.5px]">Deposit</span>
          <span className="font-extrabold text-gray-900 text-[9.5px] tabular-nums font-mono tracking-tight">
            {formatINR(plan.depositAmount)}
          </span>
        </div>

        <div>
          <span className="text-gray-400 block text-[8.5px]">
            {plan.durationMinutes ? 'Plan Return' : 'Daily Return'}
          </span>
          <span
            className="font-black text-[9.5px] tabular-nums font-mono text-emerald-600 tracking-tight"
          >
            +{formatINR(plan.dailyIncome)}
          </span>
        </div>

        <div className="text-right">
          <span className="text-gray-400 block text-[8.5px]">Est. Total</span>
          <span
            className="font-black text-[9.5px] tabular-nums font-mono text-emerald-700 tracking-tight"
          >
            {formatINR(plan.totalReturn)}
          </span>
        </div>
      </div>

      {/* Buy Now / Buy Again Button */}
      <div className="p-2 pt-0">
        {isLimitReached ? (
          <button
            id={`buy-btn-${plan.id}`}
            disabled
            className="w-full py-2 px-2.5 rounded-xl bg-gray-100 text-gray-400 font-bold text-[11px] flex items-center justify-center space-x-1.5 cursor-not-allowed border border-gray-200"
          >
            <span>Limit Reached ({activePurchasedCount}/{plan.limit})</span>
          </button>
        ) : (
          <button
            id={`buy-btn-${plan.id}`}
            onClick={() => onBuyClick(plan)}
            className={`w-full py-2 px-2 rounded-xl btn-chamkila text-white font-black flex items-center justify-center space-x-1 active:scale-[0.97] transition-all cursor-pointer shadow-md tracking-wide hover:brightness-110 ${
              activePurchasedCount > 0 ? 'text-[9px]' : 'text-[11px]'
            }`}
          >
            <ShoppingCart className={`stroke-[2.4] drop-shadow-xs shrink-0 ${activePurchasedCount > 0 ? 'w-2.5 h-2.5' : 'w-3 h-3'}`} />
            {activePurchasedCount > 0 ? (
              <span className="drop-shadow-xs font-mono font-bold tracking-tight text-[8px] sm:text-[8.5px] truncate flex items-center justify-center space-x-1">
                <span className="bg-white/20 px-1 py-0.5 rounded text-[7px] sm:text-[7.5px] font-black uppercase tracking-wider">
                  Buy Again
                </span>
                <span className="font-bold text-[8.5px]">
                  {formatINR(plan.depositAmount)}
                </span>
              </span>
            ) : (
              <span className="drop-shadow-xs font-mono font-bold tracking-tight text-[10px] truncate">
                Invest {formatINR(plan.depositAmount)}
              </span>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
