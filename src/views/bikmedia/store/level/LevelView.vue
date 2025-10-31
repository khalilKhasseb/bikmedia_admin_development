<template>
  <div class="layout-px-spacing level-view">
    <!-- Breadcrumb -->
    <div class="page-header">
      <nav class="breadcrumb-one" aria-label="breadcrumb">
        <ol class="breadcrumb">
          <li class="breadcrumb-item">
            <a href="javascript:;" @click="router.push('/')">{{ $t('dashboard') }}</a>
          </li>
          <li class="breadcrumb-item">
            <a href="javascript:;" @click="router.push('/store/levels')">{{ $t('bikmedia.navigation.breadcrumb.store') }}</a>
          </li>
          <li class="breadcrumb-item">
            <a href="javascript:;" @click="router.push('/store/levels')">{{ $t('bikmedia.navigation.breadcrumb.levels') }}</a>
          </li>
          <li class="breadcrumb-item active" aria-current="page">
            <span>{{ $t('bikmedia.navigation.breadcrumb.view') }}</span>
          </li>
        </ol>
      </nav>
    </div>

    <!-- Main Content -->
    <div class="row invoice layout-top-spacing layout-spacing">
      <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
        <div class="doc-container">
          <div class="row">
            <!-- Loading State -->
            <div v-if="loading" class="text-center py-5">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">{{ $t('bikmedia.messages.loadingLevels') }}</span>
              </div>
              <p class="mt-2">{{ $t('bikmedia.messages.loadingLevels') }}</p>
            </div>

            <!-- Error State -->
            <div v-else-if="loadError" class="text-center py-5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="text-danger"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <h5 class="mt-3">{{ $t('bikmedia.messages.errors.notFound') }}</h5>
              <p class="text-muted">{{ loadError }}</p>
              <button class="btn btn-primary" @click="router.push('/store/levels')">
                {{ $t('bikmedia.table.actions.view') }}
              </button>
            </div>

            <!-- Content Area -->
            <template v-else>
              <!-- Main Content Column -->
              <div class="col-xl-9">
                <!-- Locale Selector -->
                <div class="row mb-4">
                  <div class="col-12">
                    <div class="d-flex justify-content-between align-items-center">
                      <h3>{{ $t('bikmedia.pages.levels.view.title') }}</h3>
                      <div class="locale-selector" style="width: 200px;">
                        <label for="localeSelect" class="form-label mb-1">{{ $t('bikmedia.forms.language') }}:</label>
                        <select
                          id="localeSelect"
                          class="form-select"
                          v-model="selectedLocale"
                          @change="handleLocaleChange"
                        >
                          <option
                            v-for="locale in levelConfig.supportedLocales"
                            :key="locale.code"
                            :value="locale.code"
                          >
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
                  :description="$t('bikmedia.pages.levels.view.subtitle')"
                >
                  <div class="row">
                    <div class="col-md-4">
                      <div class="mb-3">
                        <label class="form-label text-muted">{{ $t('bikmedia.forms.level') }}</label>
                        <p class="form-control-plaintext">Level {{ level?.lvl }}</p>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="mb-3">
                        <label class="form-label text-muted">{{ $t('bikmedia.forms.levelId') }}</label>
                        <p class="form-control-plaintext">{{ level?.lid }}</p>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="mb-3">
                        <label class="form-label text-muted">ID</label>
                        <p class="form-control-plaintext">#{{ level?.id }}</p>
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-12">
                      <div class="mb-3">
                        <label class="form-label text-muted">
                          {{ $t('bikmedia.forms.name') }}
                          <span
                            v-if="showNameFallback"
                            class="badge bg-light text-muted ms-2"
                            style="font-weight: normal;"
                          >
                            Using default locale
                          </span>
                        </label>
                        <p class="form-control-plaintext" :dir="isRTL ? 'rtl' : 'ltr'">
                          {{ displayName || (isRTL ? '(غير متوفر)' : '(Not available)') }}
                        </p>
                      </div>
                    </div>
                  </div>
                </FormSection>

                <!-- Section 2: Progress -->
                <FormSection
                  :title="$t('bikmedia.forms.target')"
                  description="Target points required for this level"
                >
                  <div class="row">
                    <div class="col-md-6">
                      <div class="mb-3">
                        <label class="form-label text-muted">{{ $t('bikmedia.forms.target') }}</label>
                        <p class="form-control-plaintext">{{ formatNumber(level?.target) }}</p>
                      </div>
                    </div>
                  </div>
                </FormSection>

                <!-- Section 3: Icons -->
                <FormSection
                  title="Icons"
                  description="Level icon variations"
                >
                  <div class="row">
                    <div class="col-md-4">
                      <div class="mb-3">
                        <label class="form-label text-muted">{{ $t('bikmedia.forms.activeIcon') }}</label>
                        <div v-if="level?.level?.icon" class="file-preview">
                          <img
                            :src="level.level.icon"
                            alt="Active Icon"
                            class="preview-image"
                            @error="handleImageError"
                          />
                          <p class="text-muted small mt-2">{{ level.level.icon }}</p>
                        </div>
                        <p v-else class="form-control-plaintext text-muted">{{ $t('bikmedia.components.subGiftCard.imageNotAvailable') }}</p>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="mb-3">
                        <label class="form-label text-muted">{{ $t('bikmedia.forms.disabledIcon') }}</label>
                        <div v-if="level?.level?.icon_disable" class="file-preview">
                          <img
                            :src="level.level.icon_disable"
                            alt="Disabled Icon"
                            class="preview-image"
                            @error="handleImageError"
                          />
                          <p class="text-muted small mt-2">{{ level.level.icon_disable }}</p>
                        </div>
                        <p v-else class="form-control-plaintext text-muted">{{ $t('bikmedia.components.subGiftCard.imageNotAvailable') }}</p>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="mb-3">
                        <label class="form-label text-muted">{{ $t('bikmedia.forms.animatedIcon') }}</label>
                        <div v-if="level?.level?.icon_anim" class="file-preview">
                          <img
                            :src="level.level.icon_anim"
                            alt="Animated Icon"
                            class="preview-image"
                            @error="handleImageError"
                          />
                          <p class="text-muted small mt-2">{{ level.level.icon_anim }}</p>
                        </div>
                        <p v-else class="form-control-plaintext text-muted">{{ $t('bikmedia.components.subGiftCard.imageNotAvailable') }}</p>
                      </div>
                    </div>
                  </div>
                </FormSection>
              </div>

              <!-- Action Buttons Sidebar -->
              <div class="col-xl-3">
                <div class="invoice-actions-btn">
                  <div class="invoice-action-btn">
                    <div class="row">
                      <!-- Copy Link Button -->
                      <div class="col-xl-12 col-md-6 col-sm-6">
                        <button
                          class="btn btn-primary btn-block w-100 mb-3"
                          @click="handleCopyLink"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            class="feather feather-copy me-2"
                          >
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                          </svg>
                          {{ $t('bikmedia.actions.copy') }}
                        </button>
                      </div>

                      <!-- Edit Button -->
                      <div class="col-xl-12 col-md-6 col-sm-6">
                        <button
                          class="btn btn-dark btn-block w-100 mb-3"
                          @click="handleEdit"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            class="feather feather-edit-2 me-2"
                          >
                            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                          </svg>
                          {{ $t('bikmedia.actions.edit') + ' ' + $t('bikmedia.store.levels') }}
                        </button>
                      </div>

                      <!-- Delete Button -->
                      <div class="col-xl-12 col-md-6 col-sm-6">
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
                          {{ isDeleting ? $t('bikmedia.messages.loading') : $t('bikmedia.actions.delete') + ' ' + $t('bikmedia.store.levels') }}
                        </button>
                      </div>

                      <!-- Back to List Button -->
                      <div class="col-xl-12 col-md-6 col-sm-6">
                        <button
                          class="btn btn-secondary btn-block w-100 mb-3"
                          @click="router.push('/store/levels')"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            class="feather feather-arrow-left"
                          >
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
import levelConfig from '@/config/entities/level.config.js';
import levelService from '@/services/api/level.service.js';
import FormSection from '@/components/forms/FormSection.vue';
import { useMeta } from '@/composables/use-meta';
import useClipboard from 'vue-clipboard3';
import placeholderImage from '@/assets/images/profile-30.png';

// i18n
const { t } = useI18n();

// Meta setup
useMeta({ title: t('bikmedia.pages.levels.view.title') });

// Router setup
const router = useRouter();
const route = useRoute();


// Clipboard setup
const { toClipboard } = useClipboard();

// Reactive state
const level = ref(null);
const loading = ref(true);
const loadError = ref(null);
const selectedLocale = ref('en');
const isDeleting = ref(false);

// Computed helpers for localized fields
const getLocalizedField = (baseField) => {
  if (!level.value) return null;
  
  // For 'name' field, access nested level.level.name
  if (baseField === 'name') {
    return level.value.level?.name || null;
  }
  
  // Map locale to field suffix
  const suffix = selectedLocale.value === 'ar' ? 'AR' : 'EN';
  const localizedKey = `${baseField}${suffix}`;
  
  return level.value[localizedKey];
};

const getFieldWithFallback = (baseField) => {
  const localizedValue = getLocalizedField(baseField);
  
  if (localizedValue) {
    return localizedValue;
  }
  
  // Fallback to default locale (EN)
  if (baseField === 'name') {
    return level.value?.level?.name || level.value?.[baseField] || null;
  }
  
  return level.value?.[`${baseField}EN`] || level.value?.[baseField] || null;
};

const isUsingFallback = (baseField) => {
  const localizedValue = getLocalizedField(baseField);
  const fallbackValue = getFieldWithFallback(baseField);
  
  // If we have a fallback value but no localized value, we're using fallback
  return !localizedValue && !!fallbackValue && selectedLocale.value !== 'en';
};

// Computed properties for display
const displayName = computed(() => getFieldWithFallback('name'));

const showNameFallback = computed(() => isUsingFallback('name'));

const isRTL = computed(() => selectedLocale.value === 'ar');

// Methods
const loadLevel = async (lang = null) => {
  loading.value = true;
  loadError.value = null;

  try {
    const levelId = route.params.id;

    if (!levelId) {
      throw new Error('Level ID is required');
    }

    const locale = lang || selectedLocale.value;

    // Try to use getById with locale support
    try {
      // TODO: Replace fallback with levelService.getById(id, lang) when available
      // This workaround will be replaced in subsequent phase "Extend API Services with Missing CRUD Methods"
      // Attempt locale-driven fetch when API supports it
      const response = await levelService.getById(levelId, locale);
      level.value = response.item;
      console.log('Level loaded for view:', response.item);
    } catch (getByIdError) {
      // Fallback to getAll() and filter by ID if getById not available
      console.warn('getById not available, falling back to getAll():', getByIdError.message);
      const response = await levelService.getAll({ lang: locale });
      const levelList = response.items?.list || [];

      const foundLevel = levelList.find(l => l.id === Number(levelId));

      if (!foundLevel) {
        throw new Error(`Level with ID ${levelId} not found`);
      }

      level.value = foundLevel;
      console.log('Level loaded for view (fallback):', foundLevel);
    }

  } catch (error) {
    console.error('Failed to load level:', error);
    loadError.value = error.message || 'Failed to load level data';
    showMessage(loadError.value, 'error');
  } finally {
    loading.value = false;
  }
};

const handleLocaleChange = async () => {
  console.log('Locale changed to:', selectedLocale.value);
  await loadLevel(selectedLocale.value);
};

const handleCopyLink = async () => {
  try {
    const levelId = route.params.id;
    const resolved = router.resolve({
      path: `/store/level/${levelId}/view`
    });
    const shareableUrl = `${window.location.origin}${resolved.href}`;

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

const handleImageError = (event) => {
  event.target.src = placeholderImage;
  event.target.alt = 'Image not available';
};

const formatNumber = (num) => {
  if (!num && num !== 0) return '0';
  const locale = selectedLocale.value === 'ar' ? 'ar' : 'en-US';
  return new Intl.NumberFormat(locale).format(num);
};

const handleEdit = () => {
  const levelId = route.params.id;
  router.push(`/store/level/${levelId}/edit`);
};

const handleDelete = async () => {
  if (!level.value) return;

  // Show confirmation dialog with item name prominently displayed
  const levelName = level.value.level?.name || displayName.value || `Level ${level.value.lvl}` || t('bikmedia.components.subGiftCard.unnamedGift');
  const result = await window.Swal.fire({
    title: t('bikmedia.messages.confirmations.deleteLevel'),
    html: `<div class="text-center mb-3">
             <h4 class="text-danger mb-2">${levelName}</h4>
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
    const levelId = route.params.id;
    const response = await levelService.delete(levelId);
    
    // Check for success based on API response structure
    if (response.data?.code === 200 && response.data?.err === null && response.data?.data?.success === 1) {
      showMessage(t('bikmedia.messages.success.levelDeleted'), 'success');
      // Navigate to list page after successful deletion
      router.push('/store/levels');
    } else if (response.data?.code === 201 && response.data?.err === 'notFound') {
      throw new Error('Level not found');
    } else if (response.data?.err) {
      throw new Error(response.data.err);
    } else {
      throw new Error('Delete operation failed');
    }
  } catch (error) {
    console.error('Failed to delete level:', error);
    showMessage(error.message || t('bikmedia.messages.errors.failedToDelete'), 'error');
  } finally {
    isDeleting.value = false;
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

// Lifecycle hooks
onMounted(() => {
  loadLevel();
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
