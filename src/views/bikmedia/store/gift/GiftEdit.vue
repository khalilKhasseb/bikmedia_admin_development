<template>
  <div class="layout-px-spacing gift-edit">
    <!-- Breadcrumb Navigation -->
    <teleport to="#breadcrumb">
      <ul class="navbar-nav flex-row">
        <li>
          <div class="page-header">
            <nav class="breadcrumb-one" aria-label="breadcrumb">
              <ol class="breadcrumb">
                <li class="breadcrumb-item"><a href="javascript:;" @click="router.push('/store/gifts')">Store</a></li>
                <li class="breadcrumb-item"><a href="javascript:;" @click="router.push('/store/gifts')">Gifts</a></li>
                <li class="breadcrumb-item active" aria-current="page"><span>Edit</span></li>
              </ol>
            </nav>
          </div>
        </li>
      </ul>
    </teleport>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading gift...</span>
      </div>
      <p class="mt-2">Loading gift data...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="loadError" class="text-center py-5">
      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-danger">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      <h5 class="mt-3">Failed to load gift</h5>
      <p class="text-muted">{{ loadError }}</p>
      <button class="btn btn-primary" @click="router.push('/store/gifts')">
        Back to List
      </button>
    </div>

    <!-- Form Sections -->
    <div v-else class="row layout-top-spacing layout-spacing">
      <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
        <div class="doc-container">
          <div class="row">
            <div class="col-xl-9">
              
              <!-- Section 1: Basic Info (Name) -->
              <FormSection title="Basic Information" description="Gift name in multiple languages">
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
              <FormSection title="Details" description="Gift description in multiple languages">
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
              <FormSection title="Settings" description="Gift configuration and requirements">
                
                <!-- Row 1: Coin + Type -->
                <div class="row">
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label for="coin" class="form-label">Coins</label>
                      <input
                        type="number"
                        class="form-control"
                        id="coin"
                        v-model.number="formData.coin"
                        placeholder="Coin Value"
                        min="0"
                        :class="getFieldValidationClass('coin')"
                      />
                      <div class="invalid-feedback">
                        {{ validationErrors.coin }}
                      </div>
                    </div>
                  </div>

                  <div class="col-md-6">
                    <div class="mb-3">
                      <label for="type" class="form-label">Type <span class="text-danger">*</span></label>
                      <select
                        class="form-select"
                        id="type"
                        v-model.number="formData.type"
                        :class="getFieldValidationClass('type')"
                      >
                        <option v-for="option in (getFieldConfig('type')?.options || giftConfig.nonTranslatableFields.find(f => f.name === 'type')?.options || [])" :key="option.value" :value="option.value">
                          {{ option.label }}
                        </option>
                      </select>
                      <div class="invalid-feedback">
                        {{ validationErrors.type || 'Please select a type' }}
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Row 2: Level + VIP -->
                <div class="row">
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label for="lvl" class="form-label">Level</label>
                      <input
                        type="number"
                        class="form-control"
                        id="lvl"
                        v-model.number="formData.lvl"
                        placeholder="Level Requirement"
                        min="0"
                        :class="getFieldValidationClass('lvl')"
                      />
                      <div class="invalid-feedback">
                        {{ validationErrors.lvl }}
                      </div>
                    </div>
                  </div>

                  <div class="col-md-6">
                    <div class="mb-3">
                      <label for="vip" class="form-label">VIP</label>
                      <input
                        type="number"
                        class="form-control"
                        id="vip"
                        v-model.number="formData.vip"
                        placeholder="VIP Requirement"
                        min="0"
                        :class="getFieldValidationClass('vip')"
                      />
                      <div class="invalid-feedback">
                        {{ validationErrors.vip }}
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Row 3: Animation Type + List Order -->
                <div class="row">
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label for="anim_type" class="form-label">Animation Type</label>
                      <input
                        type="number"
                        class="form-control"
                        id="anim_type"
                        v-model.number="formData.anim_type"
                        placeholder="Animation Type"
                        min="0"
                        :class="getFieldValidationClass('anim_type')"
                      />
                      <div class="invalid-feedback">
                        {{ validationErrors.anim_type }}
                      </div>
                    </div>
                  </div>

                  <div class="col-md-6">
                    <div class="mb-3">
                      <label for="list_order" class="form-label">List Order</label>
                      <input
                        type="number"
                        class="form-control"
                        id="list_order"
                        v-model.number="formData.list_order"
                        placeholder="Display Order"
                        min="0"
                        :class="getFieldValidationClass('list_order')"
                      />
                      <small class="form-text text-muted">Lower numbers appear first</small>
                      <div class="invalid-feedback">
                        {{ validationErrors.list_order }}
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Row 4: Mark -->
                <div class="row">
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label for="mark" class="form-label">Mark</label>
                      <input
                        type="number"
                        class="form-control"
                        id="mark"
                        v-model.number="formData.mark"
                        placeholder="Mark Value"
                        min="0"
                        :class="getFieldValidationClass('mark')"
                      />
                      <div class="invalid-feedback">
                        {{ validationErrors.mark }}
                      </div>
                    </div>
                  </div>
                </div>

              </FormSection>

              <!-- Section 4: Media (File Upload Fields) -->
              <FormSection title="Media" description="Upload icon and animation files for the gift">
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
                      :existingUrl="gift?.icon || ''"
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
                      :existingUrl="gift?.anim || ''"
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
                      :disabled="isSubmitting"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="me-1">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                      Cancel
                    </button>
                    <button
                      type="button"
                      class="btn btn-primary"
                      @click="handleSubmit"
                      :disabled="isSubmitting"
                    >
                      <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
                      <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="me-1">
                        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                        <polyline points="17 21 17 13 7 13 7 21"></polyline>
                        <polyline points="7 3 7 8 15 8"></polyline>
                      </svg>
                      {{ isSubmitting ? 'Updating...' : 'Update Gift' }}
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
import { useRouter, useRoute } from 'vue-router';
import { useMeta } from '@/composables/use-meta';
import FormSection from '@/components/forms/FormSection.vue';
import TranslationInput from '@/views/bikmedia/components/TranslationInput.vue';
import FileUploadInput from '@/components/forms/FileUploadInput.vue';
import giftService from '@/services/api/gift.service';
import { giftConfig } from '@/config/entities/gift.config';
import { sanitizeObject } from '@/utils/sanitize';
import Swal from 'sweetalert2';

// Meta Setup
useMeta({ title: 'Edit Gift' });

// Router Setup
const router = useRouter();
const route = useRoute();

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

const gift = ref(null);
const loading = ref(true);
const loadError = ref(null);
const isSubmitted = ref(false);
const isSubmitting = ref(false);
const validationErrors = ref({});

// Helper Methods
const getFieldConfig = (fieldName) => {
  // Check translatable fields first
  const translatableField = giftConfig.translatableFields.find(
    f => f.name === fieldName
  );
  if (translatableField) return translatableField;
  
  // Check non-translatable fields
  const nonTranslatableField = giftConfig.nonTranslatableFields.find(
    f => f.name === fieldName
  );
  if (nonTranslatableField) return nonTranslatableField;
  
  return null;
};

const getFieldValidationClass = (fieldName) => {
  if (!isSubmitted.value) return '';
  
  // Check if field has error
  if (validationErrors.value[fieldName]) {
    return 'is-invalid';
  }
  
  // Check if field has value (for optional fields)
  const fieldValue = formData.value[fieldName];
  if (fieldValue !== null && fieldValue !== undefined && fieldValue !== '') {
    return 'is-valid';
  }
  
  return '';
};

const validateForm = () => {
  validationErrors.value = {};
  let isValid = true;
  
  // Validate required fields from config
  giftConfig.nonTranslatableFields.forEach(field => {
    if (field.required) {
      const value = formData.value[field.name];
      if (value === null || value === undefined || value === '') {
        validationErrors.value[field.name] = `${field.label} is required`;
        isValid = false;
      }
    }
  });
  
  // Validate translatable fields (at least one locale required)
  giftConfig.translatableFields.forEach(field => {
    if (field.required) {
      const hasValue = giftConfig.supportedLocales.some(locale => {
        const fieldKey = `${field.name}${locale.suffix}`;
        const value = formData.value[fieldKey];
        return value && value.trim() !== '';
      });
      
      if (!hasValue) {
        giftConfig.supportedLocales.forEach(locale => {
          const fieldKey = `${field.name}${locale.suffix}`;
          validationErrors.value[fieldKey] = `${field.label} is required in at least one language`;
        });
        isValid = false;
      }
    }
  });
  
  return isValid;
};

const buildChangedFieldsPayload = () => {
  const hasFiles = Boolean(formData.value.iconData?.file || formData.value.animData?.file);

  const originalName = gift.value?.nameEN || gift.value?.name || '';
  const originalCoin = Number(gift.value?.coin) || 0;
  const originalType = Number(gift.value?.type) || 0;
  const originalLvl = Number(gift.value?.lvl) || 0;
  const originalVip = Number(gift.value?.vip) || 0;
  const originalAnimType = Number(gift.value?.anim_type) || 0;
  const originalIconUrl = gift.value?.icon || '';
  const originalAnimUrl = gift.value?.anim || '';

  const appendSupportedFields = (target) => {
    const nameValue = formData.value.nameEN ?? originalName;
    target.append('name', (nameValue !== undefined && nameValue !== null ? nameValue : originalName) || '');

    const coinValue = formData.value.coin ?? originalCoin;
    target.append('coin', String(coinValue));

    const typeValue = formData.value.type ?? originalType;
    target.append('type', String(typeValue));

    const lvlValue = formData.value.lvl ?? originalLvl;
    target.append('lvl', String(lvlValue));

    const vipValue = formData.value.vip ?? originalVip;
    target.append('vip', String(vipValue));

    const animTypeValue = formData.value.anim_type ?? originalAnimType;
    target.append('anim_type', String(animTypeValue));
  };

  if (hasFiles) {
    const formDataToSend = new FormData();
    formDataToSend.append('id', route.params.id);

    appendSupportedFields(formDataToSend);

    if (formData.value.iconData?.file) {
      formDataToSend.append('icon', formData.value.iconData.file);
    } else {
      const currentIconUrl = formData.value.iconData?.url || '';
      if (currentIconUrl !== originalIconUrl && typeof currentIconUrl === 'string') {
        formDataToSend.append('icon', currentIconUrl);
      }
    }

    if (formData.value.animData?.file) {
      formDataToSend.append('anim', formData.value.animData.file);
    } else {
      const currentAnimUrl = formData.value.animData?.url || '';
      if (currentAnimUrl !== originalAnimUrl && typeof currentAnimUrl === 'string') {
        formDataToSend.append('anim', currentAnimUrl);
      }
    }

    // Note: Backend update endpoint may need multipart/form-data support for files
    return formDataToSend;
  }

  const changed = {};

  const appendChangedValue = (field, value) => {
    if (value !== undefined) {
      changed[field] = value;
    }
  };

  const appendIfChanged = (field, currentValue, originalValue) => {
    if (currentValue !== originalValue) {
      appendChangedValue(field, currentValue);
    }
  };

  appendIfChanged('name', formData.value.nameEN || '', originalName || '');
  appendIfChanged('coin', formData.value.coin, originalCoin);
  appendIfChanged('type', formData.value.type, originalType);
  appendIfChanged('lvl', formData.value.lvl, originalLvl);
  appendIfChanged('vip', formData.value.vip, originalVip);
  appendIfChanged('anim_type', formData.value.anim_type, originalAnimType);

  const currentIconUrl = formData.value.iconData?.url || '';
  if (currentIconUrl !== originalIconUrl && typeof currentIconUrl === 'string') {
    changed.icon = currentIconUrl;
  }

  const currentAnimUrl = formData.value.animData?.url || '';
  if (currentAnimUrl !== originalAnimUrl && typeof currentAnimUrl === 'string') {
    changed.anim = currentAnimUrl;
  }

  return changed;
};

const loadGift = async () => {
  loading.value = true;
  loadError.value = null;
  
  try {
    const giftId = route.params.id;
    
    if (!giftId) {
      throw new Error('Gift ID is required');
    }
    
    // Workaround: Use getAll() and filter by ID
    // TODO: Replace with giftService.getById(id) when available
    // This workaround will be replaced in subsequent phase "Extend API Services with Missing CRUD Methods"
    const response = await giftService.getAll({ p: 1, limit: 1000 });
    const giftList = response.items?.list || [];
    
    const foundGift = giftList.find(g => g.id === Number(giftId));
    
    if (!foundGift) {
      throw new Error(`Gift with ID ${giftId} not found`);
    }
    
    gift.value = foundGift;
    
    // Pre-populate form data
    formData.value = {
      nameEN: foundGift.nameEN || foundGift.name || '',
      nameAR: foundGift.nameAR || '',
      descriptionEN: foundGift.descriptionEN || '',
      descriptionAR: foundGift.descriptionAR || '',
      coin: Number(foundGift.coin) || 0,
      type: Number(foundGift.type) || 0,
      lvl: Number(foundGift.lvl) || 0,
      vip: Number(foundGift.vip) || 0,
      anim_type: Number(foundGift.anim_type) || 0,
      list_order: Number(foundGift.list_order) || 100000,
      mark: Number(foundGift.mark) || 1,
      iconData: { 
        file: null, 
        url: foundGift.icon || '' 
      },
      animData: { 
        file: null, 
        url: foundGift.anim || '' 
      }
    };
    
    console.log('Gift loaded:', foundGift);
    console.log('Form data populated:', formData.value);
    
  } catch (error) {
    console.error('Failed to load gift:', error);
    loadError.value = error.message || 'Failed to load gift data';
    showMessage(loadError.value, 'error');
  } finally {
    loading.value = false;
  }
};

// Event Handlers
const handleCancel = () => {
  const hasChanges = 
    formData.value.nameEN !== (gift.value?.nameEN || gift.value?.name || '') ||
    formData.value.nameAR !== (gift.value?.nameAR || '') ||
    formData.value.descriptionEN !== (gift.value?.descriptionEN || '') ||
    formData.value.descriptionAR !== (gift.value?.descriptionAR || '') ||
    formData.value.coin !== (Number(gift.value?.coin) || 0) ||
    formData.value.type !== (Number(gift.value?.type) || 0) ||
    formData.value.lvl !== (Number(gift.value?.lvl) || 0) ||
    formData.value.vip !== (Number(gift.value?.vip) || 0) ||
    formData.value.anim_type !== (Number(gift.value?.anim_type) || 0) ||
    formData.value.list_order !== (Number(gift.value?.list_order) || 100000) ||
    formData.value.mark !== (Number(gift.value?.mark) || 1) ||
    formData.value.iconData?.file !== null ||
    formData.value.animData?.file !== null ||
    (formData.value.iconData?.url || '') !== (gift.value?.icon || '') ||
    (formData.value.animData?.url || '') !== (gift.value?.anim || '');
  
  if (hasChanges) {
    Swal.fire({
      title: 'Discard changes?',
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
    showMessage('Please fix validation errors', 'error');
    return;
  }
  
  try {
    isSubmitting.value = true;
    
    // Sanitize string inputs
    const sanitizedData = {
      nameEN: formData.value.nameEN,
      nameAR: formData.value.nameAR,
      descriptionEN: formData.value.descriptionEN,
      descriptionAR: formData.value.descriptionAR
    };
    
    const cleaned = sanitizeObject(sanitizedData, ['nameEN', 'nameAR', 'descriptionEN', 'descriptionAR']);
    Object.assign(formData.value, cleaned);
    
    // Build payload with only changed fields
    const changedFields = buildChangedFieldsPayload();
    const isFormData = changedFields instanceof FormData;

    const hasPayloadChanges = () => {
      if (!isFormData) {
        return Object.keys(changedFields).length > 0;
      }
      const keys = Array.from(changedFields.keys());
      const nonIdKeys = keys.filter((key) => key !== 'id');
      return nonIdKeys.length > 0;
    };

    if (!hasPayloadChanges()) {
      showMessage('No changes to update', 'info');
      isSubmitting.value = false;
      return;
    }

    const response = isFormData
      ? await giftService.postFormData('/edit', changedFields)
      : await giftService.update(route.params.id, changedFields);
    
    // Show success message
    showMessage('Gift updated successfully', 'success');
    
    // Navigate to list page
    setTimeout(() => {
      router.push('/store/gifts');
    }, 1000);
    
  } catch (error) {
    console.error('Failed to update gift:', error);
    showMessage(error.message || 'Failed to update gift', 'error');
  } finally {
    isSubmitting.value = false;
  }
};

const showMessage = (msg, type = 'success') => {
  Swal.fire({
    toast: true,
    position: 'top-end',
    icon: type,
    title: msg,
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true
  });
};

// Lifecycle Hooks
onMounted(() => {
  // Load gift data on mount
  loadGift();
});
</script>

<style scoped>
.gift-edit {
  /* Inherits layout-px-spacing from template */
}

.gap-2 {
  gap: 0.5rem;
}
</style>
