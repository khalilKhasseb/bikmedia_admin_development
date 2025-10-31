<template>
  <div class="layout-px-spacing equipment-create">
    <!-- Breadcrumb Navigation -->
    <teleport to="#breadcrumb">
      <ul class="navbar-nav flex-row">
        <li>
          <div class="page-header">
            <nav class="breadcrumb-one" aria-label="breadcrumb">
              <ol class="breadcrumb">
                <li class="breadcrumb-item"><a href="javascript:;" @click="router.push('/store/equipments')">{{ $t('bikmedia.navigation.breadcrumb.store') }}</a></li>
                <li class="breadcrumb-item"><a href="javascript:;" @click="router.push('/store/equipments')">{{ $t('bikmedia.navigation.breadcrumb.equipment') }}</a></li>
                <li class="breadcrumb-item active" aria-current="page"><span>{{ $t('bikmedia.navigation.breadcrumb.create') }}</span></li>
              </ol>
            </nav>
          </div>
        </li>
      </ul>
    </teleport>

    <!-- Main Layout with Two-Panel Design -->
    <div class="row layout-top-spacing layout-spacing">
      <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
        <div class="doc-container">
          <div class="row two-panel-layout">
            <!-- Content Panel -->
            <div class="col-xl-9 col-lg-12 content-panel">
              <!-- Page Header -->
              <div class="row mb-4">
                <div class="col-12">
                  <div class="d-flex justify-content-between align-items-center page-header-responsive">
                    <h3>{{ $t('bikmedia.pages.equipment.create.title') }}</h3>
                  </div>
                </div>
              </div>

              <!-- Dynamic Form with Custom Panel Layout -->
              <DynamicFormBuilder
                :entityConfig="equipmentConfig"
                v-model="formData"
                :isSubmitted="isSubmitted"
                :errors="validationErrors"
                :existingData="null"
                :layoutMode="'custom-panels'"
                mode="create"
              />
            </div>

            <!-- Action Sidebar -->
            <div class="col-xl-3 col-lg-12 action-sidebar">
              <div class="sticky-sidebar">
                <div class="invoice-actions-btn">
                  <div class="invoice-action-btn">
                    <div class="row">
                      <div class="col-xl-12 col-md-6 col-sm-6">
                        <button
                          type="button"
                          class="btn btn-secondary btn-block w-100 mb-3"
                          @click="handleCancel"
                          :disabled="isSubmitting"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="me-1">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                          {{ $t('bikmedia.actions.cancel') }}
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
                          <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="me-1">
                            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                            <polyline points="17 21 17 13 7 13 7 21"></polyline>
                            <polyline points="7 3 7 8 15 8"></polyline>
                          </svg>
                          {{ isSubmitting ? $t('bikmedia.messages.loading') : $t('bikmedia.actions.create') + ' ' + $t('bikmedia.store.equipment') }}
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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import equipmentConfig from '@/config/entities/equipment.config.js';
import equipmentService from '@/services/api/equipment.service.js';
import DynamicFormBuilder from '@/views/bikmedia/components/DynamicFormBuilder.vue';
import { initializeFormData, validateEntityFields, buildDynamicPayload } from '@/config/entities/helpers.js';
import { useMeta } from '@/composables/use-meta';
import { sanitizeObject } from '@/utils/sanitize.js';

// i18n
const { t } = useI18n();

// Meta Setup
useMeta({ title: t('bikmedia.pages.equipment.create.title') });

// Router Setup
const router = useRouter();

// Reactive State
const formData = ref(initializeFormData(equipmentConfig));
const initialSnapshot = JSON.parse(JSON.stringify(formData.value));

const isSubmitted = ref(false);
const isSubmitting = ref(false);
const validationErrors = ref({});

const validateForm = () => {
  const { valid, errors } = validateEntityFields(equipmentConfig, formData.value);
  validationErrors.value = errors;
  return valid;
};

// Event Handlers
const handleCancel = () => {
  // Optional: Show confirmation if form has changes
  const hasChanges = JSON.stringify(formData.value) !== JSON.stringify(initialSnapshot);
  
  if (hasChanges) {
    window.Swal.fire({
      title: t('bikmedia.messages.confirmations.areYouSure'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: t('bikmedia.actions.confirm'),
      cancelButtonText: t('bikmedia.actions.cancel')
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
    showMessage(t('bikmedia.forms.validation.required'), 'error');
    return;
  }
  
  try {
    isSubmitting.value = true;
    
    // Sanitize string inputs to prevent XSS
    const sanitizedData = {
      nameEN: formData.value.nameEN,
      nameAR: formData.value.nameAR
    };
    
    // Apply sanitization (only to string fields)
    const cleaned = sanitizeObject(sanitizedData, ['nameEN', 'nameAR']);
    
    // Update formData with sanitized values
    Object.assign(formData.value, cleaned);
    
    // Build payload dynamically
    const formDataToSend = buildDynamicPayload(equipmentConfig, formData.value, null, 'create');
    
    // Call service method
    const response = await equipmentService.create(formDataToSend);
    
    // Show success message
    showMessage(t('bikmedia.messages.success.equipmentCreated'), 'success');
    
    // Navigate to list page after short delay
    setTimeout(() => {
      router.push('/store/equipments');
    }, 1000);
    
  } catch (error) {
    console.error('Failed to create equipment:', error);
    showMessage(error.message || t('bikmedia.messages.errors.failedToCreate'), 'error');
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
/* Responsive adjustments */
@media (min-width: 1200px) {
  .sticky-sidebar {
    position: sticky;
    top: 100px;
    z-index: 10;
  }
}
</style>
