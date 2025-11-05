<template>
  <span>{{ displayValue }}</span>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';

// Props
const props = defineProps({
  endValue: {
    type: Number,
    default: 0
  },
  duration: {
    type: Number,
    default: 1000
  },
  startValue: {
    type: Number,
    default: 0
  }
});

// Reactive State
const displayValue = ref(props.startValue);

// Animation function
const animateCount = (start, end, duration) => {
  if (start === end) {
    displayValue.value = end;
    return;
  }

  const startTime = performance.now();
  const difference = end - start;

  const step = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing function (ease-out)
    const easeOut = 1 - Math.pow(1 - progress, 3);
    
    displayValue.value = Math.round(start + (difference * easeOut));
    
    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      displayValue.value = end;
    }
  };

  requestAnimationFrame(step);
};

// Watch for endValue changes
watch(() => props.endValue, (newValue, oldValue) => {
  const startValue = oldValue !== undefined ? displayValue.value : props.startValue;
  animateCount(startValue, newValue, props.duration);
}, { immediate: true });

// Start animation on mount
onMounted(() => {
  animateCount(props.startValue, props.endValue, props.duration);
});
</script>