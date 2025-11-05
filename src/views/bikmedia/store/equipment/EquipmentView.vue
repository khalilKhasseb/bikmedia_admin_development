<template>
  <div class="layout-px-spacing equipment-view">
    <!-- Breadcrumb -->
    <teleport to="#breadcrumb">
      <ul class="navbar-nav flex-row">
        <li>
          <div class="page-header">
            <nav class="breadcrumb-one" aria-label="breadcrumb">
              <ol class="breadcrumb">
                <li class="breadcrumb-item"><a href="javascript:;" @click="router.push('/store/equipments')">{{ $t('bikmedia.navigation.breadcrumb.store') }}</a></li>
                <li class="breadcrumb-item"><a href="javascript:;" @click="router.push('/store/equipments')">{{ $t('bikmedia.navigation.breadcrumb.equipment') }}</a></li>
                <li class="breadcrumb-item active" aria-current="page"><span>{{ $t('bikmedia.navigation.breadcrumb.view') }}</span></li>
              </ol>
            </nav>
          </div>
        </li>
      </ul>
    </teleport>

    <!-- Main Content -->
    <div class="row invoice layout-top-spacing layout-spacing">
      <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
        <div class="doc-container">
          <div class="row">
            <!-- Loading State -->
            <div v-if="loading" class="text-center py-5">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">{{ $t('bikmedia.messages.loadingEquipment') }}</span>
              </div>
              <p class="mt-2">{{ $t('bikmedia.messages.loadingEquipment') }}</p>
            </div>

            <!-- Error State -->
            <div v-else-if="loadError" class="text-center py-5">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-alert-circle text-danger">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <h5 class="mt-3">{{ $t('bikmedia.messages.errors.notFound') }}</h5>
              <p class="text-muted">{{ loadError }}</p>
              <button class="btn btn-primary" @click="router.push('/store/equipments')">
                {{ $t('bikmedia.table.actions.view') }}
              </button>
            </div>

            <!-- Content Area -->
            <template v-else>
              <div class="col-xl-9 content-panel">
                <!-- Locale Selector -->
                <div class="row mb-4">
                  <div class="col-12">
                    <div class="d-flex justify-content-between align-items-center page-header-responsive">
                      <h3>{{ $t('bikmedia.pages.equipment.view.title') }}</h3>
                      <div class="locale-selector" style="width: 200px;">
                        <label for="localeSelect" class="form-label mb-1">{{ $t('bikmedia.forms.language') }}:</label>
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
                    </div>
                  </div>
                </div>

                <!-- Section 1: Basic Information -->
                <FormSection
                  :title="$t('bikmedia.forms.name')"
                  :description="$t('bikmedia.pages.equipment.view.subtitle')"
                >
                  <div class="row">
                    <div class="col-12">
                      <div class="mb-3">
                        <label class="form-label text-muted">
                          {{ $t('bikmedia.forms.name') }}
                          <span v-if="showNameFallback" class="badge bg-light text-muted ms-2" style="font-weight: normal;">Using default locale</span>
                        </label>
                        <div class="d-flex align-items-center">
                          <SmartIcon
                            v-if="equipment?.icon"
                            :src="equipment.icon"
                            alt="Equipment Icon"
                            width="48px"
                            height="48px"
                            class="me-3"
                            style="border-radius: 8px; border: 1px solid #e0e6ed;"
                          />
                          <p class="form-control-plaintext mb-0" :dir="isRTL ? 'rtl' : 'ltr'">
                            {{ displayName || (isRTL ? '(غير متوفر)' : '(Not available)') }}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </FormSection>

                <!-- Section 2: Description -->
                <!-- <FormSection
                  title="Description"
                  description="Detailed description"
                >
                  <div class="row">
                    <div class="col-12">
                      <div class="mb-3">
                        <label class="form-label text-muted">
                          Description
                          <span v-if="showDescriptionFallback" class="badge bg-light text-muted ms-2" style="font-weight: normal;">Using default locale</span>
                        </label>
                        <p class="form-control-plaintext" :dir="isRTL ? 'rtl' : 'ltr'">
                          {{ displayDescription || (isRTL ? '(غير متوفر)' : '(Not available)') }}
                        </p>
                      </div>
                    </div>
                  </div>
                </FormSection> -->

                <!-- Section 3: Settings -->
                <FormSection
                  :title="$t('bikmedia.forms.status')"
                  description="Equipment properties and requirements"
                >
                  <div class="row">
                    <div class="col-md-4">
                      <div class="mb-3">
                        <label class="form-label text-muted">{{ $t('bikmedia.forms.coins') }}</label>
                        <p class="form-control-plaintext">{{ formatNumber(equipment?.coin) }}</p>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="mb-3">
                        <label class="form-label text-muted">{{ $t('bikmedia.forms.days') }}</label>
                        <p class="form-control-plaintext">{{ equipment?.days || 0 }}</p>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="mb-3">
                        <label class="form-label text-muted">{{ $t('bikmedia.forms.type') }}</label>
                        <p class="form-control-plaintext">
                          <span class="badge" :class="getTypeBadgeClass(equipment?.type)">
                            {{ getTypeLabel(equipment?.type) }}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md-4">
                      <div class="mb-3">
                        <label class="form-label text-muted">{{ $t('bikmedia.forms.level') }}</label>
                        <p class="form-control-plaintext">{{ equipment?.lvl || 0 }}</p>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="mb-3">
                        <label class="form-label text-muted">VIP</label>
                        <p class="form-control-plaintext">{{ equipment?.vip || 0 }}</p>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="mb-3">
                        <label class="form-label text-muted">Animation Type</label>
                        <p class="form-control-plaintext">{{ equipment?.anim_type || 0 }}</p>
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md-4">
                      <div class="mb-3">
                        <label class="form-label text-muted">Equipment ID</label>
                        <p class="form-control-plaintext">#{{ equipment?.id }}</p>
                      </div>
                    </div>
                  </div>
                </FormSection>

                <!-- Section 4: Media -->
                <FormSection
                  title="Media"
                  description="Icon and animation files"
                  class="media-section"
                >
                  <div class="row">
                    <div class="col-md-6">
                      <div class="mb-3">
                        <label class="form-label text-muted">{{ $t('bikmedia.forms.icon') }}</label>
                        <div v-if="equipment?.icon" class="file-preview">
                          <img
                            :src="equipment.icon"
                            alt="Equipment Icon"
                            class="preview-image"
                            @error="handleImageError"
                          />
                          <p class="text-muted small mt-2">{{ equipment.icon }}</p>
                        </div>
                        <p v-else class="form-control-plaintext text-muted">{{ $t('bikmedia.components.subGiftCard.imageNotAvailable') }}</p>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="mb-3">
                        <label class="form-label text-muted">Animation</label>
                        <div v-if="equipmentHasAnimation" class="file-preview">
                          <template v-if="equipmentAnimationIsImage">
                            <img
                              :src="equipmentAnimationUrl"
                              alt="Equipment Animation"
                              class="preview-image"
                              @error="handleImageError"
                            />
                          </template>
                          <template v-else>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="48"
                              height="48"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              class="feather feather-file"
                            >
                              <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
                              <polyline points="13 2 13 9 20 9" />
                            </svg>
                            <div class="mt-2">{{ equipmentAnimationFileName }}</div>
                          </template>
                          <p class="text-muted small mt-2">
                            <a
                              :href="equipmentAnimationUrl"
                              target="_blank"
                              rel="noopener"
                              class="text-decoration-underline"
                            >
                              {{ equipmentAnimationUrl }}
                            </a>
                          </p>
                        </div>
                        <p v-else class="form-control-plaintext text-muted">{{ $t('bikmedia.components.subGiftCard.imageNotAvailable') }}</p>
                      </div>
                    </div>
                  </div>
                </FormSection>
              </div>

              <!-- Action Buttons Sidebar -->
              <div class="col-xl-3 action-sidebar">
                <div class="invoice-actions-btn">
                  <div class="invoice-action-btn">
                    <div class="row">
                      <!-- Copy Link Button -->
                      <div class="col-xl-12 col-md-4 col-sm-6">
                        <button
                          class="btn btn-primary btn-block w-100 mb-3"
                          @click="handleCopyLink"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-copy me-2">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                          </svg>
                          {{ $t('bikmedia.actions.copy') }}
                        </button>
                      </div>

                      <!-- Edit Button -->
                      <div class="col-xl-12 col-md-4 col-sm-6">
                        <button
                          class="btn btn-dark btn-block w-100 mb-3"
                          @click="handleEdit"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit-2 me-2">
                            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                          </svg>
                          {{ $t('bikmedia.actions.edit') + ' ' + $t('bikmedia.store.equipment') }}
                        </button>
                      </div>

                      <!-- Delete Button -->
                      <div class="col-xl-12 col-md-4 col-sm-6">
                        <button 
                          class="btn btn-danger btn-block w-100 mb-3" 
                          @click="handleDelete"
                          :disabled="isDeleting"
                        >
                          <div v-if="isDeleting" class="spinner-border spinner-border-sm me-2" role="status">
                            <span class="visually-hidden">Deleting...</span>
                          </div>
                          <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                            class="feather feather-trash-2 me-2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>
                          </svg>
                          {{ isDeleting ? $t('bikmedia.messages.loading') : $t('bikmedia.actions.delete') + ' ' + $t('bikmedia.store.equipment') }}
                        </button>
                      </div>

                      <!-- Back to List Button -->
                      <div class="col-xl-12 col-md-4 col-sm-6">
                        <button
                          class="btn btn-secondary btn-block w-100 mb-3"
                          @click="router.push('/store/equipments')"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-left me-2">
                            <line x1="19" y1="12" x2="5" y2="12"></line>
                            <polyline points="12 19 5 12 12 5"></polyline>
                          </svg>
                          {{ $t('bikmedia.table.actions.view') }}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import equipmentConfig from '@/config/entities/equipment.config.js';
import equipmentService from '@/services/api/equipment.service.js';
import FormSection from '@/components/forms/FormSection.vue';
import SmartIcon from '@/views/bikmedia/components/SmartIcon.vue';
import { useMeta } from '@/composables/use-meta';
import useClipboard from 'vue-clipboard3';

// i18n
const { t } = useI18n();

// Meta setup
useMeta({ title: t('bikmedia.pages.equipment.view.title') });

// Router setup
const router = useRouter();
const route = useRoute();

// Clipboard setup
const { toClipboard } = useClipboard();

// Reactive state
const equipment = ref(null);
const loading = ref(true);
const loadError = ref(null);
const selectedLocale = ref('en');
const isDeleting = ref(false);

// Computed helpers for localized fields
const getLocalizedField = (baseField) => {
  if (!equipment.value) return null;
  
  // Map locale to field suffix
  const suffix = selectedLocale.value === 'ar' ? 'AR' : 'EN';
  const localizedKey = `${baseField}${suffix}`;
  
  return equipment.value[localizedKey];
};

const getFieldWithFallback = (baseField) => {
  const localizedValue = getLocalizedField(baseField);
  
  // Return localized value if available
  if (localizedValue) return localizedValue;
  
  // Fallback to default locale (EN) or base field
  return equipment.value?.[`${baseField}EN`] || equipment.value?.[baseField] || null;
};

const isUsingFallback = (baseField) => {
  if (!equipment.value) return false;
  
  const localizedValue = getLocalizedField(baseField);
  const fallbackValue = equipment.value?.[`${baseField}EN`] || equipment.value?.[baseField];
  
  // Using fallback if localized value is empty but fallback exists
  return !localizedValue && !!fallbackValue;
};

// Computed properties for display
const displayName = computed(() => getFieldWithFallback('name'));
const displayDescription = computed(() => getFieldWithFallback('description'));
const showNameFallback = computed(() => isUsingFallback('name'));
const showDescriptionFallback = computed(() => isUsingFallback('description'));
const isRTL = computed(() => selectedLocale.value === 'ar');

const IMAGE_EXTENSIONS = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp', 'svg'];
const equipmentAnimationFieldConfig = equipmentConfig.nonTranslatableFields.find(field => field.name === 'anim');

const parseAcceptExtensions = (acceptString = '') =>
  acceptString
    .split(',')
    .map(token => token.trim())
    .filter(Boolean)
    .map(token => (token.startsWith('.') ? token.slice(1) : token).toLowerCase());

const equipmentAnimationAcceptExtensions = parseAcceptExtensions(equipmentAnimationFieldConfig?.accept);
const equipmentAnimationImageExtensionsFromConfig = equipmentAnimationAcceptExtensions.filter(
  ext => IMAGE_EXTENSIONS.includes(ext) || ext === 'image/*'
);

const equipmentAnimationUrl = computed(() => equipment.value?.anim || '');
const equipmentAnimationFileName = computed(() => {
  if (!equipmentAnimationUrl.value) return '';
  const segments = equipmentAnimationUrl.value.split('/');
  const fileName = segments.pop() || '';
  return fileName.split('?')[0];
});

const equipmentAnimationExtension = computed(() => {
  if (!equipmentAnimationUrl.value) return '';
  const cleanUrl = equipmentAnimationUrl.value.split('?')[0];
  const parts = cleanUrl.split('.');
  return parts.length > 1 ? parts.pop().toLowerCase() : '';
});

const equipmentHasAnimation = computed(() => Boolean(equipmentAnimationUrl.value));

const equipmentAnimationIsImage = computed(() => {
  if (!equipmentHasAnimation.value || !equipmentAnimationExtension.value) {
    return false;
  }

  if (equipmentAnimationFieldConfig?.accept?.includes('image/')) {
    return true;
  }

  if (equipmentAnimationImageExtensionsFromConfig.length > 0) {
    return (
      equipmentAnimationImageExtensionsFromConfig.includes(equipmentAnimationExtension.value) ||
      equipmentAnimationImageExtensionsFromConfig.includes('image/*')
    );
  }

  return IMAGE_EXTENSIONS.includes(equipmentAnimationExtension.value);
});

// Load equipment data
const loadEquipment = async (lang = null) => {
  loading.value = true;
  loadError.value = null;

  try {
    const equipmentId = route.params.id;

    if (!equipmentId) {
      throw new Error('Equipment ID is required');
    }

    const locale = lang || selectedLocale.value;

    // Try to use getById with locale support
    try {
      // Attempt locale-driven fetch when API supports it
      let $q = null ;
      const response = await equipmentService.getById(equipmentId, locale);
      equipment.value = $q = response.item.list.find(e => e.id === Number(equipmentId));
      console.log('Equipment loaded for view:', $q);
    } catch (getByIdError) {
      // Fallback to getAll() and filter by ID if getById not available
      console.warn('getById not available, falling back to getAll():', getByIdError.message);
      const response = await equipmentService.getAll();
      const equipmentList = response.items?.list || [];

      const foundEquipment = equipmentList.find(e => e.id === Number(equipmentId));

      if (!foundEquipment) {
        throw new Error(`Equipment with ID ${equipmentId} not found`);
      }

      equipment.value = foundEquipment;
      console.log('Equipment loaded for view (fallback):', foundEquipment);
    }

  } catch (error) {
    console.error('Failed to load equipment:', error);
    loadError.value = error.message || 'Failed to load equipment data';
    showMessage(loadError.value, 'error');
  } finally {
    loading.value = false;
  }
};

// Handle locale change
const handleLocaleChange = async () => {
  console.log('Locale changed to:', selectedLocale.value);
  // Refetch equipment data with selected locale
  await loadEquipment(selectedLocale.value);
};

// Handle copy link
const handleCopyLink = async () => {
  try {
    const equipmentId = route.params.id;
    const shareableUrl = `${window.location.origin}/store/equipment/${equipmentId}/view`;

    // Copy to clipboard using vue-clipboard3
    await toClipboard(shareableUrl);

    // Show success message
    showMessage('Link copied to clipboard!', 'success');

    console.log('Copied link:', shareableUrl);
  } catch (error) {
    console.error('Failed to copy link:', error);
    showMessage('Failed to copy link', 'error');
  }
};

// Handle edit
const handleEdit = () => {
  const equipmentId = route.params.id;
  router.push(`/store/equipment/${equipmentId}/edit`);
};

// Handle image error
const handleImageError = (event) => {
  // Replace broken image with placeholder
  event.target.src = '/src/assets/images/profile-30.png';
  event.target.alt = 'Image not available';
};

// Format number with comma separators
const formatNumber = (num) => {
  if (!num) return '0';
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// Get type label
const getTypeLabel = (type) => {
  const typeLabels = {
    1: 'Frame',
    2: 'Entry Effect',
    3: 'Badge',
    4: 'Theme'
  };
  return typeLabels[type] || `Type ${type}`;
};

// Get type badge class
const getTypeBadgeClass = (type) => {
  const badgeClasses = {
    1: 'bg-primary',
    2: 'bg-success',
    3: 'bg-warning text-dark',
    4: 'bg-info text-dark'
  };
  return badgeClasses[type] || 'bg-secondary';
};

// Handle delete
const handleDelete = async () => {
  if (!equipment.value) return;

  // Show confirmation dialog with item name prominently displayed
  const result = await window.Swal.fire({
    title: t('bikmedia.messages.confirmations.deleteEquipment'),
    html: `<div class="text-center mb-3">
             <h4 class="text-danger mb-2">${equipment.value.name || displayName.value || t('bikmedia.components.subGiftCard.unnamedGift')}</h4>
             <p class="text-muted">${t('bikmedia.messages.confirmations.cannotUndo')}</p>
           </div>`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: t('bikmedia.actions.delete'),
    confirmButtonColor: '#dc3545',
    cancelButtonText: t('bikmedia.actions.cancel'),
    cancelButtonColor: '#6c757d',
    reverseButtons: true
  });

  if (!result.isConfirmed) return;

  // Perform deletion
  await performDelete();
};

const performDelete = async () => {
  try {
    isDeleting.value = true;
    const equipmentId = route.params.id;
    const response = await equipmentService.delete(equipmentId);
    
    // Check for success based on API response structure
    if (response.data?.code === 200 && response.data?.err === null && response.data?.data?.success === 1) {
      showMessage(t('bikmedia.messages.success.equipmentDeleted'), 'success');
      // Navigate to list page after successful deletion
      router.push('/store/equipments');
    } else if (response.data?.code === 201 && response.data?.err === 'notFound') {
      throw new Error('Equipment not found');
    } else if (response.data?.err) {
      throw new Error(response.data.err);
    } else {
      throw new Error('Delete operation failed');
    }
  } catch (error) {
    console.error('Failed to delete equipment:', error);
    showMessage(error.message || t('bikmedia.messages.errors.failedToDelete'), 'error');
  } finally {
    isDeleting.value = false;
  }
};

// Show message
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

// Load equipment on mount
onMounted(() => {
  loadEquipment();
});
</script>

<style scoped>
/* Preview image styling */
.preview-image {
  max-width: 200px;
  max-height: 200px;
  border-radius: 8px;
  border: 1px solid #e0e6ed;
  object-fit: cover;
  display: block;
}

/* File preview container */
.file-preview {
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  text-align: center;
}

/* Read-only field styling */
.form-control-plaintext {
  padding-top: 0.375rem;
  padding-bottom: 0.375rem;
  margin-bottom: 0;
  font-size: inherit;
  line-height: 1.5;
}

/* Locale selector styling */
.locale-selector {
  min-width: 150px;
}

/* Action buttons full width on mobile */
@media (max-width: 767px) {
  .invoice-action-btn .btn {
    margin-bottom: 1rem;
  }
}
</style>
