/**
 * Safe Browser Notification API integration for SKILLORA
 */

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    console.warn('Notifications not supported in this browser');
    return 'denied';
  }

  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (e) {
    console.error('Error requesting notification permission:', e);
    return 'denied';
  }
}

export function isNotificationSupported(): boolean {
  return 'Notification' in window;
}

export function getNotificationPermission(): NotificationPermission {
  if (!('Notification' in window)) return 'denied';
  return Notification.permission;
}

export function sendLocalNotification(
  title: string,
  options?: {
    body?: string;
    icon?: string;
    tag?: string;
  }
): boolean {
  if (!('Notification' in window)) return false;

  if (Notification.permission === 'granted') {
    try {
      new Notification(title, {
        body: options?.body || 'SKILLORA Reminder',
        icon: options?.icon || '/favicon.ico',
        tag: options?.tag,
      });
      return true;
    } catch (err) {
      console.warn('Could not dispatch system notification:', err);
      return false;
    }
  }
  return false;
}
