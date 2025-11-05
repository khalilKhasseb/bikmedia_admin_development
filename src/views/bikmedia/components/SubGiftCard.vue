<template>
  <div class="sub-gift-card" :class="{ loading: isLoading }" :style="{ height: cardHeight }">
    <div class="card-body">
      <div class="icon-container">
        <div v-if="isLoading" class="loading-placeholder">
          <div class="loading-shimmer"></div>
        </div>
        <div v-else-if="imageError" class="image-error">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21,15 16,10 5,21"></polyline>
          </svg>
          <span class="error-text">{{ $t('bikmedia.components.subGiftCard.imageNotAvailable') }}</span>
        </div>
        <SmartIcon 
          v-else
          :src="processedIconUrl" 
          :alt="subGift?.name || $t('bikmedia.components.subGiftCard.subGift')" 
          width="100%" 
          height="100%" 
          fit="contain"
          :autoplay="true" 
          :loops="0" 
          imgClass="sub-gift-icon"
          @error="imageError = true"
        />
      </div>
      <div class="card-content">
        <h6 class="card-title" :title="subGift?.name || $t('bikmedia.components.subGiftCard.unnamedGift')">
          <span v-if="isLoading" class="loading-text"></span>
          <span v-else>{{ subGift?.name || $t('bikmedia.components.subGiftCard.unnamedGift') }}</span>
        </h6>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import SmartIcon from './SmartIcon.vue';
import { fixImageUrl } from '@/utils/url-fix.js';

// Internal error state for image loading
const imageError = ref(false);

const props = defineProps({
  subGift: {
    type: Object,
    required: true,
    validator: (value) => {
      // Allow any object with at least one property
      return value && typeof value === 'object' && Object.keys(value).length > 0;
    }
  },
  cardHeight: {
    type: String,
    default: '120px'
  },
  isLoading: {
    type: Boolean,
    default: false
  },

});

// Process the icon URL to fix any malformed extensions
const processedIconUrl = computed(() => {
  return fixImageUrl(props.subGift?.icon || '');
});
</script>

<style lang="scss" scoped>
@import '@/assets/base/_color_variables.scss';

.sub-gift-card {
  border: 1px solid $m-color_3;
  border-radius: 8px;
  background: $white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  overflow: hidden;
  display: flex;
  flex-direction: column;


  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    border-color: $primary;
  }

  .card-body {
    padding: 12px;
    display: flex;
    flex-direction: column;
    height: 100%;
    gap: 8px;
  }

  .icon-container {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 60px;
    background: $m-color_1;
    border-radius: 6px;
    overflow: hidden;

    .sub-gift-icon {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }
    
    .image-error {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #6c757d;
      text-align: center;
      padding: 8px;
      
      svg {
        margin-bottom: 4px;
        opacity: 0.6;
      }
      
      .error-text {
        font-size: 10px;
        opacity: 0.8;
      }
    }
  }

  .card-content {
    flex-shrink: 0;
    text-align: center;
  }

  .card-title {
    font-size: 12px;
    font-weight: 500;
    color: $m-color_9;
    margin: 0;
    line-height: 1.3;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-word;
    
    .loading-text {
      display: block;
      height: 1.3em;
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
      border-radius: 4px;
      width: 80%;
    }
  }
  
  .loading-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    
    .loading-shimmer {
      width: 60%;
      height: 60%;
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
      border-radius: 6px;
    }
  }
  
  &.loading {
    pointer-events: none;
    
    .icon-container {
      background: #f8f9fa;
    }
  }
}

// Loading animation
@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

// Responsive adjustments
@media (max-width: 768px) {
  .sub-gift-card {
    .card-body {
      padding: 10px;
      gap: 6px;
    }

    .icon-container {
      min-height: 50px;
    }

    .card-title {
      font-size: 11px;
    }
  }
}
</style>