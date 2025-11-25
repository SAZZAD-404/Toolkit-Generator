import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const StatsContext = createContext();

const STORAGE_KEY = 'toolkit_stats';

const DEFAULT_STATS = {
  gmail: { totalCount: 0, todayCount: 0, lastUsed: null, history: [] },
  useragent: { totalCount: 0, todayCount: 0, lastUsed: null, history: [] },
  ipfinder: { totalCount: 0, todayCount: 0, lastUsed: null, history: [] },
  numbergenerator: { totalCount: 0, todayCount: 0, lastUsed: null, history: [] }
};

/**
 * Gets today's date in YYYY-MM-DD format
 */
function getTodayDateString() {
  return new Date().toISOString().split('T')[0];
}

/**
 * Validates and sanitizes stats data structure
 */
function validateStats(data) {
  if (!data || typeof data !== 'object') {
    return { ...DEFAULT_STATS };
  }

  const validated = {};
  for (const [key, defaultValue] of Object.entries(DEFAULT_STATS)) {
    const value = data[key];
    if (!value || typeof value !== 'object') {
      validated[key] = { ...defaultValue };
    } else {
      validated[key] = {
        totalCount: typeof value.totalCount === 'number' && value.totalCount >= 0 
          ? value.totalCount : 0,
        todayCount: typeof value.todayCount === 'number' && value.todayCount >= 0 
          ? value.todayCount : 0,
        lastUsed: typeof value.lastUsed === 'string' ? value.lastUsed : null,
        history: Array.isArray(value.history) ? value.history : []
      };
    }
  }
  return validated;
}

/**
 * Loads stats from localStorage with error handling
 */
function loadStatsFromStorage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return { ...DEFAULT_STATS };
    }
    const parsed = JSON.parse(stored);
    return validateStats(parsed);
  } catch (error) {
    console.error('Error loading stats from localStorage:', error);
    return { ...DEFAULT_STATS };
  }
}


/**
 * Saves stats to localStorage with error handling
 */
function saveStatsToStorage(stats) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    return true;
  } catch (error) {
    console.error('Error saving stats to localStorage:', error);
    return false;
  }
}

export function StatsProvider({ children }) {
  const [stats, setStats] = useState(() => loadStatsFromStorage());
  const [storageError, setStorageError] = useState(false);

  // Reset today's counts at midnight
  useEffect(() => {
    const today = getTodayDateString();
    setStats(prevStats => {
      let needsUpdate = false;
      const updatedStats = { ...prevStats };
      
      for (const key of Object.keys(updatedStats)) {
        const stat = updatedStats[key];
        // Check if the last history entry is from today
        const lastHistoryEntry = stat.history[stat.history.length - 1];
        if (!lastHistoryEntry || lastHistoryEntry.date !== today) {
          // If todayCount > 0 but no entry for today, reset todayCount
          if (stat.todayCount > 0 && (!lastHistoryEntry || lastHistoryEntry.date !== today)) {
            updatedStats[key] = { ...stat, todayCount: 0 };
            needsUpdate = true;
          }
        }
      }
      
      return needsUpdate ? updatedStats : prevStats;
    });
  }, []);

  // Persist stats to localStorage whenever they change
  useEffect(() => {
    const success = saveStatsToStorage(stats);
    setStorageError(!success);
  }, [stats]);

  /**
   * Records a generation event for a specific generator type
   * @param {string} generatorType - The type of generator (gmail, useragent, etc.)
   * @param {number} count - Number of items generated
   */
  const recordGeneration = useCallback((generatorType, count = 1) => {
    if (!generatorType || typeof count !== 'number' || count < 1) {
      return;
    }

    const normalizedType = generatorType.toLowerCase();
    const today = getTodayDateString();
    const timestamp = new Date().toISOString();

    setStats(prevStats => {
      const currentStat = prevStats[normalizedType] || {
        totalCount: 0,
        todayCount: 0,
        lastUsed: null,
        history: []
      };

      // Update history
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

      // Keep only last 30 days of history
      const trimmedHistory = history.slice(-30);

      return {
        ...prevStats,
        [normalizedType]: {
          totalCount: currentStat.totalCount + count,
          todayCount: currentStat.todayCount + count,
          lastUsed: timestamp,
          history: trimmedHistory
        }
      };
    });
  }, []);

  /**
   * Clears all statistics
   */
  const clearStats = useCallback(() => {
    setStats({ ...DEFAULT_STATS });
  }, []);

  /**
   * Gets today's count for a specific generator type
   * @param {string} generatorType - The type of generator
   * @returns {number} Today's generation count
   */
  const getTodayCount = useCallback((generatorType) => {
    if (!generatorType) return 0;
    const normalizedType = generatorType.toLowerCase();
    return stats[normalizedType]?.todayCount || 0;
  }, [stats]);

  return (
    <StatsContext.Provider value={{ 
      stats, 
      recordGeneration, 
      clearStats, 
      getTodayCount,
      storageError 
    }}>
      {children}
    </StatsContext.Provider>
  );
}

export const useStats = () => useContext(StatsContext);

// Export for testing purposes
export { DEFAULT_STATS, validateStats, loadStatsFromStorage, saveStatsToStorage, STORAGE_KEY };
