// Browser Local Notifications & Web Notification API Manager

export const isNotificationSupported = (): boolean => {
  return typeof window !== 'undefined' && 'Notification' in window;
};

export const getNotificationPermission = (): NotificationPermission | 'unsupported' => {
  if (!isNotificationSupported()) return 'unsupported';
  return Notification.permission;
};

export const requestNotificationPermission = async (): Promise<NotificationPermission | 'unsupported'> => {
  if (!isNotificationSupported()) return 'unsupported';
  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (err) {
    console.warn('Notification permission request error:', err);
    return Notification.permission;
  }
};

export interface LocalNotificationOptions {
  body?: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: any;
  vibrate?: number[];
  onClick?: () => void;
}

export const dispatchBrowserNotification = (
  title: string,
  options: LocalNotificationOptions = {}
): boolean => {
  if (!isNotificationSupported()) return false;

  try {
    if (Notification.permission === 'granted') {
      const notif = new Notification(title, {
        body: options.body,
        icon: options.icon || '/vite.svg',
        badge: options.badge || '/vite.svg',
        tag: options.tag || `akm-notif-${Date.now()}`,
        data: options.data,
      });

      // Haptic vibration feedback if supported
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        try {
          navigator.vibrate(options.vibrate || [120, 60, 120]);
        } catch {}
      }

      notif.onclick = () => {
        try {
          window.focus();
        } catch {}
        if (options.onClick) {
          options.onClick();
        }
        notif.close();
      };

      return true;
    }
  } catch (err) {
    // In restricted sandbox/iframe environments, Notification constructor may throw
    console.warn('Browser local notification dispatch failed (handled):', err);
  }

  return false;
};
