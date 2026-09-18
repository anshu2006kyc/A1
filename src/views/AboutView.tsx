import React from 'react';
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Factory,
  Globe2,
  Heart,
  Layers,
  ShieldCheck,
  Trophy,
  Users,
  Zap
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AboutView: React.FC = () => {
  const { goBack } = useApp();

  return (
    <div className="min-h-screen bg-gray-50 pb-28 animate-fade-in">
      {/* Top App Bar */}
      <div className="bg-white px-4 py-3.5 flex items-center justify-between border-b border-gray-100 sticky top-0 z-20">
        <button
          id="about-back-btn"
          onClick={goBack}
          className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 hover:bg-gray-200 active:scale-95 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-base font-bold text-gray-900">About AKM</h1>
        <div className="w-9"></div>
      </div>

      <div className="p-4 space-y-4">
        {/* Top Hero Brand Card */}
        <div className="bg-gradient-to-br from-[#0c5c2e] via-[#008a44] to-[#128a47] text-white p-5 rounded-3xl shadow-lg relative overflow-hidden text-center">
          <div className="flex justify-center mb-2">
            <div className="bg-white text-[#008a44] font-black text-2xl px-4 py-1 rounded-xl shadow-md border-2 border-white flex items-center space-x-2">
              <span>AKM</span>
              <div className="w-3.5 h-3.5 rounded-full border-2 border-[#008a44] flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-[#008a44] rounded-full"></div>
              </div>
            </div>
          </div>

          <h2 className="text-base font-extrabold tracking-wide text-white mt-1">
            AKM Enterprises
          </h2>
          <p className="text-xs text-emerald-200 font-semibold tracking-wider uppercase">
            Growing Together
          </p>

          <div className="inline-flex items-center space-x-1 bg-black/20 backdrop-blur-sm px-3 py-1 rounded-full text-[11px] font-bold text-emerald-200 mt-2 border border-white/10">
            <Calendar className="w-3.5 h-3.5 mr-1" />
            <span>SINCE 1987</span>
          </div>

          {/* 4 Stats Grid */}
          <div className="grid grid-cols-4 gap-2 mt-5">
            <div className="bg-black/20 backdrop-blur-sm p-2 rounded-2xl border border-white/10">
              <div className="flex justify-center mb-1 text-emerald-300">
                <Calendar className="w-3.5 h-3.5" />
              </div>
              <div className="text-xs font-black text-white">1987</div>
              <div className="text-[8px] font-bold text-emerald-200 uppercase tracking-tighter mt-0.5">
                FOUNDED
              </div>
            </div>

            <div className="bg-black/20 backdrop-blur-sm p-2 rounded-2xl border border-white/10">
              <div className="flex justify-center mb-1 text-emerald-300">
                <Globe2 className="w-3.5 h-3.5" />
              </div>
              <div className="text-xs font-black text-white">160+</div>
              <div className="text-[8px] font-bold text-emerald-200 uppercase tracking-tighter mt-0.5">
                COUNTRIES
              </div>
            </div>

            <div className="bg-black/20 backdrop-blur-sm p-2 rounded-2xl border border-white/10">
              <div className="flex justify-center mb-1 text-emerald-300">
                <Factory className="w-3.5 h-3.5" />
              </div>
              <div className="text-xs font-black text-white">5</div>
              <div className="text-[8px] font-bold text-emerald-200 uppercase tracking-tighter mt-0.5">
                PLANTS
              </div>
            </div>

            <div className="bg-black/20 backdrop-blur-sm p-2 rounded-2xl border border-white/10">
              <div className="flex justify-center mb-1 text-emerald-300">
                <Layers className="w-3.5 h-3.5" />
              </div>
              <div className="text-xs font-black text-white">3200+</div>
              <div className="text-[8px] font-bold text-emerald-200 uppercase tracking-tighter mt-0.5">
                SKUS
              </div>
            </div>
          </div>
        </div>

        {/* Our Story */}
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-2">
          <div className="flex items-center space-x-2 text-xs font-bold text-emerald-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="uppercase tracking-wider">Our Story</span>
          </div>
          <p className="text-xs leading-relaxed text-gray-700 font-normal">
            AKM began its journey in{' '}
            <strong className="text-emerald-800">1987 from Mumbai, India</strong>. With a sharp focus
            on high-performance financial engineering and wealth growth systems, AKM grew into one of the most trusted digital asset investment platforms across the world.
          </p>
          <p className="text-xs leading-relaxed text-gray-700 font-normal">
            Today AKM serves investors across <strong className="text-emerald-800">160+ regions</strong>, powering
            smart digital portfolios, daily compounding yields, and high-frequency automated capital dividends.
          </p>
        </div>

        {/* Why AKM Leads */}
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-3">
          <div className="flex items-center space-x-2 text-xs font-bold text-emerald-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="uppercase tracking-wider">Why AKM Leads</span>
          </div>

          <div className="space-y-2.5 text-xs text-gray-700">
            <div className="flex items-start space-x-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-gray-900">Wealth Technology Specialist:</span> Leading institutional platform in digital wealth assets, daily dividends, and automated compounding.
              </div>
            </div>

            <div className="flex items-start space-x-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-gray-900">World-Class Infrastructure:</span> Advanced high-speed financial clearance servers with dedicated liquidity reserves and 256-bit encryption.
              </div>
            </div>

            <div className="flex items-start space-x-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-gray-900">3200+ Products:</span> One of the widest product ranges in the industry — tailored for every scale and terrain.
              </div>
            </div>

            <div className="flex items-start space-x-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-gray-900">Trusted Global Partner:</span> Known worldwide through partnerships, sports sponsorships, and established investor safety records.
              </div>
            </div>
          </div>
        </div>

        {/* Core Values */}
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-3">
          <div className="flex items-center space-x-2 text-xs font-bold text-emerald-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="uppercase tracking-wider">Our Core Values</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100">
              <ShieldCheck className="w-5 h-5 text-emerald-600 mb-1" />
              <div className="text-xs font-bold text-gray-900">Integrity</div>
              <div className="text-[10px] text-gray-500">We do the right thing</div>
            </div>

            <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100">
              <Users className="w-5 h-5 text-emerald-600 mb-1" />
              <div className="text-xs font-bold text-gray-900">Respect</div>
              <div className="text-[10px] text-gray-500">We value people</div>
            </div>

            <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100">
              <Heart className="w-5 h-5 text-emerald-600 mb-1" />
              <div className="text-xs font-bold text-gray-900">Responsibility</div>
              <div className="text-[10px] text-gray-500">We care for our planet</div>
            </div>

            <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100">
              <Zap className="w-5 h-5 text-emerald-600 mb-1" />
              <div className="text-xs font-bold text-gray-900">Performance</div>
              <div className="text-[10px] text-gray-500">We aim for excellence</div>
            </div>
          </div>
        </div>

        {/* Mission Statement */}
        <div className="bg-[#00a859] text-white p-5 rounded-3xl shadow-md">
          <div className="text-xs font-extrabold uppercase tracking-widest text-emerald-100 mb-1">
            Our Mission
          </div>
          <p className="text-xs leading-relaxed font-medium">
            To deliver world-class Off-Highway tyres that keep farms growing, sites building and
            industries moving — Growing Together with our partners everywhere.
          </p>
        </div>
      </div>
    </div>
  );
};
