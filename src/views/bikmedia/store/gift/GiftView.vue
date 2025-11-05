<template>
  <div class="layout-px-spacing gift-view">
    <!-- Breadcrumb -->
    <nav class="breadcrumb-one" aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          <a href="javascript:;" @click="router.push('/')">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
              class="feather feather-home">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          </a>
        </li>
        <li class="breadcrumb-item"><a href="javascript:;" @click="router.push('/store/gifts')">{{ $t('bikmedia.navigation.breadcrumb.store') }}</a></li>
        <li class="breadcrumb-item"><a href="javascript:;" @click="router.push('/store/gifts')">{{ $t('bikmedia.navigation.breadcrumb.gifts') }}</a></li>
        <li class="breadcrumb-item active" aria-current="page"><span>{{ $t('bikmedia.navigation.breadcrumb.view') }}</span></li>
      </ol>
    </nav>

    <!-- Main Content -->
    <div class="row invoice layout-top-spacing layout-spacing">
      <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
        <div class="doc-container">
          <div class="row">
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
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                class="feather feather-alert-circle text-danger">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <h5 class="mt-3">{{ $t('bikmedia.messages.errors.notFound') }}</h5>
              <p class="text-muted">{{ loadError }}</p>
              <button class="btn btn-primary" @click="router.push('/store/gifts')">
                {{ $t('bikmedia.table.actions.view') }}
              </button>
            </div>

            <!-- Content Area -->
            <template v-else>
              <!-- Main Content Column -->
              <div class="col-xl-9 col-lg-12 content-panel">
                <!-- Header with Locale Selector -->
                <div class="row mb-4">
                  <div class="col-12">
                    <div class="d-flex justify-content-between align-items-center page-header-responsive">
                      <h3>{{ $t('bikmedia.pages.gifts.view.title') }}</h3>
                      <div class="locale-selector" style="width: 200px;">
                        <label for="localeSelect" class="form-label mb-1">{{ $t('bikmedia.forms.language') }}:</label>
                        <select id="localeSelect" class="form-select" v-model="selectedLocale"
                          @change="handleLocaleChange">
                          <option v-for="locale in giftConfig.supportedLocales" :key="locale.code" :value="locale.code">
                            {{ locale.label }}
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Section 1: Basic Information (Name) -->
                <FormSection :title="$t('bikmedia.forms.name')" :description="$t('bikmedia.pages.gifts.view.subtitle')">
                  <div class="row">
                    <div class="col-12">
                      <div class="mb-3">
                        <label class="form-label text-muted">
                          {{ $t('bikmedia.forms.name') }}
                          <span v-if="showNameFallback" class="badge bg-light text-muted ms-2"
                            style="font-weight: normal;">Using default locale</span>
                        </label>
                        <div class="d-flex align-items-center">
                          <SmartIcon v-if="gift?.icon || gift?.img" :src="gift.icon || gift.img" alt="Gift Icon"
                            width="48px" height="48px" class="me-3"
                            style="border-radius: 8px; border: 1px solid #e0e6ed;" @error="handleImageError" />
                          <p class="form-control-plaintext mb-0" :dir="isRTL ? 'rtl' : 'ltr'">
                            {{ displayName || (isRTL ? '(غير متوفر)' : '(Not available)') }}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </FormSection>

               

                <!-- Section 3: Settings (Non-Translatable Fields) -->
                <FormSection :title="$t('bikmedia.forms.status')" description="Gift properties and requirements">
                  <!-- Row 1: Coin + Type + Level -->
                  <div class="row">
                    <div class="col-md-4">
                      <div class="mb-3">
                        <label class="form-label text-muted">{{ $t('bikmedia.forms.coins') }}</label>
                        <p class="form-control-plaintext">{{ formatNumber(gift?.coin) }}</p>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="mb-3">
                        <label class="form-label text-muted">{{ $t('bikmedia.forms.type') }}</label>
                        <p class="form-control-plaintext">
                          <span class="badge" :class="getTypeBadgeClass(normalizeTypeValue(gift))">
                            {{ getTypeDisplay(gift) }}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="mb-3">
                        <label class="form-label text-muted">{{ $t('bikmedia.forms.level') }}</label>
                        <p class="form-control-plaintext">{{ gift?.lvl || 0 }}</p>
                      </div>
                    </div>
                  </div>

                  <!-- Row 2: VIP + Animation Type + List Order -->
                  <div class="row">
                    <div class="col-md-4">
                      <div class="mb-3">
                        <label class="form-label text-muted">VIP</label>
                        <p class="form-control-plaintext">{{ gift?.vip || 0 }}</p>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="mb-3">
                        <label class="form-label text-muted">Animation Type</label>
                        <p class="form-control-plaintext">{{ gift?.anim_type || 0 }}</p>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="mb-3">
                        <label class="form-label text-muted">List Order</label>
                        <p class="form-control-plaintext">{{ formatNumber(gift?.list_order) }}</p>
                      </div>
                    </div>
                  </div>

                  <!-- Row 3: Mark + Gift ID -->
                  <div class="row">
                    <div class="col-md-4">
                      <div class="mb-3">
                        <label class="form-label text-muted">Mark</label>
                        <p class="form-control-plaintext">{{ gift?.mark || 0 }}</p>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="mb-3">
                        <label class="form-label text-muted">Gift ID</label>
                        <p class="form-control-plaintext">#{{ gift?.id }}</p>
                      </div>
                    </div>
                  </div>
                </FormSection>

                <!-- Section 4: Media (File Upload Fields) -->
                <FormSection title="Media" description="Icon and animation files" class="media-section">
                  <div class="row">
                    <div class="col-md-6">
                      <div class="mb-3">
                        <label class="form-label text-muted">{{ $t('bikmedia.forms.icon') }}</label>
                        <div v-if="gift?.icon || gift?.img" class="file-preview">
                          <img :src="gift.icon || gift.img" alt="Gift Icon" class="preview-image"
                            @error="handleImageError" />
                          <p class="text-muted small mt-2">{{ gift.icon || gift.img }}</p>
                        </div>
                        <p v-else class="form-control-plaintext text-muted">{{ $t('bikmedia.components.subGiftCard.imageNotAvailable') }}</p>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="mb-3">
                        <label class="form-label text-muted">Animation</label>
                        <div v-if="hasAnimation" class="file-preview">
                          <template v-if="isAnimationImage">
                            <img :src="animationUrl" alt="Gift Animation" class="preview-image"
                              @error="handleImageError" />
                          </template>
                          <template v-else>
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24"
                              fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                              stroke-linejoin="round" class="feather feather-file">
                              <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
                              <polyline points="13 2 13 9 20 9" />
                            </svg>
                            <div class="mt-2">{{ animationFileName }}</div>
                          </template>
                          <p class="text-muted small mt-2">
                            <a :href="animationUrl" target="_blank" rel="noopener" class="text-decoration-underline">
                              {{ animationUrl }}
                            </a>
                          </p>
                        </div>
                        <p v-else class="form-control-plaintext text-muted">{{ $t('bikmedia.components.subGiftCard.imageNotAvailable') }}</p>
                      </div>
                    </div>
                  </div>
                </FormSection>

                <!-- Sub Gifts Section -->
                <FormSection :title="$t('bikmedia.modals.subGift.title')" v-if="gift && gift.icons && gift.icons.length" class="sub-gifts-grid">
                  <div class="row g-3">
                    <div class="col-xl-3 col-lg-4 col-md-6 col-sm-6" v-for="(sg, idx) in gift.icons" :key="idx">
                      <div class="card h-100">
                        <div style="height: 140px; overflow: hidden;">
                          <SmartIcon :src="sg.icon" alt="Sub Gift" width="100%" height="140px" fit="cover" />
                        </div>
                        <div class="card-body p-2 text-center">
                          <div class="text-truncate small" :title="sg.name">{{ sg.name }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </FormSection>
              </div>

              <!-- Action Buttons Sidebar -->
              <div class="col-xl-3 col-lg-12 action-sidebar">
                <div class="invoice-actions-btn">
                  <div class="invoice-action-btn">
                    <div class="row">
                      <!-- Copy Link Button -->
                      <div class="col-xl-12 col-md-4 col-sm-6">
                        <button class="btn btn-primary btn-block w-100 mb-3" @click="handleCopyLink">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                            class="feather feather-copy">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                          </svg>
                          {{ $t('bikmedia.actions.copy') }}
                        </button>
                      </div>

                      <!-- Edit Button -->
                      <div class="col-xl-12 col-md-4 col-sm-6">
                        <button class="btn btn-dark btn-block w-100 mb-3" @click="handleEdit">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                            class="feather feather-edit-2">
                            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                          </svg>
                          {{ $t('bikmedia.actions.edit') + ' ' + $t('bikmedia.store.gifts') }}
                        </button>
                      </div>

                      <!-- Delete Button-->
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
                          {{ isDeleting ? $t('bikmedia.messages.loading') : $t('bikmedia.actions.delete') + ' ' + $t('bikmedia.store.gifts') }}
                        </button>
                      </div>
                      <!-- Back to List Button -->
                      <div class="col-xl-12 col-md-4 col-sm-6">
                        <button class="btn btn-secondary btn-block w-100 mb-3" @click="router.push('/store/gifts')">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                            class="feather feather-arrow-left">
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
import giftService from '@services/api/gift.service';
import FormSection from '@/components/forms/FormSection.vue';
import SmartIcon from '@/views/bikmedia/components/SmartIcon.vue';
import { useMeta } from '@/composables/use-meta';
import useClipboard from 'vue-clipboard3';
import giftConfig from '@/config/entities/gift.config';

// i18n
const { t } = useI18n();

// Meta
useMeta({ title: t('bikmedia.pages.gifts.view.title') });

// Router
const router = useRouter();
const route = useRoute();

// Clipboard
const { toClipboard } = useClipboard();

// Reactive State
const gift = ref(null);
const loading = ref(true);
const loadError = ref(null);
const selectedLocale = ref('en');
const currentDataLocale = ref('en');
const isDeleting = ref(false);

// Computed Helpers for Localized Fields
const getLocalizedField = (baseField) => {
  if (!gift.value) return null;

  // If current data locale matches selected locale, return base field
  if (currentDataLocale.value === selectedLocale.value) {
    return gift.value[baseField];
  }

  const suffix = selectedLocale.value === 'ar' ? 'AR' : 'EN';
  const localizedFieldName = `${baseField}${suffix}`;

  return gift.value[localizedFieldName];
};

const getFieldWithFallback = (baseField) => {
  const localizedValue = getLocalizedField(baseField);
  if (localizedValue) return localizedValue;

  // Fallback to default locale (EN) or base field
  const fallbackValue = gift.value?.[`${baseField}EN`] || gift.value?.[baseField];
  return fallbackValue;
};

const isUsingFallback = (baseField) => {
  // If current data locale matches selected locale and base field exists, not using fallback
  if (currentDataLocale.value === selectedLocale.value && gift.value?.[baseField]) {
    return false;
  }

  const localizedValue = getLocalizedField(baseField);
  const fallbackValue = gift.value?.[`${baseField}EN`] || gift.value?.[baseField];

  // Return true if we're using fallback (localized is empty but fallback exists)
  return !localizedValue && !!fallbackValue && selectedLocale.value !== 'en';
};

// Computed Properties for Display
const displayName = computed(() => getFieldWithFallback('name'));
const displayDescription = computed(() => getFieldWithFallback('description'));
const showNameFallback = computed(() => isUsingFallback('name'));
const showDescriptionFallback = computed(() => isUsingFallback('description'));
const isRTL = computed(() => selectedLocale.value === 'ar');

const IMAGE_EXTENSIONS = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp', 'svg'];
const animationFieldConfig = giftConfig.nonTranslatableFields.find(field => field.name === 'anim');

const parseAcceptExtensions = (acceptString = '') =>
  acceptString
    .split(',')
    .map(token => token.trim())
    .filter(Boolean)
    .map(token => (token.startsWith('.') ? token.slice(1) : token).toLowerCase());

const animationAcceptExtensions = parseAcceptExtensions(animationFieldConfig?.accept);
const animationImageExtensionsFromConfig = animationAcceptExtensions.filter(ext => IMAGE_EXTENSIONS.includes(ext) || ext === 'image/*');

const animationUrl = computed(() => gift.value?.anim || '');
const animationFileName = computed(() => {
  if (!animationUrl.value) return '';
  const segments = animationUrl.value.split('/');
  const fileName = segments.pop() || '';
  return fileName.split('?')[0];
});

const animationExtension = computed(() => {
  if (!animationUrl.value) return '';
  const cleanUrl = animationUrl.value.split('?')[0];
  const parts = cleanUrl.split('.');
  return parts.length > 1 ? parts.pop().toLowerCase() : '';
});

const hasAnimation = computed(() => Boolean(animationUrl.value));

const isAnimationImage = computed(() => {
  if (!hasAnimation.value || !animationExtension.value) {
    return false;
  }

  if (animationFieldConfig?.accept?.includes('image/')) {
    return true;
  }

  if (animationImageExtensionsFromConfig.length > 0) {
    return animationImageExtensionsFromConfig.includes(animationExtension.value) || animationImageExtensionsFromConfig.includes('image/*');
  }

  return IMAGE_EXTENSIONS.includes(animationExtension.value);
});

// Methods
const loadGift = async (lang = null) => {
  loading.value = true;
  loadError.value = null;

  try {
    const giftId = route.params.id;

    if (!giftId) {
      throw new Error('Gift ID is required');
    }

    const locale = lang || selectedLocale.value;

    // Try to use getById with locale support
    try {
      // Attempt locale-driven fetch when API supports it
      const response = await giftService.getById(giftId, locale);

      console.log("Response in single and single transform" , response)

      // Verify response shape to ensure fallback triggers if invalid
      if (!response || !response.item) {
        throw new Error('Invalid getById() response');
      }

      // transformSingleResponse returns a single item, not an array
      gift.value = response.item;
      currentDataLocale.value = locale;
      console.log('Gift loaded for view:', response.item);
    } catch (getByIdError) {
      // TODO: Replace fallback with giftService.getById(id, lang) when available
      // This workaround will be replaced in subsequent phase "Extend API Services with Missing CRUD Methods"

      // Fallback to getAll() and filter by ID if getById not available
      console.warn('getById not available, falling back to getAll():', getByIdError.message);
      const response = await giftService.getAll({ lang: locale });
      const giftList = response.items?.list || [];

      const foundGift = giftList.find(g => g.id === Number(giftId));

      if (!foundGift) {
        throw new Error(`Gift with ID ${giftId} not found`);
      }

      gift.value = foundGift;
      currentDataLocale.value = locale;
      console.log('Gift loaded for view (fallback):', foundGift);
    }

  } catch (error) {
    console.error('Failed to load gift:', error);
    loadError.value = error.message || 'Failed to load gift data';
    showMessage(loadError.value, 'error');
  } finally {
    loading.value = false;
  }
};

const handleLocaleChange = async () => {
  console.log('Locale changed to:', selectedLocale.value);
  await loadGift(selectedLocale.value);
};

const handleCopyLink = async () => {
  try {
    const giftId = route.params.id;
    const shareableUrl = `${window.location.origin}/store/gift/${giftId}/view`;

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

const handleEdit = () => {
  const giftId = route.params.id;
  router.push(`/store/gift/${giftId}/edit`);
};

const handleDelete = async () => {
  if (!gift.value) return;

  // Show confirmation dialog with item name prominently displayed
  const result = await window.Swal.fire({
    title: t('bikmedia.messages.confirmations.deleteGift'),
    html: `<div class="text-center mb-3">
             <h4 class="text-danger mb-2">${gift.value.name || displayName.value || t('bikmedia.components.subGiftCard.unnamedGift')}</h4>
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
    const giftId = route.params.id;
    const response = await giftService.delete(giftId);
    
    // Check for success based on API response structure
    if (response.data?.code === 200 && response.data?.err === null && response.data?.data?.success === 1) {
      showMessage(t('bikmedia.messages.success.giftDeleted'), 'success');
      // Navigate to list page after successful deletion
      router.push('/store/gifts');
    } else if (response.data?.code === 201 && response.data?.err === 'notFound') {
      throw new Error('Gift not found');
    } else if (response.data?.err) {
      throw new Error(response.data.err);
    } else {
      throw new Error('Delete operation failed');
    }
  } catch (error) {
    console.error('Failed to delete gift:', error);
    showMessage(error.message || t('bikmedia.messages.errors.failedToDelete'), 'error');
  } finally {
    isDeleting.value = false;
  }
};
const handleImageError = (event) => {
  event.target.src = '/src/assets/images/profile-30.png';
  event.target.alt = 'Image not available';
};

const formatNumber = (num) => {
  if (!num) return '0';
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const getTypeLabel = (type) => {
  const typeLabels = {
    0: 'Default',
    1: 'Standard',
    2: 'Premium',
    3: 'Video',
    4: 'Special'
  };
  return typeLabels[type] || `Type ${type}`;
};

// Normalize numeric type and prefer backend-provided typeName when present
const normalizeTypeValue = (gift) => {
  const raw = gift?.type;
  const n = Number(raw);
  return Number.isFinite(n) ? n : 0;
};

const getTypeDisplay = (gift) => {
  if (gift && typeof gift.typeName === 'string' && gift.typeName.trim() !== '') {
    return gift.typeName;
  }
  return getTypeLabel(normalizeTypeValue(gift));
};

const getTypeBadgeClass = (type) => {
  const badgeClasses = {
    0: 'bg-secondary',
    1: 'bg-primary',
    2: 'bg-success',
    3: 'bg-warning text-dark',
    4: 'bg-info text-dark'
  };
  return badgeClasses[type] || 'bg-secondary';
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
  loadGift();
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
