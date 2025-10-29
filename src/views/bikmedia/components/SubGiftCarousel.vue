<template>
  <div class="sub-gift-carousel-container" v-if="isVisible">
    <div class="sub-gift-carousel" :style="{ height: containerHeight }">
      <!-- Error state -->
      <div v-if="hasError" class="error-state">
        <div class="error-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
        </div>
        <p class="error-message">{{ errorMessage }}</p>
        <button class="btn btn-sm btn-outline-primary retry-btn" @click="$emit('retry')">
          Try Again
        </button>
      </div>
      
      <!-- Loading state -->
      <div v-else-if="isLoading" class="loading-state">
        <div class="loading-spinner">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
        <p class="loading-message">Loading sub gifts...</p>
      </div>
      
      <!-- Empty state -->
      <div v-else-if="!subGifts || subGifts.length === 0" class="empty-state">
        <p class="empty-message">No sub gifts</p>
      </div>
      
      <!-- Carousel -->
      <div 
        v-else-if="!isLoading && !hasError && subGifts && subGifts.length > 0"
        :id="carouselId" 
        class="carousel slide" 
        data-bs-interval="false"
        data-bs-touch="true"
        data-bs-keyboard="true"
        data-bs-wrap="true"
      >
        <div class="carousel-inner">
          <div 
            v-for="(slide, slideIndex) in slides" 
            :key="`slide-${slideIndex}`"
            class="carousel-item"
            :class="{ active: slideIndex === 0 }"
          >
            <div class="row g-2">
              <div 
                v-for="(subGift, itemIndex) in slide" 
                :key="`item-${subGift.id}-${itemIndex}`"
                :class="itemColumnClass"
              >
                <SubGiftCard 
                  :sub-gift="subGift" 
                  :card-height="cardHeight"
                />
              </div>
            </div>
          </div>
        </div>
        
        <!-- Navigation Controls -->
        <template v-if="showNavigation">
          <button 
            class="carousel-control-prev" 
            type="button" 
            :data-bs-target="`#${carouselId}`" 
            data-bs-slide="prev"
            :aria-label="$t ? $t('carousel.previous') : 'Previous'"
          >
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
          </button>
          <button 
            class="carousel-control-next" 
            type="button" 
            :data-bs-target="`#${carouselId}`" 
            data-bs-slide="next"
            :aria-label="$t ? $t('carousel.next') : 'Next'"
          >
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
          </button>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, nextTick } from 'vue';
import SubGiftCard from './SubGiftCard.vue';

const emit = defineEmits(['retry']);

const props = defineProps({
  subGifts: {
    type: Array,
    required: true,
    default: () => []
  },
  giftId: {
    type: [Number, String],
    required: true
  },
  isVisible: {
    type: Boolean,
    default: false
  },
  autoSlide: {
    type: Boolean,
    default: false
  },
  containerHeight: {
    type: String,
    default: '220px'
  },
  cardHeight: {
    type: String,
    default: '120px'
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  hasError: {
    type: Boolean,
    default: false
  },
  errorMessage: {
    type: String,
    default: 'Failed to load sub gifts'
  }
});

// Reactive breakpoint tracking
const currentBreakpoint = ref('xl');

// Generate unique carousel ID
const carouselId = computed(() => `sub-gift-carousel-${props.giftId}`);

// Responsive breakpoint configuration
const breakpointConfig = {
  xl: { itemsPerView: 4, minWidth: 1200 },
  lg: { itemsPerView: 3, minWidth: 992 },
  md: { itemsPerView: 2, minWidth: 0 }
};

// Current items per view based on breakpoint
const itemsPerView = computed(() => {
  return breakpointConfig[currentBreakpoint.value].itemsPerView;
});

// CSS column class for responsive grid
const itemColumnClass = computed(() => {
  const breakpoint = currentBreakpoint.value;
  switch (breakpoint) {
    case 'xl':
      return 'col-xl-6 col-lg-6 col-md-6';
    case 'lg':
      return 'col-lg-4 col-md-6';
    case 'md':
    default:
      return 'col-md-6 col-sm-6';
  }
});

// Group sub-gifts into slides based on current breakpoint
const slides = computed(() => {
  if (!props.subGifts || props.subGifts.length === 0) {
    return [];
  }
  
  // Filter out invalid sub-gifts
  const validSubGifts = props.subGifts.filter(gift => 
    gift && typeof gift === 'object' && (gift.name || gift.icon)
  );
  
  if (validSubGifts.length === 0) {
    return [];
  }
  
  const items = itemsPerView.value;
  const slides = [];
  
  for (let i = 0; i < validSubGifts.length; i += items) {
    slides.push(validSubGifts.slice(i, i + items));
  }
  
  return slides;
});

// Show navigation only if there are multiple slides
const showNavigation = computed(() => {
  return slides.value.length > 1;
});

// Update breakpoint based on window width
const updateBreakpoint = () => {
  const width = window.innerWidth;
  
  if (width >= 1200) {
    currentBreakpoint.value = 'xl';
  } else if (width >= 992) {
    currentBreakpoint.value = 'lg';
  } else {
    currentBreakpoint.value = 'md';
  }
};

// Initialize Bootstrap carousel
const initializeCarousel = async () => {
  try {
    await nextTick();
    
    // Check if Bootstrap is available and carousel element exists
    if (typeof window !== 'undefined' && window.bootstrap && props.subGifts?.length > 0) {
      const carouselElement = document.getElementById(carouselId.value);
      if (carouselElement) {
        // Initialize Bootstrap carousel with options
        new window.bootstrap.Carousel(carouselElement, {
          interval: false, // No auto-slide
          keyboard: true,  // Enable keyboard navigation
          touch: true,     // Enable touch/swipe
          wrap: true       // Enable continuous sliding
        });
      }
    }
  } catch (error) {
    console.warn('Failed to initialize carousel:', error);
    // Carousel will gracefully degrade to static display
  }
};

// Update breakpoint and reinitialize carousel if needed
const handleResize = async () => {
  const oldBreakpoint = currentBreakpoint.value;
  updateBreakpoint();
  
  // If breakpoint changed, reinitialize carousel
  if (oldBreakpoint !== currentBreakpoint.value) {
    await nextTick();
    initializeCarousel();
  }
};

// Lifecycle hooks
onMounted(async () => {
  updateBreakpoint();
  window.addEventListener('resize', handleResize);
  
  // Initialize carousel after component is mounted
  if (props.isVisible) {
    await initializeCarousel();
  }
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  
  // Clean up Bootstrap carousel instance
  if (typeof window !== 'undefined' && window.bootstrap) {
    const carouselElement = document.getElementById(carouselId.value);
    if (carouselElement) {
      const carouselInstance = window.bootstrap.Carousel.getInstance(carouselElement);
      if (carouselInstance) {
        carouselInstance.dispose();
      }
    }
  }
});
</script>

<style lang="scss" scoped>
@import '@/assets/base/_color_variables.scss';

.sub-gift-carousel-container {
  width: 100%;
  overflow: hidden;
}

.sub-gift-carousel {
  position: relative;
  width: 100%;
  background: $white;
  border-radius: 8px;
  padding: 16px;
  
  .error-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    min-height: 120px;
    
    .error-icon {
      margin-bottom: 12px;
      color: #dc3545;
    }
    
    .error-message {
      color: $m-color_6;
      font-size: 14px;
      margin: 0 0 12px 0;
      text-align: center;
    }
    
    .retry-btn {
      font-size: 12px;
      padding: 4px 12px;
    }
  }
  
  .loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    min-height: 120px;
    
    .loading-spinner {
      margin-bottom: 12px;
      
      .spinner-border {
        width: 2rem;
        height: 2rem;
      }
    }
    
    .loading-message {
      color: $m-color_6;
      font-size: 14px;
      margin: 0;
      text-align: center;
    }
  }
  
  .empty-state {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    min-height: 120px;
    
    .empty-message {
      color: $m-color_6;
      font-size: 14px;
      margin: 0;
      text-align: center;
    }
  }
  
  .carousel {
    height: 100%;
    
    .carousel-inner {
      height: 100%;
      
      .carousel-item {
        height: 100%;
        
        .row {
          height: 100%;
          margin: 0;
          
          > div {
            display: flex;
            align-items: stretch;
          }
        }
      }
    }
    
    // Navigation controls styling
    .carousel-control-prev,
    .carousel-control-next {
      width: 40px;
      height: 40px;
      top: 50%;
      transform: translateY(-50%);
      background: rgba(0, 0, 0, 0.5);
      border-radius: 50%;
      border: none;
      opacity: 0.7;
      transition: opacity 0.2s ease-in-out;
      
      &:hover {
        opacity: 1;
      }
      
      .carousel-control-prev-icon,
      .carousel-control-next-icon {
        width: 20px;
        height: 20px;
      }
    }
    
    .carousel-control-prev {
      left: -20px;
    }
    
    .carousel-control-next {
      right: -20px;
    }
  }
}

// Responsive adjustments
@media (max-width: 1199px) {
  .sub-gift-carousel {
    padding: 12px;
  }
}

@media (max-width: 991px) {
  .sub-gift-carousel {
    padding: 10px;
    
    .carousel-control-prev {
      left: -15px;
    }
    
    .carousel-control-next {
      right: -15px;
    }
  }
}

@media (max-width: 767px) {
  .sub-gift-carousel {
    padding: 8px;
    
    .carousel-control-prev,
    .carousel-control-next {
      width: 35px;
      height: 35px;
      
      .carousel-control-prev-icon,
      .carousel-control-next-icon {
        width: 18px;
        height: 18px;
      }
    }
    
    .carousel-control-prev {
      left: -10px;
    }
    
    .carousel-control-next {
      right: -10px;
    }
  }
}
</style>