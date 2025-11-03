<template>
  <div 
    class="modal fade" 
    :id="modalId" 
    tabindex="-1" 
    role="dialog" 
    :aria-labelledby="modalId + 'Label'" 
    aria-hidden="true"
    @keydown="handleKeydown"
  >
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <!-- Modal Header -->
        <div class="modal-header">
          <h5 class="modal-title" :id="modalId + 'Label'">
            {{ isEditMode ? 'Edit VIP Option' : 'Add VIP Option' }}
          </h5>
          <button 
            type="button" 
            class="btn-close" 
            data-bs-dismiss="modal" 
            aria-label="Close"
            @click="handleClose"
          ></button>
        </div>

        <!-- Modal Body -->
        <div class="modal-body">
          <!-- General Error Message -->
          <div v-if="errors.general" class="alert alert-danger mb-4" role="alert">
            <i class="fas fa-exclamation-triangle me-2"></i>
            {{ errors.general }}
          </div>
          
          <form @submit.prevent="handleSubmit" ref="formRef">
            <!-- Basic Information Section -->
            <FormSection
              title="Basic Information"
              description="Option name and description"
              :collapsible="false"
            >
              <!-- Option Name -->
              <div class="form-group mb-4">
                <label for="optionName" class="form-label">
                  Option Name
                  <span class="text-danger">*</span>
                </label>
                <input
                  id="optionName"
                  type="text"
                  class="form-control"
                  :class="validationClass('name')"
                  v-model="formData.name"
                  placeholder="Enter option name"
                  maxlength="255"
                  required
                />
                <div v-if="validationClass('name') === 'is-valid'" class="valid-feedback">
                  Looks good!
                </div>
                <div v-if="validationClass('name') === 'is-invalid'" class="invalid-feedback">
                  {{ errors.name || 'Please provide a valid option name.' }}
                </div>
              </div>

              <!-- Description -->
              <div class="form-group mb-4">
                <label for="optionDescription" class="form-label">
                  Description
                </label>
                <textarea
                  id="optionDescription"
                  class="form-control"
                  :class="validationClass('description')"
                  v-model="formData.description"
                  placeholder="Enter option description"
                  rows="3"
                  maxlength="500"
                ></textarea>
                <div v-if="validationClass('description') === 'is-valid'" class="valid-feedback">
                  Looks good!
                </div>
                <div v-if="validationClass('description') === 'is-invalid'" class="invalid-feedback">
                  {{ errors.description }}
                </div>
                <small class="form-text text-muted">
                  {{ formData.description.length }}/500 characters
                </small>
              </div>
            </FormSection>

            <!-- Media Files Section -->
            <FormSection
              title="Media Files"
              description="Upload icon and animation files"
              :collapsible="false"
            >
              <!-- Icon Upload -->
              <FileUploadInput
                field-name="icon"
                label="Icon"
                :model-value="fileData.icon"
                @update:model-value="updateFileData('icon', $event)"
                accept="image/*"
                :max-size="5242880"
                :required="false"
                :show-url-input="true"
                :existing-url="existingData?.icon || ''"
                :is-submitted="isSubmitted"
                :errors="errors"
              />

              <!-- SVGA Upload -->
              <FileUploadInput
                field-name="svga"
                label="Animation"
                :model-value="fileData.svga"
                @update:model-value="updateFileData('svga', $event)"
                accept=".svga,.webp,.gif,.svg"
                :max-size="10485760"
                :required="false"
                :show-url-input="true"
                :existing-url="existingData?.svga || ''"
                :is-submitted="isSubmitted"
                :errors="errors"
              />
            </FormSection>
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
            <i class="flaticon-cancel-12"></i> Cancel
          </button>
          <button 
            type="button" 
            class="btn btn-primary"
            @click="handleSubmit"
            :disabled="isLoading || !isFormValid"
          >
            <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            <i v-else class="flaticon-disk"></i>
            {{ isEditMode ? 'Update Option' : 'Create Option' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue';
import FormSection from '@/components/forms/FormSection.vue';
import FileUploadInput from '@/components/forms/FileUploadInput.vue';
import { vipOptionConfig } from '@/config/entities/vip-option.config.js';

const props = defineProps({
  modalId: {
    type: String,
    default: 'vipOptionModal'
  },
  vipId: {
    type: [Number, String],
    required: true
  },
  existingData: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['option-created', 'option-updated', 'modal-closed']);

// Reactive state
const formRef = ref(null);
const isLoading = ref(false);
const isSubmitted = ref(false);
const errors = ref({});

// Form data
const formData = ref({
  name: '',
  description: ''
});

// File data
const fileData = ref({
  icon: { file: null, url: '' },
  svga: { file: null, url: '' }
});

// Computed properties
const isEditMode = computed(() => !!props.existingData);

const isFormValid = computed(() => {
  return formData.value.name.trim().length > 0;
});

// Validation helper
const validationClass = (fieldName) => {
  if (!isSubmitted.value) return '';
  if (errors.value[fieldName]) return 'is-invalid';
  
  // Field-specific validation
  switch (fieldName) {
    case 'name':
      return formData.value.name.trim().length > 0 ? 'is-valid' : 'is-invalid';
    case 'description':
      return 'is-valid'; // Description is optional
    default:
      return '';
  }
};

// Methods
const updateFileData = (fieldName, value) => {
  fileData.value[fieldName] = value;
};

const resetForm = () => {
  formData.value = {
    name: '',
    description: ''
  };
  
  fileData.value = {
    icon: { file: null, url: '' },
    svga: { file: null, url: '' }
  };
  
  isSubmitted.value = false;
  errors.value = {};
  isLoading.value = false;
};

const populateForm = (data) => {
  if (!data) return;
  
  formData.value = {
    name: data.name || '',
    description: data.description || ''
  };
  
  fileData.value = {
    icon: { file: null, url: data.icon || '' },
    svga: { file: null, url: data.svga || '' }
  };
};

const validateForm = () => {
  const newErrors = {};
  
  // Validate required fields
  if (!formData.value.name.trim()) {
    newErrors.name = 'Option name is required';
  } else if (formData.value.name.length > 255) {
    newErrors.name = 'Option name must be less than 255 characters';
  }
  
  if (formData.value.description.length > 500) {
    newErrors.description = 'Description must be less than 500 characters';
  }
  
  errors.value = newErrors;
  return Object.keys(newErrors).length === 0;
};

const buildFormData = () => {
  const formDataObj = new FormData();
  
  // Add text fields
  formDataObj.append('name', formData.value.name.trim());
  formDataObj.append('description', formData.value.description.trim());
  
  // Add files if selected
  if (fileData.value.icon.file) {
    formDataObj.append('icon', fileData.value.icon.file);
  } else if (fileData.value.icon.url) {
    formDataObj.append('icon', fileData.value.icon.url);
  }
  
  if (fileData.value.svga.file) {
    formDataObj.append('svga', fileData.value.svga.file);
  } else if (fileData.value.svga.url) {
    formDataObj.append('svga', fileData.value.svga.url);
  }
  
  return formDataObj;
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
    return;
  }
  
  isLoading.value = true;
  errors.value = {}; // Clear any previous errors
  
  try {
    const formDataObj = buildFormData();
    
    if (isEditMode.value) {
      // Emit update event with option ID and form data
      emit('option-updated', {
        optionId: props.existingData.id,
        formData: formDataObj,
        originalData: props.existingData
      });
    } else {
      // Emit create event with VIP ID and form data
      emit('option-created', {
        vipId: props.vipId,
        formData: formDataObj
      });
    }
    
    // Note: Loading state will be reset by parent component after successful operation
    // or by the catch block if there's an error
    
  } catch (error) {
    console.error('Form submission error:', error);
    errors.value.general = error.message || 'An error occurred while saving the option';
    isLoading.value = false;
  }
};

const handleClose = () => {
  resetForm();
  emit('modal-closed');
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

// Watch for existing data changes to populate form
watch(() => props.existingData, (newData) => {
  if (newData) {
    populateForm(newData);
  } else {
    resetForm();
  }
}, { immediate: true });

// Expose methods for parent component
defineExpose({
  resetForm,
  populateForm
});
</script>

<style scoped>
.modal-body {
  max-height: 70vh;
  overflow-y: auto;
}

.spinner-border-sm {
  width: 1rem;
  height: 1rem;
}

.form-control.is-valid {
  border-color: #28a745;
}

.form-control.is-invalid {
  border-color: #dc3545;
}

.valid-feedback {
  display: block;
  width: 100%;
  margin-top: 0.25rem;
  font-size: 0.875em;
  color: #28a745;
}

.invalid-feedback {
  display: block;
  width: 100%;
  margin-top: 0.25rem;
  font-size: 0.875em;
  color: #dc3545;
}
</style>