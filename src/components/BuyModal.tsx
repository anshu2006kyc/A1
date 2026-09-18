import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AlertCircle, CheckCircle2, ChevronRight, Loader2, Package, Wallet, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Plan } from '../types';
import { formatINR } from '../utils/currency';
import { sfx } from '../utils/sound';

interface BuyModalProps {
  plan: Plan | null;
  userBalance: number;
  activeCount?: number;
  onClose: () => void;
  onConfirm: () => { success: boolean; message: string } | Promise<{ success: boolean; message: string }>;
  onGoToRecharge: (amount: number) => void;
  onViewMyProducts: () => void;
}

export const BuyModal: React.FC<BuyModalProps> = ({
  plan,
  userBalance,
  activeCount = 0,
  onClose,
  onConfirm,
  onGoToRecharge,
  onViewMyProducts
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Prevent background scrolling while modal is open
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  if (!plan) return null;

  const isLowBalance = userBalance < plan.depositAmount;
  const isLimitReached = Boolean(plan.limit && activeCount >= plan.limit);

  const handlePurchase = async () => {
    if (isSubmitting || isLowBalance || isLimitReached) return;
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await onConfirm();
      if (res && res.success) {
        sfx.playSuccess();
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 }
        });
        setPurchaseSuccess(true);
      } else if (res && !res.success) {
        sfx.playTap();
        setErrorMessage(res.message);
      }
    } catch {
      setErrorMessage('Purchase failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return createPortal(
    <div
      onClick={onClose}
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-gray-100 text-center animate-scale-up my-auto relative cursor-default max-h-[92vh] overflow-y-auto"
      >
        {/* Top Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 flex items-center justify-center transition-colors cursor-pointer active:scale-95"
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>
        {purchaseSuccess ? (
          /* Success Screen */
          <div className="space-y-4 py-2">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner animate-bounce">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <h3 className="text-base font-extrabold text-gray-900">
                Investment Activated!
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Your investment in <span className="font-bold text-gray-800">{plan.title}</span> has started successfully.
              </p>
            </div>

            <div className="p-3 bg-emerald-50/80 rounded-2xl border border-emerald-100 text-left space-y-1 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Invested:</span>
                <span className="font-bold text-gray-900 font-mono">{formatINR(plan.depositAmount, { decimals: 0 })}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>{plan.durationMinutes ? 'Total Return:' : 'Daily Profit:'}</span>
                <span className="font-bold text-emerald-700 font-mono">
                  {formatINR(plan.dailyIncome, { decimals: 0 })}{plan.durationMinutes ? '' : '/day'}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Return Time:</span>
                <span className="font-bold text-amber-700">
                  {plan.durationMinutes
                    ? (plan.durationMinutes === 60 ? '1 Hour (60m)' : `${plan.durationMinutes} Minutes`)
                    : `${plan.returnDays} Days`}
                </span>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <button
                id="buy-view-products-btn"
                onClick={onViewMyProducts}
                className="w-full py-2.5 px-3 rounded-xl btn-chamkila text-white font-extrabold text-xs shadow-md flex items-center justify-center space-x-1.5 active:scale-95 transition-all cursor-pointer"
              >
                <Package className="w-4 h-4" />
                <span>View in My Products</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                id="buy-done-btn"
                onClick={onClose}
                className="w-full py-2 px-3 rounded-xl border border-gray-200 text-gray-600 font-semibold text-xs hover:bg-gray-50 active:scale-95 transition-all cursor-pointer"
              >
                Continue Browsing
              </button>
            </div>
          </div>
        ) : (
          /* Confirmation Screen */
          <>
            <h3 className="text-base font-bold text-gray-900 leading-snug px-2">
              {isLowBalance ? 'Deposit Required to Subscribe' : 'Confirm Plan Purchase'}
            </h3>

            <div className="my-3 p-3 bg-emerald-50 rounded-2xl border border-emerald-100 text-left flex items-start space-x-3">
              {plan.imageUrl ? (
                <img
                  src={plan.imageUrl}
                  alt={plan.title}
                  referrerPolicy="no-referrer"
                  className="w-14 h-14 rounded-xl object-cover shrink-0 border border-emerald-200/60 bg-zinc-900 shadow-xs"
                />
              ) : null}
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-emerald-900 truncate">{plan.title}</div>
                <div className="flex justify-between text-xs text-gray-600 mt-1">
                  <span>Deposit:</span>
                  <span className="font-bold text-gray-900 tabular-nums font-mono">{formatINR(plan.depositAmount, { decimals: 0 })}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-600 mt-0.5">
                  <span>Return Time:</span>
                  <span className="font-bold text-amber-600">
                    {plan.durationMinutes
                      ? plan.durationMinutes === 60
                        ? '1 Hour'
                        : plan.durationMinutes === 1
                        ? '1 Minute'
                        : `${plan.durationMinutes} Minutes`
                      : `${plan.returnDays} Days`}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-gray-600 mt-0.5">
                  <span>{plan.durationMinutes ? 'Return:' : 'Daily Return:'}</span>
                  <span className="font-bold text-emerald-600 tabular-nums font-mono">
                    {formatINR(plan.dailyIncome, { decimals: 0 })}{plan.durationMinutes ? '' : '/day'}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-gray-600 mt-0.5">
                  <span>Total Return:</span>
                  <span className="font-bold text-emerald-700 tabular-nums font-mono">{formatINR(plan.totalReturn, { decimals: 0 })}</span>
                </div>
              </div>
            </div>

            {/* Error message */}
            {errorMessage && (
              <div className="mb-3 p-2 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 text-left">
                {errorMessage}
              </div>
            )}

            {/* Limit reached warning */}
            {isLimitReached ? (
              <div className="mb-3 p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-left">
                <div className="flex items-center space-x-1.5 text-amber-900 font-bold text-[11px]">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>Limit Reached</span>
                </div>
                <div className="text-[10px] text-amber-700 mt-0.5">
                  You already have {activeCount} active subscriptions for this plan (max {plan.limit}). Wait for the current plan to complete.
                </div>
              </div>
            ) : isLowBalance ? (
              /* Low balance banner */
              <div className="mb-3 p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-left">
                <div className="flex items-center space-x-1.5 text-amber-900 font-bold text-[11px]">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>Balance Kam Hai!</span>
                </div>
                <div className="flex justify-between items-center text-[10px] text-gray-600 mt-1">
                  <span>Available Balance:</span>
                  <span className="font-bold text-red-600 tabular-nums">{formatINR(userBalance)}</span>
                </div>
                <div className="text-[10px] text-amber-700 mt-0.5">
                  Is plan ko activate karne ke liye {formatINR(plan.depositAmount, { decimals: 0 })} deposit karein.
                </div>
              </div>
            ) : (
              <div className="mb-3 flex justify-between items-center px-1 text-xs text-gray-500">
                <span>Available Balance:</span>
                <span className="font-bold text-emerald-700 tabular-nums">{formatINR(userBalance)}</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2.5 mt-2">
              <button
                id="buy-cancel-btn"
                onClick={onClose}
                disabled={isSubmitting}
                className="py-2.5 px-3 rounded-xl border border-gray-300 text-gray-700 font-semibold text-xs hover:bg-gray-50 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>

              {isLowBalance ? (
                <button
                  id="buy-deposit-redirect-btn"
                  onClick={() => onGoToRecharge(plan.depositAmount)}
                  className="py-2.5 px-3 rounded-xl btn-chamkila text-white font-black text-xs shadow-md flex items-center justify-center space-x-1 active:scale-95 transition-all cursor-pointer hover:brightness-110 tracking-wide"
                >
                  <Wallet className="w-3.5 h-3.5 drop-shadow-xs" />
                  <span className="drop-shadow-xs">Deposit ₹{plan.depositAmount}</span>
                </button>
              ) : isLimitReached ? (
                <button
                  disabled
                  className="py-2.5 px-3 rounded-xl bg-gray-200 text-gray-400 font-bold text-xs cursor-not-allowed"
                >
                  Limit Reached
                </button>
              ) : (
                <button
                  id="buy-confirm-btn"
                  onClick={handlePurchase}
                  disabled={isSubmitting}
                  className="py-2.5 px-3 rounded-xl btn-chamkila text-white font-black text-xs shadow-md active:scale-95 transition-all cursor-pointer hover:brightness-110 tracking-wide flex items-center justify-center space-x-1 disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Activating...</span>
                    </>
                  ) : (
                    <span className="drop-shadow-xs">Confirm & Invest</span>
                  )}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>,
    document.body
  );
};
