<template>
  <div class="widget widget-dailysales">
    <div class="widget-heading">
      <div>
        <h5>Equipment Distribution by Type</h5>
        <span class="sub-title">Click bars for details.</span>
      </div>
      <div v-if="error" class="w-icon text-danger">
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
      <div v-else class="w-icon text-warning">
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
          class="feather feather-settings"
        >
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
        </svg>
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
          <strong>No Equipment Available!</strong> No equipment data to display at the moment.
        </div>
      </div>
      <div v-else>
        <apexchart
          ref="chartRef"
          type="bar"
          height="160"
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
  name: 'EquipmentDistributionChart',
  props: {
    equipmentByType: {
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
    }
  },
  emits: ['retry', 'bar-click'],
  setup(props, { emit }) {
    const chartRef = ref(null);
    const isUnmounted = ref(false);
    const { 
      equipmentBarOptions, 
      formatEquipmentBarData, 
      registerChartInstance,
      cleanupChartInstance
    } = useChartConfigurations();
    
    const chartInstance = ref(null);
    
    const isEmpty = computed(() => {
      if (!props.equipmentByType || Object.keys(props.equipmentByType).length === 0) {
        return true;
      }
      
      const totalCount = Object.values(props.equipmentByType).reduce((sum, type) => sum + (type.count || 0), 0);
      return totalCount === 0;
    });
    
    const chartData = computed(() => {
      return formatEquipmentBarData(props.equipmentByType);
    });
    
    const chartOptions = computed(() => {
      const options = equipmentBarOptions.value;
      return {
        ...options,
        xaxis: {
          ...options.xaxis,
          categories: chartData.value.categories
        }
      };
    });
    
    const chartSeries = computed(() => {
      return chartData.value.series;
    });
    
    watch(() => props.equipmentByType, (newData, oldData) => {
      if (isUnmounted.value) return; // Prevent updates after unmount
      
      if (chartRef.value && chartRef.value.chart && chartInstance.value) {
        try {
          const newSeries = chartSeries.value;
          const newCategories = chartData.value.categories;
          
          chartInstance.value.updateSeries(newSeries, false);
          chartInstance.value.updateOptions({
            xaxis: { categories: newCategories }
          }, false, true);
        } catch (error) {
          console.warn('Error updating equipment chart:', error);
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
      console.log('EquipmentDistributionChart: Unmounting, cleaning up chart...');
      isUnmounted.value = true; // Set flag to prevent further updates
      
      if (chartInstance.value) {
        try {
          cleanupChartInstance(chartInstance.value);
          if (chartInstance.value.destroy) {
            chartInstance.value.destroy();
          }
        } catch (error) {
          console.warn('Error cleaning up equipment chart:', error);
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