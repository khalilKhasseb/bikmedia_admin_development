<template>
  <div class="layout-px-spacing equipment-edit">
    <!-- Breadcrumb -->
    <teleport to="#breadcrumb">
      <ul class="navbar-nav flex-row">
        <li>
          <div class="page-header">
            <nav class="breadcrumb-one" aria-label="breadcrumb">
              <ol class="breadcrumb">
                <li class="breadcrumb-item"><a href="javascript:;" @click="router.push('/')">Home</a></li>
                <li class="breadcrumb-item"><a href="javascript:;" @click="router.push('/store/equipments')">Store</a></li>
                <li class="breadcrumb-item"><a href="javascript:;" @click="router.push('/store/equipments')">Equipments</a></li>
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
        <span class="visually-hidden">Loading equipment...</span>
      </div>
      <p class="mt-2">Loading equipment data...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="loadError" class="text-center py-5">
      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-danger">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      <h5 class="mt-3">Failed to load equipment</h5>
      <p class="text-muted">{{ loadError }}</p>
      <button class="btn btn-primary" @click="router.push('/store/equipments')">
        Back to List
      </button>
    </div>

    <!-- Form Sections -->
    <div v-else class="row layout-top-spacing layout-spacing">
      <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
        <div class="doc-container">
          <div class="row">
            <div class="col-xl-9">

              <!-- Section 1: Basic Info -->
              <FormSection title="Basic Information" description="Equipment name in multiple languages">
                <TranslationInput
                  fieldName="name"
                  :fieldConfig="getFieldConfig('name')"
                  :locales="equipmentConfig.supportedLocales"
                  v-model="formData"
                  :isSubmitted="isSubmitted"
                  :errors="validationErrors"
                />
              </FormSection>

              <!-- Section 2: Details -->
              <FormSection title="Details" description="Equipment description in multiple languages">
                <TranslationInput
                  fieldName="description"
                  :fieldConfig="getFieldConfig('description')"
                  :locales="equipmentConfig.supportedLocales"
                  v-model="formData"
                  :isSubmitted="isSubmitted"
                  :errors="validationErrors"
                />
              </FormSection>

              <!-- Section 3: Settings -->
              <FormSection title="Settings" description="Equipment configuration and requirements">
                <div class="row">
                  <!-- Coin -->
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

                  <!-- Days -->
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
                  <!-- Type -->
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
                        <option v-for="option in (getFieldConfig('type')?.options || equipmentConfig.nonTranslatableFields.find(f => f.name === 'type')?.options || [])" :key="option.value" :value="option.value">
                          {{ option.label }}
                        </option>
                      </select>
                      <div class="invalid-feedback">{{ validationErrors.type || 'Please select a type' }}</div>
                    </div>
                  </div>

                  <!-- Level -->
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
                  <!-- VIP -->
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

              <!-- Section 4: Media -->
              <FormSection title="Media" description="Upload icon and animation files for the equipment">
                <div class="row">
                  <!-- Icon -->
                  <div class="col-md-6">
                    <FileUploadInput
                      fieldName="icon"
                      :label="getFieldConfig('icon')?.label || 'Equipment Icon'"
                      v-model="formData.iconData"
                      :accept="getFieldConfig('icon')?.accept || 'image/*'"
                      :maxSize="(getFieldConfig('icon')?.maxSize || 5) * 1024 * 1024"
                      :required="getFieldConfig('icon')?.required || false"
                      :showUrlInput="getFieldConfig('icon')?.supportsUrlFallback || true"
                      :existingUrl="equipment?.icon || ''"
                      :isSubmitted="isSubmitted"
                      :errors="validationErrors"
                    />
                  </div>

                  <!-- Animation -->
                  <div class="col-md-6">
                    <FileUploadInput
                      fieldName="anim"
                      :label="getFieldConfig('anim')?.label || 'Equipment Animation'"
                      v-model="formData.animData"
                      :accept="getFieldConfig('anim')?.accept || '.svga,.webp,.gif'"
                      :maxSize="(getFieldConfig('anim')?.maxSize || 10) * 1024 * 1024"
                      :required="getFieldConfig('anim')?.required || false"
                      :showUrlInput="getFieldConfig('anim')?.supportsUrlFallback || true"
                      :existingUrl="equipment?.anim || ''"
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
                      {{ isSubmitting ? 'Updating...' : 'Update Equipment' }}
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
import equipmentService from '@/services/api/equipment.service';
import { equipmentConfig } from '@/config/entities/equipment.config';
import { sanitizeObject } from '@/utils/sanitize';
import Swal from 'sweetalert2';

// Meta
useMeta({ title: 'Edit Equipment' });

// Router
const router = useRouter();
const route = useRoute();

// Reactive State
const formData = ref({
  nameEN: '',
  nameAR: '',
  descriptionEN: '',
  descriptionAR: '',
  coin: 0,
  days: 0,
  type: 1,
  lvl: 0,
  vip: 0,
  iconData: { file: null, url: '' },
  animData: { file: null, url: '' }
});

const equipment = ref(null);
const loading = ref(true);
const loadError = ref(null);
const isSubmitted = ref(false);
const isSubmitting = ref(false);
const validationErrors = ref({});

// Helper Methods
const getFieldConfig = (fieldName) => {
  // Check translatable fields first
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

  const hasError = validationErrors.value[fieldName];
  if (hasError) return 'is-invalid';

  const fieldConfig = getFieldConfig(fieldName);
  if (fieldConfig?.required) {
    const value = formData.value[fieldName];
    return value ? 'is-valid' : '';
  }

  return '';
};

const validateForm = () => {
  const errors = {};

  // Validate non-translatable required fields
  equipmentConfig.nonTranslatableFields.forEach(field => {
    if (field.required) {
      const value = formData.value[field.name];
      if (value === null || value === undefined || value === '') {
        errors[field.name] = `${field.label} is required`;
      }
    }
  });

  // Validate translatable fields (at least one locale should be filled for required fields)
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
          errors[suffixedName] = `${field.name} is required in at least one language`;
        });
      }
    }
  });

  validationErrors.value = errors;
  return Object.keys(errors).length === 0;
};

const buildChangedFieldsPayload = () => {
  const hasFiles = Boolean(formData.value.iconData?.file || formData.value.animData?.file);

  const originalNameEN = equipment.value?.nameEN || equipment.value?.name || '';
  const originalNameAR = equipment.value?.nameAR || '';
  const originalDescriptionEN = equipment.value?.descriptionEN || '';
  const originalDescriptionAR = equipment.value?.descriptionAR || '';
  const originalCoin = Number(equipment.value?.coin) || 0;
  const originalDays = Number(equipment.value?.days) || 0;
  const originalType = Number(equipment.value?.type) || 1;
  const originalLvl = Number(equipment.value?.lvl) || 0;
  const originalVip = Number(equipment.value?.vip) || 0;
  const originalIconUrl = equipment.value?.icon || '';
  const originalAnimUrl = equipment.value?.anim || '';

  if (hasFiles) {
    const formDataToSend = new FormData();
    formDataToSend.append('id', route.params.id);

    formDataToSend.append('nameEN', formData.value.nameEN || originalNameEN || '');
    formDataToSend.append('nameAR', formData.value.nameAR || originalNameAR || '');
    formDataToSend.append('descriptionEN', formData.value.descriptionEN || originalDescriptionEN || '');
    formDataToSend.append('descriptionAR', formData.value.descriptionAR || originalDescriptionAR || '');
    formDataToSend.append('coin', String(formData.value.coin ?? originalCoin));
    formDataToSend.append('days', String(formData.value.days ?? originalDays));
    formDataToSend.append('type', String(formData.value.type ?? originalType));
    formDataToSend.append('lvl', String(formData.value.lvl ?? originalLvl));
    formDataToSend.append('vip', String(formData.value.vip ?? originalVip));

    if (formData.value.iconData?.file) {
      formDataToSend.append('icon', formData.value.iconData.file);
    } else {
      const currentIconUrl = formData.value.iconData?.url || '';
      if (currentIconUrl || originalIconUrl) {
        formDataToSend.append('icon', currentIconUrl || originalIconUrl || '');
      }
    }

    if (formData.value.animData?.file) {
      formDataToSend.append('anim', formData.value.animData.file);
    } else {
      const currentAnimUrl = formData.value.animData?.url || '';
      if (currentAnimUrl || originalAnimUrl) {
        formDataToSend.append('anim', currentAnimUrl || originalAnimUrl || '');
      }
    }

    return formDataToSend;
  }

  const changed = {};

  if (formData.value.nameEN !== originalNameEN) {
    changed.nameEN = formData.value.nameEN || '';
  }
  if (formData.value.nameAR !== originalNameAR) {
    changed.nameAR = formData.value.nameAR || '';
  }
  if (formData.value.descriptionEN !== originalDescriptionEN) {
    changed.descriptionEN = formData.value.descriptionEN || '';
  }
  if (formData.value.descriptionAR !== originalDescriptionAR) {
    changed.descriptionAR = formData.value.descriptionAR || '';
  }

  if (formData.value.coin !== originalCoin) {
    changed.coin = formData.value.coin;
  }
  if (formData.value.days !== originalDays) {
    changed.days = formData.value.days;
  }
  if (formData.value.type !== originalType) {
    changed.type = formData.value.type;
  }
  if (formData.value.lvl !== originalLvl) {
    changed.lvl = formData.value.lvl;
  }
  if (formData.value.vip !== originalVip) {
    changed.vip = formData.value.vip;
  }

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

const loadEquipment = async () => {
  loading.value = true;
  loadError.value = null;
  
  try {
    const equipmentId = route.params.id;
    
    if (!equipmentId) {
      throw new Error('Equipment ID is required');
    }
    
    // Workaround: Use getAll() and filter by ID
    // TODO: Replace with equipmentService.getById(id) when available
    // This workaround will be replaced in subsequent phase "Extend API Services with Missing CRUD Methods"
    const response = await equipmentService.getAll();
    const equipmentList = response.items?.list || [];
    
    const foundEquipment = equipmentList.find(e => e.id === Number(equipmentId));
    
    if (!foundEquipment) {
      throw new Error(`Equipment with ID ${equipmentId} not found`);
    }
    
    equipment.value = foundEquipment;
    
    // Pre-populate form data
    formData.value = {
      nameEN: foundEquipment.nameEN || foundEquipment.name || '',
      nameAR: foundEquipment.nameAR || '',
      descriptionEN: foundEquipment.descriptionEN || '',
      descriptionAR: foundEquipment.descriptionAR || '',
      coin: Number(foundEquipment.coin) || 0,
      days: Number(foundEquipment.days) || 0,
      type: Number(foundEquipment.type) || 1,
      lvl: Number(foundEquipment.lvl) || 0,
      vip: Number(foundEquipment.vip) || 0,
      iconData: { 
        file: null, 
        url: foundEquipment.icon || '' 
      },
      animData: { 
        file: null, 
        url: foundEquipment.anim || '' 
      }
    };
    
    console.log('Equipment loaded:', foundEquipment);
    console.log('Form data populated:', formData.value);
    
  } catch (error) {
    console.error('Failed to load equipment:', error);
    loadError.value = error.message || 'Failed to load equipment data';
    showMessage(loadError.value, 'error');
  } finally {
    loading.value = false;
  }
};

// Event Handlers
const handleCancel = () => {
  const hasChanges = 
    formData.value.nameEN !== (equipment.value?.nameEN || equipment.value?.name || '') ||
    formData.value.nameAR !== (equipment.value?.nameAR || '') ||
    formData.value.descriptionEN !== (equipment.value?.descriptionEN || '') ||
    formData.value.descriptionAR !== (equipment.value?.descriptionAR || '') ||
    formData.value.coin !== (Number(equipment.value?.coin) || 0) ||
    formData.value.days !== (Number(equipment.value?.days) || 0) ||
    formData.value.type !== (Number(equipment.value?.type) || 1) ||
    formData.value.lvl !== (Number(equipment.value?.lvl) || 0) ||
    formData.value.vip !== (Number(equipment.value?.vip) || 0) ||
    formData.value.iconData?.file !== null ||
    formData.value.animData?.file !== null;

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
        router.push('/store/equipments');
      }
    });
  } else {
    router.push('/store/equipments');
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

    // Check if there are any changes
    if (
      (!isFormData && Object.keys(changedFields).length === 0) ||
      (isFormData && Array.from(changedFields.keys()).filter((key) => key !== 'id').length === 0)
    ) {
      showMessage('No changes to update', 'info');
      isSubmitting.value = false;
      return;
    }

    const response = isFormData
      ? await equipmentService.postFormData('/edit', changedFields)
      : await equipmentService.update(route.params.id, changedFields);

    // Show success message
    showMessage('Equipment updated successfully', 'success');

    // Navigate to list page
    setTimeout(() => {
      router.push('/store/equipments');
    }, 1000);

  } catch (error) {
    console.error('Failed to update equipment:', error);
    showMessage(error.message || 'Failed to update equipment', 'error');
  } finally {
    isSubmitting.value = false;
  }
};

const showMessage = (msg, type = 'success') => {
  const toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true
  });
  
  toast.fire({
    icon: type,
    title: msg
  });
};

// Lifecycle Hooks
onMounted(() => {
  // Load equipment data on mount
  loadEquipment();
});
</script>

<style scoped>
.bnequipment-edit {
  /* Inherits layout-px-spacing from template */
}

.gap-2 {
  gap: 0.5rem;
}
</style>
