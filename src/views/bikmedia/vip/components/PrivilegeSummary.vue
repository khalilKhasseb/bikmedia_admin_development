<template>
  <div class="privilege-summary">
    <div class="row text-center g-3">
      <div class="col-4">
        <div class="summary-item">
          <div class="summary-number text-success">
            <CountUp :end-value="activeCount" />
          </div>
          <div class="summary-label">{{ $t('bikmedia.vip.activePrivileges') }}</div>
          <div class="summary-progress">
            <div class="progress">
              <div 
                class="progress-bar bg-success" 
                :style="{ width: activePercentage + '%' }"
                role="progressbar"
                :aria-valuenow="activePercentage"
                aria-valuemin="0"
                aria-valuemax="100"
              ></div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="col-4">
        <div class="summary-item">
          <div class="summary-number text-muted">
            <CountUp :end-value="inactiveCount" />
          </div>
          <div class="summary-label">{{ $t('bikmedia.vip.inactivePrivileges') }}</div>
          <div class="summary-progress">
            <div class="progress">
              <div 
                class="progress-bar bg-secondary" 
                :style="{ width: inactivePercentage + '%' }"
                role="progressbar"
                :aria-valuenow="inactivePercentage"
                aria-valuemin="0"
                aria-valuemax="100"
              ></div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="col-4">
        <div class="summary-item">
          <div class="summary-number text-primary">
            <CountUp :end-value="totalCount" />
          </div>
          <div class="summary-label">{{ $t('bikmedia.vip.totalPrivileges') }}</div>
          <div class="summary-badge">
            <span class="badge bg-primary">
              {{ $t('bikmedia.vip.completionRate', { rate: Math.round(activePercentage) }) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Stats Row -->
    <div class="quick-stats mt-3">
      <div class="row g-2">
        <div class="col-6">
          <div class="stat-item">
            <span class="stat-icon text-success">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" 
                   fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" 
                   stroke-linejoin="round">
                <path d="M9 12l2 2 4-4"></path>
                <circle cx="12" cy="12" r="10"></circle>
              </svg>
            </span>
            <span class="stat-label">{{ $t('bikmedia.vip.enabledFeatures') }}</span>
            <span class="stat-value">{{ activeCount }}</span>
          </div>
        </div>
        <div class="col-6">
          <div class="stat-item">
            <span class="stat-icon text-warning">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" 
                   fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" 
                   stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </span>
            <span class="stat-label">{{ $t('bikmedia.vip.availableFeatures') }}</span>
            <span class="stat-value">{{ inactiveCount }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import CountUp from './CountUp.vue';

// Composables
const { t } = useI18n();

// Props
const props = defineProps({
  privileges: {
    type: Array,
    default: () => []
  }
});

// Computed Properties
const activeCount = computed(() => {
  return props.privileges.filter(p => p.isActive).length;
});

const inactiveCount = computed(() => {
  return props.privileges.filter(p => !p.isActive).length;
});

const totalCount = computed(() => {
  return props.privileges.length;
});

const activePercentage = computed(() => {
  if (totalCount.value === 0) return 0;
  return Math.round((activeCount.value / totalCount.value) * 100);
});

const inactivePercentage = computed(() => {
  if (totalCount.value === 0) return 0;
  return Math.round((inactiveCount.value / totalCount.value) * 100);
});
</script>

<style scoped>
.privilege-summary {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid #e9ecef;
}

.summary-item {
  text-align: center;
  padding: 0.5rem;
}

.summary-number {
  font-size: 2rem;
  font-weight: 700;
  line-height: 1;
  margin-bottom: 0.5rem;
}

.summary-label {
  font-size: 0.875rem;
  color: #6c757d;
  margin-bottom: 0.75rem;
  font-weight: 500;
}

.summary-progress {
  margin-bottom: 0.5rem;
}

.progress {
  height: 6px;
  border-radius: 3px;
  background-color: #e9ecef;
}

.progress-bar {
  border-radius: 3px;
  transition: width 0.6s ease;
}

.summary-badge {
  margin-top: 0.5rem;
}

.badge {
  font-size: 0.75rem;
  padding: 0.375rem 0.75rem;
}

/* Quick Stats */
.quick-stats {
  border-top: 1px solid #dee2e6;
  padding-top: 1rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: white;
  border-radius: 6px;
  border: 1px solid #e9ecef;
  font-size: 0.875rem;
}

.stat-icon {
  flex-shrink: 0;
}

.stat-label {
  flex: 1;
  color: #6c757d;
  font-weight: 500;
}

.stat-value {
  font-weight: 600;
  color: #495057;
}

/* Responsive Design */
@media (max-width: 576px) {
  .privilege-summary {
    padding: 1rem;
  }

  .summary-number {
    font-size: 1.5rem;
  }

  .summary-label {
    font-size: 0.8rem;
  }

  .stat-item {
    font-size: 0.8rem;
    padding: 0.375rem;
  }
}

/* Animation for progress bars */
@keyframes progressAnimation {
  from {
    width: 0%;
  }
}

.progress-bar {
  animation: progressAnimation 1s ease-out;
}

/* Hover effects */
.summary-item:hover {
  transform: translateY(-2px);
  transition: transform 0.2s ease;
}

.stat-item:hover {
  border-color: #007bff;
  box-shadow: 0 2px 4px rgba(0, 123, 255, 0.1);
  transition: all 0.2s ease;
}
</style>