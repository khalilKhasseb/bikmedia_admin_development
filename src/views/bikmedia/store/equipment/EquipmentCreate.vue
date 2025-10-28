<template>
  <div class="layout-px-spacing equipment-create">
    <!-- Breadcrumb Navigation -->
    <teleport to="#breadcrumb">
      <ul class="navbar-nav flex-row">
        <li>
          <div class="page-header">
            <nav class="breadcrumb-one" aria-label="breadcrumb">
              <ol class="breadcrumb">
                <li class="breadcrumb-item"><a href="javascript:;" @click="router.push('/store/equipments')">Store</a></li>
                <li class="breadcrumb-item"><a href="javascript:;" @click="router.push('/store/equipments')">Equipments</a></li>
                <li class="breadcrumb-item active" aria-current="page"><span>Create</span></li>
              </ol>
            </nav>
          </div>
        </li>
      </ul>
    </teleport>

    <!-- Main Layout -->
    <div class="row layout-top-spacing layout-spacing">
      <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
        <div class="doc-container">
          <div class="row">
            <div class="col-xl-9">
              
              <!-- Section 1: Basic Info (Translation Fields - Name) -->
              <FormSection 
                :title="equipmentConfig.formSections.find(s => s.name === 'basicInfo')?.label || 'Basic Information'" 
                description="Enter the equipment name in supported languages"
              >
                <TranslationInput
                  fieldName="name"
                  :fieldConfig="getFieldConfig('name')"
                  :locales="equipmentConfig.supportedLocales"
                  v-model="formData"
                  :isSubmitted="isSubmitted"
                  :errors="validationErrors"
                />
              </FormSection>

              <!-- Section 2: Details (Translation Fields - Description) -->
              <FormSection 
                :title="equipmentConfig.formSections.find(s => s.name === 'details')?.label || 'Details'" 
                description="Provide detailed description in supported languages"
              >
                <TranslationInput
                  fieldName="description"
                  :fieldConfig="getFieldConfig('description')"
                  :locales="equipmentConfig.supportedLocales"
                  v-model="formData"
                  :isSubmitted="isSubmitted"
                  :errors="validationErrors"
                />
              </FormSection>

              <!-- Section 3: Settings (Non-Translatable Fields) -->
              <FormSection 
                :title="equipmentConfig.formSections.find(s => s.name === 'settings')?.label || 'Settings'" 
                description="Configure equipment properties and requirements"
              >
                <div class="row">
                  <!-- Coin Field -->
                  <div class="col-md-6">
                    <div class="form-group mb-4">
                      <label for="coin" class="form-label">Coins</label>
                      <input 
                        type="number" 
                        id="coin"
                        v-model.number="formData.coin" 
                        class="form-control" 
                        placeholder="Coin Value"
                        min="0"
                        :class="getFieldValidationClass('coin')"
                      />
                      <div class="invalid-feedback">{{ validationErrors.coin }}</div>
                    </div>
                  </div>
                  
                  <!-- Days Field -->
                  <div class="col-md-6">
                    <div class="form-group mb-4">
                      <label for="days" class="form-label">Days</label>
                      <input 
                        type="number" 
                        id="days"
                        v-model.number="formData.days" 
                        class="form-control" 
                        placeholder="Duration in Days"
                        min="0"
                        :class="getFieldValidationClass('days')"
                      />
                      <div class="invalid-feedback">{{ validationErrors.days }}</div>
                    </div>
                  </div>
                </div>
                
                <div class="row">
                  <!-- Type Field (Select) -->
                  <div class="col-md-6">
                    <div class="form-group mb-4">
                      <label for="type" class="form-label">
                        Type <span class="text-danger">*</span>
                      </label>
                      <select 
                        id="type"
                        v-model.number="formData.type" 
                        class="form-select"
                        required
                        :class="getFieldValidationClass('type')"
                      >
                        <option v-for="option in getFieldConfig('type').options" :key="option.value" :value="option.value">
                          {{ option.label }}
                        </option>
                      </select>
                      <div class="invalid-feedback">{{ validationErrors.type || 'Please select a type' }}</div>
                    </div>
                  </div>
                  
                  <!-- Level Field -->
                  <div class="col-md-6">
                    <div class="form-group mb-4">
                      <label for="lvl" class="form-label">Level</label>
                      <input 
                        type="number" 
                        id="lvl"
                        v-model.number="formData.lvl" 
                        class="form-control" 
                        placeholder="Level Requirement"
                        min="0"
                        :class="getFieldValidationClass('lvl')"
                      />
                      <div class="invalid-feedback">{{ validationErrors.lvl }}</div>
                    </div>
                  </div>
                </div>
                
                <div class="row">
                  <!-- VIP Field -->
                  <div class="col-md-6">
                    <div class="form-group mb-4">
                      <label for="vip" class="form-label">VIP</label>
                      <input 
                        type="number" 
                        id="vip"
                        v-model.number="formData.vip" 
                        class="form-control" 
                        placeholder="VIP Requirement"
                        min="0"
                        :class="getFieldValidationClass('vip')"
                      />
                      <div class="invalid-feedback">{{ validationErrors.vip }}</div>
                    </div>
                  </div>
                </div>
              </FormSection>

              <!-- Section 4: Media (File Upload Fields) -->
              <FormSection 
                :title="equipmentConfig.formSections.find(s => s.name === 'media')?.label || 'Media'" 
                description="Upload icon and animation files for the equipment"
              >
                <div class="row">
                  <!-- Icon Upload -->
                  <div class="col-md-6">
                    <FileUploadInput
                      fieldName="icon"
                      :label="getFieldConfig('icon')?.label || 'Equipment Icon'"
                      v-model="formData.iconData"
                      :accept="getFieldConfig('icon')?.accept || 'image/*'"
                      :maxSize="(getFieldConfig('icon')?.maxSize || 5) * 1024 * 1024"
                      :required="getFieldConfig('icon')?.required || false"
                      :showUrlInput="getFieldConfig('icon')?.supportsUrlFallback || true"
                      :isSubmitted="isSubmitted"
                      :errors="validationErrors"
                    />
                  </div>
                  
                  <!-- Animation Upload -->
                  <div class="col-md-6">
                    <FileUploadInput
                      fieldName="anim"
                      :label="getFieldConfig('anim')?.label || 'Equipment Animation'"
                      v-model="formData.animData"
                      :accept="getFieldConfig('anim')?.accept || '.svga,.webp,.gif'"
                      :maxSize="(getFieldConfig('anim')?.maxSize || 10) * 1024 * 1024"
                      :required="getFieldConfig('anim')?.required || false"
                      :showUrlInput="getFieldConfig('anim')?.supportsUrlFallback || true"
                      :isSubmitted="isSubmitted"
                      :errors="validationErrors"
                    />
                  </div>
                </div>
              </FormSection>

              <!-- Action Buttons -->
              <div class="row mt-4">
                <div class="col-12">
                  <div class="d-flex justify-content-end gap-2">
                    <button 
                      type="button" 
                      class="btn btn-secondary"
                      @click="handleCancel"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                      Cancel
                    </button>
                    <button 
                      type="button" 
                      class="btn btn-primary"
                      @click="handleSubmit"
                      :disabled="isSubmitting"
                    >
                      <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
                      <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-save"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
                      {{ isSubmitting ? 'Creating...' : 'Create Equipment' }}
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import equipmentConfig from '@/config/entities/equipment.config.js';
import equipmentService from '@/services/api/equipment.service.js';
import TranslationInput from '@/views/bikmedia/components/TranslationInput.vue';
import FormSection from '@/components/forms/FormSection.vue';
import FileUploadInput from '@/components/forms/FileUploadInput.vue';
import { useMeta } from '@/composables/use-meta';
import { sanitizeObject } from '@/utils/sanitize.js';

// Meta Setup
useMeta({ title: 'Create Equipment' });

// Router Setup
const router = useRouter();

// Reactive State
const formData = ref({
  // Translatable fields (suffixed)
  nameEN: '',
  nameAR: '',
  descriptionEN: '',
  descriptionAR: '',
  
  // Non-translatable fields
  coin: 0,
  days: 0,
  type: 1, // Default to Frame
  lvl: 0,
  vip: 0,
  
  // File upload data objects
  iconData: { file: null, url: '' },
  animData: { file: null, url: '' }
});

const isSubmitted = ref(false);
const isSubmitting = ref(false);
const validationErrors = ref({});

// Helper Methods
const getFieldConfig = (fieldName) => {
  // Check translatable fields
  const translatableField = equipmentConfig.translatableFields.find(
    f => f.name === fieldName
  );
  if (translatableField) return translatableField;
  
  // Check non-translatable fields
  const nonTranslatableField = equipmentConfig.nonTranslatableFields.find(
    f => f.name === fieldName
  );
  return nonTranslatableField || null;
};

const getFieldValidationClass = (fieldName) => {
  if (!isSubmitted.value) return '';
  
  const fieldConfig = getFieldConfig(fieldName);
  const fieldValue = formData.value[fieldName];
  const hasError = validationErrors.value[fieldName];
  
  if (hasError) return 'is-invalid';
  if (fieldConfig?.required && !fieldValue) return 'is-invalid';
  if (fieldValue !== null && fieldValue !== undefined && fieldValue !== '') return 'is-valid';
  
  return '';
};

const validateForm = () => {
  const errors = {};
  
  // Validate required fields from config
  equipmentConfig.nonTranslatableFields.forEach(field => {
    if (field.required) {
      const value = formData.value[field.name];
      if (value === null || value === undefined || value === '') {
        errors[field.name] = `${field.label} is required`;
      }
    }
  });
  
  // Validate translatable fields (at least one locale should be filled)
  equipmentConfig.translatableFields.forEach(field => {
    if (field.required) {
      const hasValue = equipmentConfig.supportedLocales.some(locale => {
        const suffixedName = `${field.name}${locale.code.toUpperCase()}`;
        const value = formData.value[suffixedName];
        return value && value.trim() !== '';
      });
      
      if (!hasValue) {
        equipmentConfig.supportedLocales.forEach(locale => {
          const suffixedName = `${field.name}${locale.code.toUpperCase()}`;
          errors[suffixedName] = `${field.label || field.name} is required in at least one language`;
        });
      }
    }
  });
  
  validationErrors.value = errors;
  return Object.keys(errors).length === 0;
};

const buildFormData = () => {
  const formDataToSend = new FormData();
  
  // Add translatable fields (suffixed)
  formDataToSend.append('nameEN', formData.value.nameEN || '');
  formDataToSend.append('nameAR', formData.value.nameAR || '');
  formDataToSend.append('descriptionEN', formData.value.descriptionEN || '');
  formDataToSend.append('descriptionAR', formData.value.descriptionAR || '');
  
  // Add non-translatable fields
  formDataToSend.append('coin', formData.value.coin);
  formDataToSend.append('days', formData.value.days);
  formDataToSend.append('type', formData.value.type);
  formDataToSend.append('lvl', formData.value.lvl);
  formDataToSend.append('vip', formData.value.vip);
  
  // Add files (priority over URLs per requirements)
  if (formData.value.iconData.file) {
    formDataToSend.append('icon', formData.value.iconData.file);
  } else if (formData.value.iconData.url) {
    formDataToSend.append('icon', formData.value.iconData.url);
  }
  
  if (formData.value.animData.file) {
    formDataToSend.append('anim', formData.value.animData.file);
  } else if (formData.value.animData.url) {
    formDataToSend.append('anim', formData.value.animData.url);
  }
  
  return formDataToSend;
};

// Event Handlers
const handleCancel = () => {
  // Optional: Show confirmation if form has changes
  const hasChanges = formData.value.nameEN || formData.value.nameAR || 
                     formData.value.coin > 0 || formData.value.days > 0;
  
  if (hasChanges) {
    window.Swal.fire({
      title: 'Discard changes?',
      text: 'You have unsaved changes. Are you sure you want to leave?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, discard',
      cancelButtonText: 'No, stay'
    }).then((result) => {
      if (result.isConfirmed) {
        router.push('/store/equipments');
      }
    });
  } else {
    router.push('/store/equipments');
  }
};

const handleSubmit = async () => {
  // Set submitted flag to trigger validation display
  isSubmitted.value = true;
  
  // Validate form
  if (!validateForm()) {
    showMessage('Please fix validation errors', 'error');
    return;
  }
  
  try {
    isSubmitting.value = true;
    
    // Sanitize string inputs to prevent XSS
    const sanitizedData = {
      nameEN: formData.value.nameEN,
      nameAR: formData.value.nameAR,
      descriptionEN: formData.value.descriptionEN,
      descriptionAR: formData.value.descriptionAR
    };
    
    // Apply sanitization (only to string fields)
    const cleaned = sanitizeObject(sanitizedData, ['nameEN', 'nameAR', 'descriptionEN', 'descriptionAR']);
    
    // Update formData with sanitized values
    Object.assign(formData.value, cleaned);
    
    // Build FormData for submission
    const formDataToSend = buildFormData();
    
    // Call service method
    const response = await equipmentService.create(formDataToSend);
    
    // Show success message
    showMessage('Equipment created successfully', 'success');
    
    // Navigate to list page after short delay
    setTimeout(() => {
      router.push('/store/equipments');
    }, 1000);
    
  } catch (error) {
    console.error('Failed to create equipment:', error);
    showMessage(error.message || 'Failed to create equipment', 'error');
  } finally {
    isSubmitting.value = false;
  }
};

const showMessage = (msg = '', type = 'success') => {
  const toast = window.Swal.mixin({
    toast: true,
    position: 'top',
    showConfirmButton: false,
    timer: 3000
  });
  toast.fire({
    icon: type,
    title: msg,
    padding: '10px 20px'
  });
};

// Lifecycle Hooks
onMounted(() => {
  // Optional: Initialize form with default values from config
  // Already done in formData ref initialization
  
  // Optional: Load any required data (e.g., type options)
  // Already available in equipmentConfig
});
</script>

<style scoped>
/* Ensure consistent spacing for action buttons */
.gap-2 {
  gap: 0.5rem;
}
</style>
