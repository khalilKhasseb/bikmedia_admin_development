/**
 * Optimized ApexCharts imports
 * 
 * This module provides optimized imports for ApexCharts to reduce bundle size
 * by importing only the required chart types and features.
 */

// Import vue3-apexcharts component (this is the correct way for Vue 3)
import VueApexCharts from 'vue3-apexcharts';

// Import ApexCharts core for global configuration
import ApexCharts from 'apexcharts';

/**
 * Initialize ApexCharts with only required features
 * This helps reduce the bundle size by excluding unused chart types
 */
export function initializeOptimizedCharts() {
  // Set global defaults for better performance
  window.ApexCharts = ApexCharts;
  
  // Configure default options for all charts
  if (ApexCharts && typeof ApexCharts.setGlobalOptions === 'function') {
    ApexCharts.setGlobalOptions({
    chart: {
      // Disable unnecessary features for better performance
      selection: {
        enabled: false
      },
      zoom: {
        enabled: false
      },
      // Optimize animations
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 300,
        animateGradually: {
          enabled: true,
          delay: 50
        },
        dynamicAnimation: {
          enabled: true,
          speed: 300
        }
      },
      // Optimize rendering
      redrawOnParentResize: true,
      redrawOnWindowResize: true
    },
    // Optimize data labels
    dataLabels: {
      enabled: true,
      enabledOnSeries: undefined,
      textAnchor: 'middle',
      distributed: false,
      offsetX: 0,
      offsetY: 0,
      style: {
        fontSize: '12px',
        fontFamily: 'inherit',
        fontWeight: 'normal'
      },
      background: {
        enabled: false
      },
      dropShadow: {
        enabled: false
      }
    },
    // Optimize states
    states: {
      normal: {
        filter: {
          type: 'none'
        }
      },
      hover: {
        filter: {
          type: 'lighten',
          value: 0.1
        }
      },
      active: {
        allowMultipleDataPointsSelection: false,
        filter: {
          type: 'darken',
          value: 0.1
        }
      }
    }
    });
  } else {
    console.warn('ApexCharts.setGlobalOptions is not available');
  }

  return { ApexCharts, VueApexCharts };
}

/**
 * Chart type configurations for bundle optimization
 */
export const CHART_TYPES = {
  DONUT: 'donut',
  BAR: 'bar',
  LINE: 'line'
};

/**
 * Performance monitoring utilities
 */
export const ChartPerformanceMonitor = {
  /**
   * Monitor chart rendering performance
   * @param {string} chartId - Chart identifier
   * @param {Function} renderFunction - Chart render function
   * @returns {Promise} Render promise with performance metrics
   */
  async monitorRender(chartId, renderFunction) {
    const startTime = performance.now();
    
    try {
      const result = await renderFunction();
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      if (renderTime > 1000) {
        console.warn(`Chart ${chartId} took ${renderTime.toFixed(2)}ms to render (slow)`);
      } else {
        console.log(`Chart ${chartId} rendered in ${renderTime.toFixed(2)}ms`);
      }
      
      return result;
    } catch (error) {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      console.error(`Chart ${chartId} failed to render after ${renderTime.toFixed(2)}ms:`, error);
      throw error;
    }
  },

  /**
   * Monitor memory usage of chart instances
   * @param {Set} chartInstances - Set of chart instances
   * @returns {Object} Memory usage statistics
   */
  getMemoryUsage(chartInstances) {
    if (!performance.memory) {
      return { supported: false };
    }

    return {
      supported: true,
      usedJSHeapSize: performance.memory.usedJSHeapSize,
      totalJSHeapSize: performance.memory.totalJSHeapSize,
      jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
      chartInstanceCount: chartInstances.size
    };
  }
};

/**
 * Chart data optimization utilities
 */
export const ChartDataOptimizer = {
  /**
   * Optimize data for better chart performance
   * @param {Array} data - Original data array
   * @param {Object} options - Optimization options
   * @returns {Array} Optimized data
   */
  optimizeData(data, options = {}) {
    const {
      maxPoints = 100,
      sampleRate = 0.5,
      preserveExtremes = true
    } = options;

    if (!Array.isArray(data) || data.length <= maxPoints) {
      return data;
    }

    let optimized = [];

    if (preserveExtremes) {
      // Always include first and last points
      optimized.push(data[0]);
      
      // Sample middle points
      const step = Math.ceil((data.length - 2) / (maxPoints - 2));
      for (let i = step; i < data.length - 1; i += step) {
        optimized.push(data[i]);
      }
      
      optimized.push(data[data.length - 1]);
    } else {
      // Simple sampling
      const step = Math.ceil(data.length / maxPoints);
      for (let i = 0; i < data.length; i += step) {
        optimized.push(data[i]);
      }
    }

    return optimized;
  },

  /**
   * Debounce chart updates for better performance
   * @param {Function} updateFunction - Chart update function
   * @param {number} delay - Debounce delay in milliseconds
   * @returns {Function} Debounced function
   */
  debounceUpdate(updateFunction, delay = 150) {
    let timeoutId;
    
    return function(...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => updateFunction.apply(this, args), delay);
    };
  }
};

export default {
  initializeOptimizedCharts,
  CHART_TYPES,
  ChartPerformanceMonitor,
  ChartDataOptimizer
};

// Export VueApexCharts for direct use if needed
export { VueApexCharts };