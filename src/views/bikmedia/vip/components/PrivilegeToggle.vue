<template>
  <div class="privilege-toggle-wrapper">
    <div class="form-check form-switch">
      <input 
        class="form-check-input" 
        type="checkbox" 
        :id="`privilege-toggle-${privilegeId}`"
        :checked="isActive"
        :disabled="isUpdating"
        @change="handleToggle"
      />
      <label 
        class="form-check-label" 
        :for="`privilege-toggle-${privilegeId}`"
      >
        <span 
          class="toggle-status"
          :class="{
            'text-success': isActive && !isUpdating,
            'text-muted': !isActive && !isUpdating,
            'text-warning': isUpdating
          }"
        >
          <span v-if="isUpdating" class="spinner-border spinner-border-sm me-1"></span>
          {{ getStatusText() }}
        </span>
      </label>
    </div>


  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

// Composables
const { t } = useI18n();

// Props
const props = defineProps({
  privilegeId: {
    type: Number,
    required: true
  },
  privilegeName: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: false
  },
  isUpdating: {
    type: Boolean,
    default: false
  },

});

// Emits
const emit = defineEmits(['toggle']);

// Methods
const handleToggle = (event) => {
  if (props.isUpdating) {
    event.preventDefault();
    return;
  }

  emit('toggle', {
    privilegeId: props.privilegeId,
    privilegeName: props.privilegeName,
    newState: event.target.checked
  });
};

const getStatusText = () => {
  if (props.isUpdating) {
    return t('bikmedia.messages.updating');
  }
  
  return props.isActive 
    ? t('bikmedia.status.active') 
    : t('bikmedia.status.inactive');
};
</script>

<style scoped>
.privilege-toggle-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.form-check {
  margin-bottom: 0;
  min-height: auto;
}

.form-check-input {
  width: 2.5rem;
  height: 1.25rem;
  border-radius: 1rem;
  background-color: #e9ecef;
  border: 1px solid #ced4da;
  transition: all 0.3s ease;
}

.form-check-input:checked {
  background-color: #28a745;
  border-color: #28a745;
}

.form-check-input:focus {
  box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25);
  border-color: #28a745;
}

.form-check-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.form-check-input:disabled:checked {
  background-color: #6c757d;
  border-color: #6c757d;
}

.form-check-label {
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  margin-left: 0.5rem;
}

.form-check-input:disabled + .form-check-label {
  cursor: not-allowed;
  opacity: 0.6;
}

.toggle-status {
  display: flex;
  align-items: center;
  transition: color 0.3s ease;
}

.spinner-border-sm {
  width: 0.875rem;
  height: 0.875rem;
}

.toggle-tooltip {
  cursor: help;
}

/* Hover effects */
.privilege-toggle-wrapper:hover .form-check-input:not(:disabled) {
  border-color: #007bff;
}

/* Responsive adjustments */
@media (max-width: 576px) {
  .form-check-label {
    font-size: 0.8rem;
  }
  
  .form-check-input {
    width: 2rem;
    height: 1rem;
  }
}
</style>