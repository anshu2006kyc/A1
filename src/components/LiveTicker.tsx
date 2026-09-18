import React, { useState, useEffect } from 'react';
import { ArrowUpRight, CheckCircle2, ShieldCheck, TrendingUp, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatINR } from '../utils/currency';

interface FeedItem {
  id: string;
  type: 'deposit' | 'dividend' | 'withdrawal' | 'custom';
  user: string;
  amount: number;
  timeAgo: string;
  tag: string;
  customText?: string;
}

export const LiveTicker: React.FC = () => {
  const { adminSettings } = useApp();
  const [currentIdx, setCurrentIdx] = useState<number>(0);

  const baseFeed: FeedItem[] = [
    { id: '1', type: 'deposit', user: '98***41', amount: 720, timeAgo: 'just now', tag: 'Instant Auto-Credit' },
    { id: '2', type: 'dividend', user: '87***90', amount: 200, timeAgo: '1m ago', tag: 'Daily Return' },
    { id: '3', type: 'withdrawal', user: '91***25', amount: 1540, timeAgo: '2m ago', tag: 'Bank Transfer' },
    { id: '4', type: 'deposit', user: '93***82', amount: 1800, timeAgo: '3m ago', tag: 'Instant Auto-Credit' },
    { id: '5', type: 'dividend', user: '70***14', amount: 504, timeAgo: '4m ago', tag: 'VIP Earning' },
    { id: '6', type: 'withdrawal', user: '99***63', amount: 3500, timeAgo: '5m ago', tag: 'Bank Transfer' },
  ];

  const customItems: FeedItem[] = (adminSettings.tickerCustomMessages || []).map((msg, i) => ({
    id: `custom-${i}`,
    type: 'custom',
    user: 'Broadcast',
    amount: 0,
    timeAgo: 'live',
    tag: 'Notice',
    customText: msg
  }));

  const feed = [...customItems, ...baseFeed];

  useEffect(() => {
    if (feed.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % feed.length);
    }, 3200);
    return () => clearInterval(timer);
  }, [feed.length]);

  const item = feed[currentIdx] || baseFeed[0];

  return (
    <div className="mx-4 mb-4 bg-emerald-950/80 backdrop-blur-md border border-emerald-500/30 rounded-2xl py-2 px-3 flex items-center justify-between text-xs text-white shadow-md shadow-emerald-950/20 overflow-hidden">
      <div className="flex items-center space-x-2 min-w-0">
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>

        <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400 bg-emerald-500/20 px-1.5 py-0.5 rounded border border-emerald-500/30 shrink-0">
          {item.type === 'custom' ? 'Alert' : 'Live'}
        </span>

        <div className="truncate text-[11px] text-gray-200">
          {item.type === 'custom' ? (
            <span className="font-semibold text-emerald-200">{item.customText}</span>
          ) : (
            <>
              <span className="font-bold text-white mr-1.5">{item.user}</span>
              {item.type === 'deposit' && (
                <span>
                  topup <strong className="text-emerald-300 font-extrabold tabular-nums font-mono">{formatINR(item.amount, { decimals: 0 })}</strong> via Instant UPI
                </span>
              )}
              {item.type === 'dividend' && (
                <span>
                  earned <strong className="text-amber-300 font-extrabold tabular-nums font-mono">{formatINR(item.amount, { decimals: 0 })}</strong> daily dividend
                </span>
              )}
              {item.type === 'withdrawal' && (
                <span>
                  withdrew <strong className="text-sky-300 font-extrabold tabular-nums font-mono">{formatINR(item.amount, { decimals: 0 })}</strong> to account
                </span>
              )}
            </>
          )}
        </div>
      </div>

      <span className="text-[10px] text-emerald-400/80 font-medium shrink-0 ml-2">
        {item.timeAgo}
      </span>
    </div>
  );
};
