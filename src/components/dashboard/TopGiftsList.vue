<template>
  <div class="widget widget-transaction">
    <div class="widget-heading">
      <h5>Top Gifts by Coin Value</h5>
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
          <strong>Failed to Load Gift Data!</strong> {{ error }}
          <button v-if="canRetry" @click="$emit('retry')" class="btn btn-sm btn-outline-light ms-2">Try Again</button>
        </div>
      </div>
      <div v-else-if="isEmpty">
        <div class="alert alert-warning" role="alert">
          <strong>No Premium Gifts!</strong> No gifts with coin values to display.
        </div>
      </div>
      <div v-else class="transactions-list">
        <div 
          v-for="(gift, index) in topGifts" 
          :key="gift.id"
          class="transactions-list"
        >
          <div>
            <span 
              class="b-avatar me-2 rounded-circle"
              :class="getRankBadgeClass(index)"
            >
              <span class="b-avatar-text">
                <span>{{ index + 1 }}</span>
              </span>
            </span>
            <div class="t-name">
              <h4>{{ gift.name }}</h4>
              <p>{{ getTypeClass(gift.type) }}</p>
            </div>
          </div>
          <div class="text-success">+{{ formatCoinValue(gift.coin) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';

export default {
  name: 'TopGiftsList',
  props: {
    topGifts: {
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
    totalGiftsCount: {
      type: Number,
      default: 0
    },
    canRetry: {
      type: Boolean,
      default: false
    },
    retryCount: {
      type: Number,
      default: 0
    },
    maxRetries: {
      type: Number,
      default: 2
    },
    showFallbackNotice: {
      type: Boolean,
      default: false
    }
  },
  emits: ['retry'],
  setup(props) {
    const isEmpty = computed(() => {
      return !props.loading && !props.error && props.topGifts.length === 0;
    });
    
    const getRankBadgeClass = (index) => {
      if (index === 0) return 'icon-fill-warning badge-warning'; // Gold
      if (index === 1) return 'icon-fill-secondary badge-secondary'; // Silver
      if (index === 2) return 'icon-fill-info badge-info'; // Bronze
      return 'icon-fill-primary badge-primary'; // Default
    };
    
    const getTypeClass = (type) => {
      return type || 'Standard';
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
      getRankBadgeClass,
      getTypeClass,
      formatCoinValue
    };
  }
};
</script>