<template>
  <div class="widget widget-recent-activity">
    <div class="widget-heading">
      <h5>Recent Equipment</h5>
      <div v-if="error" class="task-action">
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
          <strong>Failed to Load Equipment Data!</strong> {{ error }}
          <button v-if="canRetry" @click="$emit('retry')" class="btn btn-sm btn-outline-light ms-2">Try Again</button>
        </div>
      </div>
      <div v-else-if="isEmpty">
        <div class="alert alert-warning" role="alert">
          <strong>No Equipment Available!</strong> No recent equipment to display.
        </div>
      </div>
      <perfect-scrollbar v-else class="timeline-line">
        <div 
          v-for="(equipment, index) in recentEquipment" 
          :key="equipment.id"
          class="item-timeline"
          :class="getTimelineClass(index)"
        >
          <div class="badge" :class="getBadgeClass(index)"></div>
          <div class="t-text">
            <p><span>{{ equipment.name }}</span></p>
            <span 
              class="badge"
              :class="getTypeBadgeClass(equipment.type)"
            >{{ equipment.type }}</span>
            <p class="t-time">{{ formatCoinValue(equipment.coin) }} coins</p>
          </div>
        </div>
      </perfect-scrollbar>

      <div v-if="!isEmpty && !loading && !error && hasMoreEquipment" class="tm-action-btn">
        <button type="button" class="btn btn-default" @click="$emit('view-all')">
          <span>View All</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="feather feather-arrow-right"
          >
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';

export default {
  name: 'RecentEquipmentList',
  props: {
    recentEquipment: {
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
    totalEquipmentCount: {
      type: Number,
      default: 0
    },
    canRetry: {
      type: Boolean,
      default: false
    }
  },
  emits: ['retry', 'equipment-click', 'view-all'],
  setup(props) {
    const isEmpty = computed(() => {
      return !props.loading && !props.error && props.recentEquipment.length === 0;
    });
    
    const hasMoreEquipment = computed(() => {
      return props.totalEquipmentCount > props.recentEquipment.length;
    });
    
    const getTimelineClass = (index) => {
      const classes = ['timeline-primary', 'timeline-success', 'timeline-warning', 'timeline-danger', 'timeline-info'];
      return classes[index % classes.length];
    };
    
    const getBadgeClass = (index) => {
      const classes = ['badge-primary', 'badge-success', 'badge-warning', 'badge-danger', 'badge-info'];
      return classes[index % classes.length];
    };
    
    const getTypeBadgeClass = (type) => {
      const typeClasses = {
        'Frame': 'badge-outline-primary outline-badge-primary icon-fill-primary',
        'Entry Effect': 'badge-outline-success outline-badge-success icon-fill-success',
        'Badge': 'badge-outline-warning outline-badge-warning icon-fill-warning',
        'Theme': 'badge-outline-info outline-badge-info icon-fill-info'
      };
      
      return typeClasses[type] || 'badge-outline-secondary outline-badge-secondary icon-fill-secondary';
    };
    
    const formatCoinValue = (value) => {
      if (value >= 1000000) {
        return (value / 1000000).toFixed(1) + 'M';
      }
      if (value >= 1000) {
        return (value / 1000).toFixed(1) + 'K';
      }
      return value.toLocaleString();
    };
    
    return {
      isEmpty,
      hasMoreEquipment,
      getTimelineClass,
      getBadgeClass,
      getTypeBadgeClass,
      formatCoinValue
    };
  }
};
</script>