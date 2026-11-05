/**
 * High-Fidelity Vector SVG Banners for AKM ENTERPRISES Blade Manufacturing & Precision Tools.
 * Generates instantaneous, zero-latency 16:9 widescreen banners with ultra-crisp reflections,
 * realistic stainless steel double-edge razor blades, 5-blade shaving cartridges,
 * and golden titanium industrial cutting tools.
 */

export function getBladeBannerDataUri(slideId: string): string {
  switch (slideId) {
    case 'blade-factory-master':
      // Banner 1: Precision Double-Edge Razor Blade Automated Production Line
      return `data:image/svg+xml;utf8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" width="100%" height="100%">
          <defs>
            <linearGradient id="bf_bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#02140d" />
              <stop offset="45%" stop-color="#062e1d" />
              <stop offset="85%" stop-color="#03170e" />
              <stop offset="100%" stop-color="#010a06" />
            </linearGradient>
            <linearGradient id="bf_steel" x1="0%" y1="0%" x2="100%" y2="30%">
              <stop offset="0%" stop-color="#94a3b8" />
              <stop offset="20%" stop-color="#f8fafc" />
              <stop offset="35%" stop-color="#cbd5e1" />
              <stop offset="50%" stop-color="#ffffff" />
              <stop offset="65%" stop-color="#94a3b8" />
              <stop offset="85%" stop-color="#f1f5f9" />
              <stop offset="100%" stop-color="#64748b" />
            </linearGradient>
            <linearGradient id="bf_bevel" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#ffffff" />
              <stop offset="30%" stop-color="#38bdf8" />
              <stop offset="70%" stop-color="#0284c7" />
              <stop offset="100%" stop-color="#e2e8f0" />
            </linearGradient>
            <linearGradient id="bf_laser" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#10b981" stop-opacity="0" />
              <stop offset="50%" stop-color="#34d399" stop-opacity="0.9" />
              <stop offset="100%" stop-color="#a7f3d0" stop-opacity="0" />
            </linearGradient>
            <radialGradient id="bf_glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#10b981" stop-opacity="0.3" />
              <stop offset="50%" stop-color="#059669" stop-opacity="0.1" />
              <stop offset="100%" stop-color="#000000" stop-opacity="0" />
            </radialGradient>
            <filter id="bf_blur" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="8" />
            </filter>
            <filter id="bf_shadow" x="-10%" y="-10%" width="130%" height="130%">
              <feDropShadow dx="0" dy="18" stdDeviation="24" flood-color="#000000" flood-opacity="0.8" />
            </filter>
          </defs>

          <!-- Deep Industrial Tech Canvas Background -->
          <rect width="1200" height="675" fill="url(#bf_bg)" />

          <!-- Perspective Tech Grid Floor -->
          <g opacity="0.15">
            <line x1="0" y1="520" x2="1200" y2="520" stroke="#10b981" stroke-width="1" />
            <line x1="0" y1="550" x2="1200" y2="550" stroke="#10b981" stroke-width="1.5" />
            <line x1="0" y1="590" x2="1200" y2="590" stroke="#10b981" stroke-width="2" />
            <line x1="0" y1="640" x2="1200" y2="640" stroke="#10b981" stroke-width="2.5" />
            <line x1="100" y1="480" x2="-200" y2="675" stroke="#10b981" stroke-width="1.5" />
            <line x1="300" y1="480" x2="100" y2="675" stroke="#10b981" stroke-width="1.5" />
            <line x1="500" y1="480" x2="400" y2="675" stroke="#10b981" stroke-width="1.5" />
            <line x1="700" y1="480" x2="800" y2="675" stroke="#10b981" stroke-width="1.5" />
            <line x1="900" y1="480" x2="1100" y2="675" stroke="#10b981" stroke-width="1.5" />
            <line x1="1100" y1="480" x2="1400" y2="675" stroke="#10b981" stroke-width="1.5" />
          </g>

          <!-- Ambient Green Backlight Glow -->
          <ellipse cx="680" cy="320" rx="360" ry="220" fill="url(#bf_glow)" filter="url(#bf_blur)" />

          <!-- High-Speed Automated Steel Strip Track (Background Conveyor) -->
          <g opacity="0.35" transform="rotate(-6 600 300)">
            <rect x="-100" y="380" width="1400" height="35" fill="#334155" stroke="#64748b" stroke-width="1" />
            <line x1="-100" y1="397" x2="1300" y2="397" stroke="#38bdf8" stroke-dasharray="25 15" stroke-width="2" />
          </g>

          <!-- ======================================================== -->
          <!-- HERO SHOWPIECE: ULTRA-REALISTIC DOUBLE-EDGE RAZOR BLADE   -->
          <!-- ======================================================== -->
          <g transform="translate(620, 310) rotate(-11)" filter="url(#bf_shadow)">
            <!-- Blade Outer Shadow Underlay -->
            <rect x="-320" y="-140" width="640" height="280" rx="14" fill="#020617" opacity="0.6" />

            <!-- Main Steel Body (Exact DE Blade Geometry) -->
            <path d="
              M -300,-125 
              L -285,-125 L -270,-110 L -270,-130 L 270,-130 L 270,-110 L 285,-125 L 300,-125 
              Q 315,-125 315,-105 L 315,105 Q 315,125 300,125 
              L 285,125 L 270,110 L 270,130 L -270,130 L -270,110 L -285,125 L -300,125 
              Q -315,125 -315,105 L -315,-105 Q -315,-125 -300,-125 Z
            " fill="url(#bf_steel)" stroke="#e2e8f0" stroke-width="2.5" />

            <!-- Top Ultra-Sharp Razor Cutting Edge Bevel -->
            <polygon points="-270,-130 270,-130 260,-118 -260,-118" fill="url(#bf_bevel)" opacity="0.95" />
            <line x1="-270" y1="-130" x2="270" y2="-130" stroke="#ffffff" stroke-width="2" />
            <!-- Light Glimmer Streak on Top Edge -->
            <line x1="-80" y1="-130" x2="80" y2="-130" stroke="#fef08a" stroke-width="3" filter="url(#bf_blur)" opacity="0.9" />

            <!-- Bottom Ultra-Sharp Razor Cutting Edge Bevel -->
            <polygon points="-270,130 270,130 260,118 -260,118" fill="url(#bf_bevel)" opacity="0.95" />
            <line x1="-270" y1="130" x2="270" y2="130" stroke="#ffffff" stroke-width="2" />
            <!-- Light Glimmer Streak on Bottom Edge -->
            <line x1="-120" y1="130" x2="40" y2="130" stroke="#fef08a" stroke-width="3" filter="url(#bf_blur)" opacity="0.9" />

            <!-- Iconic Center Slots (Slotted Punch Cutouts) -->
            <!-- Outer Cutout Mask Layer -->
            <g fill="#04180f" stroke="#475569" stroke-width="2">
              <!-- Center Elongated Oval Slot -->
              <rect x="-180" y="-12" width="360" height="24" rx="12" />
              <!-- Center Circular Diamond Pilot Hole -->
              <circle cx="0" cy="0" r="32" fill="#04180f" stroke="#64748b" stroke-width="2.5" />
              <!-- Left Circular Locking Hole -->
              <circle cx="-135" cy="0" r="18" fill="#04180f" stroke="#64748b" stroke-width="2" />
              <!-- Right Circular Locking Hole -->
              <circle cx="135" cy="0" r="18" fill="#04180f" stroke="#64748b" stroke-width="2" />
              <!-- 4 Corner Relief Notches -->
              <rect x="-240" y="-85" width="22" height="40" rx="4" />
              <rect x="218" y="-85" width="22" height="40" rx="4" />
              <rect x="-240" y="45" width="22" height="40" rx="4" />
              <rect x="218" y="45" width="22" height="40" rx="4" />
            </g>

            <!-- Holographic Diagonal Glare Ribbon Across Blade -->
            <polygon points="-220,-130 -140,-130 220,130 140,130" fill="#ffffff" opacity="0.22" />

            <!-- Laser Etched Corporate Branding on Stainless Steel -->
            <text x="0" y="-48" text-anchor="middle" fill="#1e293b" font-family="'Courier New', monospace" font-size="21" font-weight="900" letter-spacing="4">AKM SUPER PLATINUM</text>
            <text x="0" y="-32" text-anchor="middle" fill="#475569" font-family="sans-serif" font-size="11" font-weight="700" letter-spacing="2.5">SWEDISH STAINLESS STEEL • 0.10mm CRYO</text>
            <text x="0" y="58" text-anchor="middle" fill="#1e293b" font-family="'Courier New', monospace" font-size="18" font-weight="900" letter-spacing="3.5">AKM ENTERPRISES LTD</text>
            <text x="0" y="74" text-anchor="middle" fill="#059669" font-family="sans-serif" font-size="10.5" font-weight="800" letter-spacing="2">✓ ISO 9001:2015 CERTIFIED PRECISION</text>
          </g>

          <!-- Laser Quality Inspection Scanning Beam (Green Laser Crossing Blade) -->
          <line x1="380" y1="120" x2="880" y2="480" stroke="url(#bf_laser)" stroke-width="5" />
          <line x1="380" y1="120" x2="880" y2="480" stroke="#6ee7b7" stroke-width="1.5" filter="url(#bf_blur)" />

          <!-- Left Info Vignette Overlay (Leaves Room for Slider Text) -->
          <rect x="0" y="0" width="560" height="675" fill="url(#bf_bg)" opacity="0.65" />

          <!-- Top-Left Certified Industry Badges -->
          <g transform="translate(48, 48)">
            <rect width="260" height="38" rx="19" fill="#000000" fill-opacity="0.85" stroke="#10b981" stroke-width="1.8" />
            <circle cx="24" cy="19" r="6" fill="#10b981" />
            <text x="40" y="24" fill="#6ee7b7" font-family="sans-serif" font-size="12" font-weight="900" letter-spacing="1">AUTOMATED BLADE PLANT</text>
          </g>

          <!-- Bottom Micro Spec Badge -->
          <g transform="translate(48, 580)">
            <rect width="390" height="44" rx="12" fill="#02140d" fill-opacity="0.9" stroke="#059669" stroke-width="1.5" />
            <text x="20" y="27" fill="#34d399" font-family="monospace" font-size="13" font-weight="bold">AKM PRECISION RAZOR MANUFACTURING</text>
            <text x="310" y="27" fill="#fbbf24" font-family="monospace" font-size="13" font-weight="900">0.10mm Cr</text>
          </g>
        </svg>
      `)}`;

    case 'blade-cartridge-matrix':
      // Banner 2: 5-Blade Matrix Shaving Cartridge High-Tech Automation
      return `data:image/svg+xml;utf8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" width="100%" height="100%">
          <defs>
            <linearGradient id="bc_bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#021b24" />
              <stop offset="50%" stop-color="#04323f" />
              <stop offset="100%" stop-color="#02151d" />
            </linearGradient>
            <linearGradient id="bc_housing" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#1e293b" />
              <stop offset="50%" stop-color="#0f172a" />
              <stop offset="100%" stop-color="#020617" />
            </linearGradient>
            <linearGradient id="bc_blade" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#64748b" />
              <stop offset="25%" stop-color="#ffffff" />
              <stop offset="50%" stop-color="#cbd5e1" />
              <stop offset="75%" stop-color="#f8fafc" />
              <stop offset="100%" stop-color="#475569" />
            </linearGradient>
            <linearGradient id="bc_lube" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#0284c7" />
              <stop offset="50%" stop-color="#38bdf8" />
              <stop offset="100%" stop-color="#06b6d4" />
            </linearGradient>
          </defs>

          <!-- Background -->
          <rect width="1200" height="675" fill="url(#bc_bg)" />

          <!-- High-Tech Hexagonal Mesh Pattern in BG -->
          <g opacity="0.08" stroke="#38bdf8" stroke-width="1.5" fill="none">
            <polygon points="100,100 130,80 160,100 160,130 130,150 100,130" />
            <polygon points="170,100 200,80 230,100 230,130 200,150 170,130" />
            <polygon points="240,100 270,80 300,100 300,130 270,150 240,130" />
            <polygon points="700,150 730,130 760,150 760,180 730,200 700,180" />
            <polygon points="770,150 800,130 830,150 830,180 800,200 770,180" />
            <polygon points="840,150 870,130 900,150 900,180 870,200 840,180" />
          </g>

          <!-- ======================================================== -->
          <!-- HERO SHOWPIECE: 5-BLADE PRECISION SHAVING CARTRIDGE HEAD  -->
          <!-- ======================================================== -->
          <g transform="translate(680, 310) rotate(-7)">
            <!-- Cartridge Outer Ergonomic Shell -->
            <rect x="-280" y="-140" width="560" height="280" rx="28" fill="url(#bc_housing)" stroke="#38bdf8" stroke-width="3" />

            <!-- Top Lubricating Strip with Aloe Matrix Indicator -->
            <rect x="-240" y="-120" width="480" height="30" rx="12" fill="url(#bc_lube)" />
            <circle cx="-180" cy="-105" r="4" fill="#ffffff" opacity="0.6" />
            <circle cx="-80" cy="-105" r="4" fill="#ffffff" opacity="0.6" />
            <circle cx="20" cy="-105" r="4" fill="#ffffff" opacity="0.6" />
            <circle cx="120" cy="-105" r="4" fill="#ffffff" opacity="0.6" />
            <text x="0" y="-100" text-anchor="middle" fill="#ffffff" font-family="sans-serif" font-size="11" font-weight="900" letter-spacing="2">ALOE &amp; VITAMIN-E LUBRICATING MATRIX</text>

            <!-- 5 Precision Parallel Blades Array -->
            <!-- Blade 1 -->
            <rect x="-240" y="-70" width="480" height="15" rx="3" fill="url(#bc_blade)" stroke="#94a3b8" stroke-width="0.8" />
            <line x1="-240" y1="-70" x2="240" y2="-70" stroke="#ffffff" stroke-width="2" />
            <!-- Blade 2 -->
            <rect x="-240" y="-45" width="480" height="15" rx="3" fill="url(#bc_blade)" stroke="#94a3b8" stroke-width="0.8" />
            <line x1="-240" y1="-45" x2="240" y2="-45" stroke="#ffffff" stroke-width="2" />
            <!-- Blade 3 (Center) -->
            <rect x="-240" y="-20" width="480" height="15" rx="3" fill="url(#bc_blade)" stroke="#94a3b8" stroke-width="0.8" />
            <line x1="-240" y1="-20" x2="240" y2="-20" stroke="#ffffff" stroke-width="2" />
            <!-- Blade 4 -->
            <rect x="-240" y="5" width="480" height="15" rx="3" fill="url(#bc_blade)" stroke="#94a3b8" stroke-width="0.8" />
            <line x1="-240" y1="5" x2="240" y2="5" stroke="#ffffff" stroke-width="2" />
            <!-- Blade 5 -->
            <rect x="-240" y="30" width="480" height="15" rx="3" fill="url(#bc_blade)" stroke="#94a3b8" stroke-width="0.8" />
            <line x1="-240" y1="30" x2="240" y2="30" stroke="#ffffff" stroke-width="2" />

            <!-- Bottom Rubber Micro-Fin Skin Guard -->
            <rect x="-240" y="65" width="480" height="42" rx="10" fill="#0891b2" opacity="0.85" />
            <!-- Micro-Fin Ridges -->
            <line x1="-230" y1="73" x2="230" y2="73" stroke="#22d3ee" stroke-width="2" />
            <line x1="-230" y1="81" x2="230" y2="81" stroke="#22d3ee" stroke-width="2" />
            <line x1="-230" y1="89" x2="230" y2="89" stroke="#22d3ee" stroke-width="2" />
            <line x1="-230" y1="97" x2="230" y2="97" stroke="#22d3ee" stroke-width="2" />

            <!-- Chrome Pivot Axle (Bottom Center Connection) -->
            <polygon points="-60,140 60,140 45,175 -45,175" fill="#94a3b8" stroke="#cbd5e1" stroke-width="2" />
            <circle cx="0" cy="155" r="7" fill="#0284c7" />

            <!-- Metallic Badge -->
            <text x="0" y="130" text-anchor="middle" fill="#38bdf8" font-family="'Courier New', monospace" font-size="14" font-weight="900" letter-spacing="3">AKM 5-BLADE MATRIX COMFORT SYSTEM</text>
          </g>

          <!-- Top-Left Certified Badge -->
          <g transform="translate(48, 48)">
            <rect width="280" height="38" rx="19" fill="#000000" fill-opacity="0.85" stroke="#0284c7" stroke-width="1.8" />
            <circle cx="24" cy="19" r="6" fill="#38bdf8" />
            <text x="42" y="24" fill="#7dd3fc" font-family="sans-serif" font-size="12" font-weight="900" letter-spacing="1">5-BLADE CARTRIDGE ASSEMBLY</text>
          </g>

          <!-- Bottom Micro Spec Badge -->
          <g transform="translate(48, 580)">
            <rect width="410" height="44" rx="12" fill="#021b24" fill-opacity="0.9" stroke="#0284c7" stroke-width="1.5" />
            <text x="20" y="27" fill="#38bdf8" font-family="monospace" font-size="13" font-weight="bold">AKM MATRIX COMFORT SHAVING SERIES</text>
            <text x="330" y="27" fill="#fbbf24" font-family="monospace" font-size="13" font-weight="900">₹8,708 Payout</text>
          </g>
        </svg>
      `)}`;

    case 'blade-titanium-cutters':
      // Banner 3: Golden Titanium Nitride Industrial Utility & Rotary Slitter Blades
      return `data:image/svg+xml;utf8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" width="100%" height="100%">
          <defs>
            <linearGradient id="bt_bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#1c1303" />
              <stop offset="50%" stop-color="#362406" />
              <stop offset="100%" stop-color="#140d02" />
            </linearGradient>
            <linearGradient id="bt_gold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#fef08a" />
              <stop offset="35%" stop-color="#eab308" />
              <stop offset="70%" stop-color="#ca8a04" />
              <stop offset="100%" stop-color="#854d0e" />
            </linearGradient>
            <linearGradient id="bt_steel" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#475569" />
              <stop offset="50%" stop-color="#e2e8f0" />
              <stop offset="100%" stop-color="#334155" />
            </linearGradient>
          </defs>

          <!-- Background Canvas -->
          <rect width="1200" height="675" fill="url(#bt_bg)" />

          <!-- High-End Radial Amber Backlight -->
          <circle cx="720" cy="320" r="280" fill="#f59e0b" opacity="0.12" />

          <!-- Carbon Fiber Diagonal Tech Texture in BG -->
          <g stroke="#78350f" stroke-width="0.75" opacity="0.2">
            <line x1="0" y1="0" x2="1200" y2="600" />
            <line x1="0" y1="80" x2="1200" y2="680" />
            <line x1="0" y1="160" x2="1200" y2="760" />
            <line x1="0" y1="240" x2="1200" y2="840" />
          </g>

          <!-- ======================================================== -->
          <!-- HERO SHOWPIECE 1: INDUSTRIAL CIRCULAR ROTARY SLITTER     -->
          <!-- ======================================================== -->
          <g transform="translate(850, 290)">
            <circle cx="0" cy="0" r="160" fill="url(#bt_steel)" stroke="#fef08a" stroke-width="2" />
            <circle cx="0" cy="0" r="150" fill="none" stroke="#94a3b8" stroke-dasharray="8 6" stroke-width="3" />
            <!-- Golden Titanium Bevel Outer Ring -->
            <circle cx="0" cy="0" r="140" fill="url(#bt_gold)" opacity="0.9" />
            <circle cx="0" cy="0" r="95" fill="#1e293b" stroke="#ca8a04" stroke-width="3" />
            <!-- Center Arbor Mounting Hole -->
            <circle cx="0" cy="0" r="35" fill="#020617" stroke="#64748b" stroke-width="3" />
            <!-- Drive Pin Holes -->
            <circle cx="-55" cy="0" r="8" fill="#020617" />
            <circle cx="55" cy="0" r="8" fill="#020617" />
            <circle cx="0" cy="-55" r="8" fill="#020617" />
            <circle cx="0" cy="55" r="8" fill="#020617" />
            <text x="0" y="5" text-anchor="middle" fill="#fef08a" font-family="monospace" font-size="11" font-weight="900">AKM ROTARY</text>
          </g>

          <!-- ======================================================== -->
          <!-- HERO SHOWPIECE 2: GOLDEN TITANIUM UTILITY RAZOR BLADE    -->
          <!-- ======================================================== -->
          <g transform="translate(560, 360) rotate(-14)">
            <!-- Trapezoidal Utility Blade Shape -->
            <polygon points="-220,-80 220,-80 180,80 -180,80" fill="url(#bt_gold)" stroke="#fef08a" stroke-width="2.5" />
            <!-- Ultra Sharp Beveled Cutting Edge along bottom -->
            <polygon points="-180,80 180,80 170,68 -170,68" fill="#ffffff" opacity="0.95" />
            <line x1="-180" y1="80" x2="180" y2="80" stroke="#fef08a" stroke-width="3" />

            <!-- Top Mounting Notches (2 Keyway Slots) -->
            <rect x="-80" y="-80" width="30" height="25" rx="3" fill="#1c1303" />
            <rect x="50" y="-80" width="30" height="25" rx="3" fill="#1c1303" />

            <!-- Center Grip Hole -->
            <circle cx="-15" cy="-25" r="12" fill="#1c1303" stroke="#78350f" stroke-width="1.5" />

            <!-- Laser Etched Metric Calibration Scale -->
            <line x1="-140" y1="-65" x2="140" y2="-65" stroke="#78350f" stroke-width="1.5" />
            <line x1="-140" y1="-65" x2="-140" y2="-55" stroke="#78350f" stroke-width="1.5" />
            <line x1="-100" y1="-65" x2="-100" y2="-57" stroke="#78350f" stroke-width="1.5" />
            <line x1="-60" y1="-65" x2="-60" y2="-55" stroke="#78350f" stroke-width="1.5" />
            <line x1="-20" y1="-65" x2="-20" y2="-57" stroke="#78350f" stroke-width="1.5" />
            <line x1="20" y1="-65" x2="20" y2="-55" stroke="#78350f" stroke-width="1.5" />
            <line x1="60" y1="-65" x2="60" y2="-57" stroke="#78350f" stroke-width="1.5" />
            <line x1="100" y1="-65" x2="100" y2="-55" stroke="#78350f" stroke-width="1.5" />
            <line x1="140" y1="-65" x2="140" y2="-55" stroke="#78350f" stroke-width="1.5" />

            <!-- Laser Text -->
            <text x="0" y="10" text-anchor="middle" fill="#451a03" font-family="'Courier New', monospace" font-size="15" font-weight="900" letter-spacing="3">TITANIUM NITRIDE (TiN)</text>
            <text x="0" y="32" text-anchor="middle" fill="#78350f" font-family="sans-serif" font-size="9.5" font-weight="800" letter-spacing="2">AKM INDUSTRIAL HEAVY DUTY CUTTERS</text>
          </g>

          <!-- Top-Left Certified Badge -->
          <g transform="translate(48, 48)">
            <rect width="290" height="38" rx="19" fill="#000000" fill-opacity="0.85" stroke="#eab308" stroke-width="1.8" />
            <circle cx="24" cy="19" r="6" fill="#facc15" />
            <text x="42" y="24" fill="#fef08a" font-family="sans-serif" font-size="12" font-weight="900" letter-spacing="1">TITANIUM INDUSTRIAL SERIES</text>
          </g>

          <!-- Bottom Micro Spec Badge -->
          <g transform="translate(48, 580)">
            <rect width="400" height="44" rx="12" fill="#1c1303" fill-opacity="0.9" stroke="#ca8a04" stroke-width="1.5" />
            <text x="20" y="27" fill="#fbbf24" font-family="monospace" font-size="13" font-weight="bold">AKM HEAVY DUTY INDUSTRIAL CUTTERS</text>
            <text x="320" y="27" fill="#34d399" font-family="monospace" font-size="13" font-weight="900">256-Bit Vault</text>
          </g>
        </svg>
      `)}`;

    case 'blade-cryogenic-strip':
    default:
      // Banner 4: Swedish Steel Continuous Cryogenic Blade Strips & High-Speed Honing
      return `data:image/svg+xml;utf8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" width="100%" height="100%">
          <defs>
            <linearGradient id="bs_bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#021c17" />
              <stop offset="50%" stop-color="#04392f" />
              <stop offset="100%" stop-color="#011612" />
            </linearGradient>
            <linearGradient id="bs_strip" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#334155" />
              <stop offset="25%" stop-color="#f8fafc" />
              <stop offset="50%" stop-color="#94a3b8" />
              <stop offset="75%" stop-color="#ffffff" />
              <stop offset="100%" stop-color="#475569" />
            </linearGradient>
            <linearGradient id="bs_gold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#fef08a" />
              <stop offset="100%" stop-color="#eab308" />
            </linearGradient>
          </defs>

          <!-- Background Canvas -->
          <rect width="1200" height="675" fill="url(#bs_bg)" />

          <!-- Dynamic Rolling Strip Ribbon Coil Paths -->
          <path d="M 300,100 C 600,100 800,280 1200,280 L 1200,340 C 750,340 550,160 300,160 Z" fill="url(#bs_strip)" opacity="0.4" />
          <path d="M 200,220 C 500,220 700,420 1200,420 L 1200,470 C 650,470 450,270 200,270 Z" fill="url(#bs_strip)" opacity="0.6" />
          <path d="M 100,340 C 400,340 600,560 1200,560 L 1200,600 C 550,600 350,380 100,380 Z" fill="url(#bs_strip)" opacity="0.8" />

          <!-- Precision Triple Blade Stack (Dynamic 3D perspective) -->
          <g transform="translate(740, 310) rotate(-16)">
            <!-- Blade 1 (Back) -->
            <rect x="-240" y="-120" width="480" height="110" rx="8" fill="#475569" stroke="#94a3b8" stroke-width="1.5" opacity="0.7" />
            <!-- Blade 2 (Middle) -->
            <rect x="-230" y="-70" width="480" height="110" rx="8" fill="#94a3b8" stroke="#cbd5e1" stroke-width="1.5" opacity="0.85" />
            <!-- Blade 3 (Front - Pristine) -->
            <rect x="-220" y="-20" width="480" height="110" rx="8" fill="url(#bs_strip)" stroke="#ffffff" stroke-width="2.5" />
            <!-- Cutting Edge Glare -->
            <line x1="-220" y1="-20" x2="260" y2="-20" stroke="#ffffff" stroke-width="3" />
            <line x1="-220" y1="90" x2="260" y2="90" stroke="#ffffff" stroke-width="3" />

            <!-- Center Cutout on Front Blade -->
            <rect x="-110" y="30" width="220" height="18" rx="9" fill="#011612" stroke="#64748b" stroke-width="1.5" />
            <circle cx="0" cy="39" r="20" fill="#011612" stroke="#64748b" stroke-width="2" />
            <text x="0" y="10" text-anchor="middle" fill="#0f172a" font-family="'Courier New', monospace" font-size="14" font-weight="900" letter-spacing="3">SWEDISH CRYO STEEL</text>
          </g>

          <!-- Spark Particles from Precision Laser Honing -->
          <circle cx="880" cy="240" r="3" fill="#fef08a" />
          <circle cx="910" cy="220" r="2" fill="#fef08a" />
          <circle cx="860" cy="270" r="3.5" fill="#fde047" />
          <circle cx="940" cy="250" r="2.5" fill="#fde047" />
          <circle cx="890" cy="290" r="2" fill="#ffffff" />

          <!-- Top-Left Certified Badge -->
          <g transform="translate(48, 48)">
            <rect width="280" height="38" rx="19" fill="#000000" fill-opacity="0.85" stroke="#10b981" stroke-width="1.8" />
            <circle cx="24" cy="19" r="6" fill="#34d399" />
            <text x="42" y="24" fill="#a7f3d0" font-family="sans-serif" font-size="12" font-weight="900" letter-spacing="1">CRYOGENIC BLADE DIVISION</text>
          </g>

          <!-- Bottom Micro Spec Badge -->
          <g transform="translate(48, 580)">
            <rect width="390" height="44" rx="12" fill="#021c17" fill-opacity="0.9" stroke="#059669" stroke-width="1.5" />
            <text x="20" y="27" fill="#34d399" font-family="monospace" font-size="13" font-weight="bold">CONTINUOUS CRYO RAZOR ROLLING</text>
            <text x="310" y="27" fill="#fbbf24" font-family="monospace" font-size="13" font-weight="900">0.8s IMPS</text>
          </g>
        </svg>
      `)}`;
  }
}
