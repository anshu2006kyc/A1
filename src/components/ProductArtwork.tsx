import React from 'react';
import { Plan } from '../types';

/**
 * Returns a high-fidelity, 100% UNIQUE SVG Data URI specifically designed for each AKM ENTERPRISES Blade Asset.
 * STRICT COMPLIANCE: Every single plan has a completely distinct visual blade model, geometry, color palette,
 * and metallurgical theme. Zero duplicate images anywhere.
 */
export function getProductArtworkDataUri(planId: string, category?: string): string {
  const cleanId = (planId || '').toLowerCase().trim();

  switch (cleanId) {
    // =========================================================================
    // 1. NORMAL PLANS (6 Completely Unique Models)
    // =========================================================================

    // Product 1: Swedish Platinum Double-Edge Razor Blade
    case 'plan-product-1':
      return `data:image/svg+xml;utf8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
          <defs>
            <linearGradient id="p1_bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#021a12" />
              <stop offset="50%" stop-color="#063826" />
              <stop offset="100%" stop-color="#02140d" />
            </linearGradient>
            <linearGradient id="p1_steel" x1="0%" y1="0%" x2="100%" y2="25%">
              <stop offset="0%" stop-color="#94a3b8" />
              <stop offset="20%" stop-color="#f8fafc" />
              <stop offset="40%" stop-color="#cbd5e1" />
              <stop offset="60%" stop-color="#ffffff" />
              <stop offset="80%" stop-color="#94a3b8" />
              <stop offset="100%" stop-color="#475569" />
            </linearGradient>
            <linearGradient id="p1_bevel" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#ffffff" />
              <stop offset="50%" stop-color="#38bdf8" />
              <stop offset="100%" stop-color="#cbd5e1" />
            </linearGradient>
            <filter id="p1_shadow">
              <feDropShadow dx="0" dy="10" stdDeviation="12" flood-color="#000" flood-opacity="0.85" />
            </filter>
          </defs>
          <rect width="400" height="300" fill="url(#p1_bg)" />
          <circle cx="200" cy="140" r="110" fill="#10b981" opacity="0.12" />

          <!-- Badges -->
          <g transform="translate(16, 14)">
            <rect width="155" height="24" rx="12" fill="#000" fill-opacity="0.85" stroke="#10b981" stroke-width="1.2" />
            <circle cx="16" cy="12" r="4" fill="#34d399" />
            <text x="85" y="15.5" text-anchor="middle" fill="#34d399" font-family="sans-serif" font-size="7.5" font-weight="900">SWEDISH CRYO STEEL</text>
          </g>
          <g transform="translate(265, 14)">
            <rect width="119" height="24" rx="12" fill="#000" fill-opacity="0.85" stroke="#38bdf8" stroke-width="1.2" />
            <text x="59.5" y="15.5" text-anchor="middle" fill="#bae6fd" font-family="monospace" font-size="7.5" font-weight="900">0.10mm CRYO</text>
          </g>

          <!-- Blade Graphic: DE Razor Blade -->
          <g transform="translate(200, 138) rotate(-9)" filter="url(#p1_shadow)">
            <path d="M -140,-58 L -132,-58 L -124,-51 L -124,-61 L 124,-61 L 124,-51 L 132,-58 L 140,-58 Q 148,-58 148,-48 L 148,48 Q 148,58 140,58 L 132,58 L 124,51 L 124,61 L -124,61 L -124,51 L -132,58 L -140,58 Q -148,58 -148,48 L -148,-48 Q -148,-58 -140,-58 Z" fill="url(#p1_steel)" stroke="#f1f5f9" stroke-width="1.5" />
            <polygon points="-124,-61 124,-61 118,-54 -118,-54" fill="url(#p1_bevel)" opacity="0.95" />
            <line x1="-124" y1="-61" x2="124" y2="-61" stroke="#ffffff" stroke-width="1.2" />
            <line x1="-40" y1="-61" x2="40" y2="-61" stroke="#fef08a" stroke-width="2" />
            <polygon points="-124,61 124,61 118,54 -118,54" fill="url(#p1_bevel)" opacity="0.95" />
            <line x1="-124" y1="61" x2="124" y2="61" stroke="#ffffff" stroke-width="1.2" />
            <line x1="-60" y1="61" x2="20" y2="61" stroke="#fef08a" stroke-width="2" />

            <!-- Cutout Slots -->
            <g fill="#02140d" stroke="#475569" stroke-width="1.2">
              <rect x="-85" y="-6" width="170" height="12" rx="6" />
              <circle cx="0" cy="0" r="16" fill="#02140d" stroke="#64748b" stroke-width="1.5" />
              <circle cx="-65" cy="0" r="9" fill="#02140d" stroke="#64748b" stroke-width="1.2" />
              <circle cx="65" cy="0" r="9" fill="#02140d" stroke="#64748b" stroke-width="1.2" />
              <rect x="-115" y="-40" width="10" height="18" rx="2" />
              <rect x="105" y="-40" width="10" height="18" rx="2" />
              <rect x="-115" y="22" width="10" height="18" rx="2" />
              <rect x="105" y="22" width="10" height="18" rx="2" />
            </g>
            <polygon points="-90,-61 -50,-61 90,61 50,61" fill="#ffffff" opacity="0.22" />
            <text x="0" y="-22" text-anchor="middle" fill="#0f172a" font-family="'Courier New', monospace" font-size="10.5" font-weight="900" letter-spacing="2">AKM SUPER PLATINUM</text>
            <text x="0" y="-12" text-anchor="middle" fill="#475569" font-family="sans-serif" font-size="6" font-weight="700">SWEDISH STEEL • 0.10mm CRYO</text>
            <text x="0" y="27" text-anchor="middle" fill="#0f172a" font-family="'Courier New', monospace" font-size="9" font-weight="900" letter-spacing="1.5">AKM ENTERPRISES</text>
            <text x="0" y="37" text-anchor="middle" fill="#059669" font-family="sans-serif" font-size="5.5" font-weight="800">✓ ISO 9001:2015 CERTIFIED</text>
          </g>

          <rect x="16" y="246" width="368" height="38" rx="10" fill="#000" fill-opacity="0.88" stroke="#10b981" stroke-width="1" />
          <text x="30" y="263" fill="#34d399" font-family="monospace" font-size="9.5" font-weight="bold">AKM PLATINUM DOUBLE-EDGE RAZOR BLADES</text>
          <text x="30" y="276" fill="#94a3b8" font-family="sans-serif" font-size="8.5">AKM BLADE DIVISION • DAILY DIVIDEND ₹245 • 30 DAYS</text>
          <rect x="272" y="253" width="100" height="24" rx="6" fill="#059669" />
          <text x="322" y="269" text-anchor="middle" fill="#ffffff" font-family="monospace" font-size="9" font-weight="900">₹245 / DAY</text>
        </svg>
      `)}`;

    // Product 2: 5-Blade Matrix Shaving Cartridge
    case 'plan-product-2':
      return `data:image/svg+xml;utf8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
          <defs>
            <linearGradient id="p2_bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#021c27" />
              <stop offset="50%" stop-color="#043343" />
              <stop offset="100%" stop-color="#01141d" />
            </linearGradient>
            <linearGradient id="p2_blade" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#475569" />
              <stop offset="30%" stop-color="#ffffff" />
              <stop offset="60%" stop-color="#cbd5e1" />
              <stop offset="100%" stop-color="#64748b" />
            </linearGradient>
            <linearGradient id="p2_lube" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#0284c7" />
              <stop offset="50%" stop-color="#38bdf8" />
              <stop offset="100%" stop-color="#06b6d4" />
            </linearGradient>
            <filter id="p2_shadow">
              <feDropShadow dx="0" dy="10" stdDeviation="12" flood-color="#000" flood-opacity="0.85" />
            </filter>
          </defs>
          <rect width="400" height="300" fill="url(#p2_bg)" />
          <circle cx="200" cy="140" r="110" fill="#0284c7" opacity="0.15" />

          <g transform="translate(16, 14)">
            <rect width="165" height="24" rx="12" fill="#000" fill-opacity="0.85" stroke="#38bdf8" stroke-width="1.2" />
            <circle cx="16" cy="12" r="4" fill="#38bdf8" />
            <text x="90" y="15.5" text-anchor="middle" fill="#7dd3fc" font-family="sans-serif" font-size="7.5" font-weight="900">5-BLADE MATRIX SHIELD</text>
          </g>
          <g transform="translate(265, 14)">
            <rect width="119" height="24" rx="12" fill="#000" fill-opacity="0.85" stroke="#38bdf8" stroke-width="1.2" />
            <text x="59.5" y="15.5" text-anchor="middle" fill="#bae6fd" font-family="monospace" font-size="7.5" font-weight="900">ALOE MATRIX</text>
          </g>

          <g transform="translate(200, 138) rotate(-5)" filter="url(#p2_shadow)">
            <rect x="-130" y="-65" width="260" height="130" rx="14" fill="#0f172a" stroke="#38bdf8" stroke-width="1.8" />
            <rect x="-115" y="-55" width="230" height="15" rx="6" fill="url(#p2_lube)" />
            <text x="0" y="-45" text-anchor="middle" fill="#ffffff" font-family="sans-serif" font-size="6.5" font-weight="800">ALOE &amp; VITAMIN-E MATRIX</text>
            <rect x="-115" y="-32" width="230" height="8" rx="2" fill="url(#p2_blade)" />
            <line x1="-115" y1="-32" x2="115" y2="-32" stroke="#ffffff" stroke-width="1" />
            <rect x="-115" y="-20" width="230" height="8" rx="2" fill="url(#p2_blade)" />
            <line x1="-115" y1="-20" x2="115" y2="-20" stroke="#ffffff" stroke-width="1" />
            <rect x="-115" y="-8" width="230" height="8" rx="2" fill="url(#p2_blade)" />
            <line x1="-115" y1="-8" x2="115" y2="-8" stroke="#ffffff" stroke-width="1" />
            <rect x="-115" y="4" width="230" height="8" rx="2" fill="url(#p2_blade)" />
            <line x1="-115" y1="4" x2="115" y2="4" stroke="#ffffff" stroke-width="1" />
            <rect x="-115" y="16" width="230" height="8" rx="2" fill="url(#p2_blade)" />
            <line x1="-115" y1="16" x2="115" y2="16" stroke="#ffffff" stroke-width="1" />
            <rect x="-115" y="32" width="230" height="20" rx="5" fill="#0891b2" opacity="0.9" />
            <line x1="-110" y1="36" x2="110" y2="36" stroke="#22d3ee" stroke-width="1.2" />
            <line x1="-110" y1="41" x2="110" y2="41" stroke="#22d3ee" stroke-width="1.2" />
            <line x1="-110" y1="46" x2="110" y2="46" stroke="#22d3ee" stroke-width="1.2" />
            <polygon points="-30,65 30,65 20,82 -20,82" fill="#64748b" stroke="#cbd5e1" stroke-width="1.2" />
            <circle cx="0" cy="73" r="3.5" fill="#0284c7" />
            <text x="0" y="60" text-anchor="middle" fill="#7dd3fc" font-family="'Courier New', monospace" font-size="7" font-weight="900" letter-spacing="1">AKM 5-BLADE COMFORT SYSTEM</text>
          </g>

          <rect x="16" y="246" width="368" height="38" rx="10" fill="#000" fill-opacity="0.88" stroke="#38bdf8" stroke-width="1" />
          <text x="30" y="263" fill="#38bdf8" font-family="monospace" font-size="9.5" font-weight="bold">AKM 5-BLADE COMFORT MATRIX CARTRIDGE</text>
          <text x="30" y="276" fill="#94a3b8" font-family="sans-serif" font-size="8.5">AKM BLADE DIVISION • DAILY DIVIDEND ₹480 • 35 DAYS</text>
          <rect x="272" y="253" width="100" height="24" rx="6" fill="#0284c7" />
          <text x="322" y="269" text-anchor="middle" fill="#ffffff" font-family="monospace" font-size="9" font-weight="900">₹480 / DAY</text>
        </svg>
      `)}`;

    // Product 3: Golden Titanium Nitride Utility Blade
    case 'plan-product-3':
      return `data:image/svg+xml;utf8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
          <defs>
            <linearGradient id="p3_bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#191102" />
              <stop offset="50%" stop-color="#302004" />
              <stop offset="100%" stop-color="#120c02" />
            </linearGradient>
            <linearGradient id="p3_gold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#fef08a" />
              <stop offset="35%" stop-color="#eab308" />
              <stop offset="70%" stop-color="#ca8a04" />
              <stop offset="100%" stop-color="#854d0e" />
            </linearGradient>
            <filter id="p3_shadow">
              <feDropShadow dx="0" dy="10" stdDeviation="12" flood-color="#000" flood-opacity="0.85" />
            </filter>
          </defs>
          <rect width="400" height="300" fill="url(#p3_bg)" />
          <circle cx="200" cy="140" r="110" fill="#f59e0b" opacity="0.12" />

          <g transform="translate(16, 14)">
            <rect width="175" height="24" rx="12" fill="#000" fill-opacity="0.85" stroke="#eab308" stroke-width="1.2" />
            <circle cx="16" cy="12" r="4" fill="#facc15" />
            <text x="95" y="15.5" text-anchor="middle" fill="#fef08a" font-family="sans-serif" font-size="7.5" font-weight="900">TITANIUM NITRIDE (TiN)</text>
          </g>
          <g transform="translate(265, 14)">
            <rect width="119" height="24" rx="12" fill="#000" fill-opacity="0.85" stroke="#eab308" stroke-width="1.2" />
            <text x="59.5" y="15.5" text-anchor="middle" fill="#fef08a" font-family="monospace" font-size="7.5" font-weight="900">HEAVY CARBIDE</text>
          </g>

          <g transform="translate(200, 140) rotate(-11)" filter="url(#p3_shadow)">
            <polygon points="-125,-45 125,-45 102,45 -102,45" fill="url(#p3_gold)" stroke="#fef08a" stroke-width="1.8" />
            <polygon points="-102,45 102,45 96,38 -96,38" fill="#ffffff" opacity="0.95" />
            <line x1="-102" y1="45" x2="102" y2="45" stroke="#fef08a" stroke-width="1.8" />
            <line x1="-30" y1="45" x2="30" y2="45" stroke="#ffffff" stroke-width="2.5" />
            <rect x="-45" y="-45" width="16" height="15" rx="2" fill="#191102" />
            <rect x="30" y="-45" width="16" height="15" rx="2" fill="#191102" />
            <circle cx="-8" cy="-14" r="7" fill="#191102" stroke="#78350f" stroke-width="1" />
            <line x1="-80" y1="-35" x2="80" y2="-35" stroke="#78350f" stroke-width="1" />
            <text x="0" y="8" text-anchor="middle" fill="#451a03" font-family="'Courier New', monospace" font-size="9" font-weight="900" letter-spacing="2">TITANIUM NITRIDE (TiN)</text>
            <text x="0" y="20" text-anchor="middle" fill="#78350f" font-family="sans-serif" font-size="6" font-weight="800">AKM INDUSTRIAL UTILITY BLADE</text>
          </g>

          <rect x="16" y="246" width="368" height="38" rx="10" fill="#000" fill-opacity="0.88" stroke="#eab308" stroke-width="1" />
          <text x="30" y="263" fill="#facc15" font-family="monospace" font-size="9.5" font-weight="bold">AKM TITANIUM NITRIDE INDUSTRIAL CUTTER BLADES</text>
          <text x="30" y="276" fill="#94a3b8" font-family="sans-serif" font-size="8.5">AKM BLADE DIVISION • DAILY DIVIDEND ₹960 • 40 DAYS</text>
          <rect x="272" y="253" width="100" height="24" rx="6" fill="#ca8a04" />
          <text x="322" y="269" text-anchor="middle" fill="#ffffff" font-family="monospace" font-size="9" font-weight="900">₹960 / DAY</text>
        </svg>
      `)}`;

    // Product 4: Surgical Scalpel Micro-Blade
    case 'plan-product-4':
      return `data:image/svg+xml;utf8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
          <defs>
            <linearGradient id="p4_bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#02141a" />
              <stop offset="50%" stop-color="#052b36" />
              <stop offset="100%" stop-color="#010d12" />
            </linearGradient>
            <linearGradient id="p4_steel" x1="0%" y1="0%" x2="100%" y2="30%">
              <stop offset="0%" stop-color="#64748b" />
              <stop offset="30%" stop-color="#ffffff" />
              <stop offset="70%" stop-color="#cbd5e1" />
              <stop offset="100%" stop-color="#475569" />
            </linearGradient>
            <filter id="p4_shadow">
              <feDropShadow dx="0" dy="10" stdDeviation="12" flood-color="#000" flood-opacity="0.85" />
            </filter>
          </defs>
          <rect width="400" height="300" fill="url(#p4_bg)" />
          <circle cx="200" cy="140" r="110" fill="#06b6d4" opacity="0.12" />

          <g transform="translate(16, 14)">
            <rect width="170" height="24" rx="12" fill="#000" fill-opacity="0.85" stroke="#06b6d4" stroke-width="1.2" />
            <circle cx="16" cy="12" r="4" fill="#22d3ee" />
            <text x="92" y="15.5" text-anchor="middle" fill="#67e8f9" font-family="sans-serif" font-size="7.5" font-weight="900">SURGICAL GRADE STERILE</text>
          </g>
          <g transform="translate(265, 14)">
            <rect width="119" height="24" rx="12" fill="#000" fill-opacity="0.85" stroke="#06b6d4" stroke-width="1.2" />
            <text x="59.5" y="15.5" text-anchor="middle" fill="#67e8f9" font-family="monospace" font-size="7.5" font-weight="900">0.05mm ULTRA</text>
          </g>

          <g transform="translate(200, 140) rotate(-14)" filter="url(#p4_shadow)">
            <path d="M -120,-15 L -40,-15 C 40,-15 90,5 130,35 L 110,40 C 60,30 -20,20 -120,20 Z" fill="url(#p4_steel)" stroke="#e2e8f0" stroke-width="1.5" />
            <polygon points="-110,-5 -50,-5 -40,10 -100,10" fill="#02141a" stroke="#64748b" stroke-width="1.2" />
            <path d="M -120,20 C -20,20 60,30 110,40" stroke="#ffffff" stroke-width="2" fill="none" />
            <line x1="-30" y1="20" x2="30" y2="25" stroke="#67e8f9" stroke-width="2.5" />
            <text x="-40" y="-2" fill="#0f172a" font-family="'Courier New', monospace" font-size="7.5" font-weight="900">AKM-NO.11 SURGICAL</text>
            <text x="-40" y="8" fill="#475569" font-family="sans-serif" font-size="5" font-weight="800">SWEDISH CARBON STEEL</text>
          </g>

          <rect x="16" y="246" width="368" height="38" rx="10" fill="#000" fill-opacity="0.88" stroke="#06b6d4" stroke-width="1" />
          <text x="30" y="263" fill="#22d3ee" font-family="monospace" font-size="9.5" font-weight="bold">AKM SURGICAL GRADE MICRO-SCALPEL BLADES</text>
          <text x="30" y="276" fill="#94a3b8" font-family="sans-serif" font-size="8.5">AKM BLADE DIVISION • DAILY DIVIDEND ₹2,100 • 45 DAYS</text>
          <rect x="272" y="253" width="100" height="24" rx="6" fill="#0891b2" />
          <text x="322" y="269" text-anchor="middle" fill="#ffffff" font-family="monospace" font-size="9" font-weight="900">₹2,100 / DAY</text>
        </svg>
      `)}`;

    // Product 5: Industrial Tungsten Rotary Slitter Blade
    case 'plan-product-5':
      return `data:image/svg+xml;utf8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
          <defs>
            <linearGradient id="p5_bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#140f02" />
              <stop offset="50%" stop-color="#2d2003" />
              <stop offset="100%" stop-color="#0f0b01" />
            </linearGradient>
            <linearGradient id="p5_gold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#fef08a" />
              <stop offset="30%" stop-color="#eab308" />
              <stop offset="70%" stop-color="#ca8a04" />
              <stop offset="100%" stop-color="#78350f" />
            </linearGradient>
            <linearGradient id="p5_steel" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#475569" />
              <stop offset="50%" stop-color="#ffffff" />
              <stop offset="100%" stop-color="#334155" />
            </linearGradient>
            <filter id="p5_shadow">
              <feDropShadow dx="0" dy="10" stdDeviation="12" flood-color="#000" flood-opacity="0.85" />
            </filter>
          </defs>
          <rect width="400" height="300" fill="url(#p5_bg)" />
          <circle cx="200" cy="140" r="110" fill="#f59e0b" opacity="0.15" />

          <g transform="translate(16, 14)">
            <rect width="180" height="24" rx="12" fill="#000" fill-opacity="0.85" stroke="#f59e0b" stroke-width="1.2" />
            <circle cx="16" cy="12" r="4" fill="#fbbf24" />
            <text x="98" y="15.5" text-anchor="middle" fill="#fef08a" font-family="sans-serif" font-size="7.5" font-weight="900">TUNGSTEN CARBIDE ROTARY</text>
          </g>
          <g transform="translate(265, 14)">
            <rect width="119" height="24" rx="12" fill="#000" fill-opacity="0.85" stroke="#f59e0b" stroke-width="1.2" />
            <text x="59.5" y="15.5" text-anchor="middle" fill="#fef08a" font-family="monospace" font-size="7.5" font-weight="900">HIGH RPM</text>
          </g>

          <g transform="translate(200, 138)" filter="url(#p5_shadow)">
            <circle cx="0" cy="0" r="90" fill="url(#p5_steel)" stroke="#fef08a" stroke-width="1.8" />
            <circle cx="0" cy="0" r="84" fill="none" stroke="#94a3b8" stroke-dasharray="5 4" stroke-width="1.5" />
            <circle cx="0" cy="0" r="76" fill="url(#p5_gold)" opacity="0.95" />
            <circle cx="0" cy="0" r="50" fill="#1e293b" stroke="#ca8a04" stroke-width="1.8" />
            <circle cx="0" cy="0" r="18" fill="#0f0b01" stroke="#64748b" stroke-width="1.5" />
            <circle cx="-30" cy="0" r="4.5" fill="#0f0b01" />
            <circle cx="30" cy="0" r="4.5" fill="#0f0b01" />
            <circle cx="0" cy="-30" r="4.5" fill="#0f0b01" />
            <circle cx="0" cy="30" r="4.5" fill="#0f0b01" />
            <text x="0" y="3" text-anchor="middle" fill="#fef08a" font-family="monospace" font-size="7" font-weight="900">AKM ROTARY</text>
          </g>

          <rect x="16" y="246" width="368" height="38" rx="10" fill="#000" fill-opacity="0.88" stroke="#f59e0b" stroke-width="1" />
          <text x="30" y="263" fill="#fbbf24" font-family="monospace" font-size="9.5" font-weight="bold">AKM INDUSTRIAL TUNGSTEN ROTARY SLITTER</text>
          <text x="30" y="276" fill="#94a3b8" font-family="sans-serif" font-size="8.5">AKM BLADE DIVISION • DAILY DIVIDEND ₹5,500 • 50 DAYS</text>
          <rect x="272" y="253" width="100" height="24" rx="6" fill="#b45309" />
          <text x="322" y="269" text-anchor="middle" fill="#ffffff" font-family="monospace" font-size="9" font-weight="900">₹5,500 / DAY</text>
        </svg>
      `)}`;

    // Special 2-Day Return: 24K Gold Mirror Razor Blade
    case 'plan-special-1':
      return `data:image/svg+xml;utf8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
          <defs>
            <linearGradient id="sp_bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#140a00" />
              <stop offset="50%" stop-color="#2d1702" />
              <stop offset="100%" stop-color="#0a0500" />
            </linearGradient>
            <linearGradient id="sp_gold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#fffbeb" />
              <stop offset="25%" stop-color="#fde047" />
              <stop offset="60%" stop-color="#eab308" />
              <stop offset="85%" stop-color="#ca8a04" />
              <stop offset="100%" stop-color="#78350f" />
            </linearGradient>
            <filter id="sp_shadow">
              <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#000" flood-opacity="0.9" />
            </filter>
          </defs>
          <rect width="400" height="300" fill="url(#sp_bg)" />
          <circle cx="200" cy="140" r="130" fill="#f59e0b" opacity="0.2" />

          <g transform="translate(16, 14)">
            <rect width="180" height="24" rx="12" fill="#000" fill-opacity="0.9" stroke="#facc15" stroke-width="1.4" />
            <circle cx="16" cy="12" r="4" fill="#fde047" />
            <text x="98" y="15.5" text-anchor="middle" fill="#fef08a" font-family="sans-serif" font-size="7.5" font-weight="900">2-DAY FAST BLADE RETURN</text>
          </g>
          <g transform="translate(265, 14)">
            <rect width="119" height="24" rx="12" fill="#000" fill-opacity="0.9" stroke="#facc15" stroke-width="1.4" />
            <text x="59.5" y="15.5" text-anchor="middle" fill="#fef08a" font-family="monospace" font-size="7.5" font-weight="900">1,209% PROFIT</text>
          </g>

          <g transform="translate(200, 138) rotate(-9)" filter="url(#sp_shadow)">
            <path d="M -140,-58 L -132,-58 L -124,-51 L -124,-61 L 124,-61 L 124,-51 L 132,-58 L 140,-58 Q 148,-58 148,-48 L 148,48 Q 148,58 140,58 L 132,58 L 124,51 L 124,61 L -124,61 L -124,51 L -132,58 L -140,58 Q -148,58 -148,48 L -148,-48 Q -148,-58 -140,-58 Z" fill="url(#sp_gold)" stroke="#fffbeb" stroke-width="2" />
            <polygon points="-124,-61 124,-61 118,-54 -118,-54" fill="#ffffff" opacity="0.9" />
            <line x1="-124" y1="-61" x2="124" y2="-61" stroke="#ffffff" stroke-width="1.5" />
            <line x1="-50" y1="-61" x2="50" y2="-61" stroke="#fef08a" stroke-width="2.5" />
            <polygon points="-124,61 124,61 118,54 -118,54" fill="#ffffff" opacity="0.9" />
            <line x1="-124" y1="61" x2="124" y2="61" stroke="#ffffff" stroke-width="1.5" />
            <line x1="-50" y1="61" x2="50" y2="61" stroke="#fef08a" stroke-width="2.5" />

            <g fill="#0a0500" stroke="#ca8a04" stroke-width="1.2">
              <rect x="-85" y="-6" width="170" height="12" rx="6" />
              <circle cx="0" cy="0" r="16" fill="#0a0500" stroke="#eab308" stroke-width="1.5" />
              <circle cx="-65" cy="0" r="9" fill="#0a0500" />
              <circle cx="65" cy="0" r="9" fill="#0a0500" />
              <rect x="-115" y="-40" width="10" height="18" rx="2" />
              <rect x="105" y="-40" width="10" height="18" rx="2" />
              <rect x="-115" y="22" width="10" height="18" rx="2" />
              <rect x="105" y="22" width="10" height="18" rx="2" />
            </g>
            <polygon points="-90,-61 -50,-61 90,61 50,61" fill="#ffffff" opacity="0.3" />
            <text x="0" y="-22" text-anchor="middle" fill="#451a03" font-family="'Courier New', monospace" font-size="11" font-weight="900" letter-spacing="2">AKM 24K GOLD BLADE</text>
            <text x="0" y="-12" text-anchor="middle" fill="#78350f" font-family="sans-serif" font-size="6" font-weight="800">LIMITED SPECIAL RETURN • 48H</text>
            <text x="0" y="28" text-anchor="middle" fill="#451a03" font-family="'Courier New', monospace" font-size="9.5" font-weight="900" letter-spacing="1.5">AKM ENTERPRISES</text>
            <text x="0" y="38" text-anchor="middle" fill="#b45309" font-family="sans-serif" font-size="5.5" font-weight="800">TOTAL RETURN: ₹8,708</text>
          </g>

          <rect x="16" y="246" width="368" height="38" rx="10" fill="#000" fill-opacity="0.9" stroke="#facc15" stroke-width="1" />
          <text x="30" y="263" fill="#fde047" font-family="monospace" font-size="9.5" font-weight="bold">24K GOLD MIRROR RAZOR BLADE</text>
          <text x="30" y="276" fill="#94a3b8" font-family="sans-serif" font-size="8.5">DEPOSIT ₹720 • EARN ₹8,708 IN 48 HOURS (2 DAYS)</text>
          <rect x="272" y="253" width="100" height="24" rx="6" fill="#ca8a04" />
          <text x="322" y="269" text-anchor="middle" fill="#ffffff" font-family="monospace" font-size="9" font-weight="900">₹8,708 TOTAL</text>
        </svg>
      `)}`;

    // =========================================================================
    // 2. TURBO PLANS (8 Completely Unique Models)
    // =========================================================================

    // Turbo 1m: White Ceramic Zirconia Razor Blade
    case 'plan-turbo-1m':
      return `data:image/svg+xml;utf8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
          <defs>
            <linearGradient id="t1_bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#020914" />
              <stop offset="50%" stop-color="#051933" />
              <stop offset="100%" stop-color="#01060e" />
            </linearGradient>
            <linearGradient id="t1_ceramic" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#e2e8f0" />
              <stop offset="40%" stop-color="#ffffff" />
              <stop offset="70%" stop-color="#f8fafc" />
              <stop offset="100%" stop-color="#cbd5e1" />
            </linearGradient>
            <filter id="t1_shadow"><feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="#000" flood-opacity="0.8" /></filter>
          </defs>
          <rect width="400" height="300" fill="url(#t1_bg)" />
          <circle cx="200" cy="140" r="100" fill="#38bdf8" opacity="0.1" />

          <g transform="translate(16, 14)">
            <rect width="170" height="24" rx="12" fill="#000" fill-opacity="0.85" stroke="#38bdf8" stroke-width="1.2" />
            <circle cx="16" cy="12" r="4" fill="#38bdf8" />
            <text x="92" y="15.5" text-anchor="middle" fill="#7dd3fc" font-family="sans-serif" font-size="7.5" font-weight="900">WHITE CERAMIC ZrO2</text>
          </g>
          <g transform="translate(265, 14)">
            <rect width="119" height="24" rx="12" fill="#000" fill-opacity="0.85" stroke="#f59e0b" stroke-width="1.2" />
            <text x="59.5" y="15.5" text-anchor="middle" fill="#fef08a" font-family="monospace" font-size="7.5" font-weight="900">1 MIN FLASH</text>
          </g>

          <!-- White Ceramic Blade Object -->
          <g transform="translate(200, 138) rotate(-7)" filter="url(#t1_shadow)">
            <rect x="-135" y="-55" width="270" height="110" rx="8" fill="url(#t1_ceramic)" stroke="#38bdf8" stroke-width="1.5" />
            <!-- Polished Beveled Edges -->
            <polygon points="-120,-55 120,-55 112,-48 -112,-48" fill="#38bdf8" opacity="0.8" />
            <polygon points="-120,55 120,55 112,48 -112,48" fill="#38bdf8" opacity="0.8" />
            <circle cx="0" cy="0" r="18" fill="#051933" stroke="#38bdf8" stroke-width="1.5" />
            <rect x="-70" y="-7" width="140" height="14" rx="7" fill="#051933" stroke="#38bdf8" stroke-width="1.2" />
            <text x="0" y="-22" text-anchor="middle" fill="#0f172a" font-family="'Courier New', monospace" font-size="10" font-weight="900">ZIRCONIA CERAMIC BLADE</text>
            <text x="0" y="28" text-anchor="middle" fill="#0284c7" font-family="sans-serif" font-size="6" font-weight="800">NON-METALLIC DIAMOND HONED</text>
          </g>

          <rect x="16" y="246" width="368" height="38" rx="10" fill="#000" fill-opacity="0.88" stroke="#38bdf8" stroke-width="1" />
          <text x="30" y="263" fill="#38bdf8" font-family="monospace" font-size="9.5" font-weight="bold">1 MIN WHITE CERAMIC RAZOR BLADE</text>
          <text x="30" y="276" fill="#94a3b8" font-family="sans-serif" font-size="8.5">1 MINUTE SPEED • INSTANT AUTOMATED PAYOUT</text>
          <rect x="272" y="253" width="100" height="24" rx="6" fill="#0284c7" />
          <text x="322" y="269" text-anchor="middle" fill="#ffffff" font-family="monospace" font-size="9" font-weight="900">1 MIN SETTLE</text>
        </svg>
      `)}`;

    // Turbo 3m: Black Stealth Obsidian DLC Razor Blade
    case 'plan-turbo-3m':
      return `data:image/svg+xml;utf8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
          <defs>
            <linearGradient id="t3_bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#0f0203" />
              <stop offset="50%" stop-color="#260408" />
              <stop offset="100%" stop-color="#0a0102" />
            </linearGradient>
            <linearGradient id="t3_dlc" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#18181b" />
              <stop offset="50%" stop-color="#27272a" />
              <stop offset="100%" stop-color="#09090b" />
            </linearGradient>
            <filter id="t3_shadow"><feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="#000" flood-opacity="0.9" /></filter>
          </defs>
          <rect width="400" height="300" fill="url(#t3_bg)" />
          <circle cx="200" cy="140" r="100" fill="#ef4444" opacity="0.12" />

          <g transform="translate(16, 14)">
            <rect width="170" height="24" rx="12" fill="#000" fill-opacity="0.85" stroke="#ef4444" stroke-width="1.2" />
            <circle cx="16" cy="12" r="4" fill="#f87171" />
            <text x="92" y="15.5" text-anchor="middle" fill="#fca5a5" font-family="sans-serif" font-size="7.5" font-weight="900">STEALTH DLC OBSIDIAN</text>
          </g>
          <g transform="translate(265, 14)">
            <rect width="119" height="24" rx="12" fill="#000" fill-opacity="0.85" stroke="#f59e0b" stroke-width="1.2" />
            <text x="59.5" y="15.5" text-anchor="middle" fill="#fef08a" font-family="monospace" font-size="7.5" font-weight="900">3 MIN TURBO</text>
          </g>

          <!-- Black DLC Stealth Blade Object with Red Crimson Edge -->
          <g transform="translate(200, 138) rotate(-11)" filter="url(#t3_shadow)">
            <rect x="-135" y="-55" width="270" height="110" rx="8" fill="url(#t3_dlc)" stroke="#3f3f46" stroke-width="1.5" />
            <!-- Crimson Red Laser Cutting Edge -->
            <line x1="-125" y1="-55" x2="125" y2="-55" stroke="#ef4444" stroke-width="2.5" />
            <line x1="-125" y1="55" x2="125" y2="55" stroke="#ef4444" stroke-width="2.5" />
            <rect x="-70" y="-7" width="140" height="14" rx="7" fill="#000" stroke="#ef4444" stroke-width="1" />
            <circle cx="0" cy="0" r="16" fill="#000" stroke="#ef4444" stroke-width="1.2" />
            <text x="0" y="-22" text-anchor="middle" fill="#f43f5e" font-family="'Courier New', monospace" font-size="10" font-weight="900">DLC OBSIDIAN BLACK</text>
            <text x="0" y="28" text-anchor="middle" fill="#a1a1aa" font-family="sans-serif" font-size="6" font-weight="800">DIAMOND-LIKE CARBON COATING</text>
          </g>

          <rect x="16" y="246" width="368" height="38" rx="10" fill="#000" fill-opacity="0.88" stroke="#ef4444" stroke-width="1" />
          <text x="30" y="263" fill="#fca5a5" font-family="monospace" font-size="9.5" font-weight="bold">3 MIN OBSIDIAN DLC RAZOR BLADE</text>
          <text x="30" y="276" fill="#94a3b8" font-family="sans-serif" font-size="8.5">3 MINUTE HARVEST • CRIMSON HARDENED EDGE</text>
          <rect x="272" y="253" width="100" height="24" rx="6" fill="#b91c1c" />
          <text x="322" y="269" text-anchor="middle" fill="#ffffff" font-family="monospace" font-size="9" font-weight="900">3 MIN SETTLE</text>
        </svg>
      `)}`;

    // Turbo 5m: Feather Hairdresser Thinning Comb Blade
    case 'plan-turbo-5m':
      return `data:image/svg+xml;utf8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
          <defs>
            <linearGradient id="t5_bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#14061a" />
              <stop offset="50%" stop-color="#2a0d36" />
              <stop offset="100%" stop-color="#0d0412" />
            </linearGradient>
            <linearGradient id="t5_steel" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#64748b" />
              <stop offset="50%" stop-color="#ffffff" />
              <stop offset="100%" stop-color="#94a3b8" />
            </linearGradient>
            <filter id="t5_shadow"><feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="#000" flood-opacity="0.85" /></filter>
          </defs>
          <rect width="400" height="300" fill="url(#t5_bg)" />
          <circle cx="200" cy="140" r="100" fill="#c084fc" opacity="0.12" />

          <g transform="translate(16, 14)">
            <rect width="175" height="24" rx="12" fill="#000" fill-opacity="0.85" stroke="#c084fc" stroke-width="1.2" />
            <circle cx="16" cy="12" r="4" fill="#c084fc" />
            <text x="95" y="15.5" text-anchor="middle" fill="#e9d5ff" font-family="sans-serif" font-size="7.5" font-weight="900">FEATHER STYLING COMB</text>
          </g>
          <g transform="translate(265, 14)">
            <rect width="119" height="24" rx="12" fill="#000" fill-opacity="0.85" stroke="#f59e0b" stroke-width="1.2" />
            <text x="59.5" y="15.5" text-anchor="middle" fill="#fef08a" font-family="monospace" font-size="7.5" font-weight="900">5 MIN HARVEST</text>
          </g>

          <!-- Feather Styling Blade Object with 3 Large Holes and Comb Teeth -->
          <g transform="translate(200, 138) rotate(-6)" filter="url(#t5_shadow)">
            <rect x="-140" y="-50" width="280" height="100" rx="6" fill="url(#t5_steel)" stroke="#cbd5e1" stroke-width="1.5" />
            <!-- Comb Teeth along top spine -->
            <g fill="#2a0d36">
              <rect x="-130" y="-50" width="8" height="18" rx="2" />
              <rect x="-105" y="-50" width="8" height="18" rx="2" />
              <rect x="-80" y="-50" width="8" height="18" rx="2" />
              <rect x="-55" y="-50" width="8" height="18" rx="2" />
              <rect x="-30" y="-50" width="8" height="18" rx="2" />
              <rect x="-5" y="-50" width="8" height="18" rx="2" />
              <rect x="20" y="-50" width="8" height="18" rx="2" />
              <rect x="45" y="-50" width="8" height="18" rx="2" />
              <rect x="70" y="-50" width="8" height="18" rx="2" />
              <rect x="95" y="-50" width="8" height="18" rx="2" />
              <rect x="120" y="-50" width="8" height="18" rx="2" />
            </g>
            <!-- 3 Large Center Locking Holes -->
            <circle cx="-80" cy="10" r="16" fill="#2a0d36" stroke="#c084fc" stroke-width="1.5" />
            <circle cx="0" cy="10" r="16" fill="#2a0d36" stroke="#c084fc" stroke-width="1.5" />
            <circle cx="80" cy="10" r="16" fill="#2a0d36" stroke="#c084fc" stroke-width="1.5" />
            <!-- Razor Edge along bottom -->
            <line x1="-135" y1="50" x2="135" y2="50" stroke="#ffffff" stroke-width="2.5" />
            <text x="0" y="-18" text-anchor="middle" fill="#581c87" font-family="'Courier New', monospace" font-size="9" font-weight="900">FEATHER STYLING RAZOR</text>
          </g>

          <rect x="16" y="246" width="368" height="38" rx="10" fill="#000" fill-opacity="0.88" stroke="#c084fc" stroke-width="1" />
          <text x="30" y="263" fill="#e9d5ff" font-family="monospace" font-size="9.5" font-weight="bold">5 MIN FEATHER SALON COMB BLADE</text>
          <text x="30" y="276" fill="#94a3b8" font-family="sans-serif" font-size="8.5">5 MINUTE RETURN • PRECISION JAPANESE SALON STEEL</text>
          <rect x="272" y="253" width="100" height="24" rx="6" fill="#7e22ce" />
          <text x="322" y="269" text-anchor="middle" fill="#ffffff" font-family="monospace" font-size="9" font-weight="900">5 MIN SETTLE</text>
        </svg>
      `)}`;

    // Turbo 10m: Single-Edge Gem Industrial Scraper Blade
    case 'plan-turbo-10m':
      return `data:image/svg+xml;utf8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
          <defs>
            <linearGradient id="t10_bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#02141a" />
              <stop offset="50%" stop-color="#072733" />
              <stop offset="100%" stop-color="#010f14" />
            </linearGradient>
            <linearGradient id="t10_spine" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#475569" />
              <stop offset="50%" stop-color="#94a3b8" />
              <stop offset="100%" stop-color="#334155" />
            </linearGradient>
            <filter id="t10_shadow"><feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="#000" flood-opacity="0.85" /></filter>
          </defs>
          <rect width="400" height="300" fill="url(#t10_bg)" />
          <circle cx="200" cy="140" r="100" fill="#38bdf8" opacity="0.12" />

          <g transform="translate(16, 14)">
            <rect width="180" height="24" rx="12" fill="#000" fill-opacity="0.85" stroke="#38bdf8" stroke-width="1.2" />
            <circle cx="16" cy="12" r="4" fill="#38bdf8" />
            <text x="98" y="15.5" text-anchor="middle" fill="#7dd3fc" font-family="sans-serif" font-size="7.5" font-weight="900">SINGLE-EDGE GEM BLADE</text>
          </g>
          <g transform="translate(265, 14)">
            <rect width="119" height="24" rx="12" fill="#000" fill-opacity="0.85" stroke="#f59e0b" stroke-width="1.2" />
            <text x="59.5" y="15.5" text-anchor="middle" fill="#fef08a" font-family="monospace" font-size="7.5" font-weight="900">10 MIN SPEED</text>
          </g>

          <!-- Single Edge Scraper Blade with Folded Aluminum Spine -->
          <g transform="translate(200, 138) rotate(-8)" filter="url(#t10_shadow)">
            <!-- Flat Steel Blade -->
            <rect x="-130" y="-30" width="260" height="85" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.2" />
            <!-- Folded Steel Backing Spine on Top -->
            <rect x="-135" y="-55" width="270" height="28" rx="4" fill="url(#t10_spine)" stroke="#cbd5e1" stroke-width="1.5" />
            <!-- Cutout Side Notches -->
            <polygon points="-130,-15 -115,-7 -130,0" fill="#072733" />
            <polygon points="130,-15 115,-7 130,0" fill="#072733" />
            <!-- Single Razor Beveled Edge along bottom -->
            <polygon points="-125,55 125,55 120,45 -120,45" fill="#38bdf8" opacity="0.9" />
            <line x1="-125" y1="55" x2="125" y2="55" stroke="#ffffff" stroke-width="2.5" />
            <text x="0" y="-37" text-anchor="middle" fill="#ffffff" font-family="'Courier New', monospace" font-size="10" font-weight="900">GEM HEAVY-DUTY STEEL</text>
            <text x="0" y="20" text-anchor="middle" fill="#0f172a" font-family="sans-serif" font-size="8" font-weight="800">0.009" INDUSTRIAL RIGID</text>
          </g>

          <rect x="16" y="246" width="368" height="38" rx="10" fill="#000" fill-opacity="0.88" stroke="#38bdf8" stroke-width="1" />
          <text x="30" y="263" fill="#7dd3fc" font-family="monospace" font-size="9.5" font-weight="bold">10 MIN SINGLE-EDGE GEM SCRAPER BLADE</text>
          <text x="30" y="276" fill="#94a3b8" font-family="sans-serif" font-size="8.5">10 MINUTE RAPID ACCUMULATION • RIGID REINFORCED SPINE</text>
          <rect x="272" y="253" width="100" height="24" rx="6" fill="#0369a1" />
          <text x="322" y="269" text-anchor="middle" fill="#ffffff" font-family="monospace" font-size="9" font-weight="900">10 MIN SETTLE</text>
        </svg>
      `)}`;

    // Turbo 15m: 18mm Multi-Segment Snap-Off Cutter Blade
    case 'plan-turbo-15m':
      return `data:image/svg+xml;utf8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
          <defs>
            <linearGradient id="t15_bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#141101" />
              <stop offset="50%" stop-color="#2a2403" />
              <stop offset="100%" stop-color="#0d0b00" />
            </linearGradient>
            <linearGradient id="t15_steel" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#cbd5e1" />
              <stop offset="50%" stop-color="#ffffff" />
              <stop offset="100%" stop-color="#94a3b8" />
            </linearGradient>
            <filter id="t15_shadow"><feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="#000" flood-opacity="0.85" /></filter>
          </defs>
          <rect width="400" height="300" fill="url(#t15_bg)" />
          <circle cx="200" cy="140" r="100" fill="#eab308" opacity="0.12" />

          <g transform="translate(16, 14)">
            <rect width="180" height="24" rx="12" fill="#000" fill-opacity="0.85" stroke="#eab308" stroke-width="1.2" />
            <circle cx="16" cy="12" r="4" fill="#facc15" />
            <text x="98" y="15.5" text-anchor="middle" fill="#fef08a" font-family="sans-serif" font-size="7.5" font-weight="900">18mm SNAP-OFF SEGMENT</text>
          </g>
          <g transform="translate(265, 14)">
            <rect width="119" height="24" rx="12" fill="#000" fill-opacity="0.85" stroke="#f59e0b" stroke-width="1.2" />
            <text x="59.5" y="15.5" text-anchor="middle" fill="#fef08a" font-family="monospace" font-size="7.5" font-weight="900">15 MIN RETURN</text>
          </g>

          <!-- 18mm 8-Segment Snap-Off Blade with Diagonal Score Lines -->
          <g transform="translate(200, 138) rotate(-13)" filter="url(#t15_shadow)">
            <polygon points="-140,-35 140,-35 120,35 -140,35" fill="url(#t15_steel)" stroke="#94a3b8" stroke-width="1.5" />
            <!-- Diagonal Pre-scored Fracture Lines -->
            <line x1="-100" y1="-35" x2="-120" y2="35" stroke="#475569" stroke-width="1.5" stroke-dasharray="4 2" />
            <line x1="-60" y1="-35" x2="-80" y2="35" stroke="#475569" stroke-width="1.5" stroke-dasharray="4 2" />
            <line x1="-20" y1="-35" x2="-40" y2="35" stroke="#475569" stroke-width="1.5" stroke-dasharray="4 2" />
            <line x1="20" y1="-35" x2="0" y2="35" stroke="#475569" stroke-width="1.5" stroke-dasharray="4 2" />
            <line x1="60" y1="-35" x2="40" y2="35" stroke="#475569" stroke-width="1.5" stroke-dasharray="4 2" />
            <line x1="100" y1="-35" x2="80" y2="35" stroke="#475569" stroke-width="1.5" stroke-dasharray="4 2" />
            <!-- Round Hole on Left End -->
            <circle cx="-125" cy="0" r="9" fill="#2a2403" stroke="#64748b" stroke-width="1.2" />
            <!-- Sharp Ground Cutting Edge along bottom -->
            <line x1="-140" y1="35" x2="120" y2="35" stroke="#eab308" stroke-width="2.5" />
            <text x="0" y="-12" text-anchor="middle" fill="#713f12" font-family="'Courier New', monospace" font-size="9.5" font-weight="900">8-SEGMENT SK-2 CARBON STEEL</text>
          </g>

          <rect x="16" y="246" width="368" height="38" rx="10" fill="#000" fill-opacity="0.88" stroke="#eab308" stroke-width="1" />
          <text x="30" y="263" fill="#facc15" font-family="monospace" font-size="9.5" font-weight="bold">15 MIN SNAP-OFF UTILITY CUTTER BLADE</text>
          <text x="30" y="276" fill="#94a3b8" font-family="sans-serif" font-size="8.5">15 MINUTE CYCLE • 8 HIGH-CARBON SNAP-OFF SEGMENTS</text>
          <rect x="272" y="253" width="100" height="24" rx="6" fill="#ca8a04" />
          <text x="322" y="269" text-anchor="middle" fill="#ffffff" font-family="monospace" font-size="9" font-weight="900">15 MIN SETTLE</text>
        </svg>
      `)}`;

    // Turbo 30m: Dual-Talon Hook Roofing & Carpet Blade
    case 'plan-turbo-30m':
      return `data:image/svg+xml;utf8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
          <defs>
            <linearGradient id="t30_bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#0a141a" />
              <stop offset="50%" stop-color="#112936" />
              <stop offset="100%" stop-color="#060c10" />
            </linearGradient>
            <linearGradient id="t30_steel" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#64748b" />
              <stop offset="50%" stop-color="#ffffff" />
              <stop offset="100%" stop-color="#475569" />
            </linearGradient>
            <filter id="t30_shadow"><feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="#000" flood-opacity="0.85" /></filter>
          </defs>
          <rect width="400" height="300" fill="url(#t30_bg)" />
          <circle cx="200" cy="140" r="100" fill="#0ea5e9" opacity="0.12" />

          <g transform="translate(16, 14)">
            <rect width="180" height="24" rx="12" fill="#000" fill-opacity="0.85" stroke="#0ea5e9" stroke-width="1.2" />
            <circle cx="16" cy="12" r="4" fill="#38bdf8" />
            <text x="98" y="15.5" text-anchor="middle" fill="#7dd3fc" font-family="sans-serif" font-size="7.5" font-weight="900">DUAL TALON HOOK BLADE</text>
          </g>
          <g transform="translate(265, 14)">
            <rect width="119" height="24" rx="12" fill="#000" fill-opacity="0.85" stroke="#f59e0b" stroke-width="1.2" />
            <text x="59.5" y="15.5" text-anchor="middle" fill="#fef08a" font-family="monospace" font-size="7.5" font-weight="900">30 MIN CHARGE</text>
          </g>

          <!-- Dual Talon Hook Blade Object -->
          <g transform="translate(200, 138) rotate(-9)" filter="url(#t30_shadow)">
            <path d="M -120,-45 C -140,-45 -145,-15 -145,10 C -145,25 -135,35 -125,35 C -135,20 -130,-10 -110,-15 L -60,-15 L -60,25 L 60,25 L 60,-15 L 110,-15 C 130,-10 135,20 125,35 C 135,35 145,25 145,10 C 145,-15 140,-45 120,-45 Z" fill="url(#t30_steel)" stroke="#cbd5e1" stroke-width="1.5" />
            <!-- Mounting Holes -->
            <rect x="-35" y="-35" width="16" height="18" rx="2" fill="#112936" />
            <rect x="19" y="-35" width="16" height="18" rx="2" fill="#112936" />
            <!-- Sharpened Curved Inner Hooks -->
            <path d="M -145,10 C -135,20 -130,-10 -110,-15" stroke="#0ea5e9" stroke-width="2.5" fill="none" />
            <path d="M 145,10 C 135,20 130,-10 110,-15" stroke="#0ea5e9" stroke-width="2.5" fill="none" />
            <text x="0" y="5" text-anchor="middle" fill="#0f172a" font-family="'Courier New', monospace" font-size="9" font-weight="900">ROOFING TALON HOOK</text>
          </g>

          <rect x="16" y="246" width="368" height="38" rx="10" fill="#000" fill-opacity="0.88" stroke="#0ea5e9" stroke-width="1" />
          <text x="30" y="263" fill="#7dd3fc" font-family="monospace" font-size="9.5" font-weight="bold">30 MIN DUAL-TALON HOOK BLADE</text>
          <text x="30" y="276" fill="#94a3b8" font-family="sans-serif" font-size="8.5">30 MINUTE RAPID SETTLEMENT • HEAVY CARPET TALON</text>
          <rect x="272" y="253" width="100" height="24" rx="6" fill="#0284c7" />
          <text x="322" y="269" text-anchor="middle" fill="#ffffff" font-family="monospace" font-size="9" font-weight="900">30 MIN SETTLE</text>
        </svg>
      `)}`;

    // Turbo 45m: Cut-Throat Barber Straight Razor Blade
    case 'plan-turbo-45m':
      return `data:image/svg+xml;utf8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
          <defs>
            <linearGradient id="t45_bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#140b01" />
              <stop offset="50%" stop-color="#2a1603" />
              <stop offset="100%" stop-color="#0a0500" />
            </linearGradient>
            <linearGradient id="t45_steel" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#475569" />
              <stop offset="40%" stop-color="#f8fafc" />
              <stop offset="80%" stop-color="#cbd5e1" />
              <stop offset="100%" stop-color="#334155" />
            </linearGradient>
            <filter id="t45_shadow"><feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="#000" flood-opacity="0.85" /></filter>
          </defs>
          <rect width="400" height="300" fill="url(#t45_bg)" />
          <circle cx="200" cy="140" r="100" fill="#f59e0b" opacity="0.12" />

          <g transform="translate(16, 14)">
            <rect width="180" height="24" rx="12" fill="#000" fill-opacity="0.85" stroke="#f59e0b" stroke-width="1.2" />
            <circle cx="16" cy="12" r="4" fill="#fbbf24" />
            <text x="98" y="15.5" text-anchor="middle" fill="#fef08a" font-family="sans-serif" font-size="7.5" font-weight="900">BARBER STRAIGHT RAZOR</text>
          </g>
          <g transform="translate(265, 14)">
            <rect width="119" height="24" rx="12" fill="#000" fill-opacity="0.85" stroke="#f59e0b" stroke-width="1.2" />
            <text x="59.5" y="15.5" text-anchor="middle" fill="#fef08a" font-family="monospace" font-size="7.5" font-weight="900">45 MIN ELITE</text>
          </g>

          <!-- Straight Razor Hollow-Ground Blade with Monkey Tail Tang -->
          <g transform="translate(200, 138) rotate(-7)" filter="url(#t45_shadow)">
            <!-- Main Blade Profile -->
            <path d="M -130,-40 L 70,-40 Q 110,-40 120,-10 L 120,40 L -60,40 Q -100,40 -120,10 L -140,25 Q -155,30 -160,20 Q -160,10 -145,-10 Z" fill="url(#t45_steel)" stroke="#cbd5e1" stroke-width="1.5" />
            <!-- Hollow Grind Ridge Line -->
            <line x1="-120" y1="-10" x2="110" y2="-10" stroke="#94a3b8" stroke-width="1.5" />
            <!-- Jimps / Serrations on Tang -->
            <line x1="-135" y1="-30" x2="-135" y2="-20" stroke="#475569" stroke-width="1" />
            <line x1="-130" y1="-30" x2="-130" y2="-20" stroke="#475569" stroke-width="1" />
            <line x1="-125" y1="-30" x2="-125" y2="-20" stroke="#475569" stroke-width="1" />
            <!-- Pivot Pin Hole -->
            <circle cx="-135" cy="5" r="4.5" fill="#2a1603" stroke="#f59e0b" stroke-width="1.2" />
            <!-- Razor Edge along bottom -->
            <line x1="-60" y1="40" x2="120" y2="40" stroke="#ffffff" stroke-width="2.5" />
            <text x="15" y="-22" text-anchor="middle" fill="#0f172a" font-family="'Courier New', monospace" font-size="9" font-weight="900">SOLINGEN HOLLOW GROUND</text>
            <text x="15" y="15" text-anchor="middle" fill="#475569" font-family="sans-serif" font-size="6.5" font-weight="800">CLASSIC CUT-THROAT SHAVETTE</text>
          </g>

          <rect x="16" y="246" width="368" height="38" rx="10" fill="#000" fill-opacity="0.88" stroke="#f59e0b" stroke-width="1" />
          <text x="30" y="263" fill="#fbbf24" font-family="monospace" font-size="9.5" font-weight="bold">45 MIN CUT-THROAT STRAIGHT RAZOR BLADE</text>
          <text x="30" y="276" fill="#94a3b8" font-family="sans-serif" font-size="8.5">45 MINUTE PREMIUM RETURN • HOLLOW GROUND GERMAN CRAFT</text>
          <rect x="272" y="253" width="100" height="24" rx="6" fill="#b45309" />
          <text x="322" y="269" text-anchor="middle" fill="#ffffff" font-family="monospace" font-size="9" font-weight="900">45 MIN SETTLE</text>
        </svg>
      `)}`;

    // Turbo 60m: Heavy Industrial Guillotine Shear Machine Blade
    case 'plan-turbo-60m':
      return `data:image/svg+xml;utf8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
          <defs>
            <linearGradient id="t60_bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#02140d" />
              <stop offset="50%" stop-color="#062e1d" />
              <stop offset="100%" stop-color="#010a06" />
            </linearGradient>
            <linearGradient id="t60_steel" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#334155" />
              <stop offset="50%" stop-color="#f8fafc" />
              <stop offset="100%" stop-color="#1e293b" />
            </linearGradient>
            <filter id="t60_shadow"><feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="#000" flood-opacity="0.85" /></filter>
          </defs>
          <rect width="400" height="300" fill="url(#t60_bg)" />
          <circle cx="200" cy="140" r="100" fill="#10b981" opacity="0.12" />

          <g transform="translate(16, 14)">
            <rect width="180" height="24" rx="12" fill="#000" fill-opacity="0.85" stroke="#10b981" stroke-width="1.2" />
            <circle cx="16" cy="12" r="4" fill="#34d399" />
            <text x="98" y="15.5" text-anchor="middle" fill="#6ee7b7" font-family="sans-serif" font-size="7.5" font-weight="900">GUILLOTINE SHEAR BAR</text>
          </g>
          <g transform="translate(265, 14)">
            <rect width="119" height="24" rx="12" fill="#000" fill-opacity="0.85" stroke="#f59e0b" stroke-width="1.2" />
            <text x="59.5" y="15.5" text-anchor="middle" fill="#fef08a" font-family="monospace" font-size="7.5" font-weight="900">60 MIN TITAN</text>
          </g>

          <!-- Heavy Industrial Guillotine Shear Bar with 4 Hex Bolts -->
          <g transform="translate(200, 138) rotate(-7)" filter="url(#t60_shadow)">
            <polygon points="-145,-50 145,-50 135,45 -145,45" fill="url(#t60_steel)" stroke="#cbd5e1" stroke-width="2" />
            <!-- 4 Heavy Industrial Hex Bolts -->
            <circle cx="-100" cy="-15" r="9" fill="#1e293b" stroke="#94a3b8" stroke-width="1.5" />
            <circle cx="-35" cy="-15" r="9" fill="#1e293b" stroke="#94a3b8" stroke-width="1.5" />
            <circle cx="35" cy="-15" r="9" fill="#1e293b" stroke="#94a3b8" stroke-width="1.5" />
            <circle cx="100" cy="-15" r="9" fill="#1e293b" stroke="#94a3b8" stroke-width="1.5" />
            <!-- Heavy Beveled Shear Cutting Edge along bottom -->
            <polygon points="-145,45 135,45 125,32 -135,32" fill="#10b981" opacity="0.9" />
            <line x1="-145" y1="45" x2="135" y2="45" stroke="#ffffff" stroke-width="3" />
            <text x="0" y="-32" text-anchor="middle" fill="#0f172a" font-family="'Courier New', monospace" font-size="10" font-weight="900">D2 TOOL STEEL GUILLOTINE</text>
            <text x="0" y="15" text-anchor="middle" fill="#10b981" font-family="sans-serif" font-size="7" font-weight="800">HEAVY INDUSTRIAL HYDRAULIC SHEAR</text>
          </g>

          <rect x="16" y="246" width="368" height="38" rx="10" fill="#000" fill-opacity="0.88" stroke="#10b981" stroke-width="1" />
          <text x="30" y="263" fill="#34d399" font-family="monospace" font-size="9.5" font-weight="bold">60 MIN ROTARY GUILLOTINE SHEAR MASTER</text>
          <text x="30" y="276" fill="#94a3b8" font-family="sans-serif" font-size="8.5">60 MINUTE HIGH REVENUE • HYDRAULIC INDUSTRIAL POWER</text>
          <rect x="272" y="253" width="100" height="24" rx="6" fill="#059669" />
          <text x="322" y="269" text-anchor="middle" fill="#ffffff" font-family="monospace" font-size="9" font-weight="900">1 HR SETTLE</text>
        </svg>
      `)}`;

    // =========================================================================
    // 3. VIP PLANS (8 Completely Unique Luxury Blade Models)
    // =========================================================================

    // VIP 1: Damascus Wave Steel Blade
    case 'plan-vip-1':
      return `data:image/svg+xml;utf8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
          <defs>
            <linearGradient id="v1_bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#020e09" />
              <stop offset="50%" stop-color="#05281a" />
              <stop offset="100%" stop-color="#010805" />
            </linearGradient>
            <linearGradient id="v1_steel" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#334155" />
              <stop offset="50%" stop-color="#cbd5e1" />
              <stop offset="100%" stop-color="#1e293b" />
            </linearGradient>
            <filter id="v1_shadow"><feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="#000" flood-opacity="0.85" /></filter>
          </defs>
          <rect width="400" height="300" fill="url(#v1_bg)" />
          <circle cx="200" cy="140" r="110" fill="#10b981" opacity="0.15" />

          <g transform="translate(16, 14)">
            <rect width="180" height="24" rx="12" fill="#000" fill-opacity="0.85" stroke="#f59e0b" stroke-width="1.2" />
            <circle cx="16" cy="12" r="4" fill="#fbbf24" />
            <text x="98" y="15.5" text-anchor="middle" fill="#fbbf24" font-family="sans-serif" font-size="7.5" font-weight="900">VIP 1 DAMASCUS STEEL</text>
          </g>
          <g transform="translate(265, 14)">
            <rect width="119" height="24" rx="12" fill="#000" fill-opacity="0.85" stroke="#f59e0b" stroke-width="1.2" />
            <text x="59.5" y="15.5" text-anchor="middle" fill="#fbbf24" font-family="monospace" font-size="7.5" font-weight="900">VIP 1 ACTIVE</text>
          </g>

          <g transform="translate(200, 138) rotate(-8)" filter="url(#v1_shadow)">
            <rect x="-140" y="-58" width="280" height="116" rx="10" fill="url(#v1_steel)" stroke="#f59e0b" stroke-width="1.8" />
            <path d="M -130,-40 Q -80,-20 -30,-40 T 70,-40 T 130,-40" stroke="#475569" stroke-width="1.5" fill="none" opacity="0.7" />
            <path d="M -130,-20 Q -80,0 -30,-20 T 70,-20 T 130,-20" stroke="#475569" stroke-width="1.5" fill="none" opacity="0.7" />
            <path d="M -130,0 Q -80,20 -30,0 T 70,0 T 130,0" stroke="#475569" stroke-width="1.5" fill="none" opacity="0.7" />
            <path d="M -130,20 Q -80,40 -30,20 T 70,20 T 130,20" stroke="#475569" stroke-width="1.5" fill="none" opacity="0.7" />
            <line x1="-140" y1="-58" x2="140" y2="-58" stroke="#ffffff" stroke-width="2" />
            <line x1="-140" y1="58" x2="140" y2="58" stroke="#ffffff" stroke-width="2" />
            <rect x="-70" y="-8" width="140" height="16" rx="8" fill="#010805" stroke="#f59e0b" stroke-width="1.2" />
            <circle cx="0" cy="0" r="14" fill="#010805" stroke="#f59e0b" stroke-width="1.5" />
            <text x="0" y="-25" text-anchor="middle" fill="#0f172a" font-family="'Courier New', monospace" font-size="11" font-weight="900">AKM DAMASCUS FOLDED</text>
            <text x="0" y="32" text-anchor="middle" fill="#ca8a04" font-family="sans-serif" font-size="6.5" font-weight="800">ROYAL WATERED FORGED STEEL</text>
          </g>

          <rect x="16" y="246" width="368" height="38" rx="10" fill="#000" fill-opacity="0.88" stroke="#f59e0b" stroke-width="1" />
          <text x="30" y="263" fill="#fbbf24" font-family="monospace" font-size="9.5" font-weight="bold">VIP 1 DAMASCUS STEEL ARTISAN BLADE</text>
          <text x="30" y="276" fill="#94a3b8" font-family="sans-serif" font-size="8.5">AKM VIP EXCLUSIVE ALLOCATION • 146% RETURN</text>
          <rect x="272" y="253" width="100" height="24" rx="6" fill="#d97706" />
          <text x="322" y="269" text-anchor="middle" fill="#ffffff" font-family="monospace" font-size="9" font-weight="900">VIP 1 TIER</text>
        </svg>
      `)}`;

    // VIP 1b: Rainbow Iridescent Neo-Chrome Anodized Blade
    case 'plan-vip-1b':
      return `data:image/svg+xml;utf8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
          <defs>
            <linearGradient id="v1b_bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#120417" />
              <stop offset="50%" stop-color="#24072f" />
              <stop offset="100%" stop-color="#0a020d" />
            </linearGradient>
            <linearGradient id="v1b_rainbow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#ec4899" />
              <stop offset="25%" stop-color="#8b5cf6" />
              <stop offset="50%" stop-color="#06b6d4" />
              <stop offset="75%" stop-color="#10b981" />
              <stop offset="100%" stop-color="#f59e0b" />
            </linearGradient>
            <filter id="v1b_shadow"><feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="#000" flood-opacity="0.85" /></filter>
          </defs>
          <rect width="400" height="300" fill="url(#v1b_bg)" />
          <circle cx="200" cy="140" r="110" fill="#ec4899" opacity="0.15" />

          <g transform="translate(16, 14)">
            <rect width="180" height="24" rx="12" fill="#000" fill-opacity="0.85" stroke="#ec4899" stroke-width="1.2" />
            <circle cx="16" cy="12" r="4" fill="#f472b6" />
            <text x="98" y="15.5" text-anchor="middle" fill="#fbcfe8" font-family="sans-serif" font-size="7.5" font-weight="900">RAINBOW NEO-CHROME</text>
          </g>
          <g transform="translate(265, 14)">
            <rect width="119" height="24" rx="12" fill="#000" fill-opacity="0.85" stroke="#8b5cf6" stroke-width="1.2" />
            <text x="59.5" y="15.5" text-anchor="middle" fill="#ddd6fe" font-family="monospace" font-size="7.5" font-weight="900">VIP 1 PRIME</text>
          </g>

          <!-- Rainbow Anodized Oil-Slick Blade Object -->
          <g transform="translate(200, 138) rotate(-10)" filter="url(#v1b_shadow)">
            <rect x="-135" y="-55" width="270" height="110" rx="10" fill="url(#v1b_rainbow)" stroke="#ffffff" stroke-width="1.5" />
            <line x1="-120" y1="-55" x2="120" y2="-55" stroke="#ffffff" stroke-width="2.5" />
            <line x1="-120" y1="55" x2="120" y2="55" stroke="#ffffff" stroke-width="2.5" />
            <rect x="-75" y="-6" width="150" height="12" rx="6" fill="#0a020d" stroke="#ffffff" stroke-width="1.2" />
            <circle cx="0" cy="0" r="14" fill="#0a020d" stroke="#ffffff" stroke-width="1.5" />
            <text x="0" y="-22" text-anchor="middle" fill="#ffffff" font-family="'Courier New', monospace" font-size="10" font-weight="900">NEO-CHROME TITANIUM</text>
            <text x="0" y="27" text-anchor="middle" fill="#ffffff" font-family="sans-serif" font-size="6.5" font-weight="800">RAINBOW ANODIZED PRISM</text>
          </g>

          <rect x="16" y="246" width="368" height="38" rx="10" fill="#000" fill-opacity="0.88" stroke="#ec4899" stroke-width="1" />
          <text x="30" y="263" fill="#fbcfe8" font-family="monospace" font-size="9.5" font-weight="bold">VIP 1 NEO-CHROME RAINBOW TITANIUM BLADE</text>
          <text x="30" y="276" fill="#94a3b8" font-family="sans-serif" font-size="8.5">OIL-SLICK ANODIZED PRISM • 168% 2-DAY RETURN</text>
          <rect x="272" y="253" width="100" height="24" rx="6" fill="#db2777" />
          <text x="322" y="269" text-anchor="middle" fill="#ffffff" font-family="monospace" font-size="9" font-weight="900">VIP 1 PRIME</text>
        </svg>
      `)}`;

    // VIP 2: Icy Cryogenic Platinum-Iridium Frost Blade
    case 'plan-vip-2':
      return `data:image/svg+xml;utf8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
          <defs>
            <linearGradient id="v2_bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#02141a" />
              <stop offset="50%" stop-color="#032734" />
              <stop offset="100%" stop-color="#010c10" />
            </linearGradient>
            <linearGradient id="v2_frost" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#bae6fd" />
              <stop offset="50%" stop-color="#ffffff" />
              <stop offset="100%" stop-color="#7dd3fc" />
            </linearGradient>
            <filter id="v2_shadow"><feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="#000" flood-opacity="0.85" /></filter>
          </defs>
          <rect width="400" height="300" fill="url(#v2_bg)" />
          <circle cx="200" cy="140" r="110" fill="#38bdf8" opacity="0.18" />

          <g transform="translate(16, 14)">
            <rect width="180" height="24" rx="12" fill="#000" fill-opacity="0.85" stroke="#38bdf8" stroke-width="1.2" />
            <circle cx="16" cy="12" r="4" fill="#38bdf8" />
            <text x="98" y="15.5" text-anchor="middle" fill="#bae6fd" font-family="sans-serif" font-size="7.5" font-weight="900">CRYO FROST PLATINUM</text>
          </g>
          <g transform="translate(265, 14)">
            <rect width="119" height="24" rx="12" fill="#000" fill-opacity="0.85" stroke="#38bdf8" stroke-width="1.2" />
            <text x="59.5" y="15.5" text-anchor="middle" fill="#bae6fd" font-family="monospace" font-size="7.5" font-weight="900">VIP 2 TIER</text>
          </g>

          <!-- Frost Icy Crystal Facet Blade -->
          <g transform="translate(200, 138) rotate(-7)" filter="url(#v2_shadow)">
            <rect x="-135" y="-55" width="270" height="110" rx="8" fill="url(#v2_frost)" stroke="#38bdf8" stroke-width="1.5" />
            <!-- Ice Crystal Facets -->
            <polygon points="-80,-55 -40,-20 -100,-20" fill="#38bdf8" opacity="0.3" />
            <polygon points="40,-55 80,-20 20,-20" fill="#38bdf8" opacity="0.3" />
            <polygon points="-40,55 0,20 -60,20" fill="#38bdf8" opacity="0.3" />
            <polygon points="60,55 100,20 40,20" fill="#38bdf8" opacity="0.3" />
            <line x1="-120" y1="-55" x2="120" y2="-55" stroke="#ffffff" stroke-width="2.5" />
            <line x1="-120" y1="55" x2="120" y2="55" stroke="#ffffff" stroke-width="2.5" />
            <circle cx="0" cy="0" r="16" fill="#010c10" stroke="#38bdf8" stroke-width="1.5" />
            <text x="0" y="-22" text-anchor="middle" fill="#0369a1" font-family="'Courier New', monospace" font-size="10" font-weight="900">SUB-ZERO PLATINUM-IR</text>
            <text x="0" y="27" text-anchor="middle" fill="#0284c7" font-family="sans-serif" font-size="6.5" font-weight="800">-196°C CRYOGENIC TEMPERED</text>
          </g>

          <rect x="16" y="246" width="368" height="38" rx="10" fill="#000" fill-opacity="0.88" stroke="#38bdf8" stroke-width="1" />
          <text x="30" y="263" fill="#bae6fd" font-family="monospace" font-size="9.5" font-weight="bold">VIP 2 CRYO FROST PLATINUM MATRIX BLADE</text>
          <text x="30" y="276" fill="#94a3b8" font-family="sans-serif" font-size="8.5">SUB-ZERO LIQUID NITROGEN HARDENED • 252% RETURN</text>
          <rect x="272" y="253" width="100" height="24" rx="6" fill="#0284c7" />
          <text x="322" y="269" text-anchor="middle" fill="#ffffff" font-family="monospace" font-size="9" font-weight="900">VIP 2 TIER</text>
        </svg>
      `)}`;

    // VIP 2b: Hex-Perforated Aviation Grade Tungsten Blade
    case 'plan-vip-2b':
      return `data:image/svg+xml;utf8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
          <defs>
            <linearGradient id="v2b_bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#0a0d14" />
              <stop offset="50%" stop-color="#141a26" />
              <stop offset="100%" stop-color="#06080d" />
            </linearGradient>
            <linearGradient id="v2b_hex" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#334155" />
              <stop offset="50%" stop-color="#64748b" />
              <stop offset="100%" stop-color="#1e293b" />
            </linearGradient>
            <filter id="v2b_shadow"><feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="#000" flood-opacity="0.85" /></filter>
          </defs>
          <rect width="400" height="300" fill="url(#v2b_bg)" />
          <circle cx="200" cy="140" r="110" fill="#f59e0b" opacity="0.12" />

          <g transform="translate(16, 14)">
            <rect width="180" height="24" rx="12" fill="#000" fill-opacity="0.85" stroke="#f59e0b" stroke-width="1.2" />
            <circle cx="16" cy="12" r="4" fill="#fbbf24" />
            <text x="98" y="15.5" text-anchor="middle" fill="#fef08a" font-family="sans-serif" font-size="7.5" font-weight="900">HEX-PERFORATED CARBIDE</text>
          </g>
          <g transform="translate(265, 14)">
            <rect width="119" height="24" rx="12" fill="#000" fill-opacity="0.85" stroke="#f59e0b" stroke-width="1.2" />
            <text x="59.5" y="15.5" text-anchor="middle" fill="#fef08a" font-family="monospace" font-size="7.5" font-weight="900">VIP 2 APEX</text>
          </g>

          <!-- Hex-Perforated Industrial Blade Object -->
          <g transform="translate(200, 138) rotate(-8)" filter="url(#v2b_shadow)">
            <rect x="-135" y="-55" width="270" height="110" rx="8" fill="url(#v2b_hex)" stroke="#f59e0b" stroke-width="1.5" />
            <!-- Hexagonal Cooling Holes Array -->
            <polygon points="-90,-35 -83,-42 -77,-35 -77,-25 -83,-18 -90,-25" fill="#06080d" stroke="#f59e0b" stroke-width="1" />
            <polygon points="-50,-35 -43,-42 -37,-35 -37,-25 -43,-18 -50,-25" fill="#06080d" stroke="#f59e0b" stroke-width="1" />
            <polygon points="-10,-35 -3,-42 3,-35 3,-25 -3,-18 -10,-25" fill="#06080d" stroke="#f59e0b" stroke-width="1" />
            <polygon points="30,-35 37,-42 43,-35 43,-25 37,-18 30,-25" fill="#06080d" stroke="#f59e0b" stroke-width="1" />
            <polygon points="70,-35 77,-42 83,-35 83,-25 77,-18 70,-25" fill="#06080d" stroke="#f59e0b" stroke-width="1" />
            <!-- Gold Beveled Edges -->
            <line x1="-120" y1="-55" x2="120" y2="-55" stroke="#f59e0b" stroke-width="2.5" />
            <line x1="-120" y1="55" x2="120" y2="55" stroke="#f59e0b" stroke-width="2.5" />
            <text x="0" y="8" text-anchor="middle" fill="#fef08a" font-family="'Courier New', monospace" font-size="10" font-weight="900">AVIATION TUNGSTEN HEX</text>
            <text x="0" y="27" text-anchor="middle" fill="#94a3b8" font-family="sans-serif" font-size="6.5" font-weight="800">HEAT-DISSIPATING HONEYCOMB</text>
          </g>

          <rect x="16" y="246" width="368" height="38" rx="10" fill="#000" fill-opacity="0.88" stroke="#f59e0b" stroke-width="1" />
          <text x="30" y="263" fill="#fbbf24" font-family="monospace" font-size="9.5" font-weight="bold">VIP 2 APEX HEX-PERFORATED CARBIDE BLADE</text>
          <text x="30" y="276" fill="#94a3b8" font-family="sans-serif" font-size="8.5">HEAT-DISSIPATING HONEYCOMB MATRIX • 250% RETURN</text>
          <rect x="272" y="253" width="100" height="24" rx="6" fill="#b45309" />
          <text x="322" y="269" text-anchor="middle" fill="#ffffff" font-family="monospace" font-size="9" font-weight="900">VIP 2 APEX</text>
        </svg>
      `)}`;

    // VIP 3: Sapphire Cobalt Blue Quantum PVD Blade
    case 'plan-vip-3':
      return `data:image/svg+xml;utf8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
          <defs>
            <linearGradient id="v3_bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#02091a" />
              <stop offset="50%" stop-color="#06183a" />
              <stop offset="100%" stop-color="#01050f" />
            </linearGradient>
            <linearGradient id="v3_blue" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#1d4ed8" />
              <stop offset="50%" stop-color="#3b82f6" />
              <stop offset="100%" stop-color="#1e40af" />
            </linearGradient>
            <filter id="v3_shadow"><feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="#000" flood-opacity="0.85" /></filter>
          </defs>
          <rect width="400" height="300" fill="url(#v3_bg)" />
          <circle cx="200" cy="140" r="110" fill="#3b82f6" opacity="0.2" />

          <g transform="translate(16, 14)">
            <rect width="180" height="24" rx="12" fill="#000" fill-opacity="0.85" stroke="#3b82f6" stroke-width="1.2" />
            <circle cx="16" cy="12" r="4" fill="#60a5fa" />
            <text x="98" y="15.5" text-anchor="middle" fill="#93c5fd" font-family="sans-serif" font-size="7.5" font-weight="900">SAPPHIRE COBALT PVD</text>
          </g>
          <g transform="translate(265, 14)">
            <rect width="119" height="24" rx="12" fill="#000" fill-opacity="0.85" stroke="#3b82f6" stroke-width="1.2" />
            <text x="59.5" y="15.5" text-anchor="middle" fill="#bfdbfe" font-family="monospace" font-size="7.5" font-weight="900">VIP 3 MATRIX</text>
          </g>

          <!-- Electric Sapphire Cobalt Blade Object -->
          <g transform="translate(200, 138) rotate(-7)" filter="url(#v3_shadow)">
            <rect x="-135" y="-55" width="270" height="110" rx="10" fill="url(#v3_blue)" stroke="#93c5fd" stroke-width="1.8" />
            <line x1="-120" y1="-55" x2="120" y2="-55" stroke="#ffffff" stroke-width="2.5" />
            <line x1="-120" y1="55" x2="120" y2="55" stroke="#ffffff" stroke-width="2.5" />
            <circle cx="0" cy="0" r="16" fill="#02091a" stroke="#60a5fa" stroke-width="1.5" />
            <rect x="-70" y="-7" width="140" height="14" rx="7" fill="#02091a" stroke="#60a5fa" stroke-width="1.2" />
            <text x="0" y="-22" text-anchor="middle" fill="#ffffff" font-family="'Courier New', monospace" font-size="10.5" font-weight="900">SAPPHIRE COBALT PVD</text>
            <text x="0" y="27" text-anchor="middle" fill="#93c5fd" font-family="sans-serif" font-size="6.5" font-weight="800">QUANTUM SPUTTERED ALLOY</text>
          </g>

          <rect x="16" y="246" width="368" height="38" rx="10" fill="#000" fill-opacity="0.88" stroke="#3b82f6" stroke-width="1" />
          <text x="30" y="263" fill="#93c5fd" font-family="monospace" font-size="9.5" font-weight="bold">VIP 3 QUANTUM SAPPHIRE COBALT BLADE</text>
          <text x="30" y="276" fill="#94a3b8" font-family="sans-serif" font-size="8.5">VACUUM PVD COBALT COATING • 350% RETURN</text>
          <rect x="272" y="253" width="100" height="24" rx="6" fill="#1d4ed8" />
          <text x="322" y="269" text-anchor="middle" fill="#ffffff" font-family="monospace" font-size="9" font-weight="900">VIP 3 TIER</text>
        </svg>
      `)}`;

    // VIP 3b: Ruby Red Crimson Honed Laser Blade
    case 'plan-vip-3b':
      return `data:image/svg+xml;utf8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
          <defs>
            <linearGradient id="v3b_bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#1c0307" />
              <stop offset="50%" stop-color="#38060e" />
              <stop offset="100%" stop-color="#120205" />
            </linearGradient>
            <linearGradient id="v3b_ruby" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#e11d48" />
              <stop offset="50%" stop-color="#f43f5e" />
              <stop offset="100%" stop-color="#9f1239" />
            </linearGradient>
            <filter id="v3b_shadow"><feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="#000" flood-opacity="0.85" /></filter>
          </defs>
          <rect width="400" height="300" fill="url(#v3b_bg)" />
          <circle cx="200" cy="140" r="110" fill="#f43f5e" opacity="0.2" />

          <g transform="translate(16, 14)">
            <rect width="180" height="24" rx="12" fill="#000" fill-opacity="0.85" stroke="#f43f5e" stroke-width="1.2" />
            <circle cx="16" cy="12" r="4" fill="#fb7185" />
            <text x="98" y="15.5" text-anchor="middle" fill="#fecdd3" font-family="sans-serif" font-size="7.5" font-weight="900">CRIMSON RUBY LASER</text>
          </g>
          <g transform="translate(265, 14)">
            <rect width="119" height="24" rx="12" fill="#000" fill-opacity="0.85" stroke="#f43f5e" stroke-width="1.2" />
            <text x="59.5" y="15.5" text-anchor="middle" fill="#fecdd3" font-family="monospace" font-size="7.5" font-weight="900">VIP 3 GLOBAL</text>
          </g>

          <!-- Crimson Ruby Metallic Blade Object -->
          <g transform="translate(200, 138) rotate(-9)" filter="url(#v3b_shadow)">
            <rect x="-135" y="-55" width="270" height="110" rx="10" fill="url(#v3b_ruby)" stroke="#fda4af" stroke-width="1.8" />
            <line x1="-120" y1="-55" x2="120" y2="-55" stroke="#ffffff" stroke-width="2.5" />
            <line x1="-120" y1="55" x2="120" y2="55" stroke="#ffffff" stroke-width="2.5" />
            <circle cx="0" cy="0" r="16" fill="#120205" stroke="#fda4af" stroke-width="1.5" />
            <rect x="-70" y="-7" width="140" height="14" rx="7" fill="#120205" stroke="#fda4af" stroke-width="1.2" />
            <text x="0" y="-22" text-anchor="middle" fill="#ffffff" font-family="'Courier New', monospace" font-size="10.5" font-weight="900">CRIMSON RUBY ALLOY</text>
            <text x="0" y="27" text-anchor="middle" fill="#fecdd3" font-family="sans-serif" font-size="6.5" font-weight="800">LASER-HONED PHOTONIC EDGE</text>
          </g>

          <rect x="16" y="246" width="368" height="38" rx="10" fill="#000" fill-opacity="0.88" stroke="#f43f5e" stroke-width="1" />
          <text x="30" y="263" fill="#fecdd3" font-family="monospace" font-size="9.5" font-weight="bold">VIP 3 CRIMSON RUBY LASER BLADE</text>
          <text x="30" y="276" fill="#94a3b8" font-family="sans-serif" font-size="8.5">LASER-HONED PHOTONIC ALLOY • 420% RETURN</text>
          <rect x="272" y="253" width="100" height="24" rx="6" fill="#be123c" />
          <text x="322" y="269" text-anchor="middle" fill="#ffffff" font-family="monospace" font-size="9" font-weight="900">VIP 3 PRIME</text>
        </svg>
      `)}`;

    // VIP 4: 18K Rose Gold Royal Filigree Engraved Blade
    case 'plan-vip-4':
      return `data:image/svg+xml;utf8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
          <defs>
            <linearGradient id="v4_bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#170c0a" />
              <stop offset="50%" stop-color="#311915" />
              <stop offset="100%" stop-color="#0f0705" />
            </linearGradient>
            <linearGradient id="v4_rosegold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#ffe4e6" />
              <stop offset="30%" stop-color="#fda4af" />
              <stop offset="70%" stop-color="#f43f5e" />
              <stop offset="100%" stop-color="#9f1239" />
            </linearGradient>
            <filter id="v4_shadow"><feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="#000" flood-opacity="0.85" /></filter>
          </defs>
          <rect width="400" height="300" fill="url(#v4_bg)" />
          <circle cx="200" cy="140" r="110" fill="#fda4af" opacity="0.15" />

          <g transform="translate(16, 14)">
            <rect width="180" height="24" rx="12" fill="#000" fill-opacity="0.85" stroke="#fda4af" stroke-width="1.2" />
            <circle cx="16" cy="12" r="4" fill="#fb7185" />
            <text x="98" y="15.5" text-anchor="middle" fill="#ffe4e6" font-family="sans-serif" font-size="7.5" font-weight="900">18K ROSE GOLD FILIGREE</text>
          </g>
          <g transform="translate(265, 14)">
            <rect width="119" height="24" rx="12" fill="#000" fill-opacity="0.85" stroke="#fda4af" stroke-width="1.2" />
            <text x="59.5" y="15.5" text-anchor="middle" fill="#ffe4e6" font-family="monospace" font-size="7.5" font-weight="900">VIP 4 ELITE</text>
          </g>

          <!-- 18K Rose Gold Baroque Filigree Blade Object -->
          <g transform="translate(200, 138) rotate(-8)" filter="url(#v4_shadow)">
            <rect x="-135" y="-55" width="270" height="110" rx="10" fill="url(#v4_rosegold)" stroke="#ffe4e6" stroke-width="1.8" />
            <!-- Ornate Filigree Swirls -->
            <path d="M -110,-35 C -90,-20 -70,-45 -50,-35 S -10,-20 10,-35 S 50,-45 70,-35" stroke="#ffe4e6" stroke-width="1" fill="none" opacity="0.6" />
            <path d="M -110,35 C -90,20 -70,45 -50,35 S -10,20 10,35 S 50,45 70,35" stroke="#ffe4e6" stroke-width="1" fill="none" opacity="0.6" />
            <line x1="-120" y1="-55" x2="120" y2="-55" stroke="#ffffff" stroke-width="2.5" />
            <line x1="-120" y1="55" x2="120" y2="55" stroke="#ffffff" stroke-width="2.5" />
            <circle cx="0" cy="0" r="16" fill="#0f0705" stroke="#ffe4e6" stroke-width="1.5" />
            <rect x="-70" y="-7" width="140" height="14" rx="7" fill="#0f0705" stroke="#ffe4e6" stroke-width="1.2" />
            <text x="0" y="-22" text-anchor="middle" fill="#881337" font-family="'Courier New', monospace" font-size="10.5" font-weight="900">18K ROSE GOLD FILIGREE</text>
            <text x="0" y="27" text-anchor="middle" fill="#ffe4e6" font-family="sans-serif" font-size="6.5" font-weight="800">ROYAL BAROQUE ENGRAVED</text>
          </g>

          <rect x="16" y="246" width="368" height="38" rx="10" fill="#000" fill-opacity="0.88" stroke="#fda4af" stroke-width="1" />
          <text x="30" y="263" fill="#ffe4e6" font-family="monospace" font-size="9.5" font-weight="bold">VIP 4 18K ROSE GOLD FILIGREE BLADE</text>
          <text x="30" y="276" fill="#94a3b8" font-family="sans-serif" font-size="8.5">ROYAL ENGRAVED BAROQUE ALLOCATION • 411% RETURN</text>
          <rect x="272" y="253" width="100" height="24" rx="6" fill="#e11d48" />
          <text x="322" y="269" text-anchor="middle" fill="#ffffff" font-family="monospace" font-size="9" font-weight="900">VIP 4 TIER</text>
        </svg>
      `)}`;

    // VIP 5: Sovereign Black Diamond & Platinum Masterwork Blade
    case 'plan-vip-5':
      return `data:image/svg+xml;utf8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
          <defs>
            <linearGradient id="v5_bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#090a0f" />
              <stop offset="50%" stop-color="#121520" />
              <stop offset="100%" stop-color="#040508" />
            </linearGradient>
            <linearGradient id="v5_obsidian" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#020617" />
              <stop offset="40%" stop-color="#1e293b" />
              <stop offset="70%" stop-color="#090d16" />
              <stop offset="100%" stop-color="#020617" />
            </linearGradient>
            <filter id="v5_shadow"><feDropShadow dx="0" dy="10" stdDeviation="14" flood-color="#000" flood-opacity="0.95" /></filter>
          </defs>
          <rect width="400" height="300" fill="url(#v5_bg)" />
          <circle cx="200" cy="140" r="120" fill="#f59e0b" opacity="0.18" />

          <g transform="translate(16, 14)">
            <rect width="180" height="24" rx="12" fill="#000" fill-opacity="0.9" stroke="#f59e0b" stroke-width="1.4" />
            <circle cx="16" cy="12" r="4" fill="#fbbf24" />
            <text x="98" y="15.5" text-anchor="middle" fill="#fef08a" font-family="sans-serif" font-size="7.5" font-weight="900">SOVEREIGN DIAMOND OBSIDIAN</text>
          </g>
          <g transform="translate(265, 14)">
            <rect width="119" height="24" rx="12" fill="#000" fill-opacity="0.9" stroke="#f59e0b" stroke-width="1.4" />
            <text x="59.5" y="15.5" text-anchor="middle" fill="#fef08a" font-family="monospace" font-size="7.5" font-weight="900">VIP 5 CROWN</text>
          </g>

          <!-- Sovereign Obsidian Black Diamond Masterwork Blade -->
          <g transform="translate(200, 138) rotate(-7)" filter="url(#v5_shadow)">
            <rect x="-140" y="-58" width="280" height="116" rx="12" fill="url(#v5_obsidian)" stroke="#f59e0b" stroke-width="2" />
            <line x1="-125" y1="-58" x2="125" y2="-58" stroke="#ffffff" stroke-width="2.5" />
            <line x1="-125" y1="58" x2="125" y2="58" stroke="#ffffff" stroke-width="2.5" />
            <!-- Embedded Diamond Gem Icons along center -->
            <polygon points="-80,0 -75,-6 -70,0 -75,6" fill="#38bdf8" stroke="#ffffff" stroke-width="0.5" />
            <polygon points="-40,0 -35,-6 -30,0 -35,6" fill="#38bdf8" stroke="#ffffff" stroke-width="0.5" />
            <polygon points="40,0 45,-6 50,0 45,6" fill="#38bdf8" stroke="#ffffff" stroke-width="0.5" />
            <polygon points="80,0 85,-6 90,0 85,6" fill="#38bdf8" stroke="#ffffff" stroke-width="0.5" />
            <circle cx="0" cy="0" r="18" fill="#020617" stroke="#f59e0b" stroke-width="2" />
            <text x="0" y="4" text-anchor="middle" fill="#f59e0b" font-family="sans-serif" font-size="10" font-weight="900">👑</text>
            <text x="0" y="-25" text-anchor="middle" fill="#fef08a" font-family="'Courier New', monospace" font-size="11" font-weight="900">SOVEREIGN OBSIDIAN DIAMOND</text>
            <text x="0" y="32" text-anchor="middle" fill="#cbd5e1" font-family="sans-serif" font-size="6.5" font-weight="800">VIP 5 PINNACLE MASTERWORK ALLOCATION</text>
          </g>

          <rect x="16" y="246" width="368" height="38" rx="10" fill="#000" fill-opacity="0.9" stroke="#f59e0b" stroke-width="1.2" />
          <text x="30" y="263" fill="#fef08a" font-family="monospace" font-size="9.5" font-weight="bold">VIP 5 SOVEREIGN DIAMOND OBSIDIAN BLADE</text>
          <text x="30" y="276" fill="#94a3b8" font-family="sans-serif" font-size="8.5">SOVEREIGN PINNACLE ALLOCATION • 560% MAXIMUM RETURN</text>
          <rect x="272" y="253" width="100" height="24" rx="6" fill="#b45309" />
          <text x="322" y="269" text-anchor="middle" fill="#ffffff" font-family="monospace" font-size="9" font-weight="900">VIP 5 PINNACLE</text>
        </svg>
      `)}`;

    default: {
      const displayTitle = (planId || 'AKM Precision Blade').replace(/[-_]/g, ' ').toUpperCase();
      return `data:image/svg+xml;utf8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
          <defs>
            <linearGradient id="fallback_bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#090d16" />
              <stop offset="50%" stop-color="#0f172a" />
              <stop offset="100%" stop-color="#020617" />
            </linearGradient>
            <linearGradient id="fallback_blade" x1="0%" y1="0%" x2="100%" y2="50%">
              <stop offset="0%" stop-color="#e2e8f0" />
              <stop offset="30%" stop-color="#94a3b8" />
              <stop offset="70%" stop-color="#f8fafc" />
              <stop offset="100%" stop-color="#475569" />
            </linearGradient>
          </defs>
          <rect width="400" height="300" fill="url(#fallback_bg)" />
          <g transform="translate(200, 135) rotate(-6)">
            <rect x="-130" y="-45" width="260" height="90" rx="8" fill="url(#fallback_blade)" stroke="#38bdf8" stroke-width="2" />
            <line x1="-120" y1="-45" x2="120" y2="-45" stroke="#ffffff" stroke-width="2" />
            <line x1="-120" y1="45" x2="120" y2="45" stroke="#ffffff" stroke-width="2" />
            <circle cx="0" cy="0" r="14" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5" />
            <text x="0" y="-12" text-anchor="middle" fill="#0f172a" font-family="monospace" font-size="9" font-weight="900">AKM PRECISION CUTTER</text>
            <text x="0" y="20" text-anchor="middle" fill="#0f172a" font-family="monospace" font-size="7" font-weight="700">CERTIFIED ALLOY</text>
          </g>
          <rect x="16" y="246" width="368" height="38" rx="10" fill="#000" fill-opacity="0.9" stroke="#38bdf8" stroke-width="1" />
          <text x="30" y="269" fill="#38bdf8" font-family="monospace" font-size="9.5" font-weight="bold">${displayTitle}</text>
        </svg>
      `)}`;
    }
  }
}

/**
 * React Component helper for embedding product artwork with automatic fallback handling
 */
interface ProductArtworkProps {
  plan: Plan;
  className?: string;
  aspectRatio?: 'video' | 'square' | 'wide';
}

export const ProductArtwork: React.FC<ProductArtworkProps> = ({
  plan,
  className = 'w-full h-full object-cover',
}) => {
  const artworkSrc = getProductArtworkDataUri(plan.id, plan.category);

  return (
    <img
      src={artworkSrc}
      alt={plan.title}
      className={className}
      loading="eager"
      referrerPolicy="no-referrer"
    />
  );
};
