<template>
  <div class="layout-px-spacing gift-create">
    <!-- Breadcrumb Navigation -->
    <teleport to="#breadcrumb">
      <ul class="navbar-nav flex-row">
        <li>
          <div class="page-header">
            <nav class="breadcrumb-one" aria-label="breadcrumb">
              <ol class="breadcrumb">
                <li class="breadcrumb-item"><a href="javascript:;" @click="router.push('/store/gifts')">Store</a></li>
                <li class="breadcrumb-item"><a href="javascript:;" @click="router.push('/store/gifts')">Gifts</a></li>
                <li class="breadcrumb-item active" aria-current="page"><span>Create</span></li>
              </ol>
            </nav>
          </div>
        </li>
      </ul>
    </teleport>

    <!-- Main Content -->
    <div class="row layout-top-spacing layout-spacing">
      <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
        <div class="doc-container">
          <div class="row">
            <div class="col-xl-9">
              
              <!-- Section 1: Basic Info (Name) -->
              <FormSection 
                :title="giftConfig.formSections.find(s => s.name === 'basicInfo')?.label || 'Basic Information'" 
                description="Enter the gift name in supported languages"
              >
                <TranslationInput
                  fieldName="name"
                  :fieldConfig="getFieldConfig('name')"
                  :locales="giftConfig.supportedLocales"
                  v-model="formData"
                  :isSubmitted="isSubmitted"
                  :errors="validationErrors"
                />
              </FormSection>

              <!-- Section 2: Details (Description) -->
              <FormSection 
                :title="giftConfig.formSections.find(s => s.name === 'details')?.label || 'Details'" 
                description="Provide detailed description in supported languages"
              >
                <TranslationInput
                  fieldName="description"
                  :fieldConfig="getFieldConfig('description')"
                  :locales="giftConfig.supportedLocales"
                  v-model="formData"
                  :isSubmitted="isSubmitted"
                  :errors="validationErrors"
                />
              </FormSection>

              <!-- Section 3: Settings (Non-Translatable Fields) -->
              <FormSection 
                :title="giftConfig.formSections.find(s => s.name === 'settings')?.label || 'Settings'" 
                description="Configure gift properties and requirements"
              >
                <!-- Row 1: Coin + Type -->
                <div class="row">
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
                  
                  <div class="col-md-6">
                    <div class="form-group mb-4">
                      <label for="type" class="form-label">
                        Type <span class="text-danger">*</span>
                      </label>
                      <select 
                        id="type"
                        v-model.number="formData.type" 
                        class="form-select" 
                        :class="getFieldValidationClass('type')"
                      >
                        <option 
                          v-for="option in getFieldConfig('type')?.options || []" 
                          :key="option.value" 
                          :value="option.value"
                        >
                          {{ option.label }}
                        </option>
                      </select>
                      <div class="invalid-feedback">{{ validationErrors.type }}</div>
                    </div>
                  </div>
                </div>

                <!-- Row 2: Level + VIP -->
                <div class="row">
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

                <!-- Row 3: Animation Type + List Order -->
                <div class="row">
                  <div class="col-md-6">
                    <div class="form-group mb-4">
                      <label for="anim_type" class="form-label">Animation Type</label>
                      <input 
                        type="number" 
                        id="anim_type"
                        v-model.number="formData.anim_type" 
                        class="form-control" 
                        placeholder="Animation Type"
                        min="0"
                        :class="getFieldValidationClass('anim_type')"
                      />
                      <div class="invalid-feedback">{{ validationErrors.anim_type }}</div>
                    </div>
                  </div>
                  
                  <div class="col-md-6">
                    <div class="form-group mb-4">
                      <label for="list_order" class="form-label">List Order</label>
                      <input 
                        type="number" 
                        id="list_order"
                        v-model.number="formData.list_order" 
                        class="form-control" 
                        placeholder="Display Order"
                        min="0"
                        :class="getFieldValidationClass('list_order')"
                      />
                      <small class="form-text text-muted">Lower numbers appear first</small>
                      <div class="invalid-feedback">{{ validationErrors.list_order }}</div>
                    </div>
                  </div>
                </div>

                <!-- Row 4: Mark -->
                <div class="row">
                  <div class="col-md-6">
                    <div class="form-group mb-4">
                      <label for="mark" class="form-label">Mark</label>
                      <input 
                        type="number" 
                        id="mark"
                        v-model.number="formData.mark" 
                        class="form-control" 
                        placeholder="Mark Value"
                        min="0"
                        :class="getFieldValidationClass('mark')"
                      />
                      <div class="invalid-feedback">{{ validationErrors.mark }}</div>
                    </div>
                  </div>
                </div>
              </FormSection>

              <!-- Section 4: Media (File Upload Fields) -->
              <FormSection 
                :title="giftConfig.formSections.find(s => s.name === 'media')?.label || 'Media'" 
                description="Upload icon and animation files for the gift"
              >
                <div class="row">
                  <div class="col-md-6">
                    <FileUploadInput
                      fieldName="icon"
                      :label="getFieldConfig('icon')?.label || 'Gift Icon'"
                      v-model="formData.iconData"
                      :accept="getFieldConfig('icon')?.accept || 'image/*'"
                      :maxSize="(getFieldConfig('icon')?.maxSize || 5) * 1024 * 1024"
                      :required="getFieldConfig('icon')?.required || false"
                      :showUrlInput="getFieldConfig('icon')?.supportsUrlFallback || true"
                      :isSubmitted="isSubmitted"
                      :errors="validationErrors"
                    />
                  </div>
                  
                  <div class="col-md-6">
                    <FileUploadInput
                      fieldName="anim"
                      :label="getFieldConfig('anim')?.label || 'Gift Animation'"
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
                      {{ isSubmitting ? 'Creating...' : 'Create Gift' }}
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
import giftConfig from '@/config/entities/gift.config.js';
import giftService from '@/services/api/gift.service.js';
import TranslationInput from '@/views/bikmedia/components/TranslationInput.vue';
import FormSection from '@/components/forms/FormSection.vue';
import FileUploadInput from '@/components/forms/FileUploadInput.vue';
import { useMeta } from '@/composables/use-meta';
import { sanitizeInput, sanitizeObject } from '@/utils/sanitize.js';

// Meta
useMeta({ title: 'Create Gift' });

// Router
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
  type: 0,
  lvl: 0,
  vip: 0,
  anim_type: 0,
  list_order: 100000,
  mark: 1,
  
  // File upload data objects
  iconData: { file: null, url: '' },
  animData: { file: null, url: '' }
});

const isSubmitted = ref(false);
const isSubmitting = ref(false);
const validationErrors = ref({});

// Helper Methods
const getFieldConfig = (fieldName) => {
  // Search in translatable fields
  const translatableField = giftConfig.translatableFields.find(
    f => f.name === fieldName
  );
  if (translatableField) return translatableField;
  
  // Search in non-translatable fields
  const nonTranslatableField = giftConfig.nonTranslatableFields.find(
    f => f.name === fieldName
  );
  return nonTranslatableField;
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
  validationErrors.value = {};
  let isValid = true;

  // Validate translatable fields
  giftConfig.translatableFields.forEach(field => {
    if (field.required) {
      const hasAtLeastOneLocale = giftConfig.supportedLocales.some(locale => {
        const fieldKey = `${field.name}${locale.code.toUpperCase()}`;
        return formData.value[fieldKey] && formData.value[fieldKey].trim() !== '';
      });

      if (!hasAtLeastOneLocale) {
        validationErrors.value[field.name] = `At least one ${field.label} is required`;
        isValid = false;
      }
    }
  });

  // Validate non-translatable fields
  giftConfig.nonTranslatableFields.forEach(field => {
    if (field.required) {
      const value = formData.value[field.name];
      if (value === null || value === undefined || value === '') {
        validationErrors.value[field.name] = `${field.label} is required`;
        isValid = false;
      }
    }
  });

  return isValid;
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
  formDataToSend.append('type', formData.value.type);
  formDataToSend.append('lvl', formData.value.lvl);
  formDataToSend.append('vip', formData.value.vip);
  formDataToSend.append('anim_type', formData.value.anim_type);
  formDataToSend.append('list_order', formData.value.list_order);
  formDataToSend.append('mark', formData.value.mark);
  
  // Add files (priority over URLs)
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
  // Check if there are unsaved changes
  const hasChanges = 
    formData.value.nameEN || 
    formData.value.nameAR || 
    formData.value.descriptionEN || 
    formData.value.descriptionAR ||
    formData.value.coin !== 0 ||
    formData.value.type !== 0 ||
    formData.value.lvl !== 0 ||
    formData.value.vip !== 0 ||
    formData.value.anim_type !== 0 ||
    formData.value.list_order !== 100000 ||
    formData.value.mark !== 1 ||
    formData.value.iconData.file ||
    formData.value.iconData.url ||
    formData.value.animData.file ||
    formData.value.animData.url;

  if (hasChanges) {
    window.Swal.fire({
      title: 'Discard Changes?',
      text: 'You have unsaved changes. Are you sure you want to leave?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, discard',
      cancelButtonText: 'No, stay'
    }).then((result) => {
      if (result.isConfirmed) {
        router.push('/store/gifts');
      }
    });
  } else {
    router.push('/store/gifts');
  }
};

const handleSubmit = async () => {
  isSubmitted.value = true;

  if (!validateForm()) {
    showMessage('Please fix the validation errors', 'error');
    return;
  }

  try {
    isSubmitting.value = true;

    // Sanitize string fields
    const stringFields = ['nameEN', 'nameAR', 'descriptionEN', 'descriptionAR'];
    stringFields.forEach(field => {
      if (formData.value[field]) {
        formData.value[field] = sanitizeInput(formData.value[field]);
      }
    });

    // Build FormData
    const formDataToSend = buildFormData();

    // TODO: Replace with giftService.create() when available
    // This method will be added in subsequent phase
    const response = await giftService.postFormData('/create', formDataToSend);

    showMessage('Gift created successfully', 'success');
    router.push('/store/gifts');
  } catch (error) {
    console.error('Error creating gift:', error);
    const errorMessage = error.response?.data?.message || error.message || 'Failed to create gift';
    showMessage(errorMessage, 'error');
  } finally {
    isSubmitting.value = false;
  }
};

const showMessage = (msg, type = 'success') => {
  const toast = window.Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    padding: '2em'
  });
  toast.fire({
    icon: type,
    title: msg,
    padding: '2em'
  });
};

// Lifecycle Hooks
onMounted(() => {
  // Optional: Initialize form with default values from config
  // Already done in formData ref initialization
});
</script>

<style scoped>
.gift-create {
  /* Inherits layout-px-spacing from template */
}

.gap-2 {
  gap: 0.5rem;
}
</style>
