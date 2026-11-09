import React from 'react';
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Cpu,
  Factory,
  Flame,
  Gem,
  Globe2,
  Heart,
  Layers,
  Package,
  ShieldCheck,
  Trophy,
  Users,
  Zap
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AboutFaqAccordion } from '../components/AboutFaqAccordion';

export const AboutView: React.FC = () => {
  const { goBack, setCurrentView } = useApp();

  return (
    <div className="min-h-screen bg-gray-50 pb-28 animate-fade-in font-sans">
      {/* Top App Bar */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-100 sticky top-0 z-20 shadow-2xs">
        <button
          id="about-back-btn"
          onClick={goBack}
          className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 hover:bg-gray-200 active:scale-95 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="text-center">
          <h1 className="text-sm font-bold text-gray-900">About AKM Enterprises</h1>
          <p className="text-[9.5px] text-gray-500 font-medium">Precision Blades & Cutting Metallurgy</p>
        </div>
        <button
          onClick={() => setCurrentView('home')}
          className="text-[10px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2 py-1 rounded-lg border border-emerald-200 transition-colors cursor-pointer"
        >
          Catalog
        </button>
      </div>

      <div className="p-3.5 space-y-3.5 max-w-lg mx-auto">
        {/* Top Hero Brand Card */}
        <div
          className="text-white p-4.5 rounded-3xl shadow-lg relative overflow-hidden text-center"
          style={{ background: 'var(--brand-hero-gradient, linear-gradient(135deg, #0c5c2e 0%, #008a44 50%, #128a47 100%))' }}
        >
          {/* Subtle Industrial Grid Pattern */}
          <div
            className="absolute inset-0 [background-size:12px_12px] opacity-10 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)'
            }}
          />

          <div className="relative z-10">
            <div className="flex justify-center mb-1.5">
              <div
                className="bg-white font-black text-xl px-3.5 py-0.5 rounded-xl shadow-md border-2 border-white flex items-center space-x-1.5"
                style={{ color: 'var(--brand-secondary)' }}
              >
                <span>AKM</span>
                <div
                  className="w-3 h-3 rounded-full border-2 flex items-center justify-center"
                  style={{ borderColor: 'var(--brand-secondary)' }}
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: 'var(--brand-secondary)' }}
                  />
                </div>
              </div>
            </div>

            <h2 className="text-[15px] font-extrabold tracking-wide text-white mt-1">
              AKM Enterprises
            </h2>
            <p className="text-[10px] text-emerald-200 font-bold tracking-wider uppercase mt-0.5">
              Precision Blades & Industrial Metallurgy
            </p>

            <div className="inline-flex items-center space-x-1 bg-black/25 backdrop-blur-sm px-2.5 py-0.5 rounded-full text-[10px] font-bold text-emerald-200 mt-2 border border-white/10">
              <ShieldCheck className="w-3 h-3 text-emerald-300 mr-0.5" />
              <span>HIGH-PRECISION MANUFACTURING & DAILY YIELDS</span>
            </div>

            {/* 4 Stats Grid */}
            <div className="grid grid-cols-4 gap-1.5 mt-4">
              <div className="bg-black/20 backdrop-blur-sm p-1.5 rounded-2xl border border-white/10">
                <div className="flex justify-center mb-0.5 text-emerald-300">
                  <Package className="w-3.5 h-3.5" />
                </div>
                <div className="text-[11px] font-black text-white">22+</div>
                <div className="text-[7.5px] font-bold text-emerald-200 uppercase tracking-tighter mt-0.5">
                  BLADE SERIES
                </div>
              </div>

              <div className="bg-black/20 backdrop-blur-sm p-1.5 rounded-2xl border border-white/10">
                <div className="flex justify-center mb-0.5 text-amber-300">
                  <Cpu className="w-3.5 h-3.5" />
                </div>
                <div className="text-[11px] font-black text-white">99.9%</div>
                <div className="text-[7.5px] font-bold text-emerald-200 uppercase tracking-tighter mt-0.5">
                  CNC ACCURACY
                </div>
              </div>

              <div className="bg-black/20 backdrop-blur-sm p-1.5 rounded-2xl border border-white/10">
                <div className="flex justify-center mb-0.5 text-emerald-300">
                  <Layers className="w-3.5 h-3.5" />
                </div>
                <div className="text-[11px] font-black text-white">3 TIERS</div>
                <div className="text-[7.5px] font-bold text-emerald-200 uppercase tracking-tighter mt-0.5">
                  CATEGORIES
                </div>
              </div>

              <div className="bg-black/20 backdrop-blur-sm p-1.5 rounded-2xl border border-white/10">
                <div className="flex justify-center mb-0.5 text-cyan-300">
                  <Zap className="w-3.5 h-3.5" />
                </div>
                <div className="text-[11px] font-black text-white">24/7</div>
                <div className="text-[7.5px] font-bold text-emerald-200 uppercase tracking-tighter mt-0.5">
                  LIVE YIELDS
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Our Story & Precision Manufacturing Mission */}
        <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-xs space-y-2">
          <div className="flex items-center space-x-1.5 text-[11px] font-bold text-emerald-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="uppercase tracking-wider">Our Manufacturing Story</span>
          </div>
          <p className="text-[11px] leading-relaxed text-gray-700 font-normal">
            <strong className="text-emerald-800 font-bold">AKM Enterprises</strong> is an advanced engineering manufacturer specializing in high-performance precision industrial blades, surgical cutting tools, and ultra-durable metallurgical alloys.
          </p>
          <p className="text-[11px] leading-relaxed text-gray-700 font-normal">
            By combining robotic CNC grinding, vacuum cryogenic tempering (-196°C), and PVD synthetic diamond nanocoating, we manufacture precision blades that power packaging, textile, medical, automotive, and high-tech manufacturing plants.
          </p>
          <p className="text-[11px] leading-relaxed text-gray-700 font-normal">
            Through our digital investment ecosystem, investor capital directly finances active blade production consignments and automated machinery expansion, sharing the resulting high-margin commercial profits as automated daily and turbo cash dividends.
          </p>
        </div>

        {/* 3 Core Product Categories Showcase */}
        <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5 text-[11px] font-bold text-emerald-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="uppercase tracking-wider">Our Product Series</span>
            </div>
            <span className="text-[9.5px] font-mono text-gray-500 font-bold">22 Active Plans</span>
          </div>

          {/* Product Line 1: Turbo Series */}
          <div className="p-3 bg-gradient-to-r from-amber-500/10 via-yellow-500/5 to-transparent rounded-2xl border border-amber-200/60 space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5">
                <span className="w-6 h-6 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xs shadow-xs">
                  ⚡
                </span>
                <div>
                  <h3 className="text-[11px] font-black text-gray-900">Turbo Flash Blade Series</h3>
                  <p className="text-[8.5px] text-amber-700 font-bold">1 Minute to 60 Minutes Rapid Turnover</p>
                </div>
              </div>
              <span className="text-[9px] font-mono font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded-full border border-amber-300">
                125% - 190%
              </span>
            </div>
            <p className="text-[10px] text-gray-600 leading-normal">
              Fast-turnaround precision blade production batches engineered for micro-cycle profits. Includes <strong>Ceramic (1 min)</strong>, <strong>Obsidian (3 min)</strong>, <strong>Comb (5 min)</strong>, <strong>Scraper (10 min)</strong>, <strong>Snap-Off (15 min)</strong>, <strong>Hook (30 min)</strong>, <strong>Straight (45 min)</strong>, and <strong>Shear (60 min)</strong>. Principal and returns credit immediately upon batch completion.
            </p>
          </div>

          {/* Product Line 2: Classic Daily Series */}
          <div className="p-3 bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent rounded-2xl border border-emerald-200/60 space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5">
                <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  🏆
                </span>
                <div>
                  <h3 className="text-[11px] font-black text-gray-900">Classic Industrial Blade Series</h3>
                  <p className="text-[8.5px] text-emerald-700 font-bold">30 to 50 Days High-Yield Compounding</p>
                </div>
              </div>
              <span className="text-[9px] font-mono font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded-full border border-emerald-300">
                Daily Income
              </span>
            </div>
            <p className="text-[10px] text-gray-600 leading-normal">
              Heavy-duty continuous production lines powering global supply contracts. Includes <strong>Swedish Sandvik Steel (30 days)</strong>, <strong>Matrix Bi-Metal (35 days)</strong>, <strong>Titanium Nitride (40 days)</strong>, <strong>Surgical Scalpel (45 days)</strong>, and <strong>Rotary Shears (50 days)</strong> with steady daily dividend distribution every 24 hours.
            </p>
          </div>

          {/* Product Line 3: VIP Metallurgy Series */}
          <div className="p-3 bg-gradient-to-r from-purple-500/10 via-pink-500/5 to-transparent rounded-2xl border border-purple-200/60 space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5">
                <span className="w-6 h-6 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  👑
                </span>
                <div>
                  <h3 className="text-[11px] font-black text-gray-900">Elite VIP Metallurgy Series</h3>
                  <p className="text-[8.5px] text-purple-700 font-bold">Ultra-Hard Exotic Alloys & Diamond Coatings</p>
                </div>
              </div>
              <span className="text-[9px] font-mono font-bold text-purple-800 bg-purple-100 px-1.5 py-0.5 rounded-full border border-purple-300">
                Up to 560%
              </span>
            </div>
            <p className="text-[10px] text-gray-600 leading-normal">
              Exclusive high-metallurgy cutting tools featuring <strong>Damascus Hand-Forged</strong>, <strong>Chrome Slitter</strong>, <strong>Cryo-Tempered Steel</strong>, <strong>Tungsten Carbide</strong>, <strong>M42 Cobalt</strong>, <strong>Laser Cladded</strong>, <strong>Rose Gold PVD</strong>, and <strong>Synthetic Diamond (PCD)</strong> edges. Designed for maximum capital acceleration and dedicated VIP clearance.
            </p>
          </div>
        </div>

        {/* Why AKM Precision Leads */}
        <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-xs space-y-2.5">
          <div className="flex items-center space-x-1.5 text-[11px] font-bold text-emerald-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="uppercase tracking-wider">Why AKM Leads in Cutting Technology</span>
          </div>

          <div className="space-y-2 text-[10.5px] text-gray-700">
            <div className="flex items-start space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-gray-900 font-bold">Sub-Micron Precision Grinding:</strong> Multi-axis CNC robotic grinders hone blade edges with laser optical calibration, delivering razor sharpness and maximum industrial endurance.
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-gray-900 font-bold">Cryogenic & PVD Nanocoating:</strong> Vacuum chambers subject blades to sub-zero cryo tempering (-196°C) and titanium/synthetic diamond PVD coatings to multiply tool longevity by 12x.
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-gray-900 font-bold">Guaranteed Commercial Purchase Orders:</strong> Every blade batch produced has active enterprise supply contracts, ensuring reliable cash flow and risk-free dividend distribution.
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-gray-900 font-bold">Automated 24/7 Yield Distribution:</strong> Production earnings are calculated by automated clearing nodes and deposited directly into user balances every 24 hours with instant IMPS withdrawal access.
              </div>
            </div>
          </div>
        </div>

        {/* Core Values */}
        <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-xs space-y-2.5">
          <div className="flex items-center space-x-1.5 text-[11px] font-bold text-emerald-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="uppercase tracking-wider">Our Core Engineering Values</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="p-2.5 bg-gray-50 rounded-2xl border border-gray-100">
              <ShieldCheck className="w-4 h-4 text-emerald-600 mb-1" />
              <div className="text-[11px] font-bold text-gray-900">Capital Custody</div>
              <div className="text-[9px] text-gray-500">100% Escrow & SSL Security</div>
            </div>

            <div className="p-2.5 bg-gray-50 rounded-2xl border border-gray-100">
              <Gem className="w-4 h-4 text-emerald-600 mb-1" />
              <div className="text-[11px] font-bold text-gray-900">Edge Precision</div>
              <div className="text-[9px] text-gray-500">Zero-Defect Quality Standard</div>
            </div>

            <div className="p-2.5 bg-gray-50 rounded-2xl border border-gray-100">
              <Zap className="w-4 h-4 text-emerald-600 mb-1" />
              <div className="text-[11px] font-bold text-gray-900">Fast Liquidity</div>
              <div className="text-[9px] text-gray-500">Instant IMPS Payout Clearance</div>
            </div>

            <div className="p-2.5 bg-gray-50 rounded-2xl border border-gray-100">
              <Trophy className="w-4 h-4 text-emerald-600 mb-1" />
              <div className="text-[11px] font-bold text-gray-900">Investor Trust</div>
              <div className="text-[9px] text-gray-500">Growing Together Since Day 1</div>
            </div>
          </div>
        </div>

        {/* Collapsible FAQ Section */}
        <AboutFaqAccordion />

        {/* Mission Statement */}
        <div
          className="text-white p-4 rounded-3xl shadow-md"
          style={{ background: 'var(--brand-card-gradient, #00a859)' }}
        >
          <div className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-100 mb-0.5">
            Our Mission
          </div>
          <p className="text-[11px] leading-relaxed font-medium">
            To bridge world-class precision blade manufacturing and metallurgical engineering with accessible digital capital returns — empowering every investor with transparent daily dividends, ultra-fast Turbo cycles, and long-term financial prosperity.
          </p>
        </div>
      </div>
    </div>
  );
};
