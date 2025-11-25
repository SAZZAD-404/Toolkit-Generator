/**
 * Utility functions for formatting numbers and timestamps
 */

/**
 * Formats a number with thousand separators
 * @param {number} num - The number to format
 * @returns {string} Formatted number string with separators
 */
export function formatNumber(num) {
  if (typeof num !== 'number' || isNaN(num)) {
    return '0';
  }
  
  // Handle negative numbers
  const isNegative = num < 0;
  const absNum = Math.abs(Math.floor(num));
  
  const formatted = absNum.toLocaleString('en-US');
  return isNegative ? `-${formatted}` : formatted;
}

/**
 * Formats a timestamp as relative time (e.g., "2 hours ago")
 * @param {string|Date} timestamp - ISO timestamp string or Date object
 * @returns {string} Human-readable relative time string
 */
export function formatRelativeTime(timestamp) {
  if (!timestamp) {
    return 'Never';
  }

  const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
  
  if (isNaN(date.getTime())) {
    return 'Never';
  }

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);

  if (diffSeconds < 0) {
    return 'Just now';
  }

  if (diffSeconds < 60) {
    return diffSeconds === 1 ? '1 second ago' : `${diffSeconds} seconds ago`;
  }

  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) {
    return diffMinutes === 1 ? '1 minute ago' : `${diffMinutes} minutes ago`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`;
  }

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) {
    return diffDays === 1 ? '1 day ago' : `${diffDays} days ago`;
  }

  const diffWeeks = Math.floor(diffDays / 7);
  if (diffWeeks < 4) {
    return diffWeeks === 1 ? '1 week ago' : `${diffWeeks} weeks ago`;
  }

  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) {
    return diffMonths === 1 ? '1 month ago' : `${diffMonths} months ago`;
  }

  const diffYears = Math.floor(diffDays / 365);
  return diffYears === 1 ? '1 year ago' : `${diffYears} years ago`;
}
