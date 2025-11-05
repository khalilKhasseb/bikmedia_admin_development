<template>
  <div class="widget widget-revenue">
    <div class="widget-heading">
      <h5>Level Progression</h5>
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
          <strong>No Level Data Available!</strong> No level progression data to display.
        </div>
      </div>
      <div v-else>
        <div class="chart-title">Total Levels <span class="text-primary ms-1">{{ totalLevels }}</span></div>
        <apexchart
          ref="chartRef"
          type="line"
          height="325"
          :options="chartOptions"
          :series="chartSeries"
          @ready="handleChartReady"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref, watch, onUnmounted } from 'vue';
import { useChartConfigurations } from '@/composables/use-chart-configurations';

export default {
  name: 'LevelProgressionChart',
  props: {
    levelProgression: {
      type: Array,
      default: () => []
    },
    levelRanges: {
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
  setup(props, { emit }) {
    const chartRef = ref(null);
    const isUnmounted = ref(false);
    const { 
      levelLineOptions, 
      formatLevelLineData, 
      registerChartInstance,
      cleanupChartInstance
    } = useChartConfigurations();
    
    const chartInstance = ref(null);
    
    const isEmpty = computed(() => {
      return !props.loading && !props.error && props.levelProgression.length === 0;
    });

    const totalLevels = computed(() => {
      return props.levelProgression.length;
    });
    
    const chartData = computed(() => {
      return formatLevelLineData(props.levelProgression);
    });
    
    const chartOptions = computed(() => {
      return levelLineOptions.value;
    });
    
    const chartSeries = computed(() => {
      return chartData.value.series;
    });
    
    watch(() => props.levelProgression, (newData, oldData) => {
      if (isUnmounted.value) return; // Prevent updates after unmount
      
      if (chartRef.value && chartRef.value.chart && chartInstance.value) {
        try {
          const newSeries = chartSeries.value;
          
          chartInstance.value.updateSeries(newSeries, false);
        } catch (error) {
          console.warn('Error updating level chart:', error);
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
      console.log('LevelProgressionChart: Unmounting, cleaning up chart...');
      isUnmounted.value = true; // Set flag to prevent further updates
      
      if (chartInstance.value) {
        try {
          cleanupChartInstance(chartInstance.value);
          if (chartInstance.value.destroy) {
            chartInstance.value.destroy();
          }
        } catch (error) {
          console.warn('Error cleaning up level chart:', error);
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
      totalLevels,
      handleChartReady
    };
  }
};
</script>