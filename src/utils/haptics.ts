// Mobile tactile haptic feedback utility using the HTML5 Navigator Vibration API
// Provides crisp, responsive tactile feedback across modern mobile browsers (Chrome, Android WebViews, PWAs)

export const HAPTIC_PREF_STORAGE_KEY = 'akm_haptic_feedback_enabled';

let lastVibrateTime = 0;
const VIBRATE_THROTTLE_MS = 25; // Prevents overlapping motor buzzes within rapid taps

// Cache current user preference in memory
let cachedHapticEnabled: boolean = (() => {
  if (typeof window === 'undefined') return true;
  try {
    const saved = localStorage.getItem(HAPTIC_PREF_STORAGE_KEY);
    return saved !== null ? saved === 'true' : true;
  } catch {
    return true;
  }
})();

/**
 * Check if the browser and device hardware support the Vibration API
 */
export const isHapticSupported = (): boolean => {
  return typeof window !== 'undefined' && 'navigator' in window && typeof window.navigator.vibrate === 'function';
};

/**
 * Get current haptic feedback user preference
 */
export const getHapticEnabled = (): boolean => {
  return cachedHapticEnabled;
};

/**
 * Update user haptic feedback preference and persist to localStorage
 */
export const setHapticEnabled = (enabled: boolean): void => {
  cachedHapticEnabled = enabled;
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(HAPTIC_PREF_STORAGE_KEY, enabled ? 'true' : 'false');
      window.dispatchEvent(new CustomEvent('akm:haptic-preference-changed', { detail: { enabled } }));
    } catch {
      // Ignore localStorage errors
    }
  }
};

/**
 * Core vibration trigger with safety guards, preference check & throttling
 * @param pattern Duration in ms or an array of alternating vibrate/pause durations
 * @param force If true, bypasses standard throttle (used for success/error patterns)
 */
export const triggerHaptic = (pattern: number | number[] = 15, force = false): boolean => {
  // If user has disabled tactile vibration feedback in settings, exit immediately
  if (!cachedHapticEnabled) {
    return false;
  }

  if (typeof window === 'undefined' || !('navigator' in window)) {
    return false;
  }

  const now = Date.now();
  if (!force && now - lastVibrateTime < VIBRATE_THROTTLE_MS) {
    return false;
  }
  lastVibrateTime = now;

  try {
    if (typeof window.navigator.vibrate === 'function') {
      return window.navigator.vibrate(pattern);
    }
  } catch {
    // Vibration safely fails gracefully if blocked by device policy or unengaged user gesture
  }
  return false;
};

/**
 * Standard light tactile tap (12ms) - ideal for buttons, tabs, navigation icons, close icons
 */
export const hapticTap = (): boolean => triggerHaptic(12);

/**
 * Subtle tick (8ms) - ideal for wheel ticks, countdown ticks, toggles
 */
export const hapticTick = (): boolean => triggerHaptic(8);

/**
 * Distinct selection tap (18ms) - ideal for selecting recharge amounts, plan cards, filter tabs
 */
export const hapticSelection = (): boolean => triggerHaptic(18);

/**
 * Medium impactful tap (28ms) - for primary confirm buttons, modal triggers, copy actions
 */
export const hapticMedium = (): boolean => triggerHaptic(28);

/**
 * Heavy punch (38ms) - for critical actions like Confirm Payment, Withdraw, Spin Wheel
 */
export const hapticHeavy = (): boolean => triggerHaptic(38, true);

/**
 * Dual pulse success vibration [20ms, 40ms pause, 30ms] - check-in claimed, recharge success, order placed
 */
export const hapticSuccess = (): boolean => triggerHaptic([20, 40, 30], true);

/**
 * Warning vibration [30ms, 40ms pause, 30ms] - validation alert, already spun today
 */
export const hapticWarning = (): boolean => triggerHaptic([30, 40, 30], true);

/**
 * Staccato error buzz [45ms, 45ms pause, 45ms, 45ms pause, 50ms] - failed login, invalid input, insufficient balance
 */
export const hapticError = (): boolean => triggerHaptic([45, 45, 45, 45, 50], true);

/**
 * Festive celebratory vibration [25ms, 35ms pause, 35ms, 45ms pause, 55ms] - 7-day streak, lucky spin jackpot
 */
export const hapticCelebration = (): boolean => triggerHaptic([25, 35, 35, 45, 55], true);

/**
 * Attaches a delegated global listener on `window` to provide instant tactile vibration
 * for ALL buttons, clickable role elements, and interactive triggers throughout the application.
 */
let isListenerInitialized = false;

export const initGlobalHapticListener = (): (() => void) => {
  if (typeof window === 'undefined' || isListenerInitialized) {
    return () => {};
  }
  isListenerInitialized = true;

  const handlePointerOrClick = (event: Event) => {
    if (!cachedHapticEnabled) return;
    try {
      const target = event.target as HTMLElement | null;
      if (!target) return;

      // Find if clicked element is a button, has button role, or is an explicit interactive element
      const interactiveEl = target.closest(
        'button, [role="button"], a[href], input[type="button"], input[type="submit"], [data-haptic], .cursor-pointer'
      );

      if (interactiveEl) {
        // If element specifies a custom haptic intensity via data-haptic
        const hapticType = interactiveEl.getAttribute('data-haptic');
        switch (hapticType) {
          case 'heavy':
            hapticHeavy();
            break;
          case 'medium':
            hapticMedium();
            break;
          case 'success':
            hapticSuccess();
            break;
          case 'warning':
            hapticWarning();
            break;
          case 'error':
            hapticError();
            break;
          case 'none':
            // Explicitly silenced
            break;
          default:
            hapticTap();
            break;
        }
      }
    } catch {
      // Ignored
    }
  };

  // Listen on capture phase to ensure instant tactile feedback upon user gesture
  window.addEventListener('click', handlePointerOrClick, { capture: true, passive: true });

  return () => {
    window.removeEventListener('click', handlePointerOrClick, { capture: true });
    isListenerInitialized = false;
  };
};
