<template>
  <div class="toggle-wrapper position-relative">
    <label 
      class="switch s-icons s-outline s-outline-primary mb-0" 
      :class="{ 
        'toggle-loading': isToggling,
        'toggle-success': showSuccessAnimation,
        'toggle-error': showErrorAnimation
      }"
    >
      <input 
        type="checkbox" 
        :checked="modelValue" 
        :disabled="isToggling || disabled"
        @change="handleToggle"
      />
      <span class="slider round"></span>
    </label>
    
    <!-- Loading spinner overlay -->
    <div v-if="isToggling" class="toggle-spinner">
      <div class="spinner-border spinner-border-sm text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

// Props
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  optionId: {
    type: [Number, String],
    required: true,
    validator: (value) => {
      return value !== null && value !== undefined && value !== '';
    }
  },
  optionName: {
    type: String,
    default: 'Option'
  }
});

// Emits
const emit = defineEmits(['update:modelValue', 'toggle-success', 'toggle-error']);

// Local state
const isToggling = ref(false);
const showSuccessAnimation = ref(false);
const showErrorAnimation = ref(false);

// Handle toggle action
const handleToggle = async (event) => {
  const newValue = event.target.checked;
  
  // Prevent toggle if already toggling
  if (isToggling.value) {
    event.preventDefault();
    return;
  }

  // Set loading state
  isToggling.value = true;
  
  // Store original value for potential rollback
  const originalValue = props.modelValue;
  
  try {
    // Optimistically update the model value
    emit('update:modelValue', newValue);
    
    // Emit success event to parent for API call
    emit('toggle-success', {
      optionId: props.optionId,
      optionName: props.optionName,
      newValue
    });
    
    // Show success animation after a brief delay
    setTimeout(() => {
      showSuccessAnimation.value = true;
      setTimeout(() => {
        showSuccessAnimation.value = false;
      }, 600);
    }, 100);
    
  } catch (error) {
    // Revert the model value on error
    emit('update:modelValue', originalValue);
    
    // Show error animation
    showErrorAnimation.value = true;
    setTimeout(() => {
      showErrorAnimation.value = false;
    }, 600);
    
    // Emit error event
    emit('toggle-error', {
      optionId: props.optionId,
      optionName: props.optionName,
      error
    });
    
  } finally {
    // Clear loading state after a minimum delay for visual feedback
    setTimeout(() => {
      isToggling.value = false;
    }, 300);
  }
};

// Watch for external model value changes
watch(() => props.modelValue, (newValue) => {
  // This ensures the checkbox reflects external state changes
  // (e.g., when parent component updates the value)
}, { immediate: true });
</script>

<style scoped>
/* Toggle loading states and visual feedback */
.toggle-wrapper {
  display: inline-block;
  position: relative;
}

.toggle-loading {
  opacity: 0.7;
  pointer-events: none;
}

.toggle-spinner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
}

.toggle-spinner .spinner-border-sm {
  width: 1rem;
  height: 1rem;
}

/* Enhanced switch styling for better visual feedback */
.switch.s-outline.s-outline-primary input:checked + .slider {
  background-color: var(--bs-primary);
  border-color: var(--bs-primary);
}

.switch.s-outline.s-outline-primary input:disabled + .slider {
  opacity: 0.6;
  cursor: not-allowed;
}

.switch.s-outline.s-outline-primary .slider {
  transition: all 0.3s ease;
}

/* Hover effects for better UX */
.switch.s-outline.s-outline-primary:not(.toggle-loading):hover .slider {
  box-shadow: 0 0 0 0.2rem rgba(var(--bs-primary-rgb), 0.25);
}

/* Success/error visual feedback animations */
.toggle-success {
  animation: toggleSuccess 0.6s ease;
}

.toggle-error {
  animation: toggleError 0.6s ease;
}

@keyframes toggleSuccess {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); box-shadow: 0 0 0 0.3rem rgba(40, 167, 69, 0.3); }
  100% { transform: scale(1); }
}

@keyframes toggleError {
  0% { transform: scale(1); }
  25% { transform: translateX(-2px); }
  50% { transform: translateX(2px); box-shadow: 0 0 0 0.3rem rgba(220, 53, 69, 0.3); }
  75% { transform: translateX(-2px); }
  100% { transform: scale(1); }
}
</style>