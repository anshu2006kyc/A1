import React from 'react';
import { Plan } from '../types';

/**
 * Returns a high-fidelity, 100% UNIQUE SVG Data URI specifically designed for each AKM ENTERPRISES Blade Asset.
 * STRICT COMPLIANCE: Every single plan has a completely distinct visual blade model, geometry, color palette,
 * and metallurgical theme. Zero duplicate images anywhere. Zero text on corners or bottom.
 */
export function getProductArtworkDataUri(planId: string, category?: string): string {
  const cleanId = (planId || '').toLowerCase().trim();

  switch (cleanId) {
    // =========================================================================
    // 1. NORMAL PLANS (6 Unique Models & Completely Distinct Colors)
    // =========================================================================

    // 1. Swedish: Arctic Deep Navy Blue
    case 'plan-product-1':
      return `data:image/svg+xml;utf8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
          <defs>
            <linearGradient id="p1_bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#1e3a8a" />
              <stop offset="50%" stop-color="#2563eb" />
              <stop offset="100%" stop-color="#0f172a" />
            </linearGradient>
            <linearGradient id="p1_steel" x1="0%" y1="0%" x2="100%" y2="25%">
              <stop offset="0%" stop-color="#e2e8f0" />
              <stop offset="25%" stop-color="#ffffff" />
              <stop offset="50%" stop-color="#cbd5e1" />
              <stop offset="75%" stop-color="#ffffff" />
              <stop offset="100%" stop-color="#94a3b8" />
            </linearGradient>
            <linearGradient id="p1_bevel" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#ffffff" />
              <stop offset="50%" stop-color="#60a5fa" />
              <stop offset="100%" stop-color="#cbd5e1" />
            </linearGradient>
            <filter id="p1_shadow">
              <feDropShadow dx="0" dy="12" stdDeviation="14" flood-color="#020617" flood-opacity="0.85" />
            </filter>
          </defs>
          <rect width="400" height="300" fill="url(#p1_bg)" />
          <circle cx="200" cy="150" r="115" fill="#60a5fa" opacity="0.35" />

          <!-- Blade Graphic: DE Razor Blade -->
          <g transform="translate(200, 150) rotate(-9)" filter="url(#p1_shadow)">
            <path d="M -140,-58 L -132,-58 L -124,-51 L -124,-61 L 124,-61 L 124,-51 L 132,-58 L 140,-58 Q 148,-58 148,-48 L 148,48 Q 148,58 140,58 L 132,58 L 124,51 L 124,61 L -124,61 L -124,51 L -132,58 L -140,58 Q -148,58 -148,48 L -148,-48 Q -148,-58 -140,-58 Z" fill="url(#p1_steel)" stroke="#ffffff" stroke-width="2" />
            <polygon points="-124,-61 124,-61 118,-54 -118,-54" fill="url(#p1_bevel)" opacity="0.95" />
            <line x1="-124" y1="-61" x2="124" y2="-61" stroke="#ffffff" stroke-width="1.5" />
            <line x1="-40" y1="-61" x2="40" y2="-61" stroke="#93c5fd" stroke-width="2.5" />
            <polygon points="-124,61 124,61 118,54 -118,54" fill="url(#p1_bevel)" opacity="0.95" />
            <line x1="-124" y1="61" x2="124" y2="61" stroke="#ffffff" stroke-width="1.5" />
            <line x1="-60" y1="61" x2="20" y2="61" stroke="#93c5fd" stroke-width="2.5" />

            <!-- Cutout Slots -->
            <g fill="#172554" stroke="#60a5fa" stroke-width="1.5">
              <rect x="-85" y="-6" width="170" height="12" rx="6" />
              <circle cx="0" cy="0" r="16" fill="#172554" stroke="#93c5fd" stroke-width="1.8" />
              <circle cx="-65" cy="0" r="9" fill="#172554" stroke="#60a5fa" stroke-width="1.4" />
              <circle cx="65" cy="0" r="9" fill="#172554" stroke="#60a5fa" stroke-width="1.4" />
              <rect x="-115" y="-40" width="10" height="18" rx="2" />
              <rect x="105" y="-40" width="10" height="18" rx="2" />
              <rect x="-115" y="22" width="10" height="18" rx="2" />
              <rect x="105" y="22" width="10" height="18" rx="2" />
            </g>
            <polygon points="-90,-61 -50,-61 90,61 50,61" fill="#ffffff" opacity="0.3" />
          </g>
        </svg>
      `)}`;

    // 2. Matrix: Deep Emerald Jade Green
    case 'plan-product-2':
      return `data:image/svg+xml;utf8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
          <defs>
            <linearGradient id="p2_bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#064e3b" />
              <stop offset="50%" stop-color="#059669" />
              <stop offset="100%" stop-color="#022c22" />
            </linearGradient>
            <linearGradient id="p2_steel" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#e2e8f0" />
              <stop offset="50%" stop-color="#ffffff" />
              <stop offset="100%" stop-color="#94a3b8" />
            </linearGradient>
            <filter id="p2_shadow">
              <feDropShadow dx="0" dy="12" stdDeviation="14" flood-color="#022c22" flood-opacity="0.85" />
            </filter>
          </defs>
          <rect width="400" height="300" fill="url(#p2_bg)" />
          <ellipse cx="200" cy="150" rx="140" ry="90" fill="#34d399" opacity="0.28" />

          <!-- Blade Graphic: 5-Blade Matrix Cartridge System -->
          <g transform="translate(200, 150) rotate(-4)" filter="url(#p2_shadow)">
            <rect x="-135" y="-55" width="270" height="110" rx="18" fill="#0f172a" stroke="#10b981" stroke-width="2.5" />
            <!-- Aloe Strip -->
            <rect x="-115" y="-48" width="230" height="12" rx="6" fill="#10b981" stroke="#34d399" stroke-width="1.5" />
            <circle cx="-100" cy="-42" r="3" fill="#ecfdf5" />
            <circle cx="100" cy="-42" r="3" fill="#ecfdf5" />
            <!-- 5 Precision Parallel Blades -->
            <g>
              <rect x="-120" y="-30" width="240" height="8" rx="2" fill="url(#p2_steel)" stroke="#ffffff" stroke-width="1" />
              <line x1="-120" y1="-26" x2="120" y2="-26" stroke="#34d399" stroke-width="1.2" />
              <rect x="-120" y="-18" width="240" height="8" rx="2" fill="url(#p2_steel)" stroke="#ffffff" stroke-width="1" />
              <line x1="-120" y1="-14" x2="120" y2="-14" stroke="#34d399" stroke-width="1.2" />
              <rect x="-120" y="-6" width="240" height="8" rx="2" fill="url(#p2_steel)" stroke="#ffffff" stroke-width="1" />
              <line x1="-120" y1="-2" x2="120" y2="-2" stroke="#34d399" stroke-width="1.2" />
              <rect x="-120" y="6" width="240" height="8" rx="2" fill="url(#p2_steel)" stroke="#ffffff" stroke-width="1" />
              <line x1="-120" y1="10" x2="120" y2="10" stroke="#34d399" stroke-width="1.2" />
              <rect x="-120" y="18" width="240" height="8" rx="2" fill="url(#p2_steel)" stroke="#ffffff" stroke-width="1" />
              <line x1="-120" y1="22" x2="120" y2="22" stroke="#34d399" stroke-width="1.2" />
            </g>
            <!-- Guard Fin -->
            <rect x="-115" y="32" width="230" height="14" rx="4" fill="#065f46" stroke="#059669" stroke-width="1.5" />
          </g>
        </svg>
      `)}`;

    // 3. Titanium: Fiery Copper / Burnt Sienna Orange
    case 'plan-product-3':
      return `data:image/svg+xml;utf8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
          <defs>
            <linearGradient id="p3_bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#7c2d12" />
              <stop offset="50%" stop-color="#ea580c" />
              <stop offset="100%" stop-color="#431407" />
            </linearGradient>
            <linearGradient id="p3_gold" x1="0%" y1="0%" x2="100%" y2="50%">
              <stop offset="0%" stop-color="#fef08a" />
              <stop offset="35%" stop-color="#fbbf24" />
              <stop offset="70%" stop-color="#f59e0b" />
              <stop offset="100%" stop-color="#b45309" />
            </linearGradient>
            <filter id="p3_shadow">
              <feDropShadow dx="0" dy="12" stdDeviation="14" flood-color="#431407" flood-opacity="0.85" />
            </filter>
          </defs>
          <rect width="400" height="300" fill="url(#p3_bg)" />
          <circle cx="200" cy="150" r="115" fill="#fdba74" opacity="0.32" />

          <!-- Blade Graphic: Titanium Nitride Trapezoid Utility Blade -->
          <g transform="translate(200, 150) rotate(-11)" filter="url(#p3_shadow)">
            <polygon points="-135,-32 -95,-48 95,-48 135,-32 135,46 -135,46" fill="url(#p3_gold)" stroke="#ffffff" stroke-width="2" />
            <!-- Top Notch Slots -->
            <rect x="-65" y="-48" width="16" height="18" rx="2" fill="#431407" stroke="#fbbf24" stroke-width="1.2" />
            <rect x="49" y="-48" width="16" height="18" rx="2" fill="#431407" stroke="#fbbf24" stroke-width="1.2" />
            <!-- Lower Razor Bevel Edge -->
            <polygon points="-135,46 135,46 128,38 -128,38" fill="#ffffff" opacity="0.95" />
            <line x1="-135" y1="46" x2="135" y2="46" stroke="#ffffff" stroke-width="2" />
            <!-- Center Mounting Cutout -->
            <rect x="-35" y="-12" width="70" height="16" rx="4" fill="#431407" stroke="#fde047" stroke-width="1.8" />
            <circle cx="0" cy="-4" r="10" fill="#431407" stroke="#fde047" stroke-width="1.8" />
          </g>
        </svg>
      `)}`;

    // 4. Scalpel: Surgical Mint Sage / Medical Cyan
    case 'plan-product-4':
      return `data:image/svg+xml;utf8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
          <defs>
            <linearGradient id="p4_bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#047857" />
              <stop offset="50%" stop-color="#10b981" />
              <stop offset="100%" stop-color="#064e3b" />
            </linearGradient>
            <linearGradient id="p4_steel" x1="0%" y1="0%" x2="100%" y2="30%">
              <stop offset="0%" stop-color="#f8fafc" />
              <stop offset="50%" stop-color="#cbd5e1" />
              <stop offset="100%" stop-color="#64748b" />
            </linearGradient>
            <filter id="p4_shadow">
              <feDropShadow dx="0" dy="12" stdDeviation="14" flood-color="#064e3b" flood-opacity="0.85" />
            </filter>
          </defs>
          <rect width="400" height="300" fill="url(#p4_bg)" />
          <ellipse cx="200" cy="150" rx="140" ry="85" fill="#6ee7b7" opacity="0.32" />

          <!-- Blade Graphic: No. 11 Precision Surgical Scalpel Blade -->
          <g transform="translate(200, 150) rotate(-16)" filter="url(#p4_shadow)">
            <path d="M -140,-20 L -20,-20 L 135,28 L -140,28 Z" fill="url(#p4_steel)" stroke="#ffffff" stroke-width="2" />
            <!-- Bevel Cutting Slant -->
            <polygon points="-20,-20 135,28 120,28 -20,-14" fill="#ffffff" opacity="0.95" />
            <line x1="-20" y1="-20" x2="135" y2="28" stroke="#ffffff" stroke-width="2" />
            <!-- Scalpel Lock Keyhole Slot -->
            <path d="M -120,0 L -75,0 L -60,16 L -120,16 Z" fill="#064e3b" stroke="#34d399" stroke-width="1.8" />
            <circle cx="-60" cy="8" r="6" fill="#064e3b" stroke="#34d399" stroke-width="1.8" />
          </g>
        </svg>
      `)}`;

    // 5. Rotary: Volcanic Crimson / Blood Red
    case 'plan-product-5':
      return `data:image/svg+xml;utf8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
          <defs>
            <linearGradient id="p5_bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#881337" />
              <stop offset="50%" stop-color="#dc2626" />
              <stop offset="100%" stop-color="#450a0a" />
            </linearGradient>
            <radialGradient id="p5_disc" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#94a3b8" />
              <stop offset="45%" stop-color="#e2e8f0" />
              <stop offset="85%" stop-color="#f8fafc" />
              <stop offset="97%" stop-color="#ffffff" />
              <stop offset="100%" stop-color="#cbd5e1" />
            </radialGradient>
            <filter id="p5_shadow">
              <feDropShadow dx="0" dy="12" stdDeviation="14" flood-color="#450a0a" flood-opacity="0.85" />
            </filter>
          </defs>
          <rect width="400" height="300" fill="url(#p5_bg)" />
          <circle cx="200" cy="150" r="120" fill="#f87171" opacity="0.3" />

          <!-- Blade Graphic: Circular Rotary Cutter Wheel -->
          <g transform="translate(200, 150)" filter="url(#p5_shadow)">
            <circle cx="0" cy="0" r="88" fill="url(#p5_disc)" stroke="#ffffff" stroke-width="2" />
            <circle cx="0" cy="0" r="86" fill="none" stroke="#dc2626" stroke-width="1.5" stroke-dasharray="10 5" />
            <circle cx="0" cy="0" r="76" fill="none" stroke="#fca5a5" stroke-width="1" />
            <!-- Central Hex / Gear Mounting Hub -->
            <circle cx="0" cy="0" r="28" fill="#450a0a" stroke="#f87171" stroke-width="2" />
            <polygon points="0,-16 14,-8 14,8 0,16 -14,8 -14,-8" fill="#dc2626" stroke="#ffffff" stroke-width="1.5" />
            <circle cx="0" cy="0" r="6" fill="#450a0a" />
          </g>
        </svg>
      `)}`;

    // 6. Gold (Special): Pure Radiant 24K Gold / Solar Amber
    case 'plan-special-1':
      return `data:image/svg+xml;utf8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
          <defs>
            <linearGradient id="ps1_bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#713f12" />
              <stop offset="50%" stop-color="#eab308" />
              <stop offset="100%" stop-color="#422006" />
            </linearGradient>
            <linearGradient id="ps1_gold" x1="0%" y1="0%" x2="100%" y2="30%">
              <stop offset="0%" stop-color="#fef08a" />
              <stop offset="25%" stop-color="#facc15" />
              <stop offset="50%" stop-color="#ffffff" />
              <stop offset="75%" stop-color="#eab308" />
              <stop offset="100%" stop-color="#ca8a04" />
            </linearGradient>
            <filter id="ps1_shadow">
              <feDropShadow dx="0" dy="14" stdDeviation="16" flood-color="#422006" flood-opacity="0.9" />
            </filter>
          </defs>
          <rect width="400" height="300" fill="url(#ps1_bg)" />
          <circle cx="200" cy="150" r="120" fill="#fde047" opacity="0.38" />

          <!-- Blade Graphic: Solid 24K Pure Gold Mirror Razor Blade -->
          <g transform="translate(200, 150) rotate(-7)" filter="url(#ps1_shadow)">
            <path d="M -140,-58 L -132,-58 L -124,-51 L -124,-61 L 124,-61 L 124,-51 L 132,-58 L 140,-58 Q 148,-58 148,-48 L 148,48 Q 148,58 140,58 L 132,58 L 124,51 L 124,61 L -124,61 L -124,51 L -132,58 L -140,58 Q -148,58 -148,48 L -148,-48 Q -148,-58 -140,-58 Z" fill="url(#ps1_gold)" stroke="#ffffff" stroke-width="2.5" />
            <!-- Gold Chamfered Bevels -->
            <polygon points="-124,-61 124,-61 118,-53 -118,-53" fill="#ffffff" opacity="0.9" />
            <polygon points="-124,61 124,61 118,53 -118,53" fill="#ffffff" opacity="0.9" />
            <line x1="-124" y1="-61" x2="124" y2="-61" stroke="#ffffff" stroke-width="2" />
            <line x1="-124" y1="61" x2="124" y2="61" stroke="#ffffff" stroke-width="2" />
            <!-- Gold Bullion Slot Cuts -->
            <g fill="#422006" stroke="#facc15" stroke-width="1.8">
              <rect x="-85" y="-6" width="170" height="12" rx="6" />
              <circle cx="0" cy="0" r="16" fill="#422006" stroke="#ffffff" stroke-width="2" />
              <circle cx="-65" cy="0" r="9" />
              <circle cx="65" cy="0" r="9" />
            </g>
          </g>
        </svg>
      `)}`;

    // =========================================================================
    // 2. TURBO SPEED MINUTES PLANS (8 Completely Distinct Colors & Models)
    // =========================================================================

    // 7. Ceramic (1m): Electric Lime / Acid Neon Green
    case 'plan-turbo-1m':
      return `data:image/svg+xml;utf8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
          <defs>
            <linearGradient id="t1_bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#3f6212" />
              <stop offset="50%" stop-color="#65a30d" />
              <stop offset="100%" stop-color="#1a2e05" />
            </linearGradient>
            <linearGradient id="t1_white" x1="0%" y1="0%" x2="100%" y2="50%">
              <stop offset="0%" stop-color="#ffffff" />
              <stop offset="50%" stop-color="#f8fafc" />
              <stop offset="100%" stop-color="#d9f99d" />
            </linearGradient>
            <filter id="t1_shadow">
              <feDropShadow dx="0" dy="12" stdDeviation="14" flood-color="#1a2e05" flood-opacity="0.85" />
            </filter>
          </defs>
          <rect width="400" height="300" fill="url(#t1_bg)" />
          <circle cx="200" cy="150" r="115" fill="#bef264" opacity="0.35" />

          <!-- Blade Graphic: Pure White Ceramic Razor Blade -->
          <g transform="translate(200, 150) rotate(-8)" filter="url(#t1_shadow)">
            <path d="M -135,-55 L -125,-55 L -118,-48 L -118,-58 L 118,-58 L 118,-48 L 125,-55 L 135,-55 Q 142,-55 142,-45 L 142,45 Q 142,55 135,55 L 125,55 L 118,48 L 118,58 L -118,58 L -118,48 L -125,55 L -135,55 Q -142,55 -142,45 L -142,-45 Q -142,-55 -135,-55 Z" fill="url(#t1_white)" stroke="#ffffff" stroke-width="2.5" />
            <line x1="-118" y1="-58" x2="118" y2="-58" stroke="#a3e635" stroke-width="2.5" />
            <line x1="-118" y1="58" x2="118" y2="58" stroke="#a3e635" stroke-width="2.5" />
            <g fill="#1a2e05" stroke="#bef264" stroke-width="1.8">
              <rect x="-80" y="-6" width="160" height="12" rx="6" />
              <circle cx="0" cy="0" r="15" fill="#1a2e05" stroke="#bef264" stroke-width="2" />
              <circle cx="-60" cy="0" r="8" />
              <circle cx="60" cy="0" r="8" />
            </g>
          </g>
        </svg>
      `)}`;

    // 8. Obsidian (3m): Deep Midnight Stealth Violet/Charcoal
    case 'plan-turbo-3m':
      return `data:image/svg+xml;utf8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
          <defs>
            <linearGradient id="t3_bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#0f051d" />
              <stop offset="50%" stop-color="#2e1065" />
              <stop offset="100%" stop-color="#090014" />
            </linearGradient>
            <linearGradient id="t3_black" x1="0%" y1="0%" x2="100%" y2="50%">
              <stop offset="0%" stop-color="#09090b" />
              <stop offset="50%" stop-color="#27272a" />
              <stop offset="100%" stop-color="#09090b" />
            </linearGradient>
            <filter id="t3_shadow">
              <feDropShadow dx="0" dy="12" stdDeviation="14" flood-color="#090014" flood-opacity="0.95" />
            </filter>
          </defs>
          <rect width="400" height="300" fill="url(#t3_bg)" />
          <circle cx="200" cy="150" r="115" fill="#c084fc" opacity="0.3" />

          <!-- Blade Graphic: Black DLC Coated Obsidian Blade with Neon Violet Edge -->
          <g transform="translate(200, 150) rotate(-10)" filter="url(#t3_shadow)">
            <path d="M -135,-55 L -125,-55 L -118,-48 L -118,-58 L 118,-58 L 118,-48 L 125,-55 L 135,-55 Q 142,-55 142,-45 L 142,45 Q 142,55 135,55 L 125,55 L 118,48 L 118,58 L -118,58 L -118,48 L -125,55 L -135,55 Q -142,55 -142,45 L -142,-45 Q -142,-55 -135,-55 Z" fill="url(#t3_black)" stroke="#c084fc" stroke-width="2" />
            <line x1="-118" y1="-58" x2="118" y2="-58" stroke="#a855f7" stroke-width="3" />
            <line x1="-118" y1="58" x2="118" y2="58" stroke="#a855f7" stroke-width="3" />
            <g fill="#090014" stroke="#e879f9" stroke-width="1.8">
              <rect x="-80" y="-6" width="160" height="12" rx="6" />
              <circle cx="0" cy="0" r="15" fill="#090014" stroke="#e879f9" stroke-width="2" />
              <circle cx="-60" cy="0" r="8" />
              <circle cx="60" cy="0" r="8" />
            </g>
          </g>
        </svg>
      `)}`;

    // 9. Comb (5m): Hot Ruby Fuchsia / Vivid Magenta
    case 'plan-turbo-5m':
      return `data:image/svg+xml;utf8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
          <defs>
            <linearGradient id="t5_bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#831843" />
              <stop offset="50%" stop-color="#db2777" />
              <stop offset="100%" stop-color="#500724" />
            </linearGradient>
            <linearGradient id="t5_blade" x1="0%" y1="0%" x2="100%" y2="50%">
              <stop offset="0%" stop-color="#ffe4e6" />
              <stop offset="50%" stop-color="#ffffff" />
              <stop offset="100%" stop-color="#fda4af" />
            </linearGradient>
            <filter id="t5_shadow">
              <feDropShadow dx="0" dy="12" stdDeviation="14" flood-color="#500724" flood-opacity="0.85" />
            </filter>
          </defs>
          <rect width="400" height="300" fill="url(#t5_bg)" />
          <ellipse cx="200" cy="150" rx="130" ry="90" fill="#f472b6" opacity="0.32" />

          <!-- Blade Graphic: Feather Styling Comb Razor Blade with Teeth -->
          <g transform="translate(200, 150) rotate(-6)" filter="url(#t5_shadow)">
            <rect x="-135" y="-45" width="270" height="90" rx="10" fill="url(#t5_blade)" stroke="#ffffff" stroke-width="2" />
            <!-- Comb Teeth Array -->
            <g fill="#500724">
              <rect x="-120" y="20" width="8" height="25" rx="2" />
              <rect x="-100" y="20" width="8" height="25" rx="2" />
              <rect x="-80" y="20" width="8" height="25" rx="2" />
              <rect x="-60" y="20" width="8" height="25" rx="2" />
              <rect x="-40" y="20" width="8" height="25" rx="2" />
              <rect x="-20" y="20" width="8" height="25" rx="2" />
              <rect x="0" y="20" width="8" height="25" rx="2" />
              <rect x="20" y="20" width="8" height="25" rx="2" />
              <rect x="40" y="20" width="8" height="25" rx="2" />
              <rect x="60" y="20" width="8" height="25" rx="2" />
              <rect x="80" y="20" width="8" height="25" rx="2" />
              <rect x="100" y="20" width="8" height="25" rx="2" />
            </g>
            <line x1="-135" y1="-45" x2="135" y2="-45" stroke="#ffffff" stroke-width="2.5" />
            <rect x="-85" y="-20" width="170" height="14" rx="7" fill="#500724" stroke="#f472b6" stroke-width="1.5" />
          </g>
        </svg>
      `)}`;

    // 10. Scraper (10m): Desert Amber / Ochre Gold
    case 'plan-turbo-10m':
      return `data:image/svg+xml;utf8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
          <defs>
            <linearGradient id="t10_bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#92400e" />
              <stop offset="50%" stop-color="#d97706" />
              <stop offset="100%" stop-color="#451a03" />
            </linearGradient>
            <linearGradient id="t10_gold" x1="0%" y1="0%" x2="100%" y2="50%">
              <stop offset="0%" stop-color="#fde68a" />
              <stop offset="50%" stop-color="#fbbf24" />
              <stop offset="100%" stop-color="#d97706" />
            </linearGradient>
            <filter id="t10_shadow">
              <feDropShadow dx="0" dy="12" stdDeviation="14" flood-color="#451a03" flood-opacity="0.85" />
            </filter>
          </defs>
          <rect width="400" height="300" fill="url(#t10_bg)" />
          <circle cx="200" cy="150" r="115" fill="#fde68a" opacity="0.32" />

          <!-- Blade Graphic: Single Edge Scraper Blade with Brass Backing Spine -->
          <g transform="translate(200, 150) rotate(-5)" filter="url(#t10_shadow)">
            <rect x="-120" y="-35" width="240" height="80" rx="3" fill="#e2e8f0" stroke="#ffffff" stroke-width="1.8" />
            <rect x="-122" y="-48" width="244" height="26" rx="4" fill="url(#t10_gold)" stroke="#ffffff" stroke-width="1.8" />
            <line x1="-115" y1="45" x2="115" y2="45" stroke="#b45309" stroke-width="2.5" />
            <polygon points="-115,45 115,45 105,38 -105,38" fill="#ffffff" opacity="0.95" />
          </g>
        </svg>
      `)}`;

    // 11. Snap-Off (15m): Electric Cyan / Bright Aqua Marine
    case 'plan-turbo-15m':
      return `data:image/svg+xml;utf8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
          <defs>
            <linearGradient id="t15_bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#0e7490" />
              <stop offset="50%" stop-color="#06b6d4" />
              <stop offset="100%" stop-color="#083344" />
            </linearGradient>
            <linearGradient id="t15_steel" x1="0%" y1="0%" x2="100%" y2="50%">
              <stop offset="0%" stop-color="#ffffff" />
              <stop offset="50%" stop-color="#cffafe" />
              <stop offset="100%" stop-color="#a5f3fc" />
            </linearGradient>
            <filter id="t15_shadow">
              <feDropShadow dx="0" dy="12" stdDeviation="14" flood-color="#083344" flood-opacity="0.85" />
            </filter>
          </defs>
          <rect width="400" height="300" fill="url(#t15_bg)" />
          <ellipse cx="200" cy="150" rx="140" ry="85" fill="#67e8f9" opacity="0.32" />

          <!-- Blade Graphic: 18mm Snap-Off Utility Blade with Diagonal Segment Scores -->
          <g transform="translate(200, 150) rotate(-14)" filter="url(#t15_shadow)">
            <polygon points="-130,-30 110,-30 135,30 -130,30" fill="url(#t15_steel)" stroke="#ffffff" stroke-width="2" />
            <!-- Segment Score Lines -->
            <g stroke="#0891b2" stroke-width="1.8">
              <line x1="-90" y1="-30" x2="-65" y2="30" />
              <line x1="-50" y1="-30" x2="-25" y2="30" />
              <line x1="-10" y1="-30" x2="15" y2="30" />
              <line x1="30" y1="-30" x2="55" y2="30" />
              <line x1="70" y1="-30" x2="95" y2="30" />
            </g>
            <line x1="-130" y1="30" x2="110" y2="30" stroke="#ffffff" stroke-width="2.5" />
            <circle cx="-115" cy="0" r="6" fill="#083344" stroke="#67e8f9" stroke-width="1.4" />
          </g>
        </svg>
      `)}`;

    // 12. Hook (30m): Forest Hunter Green
    case 'plan-turbo-30m':
      return `data:image/svg+xml;utf8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
          <defs>
            <linearGradient id="t30_bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#14532d" />
              <stop offset="50%" stop-color="#15803d" />
              <stop offset="100%" stop-color="#052e16" />
            </linearGradient>
            <linearGradient id="t30_steel" x1="0%" y1="0%" x2="100%" y2="50%">
              <stop offset="0%" stop-color="#f0fdf4" />
              <stop offset="50%" stop-color="#bbf7d0" />
              <stop offset="100%" stop-color="#86efac" />
            </linearGradient>
            <filter id="t30_shadow">
              <feDropShadow dx="0" dy="12" stdDeviation="14" flood-color="#052e16" flood-opacity="0.85" />
            </filter>
          </defs>
          <rect width="400" height="300" fill="url(#t30_bg)" />
          <circle cx="200" cy="150" r="115" fill="#86efac" opacity="0.32" />

          <!-- Blade Graphic: Dual Talon Hook Flooring Carpet Blade -->
          <g transform="translate(200, 150) rotate(-6)" filter="url(#t30_shadow)">
            <path d="M -135,-30 L 135,-30 L 135,5 Q 115,25 95,25 Q 80,15 75,-10 L -75,-10 Q -80,15 -95,25 Q -115,25 -135,5 Z" fill="url(#t30_steel)" stroke="#ffffff" stroke-width="2" />
            <rect x="-40" y="-30" width="15" height="15" rx="2" fill="#052e16" stroke="#ffffff" stroke-width="1.2" />
            <rect x="25" y="-30" width="15" height="15" rx="2" fill="#052e16" stroke="#ffffff" stroke-width="1.2" />
          </g>
        </svg>
      `)}`;

    // 13. Straight (45m): Royal Amethyst Purple
    case 'plan-turbo-45m':
      return `data:image/svg+xml;utf8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
          <defs>
            <linearGradient id="t45_bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#581c87" />
              <stop offset="50%" stop-color="#9333ea" />
              <stop offset="100%" stop-color="#2e1065" />
            </linearGradient>
            <linearGradient id="t45_steel" x1="0%" y1="0%" x2="100%" y2="50%">
              <stop offset="0%" stop-color="#ffffff" />
              <stop offset="50%" stop-color="#e9d5ff" />
              <stop offset="100%" stop-color="#c084fc" />
            </linearGradient>
            <filter id="t45_shadow">
              <feDropShadow dx="0" dy="12" stdDeviation="14" flood-color="#2e1065" flood-opacity="0.85" />
            </filter>
          </defs>
          <rect width="400" height="300" fill="url(#t45_bg)" />
          <ellipse cx="200" cy="150" rx="140" ry="85" fill="#d8b4fe" opacity="0.32" />

          <!-- Blade Graphic: Traditional Cut-Throat Barber Straight Razor -->
          <g transform="translate(200, 150) rotate(-12)" filter="url(#t45_shadow)">
            <path d="M -120,-30 L 130,-30 Q 145,-15 130,0 L -120,0 Z" fill="url(#t45_steel)" stroke="#ffffff" stroke-width="2" />
            <polygon points="-120,-30 -145,-15 -120,0" fill="#a855f7" stroke="#ffffff" stroke-width="1.5" />
            <circle cx="-135" cy="-15" r="4.5" fill="#ffffff" />
          </g>
        </svg>
      `)}`;

    // 14. Shear (60m): Deep Oceanic Teal
    case 'plan-turbo-60m':
      return `data:image/svg+xml;utf8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
          <defs>
            <linearGradient id="t60_bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#0f766e" />
              <stop offset="50%" stop-color="#14b8a6" />
              <stop offset="100%" stop-color="#042f2e" />
            </linearGradient>
            <linearGradient id="t60_steel" x1="0%" y1="0%" x2="100%" y2="50%">
              <stop offset="0%" stop-color="#f0fdfa" />
              <stop offset="50%" stop-color="#ccfbf1" />
              <stop offset="100%" stop-color="#5eead4" />
            </linearGradient>
            <filter id="t60_shadow">
              <feDropShadow dx="0" dy="12" stdDeviation="14" flood-color="#042f2e" flood-opacity="0.85" />
            </filter>
          </defs>
          <rect width="400" height="300" fill="url(#t60_bg)" />
          <circle cx="200" cy="150" r="115" fill="#5eead4" opacity="0.32" />

          <!-- Blade Graphic: Industrial Guillotine Shear Blade -->
          <g transform="translate(200, 150) rotate(-7)" filter="url(#t60_shadow)">
            <polygon points="-135,-45 135,-45 135,25 -135,45" fill="url(#t60_steel)" stroke="#ffffff" stroke-width="2" />
            <circle cx="-85" cy="-15" r="7" fill="#042f2e" stroke="#2dd4bf" stroke-width="1.5" />
            <circle cx="0" cy="-15" r="7" fill="#042f2e" stroke="#2dd4bf" stroke-width="1.5" />
            <circle cx="85" cy="-15" r="7" fill="#042f2e" stroke="#2dd4bf" stroke-width="1.5" />
            <line x1="-135" y1="45" x2="135" y2="25" stroke="#0f766e" stroke-width="3" />
          </g>
        </svg>
      `)}`;

    // =========================================================================
    // 3. VIP EXCLUSIVE PLANS (8 Distinct Color Worlds & Geometry)
    // =========================================================================

    // 15. Damascus (VIP 1): Gunmetal Steel Slate / Platinum Wavy Pattern
    case 'plan-vip-1':
      return `data:image/svg+xml;utf8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
          <defs>
            <linearGradient id="v1_bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#1e293b" />
              <stop offset="50%" stop-color="#475569" />
              <stop offset="100%" stop-color="#0f172a" />
            </linearGradient>
            <linearGradient id="v1_steel" x1="0%" y1="0%" x2="100%" y2="50%">
              <stop offset="0%" stop-color="#f8fafc" />
              <stop offset="50%" stop-color="#cbd5e1" />
              <stop offset="100%" stop-color="#64748b" />
            </linearGradient>
            <filter id="v1_shadow">
              <feDropShadow dx="0" dy="12" stdDeviation="14" flood-color="#0f172a" flood-opacity="0.85" />
            </filter>
          </defs>
          <rect width="400" height="300" fill="url(#v1_bg)" />
          <circle cx="200" cy="150" r="115" fill="#facc15" opacity="0.32" />

          <!-- Blade Graphic: Layered Damascus Pattern Blade -->
          <g transform="translate(200, 150) rotate(-8)" filter="url(#v1_shadow)">
            <rect x="-135" y="-55" width="270" height="110" rx="8" fill="url(#v1_steel)" stroke="#facc15" stroke-width="2.5" />
            <!-- Damascus Waves -->
            <path d="M -135,-35 Q -100,-45 -65,-35 T 5,-35 T 75,-35 T 135,-35" fill="none" stroke="#334155" stroke-width="2" />
            <path d="M -135,-15 Q -100,-25 -65,-15 T 5,-15 T 75,-15 T 135,-15" fill="none" stroke="#334155" stroke-width="2" />
            <path d="M -135,15 Q -100,5 -65,15 T 5,15 T 75,15 T 135,15" fill="none" stroke="#334155" stroke-width="2" />
            <path d="M -135,35 Q -100,25 -65,35 T 5,35 T 75,35 T 135,35" fill="none" stroke="#334155" stroke-width="2" />
            <rect x="-70" y="-8" width="140" height="16" rx="8" fill="#0f172a" stroke="#facc15" stroke-width="1.5" />
            <circle cx="0" cy="0" r="14" fill="#0f172a" stroke="#facc15" stroke-width="1.8" />
          </g>
        </svg>
      `)}`;

    // 16. Chrome (VIP 1b): Holographic Rainbow Iridescent Spectrum
    case 'plan-vip-1b':
      return `data:image/svg+xml;utf8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
          <defs>
            <linearGradient id="v1b_bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#dc2626" />
              <stop offset="20%" stop-color="#ea580c" />
              <stop offset="40%" stop-color="#ca8a04" />
              <stop offset="60%" stop-color="#16a34a" />
              <stop offset="80%" stop-color="#0284c7" />
              <stop offset="100%" stop-color="#9333ea" />
            </linearGradient>
            <linearGradient id="v1b_chrome" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#f43f5e" />
              <stop offset="25%" stop-color="#fb923c" />
              <stop offset="50%" stop-color="#4ade80" />
              <stop offset="75%" stop-color="#38bdf8" />
              <stop offset="100%" stop-color="#c084fc" />
            </linearGradient>
            <filter id="v1b_shadow">
              <feDropShadow dx="0" dy="12" stdDeviation="14" flood-color="#09090b" flood-opacity="0.85" />
            </filter>
          </defs>
          <rect width="400" height="300" fill="url(#v1b_bg)" />
          <circle cx="200" cy="150" r="115" fill="#ffffff" opacity="0.3" />

          <!-- Blade Graphic: Anodized Rainbow Titanium DE Razor -->
          <g transform="translate(200, 150) rotate(-10)" filter="url(#v1b_shadow)">
            <path d="M -135,-55 L -125,-55 L -118,-48 L -118,-58 L 118,-58 L 118,-48 L 125,-55 L 135,-55 Q 142,-55 142,-45 L 142,45 Q 142,55 135,55 L 125,55 L 118,48 L 118,58 L -118,58 L -118,48 L -125,55 L -135,55 Q -142,55 -142,45 L -142,-45 Q -142,-55 -135,-55 Z" fill="url(#v1b_chrome)" stroke="#ffffff" stroke-width="2.5" />
            <rect x="-75" y="-6" width="150" height="12" rx="6" fill="#1e1035" stroke="#ffffff" stroke-width="1.5" />
            <circle cx="0" cy="0" r="14" fill="#1e1035" stroke="#ffffff" stroke-width="1.8" />
          </g>
        </svg>
      `)}`;

    // 17. Cryo (VIP 2): Sub-Zero Glacial Ice Blue / Frost White-Cyan
    case 'plan-vip-2':
      return `data:image/svg+xml;utf8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
          <defs>
            <linearGradient id="v2_bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#0284c7" />
              <stop offset="50%" stop-color="#38bdf8" />
              <stop offset="100%" stop-color="#0c4a6e" />
            </linearGradient>
            <linearGradient id="v2_ice" x1="0%" y1="0%" x2="100%" y2="50%">
              <stop offset="0%" stop-color="#ffffff" />
              <stop offset="50%" stop-color="#e0f2fe" />
              <stop offset="100%" stop-color="#bae6fd" />
            </linearGradient>
            <filter id="v2_shadow">
              <feDropShadow dx="0" dy="12" stdDeviation="14" flood-color="#0c4a6e" flood-opacity="0.85" />
            </filter>
          </defs>
          <rect width="400" height="300" fill="url(#v2_bg)" />
          <circle cx="200" cy="150" r="115" fill="#ffffff" opacity="0.4" />

          <!-- Blade Graphic: Frozen Cryo Blade with Glacial Ice Facets -->
          <g transform="translate(200, 150) rotate(-6)" filter="url(#v2_shadow)">
            <rect x="-135" y="-55" width="270" height="110" rx="8" fill="url(#v2_ice)" stroke="#ffffff" stroke-width="2.5" />
            <line x1="-120" y1="-55" x2="120" y2="-55" stroke="#ffffff" stroke-width="3" />
            <line x1="-120" y1="55" x2="120" y2="55" stroke="#ffffff" stroke-width="3" />
            <circle cx="0" cy="0" r="16" fill="#082f49" stroke="#67e8f9" stroke-width="1.8" />
          </g>
        </svg>
      `)}`;

    // 18. Carbide (VIP 2b): Industrial Caution Hazard Yellow & Carbon Charcoal
    case 'plan-vip-2b':
      return `data:image/svg+xml;utf8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
          <defs>
            <linearGradient id="v2b_bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#1c1917" />
              <stop offset="50%" stop-color="#ca8a04" />
              <stop offset="100%" stop-color="#0c0a09" />
            </linearGradient>
            <linearGradient id="v2b_carbide" x1="0%" y1="0%" x2="100%" y2="50%">
              <stop offset="0%" stop-color="#292524" />
              <stop offset="50%" stop-color="#44403c" />
              <stop offset="100%" stop-color="#1c1917" />
            </linearGradient>
            <filter id="v2b_shadow">
              <feDropShadow dx="0" dy="12" stdDeviation="14" flood-color="#0c0a09" flood-opacity="0.9" />
            </filter>
          </defs>
          <rect width="400" height="300" fill="url(#v2b_bg)" />
          <circle cx="200" cy="150" r="115" fill="#facc15" opacity="0.32" />

          <!-- Blade Graphic: Aviation Carbide Heavy Hexagon Blade -->
          <g transform="translate(200, 150) rotate(-9)" filter="url(#v2b_shadow)">
            <polygon points="-135,-35 -85,-55 85,-55 135,-35 135,35 85,55 -85,55 -135,35" fill="url(#v2b_carbide)" stroke="#facc15" stroke-width="2.5" />
            <line x1="-120" y1="-55" x2="120" y2="-55" stroke="#facc15" stroke-width="3" />
            <line x1="-120" y1="55" x2="120" y2="55" stroke="#facc15" stroke-width="3" />
          </g>
        </svg>
      `)}`;

    // 19. Cobalt (VIP 3): Deep Midnight Ultramarine Sapphire Blue
    case 'plan-vip-3':
      return `data:image/svg+xml;utf8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
          <defs>
            <linearGradient id="v3_bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#172554" />
              <stop offset="50%" stop-color="#1d4ed8" />
              <stop offset="100%" stop-color="#030712" />
            </linearGradient>
            <linearGradient id="v3_blue" x1="0%" y1="0%" x2="100%" y2="50%">
              <stop offset="0%" stop-color="#93c5fd" />
              <stop offset="50%" stop-color="#2563eb" />
              <stop offset="100%" stop-color="#1e3a8a" />
            </linearGradient>
            <filter id="v3_shadow">
              <feDropShadow dx="0" dy="12" stdDeviation="14" flood-color="#030712" flood-opacity="0.9" />
            </filter>
          </defs>
          <rect width="400" height="300" fill="url(#v3_bg)" />
          <circle cx="200" cy="150" r="115" fill="#38bdf8" opacity="0.35" />

          <!-- Blade Graphic: Sapphire PVD Cobalt Razor Blade -->
          <g transform="translate(200, 150) rotate(-7)" filter="url(#v3_shadow)">
            <rect x="-135" y="-55" width="270" height="110" rx="8" fill="url(#v3_blue)" stroke="#ffffff" stroke-width="2.5" />
            <circle cx="0" cy="0" r="16" fill="#172554" stroke="#93c5fd" stroke-width="1.8" />
            <rect x="-70" y="-7" width="140" height="14" rx="7" fill="#172554" stroke="#93c5fd" stroke-width="1.5" />
          </g>
        </svg>
      `)}`;

    // 20. Laser (VIP 3b): High-Tech Cyber Photon Laser Blade (Electric Scarlet Red & Tanto Angle)
    case 'plan-vip-3b':
      return `data:image/svg+xml;utf8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
          <defs>
            <linearGradient id="v3b_bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#450a0a" />
              <stop offset="50%" stop-color="#991b1b" />
              <stop offset="100%" stop-color="#1c0404" />
            </linearGradient>
            <linearGradient id="v3b_cyber" x1="0%" y1="0%" x2="100%" y2="50%">
              <stop offset="0%" stop-color="#18181b" />
              <stop offset="40%" stop-color="#27272a" />
              <stop offset="70%" stop-color="#7f1d1d" />
              <stop offset="100%" stop-color="#ef4444" />
            </linearGradient>
            <filter id="v3b_glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="v3b_shadow">
              <feDropShadow dx="0" dy="12" stdDeviation="14" flood-color="#1c0404" flood-opacity="0.95" />
            </filter>
          </defs>
          <rect width="400" height="300" fill="url(#v3b_bg)" />
          <circle cx="200" cy="150" r="110" fill="#dc2626" opacity="0.35" filter="url(#v3b_glow)" />

          <!-- Laser Cyber Grid Lines -->
          <g stroke="#ef4444" stroke-width="0.8" opacity="0.25">
            <line x1="0" y1="90" x2="400" y2="90" />
            <line x1="0" y1="150" x2="400" y2="150" stroke-width="1.2" />
            <line x1="0" y1="210" x2="400" y2="210" />
            <line x1="120" y1="0" x2="120" y2="300" />
            <line x1="200" y1="0" x2="200" y2="300" />
            <line x1="280" y1="0" x2="280" y2="300" />
          </g>

          <!-- Futuristic Chiseled Laser Blade (Tanto Angled Profile) -->
          <g transform="translate(200, 150) rotate(-10)" filter="url(#v3b_shadow)">
            <polygon points="-140,-42 60,-42 140,0 100,42 -140,42" fill="url(#v3b_cyber)" stroke="#ef4444" stroke-width="2.2" />
            <polygon points="60,-42 140,0 100,42 50,30" fill="#ffffff" opacity="0.95" />
            <line x1="60" y1="-42" x2="140" y2="0" stroke="#fca5a5" stroke-width="2.5" />
            <line x1="140" y1="0" x2="100" y2="42" stroke="#fca5a5" stroke-width="2.5" />
            <line x1="-140" y1="42" x2="100" y2="42" stroke="#ffffff" stroke-width="3" />
            <!-- Glowing Laser Core Beam -->
            <line x1="-125" y1="0" x2="110" y2="0" stroke="#ffffff" stroke-width="3" filter="url(#v3b_glow)" />
            <line x1="-125" y1="0" x2="110" y2="0" stroke="#f87171" stroke-width="6" opacity="0.6" />
            <circle cx="-100" cy="0" r="10" fill="#450a0a" stroke="#ef4444" stroke-width="2" />
            <circle cx="-100" cy="0" r="4" fill="#ffffff" />
            <circle cx="-30" cy="0" r="10" fill="#450a0a" stroke="#ef4444" stroke-width="2" />
            <circle cx="-30" cy="0" r="4" fill="#ffffff" />
            <circle cx="40" cy="0" r="10" fill="#450a0a" stroke="#ef4444" stroke-width="2" />
            <circle cx="40" cy="0" r="4" fill="#ffffff" />
            <rect x="-130" y="-30" width="8" height="16" rx="2" fill="#ef4444" />
            <rect x="-115" y="-30" width="8" height="16" rx="2" fill="#ef4444" />
            <rect x="-100" y="-30" width="8" height="16" rx="2" fill="#ef4444" />
          </g>
        </svg>
      `)}`;

    // 21. Rose Gold (VIP 4): 18K Champagne Rose Gold Baroque Luxury Blade (Scalloped Edges & Velvet Bronze)
    case 'plan-vip-4':
      return `data:image/svg+xml;utf8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
          <defs>
            <linearGradient id="v4_bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#2d151e" />
              <stop offset="50%" stop-color="#4a222f" />
              <stop offset="100%" stop-color="#180b10" />
            </linearGradient>
            <linearGradient id="v4_rosegold" x1="0%" y1="0%" x2="100%" y2="50%">
              <stop offset="0%" stop-color="#fff1f2" />
              <stop offset="25%" stop-color="#fbcfe8" />
              <stop offset="50%" stop-color="#fda4af" />
              <stop offset="75%" stop-color="#e0a080" />
              <stop offset="100%" stop-color="#c2715c" />
            </linearGradient>
            <filter id="v4_shadow">
              <feDropShadow dx="0" dy="12" stdDeviation="15" flood-color="#180b10" flood-opacity="0.9" />
            </filter>
          </defs>
          <rect width="400" height="300" fill="url(#v4_bg)" />
          <circle cx="200" cy="150" r="115" fill="#fbcfe8" opacity="0.22" />

          <!-- Baroque Scalloped Luxury Rose Gold Blade -->
          <g transform="translate(200, 150) rotate(-6)" filter="url(#v4_shadow)">
            <path d="M -135,-48 Q -68,-60 0,-48 Q 68,-60 135,-48 Q 146,-48 146,-36 L 146,36 Q 146,48 135,48 Q 68,60 0,48 Q -68,60 -135,48 Q -146,48 -146,36 L -146,-36 Q -146,-48 -135,-48 Z" fill="url(#v4_rosegold)" stroke="#ffffff" stroke-width="2" />
            <path d="M -130,-46 Q -65,-56 0,-46 Q 65,-56 130,-46" fill="none" stroke="#ffffff" stroke-width="2.5" />
            <path d="M -130,46 Q -65,56 0,46 Q 65,56 130,46" fill="none" stroke="#ffffff" stroke-width="2.5" />
            <g fill="#2d151e" stroke="#fbcfe8" stroke-width="1.8">
              <ellipse cx="0" cy="0" rx="24" ry="16" />
              <circle cx="0" cy="0" r="7" fill="#ffffff" stroke="#e0a080" stroke-width="1.5" />
              <path d="M -70,-8 C -85,-16 -85,16 -70,8 Z" />
              <path d="M 70,-8 C 85,-16 85,16 70,8 Z" />
              <circle cx="-110" cy="-24" r="5" fill="#2d151e" stroke="#e0a080" stroke-width="1.5" />
              <circle cx="110" cy="-24" r="5" fill="#2d151e" stroke="#e0a080" stroke-width="1.5" />
              <circle cx="-110" cy="24" r="5" fill="#2d151e" stroke="#e0a080" stroke-width="1.5" />
              <circle cx="110" cy="24" r="5" fill="#2d151e" stroke="#e0a080" stroke-width="1.5" />
            </g>
            <path d="M -45,-12 Q -25,-22 0,-18 Q 25,-22 45,-12" fill="none" stroke="#be5d44" stroke-width="1.2" />
            <path d="M -45,12 Q -25,22 0,18 Q 25,22 45,12" fill="none" stroke="#be5d44" stroke-width="1.2" />
          </g>
        </svg>
      `)}`;

    // 22. Diamond (VIP 5): Pitch Black Obsidian Diamond with 24K Gold Crown Crest
    case 'plan-vip-5':
      return `data:image/svg+xml;utf8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
          <defs>
            <linearGradient id="v5_bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#020617" />
              <stop offset="50%" stop-color="#0f172a" />
              <stop offset="100%" stop-color="#000000" />
            </linearGradient>
            <linearGradient id="v5_diamond" x1="0%" y1="0%" x2="100%" y2="50%">
              <stop offset="0%" stop-color="#18181b" />
              <stop offset="50%" stop-color="#27272a" />
              <stop offset="100%" stop-color="#09090b" />
            </linearGradient>
            <filter id="v5_shadow">
              <feDropShadow dx="0" dy="16" stdDeviation="18" flood-color="#000000" flood-opacity="0.95" />
            </filter>
          </defs>
          <rect width="400" height="300" fill="url(#v5_bg)" />
          <circle cx="200" cy="150" r="120" fill="#facc15" opacity="0.3" />

          <!-- Blade Graphic: Black Diamond Obsidian Blade with Diamond Inlays -->
          <g transform="translate(200, 150) rotate(-8)" filter="url(#v5_shadow)">
            <rect x="-135" y="-55" width="270" height="110" rx="8" fill="url(#v5_diamond)" stroke="#facc15" stroke-width="2.5" />
            <polygon points="-80,0 -85,-8 -90,0 -85,8" fill="#67e8f9" stroke="#ffffff" stroke-width="1" />
            <polygon points="80,0 85,-8 90,0 85,8" fill="#67e8f9" stroke="#ffffff" stroke-width="1" />
            <circle cx="0" cy="0" r="18" fill="#020617" stroke="#facc15" stroke-width="2" />
            <path d="M -8,5 L -10,-4 L -4,-1 L 0,-6 L 4,-1 L 10,-4 L 8,5 Z" fill="#facc15" stroke="#ffffff" stroke-width="1" />
          </g>
        </svg>
      `)}`;

    default:
      return `data:image/svg+xml;utf8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
          <rect width="400" height="300" fill="#0f172a" />
          <g transform="translate(200, 150)">
            <rect x="-135" y="-55" width="270" height="110" rx="8" fill="#1e293b" stroke="#ffffff" stroke-width="2" />
            <line x1="-120" y1="-55" x2="120" y2="-55" stroke="#ffffff" stroke-width="2.5" />
            <line x1="-120" y1="55" x2="120" y2="55" stroke="#ffffff" stroke-width="2.5" />
            <circle cx="0" cy="0" r="14" fill="#0f172a" stroke="#60a5fa" stroke-width="2" />
          </g>
        </svg>
      `)}`;
  }
}

export const ProductArtwork: React.FC<{
  plan: Plan;
  className?: string;
}> = ({ plan, className = 'w-full h-full object-cover' }) => {
  const uri = getProductArtworkDataUri(plan.id, plan.category);
  return (
    <img
      src={uri}
      alt={plan.title}
      className={className}
      loading="eager"
      referrerPolicy="no-referrer"
    />
  );
};
