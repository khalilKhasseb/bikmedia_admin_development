<template>
  <div class="container">
    <!-- Breadcrumb Navigation -->
    <teleport to="#breadcrumb">
      <ul class="navbar-nav flex-row">
        <li>
          <div class="page-header">
            <nav class="breadcrumb-one" aria-label="breadcrumb">
              <ol class="breadcrumb">
                <li class="breadcrumb-item">
                  <a href="javascript:;">Dashboard</a>
                </li>
               
              </ol>
            </nav>
          </div>
        </li>
      </ul>
    </teleport>

    <!-- Dashboard Header with Refresh Button -->
    <div class="row mb-4">
      <div class="col-12">
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <h2 class="mb-1 dark:text-white-light">Analytics Dashboard</h2>
            <p class="text-muted mb-0">Overview of platform statistics and insights</p>
          </div>
          <div>
            <button 
              @click="refreshAllData" 
              :disabled="isLoading"
              class="btn btn-outline-primary"
              :class="{ 'btn-loading': isLoading }"
            >
              <svg 
                class="w-4 h-4 mr-2" 
                :class="{ 'animate-spin': isLoading }"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {{ isLoading ? 'Refreshing...' : 'Refresh Data' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Dashboard Content -->
    <div class="container">
      <div class="row layout-top-spacing">
        
        <!-- Overview Statistics Section -->
        <div class="col-12">
          <div class="row">
            <!-- Total Gifts Widget -->
            <OverviewStatsWidget
              title="Total Gifts"
              :count="statistics.totalGifts"
              icon="gift"
              color="primary"
              :loading="loading.gifts"
              :error="errors.gifts"
              :on-retry="retryGifts"
              :can-retry="canRetry('gifts')"
              :retry-count="retryCounts.gifts"
              :max-retries="MAX_RETRY_ATTEMPTS"
              :show-fallback-data="shouldShowFallback('gifts')"
              subtitle="Active gift items"
            />

            <!-- Total Equipment Widget -->
            <OverviewStatsWidget
              title="Total Equipment"
              :count="statistics.totalEquipment"
              icon="equipment"
              color="success"
              :loading="loading.equipment"
              :error="errors.equipment"
              :on-retry="retryEquipment"
              :can-retry="canRetry('equipment')"
              :retry-count="retryCounts.equipment"
              :max-retries="MAX_RETRY_ATTEMPTS"
              :show-fallback-data="shouldShowFallback('equipment')"
              subtitle="Available equipment"
            />

            <!-- Total Levels Widget -->
            <OverviewStatsWidget
              title="Total Levels"
              :count="statistics.totalLevels"
              icon="level"
              color="warning"
              :loading="loading.levels"
              :error="errors.levels"
              :on-retry="retryLevels"
              :can-retry="canRetry('levels')"
              :retry-count="retryCounts.levels"
              :max-retries="MAX_RETRY_ATTEMPTS"
              :show-fallback-data="shouldShowFallback('levels')"
              subtitle="Game progression levels"
            />

            <!-- Total Users Widget -->
            <!-- <OverviewStatsWidget
              title="Total Users"
              :count="statistics.totalUsers"
              icon="user"
              color="info"
              :loading="loading.users"
              :error="errors.users"
              :on-retry="retryUsers"
              :can-retry="canRetry('users')"
              :retry-count="retryCounts.users"
              :max-retries="MAX_RETRY_ATTEMPTS"
              :show-fallback-data="shouldShowFallback('users')"
              subtitle="Registered users"
            /> -->
          </div>
        </div>

        <!-- Gift Analytics Section -->
        <div class="col-12 analytics-section">
          <div class="row">
            <div class="col-12">
              <h5 class="section-title">Gift Analytics</h5>
            </div>
            
            <!-- Gift Distribution Chart -->
            <div class="col-xl-6 col-lg-12 col-md-12 col-sm-12 col-12 layout-spacing">
              <!-- <GiftDistributionChart
                :gifts-by-type="giftsByType"
                :loading="loading.gifts"
                :error="errors.gifts"
                :can-retry="canRetry('gifts')"
                :retry-count="retryCounts.gifts"
                :max-retries="MAX_RETRY_ATTEMPTS"
                :show-fallback-notice="shouldShowFallback('gifts')"
                @retry="retryGifts"
              /> -->
            </div>

            <!-- Top Gifts List -->
            <div class="col-xl-6 col-lg-12 col-md-12 col-sm-12 col-12 layout-spacing">
              <!-- <TopGiftsList
                :top-gifts="topGiftsByCoin"
                :loading="loading.gifts"
                :error="errors.gifts"
                :total-gifts-count="statistics.totalGifts"
                :can-retry="canRetry('gifts')"
                :retry-count="retryCounts.gifts"
                :max-retries="MAX_RETRY_ATTEMPTS"
                :show-fallback-notice="shouldShowFallback('gifts')"
                @retry="retryGifts"
              /> -->
            </div>
          </div>
        </div>

        <!-- Equipment Analytics Section -->
        <div class="col-12 analytics-section">
          <div class="row">
            <div class="col-12">
              <h5 class="section-title">Equipment Analytics</h5>
            </div>

            <!-- Equipment Distribution Chart -->
            <div class="col-xl-6 col-lg-12 col-md-12 col-sm-12 col-12 layout-spacing">
              <!-- <EquipmentDistributionChart
                :equipment-by-type="equipmentByType"
                :loading="loading.equipment"
                :error="errors.equipment"
                @retry="retryEquipment"
                @bar-click="handleEquipmentChartClick"
              /> -->
            </div>

            <!-- Recent Equipment List -->
            <div class="col-xl-6 col-lg-12 col-md-12 col-sm-12 col-12 layout-spacing">
              <!-- <RecentEquipmentList
                :recent-equipment="recentEquipment"
                :loading="loading.equipment"
                :error="errors.equipment"
                :total-equipment-count="statistics.totalEquipment"
                @retry="retryEquipment"
                @equipment-click="handleEquipmentClick"
                @view-all="handleViewAllEquipment"
              /> -->
            </div>
          </div>
        </div>

        <!-- Level Analytics Section -->
        <div class="col-12 analytics-section">
          <div class="row">
            <div class="col-12">
              <h5 class="section-title">Level Analytics</h5>
            </div>

            <!-- Level Progression Chart -->
            <div class="col-xl-8 col-lg-12 col-md-12 col-sm-12 col-12 layout-spacing">
              <!-- <LevelProgressionChart
                :level-progression="levelProgression"
                :level-ranges="levelRanges"
                :loading="loading.levels"
                :error="errors.levels"
                @retry="retryLevels"
              /> -->
            </div>

            <!-- Level Statistics Summary -->
            <div class="col-xl-4 col-lg-12 col-md-12 col-sm-12 col-12 layout-spacing">
              <!-- <LevelStatsSummary
                :level-ranges="levelRanges"
                :level-progression="levelProgression"
                :loading="loading.levels"
                :error="errors.levels"
                @retry="retryLevels"
              /> -->
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';
import { useMeta } from '@/composables/use-meta';
import { useDashboardData } from '@/composables/use-dashboard-data';
import { useErrorHandling } from '@/composables/use-error-handling';
import OverviewStatsWidget from '@/components/dashboard/OverviewStatsWidget.vue';
import GiftDistributionChart from '@/components/dashboard/GiftDistributionChart.vue';
import TopGiftsList from '@/components/dashboard/TopGiftsList.vue';
import EquipmentDistributionChart from '@/components/dashboard/EquipmentDistributionChart.vue';
import RecentEquipmentList from '@/components/dashboard/RecentEquipmentList.vue';
import LevelProgressionChart from '@/components/dashboard/LevelProgressionChart.vue';
import LevelStatsSummary from '@/components/dashboard/LevelStatsSummary.vue';

// Set page meta information
useMeta({ 
  title: 'Analytics Dashboard',
  description: 'Comprehensive analytics dashboard for Bikmedia platform with insights into gifts, equipment, levels, and user statistics',
  keywords: 'analytics, dashboard, bikmedia, gifts, equipment, levels, users, statistics'
});

// Initialize composables
const {
  loading,
  errors,
  statistics,
  giftsByType,
  equipmentByType,
  topGiftsByCoin,
  recentEquipment,
  levelRanges,
  levelProgression,
  isLoading,
  fetchAllData,
  refreshWidget,
  retryWidgetData,
  canRetry,
  shouldShowFallback,
  getWidgetError,
  cleanup
} = useDashboardData();

const {
  getWidgetErrorMessage,
  retryCounts,
  MAX_RETRY_ATTEMPTS
} = useErrorHandling();

// Enhanced retry functions for individual widgets
const retryGifts = async () => {
  try {
    await retryWidgetData('gifts');
  } catch (error) {
    console.error('Failed to retry gifts:', error);
    throw error; // Re-throw to let ErrorDisplay handle it
  }
};

const retryEquipment = async () => {
  try {
    await retryWidgetData('equipment');
  } catch (error) {
    console.error('Failed to retry equipment:', error);
    throw error;
  }
};

const retryLevels = async () => {
  try {
    await retryWidgetData('levels');
  } catch (error) {
    console.error('Failed to retry levels:', error);
    throw error;
  }
};

// Users API disabled - retry function not needed
// const retryUsers = async () => {
//   try {
//     await retryWidgetData('users');
//   } catch (error) {
//     console.error('Failed to retry users:', error);
//     throw error;
//   }
// };

// Equipment interaction handlers
const handleEquipmentChartClick = (data) => {
  console.log('Equipment chart clicked:', data);
  // Future: Navigate to equipment filtered by type
};

const handleEquipmentClick = (equipment) => {
  console.log('Equipment clicked:', equipment);
  // Future: Navigate to equipment detail page
};

const handleViewAllEquipment = () => {
  console.log('View all equipment clicked');
  // Future: Navigate to equipment list page
};

// Dashboard-wide error handling
const handleGlobalError = (error, context) => {
  console.error(`Dashboard error in ${context}:`, error);
  // Future: Send to error tracking service
};

// Refresh all data
const refreshAllData = async () => {
  try {
    await fetchAllData(true); // Force refresh
  } catch (error) {
    handleGlobalError(error, 'refreshAllData');
  }
};

// Lifecycle hooks
onMounted(async () => {
  console.log('BikmediaHome: Component mounted, fetching dashboard data...');
  try {
    // Fetch all dashboard data on component mount
    await fetchAllData();
    console.log('BikmediaHome: Dashboard data fetched successfully');
  } catch (error) {
    console.error('BikmediaHome: Error fetching dashboard data:', error);
    handleGlobalError(error, 'onMounted');
  }
});

onUnmounted(() => {
  console.log('BikmediaHome: Component unmounting, cleaning up...');
  // Cleanup dashboard data composable
  if (cleanup) {
    cleanup();
  }
  // Cleanup any pending requests or timers
  // Future: Cancel any ongoing API requests
});
</script>

<style scoped>
/* Loading skeleton styles */
.loading-skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 4px;
  height: 20px;
}

.chart-skeleton {
  height: 200px;
  width: 100%;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* Error state styles */
.error-state {
  text-align: center;
  padding: 20px;
}

.error-message {
  color: #e7515a;
  font-size: 14px;
  margin-bottom: 10px;
}

/* Dark mode support */
[data-theme="dark"] .loading-skeleton {
  background: linear-gradient(90deg, #2a2a2a 25%, #3a3a3a 50%, #2a2a2a 75%);
  background-size: 200% 100%;
}

[data-theme="dark"] .error-message {
  color: #ff6b7a;
}

/* Widget content adjustments */
.widget-content .w-chart {
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Section headers */
.section-header {
  border-bottom: 2px solid #e0e6ed;
  padding-bottom: 8px;
  margin-bottom: 20px;
}

[data-theme="dark"] .section-header {
  border-bottom-color: #1b2e4b;
}

/* Dashboard layout improvements */
.dashboard-section {
  margin-bottom: 30px;
}

.dashboard-section:last-child {
  margin-bottom: 0;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .chart-skeleton {
    height: 150px;
  }
  
  .dashboard-section {
    margin-bottom: 20px;
  }
  
  .section-header h5 {
    font-size: 1.1rem;
  }
}

/* Loading coordination */
.widget-loading-overlay {
  position: relative;
}

.widget-loading-overlay::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  z-index: 10;
  border-radius: 8px;
}

[data-theme="dark"] .widget-loading-overlay::before {
  background: rgba(27, 46, 75, 0.8);
}

/* Dashboard header styles */
.dashboard-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 30px;
  color: white;
}

.dashboard-header h2 {
  color: white !important;
  margin-bottom: 5px;
}

.dashboard-header p {
  color: rgba(255, 255, 255, 0.8) !important;
  margin-bottom: 0;
}

/* Refresh button styles */
.btn-loading {
  pointer-events: none;
  opacity: 0.7;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Section spacing improvements */
.analytics-section {
  margin-bottom: 40px;
}

.analytics-section:last-child {
  margin-bottom: 20px;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #e5e7eb;
}

[data-theme="dark"] .section-title {
  color: #f9fafb;
  border-bottom-color: #374151;
}
</style>