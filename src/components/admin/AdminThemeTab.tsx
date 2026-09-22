import React, { useState } from 'react';
import {
  Palette,
  Check,
  Sparkles,
  RefreshCw,
  Eye,
  Sliders,
  CheckCircle2,
  Zap,
  ArrowRight,
  ShieldCheck,
  Smartphone,
  Layers,
  LayoutGrid
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AVAILABLE_THEMES, getThemeById, ThemeDefinition } from '../../utils/theme';
import { sfx } from '../../utils/sound';

export const AdminThemeTab: React.FC = () => {
  const { adminSettings, updateAdminSettings, showToast } = useApp();
  const activeThemeId = adminSettings.activeThemeId || 'emerald';
  const currentTheme = getThemeById(activeThemeId);
  const [previewThemeId, setPreviewThemeId] = useState<string>(activeThemeId);

  const handleSelectTheme = (theme: ThemeDefinition) => {
    sfx.playSuccess();
    setPreviewThemeId(theme.id);
    updateAdminSettings({ activeThemeId: theme.id });
    showToast(`Theme switched to "${theme.name}" across entire website!`, 'success');
  };

  const activeThemeObj = getThemeById(activeThemeId);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-7 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shadow-lg">
                <Palette className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                  <span>Theme & Branding Studio</span>
                  <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Live 1-Click
                  </span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-400">
                  Ek click me pure website ke primary aur accent colours badlein. Changes turant sabhi users ko dikhte hain.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="bg-slate-950/70 border border-slate-800 rounded-2xl px-4 py-2.5 flex items-center space-x-3">
              <span className="w-3.5 h-3.5 rounded-full shadow-md" style={{ backgroundColor: activeThemeObj.previewColor }} />
              <div className="text-left">
                <div className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Active Color</div>
                <div className="text-xs font-bold text-white flex items-center space-x-1.5">
                  <span>{activeThemeObj.name}</span>
                  <span className="text-[10px] text-emerald-400 font-medium">({activeThemeObj.hindiName})</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                const defaultTheme = AVAILABLE_THEMES[0];
                handleSelectTheme(defaultTheme);
              }}
              className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-2xl text-xs font-bold border border-slate-700 transition-all flex items-center space-x-1.5 cursor-pointer active:scale-95"
              title="Reset to default green theme"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Default</span>
            </button>
          </div>
        </div>
      </div>

      {/* Multiple Color Options Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <LayoutGrid className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
              Available Color Palettes ({AVAILABLE_THEMES.length} Options)
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            Click on any color to instantly update the entire website
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {AVAILABLE_THEMES.map((theme) => {
            const isActive = theme.id === activeThemeId;
            return (
              <div
                key={theme.id}
                onClick={() => handleSelectTheme(theme)}
                className={`group relative rounded-2xl p-4 transition-all cursor-pointer border text-left overflow-hidden ${
                  isActive
                    ? 'bg-slate-900 border-2 shadow-xl ring-2'
                    : 'bg-slate-900/70 hover:bg-slate-800/90 border-slate-800 hover:border-slate-700'
                }`}
                style={{
                  borderColor: isActive ? theme.previewColor : undefined,
                  boxShadow: isActive ? `0 10px 25px -5px ${theme.brandGlow}` : undefined
                }}
              >
                {/* Active Indicator Ribbon */}
                {isActive && (
                  <div
                    className="absolute top-0 right-0 px-2.5 py-0.5 text-[9px] font-black text-white uppercase tracking-wider rounded-bl-xl shadow-xs flex items-center space-x-1"
                    style={{ backgroundColor: theme.previewColor }}
                  >
                    <Check className="w-3 h-3 stroke-[3]" />
                    <span>Active Theme</span>
                  </div>
                )}

                {/* Color Header Preview */}
                <div className="flex items-center space-x-3 mb-3">
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-md relative group-hover:scale-105 transition-transform"
                    style={{
                      background: theme.chamkilaGradient,
                      boxShadow: `0 4px 14px ${theme.brandGlow}`
                    }}
                  >
                    <Palette className="w-5 h-5 text-white drop-shadow" />
                  </div>

                  <div>
                    <h4 className="text-sm font-extrabold text-white group-hover:text-slate-100 flex items-center gap-1.5">
                      {theme.name}
                    </h4>
                    <p className="text-[11px] font-semibold" style={{ color: theme.previewColor }}>
                      {theme.hindiName}
                    </p>
                  </div>
                </div>

                {/* Gradient Strip */}
                <div className="space-y-1 mb-3">
                  <div className="h-2 rounded-full w-full overflow-hidden flex shadow-inner">
                    <span className="h-full flex-1" style={{ backgroundColor: theme.colors['300'] }} />
                    <span className="h-full flex-1" style={{ backgroundColor: theme.colors['400'] }} />
                    <span className="h-full flex-1" style={{ backgroundColor: theme.colors['500'] }} />
                    <span className="h-full flex-1" style={{ backgroundColor: theme.colors['600'] }} />
                    <span className="h-full flex-1" style={{ backgroundColor: theme.colors['700'] }} />
                    <span className="h-full flex-1" style={{ backgroundColor: theme.colors['900'] }} />
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
                    <span>{theme.category}</span>
                    <span>{theme.previewColor}</span>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectTheme(theme);
                  }}
                  className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                    isActive
                      ? 'text-white shadow-md'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300 group-hover:text-white'
                  }`}
                  style={{
                    backgroundColor: isActive ? theme.previewColor : undefined
                  }}
                >
                  {isActive ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Current Active Theme</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-3.5 h-3.5" />
                      <span>1-Click Apply Theme</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Preview Sandbox */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <Eye className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
              Live Real-Time Component Preview
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Active: <strong className="text-white">{activeThemeObj.name}</strong>
          </span>
        </div>

        <p className="text-xs text-slate-400">
          Neeche diye gaye components dikhate hain ki website ke buttons, cards, balance indicators, aur navigation active color me kaise render ho rahe hain:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Preview 1: Chamkila Action Button */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between space-y-3">
            <span className="text-[11px] font-mono text-slate-400 uppercase">Primary Chamkila Button</span>
            <button className="w-full py-3 rounded-xl font-black text-xs text-white btn-chamkila cursor-pointer flex items-center justify-center space-x-2">
              <Sparkles className="w-4 h-4" />
              <span>Invest ₹1,000 Now</span>
            </button>
            <span className="text-[10px] text-slate-500 text-center">Used in Recharge, Plans & Claims</span>
          </div>

          {/* Preview 2: Balance & Badges */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between space-y-3">
            <span className="text-[11px] font-mono text-slate-400 uppercase">Balance & Verification Pill</span>
            <div className="flex items-center justify-between bg-slate-900 p-2.5 rounded-xl border border-slate-800">
              <div>
                <div className="text-[10px] text-slate-400 font-mono">Total Assets</div>
                <div className="text-lg font-black" style={{ color: activeThemeObj.previewColor }}>
                  ₹24,580.00
                </div>
              </div>
              <div
                className="px-2.5 py-1 rounded-full text-[10px] font-extrabold flex items-center space-x-1"
                style={{
                  backgroundColor: `${activeThemeObj.previewColor}20`,
                  color: activeThemeObj.previewColor,
                  border: `1px solid ${activeThemeObj.previewColor}40`
                }}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified</span>
              </div>
            </div>
            <span className="text-[10px] text-slate-500 text-center">Header & Asset Badges</span>
          </div>

          {/* Preview 3: Mobile Nav Floating Center */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between space-y-3">
            <span className="text-[11px] font-mono text-slate-400 uppercase">Bottom Navigation Center</span>
            <div className="flex items-center justify-center py-1">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-white border-2 border-white shadow-lg relative overflow-hidden"
                style={{
                  background: activeThemeObj.chamkilaGradient,
                  boxShadow: `0 6px 18px ${activeThemeObj.brandGlow}`
                }}
              >
                <Smartphone className="w-5 h-5 text-white" />
              </div>
            </div>
            <span className="text-[10px] text-slate-500 text-center">Center Floating Check-In Action</span>
          </div>
        </div>
      </div>

      {/* Cloud Synchronization Info Note */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex items-start space-x-3 text-xs text-slate-400">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-200">Real-Time Cloud Synchronization:</strong> Jab aap yahan se koi bhi color select karte hain, woh setting automatic aapke Firestore database (<code className="text-emerald-400 font-mono">adminSettings/global</code>) aur local storage me save ho jati hai. Website kholne wale har naye aur purane user ko yeh color scheme instant dikhegi.
        </div>
      </div>
    </div>
  );
};
