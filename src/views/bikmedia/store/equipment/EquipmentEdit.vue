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
            <!-- Content Panel -->
            <div class="col-xl-9 col-lg-12 content-panel">
              <!-- Locale Selector -->
              <div class="row mb-4">
                <div class="col-12">
                  <div class="d-flex justify-content-between align-items-center page-header-responsive">
                    <h3>Edit Equipment</h3>
                    <div class="d-flex align-items-end gap-2">
                      <div class="locale-selector" style="width: 200px;">
                        <label for="localeSelect" class="form-label mb-1">Language:</label>
                        <select
                          id="localeSelect"
                          class="form-select"
                          v-model="selectedLocale"
                          @change="handleLocaleChange"
                        >
                          <option v-for="locale in equipmentConfig.supportedLocales" :key="locale.code" :value="locale.code">
                            {{ locale.label }}
                          </option>
                        </select>
                      </div>
                      <div class="form-check form-switch ms-2">
                        <input class="form-check-input" type="checkbox" id="toggleAllLocales" v-model="showAllLocales" @change="handleShowAllLocalesChange">
                        <label class="form-check-label" for="toggleAllLocales">Edit all locales</label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- Fully Dynamic Form with Custom Panel Layout -->
              <DynamicFormBuilder
                :entityConfig="equipmentConfig"
                v-model="formData"
                :isSubmitted="isSubmitted"
                :errors="validationErrors"
                :existingData="equipment"
                :selectedLocale="selectedLocale"
                :showAllLocales="showAllLocales"
                :layoutMode="'custom-panels'"
                mode="edit"
              />
            </div>

            <!-- Action Sidebar -->
            <div class="col-xl-3 col-lg-12 action-sidebar">
              <div class="invoice-actions-btn sticky-sidebar">
                <div class="invoice-action-btn">
                  <div class="row">
                    <div class="col-xl-12 col-md-6 col-sm-6">
                      <button
                        type="button"
                        class="btn btn-secondary btn-block w-100 mb-3"
                        @click="handleCancel"
                        :disabled="isSubmitting"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x me-2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        Cancel
                      </button>
                    </div>
                    <div class="col-xl-12 col-md-6 col-sm-6">
                      <button
                        type="button"
                        class="btn btn-primary btn-block w-100 mb-3"
                        @click="handleSubmit"
                        :disabled="isSubmitting"
                      >
                        <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
                        <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-save me-2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useMeta } from '@/composables/use-meta';
import DynamicFormBuilder from '@/views/bikmedia/components/DynamicFormBuilder.vue';
import equipmentService from '@/services/api/equipment.service';
import { equipmentConfig } from '@/config/entities/equipment.config';
import { initializeFormData, validateEntityFields, buildDynamicPayload } from '@/config/entities/helpers.js';
import { sanitizeObject } from '@/utils/sanitize';
import Swal from 'sweetalert2';

// Meta
useMeta({ title: 'Edit Equipment' });

// Router
const router = useRouter();
const route = useRoute();

// Reactive State
const formData = ref(initializeFormData(equipmentConfig));

const equipment = ref(null);
const loading = ref(true);
const loadError = ref(null);
const isSubmitted = ref(false);
const isSubmitting = ref(false);
const validationErrors = ref({});
const selectedLocale = ref('en');
const showAllLocales = ref(false);
const syncingTranslations = ref(false);

// All form handling is now managed by DynamicFormBuilder

const validateForm = () => {
  const { valid, errors } = validateEntityFields(equipmentConfig, formData.value);
  validationErrors.value = errors;
  return valid;
};

// Prefetch other locales in background and populate suffixed buffers
const backgroundPrefetchOtherLocales = async (activeLocale, equipmentId) => {
  const others = (equipmentConfig.supportedLocales || []).map(l => l.code).filter(code => code !== activeLocale);
  if (others.length === 0) return;
  syncingTranslations.value = true;
  try {
    for (const locale of others) {
      try {
        const resp = await equipmentService.getById(equipmentId, locale);
        const item = resp?.item?.list?.find(e => e.id === Number(equipmentId)) || resp?.data?.one || null;
        if (item && typeof item.name === 'string') {
          const key = `name${locale.toUpperCase()}`;
          if (!formData.value[key]) formData.value[key] = item.name;
        }
      } catch (e) {
        // ignore individual locale failures
        console.warn('Prefetch locale failed:', locale, e?.message);
      }
    }
  } finally {
    syncingTranslations.value = false;
  }
};

const loadEquipment = async (lang = null) => {
  loading.value = true;
  loadError.value = null;
  
  try {
    const equipmentId = route.params.id;
    
    if (!equipmentId) {
      throw new Error('Equipment ID is required');
    }
    const locale = lang || selectedLocale.value;

    let foundEquipment = null;
    try {
      // Preferred: fetch by id with locale
      const response = await equipmentService.getById(equipmentId, locale);
      foundEquipment = response?.item?.list?.find(e => e.id === Number(equipmentId)) || response?.data?.one || null;
      if (!foundEquipment) throw new Error('Invalid getById() response');
    } catch (e) {
      // Fallback to getAll with locale and filter
      const response = await equipmentService.getAll({ lang: locale });
      const equipmentList = response.items?.list || [];
      foundEquipment = equipmentList.find(e => e.id === Number(equipmentId));
      if (!foundEquipment) {
        throw new Error(`Equipment with ID ${equipmentId} not found`);
      }
    }

    equipment.value = foundEquipment;

    // Initialize form with existing data to populate non-translatables
    const prevModel = formData.value;
    formData.value = initializeFormData(equipmentConfig, foundEquipment);

    // Map unsuffixed localized fields from response into active locale buffers
    const suffix = selectedLocale.value.toUpperCase();
    if (typeof foundEquipment.name === 'string') {
      const key = `name${suffix}`;
      formData.value[key] = foundEquipment.name;
    }

    // Preserve other locale buffers if previously edited
    if (prevModel) {
      equipmentConfig.translatableFields.forEach(field => {
        const fname = typeof field === 'string' ? field : field.name;
        if (!fname) return;
        equipmentConfig.supportedLocales.forEach(loc => {
          const k = `${fname}${loc.code.toUpperCase()}`;
          if (loc.code !== selectedLocale.value && prevModel[k] && !formData.value[k]) {
            formData.value[k] = prevModel[k];
          }
        });
      });
    }

    console.log('Equipment loaded:', foundEquipment);
    console.log('Form data populated:', formData.value);
    
    // Background prefetch for other locales to populate hidden buffers
    backgroundPrefetchOtherLocales(selectedLocale.value, equipmentId);
  
  } catch (error) {
    console.error('Failed to load equipment:', error);
    loadError.value = error.message || 'Failed to load equipment data';
    showMessage(loadError.value, 'error');
  } finally {
    loading.value = false;
  }
};

const handleLocaleChange = async () => {
  const hasChanges = JSON.stringify(formData.value) !== JSON.stringify(initializeFormData(equipmentConfig, equipment.value || {}));
  if (hasChanges && !showAllLocales.value) {
    const result = await Swal.fire({
      title: 'Switch language?',
      text: 'Unsaved changes may be lost when switching language.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Switch',
      cancelButtonText: 'Stay'
    });
    if (!result.isConfirmed) return;
  }
  await loadEquipment(selectedLocale.value);
};

const handleShowAllLocalesChange = async () => {
  if (showAllLocales.value && equipment?.value?.id) {
    // Ensure all locales are populated when enabling 'edit all'
    await backgroundPrefetchOtherLocales(selectedLocale.value, equipment.value.id);
  }
};

// Event Handlers
const handleCancel = () => {
  const hasChanges = JSON.stringify(formData.value) !== JSON.stringify(initializeFormData(equipmentConfig, equipment.value || {}));

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
      nameAR: formData.value.nameAR
    };

    const cleaned = sanitizeObject(sanitizedData, ['nameEN']);

    Object.assign(formData.value, cleaned);

    // Build payload dynamically
    const payload = buildDynamicPayload(equipmentConfig, formData.value, equipment.value, 'update', { id: route.params.id, updateStrategy: 'all' });
    const isFormData = payload instanceof FormData;

    // Check if there are any changes
    if (
      (!isFormData && Object.keys(payload).length === 0) ||
      (isFormData && Array.from(payload.keys()).filter((key) => key !== 'id').length === 0)
    ) {
      showMessage('No changes to update', 'info');
      isSubmitting.value = false;
      return;
    }

    const response = isFormData
      ? await equipmentService.postFormData('/edit', payload)
      : await equipmentService.update(route.params.id, payload);

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

// All file handling is now managed by DynamicFormBuilder

// Lifecycle Hooks
onMounted(() => {
  // Load equipment data on mount
  loadEquipment();
});
</script>

<style scoped>
.gap-2 {
  gap: 0.5rem;
}

@media (min-width: 1200px) {
  .sticky-sidebar {
    position: sticky;
    top: 100px;
    z-index: 10;
  }
}

/* Media upload box styling */
.media-upload-box {
  padding: 1.5rem;
  border: 2px dashed #e0e6ed;
  border-radius: 12px;
  background-color: #f8f9fa;
  transition: all 0.3s ease;
  height: 100%;
}

.media-upload-box:hover {
  border-color: #bbb6d0;
  background-color: #f1f2f3;
}

.current-media-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}

.animation-preview img,
.current-media-preview img {
  border: 2px solid #e0e6ed;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.animation-placeholder {
  text-align: center;
}

/* Custom file input styling */
.custom-file {
  position: relative;
  display: inline-block;
  width: 100%;
  height: calc(1.5em + 0.75rem + 2px);
  margin-bottom: 0;
}

.custom-file-input {
  position: relative;
  z-index: 2;
  width: 100%;
  height: calc(1.5em + 0.75rem + 2px);
  margin: 0;
  opacity: 0;
}

.custom-file-label {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  z-index: 1;
  height: calc(1.5em + 0.75rem + 2px);
  padding: 0.375rem 0.75rem;
  font-weight: 400;
  line-height: 1.5;
  color: #495057;
  background-color: #fff;
  border: 1px solid #ced4da;
  border-radius: 0.375rem;
  cursor: pointer;
}

.custom-file-label::after {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 3;
  display: block;
  height: calc(1.5em + 0.75rem);
  padding: 0.375rem 0.75rem;
  line-height: 1.5;
  color: #495057;
  content: attr(data-browse);
  background-color: #e9ecef;
  border-left: inherit;
  border-radius: 0 0.375rem 0.375rem 0;
}

.form-file-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
n