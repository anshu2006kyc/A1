import React from 'react';
import { Plan } from '../types';

/**
 * Returns a high-fidelity SVG Data URI specifically designed for each AKM & BKT product.
 * These load instantaneously (0ms), have zero external network dependencies,
 * and provide ultra-sharp, institutional-grade industrial equipment and wealth asset illustrations.
 * Every graphic includes certified trust seals, ISO 9001 markings, verified yield badges, and
 * capital protection guarantees to maximize investor trust and conversions.
 */
export function getProductArtworkDataUri(planId: string, category: string = 'normal'): string {
  switch (planId) {
    // ----------------------------------------------------
    // REGULAR & HIGH-YIELD INDUSTRIAL ASSETS (Product 1 to 5)
    // ----------------------------------------------------
    case 'plan-product-1':
      // Product 1: BKT Agrimax RT-855 Radial Tractor Tire Unit
      return `data:image/svg+xml;utf8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
          <defs>
            <linearGradient id="bgP1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#021c11" />
              <stop offset="50%" stop-color="#064e3b" />
              <stop offset="100%" stop-color="#02130b" />
            </linearGradient>
            <radialGradient id="tireGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#10b981" stop-opacity="0.35" />
              <stop offset="60%" stop-color="#047857" stop-opacity="0.1" />
              <stop offset="100%" stop-color="#021c11" stop-opacity="0" />
            </radialGradient>
            <linearGradient id="rubber" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#27272a" />
              <stop offset="35%" stop-color="#18181b" />
              <stop offset="70%" stop-color="#09090b" />
              <stop offset="100%" stop-color="#18181b" />
            </linearGradient>
            <linearGradient id="goldRim" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#fef08a" />
              <stop offset="30%" stop-color="#f59e0b" />
              <stop offset="70%" stop-color="#d97706" />
              <stop offset="100%" stop-color="#78350f" />
            </linearGradient>
            <linearGradient id="steelHub" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#475569" />
              <stop offset="50%" stop-color="#f8fafc" />
              <stop offset="100%" stop-color="#334155" />
            </linearGradient>
            <linearGradient id="badgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#10b981" />
              <stop offset="100%" stop-color="#047857" />
            </linearGradient>
          </defs>
          <rect width="400" height="300" fill="url(#bgP1)" />
          <circle cx="200" cy="140" r="120" fill="url(#tireGlow)" />
          
          <!-- ISO / BIS Certification Watermark in Background -->
          <g opacity="0.08" stroke="#ffffff" stroke-width="1.5" fill="none">
            <circle cx="200" cy="140" r="130" stroke-dasharray="8 6" />
            <polygon points="200,20 220,50 180,50" />
          </g>

          <!-- BKT Heavy Agri-Radial Tire -->
          <g transform="translate(200, 140)">
            <!-- Outer Tread Radius -->
            <circle cx="0" cy="0" r="92" fill="url(#rubber)" stroke="#3f3f46" stroke-width="4" />
            <!-- Deep Chevron Agricultural Lugs -->
            ${Array.from({ length: 18 })
              .map(
                (_, i) => `
              <path d="M -8,-94 L 0,-112 L 8,-94 L 0,-86 Z" fill="#27272a" stroke="#09090b" stroke-width="1.5" transform="rotate(${i * 20})" />
            `
              )
              .join('')}
            <!-- Tire Sidewall Ring -->
            <circle cx="0" cy="0" r="72" fill="#18181b" stroke="#27272a" stroke-width="3" />
            <!-- Embossed BKT Tire Branding on Sidewall -->
            <path id="sidewallArc" d="M -50,-20 A 55 55 0 0 1 50,-20" fill="none" />
            <text fill="#a1a1aa" font-family="monospace" font-size="8" font-weight="900" letter-spacing="3">
              <textPath href="#sidewallArc" startOffset="50%" text-anchor="middle">
                BKT AGRIMAX RT-855 RADIAL
              </textPath>
            </text>
            <!-- Heavy-Duty Cast Golden Alloy Rim -->
            <circle cx="0" cy="0" r="50" fill="url(#goldRim)" stroke="#fef08a" stroke-width="2.5" />
            <!-- Wheel Bolts Ring -->
            ${[0, 45, 90, 135, 180, 225, 270, 315]
              .map(
                (deg) => `
              <circle cx="0" cy="-34" r="3.5" fill="#f8fafc" stroke="#334155" stroke-width="1.5" transform="rotate(${deg})" />
            `
              )
              .join('')}
            <!-- Center Axle Hub -->
            <circle cx="0" cy="0" r="22" fill="url(#steelHub)" stroke="#0f172a" stroke-width="2" />
            <circle cx="0" cy="0" r="14" fill="#064e3b" stroke="#34d399" stroke-width="2" />
            <text x="0" y="4" text-anchor="middle" fill="#fef08a" font-family="sans-serif" font-size="10" font-weight="black">BKT</text>
          </g>

          <!-- Verified Government / Industrial Trust Badge (Top Left) -->
          <g transform="translate(16, 16)">
            <rect width="145" height="28" rx="14" fill="#000" fill-opacity="0.8" stroke="#10b981" stroke-width="1.2" />
            <circle cx="14" cy="14" r="6" fill="#10b981" />
            <path d="M 11 14 L 13.5 16.5 L 17 11.5" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            <text x="26" y="17.5" fill="#ecfdf5" font-family="sans-serif" font-size="8.5" font-weight="900" letter-spacing="0.5">100% CAPITAL SECURE</text>
          </g>

          <!-- ISO Standard Badge (Top Right) -->
          <g transform="translate(240, 16)">
            <rect width="144" height="28" rx="14" fill="#000" fill-opacity="0.8" stroke="#f59e0b" stroke-width="1.2" />
            <text x="72" y="18" text-anchor="middle" fill="#fde047" font-family="monospace" font-size="9" font-weight="900">ISO 9001:2015 CERTIFIED</text>
          </g>

          <!-- Official Asset Tag Footer -->
          <rect x="16" y="246" width="368" height="38" rx="10" fill="#000" fill-opacity="0.85" stroke="#34d399" stroke-width="1" />
          <text x="30" y="263" fill="#34d399" font-family="monospace" font-size="9.5" font-weight="bold">ASSET: BKT RADIAL TIRE RT-855</text>
          <text x="30" y="276" fill="#94a3b8" font-family="sans-serif" font-size="8.5">GOVT REGISTERED • DAILY YIELD VERIFIED</text>
          <rect x="272" y="253" width="100" height="24" rx="6" fill="url(#badgeGrad)" />
          <text x="322" y="269" text-anchor="middle" fill="#ffffff" font-family="monospace" font-size="9" font-weight="900">₹245 / DAY</text>
        </svg>
      `)}`;

    case 'plan-product-2':
      // Product 2: AKM Apex EarthMax Mining Giant Tire
      return `data:image/svg+xml;utf8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
          <defs>
            <linearGradient id="bgP2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#0f172a" />
              <stop offset="50%" stop-color="#064e3b" />
              <stop offset="100%" stop-color="#022c22" />
            </linearGradient>
            <linearGradient id="goldPlate" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#fef08a" />
              <stop offset="40%" stop-color="#eab308" />
              <stop offset="100%" stop-color="#854d0e" />
            </linearGradient>
            <linearGradient id="steelRing" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#334155" />
              <stop offset="50%" stop-color="#e2e8f0" />
              <stop offset="100%" stop-color="#1e293b" />
            </linearGradient>
          </defs>
          <rect width="400" height="300" fill="url(#bgP2)" />
          
          <!-- Background Mining Topo Grid -->
          <path d="M 0 180 Q 100 140 200 170 T 400 160 L 400 300 L 0 300 Z" fill="#042f2e" opacity="0.6" />
          <path d="M 0 210 Q 150 180 300 200 T 400 220 L 400 300 L 0 300 Z" fill="#021c11" />

          <!-- Massive Mining Hauler Wheel Assembly -->
          <g transform="translate(200, 138)">
            <!-- Massive OTR Outer Tread -->
            <circle cx="0" cy="0" r="95" fill="#18181b" stroke="#334155" stroke-width="4" />
            <!-- Heavy Rock-Lug Tread Blocks -->
            ${Array.from({ length: 14 })
              .map(
                (_, i) => `
              <rect x="-12" y="-115" width="24" height="20" rx="3" fill="#27272a" stroke="#09090b" stroke-width="2" transform="rotate(${i * 25.7})" />
            `
              )
              .join('')}
            <!-- Multi-ply Steel Belt Wall -->
            <circle cx="0" cy="0" r="75" fill="#09090b" stroke="#059669" stroke-width="2.5" />
            <!-- Tire Specifications Text -->
            <circle cx="0" cy="0" r="62" fill="none" stroke="#27272a" stroke-width="1.5" stroke-dasharray="4 4" />
            <!-- Heavy Cast Industrial Steel Rim with 6 Heavy Spokes -->
            <circle cx="0" cy="0" r="54" fill="url(#steelRing)" stroke="#f8fafc" stroke-width="2" />
            ${[0, 60, 120, 180, 240, 300]
              .map(
                (deg) => `
              <line x1="0" y1="0" x2="0" y2="48" stroke="#0f172a" stroke-width="7" stroke-linecap="round" transform="rotate(${deg})" />
            `
              )
              .join('')}
            <!-- Center Golden Crest Hub -->
            <circle cx="0" cy="0" r="24" fill="url(#goldPlate)" stroke="#fff" stroke-width="2" />
            <text x="0" y="4" text-anchor="middle" fill="#78350f" font-family="sans-serif" font-size="9" font-weight="black">APEX</text>
          </g>

          <!-- Top Trust Pillars -->
          <g transform="translate(16, 16)">
            <rect width="155" height="28" rx="14" fill="#000" fill-opacity="0.8" stroke="#10b981" stroke-width="1.2" />
            <text x="77" y="18" text-anchor="middle" fill="#34d399" font-family="sans-serif" font-size="8.5" font-weight="900">🛡️ CAPITAL PROTECTED</text>
          </g>
          <g transform="translate(245, 16)">
            <rect width="139" height="28" rx="14" fill="#000" fill-opacity="0.8" stroke="#f59e0b" stroke-width="1.2" />
            <text x="69" y="18" text-anchor="middle" fill="#fde047" font-family="monospace" font-size="8.5" font-weight="900">HEAVY MINING GRADE</text>
          </g>

          <!-- Footer Information Card -->
          <rect x="16" y="246" width="368" height="38" rx="10" fill="#000" fill-opacity="0.85" stroke="#10b981" stroke-width="1" />
          <text x="30" y="263" fill="#34d399" font-family="monospace" font-size="9.5" font-weight="bold">EARTHMAX SR-45 PLUS • 49" WHEEL</text>
          <text x="30" y="276" fill="#94a3b8" font-family="sans-serif" font-size="8.5">CERTIFIED ASSET • HIGH-YIELD MINING INFRA</text>
          <rect x="272" y="253" width="100" height="24" rx="6" fill="#059669" />
          <text x="322" y="269" text-anchor="middle" fill="#ffffff" font-family="monospace" font-size="9" font-weight="900">₹480 / DAY</text>
        </svg>
      `)}`;

    case 'plan-product-3':
      // Product 3: AKM Sovereign Hydraulic Vulcanization Mega-Press & Tire Autoclave
      return `data:image/svg+xml;utf8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
          <defs>
            <linearGradient id="bgP3" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#021c11" />
              <stop offset="50%" stop-color="#0f291e" />
              <stop offset="100%" stop-color="#090d16" />
            </linearGradient>
            <linearGradient id="pressSteel" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#334155" />
              <stop offset="50%" stop-color="#cbd5e1" />
              <stop offset="100%" stop-color="#1e293b" />
            </linearGradient>
            <linearGradient id="glowHydra" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#34d399" />
              <stop offset="100%" stop-color="#059669" />
            </linearGradient>
          </defs>
          <rect width="400" height="300" fill="url(#bgP3)" />
          
          <!-- Factory Isometric Grid Floor -->
          <g stroke="#059669" stroke-width="0.75" stroke-opacity="0.3">
            <line x1="0" y1="230" x2="400" y2="230" />
            <line x1="0" y1="260" x2="400" y2="260" />
            <line x1="60" y1="200" x2="20" y2="300" />
            <line x1="160" y1="200" x2="120" y2="300" />
            <line x1="260" y1="200" x2="220" y2="300" />
            <line x1="360" y1="200" x2="320" y2="300" />
          </g>

          <!-- Heavy Dual-Column Tire Curing Press Machine -->
          <!-- Base Platen -->
          <rect x="80" y="200" width="240" height="28" rx="4" fill="#1e293b" stroke="#475569" stroke-width="2" />
          <!-- Heavy Upright Columns -->
          <rect x="100" y="60" width="22" height="140" fill="url(#pressSteel)" stroke="#475569" stroke-width="2" />
          <rect x="278" y="60" width="22" height="140" fill="url(#pressSteel)" stroke="#475569" stroke-width="2" />
          <!-- Top Hydraulic Crosshead Beam -->
          <rect x="80" y="45" width="240" height="25" rx="4" fill="#0f172a" stroke="#10b981" stroke-width="2" />
          <!-- Main Hydraulic RAM Cylinder (Center) -->
          <rect x="175" y="70" width="50" height="45" rx="4" fill="url(#glowHydra)" stroke="#34d399" stroke-width="1.5" />
          <rect x="187" y="115" width="26" height="25" fill="#f8fafc" stroke="#334155" stroke-width="1" />
          <!-- Mold Chamber (Tire Being Vulcanized) -->
          <rect x="130" y="140" width="140" height="60" rx="8" fill="#18181b" stroke="#f59e0b" stroke-width="2.5" />
          <!-- High-Temp Heat Warning Light -->
          <circle cx="200" cy="170" r="22" fill="#000" stroke="#f59e0b" stroke-width="3" />
          <polygon points="200,158 208,172 192,172" fill="#fbbf24" />
          <text x="200" y="184" text-anchor="middle" fill="#fde047" font-family="monospace" font-size="7" font-weight="black">280°C</text>
          
          <!-- Steam Lines & Digital Pressure Gauges -->
          <line x1="280" y1="90" x2="330" y2="90" stroke="#94a3b8" stroke-width="3" />
          <circle cx="340" cy="90" r="14" fill="#0f172a" stroke="#38bdf8" stroke-width="2" />
          <line x1="340" y1="90" x2="346" y2="84" stroke="#f43f5e" stroke-width="2" />
          <text x="340" y="115" text-anchor="middle" fill="#38bdf8" font-family="monospace" font-size="7">350 PSI</text>

          <!-- Trust Overlays -->
          <g transform="translate(16, 16)">
            <rect width="165" height="28" rx="14" fill="#000" fill-opacity="0.8" stroke="#10b981" stroke-width="1.2" />
            <text x="82" y="18" text-anchor="middle" fill="#34d399" font-family="sans-serif" font-size="8.5" font-weight="900">🛡️ GOVT RECOGNIZED ASSET</text>
          </g>
          <g transform="translate(255, 16)">
            <rect width="129" height="28" rx="14" fill="#000" fill-opacity="0.8" stroke="#f59e0b" stroke-width="1.2" />
            <text x="64" y="18" text-anchor="middle" fill="#fde047" font-family="monospace" font-size="8.5" font-weight="900">HEAVY INDUSTRIAL</text>
          </g>

          <rect x="16" y="246" width="368" height="38" rx="10" fill="#000" fill-opacity="0.85" stroke="#10b981" stroke-width="1" />
          <text x="30" y="263" fill="#34d399" font-family="monospace" font-size="9.5" font-weight="bold">HYDRA-VULCAN TITAN 5000 PRESS</text>
          <text x="30" y="276" fill="#94a3b8" font-family="sans-serif" font-size="8.5">AUTOMATED CURING CELL • SOVEREIGN ASSET</text>
          <rect x="272" y="253" width="100" height="24" rx="6" fill="#047857" />
          <text x="322" y="269" text-anchor="middle" fill="#ffffff" font-family="monospace" font-size="9" font-weight="900">₹960 / DAY</text>
        </svg>
      `)}`;

    case 'plan-product-4':
      // Product 4: AKM Capital Prime Heavy Duty Commercial Logistics Fleet & Tires
      return `data:image/svg+xml;utf8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
          <defs>
            <linearGradient id="bgP4" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#021c11" />
              <stop offset="60%" stop-color="#0f172a" />
              <stop offset="100%" stop-color="#020617" />
            </linearGradient>
            <linearGradient id="truckBody" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#047857" />
              <stop offset="50%" stop-color="#10b981" />
              <stop offset="100%" stop-color="#064e3b" />
            </linearGradient>
            <linearGradient id="silverChrome" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#f8fafc" />
              <stop offset="50%" stop-color="#94a3b8" />
              <stop offset="100%" stop-color="#334155" />
            </linearGradient>
          </defs>
          <rect width="400" height="300" fill="url(#bgP4)" />
          
          <!-- Highway Asphalt Road with Glow -->
          <polygon points="0,270 400,270 400,300 0,300" fill="#09090b" />
          <line x1="0" y1="270" x2="400" y2="270" stroke="#10b981" stroke-width="2" />
          <line x1="20" y1="285" x2="80" y2="285" stroke="#f59e0b" stroke-width="3" stroke-dasharray="16 12" />
          <line x1="120" y1="285" x2="380" y2="285" stroke="#f59e0b" stroke-width="3" stroke-dasharray="16 12" />

          <!-- Heavy 18-Wheel Commercial Freight Hauler -->
          <!-- Trailer Container Cargo -->
          <rect x="40" y="85" width="220" height="110" rx="4" fill="#0f172a" stroke="#334155" stroke-width="2" />
          <!-- Corrugated Panel Lines -->
          ${Array.from({ length: 9 })
            .map((_, i) => `<line x1="${55 + i * 24}" y1="90" x2="${55 + i * 24}" y2="190" stroke="#1e293b" stroke-width="3" />`)
            .join('')}
          <text x="150" y="145" text-anchor="middle" fill="#34d399" font-family="monospace" font-size="14" font-weight="black" letter-spacing="4">
            BKT LOGISTICS
          </text>
          <text x="150" y="165" text-anchor="middle" fill="#94a3b8" font-family="sans-serif" font-size="8" font-weight="bold">
            COMMERCIAL PRIME FREIGHT DIVISION
          </text>
          <!-- Truck Cabin Front -->
          <path d="M 260 120 L 305 120 L 335 155 L 335 195 L 260 195 Z" fill="url(#truckBody)" stroke="#34d399" stroke-width="2" />
          <!-- Windshield & Side Windows -->
          <polygon points="280,128 300,128 322,152 280,152" fill="#38bdf8" fill-opacity="0.75" stroke="#fff" stroke-width="1.5" />
          <!-- Chrome Front Grille & Heavy Bumper -->
          <rect x="325" y="160" width="14" height="35" rx="2" fill="url(#silverChrome)" stroke="#1e293b" stroke-width="1" />
          <!-- Dual Heavy Headlamps -->
          <circle cx="334" cy="182" r="4.5" fill="#fef08a" stroke="#d97706" stroke-width="1" />
          <!-- Headlamp Light Beam -->
          <polygon points="338,182 400,150 400,240" fill="#fef08a" fill-opacity="0.12" />
          
          <!-- Heavy Radial Wheels Array (Trailer + Tractor) -->
          <!-- Trailer Tandem Axles (4 Wheels Visible) -->
          ${[65, 105, 185, 225, 280, 315]
            .map(
              (cx) => `
            <g transform="translate(${cx}, 210)">
              <circle cx="0" cy="0" r="18" fill="#18181b" stroke="#334155" stroke-width="3" />
              <circle cx="0" cy="0" r="11" fill="url(#silverChrome)" stroke="#0f172a" stroke-width="1.5" />
              <circle cx="0" cy="0" r="4" fill="#047857" />
            </g>
          `
            )
            .join('')}

          <!-- Top Trust Badges -->
          <g transform="translate(16, 16)">
            <rect width="165" height="28" rx="14" fill="#000" fill-opacity="0.8" stroke="#10b981" stroke-width="1.2" />
            <text x="82" y="18" text-anchor="middle" fill="#34d399" font-family="sans-serif" font-size="8.5" font-weight="900">🛡️ AAA COMMERCIAL RATED</text>
          </g>
          <g transform="translate(255, 16)">
            <rect width="129" height="28" rx="14" fill="#000" fill-opacity="0.8" stroke="#38bdf8" stroke-width="1.2" />
            <text x="64" y="18" text-anchor="middle" fill="#bae6fd" font-family="monospace" font-size="8.5" font-weight="900">GPS TELEMATICS</text>
          </g>

          <rect x="16" y="246" width="368" height="38" rx="10" fill="#000" fill-opacity="0.85" stroke="#10b981" stroke-width="1" />
          <text x="30" y="263" fill="#34d399" font-family="monospace" font-size="9.5" font-weight="bold">TITAN PRIME HAULER • 18 RADIALS</text>
          <text x="30" y="276" fill="#94a3b8" font-family="sans-serif" font-size="8.5">NATIONWIDE FREIGHT INFRA • FULLY INSURED</text>
          <rect x="272" y="253" width="100" height="24" rx="6" fill="#059669" />
          <text x="322" y="269" text-anchor="middle" fill="#ffffff" font-family="monospace" font-size="9" font-weight="900">₹2,100 / DAY</text>
        </svg>
      `)}`;

    case 'plan-product-5':
      // Product 5: AKM Pinnacle Mega-Plant Tire Extruder & Calender Infrastructure
      return `data:image/svg+xml;utf8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
          <defs>
            <linearGradient id="bgP5" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#021c11" />
              <stop offset="50%" stop-color="#064e3b" />
              <stop offset="100%" stop-color="#09090b" />
            </linearGradient>
            <linearGradient id="goldLuxury" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#fef08a" />
              <stop offset="35%" stop-color="#eab308" />
              <stop offset="70%" stop-color="#ca8a04" />
              <stop offset="100%" stop-color="#854d0e" />
            </linearGradient>
            <linearGradient id="chromeCylinder" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#ffffff" />
              <stop offset="30%" stop-color="#cbd5e1" />
              <stop offset="70%" stop-color="#475569" />
              <stop offset="100%" stop-color="#0f172a" />
            </linearGradient>
          </defs>
          <rect width="400" height="300" fill="url(#bgP5)" />
          
          <!-- High-End Factory Floor Grid -->
          <g stroke="#34d399" stroke-width="0.75" stroke-opacity="0.35">
            <line x1="0" y1="210" x2="400" y2="210" />
            <line x1="0" y1="240" x2="400" y2="240" />
            <line x1="40" y1="180" x2="0" y2="300" />
            <line x1="120" y1="180" x2="80" y2="300" />
            <line x1="200" y1="180" x2="160" y2="300" />
            <line x1="280" y1="180" x2="240" y2="300" />
            <line x1="360" y1="180" x2="320" y2="300" />
          </g>

          <!-- Steel Cord 4-Roll Calender System (Industrial Marvel) -->
          <!-- 4 Heavy Calender Rollers Stacked Vertically -->
          <g transform="translate(130, 140)">
            <rect x="-35" y="-60" width="70" height="26" rx="13" fill="url(#chromeCylinder)" stroke="#f8fafc" stroke-width="1.5" />
            <rect x="-35" y="-30" width="70" height="26" rx="13" fill="url(#chromeCylinder)" stroke="#f8fafc" stroke-width="1.5" />
            <rect x="-35" y="0" width="70" height="26" rx="13" fill="url(#chromeCylinder)" stroke="#f8fafc" stroke-width="1.5" />
            <rect x="-35" y="30" width="70" height="26" rx="13" fill="url(#chromeCylinder)" stroke="#f8fafc" stroke-width="1.5" />
            <!-- Roller Side Gearboxes -->
            <rect x="-42" y="-65" width="10" height="126" rx="4" fill="#1e293b" stroke="#059669" stroke-width="1.5" />
            <rect x="32" y="-65" width="10" height="126" rx="4" fill="#1e293b" stroke="#059669" stroke-width="1.5" />
          </g>

          <!-- Continuous Rubber Extrusion Sheet Flow -->
          <path d="M 165 140 L 290 140 L 320 180 L 380 180" fill="none" stroke="#18181b" stroke-width="16" />
          <path d="M 165 140 L 290 140 L 320 180 L 380 180" fill="none" stroke="#10b981" stroke-width="2" stroke-dasharray="8 6" />

          <!-- SCADA Multi-Screen Automation Console (Right) -->
          <g transform="translate(260, 65)">
            <rect x="0" y="0" width="95" height="65" rx="6" fill="#090d16" stroke="#f59e0b" stroke-width="2" />
            <!-- Screen 1: Oscilloscope / Production Graph -->
            <rect x="6" y="8" width="40" height="24" rx="2" fill="#021c11" stroke="#10b981" stroke-width="1" />
            <path d="M 8 20 Q 18 10 28 22 T 44 18" fill="none" stroke="#34d399" stroke-width="1.5" />
            <!-- Screen 2: System Status -->
            <rect x="49" y="8" width="40" height="24" rx="2" fill="#021c11" stroke="#38bdf8" stroke-width="1" />
            <text x="69" y="24" text-anchor="middle" fill="#38bdf8" font-family="monospace" font-size="7" font-weight="black">100% OK</text>
            <!-- Control Knobs & Emergency Stop -->
            <circle cx="20" cy="48" r="5" fill="#f59e0b" />
            <circle cx="40" cy="48" r="5" fill="#34d399" />
            <circle cx="75" cy="48" r="7" fill="#ef4444" stroke="#fff" stroke-width="1.5" />
          </g>

          <!-- Top Trust Badges -->
          <g transform="translate(16, 16)">
            <rect width="175" height="28" rx="14" fill="#000" fill-opacity="0.85" stroke="#f59e0b" stroke-width="1.2" />
            <text x="87" y="18" text-anchor="middle" fill="#fde047" font-family="sans-serif" font-size="8.5" font-weight="900">👑 PINNACLE MEGA ASSET</text>
          </g>
          <g transform="translate(255, 16)">
            <rect width="129" height="28" rx="14" fill="#000" fill-opacity="0.85" stroke="#10b981" stroke-width="1.2" />
            <text x="64" y="18" text-anchor="middle" fill="#34d399" font-family="monospace" font-size="8.5" font-weight="900">MAXIMUM DIVIDEND</text>
          </g>

          <rect x="16" y="246" width="368" height="38" rx="10" fill="#000" fill-opacity="0.85" stroke="#f59e0b" stroke-width="1" />
          <text x="30" y="263" fill="#fde047" font-family="monospace" font-size="9.5" font-weight="bold">PINNACLE AUTOMATED CALENDER PLANT</text>
          <text x="30" y="276" fill="#94a3b8" font-family="sans-serif" font-size="8.5">INSTITUTIONAL TIRE INFRASTRUCTURE • ESCROW PROTECTED</text>
          <rect x="272" y="253" width="100" height="24" rx="6" fill="url(#goldLuxury)" />
          <text x="322" y="269" text-anchor="middle" fill="#000000" font-family="monospace" font-size="9" font-weight="900">₹5,500 / DAY</text>
        </svg>
      `)}`;

    // ----------------------------------------------------
    // SPECIAL OFFER PLAN (999.9 Fine Gold Bullion Reserve)
    // ----------------------------------------------------
    case 'plan-special-1':
      return `data:image/svg+xml;utf8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
          <defs>
            <linearGradient id="bgGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#022c22" />
              <stop offset="50%" stop-color="#064e3b" />
              <stop offset="100%" stop-color="#021c11" />
            </linearGradient>
            <linearGradient id="bar1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#fef08a" />
              <stop offset="35%" stop-color="#f59e0b" />
              <stop offset="70%" stop-color="#d97706" />
              <stop offset="100%" stop-color="#78350f" />
            </linearGradient>
            <radialGradient id="goldGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#fbbf24" stop-opacity="0.5" />
              <stop offset="60%" stop-color="#f59e0b" stop-opacity="0.15" />
              <stop offset="100%" stop-color="#064e3b" stop-opacity="0" />
            </radialGradient>
          </defs>
          <rect width="400" height="300" fill="url(#bgGold)" />
          <circle cx="200" cy="140" r="110" fill="url(#goldGlow)" />
          
          <!-- Stack of 24K Minted Gold Bullion Bars -->
          <!-- Bottom Row: 2 Bars -->
          <g transform="translate(100, 150)">
            <polygon points="0,30 30,0 120,0 90,30" fill="url(#bar1)" stroke="#fff" stroke-width="0.75" />
            <polygon points="90,30 120,0 120,20 90,50" fill="#92400e" />
            <rect x="0" y="30" width="90" height="20" fill="url(#bar1)" stroke="#b45309" stroke-width="1" />
            <text x="45" y="44" text-anchor="middle" fill="#78350f" font-family="sans-serif" font-size="8" font-weight="black">999.9 FINE GOLD</text>
          </g>
          <g transform="translate(195, 150)">
            <polygon points="0,30 30,0 120,0 90,30" fill="url(#bar1)" stroke="#fff" stroke-width="0.75" />
            <polygon points="90,30 120,0 120,20 90,50" fill="#92400e" />
            <rect x="0" y="30" width="90" height="20" fill="url(#bar1)" stroke="#b45309" stroke-width="1" />
            <text x="45" y="44" text-anchor="middle" fill="#78350f" font-family="sans-serif" font-size="8" font-weight="black">999.9 FINE GOLD</text>
          </g>
          <!-- Top Centered Bar -->
          <g transform="translate(148, 110)">
            <polygon points="0,30 30,0 120,0 90,30" fill="url(#bar1)" stroke="#fff" stroke-width="1" />
            <polygon points="90,30 120,0 120,20 90,50" fill="#92400e" />
            <rect x="0" y="30" width="90" height="20" fill="url(#bar1)" stroke="#b45309" stroke-width="1" />
            <text x="45" y="44" text-anchor="middle" fill="#78350f" font-family="sans-serif" font-size="8" font-weight="black">AKM TREASURY</text>
          </g>

          <!-- Golden Trust Stamps -->
          <g transform="translate(16, 16)">
            <rect width="165" height="28" rx="14" fill="#000" fill-opacity="0.8" stroke="#f59e0b" stroke-width="1.2" />
            <text x="82" y="18" text-anchor="middle" fill="#fde047" font-family="sans-serif" font-size="8.5" font-weight="900">⚡ 2-DAY SPECIAL HARVEST</text>
          </g>
          <g transform="translate(255, 16)">
            <rect width="129" height="28" rx="14" fill="#000" fill-opacity="0.8" stroke="#10b981" stroke-width="1.2" />
            <text x="64" y="18" text-anchor="middle" fill="#34d399" font-family="monospace" font-size="8.5" font-weight="900">HIGH RETURN 600%</text>
          </g>

          <rect x="16" y="246" width="368" height="38" rx="10" fill="#000" fill-opacity="0.85" stroke="#f59e0b" stroke-width="1" />
          <text x="30" y="263" fill="#fde047" font-family="monospace" font-size="9.5" font-weight="bold">SPECIAL BULLION HARVEST RESERVE</text>
          <text x="30" y="276" fill="#94a3b8" font-family="sans-serif" font-size="8.5">DAILY PAYOUT ₹4,354 • 2 DAYS COMPLETE RETURN</text>
          <rect x="272" y="253" width="100" height="24" rx="6" fill="#d97706" />
          <text x="322" y="269" text-anchor="middle" fill="#ffffff" font-family="monospace" font-size="9" font-weight="900">₹4,354 / DAY</text>
        </svg>
      `)}`;

    // ----------------------------------------------------
    // VIP PLANS (Sovereign Vault & Diamond Treasury)
    // ----------------------------------------------------
    case 'plan-vip-1':
      return `data:image/svg+xml;utf8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
          <defs>
            <linearGradient id="bgVip1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#021c11" />
              <stop offset="50%" stop-color="#14532d" />
              <stop offset="100%" stop-color="#052e16" />
            </linearGradient>
            <linearGradient id="plat1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#f8fafc" />
              <stop offset="50%" stop-color="#cbd5e1" />
              <stop offset="100%" stop-color="#64748b" />
            </linearGradient>
            <linearGradient id="goldVip1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#fef08a" />
              <stop offset="50%" stop-color="#eab308" />
              <stop offset="100%" stop-color="#854d0e" />
            </linearGradient>
          </defs>
          <rect width="400" height="300" fill="url(#bgVip1)" />
          
          <!-- Titanium Vault Door -->
          <circle cx="200" cy="140" r="95" fill="url(#plat1)" stroke="url(#goldVip1)" stroke-width="8" />
          <circle cx="200" cy="140" r="80" fill="#0f172a" stroke="#34d399" stroke-width="3" />
          <!-- Heavy Spokes -->
          ${[0, 45, 90, 135, 180, 225, 270, 315]
            .map(
              (deg) => `
            <line x1="200" y1="140" x2="200" y2="70" stroke="url(#goldVip1)" stroke-width="6" stroke-linecap="round" transform="rotate(${deg} 200 140)" />
          `
            )
            .join('')}
          <circle cx="200" cy="140" r="32" fill="url(#goldVip1)" stroke="#fff" stroke-width="3" />
          <text x="200" y="145" text-anchor="middle" fill="#78350f" font-family="sans-serif" font-size="12" font-weight="black">VIP 1</text>
          
          <!-- Crown Crest on Top -->
          <path d="M 175 60 L 185 75 L 200 55 L 215 75 L 225 60 L 225 80 L 175 80 Z" fill="url(#goldVip1)" stroke="#fff" stroke-width="1.5" />

          <!-- Trust Badges -->
          <g transform="translate(16, 16)">
            <rect width="165" height="28" rx="14" fill="#000" fill-opacity="0.8" stroke="#f59e0b" stroke-width="1.2" />
            <text x="82" y="18" text-anchor="middle" fill="#fde047" font-family="sans-serif" font-size="8.5" font-weight="900">👑 VIP 1 EXCLUSIVE TIER</text>
          </g>
          <g transform="translate(255, 16)">
            <rect width="129" height="28" rx="14" fill="#000" fill-opacity="0.8" stroke="#10b981" stroke-width="1.2" />
            <text x="64" y="18" text-anchor="middle" fill="#34d399" font-family="monospace" font-size="8.5" font-weight="900">1-DAY SETTLED</text>
          </g>

          <rect x="16" y="246" width="368" height="38" rx="10" fill="#000" fill-opacity="0.85" stroke="#f59e0b" stroke-width="1" />
          <text x="30" y="263" fill="#fde047" font-family="monospace" font-size="9.5" font-weight="bold">AKM WEALTH MATRIX • VIP 1</text>
          <text x="30" y="276" fill="#94a3b8" font-family="sans-serif" font-size="8.5">SOVEREIGN ESCROW VAULT • INSTANT SETTLEMENT</text>
          <rect x="272" y="253" width="100" height="24" rx="6" fill="#ca8a04" />
          <text x="322" y="269" text-anchor="middle" fill="#000" font-family="monospace" font-size="9" font-weight="900">₹2,200 / DAY</text>
        </svg>
      `)}`;

    case 'plan-vip-2':
      return `data:image/svg+xml;utf8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
          <defs>
            <linearGradient id="bgVip2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#021c11" />
              <stop offset="50%" stop-color="#064e3b" />
              <stop offset="100%" stop-color="#020617" />
            </linearGradient>
            <linearGradient id="diamond" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#ffffff" />
              <stop offset="50%" stop-color="#38bdf8" />
              <stop offset="100%" stop-color="#0284c7" />
            </linearGradient>
            <linearGradient id="gold2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#fef08a" />
              <stop offset="50%" stop-color="#eab308" />
              <stop offset="100%" stop-color="#854d0e" />
            </linearGradient>
          </defs>
          <rect width="400" height="300" fill="url(#bgVip2)" />
          
          <!-- Master Diamond Cut Sovereign Vault -->
          <circle cx="200" cy="140" r="95" fill="#0f172a" stroke="url(#gold2)" stroke-width="7" />
          <circle cx="200" cy="140" r="82" fill="#022c22" stroke="#38bdf8" stroke-width="2" />
          <!-- Sparkling Diamond In Center -->
          <polygon points="200,95 240,130 200,180 160,130" fill="url(#diamond)" stroke="#fff" stroke-width="2" />
          <polygon points="175,130 200,95 225,130" fill="#ffffff" fill-opacity="0.8" />
          <polygon points="175,130 200,180 225,130" fill="#0284c7" fill-opacity="0.6" />
          
          <!-- Sovereign Crown on Top -->
          <path d="M 170 50 L 180 65 L 200 45 L 220 65 L 230 50 L 230 72 L 170 72 Z" fill="url(#gold2)" stroke="#fff" stroke-width="1.5" />
          <circle cx="200" cy="45" r="4" fill="#38bdf8" />

          <!-- Top Trust Badges -->
          <g transform="translate(16, 16)">
            <rect width="175" height="28" rx="14" fill="#000" fill-opacity="0.8" stroke="#38bdf8" stroke-width="1.2" />
            <text x="87" y="18" text-anchor="middle" fill="#bae6fd" font-family="sans-serif" font-size="8.5" font-weight="900">💎 VIP 2 DIAMOND VAULT</text>
          </g>
          <g transform="translate(255, 16)">
            <rect width="129" height="28" rx="14" fill="#000" fill-opacity="0.8" stroke="#f59e0b" stroke-width="1.2" />
            <text x="64" y="18" text-anchor="middle" fill="#fde047" font-family="monospace" font-size="8.5" font-weight="900">3-DAYS MATURITY</text>
          </g>

          <rect x="16" y="246" width="368" height="38" rx="10" fill="#000" fill-opacity="0.85" stroke="#38bdf8" stroke-width="1" />
          <text x="30" y="263" fill="#38bdf8" font-family="monospace" font-size="9.5" font-weight="bold">SOVEREIGN ULTRA • DIAMOND CUSTODY</text>
          <text x="30" y="276" fill="#94a3b8" font-family="sans-serif" font-size="8.5">DAILY RETURN ₹8,500 • TOTAL PROFIT ₹25,500</text>
          <rect x="272" y="253" width="100" height="24" rx="6" fill="#0284c7" />
          <text x="322" y="269" text-anchor="middle" fill="#ffffff" font-family="monospace" font-size="9" font-weight="900">₹8,500 / DAY</text>
        </svg>
      `)}`;

    // ----------------------------------------------------
    // TURBO PLANS (1M to 60M)
    // ----------------------------------------------------
    case 'plan-turbo-1m':
      // 1 Minute Flash Express: High-Speed Electric Kinetic Turbine
      return `data:image/svg+xml;utf8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
          <defs>
            <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#021c11" />
              <stop offset="50%" stop-color="#063d27" />
              <stop offset="100%" stop-color="#01140c" />
            </linearGradient>
            <radialGradient id="plasma" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#34d399" stop-opacity="0.9" />
              <stop offset="40%" stop-color="#10b981" stop-opacity="0.4" />
              <stop offset="100%" stop-color="#064e3b" stop-opacity="0" />
            </radialGradient>
            <linearGradient id="metal" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#334155" />
              <stop offset="30%" stop-color="#94a3b8" />
              <stop offset="50%" stop-color="#f8fafc" />
              <stop offset="70%" stop-color="#94a3b8" />
              <stop offset="100%" stop-color="#1e293b" />
            </linearGradient>
            <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#fbbf24" />
              <stop offset="50%" stop-color="#f59e0b" />
              <stop offset="100%" stop-color="#b45309" />
            </linearGradient>
          </defs>
          <rect width="400" height="300" fill="url(#bg)" />
          <circle cx="200" cy="140" r="90" fill="url(#plasma)" />
          <circle cx="200" cy="140" r="75" fill="none" stroke="url(#metal)" stroke-width="14" stroke-dasharray="14 6" />
          <circle cx="200" cy="140" r="60" fill="#0f172a" stroke="#34d399" stroke-width="3" />
          <g transform="translate(200, 140)">
            ${[0, 45, 90, 135, 180, 225, 270, 315]
              .map(
                (deg) => `
              <path d="M 0,0 L 15,-48 C 22,-38 12,-18 0,0 Z" fill="url(#metal)" transform="rotate(${deg})" opacity="0.9" />
              <path d="M 0,0 L 8,-48" stroke="#34d399" stroke-width="1.5" transform="rotate(${deg})" />
            `
              )
              .join('')}
            <circle cx="0" cy="0" r="22" fill="url(#gold)" stroke="#fff" stroke-width="2" />
            <circle cx="0" cy="0" r="8" fill="#021c11" />
          </g>

          <g transform="translate(16, 16)">
            <rect width="145" height="28" rx="14" fill="#000" fill-opacity="0.8" stroke="#10b981" stroke-width="1.2" />
            <text x="72" y="18" text-anchor="middle" fill="#34d399" font-family="sans-serif" font-size="8.5" font-weight="900">⚡ 1-MIN FLASH SETTLE</text>
          </g>
          <g transform="translate(255, 16)">
            <rect width="129" height="28" rx="14" fill="#000" fill-opacity="0.8" stroke="#f59e0b" stroke-width="1.2" />
            <text x="64" y="18" text-anchor="middle" fill="#fde047" font-family="monospace" font-size="8.5" font-weight="900">24,000 RPM</text>
          </g>

          <rect x="16" y="246" width="368" height="38" rx="10" fill="#000" fill-opacity="0.85" stroke="#34d399" stroke-width="1" />
          <text x="30" y="263" fill="#34d399" font-family="monospace" font-size="9.5" font-weight="bold">FLASH EXPRESS 1M • KINETIC TURBINE</text>
          <text x="30" y="276" fill="#94a3b8" font-family="sans-serif" font-size="8.5">ACCELERATED YIELD • RETURN IN 60 SECONDS</text>
          <rect x="272" y="253" width="100" height="24" rx="6" fill="#059669" />
          <text x="322" y="269" text-anchor="middle" fill="#ffffff" font-family="monospace" font-size="9" font-weight="900">₹250 RETURN</text>
        </svg>
      `)}`;

    case 'plan-turbo-3m':
      // 3 Minutes Turbo Speed: Robotic Automation CNC Laser Unit
      return `data:image/svg+xml;utf8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
          <defs>
            <linearGradient id="bg3m" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#0a192f" />
              <stop offset="50%" stop-color="#06382b" />
              <stop offset="100%" stop-color="#051c14" />
            </linearGradient>
            <linearGradient id="arm" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#e2e8f0" />
              <stop offset="50%" stop-color="#94a3b8" />
              <stop offset="100%" stop-color="#475569" />
            </linearGradient>
          </defs>
          <rect width="400" height="300" fill="url(#bg3m)" />
          
          <rect x="70" y="190" width="90" height="40" rx="6" fill="#1e293b" stroke="#059669" stroke-width="2" />
          <circle cx="115" cy="190" r="24" fill="#334155" stroke="#f59e0b" stroke-width="3" />
          <path d="M 115 190 L 170 100" stroke="url(#arm)" stroke-width="18" stroke-linecap="round" />
          <circle cx="170" cy="100" r="14" fill="#0f172a" stroke="#10b981" stroke-width="4" />
          <path d="M 170 100 L 245 130" stroke="url(#arm)" stroke-width="14" stroke-linecap="round" />
          <circle cx="245" cy="130" r="10" fill="#0f172a" stroke="#f59e0b" stroke-width="3" />
          <line x1="265" y1="185" x2="265" y2="240" stroke="#34d399" stroke-width="3" stroke-linecap="round" />
          <circle cx="265" cy="240" r="16" fill="#34d399" fill-opacity="0.4" />
          <circle cx="265" cy="240" r="6" fill="#fef08a" />

          <g transform="translate(16, 16)">
            <rect width="150" height="28" rx="14" fill="#000" fill-opacity="0.8" stroke="#10b981" stroke-width="1.2" />
            <text x="75" y="18" text-anchor="middle" fill="#34d399" font-family="sans-serif" font-size="8.5" font-weight="900">⚡ 3-MIN LASER CELL</text>
          </g>
          <g transform="translate(255, 16)">
            <rect width="129" height="28" rx="14" fill="#000" fill-opacity="0.8" stroke="#38bdf8" stroke-width="1.2" />
            <text x="64" y="18" text-anchor="middle" fill="#bae6fd" font-family="monospace" font-size="8.5" font-weight="900">AUTOMATION</text>
          </g>

          <rect x="16" y="246" width="368" height="38" rx="10" fill="#000" fill-opacity="0.85" stroke="#10b981" stroke-width="1" />
          <text x="30" y="263" fill="#34d399" font-family="monospace" font-size="9.5" font-weight="bold">AI ROBOTIC CNC CELL 3M</text>
          <text x="30" y="276" fill="#94a3b8" font-family="sans-serif" font-size="8.5">HIGH PRECISION AUTOMATION • 3 MIN RETURN</text>
          <rect x="272" y="253" width="100" height="24" rx="6" fill="#059669" />
          <text x="322" y="269" text-anchor="middle" fill="#ffffff" font-family="monospace" font-size="9" font-weight="900">₹660 RETURN</text>
        </svg>
      `)}`;

    case 'plan-turbo-5m':
      // 5 Minutes Quick Harvest: Agri-Harvest Eco Harvester Unit
      return `data:image/svg+xml;utf8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
          <defs>
            <linearGradient id="bg5m" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#064e3b" />
              <stop offset="60%" stop-color="#065f46" />
              <stop offset="100%" stop-color="#022c22" />
            </linearGradient>
          </defs>
          <rect width="400" height="300" fill="url(#bg5m)" />
          
          <rect x="130" y="140" width="140" height="70" rx="12" fill="#047857" stroke="#34d399" stroke-width="2" />
          <circle cx="155" cy="215" r="28" fill="#1e293b" stroke="#e2e8f0" stroke-width="5" />
          <circle cx="155" cy="215" r="12" fill="#059669" />
          <circle cx="245" cy="215" r="28" fill="#1e293b" stroke="#e2e8f0" stroke-width="5" />
          <circle cx="245" cy="215" r="12" fill="#059669" />

          <g transform="translate(16, 16)">
            <rect width="150" height="28" rx="14" fill="#000" fill-opacity="0.8" stroke="#f59e0b" stroke-width="1.2" />
            <text x="75" y="18" text-anchor="middle" fill="#fde047" font-family="sans-serif" font-size="8.5" font-weight="900">🔥 5-MIN HARVEST</text>
          </g>
          <g transform="translate(255, 16)">
            <rect width="129" height="28" rx="14" fill="#000" fill-opacity="0.8" stroke="#10b981" stroke-width="1.2" />
            <text x="64" y="18" text-anchor="middle" fill="#34d399" font-family="monospace" font-size="8.5" font-weight="900">VERIFIED AGRI</text>
          </g>

          <rect x="16" y="246" width="368" height="38" rx="10" fill="#000" fill-opacity="0.85" stroke="#f59e0b" stroke-width="1" />
          <text x="30" y="263" fill="#fde047" font-family="monospace" font-size="9.5" font-weight="bold">AGRI-HARVEST ECO UNIT 5M</text>
          <text x="30" y="276" fill="#94a3b8" font-family="sans-serif" font-size="8.5">AUTOMATED SOLAR HARVESTER • RAPID 5 MIN RETURN</text>
          <rect x="272" y="253" width="100" height="24" rx="6" fill="#d97706" />
          <text x="322" y="269" text-anchor="middle" fill="#ffffff" font-family="monospace" font-size="9" font-weight="900">₹1,400 RETURN</text>
        </svg>
      `)}`;

    case 'plan-turbo-10m':
      // 10 Minutes: Industrial Wind Turbine Array & Power Substation
      return `data:image/svg+xml;utf8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
          <defs>
            <linearGradient id="sky10" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#0f172a" />
              <stop offset="60%" stop-color="#064e3b" />
              <stop offset="100%" stop-color="#022c22" />
            </linearGradient>
            <linearGradient id="blade" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#ffffff" />
              <stop offset="100%" stop-color="#94a3b8" />
            </linearGradient>
          </defs>
          <rect width="400" height="300" fill="url(#sky10)" />
          <polygon points="196,110 204,110 208,270 192,270" fill="#cbd5e1" stroke="#475569" stroke-width="1" />
          <circle cx="200" cy="110" r="12" fill="#e2e8f0" stroke="#334155" stroke-width="2" />
          <path d="M 200 110 L 200 15 C 203 15 208 60 204 110 Z" fill="url(#blade)" />
          <path d="M 200 110 L 115 155 C 117 158 155 140 200 110 Z" fill="url(#blade)" />
          <path d="M 200 110 L 285 155 C 283 158 245 140 200 110 Z" fill="url(#blade)" />
          <circle cx="200" cy="110" r="6" fill="#f59e0b" />

          <g transform="translate(16, 16)">
            <rect width="150" height="28" rx="14" fill="#000" fill-opacity="0.8" stroke="#10b981" stroke-width="1.2" />
            <text x="75" y="18" text-anchor="middle" fill="#34d399" font-family="sans-serif" font-size="8.5" font-weight="900">⚡ 10-MIN POWER GRID</text>
          </g>
          <g transform="translate(255, 16)">
            <rect width="129" height="28" rx="14" fill="#000" fill-opacity="0.8" stroke="#f59e0b" stroke-width="1.2" />
            <text x="64" y="18" text-anchor="middle" fill="#fde047" font-family="monospace" font-size="8.5" font-weight="900">CLEAN ENERGY</text>
          </g>

          <rect x="16" y="246" width="368" height="38" rx="10" fill="#000" fill-opacity="0.85" stroke="#10b981" stroke-width="1" />
          <text x="30" y="263" fill="#34d399" font-family="monospace" font-size="9.5" font-weight="bold">TURBO 10M POWER GRID UNIT</text>
          <text x="30" y="276" fill="#94a3b8" font-family="sans-serif" font-size="8.5">WIND SUBSTATION INFRASTRUCTURE • RETURN IN 10 MIN</text>
          <rect x="272" y="253" width="100" height="24" rx="6" fill="#047857" />
          <text x="322" y="269" text-anchor="middle" fill="#ffffff" font-family="monospace" font-size="9" font-weight="900">₹3,000 RETURN</text>
        </svg>
      `)}`;

    case 'plan-turbo-15m':
      // 15 Minutes Power Wheel: Heavy Industrial Rotary Gear & Hydraulic Turbine
      return `data:image/svg+xml;utf8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
          <defs>
            <linearGradient id="bg15" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#18181b" />
              <stop offset="50%" stop-color="#0f291e" />
              <stop offset="100%" stop-color="#09090b" />
            </linearGradient>
            <linearGradient id="bronze" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#fbbf24" />
              <stop offset="40%" stop-color="#d97706" />
              <stop offset="100%" stop-color="#78350f" />
            </linearGradient>
          </defs>
          <rect width="400" height="300" fill="url(#bg15)" />
          <g transform="translate(200, 140)">
            <circle cx="0" cy="0" r="85" fill="none" stroke="url(#bronze)" stroke-width="18" />
            ${Array.from({ length: 16 })
              .map(
                (_, i) => `
              <rect x="-9" y="-102" width="18" height="18" rx="2" fill="url(#bronze)" transform="rotate(${i * 22.5})" />
            `
              )
              .join('')}
            <circle cx="0" cy="0" r="58" fill="#18181b" stroke="#34d399" stroke-width="3" />
            <circle cx="0" cy="0" r="28" fill="url(#bronze)" stroke="#fff" stroke-width="2" />
            <circle cx="0" cy="0" r="10" fill="#000" />
          </g>

          <g transform="translate(16, 16)">
            <rect width="160" height="28" rx="14" fill="#000" fill-opacity="0.8" stroke="#f59e0b" stroke-width="1.2" />
            <text x="80" y="18" text-anchor="middle" fill="#fde047" font-family="sans-serif" font-size="8.5" font-weight="900">🚀 15-MIN POWER WHEEL</text>
          </g>
          <g transform="translate(255, 16)">
            <rect width="129" height="28" rx="14" fill="#000" fill-opacity="0.8" stroke="#10b981" stroke-width="1.2" />
            <text x="64" y="18" text-anchor="middle" fill="#34d399" font-family="monospace" font-size="8.5" font-weight="900">HEAVY ROTARY</text>
          </g>

          <rect x="16" y="246" width="368" height="38" rx="10" fill="#000" fill-opacity="0.85" stroke="#f59e0b" stroke-width="1" />
          <text x="30" y="263" fill="#fde047" font-family="monospace" font-size="9.5" font-weight="bold">HEAVY ROTARY GEAR ASSET 15M</text>
          <text x="30" y="276" fill="#94a3b8" font-family="sans-serif" font-size="8.5">HIGH TORQUE HYDRAULIC WHEEL • 15 MIN RETURN</text>
          <rect x="272" y="253" width="100" height="24" rx="6" fill="#d97706" />
          <text x="322" y="269" text-anchor="middle" fill="#ffffff" font-family="monospace" font-size="9" font-weight="900">₹5,600 RETURN</text>
        </svg>
      `)}`;

    case 'plan-turbo-30m':
      // 30 Minutes Super Charge: Megawatt Battery Storage Grid
      return `data:image/svg+xml;utf8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
          <defs>
            <linearGradient id="bg30" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#042f2e" />
              <stop offset="50%" stop-color="#021c11" />
              <stop offset="100%" stop-color="#0f172a" />
            </linearGradient>
            <linearGradient id="batteryCell" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#34d399" />
              <stop offset="50%" stop-color="#10b981" />
              <stop offset="100%" stop-color="#047857" />
            </linearGradient>
          </defs>
          <rect width="400" height="300" fill="url(#bg30)" />
          ${[0, 1, 2, 3]
            .map(
              (i) => `
            <g transform="translate(${55 + i * 78}, 70)">
              <rect x="0" y="0" width="64" height="150" rx="8" fill="#1e293b" stroke="#334155" stroke-width="2" />
              <rect x="22" y="-10" width="20" height="10" rx="3" fill="#f59e0b" />
              <rect x="8" y="20" width="48" height="24" rx="4" fill="url(#batteryCell)" />
              <rect x="8" y="50" width="48" height="24" rx="4" fill="url(#batteryCell)" />
              <rect x="8" y="80" width="48" height="24" rx="4" fill="url(#batteryCell)" />
              <rect x="8" y="110" width="48" height="24" rx="4" fill="url(#batteryCell)" opacity="0.8" />
              <text x="32" y="142" text-anchor="middle" fill="#a7f3d0" font-family="monospace" font-size="8" font-weight="bold">MODULE ${i + 1}</text>
            </g>
          `
            )
            .join('')}
          <line x1="60" y1="58" x2="310" y2="58" stroke="#f59e0b" stroke-width="6" stroke-linecap="round" />
          <polygon points="200,80 190,120 205,120 195,160 215,110 200,110" fill="#fef08a" stroke="#d97706" stroke-width="1.5" />

          <g transform="translate(16, 16)">
            <rect width="165" height="28" rx="14" fill="#000" fill-opacity="0.8" stroke="#10b981" stroke-width="1.2" />
            <text x="82" y="18" text-anchor="middle" fill="#34d399" font-family="sans-serif" font-size="8.5" font-weight="900">💎 30-MIN SUPERCHARGE</text>
          </g>
          <g transform="translate(255, 16)">
            <rect width="129" height="28" rx="14" fill="#000" fill-opacity="0.8" stroke="#f59e0b" stroke-width="1.2" />
            <text x="64" y="18" text-anchor="middle" fill="#fde047" font-family="monospace" font-size="8.5" font-weight="900">MEGAWATT CELL</text>
          </g>

          <rect x="16" y="246" width="368" height="38" rx="10" fill="#000" fill-opacity="0.85" stroke="#10b981" stroke-width="1" />
          <text x="30" y="263" fill="#34d399" font-family="monospace" font-size="9.5" font-weight="bold">MEGAWATT ENERGY STORAGE 30M</text>
          <text x="30" y="276" fill="#94a3b8" font-family="sans-serif" font-size="8.5">INDUSTRIAL LITHIUM CELL • 30 MIN RETURN</text>
          <rect x="272" y="253" width="100" height="24" rx="6" fill="#059669" />
          <text x="322" y="269" text-anchor="middle" fill="#ffffff" font-family="monospace" font-size="9" font-weight="900">₹8,500 RETURN</text>
        </svg>
      `)}`;

    case 'plan-turbo-45m':
      // 45 Minutes Elite Accelerator: Quantum High-Density Data Center
      return `data:image/svg+xml;utf8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
          <defs>
            <linearGradient id="bg45" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#020617" />
              <stop offset="50%" stop-color="#0f172a" />
              <stop offset="100%" stop-color="#021c11" />
            </linearGradient>
          </defs>
          <rect width="400" height="300" fill="url(#bg45)" />
          ${[0, 1, 2]
            .map(
              (i) => `
            <g transform="translate(${60 + i * 100}, 45)">
              <rect x="0" y="0" width="80" height="190" rx="6" fill="#090d16" stroke="#334155" stroke-width="2" />
              ${Array.from({ length: 9 })
                .map(
                  (_, j) => `
                <rect x="6" y="${10 + j * 19}" width="68" height="14" rx="2" fill="#1e293b" stroke="#0f172a" stroke-width="1" />
                <circle cx="14" cy="${17 + j * 19}" r="2.5" fill="${j % 2 === 0 ? '#10b981' : '#38bdf8'}" />
                <circle cx="22" cy="${17 + j * 19}" r="2.5" fill="#f59e0b" />
                <line x1="32" y1="${17 + j * 19}" x2="68" y2="${17 + j * 19}" stroke="#475569" stroke-width="1.5" stroke-dasharray="3 2" />
              `
                )
                .join('')}
            </g>
          `
            )
            .join('')}

          <g transform="translate(16, 16)">
            <rect width="165" height="28" rx="14" fill="#000" fill-opacity="0.8" stroke="#38bdf8" stroke-width="1.2" />
            <text x="82" y="18" text-anchor="middle" fill="#bae6fd" font-family="sans-serif" font-size="8.5" font-weight="900">👑 45-MIN QUANTUM CELL</text>
          </g>
          <g transform="translate(255, 16)">
            <rect width="129" height="28" rx="14" fill="#000" fill-opacity="0.8" stroke="#10b981" stroke-width="1.2" />
            <text x="64" y="18" text-anchor="middle" fill="#34d399" font-family="monospace" font-size="8.5" font-weight="900">AI COMPUTE</text>
          </g>

          <rect x="16" y="246" width="368" height="38" rx="10" fill="#000" fill-opacity="0.85" stroke="#38bdf8" stroke-width="1" />
          <text x="30" y="263" fill="#38bdf8" font-family="monospace" font-size="9.5" font-weight="bold">QUANTUM COMPUTE MATRIX 45M</text>
          <text x="30" y="276" fill="#94a3b8" font-family="sans-serif" font-size="8.5">HIGH-DENSITY DATA CLUSTER • 45 MIN RETURN</text>
          <rect x="272" y="253" width="100" height="24" rx="6" fill="#0284c7" />
          <text x="322" y="269" text-anchor="middle" fill="#ffffff" font-family="monospace" font-size="9" font-weight="900">₹13,500 RETURN</text>
        </svg>
      `)}`;

    case 'plan-turbo-60m':
      // 60 Minutes (1 Hour) Titan Master: Heavy Hydraulic Excavator / Earthmover
      return `data:image/svg+xml;utf8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
          <defs>
            <linearGradient id="bg60" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#1c1917" />
              <stop offset="50%" stop-color="#042f2e" />
              <stop offset="100%" stop-color="#0c0a09" />
            </linearGradient>
            <linearGradient id="yellow" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#facc15" />
              <stop offset="100%" stop-color="#ca8a04" />
            </linearGradient>
          </defs>
          <rect width="400" height="300" fill="url(#bg60)" />
          <rect x="70" y="200" width="220" height="42" rx="20" fill="#292524" stroke="#44403c" stroke-width="3" />
          ${Array.from({ length: 6 })
            .map((_, i) => `<circle cx="${100 + i * 32}" cy="221" r="14" fill="#0c0a09" stroke="#78716c" stroke-width="3" />`)
            .join('')}
          <rect x="110" y="145" width="110" height="60" rx="8" fill="url(#yellow)" stroke="#854d0e" stroke-width="2" />
          <polygon points="175,150 215,150 215,185 175,185" fill="#38bdf8" fill-opacity="0.7" stroke="#1e293b" stroke-width="2" />
          <path d="M 210 165 L 290 80" stroke="url(#yellow)" stroke-width="16" stroke-linecap="round" />
          <circle cx="290" cy="80" r="10" fill="#1c1917" stroke="#fff" stroke-width="2" />
          <path d="M 290 80 L 340 135" stroke="url(#yellow)" stroke-width="12" stroke-linecap="round" />
          <path d="M 340 135 L 365 170 C 360 185 330 185 325 160 Z" fill="#44403c" stroke="#1c1917" stroke-width="2" />

          <g transform="translate(16, 16)">
            <rect width="165" height="28" rx="14" fill="#000" fill-opacity="0.8" stroke="#facc15" stroke-width="1.2" />
            <text x="82" y="18" text-anchor="middle" fill="#fef08a" font-family="sans-serif" font-size="8.5" font-weight="900">⚡ 1-HOUR TITAN MASTER</text>
          </g>
          <g transform="translate(255, 16)">
            <rect width="129" height="28" rx="14" fill="#000" fill-opacity="0.8" stroke="#10b981" stroke-width="1.2" />
            <text x="64" y="18" text-anchor="middle" fill="#34d399" font-family="monospace" font-size="8.5" font-weight="900">HEAVY MINING</text>
          </g>

          <rect x="16" y="246" width="368" height="38" rx="10" fill="#000" fill-opacity="0.85" stroke="#facc15" stroke-width="1" />
          <text x="30" y="263" fill="#facc15" font-family="monospace" font-size="9.5" font-weight="bold">TITAN MASTER HEAVY ASSET 60M</text>
          <text x="30" y="276" fill="#94a3b8" font-family="sans-serif" font-size="8.5">HEAVY EARTHMOVER INFRASTRUCTURE • 1 HOUR RETURN</text>
          <rect x="272" y="253" width="100" height="24" rx="6" fill="#ca8a04" />
          <text x="322" y="269" text-anchor="middle" fill="#000000" font-family="monospace" font-size="9" font-weight="900">₹19,000 RETURN</text>
        </svg>
      `)}`;

    default:
      // High-End Industrial Equipment Engine (Fallback with Trust Badges)
      return `data:image/svg+xml;utf8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
          <defs>
            <linearGradient id="bgDef" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#042f2e" />
              <stop offset="50%" stop-color="#064e3b" />
              <stop offset="100%" stop-color="#021c11" />
            </linearGradient>
            <linearGradient id="mfg" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#334155" />
              <stop offset="50%" stop-color="#94a3b8" />
              <stop offset="100%" stop-color="#1e293b" />
            </linearGradient>
          </defs>
          <rect width="400" height="300" fill="url(#bgDef)" />
          <circle cx="200" cy="140" r="85" fill="#022c22" stroke="#34d399" stroke-width="2" />
          <rect x="120" y="110" width="160" height="70" rx="10" fill="url(#mfg)" stroke="#34d399" stroke-width="2" />
          <circle cx="150" cy="180" r="28" fill="#0f172a" stroke="#cbd5e1" stroke-width="6" />
          <circle cx="150" cy="180" r="10" fill="#f59e0b" />
          <circle cx="250" cy="180" r="28" fill="#0f172a" stroke="#cbd5e1" stroke-width="6" />
          <circle cx="250" cy="180" r="10" fill="#f59e0b" />
          <polygon points="140,110 190,110 210,80 160,80" fill="#38bdf8" fill-opacity="0.6" stroke="#fff" stroke-width="1.5" />
          
          <g transform="translate(16, 16)">
            <rect width="145" height="28" rx="14" fill="#000" fill-opacity="0.8" stroke="#10b981" stroke-width="1.2" />
            <text x="72" y="18" text-anchor="middle" fill="#34d399" font-family="sans-serif" font-size="8.5" font-weight="900">🛡️ 100% CAPITAL SECURE</text>
          </g>
          <rect x="16" y="246" width="368" height="38" rx="10" fill="#000" fill-opacity="0.85" stroke="#34d399" stroke-width="1" />
          <text x="30" y="263" fill="#34d399" font-family="monospace" font-size="9.5" font-weight="bold">BKT INDUSTRIAL ASSET</text>
          <text x="30" y="276" fill="#94a3b8" font-family="sans-serif" font-size="8.5">GOVT REGISTERED • AUTOMATED DAILY DIVIDEND</text>
        </svg>
      `)}`;
  }
}

interface ProductVisualProps {
  plan: Plan;
  className?: string;
}

export const ProductVisual: React.FC<ProductVisualProps> = ({ plan, className = 'w-full h-full object-cover' }) => {
  const artworkSrc = getProductArtworkDataUri(plan.id, plan.category);

  return (
    <img
      src={artworkSrc}
      alt={plan.title}
      referrerPolicy="no-referrer"
      loading="lazy"
      className={className}
    />
  );
};
