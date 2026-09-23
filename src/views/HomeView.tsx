import React, { useState } from 'react';
import { Crown, Sprout, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';
import { BuyModal } from '../components/BuyModal';
import { HeaderBanner } from '../components/HeaderBanner';
import { PlanCard } from '../components/PlanCard';
import { QuickActions } from '../components/QuickActions';
import { LiveTicker } from '../components/LiveTicker';
import { useApp } from '../context/AppContext';
import { Plan } from '../types';
import { sfx } from '../utils/sound';
import { formatINR } from '../utils/currency';

export const HomeView: React.FC = () => {
  const { user, plans, userPlans, transactions, selectedCategory, setSelectedCategory, buyPlan, navigateToRecharge, setCurrentView, showToast } = useApp();
  const [selectedPlanToBuy, setSelectedPlanToBuy] = useState<Plan | null>(null);
  const [turboDurationFilter, setTurboDurationFilter] = useState<'all' | '1m' | '1h'>('all');

  const hasDeposited = (user.totalRecharge || 0) > 0 || transactions.some(
    (t) => t.userId === user.id && t.type === 'recharge' && t.status === 'success'
  );

  const filteredPlans = plans.filter((p) => {
    if (p.category !== selectedCategory || !p.isActive) return false;
    if (selectedCategory === 'turbo') {
      if (turboDurationFilter === '1m') return p.durationMinutes === 1;
      if (turboDurationFilter === '1h') return p.durationMinutes === 60;
    }
    return true;
  });

  const getActiveCount = (planId: string | number) => {
    return userPlans.filter((up) => up.userId === user.id && String(up.planId) === String(planId) && up.status === 'active').length;
  };

  return (
    <div className="pb-24 animate-fade-in">
      {/* Header Banner */}
      <HeaderBanner />

      {/* Live Activity & Payout Ticker */}
      <div className="mt-3">
        <LiveTicker />
      </div>

      {/* Quick 4 Actions (Recharge, Withdraw, Service, Channel) */}
      <QuickActions />

      {/* Category Tabs (Matches Video: ★ Normal, ⚡ Turbo, 👑 VIP) */}
      <div className="px-3.5 mb-3">
        <div className="grid grid-cols-3 gap-2">
          <button
            id="tab-normal"
            onClick={() => {
              sfx.playTap();
              setSelectedCategory('normal');
            }}
            className={`py-2.5 px-2 rounded-xl text-center flex items-center justify-center space-x-1.5 transition-all cursor-pointer font-black text-xs ${
              selectedCategory === 'normal'
                ? 'btn-chamkila text-white shadow-md'
                : 'bg-white text-gray-700 border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/40'
            }`}
          >
            <span className="text-amber-300 text-sm drop-shadow-xs">★</span>
            <span className="drop-shadow-xs">Normal</span>
          </button>

          <button
            id="tab-turbo"
            onClick={() => {
              sfx.playTap();
              setSelectedCategory('turbo');
            }}
            className={`py-2.5 px-2 rounded-xl text-center flex items-center justify-center space-x-1.5 transition-all cursor-pointer font-black text-xs ${
              selectedCategory === 'turbo'
                ? 'btn-chamkila-gold text-amber-950 shadow-md ring-1 ring-amber-300/80'
                : 'bg-white text-gray-700 border border-gray-200 hover:border-amber-300 hover:bg-amber-50/40'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-900 fill-amber-300" />
            <span className="drop-shadow-xs">Turbo</span>
          </button>

          <button
            id="tab-vip"
            onClick={() => {
              sfx.playTap();
              setSelectedCategory('vip');
            }}
            className={`py-2.5 px-2 rounded-xl text-center flex items-center justify-center space-x-1.5 transition-all cursor-pointer font-black text-xs ${
              selectedCategory === 'vip'
                ? 'btn-chamkila text-white shadow-md'
                : 'bg-white text-gray-700 border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/40'
            }`}
          >
            <Crown className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
            <span className="drop-shadow-xs">VIP</span>
          </button>
        </div>

        {/* Clean Interactive Turbo Duration Filter Toggles */}
        {selectedCategory === 'turbo' && (
          <div className="mt-2.5 p-2 bg-gradient-to-r from-amber-500/10 via-amber-400/15 to-orange-500/10 border border-amber-300/70 rounded-2xl animate-fade-in shadow-xs">
            <div className="flex items-center justify-between px-1 mb-1.5">
              <div className="flex items-center space-x-1.5 text-xs font-extrabold text-amber-950">
                <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-400" />
                <span>Turbo Duration</span>
              </div>
              <span className="text-[9.5px] text-amber-900 font-black bg-white/90 px-2 py-0.5 rounded-md border border-amber-200">
                Auto-Settlement
              </span>
            </div>

            <div className="grid grid-cols-3 gap-1.5">
              <button
                id="toggle-turbo-all"
                type="button"
                onClick={() => {
                  sfx.playTap();
                  setTurboDurationFilter('all');
                }}
                className={`py-1.5 px-2 rounded-xl text-xs font-bold text-center transition-all cursor-pointer ${
                  turboDurationFilter === 'all'
                    ? 'bg-amber-600 text-white shadow-sm font-black ring-1 ring-amber-400'
                    : 'bg-white/80 text-amber-900 hover:bg-white border border-amber-200/70'
                }`}
              >
                All Plans
              </button>

              <button
                id="toggle-turbo-1m"
                type="button"
                onClick={() => {
                  sfx.playTap();
                  setTurboDurationFilter('1m');
                }}
                className={`py-1.5 px-2 rounded-xl text-xs font-bold text-center flex items-center justify-center space-x-1 transition-all cursor-pointer ${
                  turboDurationFilter === '1m'
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-sm font-black ring-1 ring-amber-300'
                    : 'bg-white/80 text-amber-900 hover:bg-white border border-amber-200/70'
                }`}
              >
                <span>⏱️ 1 Minute</span>
              </button>

              <button
                id="toggle-turbo-1h"
                type="button"
                onClick={() => {
                  sfx.playTap();
                  setTurboDurationFilter('1h');
                }}
                className={`py-1.5 px-2 rounded-xl text-xs font-bold text-center flex items-center justify-center space-x-1 transition-all cursor-pointer ${
                  turboDurationFilter === '1h'
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-sm font-black ring-1 ring-amber-300'
                    : 'bg-white/80 text-amber-900 hover:bg-white border border-amber-200/70'
                }`}
              >
                <span>⏱️ 1 Hour</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Plans Grid (2 columns) */}
      <div className="px-4">
        <div className="grid grid-cols-2 gap-3">
          {filteredPlans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              activePurchasedCount={getActiveCount(plan.id)}
              onBuyClick={(p) => {
                sfx.playTap();
                setSelectedPlanToBuy(p);
              }}
            />
          ))}
        </div>

        {filteredPlans.length === 0 && (
          <div className="text-center py-10 bg-white rounded-2xl border border-gray-100 p-6">
            <div className="text-gray-400 text-sm">No plans available in this category.</div>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {selectedPlanToBuy && (
        <BuyModal
          plan={selectedPlanToBuy}
          userBalance={user.balance}
          userTotalRecharge={user.totalRecharge || 0}
          hasDeposited={hasDeposited}
          activeCount={getActiveCount(selectedPlanToBuy.id)}
          onClose={() => setSelectedPlanToBuy(null)}
          onConfirm={() => buyPlan(selectedPlanToBuy)}
          onViewMyProducts={() => {
            sfx.playTap();
            setSelectedPlanToBuy(null);
            setCurrentView('myproducts');
          }}
          onGoToRecharge={(amt) => {
            sfx.playTap();
            setSelectedPlanToBuy(null);
            navigateToRecharge(amt);
          }}
        />
      )}
    </div>
  );
};
