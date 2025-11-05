import { computed, ref, onUnmounted } from 'vue';
import { useStore } from 'vuex';

/**
 * Chart Configurations Composable
 * 
 * Provides ApexCharts configurations consistent with the template design.
 * Handles responsive design, dark/light mode theming, and chart-specific
 * configurations for donut, bar, and line charts used in the dashboard.
 * Includes performance optimizations like data sampling and lazy loading.
 * 
 * @returns {Object} Chart configuration interface
 */
export function useChartConfigurations() {
  const store = useStore();
  
  // Chart instance tracking for cleanup
  const chartInstances = ref(new Set());
  
  // Performance configuration
  const PERFORMANCE_CONFIG = {
    MAX_DATA_POINTS: 100, // Maximum data points before sampling
    SAMPLE_RATE: 0.5, // Sample rate for large datasets (50%)
    ANIMATION_DURATION: 300, // Reduced animation duration for performance
    DEBOUNCE_DELAY: 150 // Debounce delay for resize events
  };

  /**
   * Register chart instance for cleanup tracking
   * @param {Object} chartInstance - ApexCharts instance
   */
  const registerChartInstance = (chartInstance) => {
    if (chartInstance) {
      chartInstances.value.add(chartInstance);
    }
  };

  /**
   * Cleanup chart instance
   * @param {Object} chartInstance - ApexCharts instance to cleanup
   */
  const cleanupChartInstance = (chartInstance) => {
    if (chartInstance) {
      try {
        chartInstance.destroy();
        chartInstances.value.delete(chartInstance);
      } catch (error) {
        console.warn('Chart cleanup error:', error);
      }
    }
  };

  /**
   * Sample large datasets for better performance
   * @param {Array} data - Original data array
   * @param {number} maxPoints - Maximum points to keep
   * @returns {Array} Sampled data
   */
  const sampleData = (data, maxPoints = PERFORMANCE_CONFIG.MAX_DATA_POINTS) => {
    if (!Array.isArray(data) || data.length <= maxPoints) {
      return data;
    }

    const step = Math.ceil(data.length / maxPoints);
    const sampled = [];
    
    for (let i = 0; i < data.length; i += step) {
      sampled.push(data[i]);
    }
    
    // Always include the last point
    if (sampled[sampled.length - 1] !== data[data.length - 1]) {
      sampled.push(data[data.length - 1]);
    }
    
    console.log(`Chart: Data sampled from ${data.length} to ${sampled.length} points`);
    return sampled;
  };

  /**
   * Get optimized base chart options with performance settings
   * @returns {Object} Base chart configuration
   */
  const getOptimizedBaseOptions = () => {
    const isDark = store.state.is_dark_mode;
    
    return {
      chart: {
        toolbar: { show: false },
        fontFamily: 'inherit',
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: PERFORMANCE_CONFIG.ANIMATION_DURATION,
          animateGradually: {
            enabled: true,
            delay: 50
          },
          dynamicAnimation: {
            enabled: true,
            speed: PERFORMANCE_CONFIG.ANIMATION_DURATION
          }
        },
        redrawOnParentResize: true,
        redrawOnWindowResize: true
      },
      colors: getChartColors(),
      grid: {
        borderColor: isDark ? '#191e3a' : '#e0e6ed'
      },
      tooltip: {
        theme: isDark ? 'dark' : 'light'
      },
      legend: {
        labels: {
          colors: isDark ? '#bfc9d4' : '#506690'
        }
      },
      // Performance optimizations
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
          fontWeight: 'normal',
          colors: undefined
        },
        background: {
          enabled: false
        },
        dropShadow: {
          enabled: false
        }
      }
    };
  };

  /**
   * Get chart colors based on template color scheme
   * @returns {Array} Array of color values
   */
  const getChartColors = () => {
    return [
      '#4361ee', // Primary
      '#1abc9c', // Success
      '#e2a03f', // Warning
      '#e7515a', // Danger
      '#805dca', // Secondary
      '#2196f3', // Info
      '#f8538d', // Additional color
      '#25d5e4', // Additional color
      '#ffbb44', // Additional color
      '#e95f2b'  // Additional color
    ];
  };

  /**
   * Get base chart options with theme support (legacy method for compatibility)
   * @returns {Object} Base chart configuration
   */
  const getBaseChartOptions = () => {
    return getOptimizedBaseOptions();
  };

  /**
   * Computed: Optimized gift distribution donut chart options
   */
  const giftDonutOptions = computed(() => {
    const isDark = store.state.is_dark_mode;
    const baseOptions = getOptimizedBaseOptions();
    
    return {
      ...baseOptions,
      chart: {
        ...baseOptions.chart,
        type: 'donut',
        // Optimize for donut charts
        sparkline: {
          enabled: false
        }
      },
      stroke: {
        colors: isDark ? '#191e3a' : 'transparent',
        width: 2
      },
      plotOptions: {
        pie: {
          donut: {
            size: '70%',
            labels: {
              show: true,
              name: {
                show: true,
                fontSize: '14px',
                fontWeight: 'normal',
                color: isDark ? '#bfc9d4' : '#506690'
              },
              value: {
                show: true,
                fontSize: '16px',
                fontWeight: 'bold',
                color: isDark ? '#bfc9d4' : '#506690'
              },
              total: {
                show: true,
                fontSize: '16px',
                fontWeight: 'normal',
                label: 'Total Gifts',
                color: isDark ? '#bfc9d4' : '#506690',
                formatter: function(w) {
                  return w.globals.seriesTotals.reduce((a, b) => a + b, 0);
                }
              }
            }
          },
          // Performance optimization
          expandOnClick: false
        }
      },
      labels: ['Default', 'Standard', 'Premium', 'Video', 'Special'],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: { width: 280 },
            legend: { position: 'bottom' }
          }
        }
      ],
      dataLabels: {
        ...baseOptions.dataLabels,
        enabled: true,
        formatter: function(val, opts) {
          return Math.round(val) + '%';
        },
        style: {
          fontSize: '11px',
          fontWeight: 'normal',
          colors: [isDark ? '#bfc9d4' : '#506690']
        }
      },
      // Performance optimizations
      states: {
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
    };
  });

  /**
   * Computed: Optimized equipment distribution bar chart options
   */
  const equipmentBarOptions = computed(() => {
    const isDark = store.state.is_dark_mode;
    const baseOptions = getOptimizedBaseOptions();
    
    return {
      ...baseOptions,
      chart: {
        ...baseOptions.chart,
        type: 'bar',
        // Performance optimizations
        selection: {
          enabled: false
        },
        zoom: {
          enabled: false
        }
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '60%',
          borderRadius: 8,
          dataLabels: {
            position: 'top'
          },
          // Performance optimization
          distributed: false
        }
      },
      dataLabels: {
        ...baseOptions.dataLabels,
        enabled: true,
        offsetY: -20,
        style: {
          fontSize: '12px',
          colors: [isDark ? '#bfc9d4' : '#304758']
        }
      },
      xaxis: {
        categories: ['Frame', 'Entry Effect', 'Badge', 'Theme'],
        labels: {
          style: {
            colors: isDark ? '#bfc9d4' : '#506690'
          }
        },
        axisBorder: {
          show: true,
          color: isDark ? '#191e3a' : '#e0e6ed'
        },
        axisTicks: {
          show: true,
          color: isDark ? '#191e3a' : '#e0e6ed'
        }
      },
      yaxis: {
        title: {
          text: 'Count',
          style: {
            fontWeight: 'normal',
            color: isDark ? '#bfc9d4' : '#506690'
          }
        },
        labels: {
          style: {
            colors: isDark ? '#bfc9d4' : '#506690'
          },
          formatter: function(val) {
            return Math.floor(val);
          }
        }
      },
      fill: {
        opacity: 1,
        type: 'solid'
      },
      // Performance optimizations
      states: {
        hover: {
          filter: {
            type: 'lighten',
            value: 0.1
          }
        }
      },
      responsive: [
        {
          breakpoint: 768,
          options: {
            plotOptions: {
              bar: {
                columnWidth: '80%'
              }
            },
            dataLabels: {
              style: {
                fontSize: '10px'
              }
            }
          }
        }
      ]
    };
  });

  /**
   * Computed: Optimized level progression line chart options
   */
  const levelLineOptions = computed(() => {
    const isDark = store.state.is_dark_mode;
    const baseOptions = getOptimizedBaseOptions();
    
    return {
      ...baseOptions,
      chart: {
        ...baseOptions.chart,
        type: 'line',
        zoom: { enabled: false },
        // Performance optimizations
        selection: {
          enabled: false
        },
        pan: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth',
        width: 3,
        lineCap: 'round'
      },
      title: {
        text: 'Level Progression',
        align: 'left',
        style: {
          fontWeight: 'normal',
          color: isDark ? '#bfc9d4' : '#506690',
          fontSize: '16px'
        }
      },
      xaxis: {
        title: {
          text: 'Level',
          style: {
            fontWeight: 'normal',
            color: isDark ? '#bfc9d4' : '#506690'
          }
        },
        labels: {
          style: {
            colors: isDark ? '#bfc9d4' : '#506690'
          }
        },
        axisBorder: {
          show: true,
          color: isDark ? '#191e3a' : '#e0e6ed'
        },
        axisTicks: {
          show: true,
          color: isDark ? '#191e3a' : '#e0e6ed'
        }
      },
      yaxis: {
        title: {
          text: 'Target Points',
          style: {
            fontWeight: 'normal',
            color: isDark ? '#bfc9d4' : '#506690'
          }
        },
        labels: {
          style: {
            colors: isDark ? '#bfc9d4' : '#506690'
          },
          formatter: function(val) {
            return val ? val.toLocaleString() : '0';
          }
        }
      },
      markers: {
        size: 4,
        strokeWidth: 2,
        strokeColors: isDark ? '#1b2e4b' : '#ffffff',
        hover: {
          size: 6,
          sizeOffset: 2
        },
        // Performance optimization
        discrete: []
      },
      // Performance optimizations
      states: {
        hover: {
          filter: {
            type: 'lighten',
            value: 0.1
          }
        }
      },
      responsive: [
        {
          breakpoint: 768,
          options: {
            chart: {
              height: 300
            },
            markers: {
              size: 3,
              hover: {
                size: 5
              }
            }
          }
        }
      ]
    };
  });

  /**
   * Format chart data for gift donut chart
   * @param {Object} giftsByType - Gifts grouped by type
   * @returns {Object} Formatted chart data
   */
  const formatGiftDonutData = (giftsByType) => {
    if (!giftsByType || Object.keys(giftsByType).length === 0) {
      return {
        series: [0, 0, 0, 0, 0],
        labels: ['Default', 'Standard', 'Premium', 'Video', 'Special']
      };
    }

    const series = [];
    const labels = [];
    
    // Order by type ID to maintain consistency
    const orderedTypes = ['0', '1', '2', '3', '4'];
    
    orderedTypes.forEach(typeId => {
      const typeData = giftsByType[typeId];
      if (typeData && typeData.count > 0) {
        series.push(typeData.count);
        labels.push(typeData.label);
      }
    });

    // If no data, show empty state
    if (series.length === 0) {
      return {
        series: [1],
        labels: ['No Data']
      };
    }

    return { series, labels };
  };

  /**
   * Format chart data for equipment bar chart
   * @param {Object} equipmentByType - Equipment grouped by type
   * @returns {Object} Formatted chart data
   */
  const formatEquipmentBarData = (equipmentByType) => {
    if (!equipmentByType || Object.keys(equipmentByType).length === 0) {
      return {
        series: [{
          name: 'Equipment Count',
          data: [0, 0, 0, 0]
        }],
        categories: ['Frame', 'Entry Effect', 'Badge', 'Theme']
      };
    }

    const data = [];
    const categories = [];
    
    // Order by type ID to maintain consistency
    const orderedTypes = ['1', '2', '3', '4'];
    
    orderedTypes.forEach(typeId => {
      const typeData = equipmentByType[typeId];
      if (typeData) {
        data.push(typeData.count);
        categories.push(typeData.label);
      } else {
        data.push(0);
        categories.push(['Frame', 'Entry Effect', 'Badge', 'Theme'][parseInt(typeId) - 1]);
      }
    });

    return {
      series: [{
        name: 'Equipment Count',
        data
      }],
      categories
    };
  };

  /**
   * Format chart data for level progression line chart with data sampling
   * @param {Array} levelProgression - Level progression data
   * @returns {Object} Formatted chart data
   */
  const formatLevelLineData = (levelProgression) => {
    if (!levelProgression || levelProgression.length === 0) {
      return {
        series: [{
          name: 'Target Points',
          data: []
        }],
        categories: []
      };
    }

    // Apply data sampling for large datasets
    const sampledData = sampleData(levelProgression, PERFORMANCE_CONFIG.MAX_DATA_POINTS);
    
    const data = sampledData.map(level => level.target || 0);
    const categories = sampledData.map(level => level.level || 0);

    return {
      series: [{
        name: 'Target Points',
        data
      }],
      categories
    };
  };

  /**
   * Get responsive chart height based on screen size
   * @param {string} chartType - Type of chart
   * @returns {number} Chart height in pixels
   */
  const getResponsiveHeight = (chartType) => {
    const screenWidth = window.innerWidth;
    
    if (screenWidth < 768) {
      // Mobile
      return chartType === 'donut' ? 280 : 300;
    } else if (screenWidth < 1024) {
      // Tablet
      return chartType === 'donut' ? 320 : 350;
    } else {
      // Desktop
      return chartType === 'donut' ? 350 : 400;
    }
  };

  // Cleanup all chart instances on unmount
  onUnmounted(() => {
    chartInstances.value.forEach(instance => {
      cleanupChartInstance(instance);
    });
    chartInstances.value.clear();
  });

  return {
    // Chart options
    giftDonutOptions,
    equipmentBarOptions,
    levelLineOptions,
    
    // Utility methods
    getChartColors,
    getBaseChartOptions,
    getOptimizedBaseOptions,
    formatGiftDonutData,
    formatEquipmentBarData,
    formatLevelLineData,
    getResponsiveHeight,
    
    // Performance utilities
    sampleData,
    registerChartInstance,
    cleanupChartInstance,
    
    // Performance configuration
    PERFORMANCE_CONFIG
  };
}