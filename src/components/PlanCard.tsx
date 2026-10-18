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

  // High-trust institutional artwork (0ms instant loading & capital secure seals)
  const isUnsplash = Boolean(plan.imageUrl && plan.imageUrl.includes('unsplash.com'));
  const reliableImageSrc = !plan.imageUrl || isUnsplash || imageError
    ? getProductArtworkDataUri(plan.id, plan.category)
    : plan.imageUrl;

  return (
    <div className="relative bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between group">
      {/* Product Image Section */}
      <div className="relative h-32 bg-zinc-950 overflow-hidden flex items-center justify-center">
        {/* Machine / Equipment / Bullion High-Trust Artwork */}
        <img
          src={reliableImageSrc}
          alt={plan.title}
          referrerPolicy="no-referrer"
          loading="lazy"
          className={`w-full h-full object-cover object-center group-hover:scale-105 transition-all duration-500 ${
            imageLoaded || reliableImageSrc.startsWith('data:image') ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
        />

        {/* Subtle Vignette Gradient for Depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/30 pointer-events-none" />

        {/* Floating Brand Pill (Bottom-Left) */}
        <div className="absolute bottom-1.5 left-2 z-10 flex items-center space-x-1 bg-black/75 backdrop-blur-xs px-2 py-0.5 rounded-full border border-white/20">
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--brand-primary)' }} />
          <span className="text-[8.5px] font-black tracking-wider text-white">AKM BKT ASSET</span>
        </div>

        {/* Official Capital Security Seal (Bottom-Right) */}
        <div className="absolute bottom-1.5 right-2 z-10 flex items-center space-x-1 bg-black/80 backdrop-blur-xs px-1.5 py-0.5 rounded-full border border-emerald-400/40 shadow-xs">
          <ShieldCheck className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
          <span className="text-[8px] font-black text-emerald-300 tracking-wider">100% SECURE</span>
        </div>

        {/* Floating Price Tag with Paise (Top-Left) */}
        <div className="absolute top-1.5 left-2 z-10 flex items-center space-x-1 bg-black/85 backdrop-blur-md px-2 py-0.5 rounded-full border border-emerald-400/40 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[9px] font-black font-mono text-emerald-300 tracking-tight">
            {formatINR(plan.depositAmount)}
          </span>
        </div>

        {/* Limit or Turbo Badge Top Right */}
        <div
          className={`absolute top-0 right-0 z-10 text-[9px] font-bold px-2 py-0.5 rounded-bl-xl border-l border-b backdrop-blur-xs max-w-[140px] truncate text-white ${
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

      {/* Plan Title Banner */}
      <div
        className={`text-white text-center py-1.5 px-2 text-[10.5px] font-bold tracking-wide line-clamp-1 ${
          plan.durationMinutes ? 'bg-black/85 border-b border-amber-400/30 text-amber-300' : ''
        }`}
        style={!plan.durationMinutes ? { background: 'var(--brand-dark-gradient, #064e3b)' } : undefined}
      >
        {plan.title}
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
