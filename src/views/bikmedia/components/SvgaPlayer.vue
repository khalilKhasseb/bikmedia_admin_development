<template>
  <div ref="containerRef" :style="{ width: width, height: height, display: 'inline-block' }"></div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import SVGA from 'svgaplayerweb';

const emit = defineEmits(['error']);

const props = defineProps({
  src: { type: String, required: true },
  width: { type: String, default: '100%' },
  height: { type: String, default: '100%' },
  loops: { type: Number, default: 0 }, // 0 = infinite
  autoplay: { type: Boolean, default: true },
  clearsAfterStop: { type: Boolean, default: false }
});

const containerRef = ref(null);
let player = null;
let parser = null;

const loadSvga = async () => {
  if (!containerRef.value || !props.src) return;

  try {
    // Clean up existing player
    if (player) {
      player.clear();
      player = null;
    }

    // Check if URL is from external domain that might be blocked by CSP
    const isExternalDomain = props.src.includes('digitaloceanspaces.com') || 
                           (!props.src.includes('bikmedia.com') && props.src.startsWith('http'));
    
    if (isExternalDomain) {
      // For external domains, immediately emit error to trigger fallback
      console.warn('SVGA from external domain blocked by CSP, using fallback:', props.src);
      emit('error', new Error('CSP_BLOCKED'));
      return;
    }

    // Create new player and parser for allowed domains
    player = new SVGA.Player(containerRef.value);
    parser = new SVGA.Parser(containerRef.value);
    
    // Load and play
    parser.load(props.src, (videoItem) => {
      player.loops = props.loops;
      player.clearsAfterStop = props.clearsAfterStop;
      player.setVideoItem(videoItem);
      if (props.autoplay) {
        player.startAnimation();
      }
    }, (error) => {
      console.error('SVGA load error:', error);
      emit('error', error);
    });
  } catch (error) {
    console.error('SVGA player error:', error);
    emit('error', error);
  }
};

onMounted(() => {
  loadSvga();
});

watch(() => props.src, () => {
  loadSvga();
});

onBeforeUnmount(() => {
  if (player) {
    player.clear();
    player = null;
  }
  parser = null;
});
</script>

<style scoped>
div {
  overflow: hidden;
}
</style>