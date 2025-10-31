<template>
  <div class="widget widget-summary">
    <div class="widget-heading">
      <h5>Level Statistics</h5>
      <div v-if="error" class="dropdown btn-group">
        <button 
          @click="$emit('retry')"
          class="btn btn-sm btn-outline-primary"
          :disabled="loading"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="feather feather-refresh-cw"
          >
            <polyline points="23 4 23 10 17 10"></polyline>
            <polyline points="1 20 1 14 7 14"></polyline>
            <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
          </svg>
          Retry
        </button>
      </div>
    </div>
    <div class="widget-content">
      <div v-if="loading" class="text-center">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
      <div v-else-if="error">
        <div class="alert alert-danger" role="alert">
          <strong>Failed to Load Level Data!</strong> {{ error }}
          <button v-if="canRetry" @click="$emit('retry')" class="btn btn-sm btn-outline-light ms-2">Try Again</button>
        </div>
      </div>
      <div v-else-if="isEmpty">
        <div class="alert alert-warning" role="alert">
          <strong>No Level Data Available!</strong> No level statistics to display.
        </div>
      </div>
      <div v-else>
        <div 
          v-for="(range, index) in levelRanges" 
          :key="range.label"
          class="summary-list"
        >
          <div class="w-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="feather feather-trending-up"
            >
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
              <polyline points="17 6 23 6 23 12"></polyline>
            </svg>
          </div>
          <div class="w-summary-details">
            <div class="w-summary-info">
              <h6>Levels {{ range.label }}</h6>
              <p class="summary-count">{{ range.count }}</p>
            </div>
            <div class="w-summary-stats">
              <div class="progress">
                <div 
                  role="progressbar" 
                  aria-valuemin="0" 
                  aria-valuemax="100" 
                  :aria-valuenow="getProgressPercentage(range.count)" 
                  class="progress-bar"
                  :class="getProgressClass(index)"
                  :style="{ width: getProgressPercentage(range.count) + '%' }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';

export default {
  name: 'LevelStatsSummary',
  props: {
    levelRanges: {
      type: Array,
      default: () => []
    },
    levelProgression: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    },
    error: {
      type: String,
      default: null
    },
    canRetry: {
      type: Boolean,
      default: false
    }
  },
  emits: ['retry'],
  setup(props) {
    const isEmpty = computed(() => {
      return !props.loading && !props.error && props.levelRanges.length === 0;
    });

    const maxCount = computed(() => {
      if (props.levelRanges.length === 0) return 1;
      return Math.max(...props.levelRanges.map(range => range.count));
    });
    
    const getProgressPercentage = (count) => {
      if (maxCount.value === 0) return 0;
      return Math.round((count / maxCount.value) * 100);
    };
    
    const getProgressClass = (index) => {
      const classes = [
        'bg-gradient-secondary',
        'bg-gradient-success', 
        'bg-gradient-warning',
        'bg-gradient-danger',
        'bg-gradient-info'
      ];
      return classes[index % classes.length];
    };
    
    return {
      isEmpty,
      getProgressPercentage,
      getProgressClass
    };
  }
};
</script>