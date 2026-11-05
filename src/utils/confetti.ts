import confetti from 'canvas-confetti';

/**
 * Dedicated high-impact celebration confetti animations for AKM Enterprises.
 * Powered by canvas-confetti with multi-stage particle bursts, custom brand colors,
 * and realistic physics for investment purchases and daily check-in rewards.
 */

/**
 * Celebration confetti effect triggered when a user successfully completes an investment purchase
 */
export function triggerInvestmentPurchaseConfetti() {
  try {
    if (typeof window === 'undefined') return;

    // Brand luxury colors: Emerald, Gold, Jade, Amber, Bright White
    const purchaseColors = ['#008f4c', '#10b981', '#fbbf24', '#f59e0b', '#fef08a', '#ffffff'];

    // Stage 1: Massive Central Fountain Cannon Burst
    confetti({
      particleCount: 95,
      spread: 75,
      origin: { y: 0.6 },
      colors: purchaseColors,
      ticks: 280,
      gravity: 0.9,
      scalar: 1.15,
      shapes: ['circle', 'square'],
      disableForReducedMotion: true
    });

    // Stage 2: Dual Left & Right Celebration Cannons (200ms delay)
    setTimeout(() => {
      confetti({
        particleCount: 55,
        angle: 60,
        spread: 65,
        origin: { x: 0, y: 0.65 },
        colors: purchaseColors,
        ticks: 300,
        gravity: 0.85,
        disableForReducedMotion: true
      });
      confetti({
        particleCount: 55,
        angle: 120,
        spread: 65,
        origin: { x: 1, y: 0.65 },
        colors: purchaseColors,
        ticks: 300,
        gravity: 0.85,
        disableForReducedMotion: true
      });
    }, 200);

    // Stage 3: Golden Fortune Star Shower (450ms delay)
    setTimeout(() => {
      confetti({
        particleCount: 40,
        spread: 100,
        origin: { y: 0.35 },
        colors: ['#fbbf24', '#f59e0b', '#fef08a', '#ffffff'],
        gravity: 0.7,
        scalar: 1.0,
        ticks: 220,
        disableForReducedMotion: true
      });
    }, 450);
  } catch (err) {
    console.warn('Investment purchase confetti error:', err);
  }
}

/**
 * Celebration confetti effect triggered when a user receives their daily check-in reward
 */
export function triggerDailyCheckInConfetti(is7DayStreak = false) {
  try {
    if (typeof window === 'undefined') return;

    const checkInColors = is7DayStreak
      ? ['#10b981', '#f59e0b', '#fbbf24', '#34d399', '#6366f1', '#ffffff']
      : ['#008f4c', '#10b981', '#34d399', '#fbbf24', '#38bdf8', '#ffffff'];

    // Stage 1: Dynamic celebratory burst from center-bottom
    confetti({
      particleCount: is7DayStreak ? 120 : 85,
      spread: is7DayStreak ? 85 : 70,
      origin: { y: 0.55 },
      colors: checkInColors,
      ticks: 260,
      gravity: 0.9,
      scalar: is7DayStreak ? 1.2 : 1.05,
      shapes: ['circle', 'square'],
      disableForReducedMotion: true
    });

    // Stage 2: Dual energetic side cannons
    setTimeout(() => {
      confetti({
        particleCount: is7DayStreak ? 65 : 45,
        angle: 60,
        spread: 60,
        origin: { x: 0.05, y: 0.62 },
        colors: checkInColors,
        ticks: 260,
        gravity: 0.85,
        disableForReducedMotion: true
      });
      confetti({
        particleCount: is7DayStreak ? 65 : 45,
        angle: 120,
        spread: 60,
        origin: { x: 0.95, y: 0.62 },
        colors: checkInColors,
        ticks: 260,
        gravity: 0.85,
        disableForReducedMotion: true
      });
    }, 200);

    // Stage 3 for 7-day streak: Top star rain
    if (is7DayStreak) {
      setTimeout(() => {
        confetti({
          particleCount: 50,
          spread: 110,
          origin: { y: 0.3 },
          colors: ['#fbbf24', '#f59e0b', '#34d399', '#ffffff'],
          gravity: 0.65,
          scalar: 1.1,
          ticks: 240,
          disableForReducedMotion: true
        });
      }, 420);
    }
  } catch (err) {
    console.warn('Daily check-in confetti error:', err);
  }
}

/**
 * Universal dispatcher for backward-compatible calls
 */
export function triggerCelebrationConfetti(type: 'purchase' | 'checkin' | 'withdrawal' | 'general' = 'general') {
  if (type === 'purchase') {
    triggerInvestmentPurchaseConfetti();
  } else if (type === 'checkin') {
    triggerDailyCheckInConfetti(false);
  } else {
    // General celebratory burst
    try {
      if (typeof window === 'undefined') return;
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#059669', '#10b981', '#34d399', '#38bdf8', '#fbbf24', '#ffffff'],
        ticks: 250,
        disableForReducedMotion: true
      });
    } catch {}
  }
}
