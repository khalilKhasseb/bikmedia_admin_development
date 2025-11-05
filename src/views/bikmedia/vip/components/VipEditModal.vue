<template>
  <div 
    class="modal fade" 
    id="vipEditModal" 
    tabindex="-1" 
    role="dialog" 
    aria-labelledby="vipEditModalLabel" 
    aria-hidden="true"
    @keydown="handleKeydown"
  >
    <div class="modal-dialog modal-xl" role="document">
      <div class="modal-content">
        <!-- Modal Header -->
        <div class="modal-header">
          <h5 class="modal-title" id="vipEditModalLabel">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" 
                 fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" 
                 stroke-linejoin="round" class="me-2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
            {{ $t('bikmedia.pages.vip.editTitle') }}: {{ vipPackage?.name || '' }}
          </h5>
          <button 
            type="button" 
            class="btn-close" 
            data-bs-dismiss="modal" 
            aria-label="Close"
            @click="handleClose"
            :disabled="isLoading"
          ></button>
        </div>

        <!-- Modal Body -->
        <div class="modal-body">
          <!-- General Error Message -->
          <div v-if="errors.general" class="alert alert-danger mb-4" role="alert">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" 
                 fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" 
                 stroke-linejoin="round" class="me-2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            {{ errors.general }}
          </div>
          
          <!-- Dynamic Form Builder -->
          <form @submit.prevent="handleSubmit" ref="formRef">
            <DynamicFormBuilder 
              :entityConfig="vipConfig" 
              v-model="formData" 
              :isSubmitted="isSubmitted"
              :errors="errors" 
              :existingData="vipPackage" 
              :selectedLocale="'en'"
              :showAllLocales="false" 
              :layoutMode="'custom-panels'" 
              mode="edit" 
            />
          </form>
        </div>

        <!-- Modal Footer -->
        <div class="modal-footer">
          <button 
            type="button" 
            class="btn btn-light-dark" 
            data-bs-dismiss="modal"
            @click="handleClose"
            :disabled="isLoading"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" 
                 fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" 
                 stroke-linejoin="round" class="me-1">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
            {{ $t('bikmedia.actions.cancel') }}
          </button>
          <button 
            type="button" 
            class="btn btn-primary"
            @click="handleSubmit"
            :disabled="isLoading || !isFormValid"
          >
            <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" 
                 fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" 
                 stroke-linejoin="round" class="me-1">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
              <polyline points="17 21 17 13 7 13 7 21"></polyline>
              <polyline points="7 3 7 8 15 8"></polyline>
            </svg>
            {{ isLoading ? $t('bikmedia.messages.saving') : $t('bikmedia.actions.saveChanges') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';
import DynamicFormBuilder from '@/views/bikmedia/components/DynamicFormBuilder.vue';
import vipConfig from '@/config/entities/vip.config';
import vipService from '@/services/api/vip.service';
import { initializeFormData, validateEntityFields, buildDynamicPayload } from '@/config/entities/helpers';
import { sanitizeObject } from '@/utils/sanitize';
import { bikMediaNotifications } from '@/utils/notification-handler';

// Composables
const { t } = useI18n();

// Props
const props = defineProps({
  vipPackage: {
    type: Object,
    default: null
  }
});

// Emits
const emit = defineEmits(['package-updated', 'modal-closed']);

// Reactive state
const formRef = ref(null);
const isLoading = ref(false);
const isSubmitted = ref(false);
const errors = ref({});

// Form data initialization
const initialFormData = initializeFormData(vipConfig);
const formData = ref(initialFormData);

// Computed properties
const isFormValid = computed(() => {
  if (!isSubmitted.value) return true;
  
  const { valid } = validateEntityFields(vipConfig, formData.value);
  return valid && Object.keys(errors.value).length === 0;
});

// Methods
const resetForm = () => {
  formData.value = initializeFormData(vipConfig);
  isSubmitted.value = false;
  errors.value = {};
  isLoading.value = false;
};

const populateForm = (packageData) => {
  if (!packageData) {
    resetForm();
    return;
  }
  
  // Initialize form data with existing package data
  formData.value = initializeFormData(vipConfig, packageData);
  
  // Handle file fields specially
  if (packageData.img) {
    formData.value.imgData = { file: null, url: packageData.img };
  }
  
  console.log('Form populated with:', formData.value);
};

const validateForm = () => {
  const { valid, errors: validationErrors } = validateEntityFields(vipConfig, formData.value);
  
  // Add custom validation rules
  const customErrors = {};
  
  // Validate coin amounts
  if (formData.value.coin < 0) {
    customErrors.coin = t('bikmedia.validation.mustBePositive');
  }
  
  if (formData.value.renew_coin < 0) {
    customErrors.renew_coin = t('bikmedia.validation.mustBePositive');
  }
  
  // Validate days
  if (formData.value.days <= 0) {
    customErrors.days = t('bikmedia.validation.mustBeGreaterThanZero');
  }
  
  // Validate order number
  if (formData.value.orderno < 0) {
    customErrors.orderno = t('bikmedia.validation.mustBePositive');
  }
  
  // Combine validation errors
  errors.value = { ...validationErrors, ...customErrors };
  
  return valid && Object.keys(customErrors).length === 0;
};

const handleSubmit = async () => {
  isSubmitted.value = true;
  
  if (!validateForm()) {
    // Scroll to first error field
    nextTick(() => {
      const firstErrorField = formRef.value?.querySelector('.is-invalid');
      if (firstErrorField) {
        firstErrorField.focus();
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
    
    bikMediaNotifications.general.error(t('bikmedia.validation.pleaseFixErrors'));
    return;
  }
  
  if (!props.vipPackage?.id) {
    errors.value.general = t('bikmedia.errors.noPackageSelected');
    return;
  }
  
  isLoading.value = true;
  errors.value = {}; // Clear any previous errors
  
  try {
    // Sanitize string fields
    const cleaned = sanitizeObject(
      { ...formData.value }, 
      Object.keys(formData.value).filter(k => typeof formData.value[k] === 'string')
    );
    formData.value = cleaned;
    
    // Build payload dynamically
    const payload = buildDynamicPayload(
      vipConfig, 
      formData.value, 
      props.vipPackage, 
      'update', 
      { 
        id: props.vipPackage.id, 
        updateStrategy: 'changed' 
      }
    );
    
    // Check if there are any changes
    const hasChanges = () => {
      if (payload instanceof FormData) {
        const keys = Array.from(payload.keys());
        const nonIdKeys = keys.filter(key => key !== 'id');
        return nonIdKeys.length > 0;
      }
      return Object.keys(payload).length > 0;
    };
    
    if (!hasChanges()) {
      bikMediaNotifications.general.info(t('bikmedia.messages.noChangesToSave'));
      isLoading.value = false;
      return;
    }
    
    console.log('Updating VIP package with payload:', payload);
    
    // Call the service to update the package
    const response = await vipService.updatePackage(props.vipPackage.id, payload);
    
    // Create updated package object from response
    const updatedPackage = {
      ...props.vipPackage,
      ...response.data.data
    };
    
    // Handle file fields
    if (formData.value.imgData?.url) {
      updatedPackage.img = formData.value.imgData.url;
    }
    
    console.log('Package updated successfully:', updatedPackage);
    
    // Emit the updated package
    emit('package-updated', updatedPackage);
    
  } catch (error) {
    console.error('Failed to update VIP package:', error);
    errors.value.general = error.message || t('bikmedia.errors.failedToUpdatePackage');
    bikMediaNotifications.general.error(errors.value.general);
  } finally {
    isLoading.value = false;
  }
};

const handleClose = () => {
  // Check for unsaved changes
  const hasChanges = JSON.stringify(formData.value) !== JSON.stringify(initializeFormData(vipConfig, props.vipPackage));
  
  if (hasChanges && !isLoading.value) {
    bikMediaNotifications.general.unsavedChanges().then((result) => {
      if (result.isConfirmed) {
        resetForm();
        emit('modal-closed');
      }
    });
  } else {
    resetForm();
    emit('modal-closed');
  }
};

// Keyboard event handler for better accessibility
const handleKeydown = (event) => {
  if (event.key === 'Escape' && !isLoading.value) {
    handleClose();
  } else if (event.key === 'Enter' && event.ctrlKey && !isLoading.value) {
    // Ctrl+Enter to submit form
    event.preventDefault();
    handleSubmit();
  }
};

// Watch for vipPackage changes to populate form
watch(() => props.vipPackage, (newPackage) => {
  populateForm(newPackage);
}, { immediate: true, deep: true });

// Expose methods for parent component
defineExpose({
  resetForm,
  populateForm
});
</script>

<style scoped>
.modal-dialog {
  max-width: 1200px;
}

.modal-body {
  max-height: 70vh;
  overflow-y: auto;
  padding: 1.5rem;
}

.modal-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-bottom: none;
}

.modal-header .modal-title {
  color: white;
  font-weight: 600;
}

.modal-header .btn-close {
  filter: invert(1);
}

.modal-footer {
  border-top: 1px solid #e9ecef;
  padding: 1rem 1.5rem;
}

.spinner-border-sm {
  width: 1rem;
  height: 1rem;
}

.alert {
  border-radius: 8px;
}

.btn {
  border-radius: 6px;
  font-weight: 500;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
  transform: translateY(-1px);
}

.btn-light-dark {
  background-color: #f8f9fa;
  border-color: #dee2e6;
  color: #6c757d;
}

.btn-light-dark:hover {
  background-color: #e9ecef;
  border-color: #adb5bd;
  color: #495057;
}

/* Custom scrollbar for modal body */
.modal-body::-webkit-scrollbar {
  width: 6px;
}

.modal-body::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.modal-body::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.modal-body::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Responsive adjustments */
@media (max-width: 1200px) {
  .modal-dialog {
    max-width: 95%;
    margin: 1rem auto;
  }
}

@media (max-width: 768px) {
  .modal-dialog {
    max-width: 100%;
    margin: 0;
    height: 100vh;
  }
  
  .modal-content {
    height: 100vh;
    border-radius: 0;
  }
  
  .modal-body {
    max-height: calc(100vh - 140px);
  }
  
  .modal-footer {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .modal-footer .btn {
    width: 100%;
  }
}

/* Animation improvements */
.modal.fade .modal-dialog {
  transition: transform 0.3s ease-out;
}

.modal.show .modal-dialog {
  transform: none;
}

/* Focus improvements */
.btn:focus,
.btn-close:focus {
  box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
}
</style>