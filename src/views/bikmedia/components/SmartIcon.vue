<template>
  <SvgaPlayer 
    v-if="isSvga && !svgaError" 
    :src="src" 
    :width="width" 
    :height="height" 
    :loops="loops"
    :autoplay="autoplay"
    @error="handleSvgaError"
  />
  <img 
    v-else
    :src="fallbackImageSrc" 
    :alt="alt" 
    :style="{ width: width, height: height, objectFit: fit }"
    :class="imgClass"
    @error="handleImageError"
  />
</template>

<script setup>
import { computed, ref } from 'vue';
import SvgaPlayer from './SvgaPlayer.vue';
import { isUrlBlockedByCSP, isSVGADisabled, getBestFallbackUrl } from '@/utils/media-config.js';

const emit = defineEmits(['error']);
const svgaError = ref(false);

const props = defineProps({
  src: { type: String, required: true },
  alt: { type: String, default: 'icon' },
  width: { type: String, default: '100%' },
  height: { type: String, default: '100%' },
  fit: { type: String, default: 'cover' }, // object-fit for images
  loops: { type: Number, default: 0 },
  autoplay: { type: Boolean, default: true },
  imgClass: { type: String, default: '' }
});

const isSvga = computed(() => {
  return props.src && 
         props.src.toLowerCase().endsWith('.svga') && 
         !isSVGADisabled() && 
         !isUrlBlockedByCSP(props.src);
});

const fallbackImageSrc = computed(() => {
  // If it's an SVGA file but we can't/shouldn't load it as SVGA
  if (props.src && props.src.toLowerCase().endsWith('.svga')) {
    if (svgaError.value || isSVGADisabled() || isUrlBlockedByCSP(props.src)) {
      return getBestFallbackUrl(props.src);
    }
  }
  return props.src;
});

const handleSvgaError = (error) => {
  console.warn('SVGA failed to load, falling back to static image:', props.src);
  console.warn('Error details:', error);
  svgaError.value = true;
  
  // Mark CSP violation if it's a CSP-related error
  if (error && (error.message === 'CSP_BLOCKED' || isUrlBlockedByCSP(props.src))) {
    import('@/utils/media-config.js').then(({ markCSPViolation, disableSVGA }) => {
      markCSPViolation();
      disableSVGA();
    });
  }
  
  // Don't emit error immediately, let the fallback image try to load first
  // Only emit error if the fallback image also fails
};

const handleImageError = () => {
  // If we're already showing a fallback and it fails, emit the error
  if (svgaError.value) {
    console.warn('Fallback image also failed to load:', fallbackImageSrc.value);
  }
  emit('error');
};
</script>