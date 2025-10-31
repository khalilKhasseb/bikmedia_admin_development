<template>
  <div class="widget widget-sales-category">
    <div class="widget-heading">
      <h5>Gift Distribution by Type</h5>
      <div v-if="error" class="dropdown btn-group">
        <button @click="$emit('retry')" class="btn btn-sm btn-outline-primary" :disabled="loading">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
            class="feather feather-refresh-cw">
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
          <strong>No Gifts Available!</strong> No gift data to display at the moment.
        </div>
      </div>
      <div v-else>
        <apexchart ref="chartRef" type="donut" height="460" :options="chartOptions" :series="chartSeries"
          @ready="handleChartReady" />
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref, watch, onUnmounted } from 'vue';
import { useChartConfigurations } from '@/composables/use-chart-configurations';

export default {
  name: 'GiftDistributionChart',
  props: {
    giftsByType: {
      type: Object,
      default: () => ({})
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
  setup(props, { emit }) {
    const chartRef = ref(null);
    const isUnmounted = ref(false);
    const {
      giftDonutOptions,
      formatGiftDonutData,
      registerChartInstance,
      cleanupChartInstance
    } = useChartConfigurations();

    const chartInstance = ref(null);

    const isEmpty = computed(() => {
      if (!props.giftsByType || Object.keys(props.giftsByType).length === 0) {
        return true;
      }

      const totalCount = Object.values(props.giftsByType).reduce((sum, type) => sum + (type.count || 0), 0);
      return totalCount === 0;
    });

    const chartData = computed(() => {
      return formatGiftDonutData(props.giftsByType);
    });

    const chartOptions = computed(() => {
      const options = giftDonutOptions.value;
      return {
        ...options,
        labels: chartData.value.labels
      };
    });

    const chartSeries = computed(() => {
      return chartData.value.series;
    });

    watch(() => props.giftsByType, (newData, oldData) => {
      if (isUnmounted.value) return; // Prevent updates after unmount
      
      if (chartRef.value && chartRef.value.chart && chartInstance.value) {
        try {
          const newSeries = chartSeries.value;
          const newLabels = chartData.value.labels;

          chartInstance.value.updateSeries(newSeries, false);
          chartInstance.value.updateOptions({
            labels: newLabels
          }, false, true);
        } catch (error) {
          console.warn('Error updating gift chart:', error);
        }
      }
    }, { deep: true });

    const handleChartReady = () => {
      if (chartRef.value && chartRef.value.chart) {
        chartInstance.value = chartRef.value.chart;
        registerChartInstance(chartInstance.value);
      }
    };

    onUnmounted(() => {
      console.log('GiftDistributionChart: Unmounting, cleaning up chart...');
      isUnmounted.value = true; // Set flag to prevent further updates
      
      if (chartInstance.value) {
        try {
          cleanupChartInstance(chartInstance.value);
          if (chartInstance.value.destroy) {
            chartInstance.value.destroy();
          }
        } catch (error) {
          console.warn('Error cleaning up gift chart:', error);
        }
        chartInstance.value = null;
      }
      if (chartRef.value) {
        chartRef.value = null;
      }
    });

    return {
      chartRef,
      chartOptions,
      chartSeries,
      isEmpty,
      handleChartReady
    };
  }
};
</script>