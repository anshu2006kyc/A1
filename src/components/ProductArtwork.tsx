import React from 'react';
import { Plan } from '../types';

/**
 * Returns a high-fidelity SVG Data URI specifically designed for each AKM product.
 * These load instantaneously (0ms), have zero external network dependencies,
 * and provide ultra-sharp 4:3 industrial equipment and wealth asset illustrations.
 */
export function getProductArtworkDataUri(planId: string, category: string = 'normal'): string {
  switch (planId) {
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
          <!-- Tech grid lines -->
          <g stroke="#10b981" stroke-width="0.75" stroke-opacity="0.25">
            <line x1="0" y1="50" x2="400" y2="50" />
            <line x1="0" y1="100" x2="400" y2="100" />
            <line x1="0" y1="150" x2="400" y2="150" />
            <line x1="0" y1="200" x2="400" y2="200" />
            <line x1="0" y1="250" x2="400" y2="250" />
            <line x1="80" y1="0" x2="80" y2="300" />
            <line x1="160" y1="0" x2="160" y2="300" />
            <line x1="240" y1="0" x2="240" y2="300" />
            <line x1="320" y1="0" x2="320" y2="300" />
          </g>
          <!-- Glowing Plasma Core -->
          <circle cx="200" cy="140" r="90" fill="url(#plasma)" />
          <!-- Outer Turbine Casing -->
          <circle cx="200" cy="140" r="75" fill="none" stroke="url(#metal)" stroke-width="14" stroke-dasharray="14 6" />
          <circle cx="200" cy="140" r="60" fill="#0f172a" stroke="#34d399" stroke-width="3" />
          <!-- Turbine Blades -->
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
          <!-- Velocity Lightning Stream -->
          <path d="M 40,140 Q 120,110 200,140 T 360,140" fill="none" stroke="#6ee7b7" stroke-width="2" opacity="0.6" stroke-dasharray="8 4" />
          <path d="M 50,165 Q 130,135 210,165 T 350,165" fill="none" stroke="#fbbf24" stroke-width="1.5" opacity="0.5" stroke-dasharray="6 6" />
          <!-- Hardware Specs Overlay -->
          <rect x="20" y="240" width="160" height="38" rx="8" fill="#000" fill-opacity="0.6" stroke="#10b981" stroke-width="1" />
          <text x="32" y="256" fill="#34d399" font-family="monospace" font-size="9" font-weight="bold">FLASH EXPRESS 1M</text>
          <text x="32" y="270" fill="#e2e8f0" font-family="monospace" font-size="8">ROTOR: 24,000 RPM</text>
          <rect x="260" y="240" width="120" height="38" rx="8" fill="#000" fill-opacity="0.6" stroke="#fbbf24" stroke-width="1" />
          <text x="272" y="256" fill="#fbbf24" font-family="monospace" font-size="9" font-weight="bold">CYCLE SPEED</text>
          <text x="272" y="270" fill="#34d399" font-family="monospace" font-size="8">EFFICIENCY 99.4%</text>
        </svg>
      `)}`;

    case 'plan-turbo-3m':
      // 3 Minutes Turbo Speed: Robotic Automation Arm & CNC Laser Unit
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
            <linearGradient id="laser" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#34d399" />
              <stop offset="100%" stop-color="#a7f3d0" />
            </linearGradient>
          </defs>
          <rect width="400" height="300" fill="url(#bg3m)" />
          <!-- Grid Floor Isometric -->
          <g stroke="#059669" stroke-width="0.8" stroke-opacity="0.3">
            <path d="M 0 200 L 400 200 M 0 230 L 400 230 M 0 260 L 400 260 M 0 290 L 400 290" />
            <path d="M 40 180 L 10 300 M 120 180 L 90 300 M 200 180 L 170 300 M 280 180 L 250 300 M 360 180 L 330 300" />
          </g>
          <!-- Robotic Arm Base Station -->
          <rect x="70" y="190" width="90" height="40" rx="6" fill="#1e293b" stroke="#059669" stroke-width="2" />
          <circle cx="115" cy="190" r="24" fill="#334155" stroke="#f59e0b" stroke-width="3" />
          <!-- Main Arm Joint 1 -->
          <path d="M 115 190 L 170 100" stroke="url(#arm)" stroke-width="18" stroke-linecap="round" />
          <circle cx="170" cy="100" r="14" fill="#0f172a" stroke="#10b981" stroke-width="4" />
          <!-- Main Arm Joint 2 -->
          <path d="M 170 100 L 245 130" stroke="url(#arm)" stroke-width="14" stroke-linecap="round" />
          <circle cx="245" cy="130" r="10" fill="#0f172a" stroke="#f59e0b" stroke-width="3" />
          <!-- Laser Tool Head -->
          <path d="M 245 130 L 265 170" stroke="#64748b" stroke-width="10" stroke-linecap="square" />
          <polygon points="260,170 270,170 268,185 262,185" fill="#f59e0b" />
          <!-- Laser Beam Focus -->
          <line x1="265" y1="185" x2="265" y2="240" stroke="#34d399" stroke-width="3" stroke-linecap="round" />
          <line x1="265" y1="185" x2="265" y2="240" stroke="#fff" stroke-width="1.2" />
          <circle cx="265" cy="240" r="16" fill="#34d399" fill-opacity="0.4" />
          <circle cx="265" cy="240" r="6" fill="#fef08a" />
          <!-- Workpiece on Bed -->
          <rect x="220" y="235" width="90" height="20" rx="3" fill="#334155" stroke="#94a3b8" stroke-width="1" />
          <!-- Sparks -->
          <line x1="265" y1="240" x2="250" y2="225" stroke="#fbbf24" stroke-width="2" />
          <line x1="265" y1="240" x2="280" y2="228" stroke="#fbbf24" stroke-width="1.5" />
          <line x1="265" y1="240" x2="272" y2="252" stroke="#34d399" stroke-width="2" />
          <!-- Status Pill -->
          <rect x="20" y="20" width="170" height="32" rx="16" fill="#000" fill-opacity="0.7" stroke="#10b981" stroke-width="1" />
          <circle cx="36" cy="36" r="5" fill="#10b981" />
          <text x="50" y="40" fill="#e2e8f0" font-family="sans-serif" font-size="10" font-weight="bold">AI ROBOTIC CELL 3M</text>
        </svg>
      `)}`;

    case 'plan-turbo-5m':
      // 5 Minutes Quick Harvest: Automated Solar Eco Greenhouse Harvester
      return `data:image/svg+xml;utf8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
          <defs>
            <linearGradient id="bg5m" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#064e3b" />
              <stop offset="60%" stop-color="#065f46" />
              <stop offset="100%" stop-color="#022c22" />
            </linearGradient>
            <linearGradient id="crop" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#fde047" />
              <stop offset="100%" stop-color="#ca8a04" />
            </linearGradient>
          </defs>
          <rect width="400" height="300" fill="url(#bg5m)" />
          <!-- Greenhouse Architecture Arches -->
          <path d="M 40 220 Q 200 40 360 220" fill="none" stroke="#a7f3d0" stroke-width="4" stroke-opacity="0.3" />
          <path d="M 80 220 Q 200 80 320 220" fill="none" stroke="#a7f3d0" stroke-width="2" stroke-opacity="0.2" />
          <!-- Solar Array Panels on Top -->
          <g fill="#1e293b" stroke="#38bdf8" stroke-width="1.5">
            <polygon points="140,50 190,45 190,75 140,80" />
            <polygon points="210,45 260,50 260,80 210,75" />
          </g>
          <!-- Smart Harvester Tractor Unit -->
          <rect x="130" y="140" width="140" height="70" rx="12" fill="#047857" stroke="#34d399" stroke-width="2" />
          <!-- Cabin Windows -->
          <polygon points="150,145 210,145 220,175 150,175" fill="#38bdf8" fill-opacity="0.6" stroke="#fff" stroke-width="1" />
          <!-- Heavy Tread Wheels -->
          <circle cx="155" cy="215" r="28" fill="#1e293b" stroke="#e2e8f0" stroke-width="5" />
          <circle cx="155" cy="215" r="12" fill="#059669" />
          <circle cx="245" cy="215" r="28" fill="#1e293b" stroke="#e2e8f0" stroke-width="5" />
          <circle cx="245" cy="215" r="12" fill="#059669" />
          <!-- Rotary Cutting Reel in Front -->
          <ellipse cx="90" cy="205" rx="20" ry="24" fill="none" stroke="#f59e0b" stroke-width="5" />
          <line x1="90" y1="181" x2="90" y2="229" stroke="#f59e0b" stroke-width="4" />
          <line x1="70" y1="205" x2="110" y2="205" stroke="#f59e0b" stroke-width="4" />
          <!-- Crops Field Pattern -->
          <g fill="url(#crop)">
            ${Array.from({ length: 22 })
              .map((_, i) => `<path d="M ${20 + i * 16} 250 Q ${25 + i * 16} 210 ${32 + i * 16} 200 Q ${38 + i * 16} 220 ${35 + i * 16} 250 Z" />`)
              .join('')}
          </g>
          <!-- Badge overlay -->
          <rect x="250" y="20" width="130" height="32" rx="16" fill="#000" fill-opacity="0.75" stroke="#f59e0b" stroke-width="1" />
          <text x="265" y="40" fill="#fde047" font-family="sans-serif" font-size="10" font-weight="black">AGRI-HARVEST 5M</text>
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
          <!-- Distant Hills -->
          <path d="M 0 220 Q 150 160 300 200 T 400 210 L 400 300 L 0 300 Z" fill="#044332" />
          <path d="M 0 240 Q 200 190 400 230 L 400 300 L 0 300 Z" fill="#022c22" />
          <!-- Giant Wind Turbine Center -->
          <polygon points="196,110 204,110 208,270 192,270" fill="#cbd5e1" stroke="#475569" stroke-width="1" />
          <circle cx="200" cy="110" r="12" fill="#e2e8f0" stroke="#334155" stroke-width="2" />
          <!-- 3 Blades -->
          <path d="M 200 110 L 200 15 C 203 15 208 60 204 110 Z" fill="url(#blade)" />
          <path d="M 200 110 L 115 155 C 117 158 155 140 200 110 Z" fill="url(#blade)" />
          <path d="M 200 110 L 285 155 C 283 158 245 140 200 110 Z" fill="url(#blade)" />
          <circle cx="200" cy="110" r="6" fill="#f59e0b" />
          <!-- Secondary Turbine Left -->
          <polygon points="78,140 82,140 84,240 76,240" fill="#94a3b8" />
          <circle cx="80" cy="140" r="7" fill="#cbd5e1" />
          <path d="M 80 140 L 80 75 L 83 140 Z" fill="#e2e8f0" />
          <path d="M 80 140 L 25 170 L 80 140 Z" fill="#e2e8f0" />
          <path d="M 80 140 L 135 170 L 80 140 Z" fill="#e2e8f0" />
          <!-- Power Substation Lines -->
          <g stroke="#34d399" stroke-width="1.5" stroke-opacity="0.7">
            <line x1="200" y1="260" x2="330" y2="240" />
            <line x1="80" y1="230" x2="200" y2="260" />
          </g>
          <!-- Power Transformer Box -->
          <rect x="300" y="225" width="60" height="35" rx="4" fill="#1e293b" stroke="#f59e0b" stroke-width="2" />
          <line x1="315" y1="225" x2="315" y2="210" stroke="#f59e0b" stroke-width="3" />
          <line x1="345" y1="225" x2="345" y2="210" stroke="#f59e0b" stroke-width="3" />
          <text x="25" y="40" fill="#34d399" font-family="monospace" font-size="11" font-weight="black">TURBO 10M POWER GRID</text>
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
            <linearGradient id="steel" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#e2e8f0" />
              <stop offset="50%" stop-color="#64748b" />
              <stop offset="100%" stop-color="#1e293b" />
            </linearGradient>
          </defs>
          <rect width="400" height="300" fill="url(#bg15)" />
          <!-- Heavy Gear Wheel (Center) -->
          <g transform="translate(200, 140)">
            <circle cx="0" cy="0" r="85" fill="none" stroke="url(#bronze)" stroke-width="18" />
            <!-- Gear Teeth -->
            ${Array.from({ length: 16 })
              .map(
                (_, i) => `
              <rect x="-9" y="-102" width="18" height="18" rx="2" fill="url(#bronze)" transform="rotate(${i * 22.5})" />
            `
              )
              .join('')}
            <!-- Inner Spokes -->
            <circle cx="0" cy="0" r="58" fill="#18181b" stroke="#34d399" stroke-width="3" />
            ${[0, 60, 120, 180, 240, 300]
              .map((deg) => `<line x1="0" y1="0" x2="0" y2="58" stroke="url(#steel)" stroke-width="8" transform="rotate(${deg})" />`)
              .join('')}
            <circle cx="0" cy="0" r="28" fill="url(#bronze)" stroke="#fff" stroke-width="2" />
            <circle cx="0" cy="0" r="10" fill="#000" />
          </g>
          <!-- Interlocking Smaller Pinion Gear -->
          <g transform="translate(320, 140)">
            <circle cx="0" cy="0" r="40" fill="none" stroke="url(#steel)" stroke-width="10" />
            ${Array.from({ length: 10 })
              .map(
                (_, i) => `
              <rect x="-5" y="-48" width="10" height="12" rx="2" fill="url(#steel)" transform="rotate(${i * 36})" />
            `
              )
              .join('')}
            <circle cx="0" cy="0" r="16" fill="url(#bronze)" />
          </g>
          <!-- Hydraulic Piston Cylinder -->
          <rect x="40" y="80" width="80" height="24" rx="4" fill="url(#steel)" stroke="#34d399" stroke-width="1.5" />
          <rect x="90" y="86" width="60" height="12" fill="#f8fafc" />
          <text x="30" y="270" fill="#f59e0b" font-family="monospace" font-size="11" font-weight="bold">HEAVY ROTARY ASSET 15M</text>
        </svg>
      `)}`;

    case 'plan-turbo-30m':
      // 30 Minutes Super Charge: Megawatt Battery Storage & Supercharger Grid
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
          <!-- 4 Industrial Battery Storage Units -->
          ${[0, 1, 2, 3]
            .map(
              (i) => `
            <g transform="translate(${55 + i * 78}, 70)">
              <rect x="0" y="0" width="64" height="150" rx="8" fill="#1e293b" stroke="#334155" stroke-width="2" />
              <!-- Battery Terminal Top -->
              <rect x="22" y="-10" width="20" height="10" rx="3" fill="#f59e0b" />
              <!-- Charge Level Bars -->
              <rect x="8" y="20" width="48" height="24" rx="4" fill="url(#batteryCell)" />
              <rect x="8" y="50" width="48" height="24" rx="4" fill="url(#batteryCell)" />
              <rect x="8" y="80" width="48" height="24" rx="4" fill="url(#batteryCell)" />
              <rect x="8" y="110" width="48" height="24" rx="4" fill="url(#batteryCell)" opacity="0.8" />
              <text x="32" y="142" text-anchor="middle" fill="#a7f3d0" font-family="monospace" font-size="8" font-weight="bold">MODULE ${i + 1}</text>
            </g>
          `
            )
            .join('')}
          <!-- High-Voltage Bus Bar (Top) -->
          <line x1="60" y1="58" x2="310" y2="58" stroke="#f59e0b" stroke-width="6" stroke-linecap="round" />
          <!-- Lightning Bolt Symbol Center -->
          <polygon points="200,80 190,120 205,120 195,160 215,110 200,110" fill="#fef08a" stroke="#d97706" stroke-width="1.5" />
          <text x="25" y="270" fill="#34d399" font-family="monospace" font-size="11" font-weight="black">MEGAWATT STORAGE 30M</text>
        </svg>
      `)}`;

    case 'plan-turbo-45m':
      // 45 Minutes Elite Accelerator: Quantum High-Density Data Center Rack
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
          <!-- 3 Server Racks -->
          ${[0, 1, 2]
            .map(
              (i) => `
            <g transform="translate(${60 + i * 100}, 45)">
              <rect x="0" y="0" width="80" height="190" rx="6" fill="#090d16" stroke="#334155" stroke-width="2" />
              <!-- Blade Servers -->
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
          <text x="25" y="275" fill="#38bdf8" font-family="monospace" font-size="11" font-weight="black">QUANTUM COMPUTE MATRIX 45M</text>
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
          <!-- Heavy Tread Track Base -->
          <rect x="70" y="200" width="220" height="42" rx="20" fill="#292524" stroke="#44403c" stroke-width="3" />
          ${Array.from({ length: 6 })
            .map((_, i) => `<circle cx="${100 + i * 32}" cy="221" r="14" fill="#0c0a09" stroke="#78716c" stroke-width="3" />`)
            .join('')}
          <!-- Rotating Cabin -->
          <rect x="110" y="145" width="110" height="60" rx="8" fill="url(#yellow)" stroke="#854d0e" stroke-width="2" />
          <polygon points="175,150 215,150 215,185 175,185" fill="#38bdf8" fill-opacity="0.7" stroke="#1e293b" stroke-width="2" />
          <rect x="115" y="152" width="50" height="48" rx="4" fill="#1c1917" />
          <!-- Heavy Hydraulic Boom & Arm -->
          <path d="M 210 165 L 290 80" stroke="url(#yellow)" stroke-width="16" stroke-linecap="round" />
          <circle cx="290" cy="80" r="10" fill="#1c1917" stroke="#fff" stroke-width="2" />
          <path d="M 290 80 L 340 135" stroke="url(#yellow)" stroke-width="12" stroke-linecap="round" />
          <circle cx="340" cy="135" r="8" fill="#1c1917" />
          <!-- Excavator Bucket -->
          <path d="M 340 135 L 365 170 C 360 185 330 185 325 160 Z" fill="#44403c" stroke="#1c1917" stroke-width="2" />
          <text x="25" y="275" fill="#facc15" font-family="monospace" font-size="11" font-weight="black">TITAN MASTER HEAVY ASSET 60M</text>
        </svg>
      `)}`;

    case 'plan-special-1':
      // Special Offer Plan: Gold Bullion Reserve & Central Treasury
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
              <stop offset="50%" stop-color="#f59e0b" />
              <stop offset="100%" stop-color="#b45309" />
            </linearGradient>
          </defs>
          <rect width="400" height="300" fill="url(#bgGold)" />
          <!-- Glowing Aura Behind Gold -->
          <circle cx="200" cy="150" r="100" fill="#fbbf24" fill-opacity="0.2" />
          <!-- Stack of 24K Gold Bars -->
          <!-- Bottom Row: 3 bars -->
          <g transform="translate(100, 160)">
            <polygon points="0,30 30,0 120,0 90,30" fill="url(#bar1)" stroke="#fff" stroke-width="0.75" />
            <polygon points="90,30 120,0 120,20 90,50" fill="#b45309" />
            <rect x="0" y="30" width="90" height="20" fill="url(#bar1)" stroke="#b45309" stroke-width="1" />
            <text x="45" y="44" text-anchor="middle" fill="#78350f" font-family="sans-serif" font-size="8" font-weight="bold">999.9 GOLD</text>
          </g>
          <g transform="translate(190, 160)">
            <polygon points="0,30 30,0 120,0 90,30" fill="url(#bar1)" stroke="#fff" stroke-width="0.75" />
            <polygon points="90,30 120,0 120,20 90,50" fill="#b45309" />
            <rect x="0" y="30" width="90" height="20" fill="url(#bar1)" stroke="#b45309" stroke-width="1" />
            <text x="45" y="44" text-anchor="middle" fill="#78350f" font-family="sans-serif" font-size="8" font-weight="bold">999.9 GOLD</text>
          </g>
          <!-- Top Row: 1 bar centered -->
          <g transform="translate(145, 120)">
            <polygon points="0,30 30,0 120,0 90,30" fill="url(#bar1)" stroke="#fff" stroke-width="0.75" />
            <polygon points="90,30 120,0 120,20 90,50" fill="#b45309" />
            <rect x="0" y="30" width="90" height="20" fill="url(#bar1)" stroke="#b45309" stroke-width="1" />
            <text x="45" y="44" text-anchor="middle" fill="#78350f" font-family="sans-serif" font-size="8" font-weight="bold">AKM BULLION</text>
          </g>
          <text x="25" y="275" fill="#fde047" font-family="monospace" font-size="11" font-weight="black">SPECIAL TREASURY RESERVE</text>
        </svg>
      `)}`;

    case 'plan-vip-1':
    case 'plan-vip-2':
      // VIP Plans: Sovereign Diamond Vault & Luxury Treasury
      return `data:image/svg+xml;utf8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
          <defs>
            <linearGradient id="bgVip" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#021c11" />
              <stop offset="50%" stop-color="#14532d" />
              <stop offset="100%" stop-color="#052e16" />
            </linearGradient>
            <linearGradient id="platinum" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#f8fafc" />
              <stop offset="50%" stop-color="#cbd5e1" />
              <stop offset="100%" stop-color="#64748b" />
            </linearGradient>
            <linearGradient id="goldVip" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#fef08a" />
              <stop offset="50%" stop-color="#eab308" />
              <stop offset="100%" stop-color="#854d0e" />
            </linearGradient>
          </defs>
          <rect width="400" height="300" fill="url(#bgVip)" />
          <!-- Heavy Bank Vault Door -->
          <circle cx="200" cy="140" r="95" fill="url(#platinum)" stroke="url(#goldVip)" stroke-width="8" />
          <circle cx="200" cy="140" r="80" fill="#0f172a" stroke="#34d399" stroke-width="3" />
          <!-- Vault Spokes Wheel -->
          ${[0, 45, 90, 135, 180, 225, 270, 315]
            .map(
              (deg) => `
            <line x1="200" y1="140" x2="200" y2="70" stroke="url(#goldVip)" stroke-width="6" stroke-linecap="round" transform="rotate(${deg} 200 140)" />
          `
            )
            .join('')}
          <circle cx="200" cy="140" r="32" fill="url(#goldVip)" stroke="#fff" stroke-width="3" />
          <text x="200" y="145" text-anchor="middle" fill="#78350f" font-family="sans-serif" font-size="11" font-weight="black">VIP</text>
          <!-- Crown on top -->
          <path d="M 175 60 L 185 75 L 200 55 L 215 75 L 225 60 L 225 80 L 175 80 Z" fill="url(#goldVip)" stroke="#fff" stroke-width="1" />
          <text x="25" y="275" fill="#fde047" font-family="monospace" font-size="11" font-weight="black">SOVEREIGN VIP MATRIX</text>
        </svg>
      `)}`;

    default:
      // High-End Industrial Equipment Engine (Fallback for Product 1 to 5)
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
          <!-- Industrial Tractor / Manufacturing Unit -->
          <rect x="120" y="110" width="160" height="70" rx="10" fill="url(#mfg)" stroke="#34d399" stroke-width="2" />
          <!-- Wheels -->
          <circle cx="150" cy="180" r="28" fill="#0f172a" stroke="#cbd5e1" stroke-width="6" />
          <circle cx="150" cy="180" r="10" fill="#f59e0b" />
          <circle cx="250" cy="180" r="28" fill="#0f172a" stroke="#cbd5e1" stroke-width="6" />
          <circle cx="250" cy="180" r="10" fill="#f59e0b" />
          <!-- Cabin -->
          <polygon points="140,110 190,110 210,80 160,80" fill="#38bdf8" fill-opacity="0.6" stroke="#fff" stroke-width="1.5" />
          <text x="25" y="275" fill="#34d399" font-family="monospace" font-size="11" font-weight="black">AKM COMMERCIAL ASSET</text>
        </svg>
      `)}`;
  }
}

interface ProductVisualProps {
  plan: Plan;
  className?: string;
}

export const ProductVisual: React.FC<ProductVisualProps> = ({ plan, className = 'w-full h-full object-cover' }) => {
  // Use custom standalone artwork URL
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
