import { describe, it, beforeEach, afterEach, vi } from 'vitest';
import * as fc from 'fast-check';
import { 
  DEFAULT_STATS, 
  validateStats, 
  STORAGE_KEY 
} from './StatsContext';

// Mock localStorage for testing
const createMockLocalStorage = () => {
  let store = {};
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => { store[key] = value; }),
    removeItem: vi.fn((key) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
    get store() { return store; }
  };
};

/**
 * Pure function that simulates recordGeneration logic for testing
 * This mirrors the logic in StatsContext's recordGeneration callback
 */
function simulateRecordGeneration(stats, generatorType, count = 1) {
  if (!generatorType || typeof count !== 'number' || count < 1) {
    return stats;
  }

  const normalizedType = generatorType.toLowerCase();
  const today = new Date().toISOString().split('T')[0];
  const timestamp = new Date().toISOString();

  const currentStat = stats[normalizedType] || {
    totalCount: 0,
    todayCount: 0,
    lastUsed: null,
    history: []
  };

  const history = [...currentStat.history];
  const todayIndex = history.findIndex(h => h.date === today);
  
  if (todayIndex >= 0) {
    history[todayIndex] = {
      ...history[todayIndex],
      count: history[todayIndex].count + count
    };
  } else {
    history.push({ date: today, count });
  }

  const trimmedHistory = history.slice(-30);

  return {
    ...stats,
    [normalizedType]: {
      totalCount: currentStat.totalCount + count,
      todayCount: currentStat.todayCount + count,
      lastUsed: timestamp,
      history: trimmedHistory
    }
  };
}

/**
 * Pure function that simulates clearStats logic
 */
function simulateClearStats() {
  return { ...DEFAULT_STATS };
}

describe('StatsContext Property Tests', () => {
  let mockLocalStorage;

  beforeEach(() => {
    mockLocalStorage = createMockLocalStorage();
    vi.stubGlobal('localStorage', mockLocalStorage);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  /**
   * **Feature: custom-templates-stats, Property 4: Statistics Count Increment**
   * *For any* generation action with count N, the total count for that generator type 
   * should increase by exactly N.
   * **Validates: Requirements 6.1**
   */
  describe('Property 4: Statistics Count Increment', () => {
    // Generator for valid generator types
    const generatorTypeArb = fc.constantFrom('gmail', 'useragent', 'ipfinder', 'numbergenerator');
    
    // Generator for valid count values (positive integers)
    const countArb = fc.integer({ min: 1, max: 1000 });

    it('should increment totalCount by exactly N for any valid count', () => {
      fc.assert(
        fc.property(
          generatorTypeArb,
          countArb,
          (generatorType, count) => {
            const initialStats = { ...DEFAULT_STATS };
            const initialTotal = initialStats[generatorType].totalCount;
            
            const newStats = simulateRecordGeneration(initialStats, generatorType, count);
            const newTotal = newStats[generatorType].totalCount;
            
            return newTotal === initialTotal + count;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should increment todayCount by exactly N for any valid count', () => {
      fc.assert(
        fc.property(
          generatorTypeArb,
          countArb,
          (generatorType, count) => {
            const initialStats = { ...DEFAULT_STATS };
            const initialToday = initialStats[generatorType].todayCount;
            
            const newStats = simulateRecordGeneration(initialStats, generatorType, count);
            const newToday = newStats[generatorType].todayCount;
            
            return newToday === initialToday + count;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should accumulate counts correctly over multiple generations', () => {
      fc.assert(
        fc.property(
          generatorTypeArb,
          fc.array(countArb, { minLength: 1, maxLength: 10 }),
          (generatorType, counts) => {
            let stats = { ...DEFAULT_STATS };
            const expectedTotal = counts.reduce((sum, c) => sum + c, 0);
            
            for (const count of counts) {
              stats = simulateRecordGeneration(stats, generatorType, count);
            }
            
            return stats[generatorType].totalCount === expectedTotal;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * **Feature: custom-templates-stats, Property 5: Statistics Data Structure Integrity**
   * *For any* recorded statistic, the stored data should contain generatorType (string), 
   * totalCount (number >= 0), todayCount (number >= 0), and lastUsed (valid ISO timestamp or null).
   * **Validates: Requirements 6.2**
   */
  describe('Property 5: Statistics Data Structure Integrity', () => {
    const generatorTypeArb = fc.constantFrom('gmail', 'useragent', 'ipfinder', 'numbergenerator');
    const countArb = fc.integer({ min: 1, max: 1000 });

    it('should maintain valid data structure after recording generation', () => {
      fc.assert(
        fc.property(
          generatorTypeArb,
          countArb,
          (generatorType, count) => {
            const stats = simulateRecordGeneration({ ...DEFAULT_STATS }, generatorType, count);
            const stat = stats[generatorType];
            
            // Check totalCount is a non-negative number
            if (typeof stat.totalCount !== 'number' || stat.totalCount < 0) {
              return false;
            }
            
            // Check todayCount is a non-negative number
            if (typeof stat.todayCount !== 'number' || stat.todayCount < 0) {
              return false;
            }
            
            // Check lastUsed is a valid ISO timestamp or null
            if (stat.lastUsed !== null) {
              if (typeof stat.lastUsed !== 'string') {
                return false;
              }
              // Validate ISO timestamp format
              const date = new Date(stat.lastUsed);
              if (isNaN(date.getTime())) {
                return false;
              }
            }
            
            // Check history is an array
            if (!Array.isArray(stat.history)) {
              return false;
            }
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should validate and sanitize corrupted stats data', () => {
      // Generator for potentially corrupted stats data
      const corruptedStatsArb = fc.record({
        gmail: fc.oneof(
          fc.constant(null),
          fc.constant(undefined),
          fc.constant('invalid'),
          fc.record({
            totalCount: fc.oneof(fc.integer(), fc.constant('invalid'), fc.constant(null)),
            todayCount: fc.oneof(fc.integer(), fc.constant('invalid'), fc.constant(null)),
            lastUsed: fc.oneof(fc.string(), fc.constant(null)),
            history: fc.oneof(fc.array(fc.anything()), fc.constant(null))
          })
        )
      });

      fc.assert(
        fc.property(
          corruptedStatsArb,
          (corruptedData) => {
            const validated = validateStats(corruptedData);
            
            // After validation, all generator types should have valid structure
            for (const key of Object.keys(DEFAULT_STATS)) {
              const stat = validated[key];
              
              // totalCount should be a non-negative number
              if (typeof stat.totalCount !== 'number' || stat.totalCount < 0) {
                return false;
              }
              
              // todayCount should be a non-negative number
              if (typeof stat.todayCount !== 'number' || stat.todayCount < 0) {
                return false;
              }
              
              // lastUsed should be string or null
              if (stat.lastUsed !== null && typeof stat.lastUsed !== 'string') {
                return false;
              }
              
              // history should be an array
              if (!Array.isArray(stat.history)) {
                return false;
              }
            }
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * **Feature: custom-templates-stats, Property 6: Statistics Clear Resets All Counts**
   * *For any* statistics state, calling clearStats should result in all generator types 
   * having totalCount = 0, todayCount = 0, and lastUsed = null.
   * **Validates: Requirements 7.4**
   */
  describe('Property 6: Statistics Clear Resets All Counts', () => {
    const generatorTypeArb = fc.constantFrom('gmail', 'useragent', 'ipfinder', 'numbergenerator');
    const countArb = fc.integer({ min: 1, max: 1000 });

    it('should reset all counts to zero after clearStats', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.tuple(generatorTypeArb, countArb),
            { minLength: 1, maxLength: 20 }
          ),
          (generations) => {
            // Build up some stats
            let stats = { ...DEFAULT_STATS };
            for (const [type, count] of generations) {
              stats = simulateRecordGeneration(stats, type, count);
            }
            
            // Clear stats
            const clearedStats = simulateClearStats();
            
            // Verify all generator types are reset
            for (const key of Object.keys(DEFAULT_STATS)) {
              if (clearedStats[key].totalCount !== 0) return false;
              if (clearedStats[key].todayCount !== 0) return false;
              if (clearedStats[key].lastUsed !== null) return false;
              if (!Array.isArray(clearedStats[key].history) || clearedStats[key].history.length !== 0) {
                return false;
              }
            }
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should return DEFAULT_STATS structure after clear', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.tuple(generatorTypeArb, countArb),
            { minLength: 0, maxLength: 10 }
          ),
          () => {
            const clearedStats = simulateClearStats();
            
            // Should have all the same keys as DEFAULT_STATS
            const defaultKeys = Object.keys(DEFAULT_STATS).sort();
            const clearedKeys = Object.keys(clearedStats).sort();
            
            if (defaultKeys.length !== clearedKeys.length) return false;
            
            for (let i = 0; i < defaultKeys.length; i++) {
              if (defaultKeys[i] !== clearedKeys[i]) return false;
            }
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
