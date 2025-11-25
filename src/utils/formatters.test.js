import { describe, it } from 'vitest';
import * as fc from 'fast-check';
import { formatNumber, formatRelativeTime } from './formatters';

describe('formatters', () => {
  /**
   * **Feature: custom-templates-stats, Property 7: Number Formatting with Separators**
   * *For any* non-negative integer, the formatNumber function should produce a string 
   * with appropriate thousand separators that, when parsed back (removing separators), 
   * equals the original number.
   * **Validates: Requirements 8.2**
   */
  describe('Property 7: Number Formatting with Separators', () => {
    it('should format numbers with separators that parse back to original value', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: Number.MAX_SAFE_INTEGER }),
          (num) => {
            const formatted = formatNumber(num);
            // Remove commas and parse back
            const parsed = parseInt(formatted.replace(/,/g, ''), 10);
            return parsed === num;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should produce non-empty string for any non-negative integer', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: Number.MAX_SAFE_INTEGER }),
          (num) => {
            const formatted = formatNumber(num);
            return typeof formatted === 'string' && formatted.length > 0;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * **Feature: custom-templates-stats, Property 8: Relative Time Formatting**
   * *For any* valid timestamp within the past year, the formatRelativeTime function 
   * should produce a non-empty human-readable string containing a time unit 
   * (seconds, minutes, hours, days, weeks, months).
   * **Validates: Requirements 8.3**
   */
  describe('Property 8: Relative Time Formatting', () => {
    it('should produce string with time unit for timestamps within past year', () => {
      const now = Date.now();
      const oneYearAgo = now - (365 * 24 * 60 * 60 * 1000);

      fc.assert(
        fc.property(
          fc.integer({ min: oneYearAgo, max: now }),
          (timestamp) => {
            const date = new Date(timestamp);
            const formatted = formatRelativeTime(date.toISOString());
            
            // Should be non-empty string
            if (typeof formatted !== 'string' || formatted.length === 0) {
              return false;
            }
            
            // Should contain a time unit
            const timeUnits = ['second', 'minute', 'hour', 'day', 'week', 'month', 'year', 'Just now'];
            return timeUnits.some(unit => formatted.toLowerCase().includes(unit.toLowerCase()));
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should return non-empty string for any valid Date object', () => {
      const now = Date.now();
      const oneYearAgo = now - (365 * 24 * 60 * 60 * 1000);

      fc.assert(
        fc.property(
          fc.integer({ min: oneYearAgo, max: now }),
          (timestamp) => {
            const date = new Date(timestamp);
            const formatted = formatRelativeTime(date);
            return typeof formatted === 'string' && formatted.length > 0;
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
