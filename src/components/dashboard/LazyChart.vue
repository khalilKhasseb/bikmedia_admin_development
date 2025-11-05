<template>
  <div 
    ref="containerRef" 
    class="lazy-chart-container"
    :style="{ minHeight: `${minHeight}px` }"
  >
    <!-- Loading placeholder -->
    <div 
      v-if="!isVisible && !forceLoad" 
      class="chart-placeholder"
      :style="{ height: `${minHeight}px` }"
    >
      <div class="d-flex align-items-center justify-content-center h-100">
        <div class="text-center">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading chart...</span>
          </div>
          <p class="text-muted mt-2">Chart will load when visible</p>
        </div>
      </div>
    </div>
    
    <!-- Actual chart component -->
    <component 
      v-else
      :is="chartComponent"
      v-bind="chartProps"
      v-on="chartEvents"
      @chart-mounted="handleChartMounted"
      @chart-destroyed="handleChartDestroyed"
    />
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, watch } from 'vue';

export default {
  name: 'LazyChart',
  props: {
    chartComponent: {
      type: [String, Object],
      required: true
    },
    chartProps: {
      type: Object,
      default: () => ({})
    },
    chartEvents: {
      type: Object,
      default: () => ({})
    },
    minHeight: {
      type: Number,
      default: 350
    },
    rootMargin: {
      type: String,
      default: '50px'
    },
    threshold: {
      type: Number,
      default: 0.1
    },
    forceLoad: {
      type: Boolean,
      default: false
    }
  },
  emits: ['chart-visible', 'chart-mounted', 'chart-destroyed'],
  setup(props, { emit }) {
    const containerRef = ref(null);
    const isVisible = ref(false);
    const observer = ref(null);
    const chartInstance = ref(null);

    /**
     * Initialize intersection observer for lazy loading
     */
    const initializeObserver = () => {
      if (!window.IntersectionObserver || props.forceLoad) {
        isVisible.value = true;
        return;
      }

      observer.value = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !isVisible.value) {
              isVisible.value = true;
              emit('chart-visible');
              
              // Disconnect observer once chart is loaded
              if (observer.value) {
                observer.value.disconnect();
                observer.value = null;
              }
            }
          });
        },
        {
          rootMargin: props.rootMargin,
          threshold: props.threshold
        }
      );

      if (containerRef.value) {
        observer.value.observe(containerRef.value);
      }
    };

    /**
     * Handle chart mounted event
     */
    const handleChartMounted = (instance) => {
      chartInstance.value = instance;
      emit('chart-mounted', instance);
    };

    /**
     * Handle chart destroyed event
     */
    const handleChartDestroyed = () => {
      chartInstance.value = null;
      emit('chart-destroyed');
    };

    /**
     * Cleanup observer and chart instance
     */
    const cleanup = () => {
      if (observer.value) {
        observer.value.disconnect();
        observer.value = null;
      }
      
      if (chartInstance.value && typeof chartInstance.value.destroy === 'function') {
        try {
          chartInstance.value.destroy();
        } catch (error) {
          console.warn('Error destroying chart instance:', error);
        }
        chartInstance.value = null;
      }
    };

    // Watch for forceLoad changes
    watch(() => props.forceLoad, (newValue) => {
      if (newValue && !isVisible.value) {
        isVisible.value = true;
        emit('chart-visible');
        
        if (observer.value) {
          observer.value.disconnect();
          observer.value = null;
        }
      }
    });

    onMounted(() => {
      initializeObserver();
    });

    onUnmounted(() => {
      cleanup();
    });

    return {
      containerRef,
      isVisible,
      handleChartMounted,
      handleChartDestroyed
    };
  }
};
</script>

<style scoped>
.lazy-chart-container {
  position: relative;
  width: 100%;
}

.chart-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 8px;
}

[data-theme="dark"] .chart-placeholder {
  background-color: #1b2e4b;
  border-color: #253b5c;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .chart-placeholder {
    min-height: 250px;
  }
}
</style>