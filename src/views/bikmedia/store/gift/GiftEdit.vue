<template>
  <div class="layout-px-spacing gift-edit">
    <!-- Breadcrumb Navigation -->
    <teleport to="#breadcrumb">
      <ul class="navbar-nav flex-row">
        <li>
          <div class="page-header">
            <nav class="breadcrumb-one" aria-label="breadcrumb">
              <ol class="breadcrumb">
                <li class="breadcrumb-item"><a href="javascript:;" @click="router.push('/store/gifts')">{{
                  $t('bikmedia.navigation.breadcrumb.store') }}</a></li>
                <li class="breadcrumb-item"><a href="javascript:;" @click="router.push('/store/gifts')">{{
                  $t('bikmedia.navigation.breadcrumb.gifts') }}</a></li>
                <li class="breadcrumb-item active" aria-current="page"><span>{{
                  $t('bikmedia.navigation.breadcrumb.edit') }}</span></li>
              </ol>
            </nav>
          </div>
        </li>
      </ul>
    </teleport>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">{{ $t('bikmedia.messages.loadingGifts') }}</span>
      </div>
      <p class="mt-2">{{ $t('bikmedia.messages.loadingGifts') }}</p>
    </div>

    <!-- Error State -->
    <div v-else-if="loadError" class="text-center py-5">
      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-danger">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      <h5 class="mt-3">{{ $t('bikmedia.messages.errors.failedToLoad') }}</h5>
      <p class="text-muted">{{ loadError }}</p>
      <button class="btn btn-primary" @click="router.push('/store/gifts')">
        {{ $t('bikmedia.table.actions.view') }}
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
                    <h3>{{ $t('bikmedia.pages.gifts.edit.title') }}</h3>
                    <div class="d-flex align-items-end gap-2">
                      <div class="locale-selector" style="width: 200px;">
                        <label for="localeSelect" class="form-label mb-1">{{ $t('bikmedia.forms.language') }}:</label>
                        <select id="localeSelect" class="form-select" v-model="selectedLocale"
                          @change="handleLocaleChange">
                          <option v-for="locale in giftConfig.supportedLocales" :key="locale.code" :value="locale.code">
                            {{ locale.label }}
                          </option>
                        </select>
                      </div>
                      <div class="form-check form-switch ms-2">
                        <input class="form-check-input" type="checkbox" id="toggleAllLocales" v-model="showAllLocales"
                          @change="handleShowAllLocalesChange">
                        <label class="form-check-label" for="toggleAllLocales">{{ $t('bikmedia.actions.edit') }} {{
                          $t('bikmedia.forms.language') }}</label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- Fully Dynamic Form with Custom Panel Layout -->
              <DynamicFormBuilder :entityConfig="giftConfig" v-model="formData" :isSubmitted="isSubmitted"
                :errors="validationErrors" :existingData="gift" :selectedLocale="selectedLocale"
                :showAllLocales="showAllLocales" :layoutMode="'custom-panels'" mode="edit" />

              <!-- Sub Gifts Section -->
              <div class="row mt-4 sub-gifts-grid" v-if="gift && gift.id">
                <div class="col-12">
                  <div class="d-flex justify-content-between align-items-center mb-2">
                    <h5 class="mb-0">{{ $t('bikmedia.modals.subGift.title') }}</h5>
                    <button type="button" class="btn btn-sm btn-primary" @click="openSubGiftModal">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                        class="me-1">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="16"></line>
                        <line x1="8" y1="12" x2="16" y2="12"></line>
                      </svg>
                      {{ $t('bikmedia.modals.subGift.addSubGift') }}
                    </button>
                  </div>

                  <div v-if="(gift.icons && gift.icons.length)" class="row g-3">
                    <div class="col-xl-3 col-lg-4 col-md-6 col-sm-6" v-for="(sg, idx) in gift.icons" :key="idx">
                      <div class="card h-100">
                        <div style="height: 140px; overflow: hidden;">
                          <!-- <SmartIcon :src="sg.icon" alt="subgift" width="100%" height="140px" fit="cover" /> -->
                          <img :src="sg.icon" alt="subgift" width="100%" height="140px" />
                        </div>
                        <div class="card-body p-2">
                          <div class="d-flex justify-content-between align-items-center">
                            <div class="text-truncate" :title="sg.name">{{ sg.name }}</div>
                            <button type="button" class="btn btn-sm btn-outline-danger" disabled
                              title="Delete coming soon">
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>
                                <path d="M10 11v6"></path>
                                <path d="M14 11v6"></path>
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-else class="text-muted">{{ $t('bikmedia.modals.subGift.noSubGifts') }}</div>
                </div>
              </div>

              <!-- SubGift Modal Mount -->
              <SubGiftModal v-if="gift && gift.id" :giftId="gift.id" :show="showSubGiftModal"
                @close="showSubGiftModal = false" @success="handleSubGiftAdded" />
            </div>

            <!-- Action Sidebar -->
            <div class="col-xl-3 col-lg-12 action-sidebar">
              <div class="sticky-sidebar">
                <div class="invoice-actions-btn">
                  <div class="invoice-action-btn">
                    <div class="row">
                      <div class="col-xl-12 col-md-6 col-sm-6">
                        <button type="button" class="btn btn-info btn-block w-100 mb-3" @click="openSubGiftModal"
                          :disabled="!gift || !gift.id" v-if="gift && gift.id">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                            class="me-1">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="16"></line>
                            <line x1="8" y1="12" x2="16" y2="12"></line>
                          </svg>
                          {{ $t('bikmedia.modals.subGift.addSubGift') }}
                        </button>
                      </div>
                      <div class="col-xl-12 col-md-6 col-sm-6">
                        <button type="button" class="btn btn-danger btn-block w-100 mb-3" @click="handleDelete"
                          :disabled="isDeleting || !gift || !gift.id">
                          <span v-if="isDeleting" class="spinner-border spinner-border-sm me-2"></span>
                          <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                            fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                            stroke-linejoin="round" class="me-1">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>
                            <path d="M10 11v6"></path>
                            <path d="M14 11v6"></path>
                          </svg>
                          {{ isDeleting ? $t('bikmedia.messages.loading') : $t('bikmedia.actions.delete') + ' ' +
                            $t('bikmedia.store.gifts') }}
                        </button>
                      </div>
                      <div class="col-xl-12 col-md-6 col-sm-6">
                        <button type="button" class="btn btn-secondary btn-block w-100 mb-3" @click="handleCancel"
                          :disabled="isSubmitting">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                            class="me-1">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                          {{ $t('bikmedia.actions.cancel') }}
                        </button>
                      </div>
                      <div class="col-xl-12 col-md-6 col-sm-6">
                        <button type="button" class="btn btn-primary btn-block w-100 mb-3" @click="handleSubmit"
                          :disabled="isSubmitting">
                          <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
                          <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                            fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                            stroke-linejoin="round" class="me-1">
                            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                            <polyline points="17 21 17 13 7 13 7 21"></polyline>
                            <polyline points="7 3 7 8 15 8"></polyline>
                          </svg>
                          {{ isSubmitting ? $t('bikmedia.messages.loading') : $t('bikmedia.actions.update') + ' ' +
                            $t('bikmedia.store.gifts') }}
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
import { useRouter, useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useMeta } from '@/composables/use-meta';
import DynamicFormBuilder from '@/views/bikmedia/components/DynamicFormBuilder.vue';
import giftService from '@/services/api/gift.service';
import SubGiftModal from '@/views/bikmedia/components/SubGiftModal.vue';
import SmartIcon from '@/views/bikmedia/components/SmartIcon.vue';
import { giftConfig } from '@/config/entities/gift.config';
import { initializeFormData, validateEntityFields, buildDynamicPayload } from '@/config/entities/helpers.js';
import { sanitizeObject } from '@/utils/sanitize';
import { bikMediaNotifications } from '@/utils/notification-handler';
// i18n
const { t } = useI18n();

// Meta Setup
useMeta({ title: t('bikmedia.pages.gifts.edit.title') });

// Router Setup
const router = useRouter();
const route = useRoute();

// Reactive State
const initialFormData = initializeFormData(giftConfig);
// Initialize file data fields
initialFormData.iconData = { file: null, url: '' };
initialFormData.svgaData = { file: null, url: '' };
const formData = ref(initialFormData);

const gift = ref(null);
const loading = ref(true);
const loadError = ref(null);
const isSubmitted = ref(false);
const isSubmitting = ref(false);
const validationErrors = ref({});
const selectedLocale = ref('en');
const showAllLocales = ref(false);
const showSubGiftModal = ref(false);
const isDeleting = ref(false);

const validateForm = () => {
  const { valid, errors } = validateEntityFields(giftConfig, formData.value);
  validationErrors.value = errors;
  return valid;
};

// All form handling is now managed by DynamicFormBuilder

const loadGift = async (lang = null) => {
  loading.value = true;
  loadError.value = null;

  try {
    const giftId = route.params.id;

    if (!giftId) {
      throw new Error('Gift ID is required');
    }
    const locale = lang || selectedLocale.value;

    try {
      // Preferred: fetch by id with locale
      const response = await giftService.getById(giftId, locale);
      // console.log("Response in single and single transform", response)
      const one = response?.item
      if (!one) throw new Error('Invalid getById() response');
      gift.value = one;
      // initialFormData.svga = one.anim;
      // initialFormData.svgaData.url = one.anim;
      // console.log("Inital form", initialFormData);
      // console.log("Gift",one);
    } catch (e) {
      // Fallback to getAll with locale and filter
      const response = await giftService.getAll({ lang: locale, p: 1, limit: 1000 });
      const giftList = response.items?.list || [];
      const foundGift = giftList.find(g => g.id === Number(giftId));
      if (!foundGift) {
        throw new Error(`Gift with ID ${giftId} not found`);
      }
      gift.value = foundGift;
    }

    // Initialize form data for DynamicFormBuilder
    formData.value = initializeFormData(giftConfig, gift.value);

    console.log('Gift loaded:', gift.value);
    console.log('Form data populated:', formData.value);

  } catch (error) {
    console.error('Failed to load gift:', error);
    loadError.value = error.message || 'Failed to load gift data';
    showMessage(loadError.value, 'error');
  } finally {
    loading.value = false;
  }
};

const handleLocaleChange = async () => {
  const hasChanges = JSON.stringify(formData.value) !== JSON.stringify(initializeFormData(giftConfig, gift.value || {}));
  if (hasChanges && !showAllLocales.value) {
    const result = await Swal.fire({
      title: t('bikmedia.messages.confirmations.areYouSure'),
      text: 'Unsaved changes may be lost when switching language.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: t('bikmedia.actions.confirm'),
      cancelButtonText: t('bikmedia.actions.cancel')
    });
    if (!result.isConfirmed) return;
  }
  await loadGift(selectedLocale.value);
};

const handleShowAllLocalesChange = async () => {
  if (showAllLocales.value && gift?.value?.id) {
    // Ensure all locales are populated when enabling 'edit all'
    // This would be handled by the DynamicFormBuilder
    console.log('Show all locales enabled');
  }
};

const openSubGiftModal = () => {
  showSubGiftModal.value = true;
};

const handleSubGiftAdded = async () => {
  await loadGift(selectedLocale.value);
};

// Event Handlers
const handleDelete = async () => {
  if (!gift.value || !gift.value.id) {
    showMessage('No gift selected for deletion', 'error');
    return;
  }
  const result = await bikMediaNotifications.gift.confirmDelete(gift.value.name)

  if (result.isConfirmed) {
    await performDelete(gift.value.id);
  }
};

const performDelete = async (itemId) => {
  try {
    isDeleting.value = true;
    const response = await giftService.delete(itemId);

    // Check for success based on API response structure
    if (response.data?.code === 200 && response.data?.err === null && response.data?.data?.success === 1) {
      bikMediaNotifications.gift.deleted()
      // Navigate to list page
      setTimeout(() => {
        router.push('/store/gifts');
      }, 1000);
    } else if (response.data?.code === 201 && response.data?.err === 'notFound') {
      throw new Error('Gift not found');
    } else if (response.data?.err) {
      throw new Error(response.data.err);
    } else {
      throw new Error('Delete operation failed');
    }
  } catch (error) {
    // showMessage(error.message || t('bikmedia.messages.errors.failedToDelete'), 'error');
    bikMediaNotifications.gift.deleteError()
  } finally {
    isDeleting.value = false;
  }
};

const handleCancel = async () => {
  const hasChanges = JSON.stringify(formData.value) !== JSON.stringify(initializeFormData(giftConfig, gift.value || {}));




  if (hasChanges) {
    const result = await bikMediaNotifications.general.unsavedChanges()

    if (result.isConfirmed) {
      router.push('/store/gifts');
    }
   
  } else {
    router.push('/store/gifts');
  }
};

const handleSubmit = async () => {
  isSubmitted.value = true;

  if (!validateForm()) {
    showMessage(t('bikmedia.forms.validation.required'), 'error');
    return;
  }

  try {
    isSubmitting.value = true;

    // Sanitize string fields only
    const cleaned = sanitizeObject({ ...formData.value }, Object.keys(formData.value).filter(k => typeof formData.value[k] === 'string'));
    formData.value = cleaned;

    // Build payload dynamically
    const payload = buildDynamicPayload(giftConfig, formData.value, gift.value, 'update', { id: route.params.id, updateStrategy: 'all' });
    const isFormData = payload instanceof FormData;

    const hasPayloadChanges = () => {
      if (!isFormData) {
        return Object.keys(payload).length > 0;
      }
      const keys = Array.from(payload.keys());
      const nonIdKeys = keys.filter((key) => key !== 'id');
      return nonIdKeys.length > 0;
    };

    if (!hasPayloadChanges()) {
      showMessage('No changes to update', 'info');
      isSubmitting.value = false;
      return;
    }

    const response = isFormData
      ? await giftService.postFormData('/edit', payload)
      : await giftService.update(route.params.id, payload);

    // Show success message
    showMessage(t('bikmedia.messages.success.giftUpdated'), 'success');

    // Navigate to list page
    setTimeout(() => {
      router.push('/store/gifts');
    }, 1000);

  } catch (error) {
    console.error('Failed to update gift:', error);
    showMessage(error.message || t('bikmedia.messages.errors.failedToUpdate'), 'error');
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
.gap-2 {
  gap: 0.5rem;
}

/* Sticky sidebar */
.sticky-sidebar {
  position: sticky;
  top: 160px;
  /* Increased margin to avoid header overlap */
  z-index: 10;

}

/* Media upload boxes */
.media-upload-box {
  background: #f8f9fa;
  border: 2px dashed #dee2e6;
  border-radius: 8px;
  padding: 1rem;
  transition: all 0.3s ease;
  height: 100%;
}

.media-upload-box:hover {
  border-color: #007bff;
  background: #f0f8ff;
}

.media-upload-box .form-group {
  margin-bottom: 0;
}

/* Media preview styling */
.current-media-preview {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.animation-preview img {
  border: 2px solid #e9ecef;
}

.animation-placeholder {
  text-align: center;
}

/* Custom form layout improvements */
.custom-form-layout .panel {
  border: 1px solid #e0e6ed;
  border-radius: 8px;
  overflow: hidden;
}

.custom-form-layout .panel-heading {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 1.5rem;
}

.custom-form-layout .panel-heading h4 {
  color: white;
  margin: 0;
  font-weight: 600;
}

.custom-form-layout .panel-heading p {
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
  margin-top: 0.25rem;
}

.custom-form-layout .panel-body {
  padding: 1.5rem;
}

/* Form improvements */
.form-label {
  font-weight: 600;
  color: #3b3f5c;
  margin-bottom: 0.5rem;
}

.form-control,
.form-select {
  border: 1px solid #e0e6ed;
  border-radius: 6px;
  padding: 0.75rem 1rem;
  transition: all 0.3s ease;
}

.form-control:focus,
.form-select:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.form-control.is-valid,
.form-select.is-valid {
  border-color: #28a745;
}

.form-control.is-invalid,
.form-select.is-invalid {
  border-color: #dc3545;
}

/* Responsive adjustments */
@media (max-width: 1199.98px) {
  .sticky-sidebar {
    position: static;
    margin-top: 2rem;
  }
}

</style>