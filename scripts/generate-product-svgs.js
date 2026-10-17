import fs from 'fs';
import path from 'path';

const outDir = path.resolve('public/assets/products');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const svgs = {
  'turbo-1m.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
  <defs>
    <radialGradient id="bg" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="#1e1b4b"/>
      <stop offset="60%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#020617"/>
    </radialGradient>
    <radialGradient id="flash" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#fbbf24" stop-opacity="0.9"/>
      <stop offset="40%" stop-color="#f59e0b" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="#f59e0b" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fef08a"/>
      <stop offset="50%" stop-color="#f59e0b"/>
      <stop offset="100%" stop-color="#b45309"/>
    </linearGradient>
    <linearGradient id="cyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#67e8f9"/>
      <stop offset="100%" stop-color="#0891b2"/>
    </linearGradient>
  </defs>
  <rect width="400" height="300" fill="url(#bg)"/>
  <circle cx="200" cy="140" r="110" fill="url(#flash)"/>
  <circle cx="200" cy="140" r="85" fill="none" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="4 4" opacity="0.6"/>
  <circle cx="200" cy="140" r="70" fill="#0f172a" stroke="url(#goldGrad)" stroke-width="4"/>
  <!-- Rotor Turbine Blades -->
  <g transform="translate(200, 140)">
    <g>
      <path d="M0,0 L12,-55 C22,-45 28,-25 15,-10 Z" fill="url(#goldGrad)" opacity="0.95"/>
      <path d="M0,0 L50,-25 C50,-10 38,5 18,2 Z" fill="url(#goldGrad)" opacity="0.9"/>
      <path d="M0,0 L48,28 C38,40 22,42 8,18 Z" fill="url(#goldGrad)" opacity="0.95"/>
      <path d="M0,0 L5,55 C-8,55 -22,42 -12,18 Z" fill="url(#goldGrad)" opacity="0.9"/>
      <path d="M0,0 L-45,30 C-50,18 -40,-2 -18,2 Z" fill="url(#goldGrad)" opacity="0.95"/>
      <path d="M0,0 L-48,-25 C-38,-40 -20,-42 -6,-18 Z" fill="url(#goldGrad)" opacity="0.9"/>
    </g>
    <!-- Lightning Flash Spark -->
    <path d="M-15,-30 L10,-5 L-4,2 L15,35 L-12,5 L2,-2 Z" fill="#ffffff" filter="drop-shadow(0 0 8px #fef08a)"/>
    <circle cx="0" cy="0" r="16" fill="#020617" stroke="#fbbf24" stroke-width="3"/>
    <circle cx="0" cy="0" r="6" fill="#fbbf24"/>
  </g>
  <!-- Speed lines -->
  <path d="M30,80 L90,80" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" opacity="0.5"/>
  <path d="M20,100 L110,100" stroke="#fbbf24" stroke-width="3" stroke-linecap="round" opacity="0.7"/>
  <path d="M40,120 L80,120" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" opacity="0.4"/>
  <path d="M370,160 L310,160" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" opacity="0.5"/>
  <path d="M380,180 L290,180" stroke="#67e8f9" stroke-width="3" stroke-linecap="round" opacity="0.7"/>
  <!-- Badge Label -->
  <g transform="translate(200, 265)">
    <rect x="-85" y="-14" width="170" height="26" rx="13" fill="#020617" stroke="#f59e0b" stroke-width="1.5"/>
    <text x="0" y="4" font-family="system-ui, sans-serif" font-size="11" font-weight="900" fill="#fbbf24" text-anchor="middle" letter-spacing="1.5">⚡ 1 MIN FLASH TURBO</text>
  </g>
</svg>`,

  'turbo-3m.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
  <defs>
    <radialGradient id="bg2" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="#1c1917"/>
      <stop offset="60%" stop-color="#0c0a09"/>
      <stop offset="100%" stop-color="#000000"/>
    </radialGradient>
    <radialGradient id="amberGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ea580c" stop-opacity="0.8"/>
      <stop offset="50%" stop-color="#c2410c" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#000" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="copperGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fdba74"/>
      <stop offset="50%" stop-color="#ea580c"/>
      <stop offset="100%" stop-color="#7c2d12"/>
    </linearGradient>
  </defs>
  <rect width="400" height="300" fill="url(#bg2)"/>
  <circle cx="200" cy="135" r="120" fill="url(#amberGlow)"/>
  <!-- Twin Turbo Scroll Housing -->
  <g transform="translate(200, 135)">
    <path d="M-80,-20 C-80,-70 -30,-90 20,-90 C80,-90 100,-40 90,20 C80,80 20,95 -40,85 C-90,75 -95,20 -70,-20 L-40,-15" fill="none" stroke="url(#copperGrad)" stroke-width="18" stroke-linecap="round"/>
    <circle cx="0" cy="0" r="55" fill="#1c1917" stroke="#fdba74" stroke-width="3"/>
    <!-- Impeller Blades -->
    <path d="M0,0 Q15,-40 5,-48" stroke="#f97316" stroke-width="5" stroke-linecap="round"/>
    <path d="M0,0 Q40,-15 48,-5" stroke="#f97316" stroke-width="5" stroke-linecap="round"/>
    <path d="M0,0 Q35,25 40,35" stroke="#f97316" stroke-width="5" stroke-linecap="round"/>
    <path d="M0,0 Q0,40 -5,48" stroke="#f97316" stroke-width="5" stroke-linecap="round"/>
    <path d="M0,0 Q-40,15 -48,5" stroke="#f97316" stroke-width="5" stroke-linecap="round"/>
    <path d="M0,0 Q-35,-25 -40,-35" stroke="#f97316" stroke-width="5" stroke-linecap="round"/>
    <circle cx="0" cy="0" r="18" fill="#ea580c" stroke="#fed7aa" stroke-width="2"/>
    <circle cx="0" cy="0" r="6" fill="#fff"/>
  </g>
  <g transform="translate(200, 265)">
    <rect x="-85" y="-14" width="170" height="26" rx="13" fill="#0c0a09" stroke="#ea580c" stroke-width="1.5"/>
    <text x="0" y="4" font-family="system-ui, sans-serif" font-size="11" font-weight="900" fill="#fdba74" text-anchor="middle" letter-spacing="1.5">⚡ 3 MIN TURBO SPEED</text>
  </g>
</svg>`,

  'turbo-5m.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
  <defs>
    <radialGradient id="bg5" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="#042f2e"/>
      <stop offset="60%" stop-color="#021a19"/>
      <stop offset="100%" stop-color="#010e0d"/>
    </radialGradient>
    <linearGradient id="emeraldGold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#34d399"/>
      <stop offset="50%" stop-color="#059669"/>
      <stop offset="100%" stop-color="#064e3b"/>
    </linearGradient>
  </defs>
  <rect width="400" height="300" fill="url(#bg5)"/>
  <!-- Agricultural Kinetic Harvester Wheel -->
  <g transform="translate(200, 135)">
    <circle cx="0" cy="0" r="95" fill="none" stroke="#10b981" stroke-width="2" stroke-dasharray="6 4" opacity="0.5"/>
    <circle cx="0" cy="0" r="80" fill="#022c22" stroke="url(#emeraldGold)" stroke-width="6"/>
    <!-- Cog teeth around ring -->
    <path d="M-80,-10 L-95,-15 L-95,15 L-80,10 Z M80,-10 L95,-15 L95,15 L80,10 Z M-10,-80 L-15,-95 L15,-95 L10,-80 Z M-10,80 L-15,95 L15,95 L10,80 Z" fill="#34d399"/>
    <!-- 8 Heavy Spokes -->
    <line x1="0" y1="-75" x2="0" y2="75" stroke="#10b981" stroke-width="6"/>
    <line x1="-75" y1="0" x2="75" y2="0" stroke="#10b981" stroke-width="6"/>
    <line x1="-53" y1="-53" x2="53" y2="53" stroke="#10b981" stroke-width="6"/>
    <line x1="-53" y1="53" x2="53" y2="-53" stroke="#10b981" stroke-width="6"/>
    <!-- Center Hub -->
    <circle cx="0" cy="0" r="35" fill="#064e3b" stroke="#6ee7b7" stroke-width="4"/>
    <circle cx="0" cy="0" r="14" fill="#34d399"/>
    <text x="0" y="4" font-family="system-ui, sans-serif" font-size="10" font-weight="900" fill="#022c22" text-anchor="middle">5M</text>
  </g>
  <g transform="translate(200, 265)">
    <rect x="-90" y="-14" width="180" height="26" rx="13" fill="#022c22" stroke="#10b981" stroke-width="1.5"/>
    <text x="0" y="4" font-family="system-ui, sans-serif" font-size="11" font-weight="900" fill="#34d399" text-anchor="middle" letter-spacing="1.5">🔥 5 MIN QUICK HARVEST</text>
  </g>
</svg>`,

  'turbo-10m.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
  <defs>
    <radialGradient id="bg10" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="#1e1b4b"/>
      <stop offset="60%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#020617"/>
    </radialGradient>
    <linearGradient id="blueGlow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="100%" stop-color="#1d4ed8"/>
    </linearGradient>
  </defs>
  <rect width="400" height="300" fill="url(#bg10)"/>
  <!-- High Tech Gear Planetary Drive -->
  <g transform="translate(200, 135)">
    <circle cx="0" cy="0" r="90" fill="#0f172a" stroke="url(#blueGlow)" stroke-width="5"/>
    <!-- Outer Gear Ring -->
    <circle cx="0" cy="0" r="75" fill="none" stroke="#38bdf8" stroke-width="2" stroke-dasharray="10 6"/>
    <!-- 3 Planet Gears -->
    <g transform="translate(0, -42)"><circle cx="0" cy="0" r="22" fill="#1e293b" stroke="#60a5fa" stroke-width="3"/><circle cx="0" cy="0" r="6" fill="#38bdf8"/></g>
    <g transform="translate(-36, 24)"><circle cx="0" cy="0" r="22" fill="#1e293b" stroke="#60a5fa" stroke-width="3"/><circle cx="0" cy="0" r="6" fill="#38bdf8"/></g>
    <g transform="translate(36, 24)"><circle cx="0" cy="0" r="22" fill="#1e293b" stroke="#60a5fa" stroke-width="3"/><circle cx="0" cy="0" r="6" fill="#38bdf8"/></g>
    <!-- Center Sun Gear -->
    <circle cx="0" cy="0" r="24" fill="#0284c7" stroke="#e0f2fe" stroke-width="3"/>
    <text x="0" y="4" font-family="system-ui, sans-serif" font-size="10" font-weight="900" fill="#ffffff" text-anchor="middle">10M</text>
  </g>
  <g transform="translate(200, 265)">
    <rect x="-90" y="-14" width="180" height="26" rx="13" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5"/>
    <text x="0" y="4" font-family="system-ui, sans-serif" font-size="11" font-weight="900" fill="#7dd3fc" text-anchor="middle" letter-spacing="1.5">⚡ 10 MIN RAPID GROWTH</text>
  </g>
</svg>`,

  'turbo-15m.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
  <defs>
    <radialGradient id="bg15" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="#311042"/>
      <stop offset="60%" stop-color="#190624"/>
      <stop offset="100%" stop-color="#0a020f"/>
    </radialGradient>
    <linearGradient id="purpleGold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#c084fc"/>
      <stop offset="50%" stop-color="#a855f7"/>
      <stop offset="100%" stop-color="#eab308"/>
    </linearGradient>
  </defs>
  <rect width="400" height="300" fill="url(#bg15)"/>
  <!-- Power Wheel Dynamometer -->
  <g transform="translate(200, 135)">
    <circle cx="0" cy="0" r="95" fill="none" stroke="#a855f7" stroke-width="2" opacity="0.6"/>
    <circle cx="0" cy="0" r="82" fill="#1e112a" stroke="url(#purpleGold)" stroke-width="5"/>
    <!-- Curved Power Blades -->
    <g stroke="#d8b4fe" stroke-width="4" stroke-linecap="round">
      <path d="M0,0 Q20,-60 0,-76"/>
      <path d="M0,0 Q60,-20 76,0"/>
      <path d="M0,0 Q-20,60 0,76"/>
      <path d="M0,0 Q-60,20 -76,0"/>
      <path d="M0,0 Q45,-45 54,-54"/>
      <path d="M0,0 Q45,45 54,54"/>
      <path d="M0,0 Q-45,45 -54,54"/>
      <path d="M0,0 Q-45,-45 -54,-54"/>
    </g>
    <circle cx="0" cy="0" r="28" fill="#eab308" stroke="#fef08a" stroke-width="3"/>
    <text x="0" y="4" font-family="system-ui, sans-serif" font-size="11" font-weight="900" fill="#451a03" text-anchor="middle">15M</text>
  </g>
  <g transform="translate(200, 265)">
    <rect x="-90" y="-14" width="180" height="26" rx="13" fill="#190624" stroke="#a855f7" stroke-width="1.5"/>
    <text x="0" y="4" font-family="system-ui, sans-serif" font-size="11" font-weight="900" fill="#f3e8ff" text-anchor="middle" letter-spacing="1.5">🚀 15 MIN POWER WHEEL</text>
  </g>
</svg>`,

  'turbo-30m.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
  <defs>
    <radialGradient id="bg30" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="#14532d"/>
      <stop offset="60%" stop-color="#052e16"/>
      <stop offset="100%" stop-color="#021a0d"/>
    </radialGradient>
    <linearGradient id="emeraldNeon" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4ade80"/>
      <stop offset="50%" stop-color="#22c55e"/>
      <stop offset="100%" stop-color="#15803d"/>
    </linearGradient>
  </defs>
  <rect width="400" height="300" fill="url(#bg30)"/>
  <!-- Super Charge Energy Reactor -->
  <g transform="translate(200, 135)">
    <circle cx="0" cy="0" r="100" fill="none" stroke="#22c55e" stroke-width="1" stroke-dasharray="4 8" opacity="0.6"/>
    <circle cx="0" cy="0" r="85" fill="#052e16" stroke="url(#emeraldNeon)" stroke-width="5"/>
    <!-- Hexagonal Core -->
    <polygon points="0,-60 52,-30 52,30 0,60 -52,30 -52,-30" fill="#14532d" stroke="#86efac" stroke-width="3"/>
    <!-- Diamond Crystal in Center -->
    <polygon points="0,-32 25,0 0,32 -25,0" fill="#4ade80" filter="drop-shadow(0 0 8px #86efac)"/>
    <circle cx="0" cy="0" r="10" fill="#ffffff"/>
  </g>
  <g transform="translate(200, 265)">
    <rect x="-90" y="-14" width="180" height="26" rx="13" fill="#052e16" stroke="#22c55e" stroke-width="1.5"/>
    <text x="0" y="4" font-family="system-ui, sans-serif" font-size="11" font-weight="900" fill="#bbf7d0" text-anchor="middle" letter-spacing="1.5">💎 30 MIN SUPER CHARGE</text>
  </g>
</svg>`,

  'turbo-45m.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
  <defs>
    <radialGradient id="bg45" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="#451a03"/>
      <stop offset="60%" stop-color="#1c1917"/>
      <stop offset="100%" stop-color="#0a0a0a"/>
    </radialGradient>
    <linearGradient id="goldTitanium" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fef08a"/>
      <stop offset="40%" stop-color="#f59e0b"/>
      <stop offset="100%" stop-color="#78350f"/>
    </linearGradient>
  </defs>
  <rect width="400" height="300" fill="url(#bg45)"/>
  <!-- Elite Accelerator Centrifuge -->
  <g transform="translate(200, 135)">
    <circle cx="0" cy="0" r="92" fill="#1c1917" stroke="url(#goldTitanium)" stroke-width="6"/>
    <!-- Multi-tier Impeller -->
    <circle cx="0" cy="0" r="72" fill="none" stroke="#f59e0b" stroke-width="2" stroke-dasharray="12 4"/>
    <g stroke="url(#goldTitanium)" stroke-width="5" stroke-linecap="round">
      <line x1="-60" y1="-20" x2="60" y2="20"/>
      <line x1="-20" y1="-60" x2="20" y2="60"/>
      <line x1="-50" y1="40" x2="50" y2="-40"/>
      <line x1="-40" y1="-50" x2="40" y2="50"/>
    </g>
    <!-- Central Crown Crest -->
    <circle cx="0" cy="0" r="32" fill="#78350f" stroke="#fbbf24" stroke-width="3"/>
    <path d="M-12,8 L-14,-6 L-6,0 L0,-10 L6,0 L14,-6 L12,8 Z" fill="#fbbf24"/>
  </g>
  <g transform="translate(200, 265)">
    <rect x="-95" y="-14" width="190" height="26" rx="13" fill="#1c1917" stroke="#f59e0b" stroke-width="1.5"/>
    <text x="0" y="4" font-family="system-ui, sans-serif" font-size="11" font-weight="900" fill="#fde68a" text-anchor="middle" letter-spacing="1.5">👑 45 MIN ELITE ACCELERATOR</text>
  </g>
</svg>`,

  'turbo-60m.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
  <defs>
    <radialGradient id="bg60" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="#1e293b"/>
      <stop offset="60%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#020617"/>
    </radialGradient>
    <linearGradient id="titanGold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f59e0b"/>
      <stop offset="50%" stop-color="#0284c7"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
  </defs>
  <rect width="400" height="300" fill="url(#bg60)"/>
  <!-- Titan 1-Hour Master Generator -->
  <g transform="translate(200, 135)">
    <circle cx="0" cy="0" r="95" fill="#0f172a" stroke="#f59e0b" stroke-width="5"/>
    <circle cx="0" cy="0" r="80" fill="none" stroke="#38bdf8" stroke-width="2" stroke-dasharray="8 6"/>
    <!-- 12 Stator Coils -->
    <g fill="#0284c7" stroke="#38bdf8" stroke-width="1.5">
      <rect x="-8" y="-78" width="16" height="12" rx="2"/>
      <rect x="-8" y="66" width="16" height="12" rx="2"/>
      <rect x="-78" y="-8" width="12" height="16" rx="2"/>
      <rect x="66" y="-8" width="12" height="16" rx="2"/>
      <rect x="42" y="-55" width="14" height="14" rx="2" transform="rotate(30 49 -48)"/>
      <rect x="-55" y="42" width="14" height="14" rx="2" transform="rotate(30 -48 49)"/>
      <rect x="-55" y="-55" width="14" height="14" rx="2" transform="rotate(-30 -48 -48)"/>
      <rect x="42" y="42" width="14" height="14" rx="2" transform="rotate(-30 49 49)"/>
    </g>
    <!-- Center Rotor -->
    <circle cx="0" cy="0" r="38" fill="#1e293b" stroke="#f59e0b" stroke-width="4"/>
    <text x="0" y="5" font-family="system-ui, sans-serif" font-size="12" font-weight="900" fill="#f59e0b" text-anchor="middle">1 HOUR</text>
  </g>
  <g transform="translate(200, 265)">
    <rect x="-95" y="-14" width="190" height="26" rx="13" fill="#0f172a" stroke="#f59e0b" stroke-width="1.5"/>
    <text x="0" y="4" font-family="system-ui, sans-serif" font-size="11" font-weight="900" fill="#fef08a" text-anchor="middle" letter-spacing="1.5">⚡ 1 HOUR TITAN MASTER</text>
  </g>
</svg>`,

  'tire-special.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
  <defs>
    <radialGradient id="bgSpec" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="#1e293b"/>
      <stop offset="60%" stop-color="#090d16"/>
      <stop offset="100%" stop-color="#020617"/>
    </radialGradient>
    <linearGradient id="rubberGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#475569"/>
      <stop offset="50%" stop-color="#1e293b"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
    <linearGradient id="rimGold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fde047"/>
      <stop offset="50%" stop-color="#ca8a04"/>
      <stop offset="100%" stop-color="#854d0e"/>
    </linearGradient>
  </defs>
  <rect width="400" height="300" fill="url(#bgSpec)"/>
  <!-- Heavy Duty Earthmover Radial Tire -->
  <g transform="translate(200, 135)">
    <!-- Outer Deep Tread Ring with Lug Notches -->
    <circle cx="0" cy="0" r="95" fill="#090d16" stroke="#334155" stroke-width="14"/>
    <!-- 16 Traction Lugs -->
    <g fill="#475569">
      <rect x="-8" y="-103" width="16" height="12" rx="3"/>
      <rect x="-8" y="91" width="16" height="12" rx="3"/>
      <rect x="-103" y="-8" width="12" height="16" rx="3"/>
      <rect x="91" y="-8" width="12" height="16" rx="3"/>
      <rect x="62" y="-70" width="14" height="14" rx="3" transform="rotate(45 69 -63)"/>
      <rect x="-76" y="56" width="14" height="14" rx="3" transform="rotate(45 -69 63)"/>
      <rect x="-76" y="-70" width="14" height="14" rx="3" transform="rotate(-45 -69 -63)"/>
      <rect x="62" y="56" width="14" height="14" rx="3" transform="rotate(-45 69 63)"/>
    </g>
    <!-- Sidewall -->
    <circle cx="0" cy="0" r="78" fill="url(#rubberGrad)" stroke="#1e293b" stroke-width="4"/>
    <!-- Brand Emboss text -->
    <path id="tirePathSpec" d="M-60,0 A60,60 0 1,1 60,0" fill="none"/>
    <text font-family="system-ui, sans-serif" font-size="8" font-weight="900" fill="#94a3b8" letter-spacing="3">
      <textPath href="#tirePathSpec" startOffset="50%" text-anchor="middle">AKM HEAVY DUTY RADIAL</textPath>
    </text>
    <!-- Heavy Duty Steel Rim -->
    <circle cx="0" cy="0" r="48" fill="#0f172a" stroke="url(#rimGold)" stroke-width="6"/>
    <!-- Rim Bolt Holes -->
    <g fill="#fde047">
      <circle cx="0" cy="-34" r="3.5"/>
      <circle cx="0" cy="34" r="3.5"/>
      <circle cx="-34" cy="0" r="3.5"/>
      <circle cx="34" cy="0" r="3.5"/>
      <circle cx="-24" cy="-24" r="3.5"/>
      <circle cx="24" cy="24" r="3.5"/>
      <circle cx="-24" cy="24" r="3.5"/>
      <circle cx="24" cy="-24" r="3.5"/>
    </g>
    <!-- Center Hub -->
    <circle cx="0" cy="0" r="18" fill="#ca8a04" stroke="#fef08a" stroke-width="2"/>
    <text x="0" y="3.5" font-family="system-ui, sans-serif" font-size="8" font-weight="900" fill="#422006" text-anchor="middle">BKT</text>
  </g>
  <g transform="translate(200, 265)">
    <rect x="-95" y="-14" width="190" height="26" rx="13" fill="#090d16" stroke="#ca8a04" stroke-width="1.5"/>
    <text x="0" y="4" font-family="system-ui, sans-serif" font-size="11" font-weight="900" fill="#fde047" text-anchor="middle" letter-spacing="1.5">★ SPECIAL OFFER PLAN</text>
  </g>
</svg>`,

  'tire-product-1.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
  <defs>
    <radialGradient id="bgP1" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="#064e3b"/>
      <stop offset="60%" stop-color="#022c22"/>
      <stop offset="100%" stop-color="#01140e"/>
    </radialGradient>
    <linearGradient id="emeraldRim" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#6ee7b7"/>
      <stop offset="50%" stop-color="#10b981"/>
      <stop offset="100%" stop-color="#047857"/>
    </linearGradient>
  </defs>
  <rect width="400" height="300" fill="url(#bgP1)"/>
  <!-- Agricultural Flotation Tractor Tire -->
  <g transform="translate(200, 135)">
    <circle cx="0" cy="0" r="95" fill="#022c22" stroke="#065f46" stroke-width="12"/>
    <!-- Curved Agricultural Chevron Lugs -->
    <g stroke="#34d399" stroke-width="5" stroke-linecap="round">
      <path d="M-15,-94 L0,-104 L15,-94"/>
      <path d="M-15,94 L0,104 L15,94"/>
      <path d="M-94,-15 L-104,0 L-94,15"/>
      <path d="M94,-15 L104,0 L94,15"/>
      <path d="M-70,-60 L-76,-72 L-60,-70"/>
      <path d="M70,60 L76,72 L60,70"/>
      <path d="M-70,60 L-76,72 L-60,70"/>
      <path d="M70,-60 L76,-72 L60,-70"/>
    </g>
    <!-- Sidewall -->
    <circle cx="0" cy="0" r="76" fill="#0f172a" stroke="#047857" stroke-width="3"/>
    <circle cx="0" cy="0" r="50" fill="#022c22" stroke="url(#emeraldRim)" stroke-width="6"/>
    <!-- 5 Heavy Spoke Alloy -->
    <g stroke="#6ee7b7" stroke-width="6" stroke-linecap="round">
      <line x1="0" y1="0" x2="0" y2="-44"/>
      <line x1="0" y1="0" x2="42" y2="-14"/>
      <line x1="0" y1="0" x2="26" y2="36"/>
      <line x1="0" y1="0" x2="-26" y2="36"/>
      <line x1="0" y1="0" x2="-42" y2="-14"/>
    </g>
    <circle cx="0" cy="0" r="16" fill="#10b981" stroke="#a7f3d0" stroke-width="3"/>
    <circle cx="0" cy="0" r="6" fill="#064e3b"/>
  </g>
  <g transform="translate(200, 265)">
    <rect x="-85" y="-14" width="170" height="26" rx="13" fill="#022c22" stroke="#10b981" stroke-width="1.5"/>
    <text x="0" y="4" font-family="system-ui, sans-serif" font-size="11" font-weight="900" fill="#a7f3d0" text-anchor="middle" letter-spacing="1.5">PRODUCT 1 • AGRIMAX</text>
  </g>
</svg>`,

  'tire-product-2.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
  <defs>
    <radialGradient id="bgP2" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="#1e1b4b"/>
      <stop offset="60%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#020617"/>
    </radialGradient>
    <linearGradient id="apexGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f59e0b"/>
      <stop offset="50%" stop-color="#10b981"/>
      <stop offset="100%" stop-color="#065f46"/>
    </linearGradient>
  </defs>
  <rect width="400" height="300" fill="url(#bgP2)"/>
  <!-- AKM Apex Premium Mining Radial -->
  <g transform="translate(200, 135)">
    <circle cx="0" cy="0" r="96" fill="#090d16" stroke="#475569" stroke-width="14"/>
    <!-- Dual Staggered Blocks -->
    <g fill="#94a3b8">
      <rect x="-10" y="-104" width="20" height="10" rx="2"/>
      <rect x="-10" y="94" width="20" height="10" rx="2"/>
      <rect x="-104" y="-10" width="10" height="20" rx="2"/>
      <rect x="94" y="-10" width="10" height="20" rx="2"/>
    </g>
    <circle cx="0" cy="0" r="76" fill="#1e293b" stroke="#334155" stroke-width="4"/>
    <!-- Titanium Machined Rim -->
    <circle cx="0" cy="0" r="50" fill="#0f172a" stroke="url(#apexGrad)" stroke-width="6"/>
    <!-- Multi-spoke Mesh -->
    <g stroke="#38bdf8" stroke-width="3" opacity="0.8">
      <line x1="0" y1="-44" x2="0" y2="44"/>
      <line x1="-44" y1="0" x2="44" y2="0"/>
      <line x1="-31" y1="-31" x2="31" y2="31"/>
      <line x1="-31" y1="31" x2="31" y2="-31"/>
    </g>
    <circle cx="0" cy="0" r="18" fill="#f59e0b" stroke="#fef08a" stroke-width="2"/>
    <text x="0" y="3.5" font-family="system-ui, sans-serif" font-size="8" font-weight="900" fill="#451a03" text-anchor="middle">APEX</text>
  </g>
  <g transform="translate(200, 265)">
    <rect x="-95" y="-14" width="190" height="26" rx="13" fill="#0f172a" stroke="#10b981" stroke-width="1.5"/>
    <text x="0" y="4" font-family="system-ui, sans-serif" font-size="11" font-weight="900" fill="#6ee7b7" text-anchor="middle" letter-spacing="1.5">PRODUCT 2 • APEX PREMIUM</text>
  </g>
</svg>`,

  'plant-product-3.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
  <defs>
    <radialGradient id="bgP3" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="#111827"/>
      <stop offset="60%" stop-color="#030712"/>
      <stop offset="100%" stop-color="#000000"/>
    </radialGradient>
    <linearGradient id="laserBeam" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#38bdf8" stop-opacity="0"/>
      <stop offset="50%" stop-color="#38bdf8"/>
      <stop offset="100%" stop-color="#ffffff"/>
    </linearGradient>
  </defs>
  <rect width="400" height="300" fill="url(#bgP3)"/>
  <!-- Sovereign Elite Robotic Manufacturing Arm -->
  <g transform="translate(200, 140)">
    <!-- Base Platform -->
    <rect x="-60" y="60" width="120" height="16" rx="4" fill="#1f2937" stroke="#4b5563" stroke-width="2"/>
    <rect x="-40" y="44" width="80" height="18" fill="#374151"/>
    <!-- Articulated Robotic Segment 1 -->
    <path d="M-15,44 L-25,-10 L5,-10 L15,44 Z" fill="#10b981" stroke="#34d399" stroke-width="2"/>
    <circle cx="-10" cy="-10" r="14" fill="#065f46" stroke="#6ee7b7" stroke-width="3"/>
    <!-- Arm Segment 2 -->
    <path d="M-10,-10 L55,-55 L70,-45 L5, -5 Z" fill="#047857" stroke="#34d399" stroke-width="2"/>
    <circle cx="62" cy="-50" r="10" fill="#065f46" stroke="#f59e0b" stroke-width="2"/>
    <!-- Laser Welding Tool Head -->
    <polygon points="62,-50 85,-40 75,-25" fill="#f59e0b"/>
    <!-- Precision Laser Spark Beam -->
    <line x1="85" y1="-40" x2="120" y2="-20" stroke="#38bdf8" stroke-width="3" filter="drop-shadow(0 0 6px #38bdf8)"/>
    <circle cx="120" cy="-20" r="4" fill="#ffffff" filter="drop-shadow(0 0 8px #38bdf8)"/>
    <!-- Spark Particles -->
    <circle cx="115" cy="-28" r="1.5" fill="#fef08a"/>
    <circle cx="128" cy="-15" r="1.5" fill="#fef08a"/>
    <circle cx="125" cy="-26" r="1.5" fill="#38bdf8"/>
  </g>
  <g transform="translate(200, 265)">
    <rect x="-105" y="-14" width="210" height="26" rx="13" fill="#030712" stroke="#10b981" stroke-width="1.5"/>
    <text x="0" y="4" font-family="system-ui, sans-serif" font-size="11" font-weight="900" fill="#6ee7b7" text-anchor="middle" letter-spacing="1.5">PRODUCT 3 • SOVEREIGN ELITE</text>
  </g>
</svg>`,

  'plant-product-4.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
  <defs>
    <radialGradient id="bgP4" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="60%" stop-color="#020617"/>
      <stop offset="100%" stop-color="#000000"/>
    </radialGradient>
    <linearGradient id="plantGlow" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#10b981"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
  </defs>
  <rect width="400" height="300" fill="url(#bgP4)"/>
  <!-- High Tech Industrial Smart Factory & Solar Grid -->
  <g transform="translate(200, 140)">
    <!-- Factory Silos -->
    <rect x="-110" y="-30" width="40" height="90" rx="6" fill="#1e293b" stroke="#334155" stroke-width="2"/>
    <rect x="-65" y="-50" width="45" height="110" rx="6" fill="#334155" stroke="#475569" stroke-width="2"/>
    <!-- Main Smart Facility Block -->
    <polygon points="-10,60 -10,-10 60,-40 120,-15 120,60" fill="#0f766e" stroke="#14b8a6" stroke-width="2"/>
    <!-- Facility Glass Windows Grid with Glowing Green Lighting -->
    <g fill="#2dd4bf" opacity="0.8">
      <rect x="0" y="0" width="12" height="10" rx="1"/>
      <rect x="18" y="0" width="12" height="10" rx="1"/>
      <rect x="36" y="0" width="12" height="10" rx="1"/>
      <rect x="0" y="16" width="12" height="10" rx="1"/>
      <rect x="18" y="16" width="12" height="10" rx="1"/>
      <rect x="36" y="16" width="12" height="10" rx="1"/>
    </g>
    <!-- Wind Turbine / Clean Energy Mast -->
    <line x1="85" y1="-15" x2="85" y2="-75" stroke="#e2e8f0" stroke-width="2.5"/>
    <circle cx="85" cy="-75" r="4" fill="#38bdf8"/>
    <!-- Blades -->
    <line x1="85" y1="-75" x2="65" y2="-95" stroke="#e2e8f0" stroke-width="2"/>
    <line x1="85" y1="-75" x2="105" y2="-95" stroke="#e2e8f0" stroke-width="2"/>
    <line x1="85" y1="-75" x2="85" y2="-50" stroke="#e2e8f0" stroke-width="2"/>
    <!-- Ground High-Speed Conduits -->
    <line x1="-120" y1="65" x2="130" y2="65" stroke="#10b981" stroke-width="3"/>
  </g>
  <g transform="translate(200, 265)">
    <rect x="-100" y="-14" width="200" height="26" rx="13" fill="#020617" stroke="#14b8a6" stroke-width="1.5"/>
    <text x="0" y="4" font-family="system-ui, sans-serif" font-size="11" font-weight="900" fill="#5eead4" text-anchor="middle" letter-spacing="1.5">PRODUCT 4 • CAPITAL PRIME</text>
  </g>
</svg>`,

  'plant-product-5.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
  <defs>
    <radialGradient id="bgP5" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="#14532d"/>
      <stop offset="60%" stop-color="#052e16"/>
      <stop offset="100%" stop-color="#02150a"/>
    </radialGradient>
    <linearGradient id="pinnacleGold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fde047"/>
      <stop offset="50%" stop-color="#eab308"/>
      <stop offset="100%" stop-color="#854d0e"/>
    </linearGradient>
  </defs>
  <rect width="400" height="300" fill="url(#bgP5)"/>
  <!-- AKM Pinnacle Fund Industrial Smart Foundry -->
  <g transform="translate(200, 140)">
    <!-- Pinnacle Obelisk / Architectural Headquarters Tower -->
    <polygon points="0,-85 35,55 -35,55" fill="#15803d" stroke="#4ade80" stroke-width="3"/>
    <!-- Central Golden Core Channel -->
    <polygon points="0,-70 12,50 -12,50" fill="url(#pinnacleGold)"/>
    <!-- Flanking Energy Silos -->
    <rect x="-75" y="-10" width="30" height="65" rx="4" fill="#166534" stroke="#22c55e" stroke-width="2"/>
    <rect x="45" y="-10" width="30" height="65" rx="4" fill="#166534" stroke="#22c55e" stroke-width="2"/>
    <!-- Holographic Energy Spheres -->
    <circle cx="0" cy="-85" r="8" fill="#fef08a" filter="drop-shadow(0 0 8px #facc15)"/>
    <circle cx="-60" cy="-20" r="5" fill="#4ade80" filter="drop-shadow(0 0 6px #4ade80)"/>
    <circle cx="60" cy="-20" r="5" fill="#4ade80" filter="drop-shadow(0 0 6px #4ade80)"/>
    <!-- Base Foundation Grid -->
    <line x1="-110" y1="58" x2="110" y2="58" stroke="#86efac" stroke-width="3"/>
  </g>
  <g transform="translate(200, 265)">
    <rect x="-105" y="-14" width="210" height="26" rx="13" fill="#052e16" stroke="#4ade80" stroke-width="1.5"/>
    <text x="0" y="4" font-family="system-ui, sans-serif" font-size="11" font-weight="900" fill="#bbf7d0" text-anchor="middle" letter-spacing="1.5">PRODUCT 5 • PINNACLE FUND</text>
  </g>
</svg>`,

  'vip-1.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
  <defs>
    <radialGradient id="bgVip1" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="#2e1065"/>
      <stop offset="60%" stop-color="#0f0728"/>
      <stop offset="100%" stop-color="#030014"/>
    </radialGradient>
    <linearGradient id="vipGold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fef08a"/>
      <stop offset="35%" stop-color="#f59e0b"/>
      <stop offset="70%" stop-color="#d97706"/>
      <stop offset="100%" stop-color="#78350f"/>
    </linearGradient>
  </defs>
  <rect width="400" height="300" fill="url(#bgVip1)"/>
  <!-- VIP 1 Wealth Matrix Cybernetic Vault -->
  <g transform="translate(200, 135)">
    <!-- Outer Heavy Vault Ring with 8 Bolts -->
    <circle cx="0" cy="0" r="95" fill="#1e103a" stroke="url(#vipGold)" stroke-width="8"/>
    <!-- 8 Heavy Chrome Locking Bolts -->
    <g fill="#fef08a">
      <rect x="-6" y="-103" width="12" height="14" rx="3"/>
      <rect x="-6" y="89" width="12" height="14" rx="3"/>
      <rect x="-103" y="-6" width="14" height="12" rx="3"/>
      <rect x="89" y="-6" width="14" height="12" rx="3"/>
      <rect x="63" y="-68" width="13" height="13" rx="3" transform="rotate(45 70 -62)"/>
      <rect x="-77" y="55" width="13" height="13" rx="3" transform="rotate(45 -70 62)"/>
      <rect x="-77" y="-68" width="13" height="13" rx="3" transform="rotate(-45 -70 -62)"/>
      <rect x="63" y="55" width="13" height="13" rx="3" transform="rotate(-45 70 62)"/>
    </g>
    <!-- Geometric Circuit Matrix -->
    <circle cx="0" cy="0" r="74" fill="#0f0728" stroke="#a855f7" stroke-width="2"/>
    <polygon points="0,-50 43,-25 43,25 0,50 -43,25 -43,-25" fill="#2e1065" stroke="url(#vipGold)" stroke-width="3"/>
    <!-- Vault Wheel Spoke Mechanism -->
    <line x1="0" y1="-32" x2="0" y2="32" stroke="#fbbf24" stroke-width="4"/>
    <line x1="-32" y1="0" x2="32" y2="0" stroke="#fbbf24" stroke-width="4"/>
    <circle cx="0" cy="0" r="22" fill="#d97706" stroke="#fef08a" stroke-width="3"/>
    <!-- VIP Crown Icon in Core -->
    <path d="M-8,5 L-9,-4 L-4,0 L0,-7 L4,0 L9,-4 L8,5 Z" fill="#ffffff"/>
  </g>
  <g transform="translate(200, 265)">
    <rect x="-95" y="-14" width="190" height="26" rx="13" fill="#0f0728" stroke="#f59e0b" stroke-width="1.5"/>
    <text x="0" y="4" font-family="system-ui, sans-serif" font-size="11" font-weight="900" fill="#fef08a" text-anchor="middle" letter-spacing="1.5">👑 VIP 1 • WEALTH MATRIX</text>
  </g>
</svg>`,

  'vip-2.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
  <defs>
    <radialGradient id="bgVip2" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="#451a03"/>
      <stop offset="60%" stop-color="#1c1917"/>
      <stop offset="100%" stop-color="#000000"/>
    </radialGradient>
    <linearGradient id="ultraGold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="30%" stop-color="#fde047"/>
      <stop offset="70%" stop-color="#eab308"/>
      <stop offset="100%" stop-color="#854d0e"/>
    </linearGradient>
  </defs>
  <rect width="400" height="300" fill="url(#bgVip2)"/>
  <!-- VIP 2 Sovereign Ultra Prestige Titanium Vault -->
  <g transform="translate(200, 135)">
    <circle cx="0" cy="0" r="96" fill="#1c1917" stroke="url(#ultraGold)" stroke-width="8"/>
    <!-- 12 Locking Radial Pistons -->
    <g fill="#fde047">
      <circle cx="0" cy="-86" r="5"/>
      <circle cx="0" cy="86" r="5"/>
      <circle cx="-86" cy="0" r="5"/>
      <circle cx="86" cy="0" r="5"/>
      <circle cx="-61" cy="-61" r="5"/>
      <circle cx="61" cy="61" r="5"/>
      <circle cx="-61" cy="61" r="5"/>
      <circle cx="61" cy="-61" r="5"/>
    </g>
    <!-- Central Titanium Biometric Dial -->
    <circle cx="0" cy="0" r="68" fill="#292524" stroke="#eab308" stroke-width="3"/>
    <!-- Diamond Facets -->
    <polygon points="0,-45 32,-18 32,22 0,45 -32,22 -32,-18" fill="#451a03" stroke="url(#ultraGold)" stroke-width="3"/>
    <!-- Center Jewel -->
    <circle cx="0" cy="0" r="18" fill="#ca8a04" stroke="#ffffff" stroke-width="2" filter="drop-shadow(0 0 10px #facc15)"/>
    <text x="0" y="4" font-family="system-ui, sans-serif" font-size="10" font-weight="900" fill="#ffffff" text-anchor="middle">VIP 2</text>
  </g>
  <g transform="translate(200, 265)">
    <rect x="-105" y="-14" width="210" height="26" rx="13" fill="#1c1917" stroke="#fde047" stroke-width="1.5"/>
    <text x="0" y="4" font-family="system-ui, sans-serif" font-size="11" font-weight="900" fill="#fef08a" text-anchor="middle" letter-spacing="1.5">👑 VIP 2 • SOVEREIGN ULTRA</text>
  </g>
</svg>`
};

for (const [filename, content] of Object.entries(svgs)) {
  fs.writeFileSync(path.join(outDir, filename), content.trim(), 'utf-8');
  console.log(`Generated: ${filename}`);
}

console.log('All product SVGs generated successfully!');
