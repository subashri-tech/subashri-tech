/**
 * Date formatting and calculation helpers for SKILLORA
 */

export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function formatShortDate(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(date);
}

export function getDaysRemaining(deadlineStr: string): {
  days: number;
  text: string;
  isUrgent: boolean;
  isExpired: boolean;
} {
  if (!deadlineStr) {
    return { days: 999, text: 'No deadline', isUrgent: false, isExpired: false };
  }

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const deadline = new Date(deadlineStr);
  deadline.setHours(0, 0, 0, 0);

  const diffTime = deadline.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return {
      days: diffDays,
      text: 'Expired',
      isUrgent: false,
      isExpired: true,
    };
  }

  if (diffDays === 0) {
    return {
      days: 0,
      text: 'Closes Today',
      isUrgent: true,
      isExpired: false,
    };
  }

  if (diffDays === 1) {
    return {
      days: 1,
      text: 'Closes Tomorrow',
      isUrgent: true,
      isExpired: false,
    };
  }

  if (diffDays <= 7) {
    return {
      days: diffDays,
      text: `${diffDays} days left`,
      isUrgent: true,
      isExpired: false,
    };
  }

  return {
    days: diffDays,
    text: `${diffDays} days left`,
    isUrgent: false,
    isExpired: false,
  };
}

export function isClosingSoon(deadlineStr: string, thresholdDays = 7): boolean {
  const { days, isExpired } = getDaysRemaining(deadlineStr);
  return !isExpired && days >= 0 && days <= thresholdDays;
}
