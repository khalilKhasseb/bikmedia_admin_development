import { reactive, computed, ref } from 'vue';
import apiServices from '@/services/api';
import { useErrorHandling } from './use-error-handling';

/**
 * Dashboard Data Composable
 * 
 * Provides centralized data fetching and state management for dashboard widgets.
 * Handles parallel API calls, error states, loading states, and data transformations
 * for gifts, equipment, levels, and users.
 * 
 * @returns {Object} Dashboard data management interface
 */
export function useDashboardData() {
  // Debug: Check if API services are available
  console.log('Dashboard: API services available:', {
    gift: !!apiServices.gift,
    equipment: !!apiServices.equipment,
    level: !!apiServices.level,
    // user: !!apiServices.user
  });

  // Cleanup flag to prevent operations after component unmount
  const isCleanedUp = ref(false);

  // Initialize error handling
  const {
    autoRetryWithBackoff,
    retryWidget,
    setWidgetError,
    clearWidgetError,
    getWidgetError,
    canRetry,
    createFallbackData,
    shouldShowFallback,
    widgetErrors
  } = useErrorHandling();

  // Reactive state for dashboard data
  const dashboardData = reactive({
    gifts: [],
    equipment: [],
    levels: [],
    users: []
  });

  // Loading states for each data type
  const loading = reactive({
    gifts: false,
    equipment: false,
    levels: false,
    // users: false
  });

  // Error states for each data type (now using error handling composable)
  const errors = computed(() => ({
    gifts: getWidgetError('gifts')?.message || null,
    equipment: getWidgetError('equipment')?.message || null,
    levels: getWidgetError('levels')?.message || null,
    // users: getWidgetError('users')?.message || null
  }));

  // Enhanced cache management with metadata
  const cache = reactive({
    gifts: { data: [], timestamp: null, etag: null, size: 0 },
    equipment: { data: [], timestamp: null, etag: null, size: 0 },
    levels: { data: [], timestamp: null, etag: null, size: 0 },
    // users: { data: [], timestamp: null, etag: null, size: 0 }
  });

  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
  const MAX_CACHE_SIZE = 1000; // Maximum items per cache

  // Loading coordination to prevent UI flickering
  const loadingCoordinator = reactive({
    activeRequests: new Set(),
    lastRefreshTime: null,
    refreshInProgress: false
  });

  /**
   * Check if cached data is still fresh
   * @param {string} type - Data type to check
   * @returns {boolean} True if cache is fresh
   */
  const isCacheFresh = (type) => {
    const cacheEntry = cache[type];
    if (!cacheEntry.timestamp) return false;
    return Date.now() - cacheEntry.timestamp < CACHE_DURATION;
  };

  /**
   * Invalidate cache for specific type or all types
   * @param {string|null} type - Data type to invalidate, null for all
   */
  const invalidateCache = (type = null) => {
    if (type) {
      cache[type] = { data: [], timestamp: null, etag: null, size: 0 };
      console.log(`Dashboard: Cache invalidated for ${type}`);
    } else {
      // Invalidate all caches
      Object.keys(cache).forEach(key => {
        cache[key] = { data: [], timestamp: null, etag: null, size: 0 };
      });
      console.log('Dashboard: All caches invalidated');
    }
  };

  /**
   * Get cache statistics for monitoring
   * @returns {Object} Cache statistics
   */
  const getCacheStats = () => {
    const stats = {};
    Object.keys(cache).forEach(type => {
      const cacheEntry = cache[type];
      stats[type] = {
        size: cacheEntry.size,
        age: cacheEntry.timestamp ? Date.now() - cacheEntry.timestamp : null,
        fresh: isCacheFresh(type),
        hasData: cacheEntry.data.length > 0
      };
    });
    return stats;
  };

  /**
   * Coordinate loading states to prevent UI flickering
   * @param {string} type - Data type being loaded
   * @param {Function} loadFunction - Function to execute
   * @returns {Promise} Loading promise
   */
  const coordinateLoading = async (type, loadFunction) => {
    // Prevent duplicate requests
    if (loadingCoordinator.activeRequests.has(type)) {
      console.log(`Dashboard: Request for ${type} already in progress, skipping`);
      return;
    }

    loadingCoordinator.activeRequests.add(type);

    try {
      await loadFunction();
    } finally {
      loadingCoordinator.activeRequests.delete(type);
    }
  };

  /**
   * Fetch gifts data from API with enhanced caching and error recovery
   * @param {boolean} forceRefresh - Force refresh ignoring cache
   * @returns {Promise<void>}
   */
  const fetchGifts = async (forceRefresh = false) => {
    return coordinateLoading('gifts', async () => {
      console.log('Dashboard: Fetching gifts data...');
      // Use cached data if fresh and not forcing refresh
      if (!forceRefresh && isCacheFresh('gifts') && cache.gifts.data.length > 0) {
        dashboardData.gifts = cache.gifts.data;
        clearWidgetError('gifts');
        console.log('Dashboard: Using cached gifts data');
        return;
      }

      loading.gifts = true;

      try {
        console.log('Dashboard: Using mock gifts data for now...');
        // Mock data for testing - replace with actual API call when ready
        const mockGifts = [
          { id: 1, name: 'Heart Gift', type: 1, coin: 100 },
          { id: 2, name: 'Rose Gift', type: 2, coin: 250 },
          { id: 3, name: 'Diamond Gift', type: 3, coin: 500 }
        ];

        const response = { items: mockGifts };
        console.log('Dashboard: Using mock gifts response:', response);

        const items = response.items || [];

        // Update cache with new data
        cache.gifts = {
          data: items,
          timestamp: Date.now(),
          etag: response.etag || null,
          size: items.length
        };

        // Limit cache size to prevent memory issues
        if (items.length > MAX_CACHE_SIZE) {
          cache.gifts.data = items.slice(0, MAX_CACHE_SIZE);
          cache.gifts.size = MAX_CACHE_SIZE;
          console.warn(`Dashboard: Gifts cache truncated to ${MAX_CACHE_SIZE} items`);
        }

        dashboardData.gifts = cache.gifts.data;
        clearWidgetError('gifts');
        console.log(`Dashboard: Gifts data cached (${cache.gifts.size} items)`);
        console.log('Dashboard: Current gifts data:', dashboardData.gifts);
      } catch (error) {
        console.error('Dashboard: Failed to fetch gifts:', error);

        // Use fallback data if available
        if (shouldShowFallback('gifts') && cache.gifts.data.length > 0) {
          dashboardData.gifts = cache.gifts.data;
          console.log('Dashboard: Using fallback gifts data due to error');
        } else {
          dashboardData.gifts = [];
        }
      } finally {
        loading.gifts = false;
      }
    });
  };

  /**
   * Fetch equipment data from API with enhanced caching and error recovery
   * @param {boolean} forceRefresh - Force refresh ignoring cache
   * @returns {Promise<void>}
   */
  const fetchEquipment = async (forceRefresh = false) => {
    return coordinateLoading('equipment', async () => {
      // Use cached data if fresh and not forcing refresh
      if (!forceRefresh && isCacheFresh('equipment') && cache.equipment.data.length > 0) {
        dashboardData.equipment = cache.equipment.data;
        clearWidgetError('equipment');
        return;
      }

      loading.equipment = true;

      try {
        console.log('Dashboard: Using mock equipment data for now...');
        // Mock data for testing - replace with actual API call when ready
        const mockEquipment = [
          { id: 1, name: 'Golden Frame', type: 1, coin: 300 },
          { id: 2, name: 'VIP Badge', type: 3, coin: 150 },
          { id: 3, name: 'Special Theme', type: 4, coin: 200 }
        ];

        const response = { items: mockEquipment };

        const items = response.items || [];

        // Update cache with new data
        cache.equipment = {
          data: items,
          timestamp: Date.now(),
          etag: response.etag || null,
          size: items.length
        };

        // Limit cache size to prevent memory issues
        if (items.length > MAX_CACHE_SIZE) {
          cache.equipment.data = items.slice(0, MAX_CACHE_SIZE);
          cache.equipment.size = MAX_CACHE_SIZE;
          console.warn(`Dashboard: Equipment cache truncated to ${MAX_CACHE_SIZE} items`);
        }

        dashboardData.equipment = cache.equipment.data;
        clearWidgetError('equipment');
        console.log(`Dashboard: Equipment data cached (${cache.equipment.size} items)`);
      } catch (error) {
        console.error('Dashboard: Failed to fetch equipment:', error);

        // Use fallback data if available
        if (shouldShowFallback('equipment') && cache.equipment.data.length > 0) {
          dashboardData.equipment = cache.equipment.data;
          console.log('Dashboard: Using fallback equipment data due to error');
        } else {
          dashboardData.equipment = [];
        }
      } finally {
        loading.equipment = false;
      }
    });
  };

  /**
   * Fetch levels data from API with enhanced caching and error recovery
   * @param {boolean} forceRefresh - Force refresh ignoring cache
   * @returns {Promise<void>}
   */
  const fetchLevels = async (forceRefresh = false) => {
    return coordinateLoading('levels', async () => {
      // Use cached data if fresh and not forcing refresh
      if (!forceRefresh && isCacheFresh('levels') && cache.levels.data.length > 0) {
        dashboardData.levels = cache.levels.data;
        clearWidgetError('levels');
        return;
      }

      loading.levels = true;

      try {
        console.log('Dashboard: Using mock levels data for now...');
        // Mock data for testing - replace with actual API call when ready
        const mockLevels = [
          { lvl: 1, target: 100 },
          { lvl: 2, target: 250 },
          { lvl: 3, target: 500 },
          { lvl: 4, target: 1000 },
          { lvl: 5, target: 2000 }
        ];

        const response = { items: mockLevels };

        const items = response.items || [];

        // Update cache with new data
        cache.levels = {
          data: items,
          timestamp: Date.now(),
          etag: response.etag || null,
          size: items.length
        };

        // Limit cache size to prevent memory issues
        if (items.length > MAX_CACHE_SIZE) {
          cache.levels.data = items.slice(0, MAX_CACHE_SIZE);
          cache.levels.size = MAX_CACHE_SIZE;
          console.warn(`Dashboard: Levels cache truncated to ${MAX_CACHE_SIZE} items`);
        }

        dashboardData.levels = cache.levels.data;
        clearWidgetError('levels');
        console.log(`Dashboard: Levels data cached (${cache.levels.size} items)`);
      } catch (error) {
        console.error('Dashboard: Failed to fetch levels:', error);

        // Use fallback data if available
        if (shouldShowFallback('levels') && cache.levels.data.length > 0) {
          dashboardData.levels = cache.levels.data;
          console.log('Dashboard: Using fallback levels data due to error');
        } else {
          dashboardData.levels = [];
        }
      } finally {
        loading.levels = false;
      }
    });
  };

  /**
   * Fetch users data from API with enhanced caching and error recovery
   * @param {boolean} forceRefresh - Force refresh ignoring cache
   * @returns {Promise<void>}
   */
  const fetchUsers = async (forceRefresh = false) => {
    // Users API is not ready yet - return mock data
    console.log('Dashboard: Users API disabled - using mock data');
    loading.users = false;
    dashboardData.users = []; // Empty array for now
    clearWidgetError('users');
    return;
  };

  /**
   * Fetch all dashboard data in parallel with optimized loading coordination
   * @param {boolean} forceRefresh - Force refresh ignoring cache
   * @returns {Promise<void>}
   */
  const fetchAllData = async (forceRefresh = false) => {
    // Prevent multiple simultaneous refresh operations
    if (loadingCoordinator.refreshInProgress && !forceRefresh) {
      console.log('Dashboard: Refresh already in progress, skipping');
      return;
    }

    loadingCoordinator.refreshInProgress = true;
    loadingCoordinator.lastRefreshTime = Date.now();

    try {
      // Execute all fetches in parallel but handle them individually
      const results = await Promise.allSettled([
        fetchGifts(forceRefresh),
        fetchEquipment(forceRefresh),
        fetchLevels(forceRefresh),
        fetchUsers(forceRefresh)
      ]);

      // Log any failures for debugging
      results.forEach((result, index) => {
        const types = ['gifts', 'equipment', 'levels', 'users'];
        if (result.status === 'rejected') {
          console.error(`Dashboard: Failed to fetch ${types[index]}:`, result.reason);
        }
      });

      console.log('Dashboard: Parallel data fetching completed');
    } catch (error) {
      console.error('Dashboard: Error in parallel data fetching:', error);
    } finally {
      loadingCoordinator.refreshInProgress = false;
    }
  };

  /**
   * Refresh specific widget data with retry capability
   * @param {string} type - Widget type to refresh ('gifts', 'equipment', 'levels', 'users')
   * @returns {Promise<void>}
   */
  const refreshWidget = async (type) => {
    const fetchFunctions = {
      gifts: fetchGifts,
      equipment: fetchEquipment,
      levels: fetchLevels,
      users: fetchUsers
    };

    const fetchFunction = fetchFunctions[type];
    if (fetchFunction) {
      await fetchFunction(true); // Force refresh
    } else {
      console.warn(`Dashboard: Unknown widget type: ${type}`);
    }
  };

  /**
   * Manual retry for a specific widget
   * @param {string} type - Widget type to retry
   * @returns {Promise<void>}
   */
  const retryWidgetData = async (type) => {
    const fetchFunctions = {
      gifts: fetchGifts,
      equipment: fetchEquipment,
      levels: fetchLevels,
      users: fetchUsers
    };

    const fetchFunction = fetchFunctions[type];
    if (fetchFunction && canRetry(type)) {
      try {
        await retryWidget(() => fetchFunction(true), type);
      } catch (error) {
        console.error(`Failed to retry ${type}:`, error);
        throw error;
      }
    } else {
      console.warn(`Cannot retry widget ${type}: function not found or max retries reached`);
    }
  };

  // Gift type labels mapping
  const giftTypeLabels = {
    0: 'Default',
    1: 'Standard',
    2: 'Premium',
    3: 'Video',
    4: 'Special'
  };

  // Equipment type labels mapping
  const equipmentTypeLabels = {
    1: 'Frame',
    2: 'Entry Effect',
    3: 'Badge',
    4: 'Theme'
  };

  /**
   * Computed: Gifts grouped by type with counts and percentages
   */
  const giftsByType = computed(() => {
    const gifts = dashboardData.gifts;
    console.log('Dashboard: Computing giftsByType with gifts:', gifts);
    if (!gifts.length) {
      console.log('Dashboard: No gifts data, returning empty object');
      return {};
    }

    const typeGroups = {};
    const total = gifts.length;

    // Initialize all types with zero counts
    Object.keys(giftTypeLabels).forEach(type => {
      typeGroups[type] = {
        count: 0,
        label: giftTypeLabels[type],
        percentage: 0
      };
    });

    // Count gifts by type
    gifts.forEach(gift => {
      const type = gift.type?.toString() || '0';
      if (typeGroups[type]) {
        typeGroups[type].count++;
      }
    });

    // Calculate percentages
    Object.keys(typeGroups).forEach(type => {
      typeGroups[type].percentage = total > 0
        ? Math.round((typeGroups[type].count / total) * 100)
        : 0;
    });

    return typeGroups;
  });

  /**
   * Computed: Equipment grouped by type with counts
   */
  const equipmentByType = computed(() => {
    const equipment = dashboardData.equipment;
    if (!equipment.length) return {};

    const typeGroups = {};

    // Initialize all types with zero counts
    Object.keys(equipmentTypeLabels).forEach(type => {
      typeGroups[type] = {
        count: 0,
        label: equipmentTypeLabels[type]
      };
    });

    // Count equipment by type
    equipment.forEach(item => {
      const type = item.type?.toString() || '1';
      if (typeGroups[type]) {
        typeGroups[type].count++;
      }
    });

    return typeGroups;
  });

  /**
   * Computed: Levels grouped into ranges for better visualization
   */
  const levelRanges = computed(() => {
    const levels = dashboardData.levels;
    if (!levels.length) return [];

    const ranges = [
      { min: 1, max: 20, label: '1-20', count: 0, avgTarget: 0 },
      { min: 21, max: 40, label: '21-40', count: 0, avgTarget: 0 },
      { min: 41, max: 60, label: '41-60', count: 0, avgTarget: 0 },
      { min: 61, max: 80, label: '61-80', count: 0, avgTarget: 0 },
      { min: 81, max: 100, label: '81-100', count: 0, avgTarget: 0 }
    ];

    // Group levels into ranges
    levels.forEach(level => {
      const levelNum = level.lvl || 0;
      const target = level.target || 0;

      ranges.forEach(range => {
        if (levelNum >= range.min && levelNum <= range.max) {
          range.count++;
          range.avgTarget += target;
        }
      });
    });

    // Calculate average targets
    ranges.forEach(range => {
      if (range.count > 0) {
        range.avgTarget = Math.round(range.avgTarget / range.count);
      }
    });

    return ranges;
  });

  /**
   * Computed: Top gifts by coin value (limited to 10)
   */
  const topGiftsByCoin = computed(() => {
    const gifts = dashboardData.gifts;
    if (!gifts.length) return [];

    return gifts
      .filter(gift => gift.coin && gift.coin > 0)
      .sort((a, b) => (b.coin || 0) - (a.coin || 0))
      .slice(0, 10)
      .map(gift => ({
        id: gift.id,
        name: gift.nameEN || gift.name || 'Unnamed Gift',
        coin: gift.coin || 0,
        type: giftTypeLabels[gift.type] || 'Unknown',
        icon: gift.icon
      }));
  });

  /**
   * Computed: Recent equipment items (limited to 10)
   */
  const recentEquipment = computed(() => {
    const equipment = dashboardData.equipment;
    if (!equipment.length) return [];

    return equipment
      .slice()
      .sort((a, b) => (b.id || 0) - (a.id || 0)) // Sort by ID descending (assuming higher ID = more recent)
      .slice(0, 10)
      .map(item => ({
        id: item.id,
        name: item.nameEN || item.name || 'Unnamed Equipment',
        type: equipmentTypeLabels[item.type] || 'Unknown',
        coin: item.coin || 0,
        days: item.days || 0,
        icon: item.icon
      }));
  });

  /**
   * Computed: Level progression data for line chart
   */
  const levelProgression = computed(() => {
    const levels = dashboardData.levels;
    if (!levels.length) return [];

    return levels
      .slice()
      .sort((a, b) => (a.lvl || 0) - (b.lvl || 0))
      .map(level => ({
        level: level.lvl || 0,
        target: level.target || 0
      }));
  });

  /**
   * Computed: Overall loading state
   */
  const isLoading = computed(() => {
    return loading.gifts || loading.equipment || loading.levels || loading.users;
  });

  /**
   * Computed: Check if any data has errors
   */
  const hasErrors = computed(() => {
    return !!(errors.gifts || errors.equipment || errors.levels || errors.users);
  });

  /**
   * Computed: Statistics summary
   */
  const statistics = computed(() => ({
    totalGifts: dashboardData.gifts.length,
    totalEquipment: dashboardData.equipment.length,
    totalLevels: dashboardData.levels.length,
    totalUsers: dashboardData.users.length
  }));

  return {
    // State
    dashboardData,
    loading,
    errors,

    // Methods
    fetchGifts,
    fetchEquipment,
    fetchLevels,
    fetchUsers,
    fetchAllData,
    refreshWidget,
    retryWidgetData,

    // Cache management
    invalidateCache,
    getCacheStats,

    // Error handling integration
    canRetry,
    shouldShowFallback,
    getWidgetError,

    // Computed data transformations
    giftsByType,
    equipmentByType,
    levelRanges,
    topGiftsByCoin,
    recentEquipment,
    levelProgression,

    // Computed states
    isLoading,
    hasErrors,
    statistics,

    // Cleanup
    cleanup: () => {
      console.log('Dashboard: Cleaning up dashboard data composable...');
      isCleanedUp.value = true;
      // Clear all data
      Object.keys(dashboardData).forEach(key => {
        dashboardData[key] = [];
      });
      // Clear cache
      invalidateCache();
    }
  };
}