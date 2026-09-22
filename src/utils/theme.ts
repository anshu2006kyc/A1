export interface ThemeDefinition {
  id: string;
  name: string;
  hindiName: string;
  category: string;
  previewColor: string;
  previewGradient: string;
  secondaryColor: string;
  colors: {
    '50': string;
    '100': string;
    '200': string;
    '300': string;
    '400': string;
    '500': string;
    '600': string;
    '700': string;
    '800': string;
    '900': string;
    '950': string;
  };
  brandPrimary: string;
  brandSecondary: string;
  brandGlow: string;
  chamkilaGradient: string;
}

export const AVAILABLE_THEMES: ThemeDefinition[] = [
  {
    id: 'emerald',
    name: 'Emerald Classic',
    hindiName: 'रॉयल एमराल्ड (हरा)',
    category: 'Institutional Standard',
    previewColor: '#059669',
    previewGradient: 'from-emerald-500 to-emerald-700',
    secondaryColor: '#008a44',
    colors: {
      '50': '#ecfdf5',
      '100': '#d1fae5',
      '200': '#a7f3d0',
      '300': '#6ee7b7',
      '400': '#34d399',
      '500': '#10b981',
      '600': '#059669',
      '700': '#047857',
      '800': '#065f46',
      '900': '#064e3b',
      '950': '#022c22'
    },
    brandPrimary: '#00ba58',
    brandSecondary: '#008a44',
    brandGlow: 'rgba(0, 186, 88, 0.45)',
    chamkilaGradient: 'linear-gradient(180deg, #05c264 0%, #009c4f 50%, #007a3d 100%)'
  },
  {
    id: 'sapphire',
    name: 'Sapphire Blue',
    hindiName: 'सफायर ब्लू (नीला)',
    category: 'Executive Banking',
    previewColor: '#2563eb',
    previewGradient: 'from-blue-500 to-indigo-700',
    secondaryColor: '#1d4ed8',
    colors: {
      '50': '#eff6ff',
      '100': '#dbeafe',
      '200': '#bfdbfe',
      '300': '#93c5fd',
      '400': '#60a5fa',
      '500': '#3b82f6',
      '600': '#2563eb',
      '700': '#1d4ed8',
      '800': '#1e40af',
      '900': '#1e3a8a',
      '950': '#172554'
    },
    brandPrimary: '#2563eb',
    brandSecondary: '#1d4ed8',
    brandGlow: 'rgba(37, 99, 235, 0.45)',
    chamkilaGradient: 'linear-gradient(180deg, #3b82f6 0%, #2563eb 50%, #1d4ed8 100%)'
  },
  {
    id: 'ruby',
    name: 'Ruby Crimson',
    hindiName: 'रूबी क्रिमसन (लाल)',
    category: 'High-Velocity Dynamic',
    previewColor: '#e11d48',
    previewGradient: 'from-rose-500 to-red-700',
    secondaryColor: '#be123c',
    colors: {
      '50': '#fff1f2',
      '100': '#ffe4e6',
      '200': '#fecdd3',
      '300': '#fda4af',
      '400': '#fb7185',
      '500': '#f43f5e',
      '600': '#e11d48',
      '700': '#be123c',
      '800': '#9f1239',
      '900': '#881337',
      '950': '#4c0519'
    },
    brandPrimary: '#e11d48',
    brandSecondary: '#be123c',
    brandGlow: 'rgba(225, 29, 72, 0.45)',
    chamkilaGradient: 'linear-gradient(180deg, #f43f5e 0%, #e11d48 50%, #be123c 100%)'
  },
  {
    id: 'amethyst',
    name: 'Amethyst Purple',
    hindiName: 'एमथिस्ट पर्पल (बैंगनी)',
    category: 'Web3 & Sovereign Vault',
    previewColor: '#9333ea',
    previewGradient: 'from-purple-500 to-indigo-800',
    secondaryColor: '#7e22ce',
    colors: {
      '50': '#faf5ff',
      '100': '#f3e8ff',
      '200': '#e9d5ff',
      '300': '#d8b4fe',
      '400': '#c084fc',
      '500': '#a855f7',
      '600': '#9333ea',
      '700': '#7e22ce',
      '800': '#6b21a8',
      '900': '#581c87',
      '950': '#3b0764'
    },
    brandPrimary: '#9333ea',
    brandSecondary: '#7e22ce',
    brandGlow: 'rgba(147, 51, 234, 0.45)',
    chamkilaGradient: 'linear-gradient(180deg, #a855f7 0%, #9333ea 50%, #7e22ce 100%)'
  },
  {
    id: 'amber',
    name: 'Amber Gold',
    hindiName: 'एम्बर गोल्ड (सुनहरा)',
    category: 'Bullion & Luxury Gold',
    previewColor: '#d97706',
    previewGradient: 'from-amber-400 to-yellow-600',
    secondaryColor: '#b45309',
    colors: {
      '50': '#fffbeb',
      '100': '#fef3c7',
      '200': '#fde68a',
      '300': '#fcd34d',
      '400': '#fbbf24',
      '500': '#f59e0b',
      '600': '#d97706',
      '700': '#b45309',
      '800': '#92400e',
      '900': '#78350f',
      '950': '#451a03'
    },
    brandPrimary: '#d97706',
    brandSecondary: '#b45309',
    brandGlow: 'rgba(217, 119, 6, 0.45)',
    chamkilaGradient: 'linear-gradient(180deg, #fbbf24 0%, #d97706 50%, #b45309 100%)'
  },
  {
    id: 'cyan',
    name: 'Cyber Cyan',
    hindiName: 'साइबर स्यान (नीला-हरा)',
    category: 'High-Tech Neo Terminal',
    previewColor: '#0891b2',
    previewGradient: 'from-cyan-400 to-teal-600',
    secondaryColor: '#0e7490',
    colors: {
      '50': '#ecfeff',
      '100': '#cffafe',
      '200': '#a5f3fc',
      '300': '#67e8f9',
      '400': '#22d3ee',
      '500': '#06b6d4',
      '600': '#0891b2',
      '700': '#0e7490',
      '800': '#155e75',
      '900': '#164e63',
      '950': '#083344'
    },
    brandPrimary: '#0891b2',
    brandSecondary: '#0e7490',
    brandGlow: 'rgba(8, 145, 178, 0.45)',
    chamkilaGradient: 'linear-gradient(180deg, #22d3ee 0%, #0891b2 50%, #0e7490 100%)'
  },
  {
    id: 'sunset',
    name: 'Sunset Coral',
    hindiName: 'सनसेट कोरल (नारंगी)',
    category: 'Dynamic Energy',
    previewColor: '#ea580c',
    previewGradient: 'from-orange-500 to-amber-600',
    secondaryColor: '#c2410c',
    colors: {
      '50': '#fff7ed',
      '100': '#ffedd5',
      '200': '#fed7aa',
      '300': '#fdba74',
      '400': '#fb923c',
      '500': '#f97316',
      '600': '#ea580c',
      '700': '#c2410c',
      '800': '#9a3412',
      '900': '#7c2d12',
      '950': '#431407'
    },
    brandPrimary: '#ea580c',
    brandSecondary: '#c2410c',
    brandGlow: 'rgba(234, 88, 12, 0.45)',
    chamkilaGradient: 'linear-gradient(180deg, #fb923c 0%, #ea580c 50%, #c2410c 100%)'
  },
  {
    id: 'titanium',
    name: 'Titanium Slate',
    hindiName: 'टाइटेनियम स्लेट (ग्रे-ब्लैक)',
    category: 'Minimalist Stealth',
    previewColor: '#334155',
    previewGradient: 'from-slate-600 to-slate-900',
    secondaryColor: '#1e293b',
    colors: {
      '50': '#f8fafc',
      '100': '#f1f5f9',
      '200': '#e2e8f0',
      '300': '#cbd5e1',
      '400': '#94a3b8',
      '500': '#64748b',
      '600': '#475569',
      '700': '#334155',
      '800': '#1e293b',
      '900': '#0f172a',
      '950': '#020617'
    },
    brandPrimary: '#475569',
    brandSecondary: '#334155',
    brandGlow: 'rgba(71, 85, 105, 0.45)',
    chamkilaGradient: 'linear-gradient(180deg, #64748b 0%, #475569 50%, #1e293b 100%)'
  }
];

export const getThemeById = (id?: string): ThemeDefinition => {
  return AVAILABLE_THEMES.find((t) => t.id === id) || AVAILABLE_THEMES[0];
};

/**
 * Applies the selected theme variables to the document root element.
 * Modifies CSS custom properties and sets data-theme attribute.
 */
export const applyTheme = (themeId?: string): ThemeDefinition => {
  const theme = getThemeById(themeId);
  const root = document.documentElement;

  // Set data-theme attribute
  root.setAttribute('data-theme', theme.id);

  // Directly set CSS variables on document.documentElement
  Object.entries(theme.colors).forEach(([shade, hex]) => {
    root.style.setProperty(`--color-emerald-${shade}`, hex);
  });

  root.style.setProperty('--brand-primary', theme.brandPrimary);
  root.style.setProperty('--brand-secondary', theme.brandSecondary);
  root.style.setProperty('--brand-glow', theme.brandGlow);
  root.style.setProperty('--brand-chamkila-gradient', theme.chamkilaGradient);

  // Store in localStorage for instant retrieval across browser reloads
  try {
    localStorage.setItem('akm_active_theme', theme.id);
  } catch {
    // Ignore storage errors in sandboxed iframes
  }

  return theme;
};

/**
 * Initializes theme on bootstrap before React tree finishes loading.
 */
export const initTheme = (): ThemeDefinition => {
  let savedThemeId = 'emerald';
  try {
    const localTheme = localStorage.getItem('akm_active_theme');
    if (localTheme) {
      savedThemeId = localTheme;
    } else {
      const adminSettingsStr = localStorage.getItem('akm_admin_settings');
      if (adminSettingsStr) {
        const parsed = JSON.parse(adminSettingsStr);
        if (parsed.activeThemeId) {
          savedThemeId = parsed.activeThemeId;
        }
      }
    }
  } catch {
    savedThemeId = 'emerald';
  }

  return applyTheme(savedThemeId);
};
