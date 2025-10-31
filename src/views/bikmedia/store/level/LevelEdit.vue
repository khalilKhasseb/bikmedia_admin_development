<template>
  <div class="layout-px-spacing level-edit">
    <!-- Breadcrumb -->
    <teleport to="#breadcrumb">
      <ul class="navbar-nav flex-row">
        <li>
          <div class="page-header">
            <nav class="breadcrumb-one" aria-label="breadcrumb">
              <ol class="breadcrumb">
                <li class="breadcrumb-item"><a href="javascript:;" @click="router.push('/')">{{ $t('dashboard') }}</a></li>
                <li class="breadcrumb-item"><a href="javascript:;" @click="router.push('/store/levels')">{{ $t('bikmedia.navigation.breadcrumb.store') }}</a></li>
                <li class="breadcrumb-item"><a href="javascript:;" @click="router.push('/store/levels')">{{ $t('bikmedia.navigation.breadcrumb.levels') }}</a></li>
                <li class="breadcrumb-item active" aria-current="page"><span>{{ $t('bikmedia.navigation.breadcrumb.edit') }}</span></li>
              </ol>
            </nav>
          </div>
        </li>
      </ul>
    </teleport>

    <!-- Check if editing is supported -->
    <div v-if="!levelConfig.supportsEdit" class="row layout-top-spacing layout-spacing">
      <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
        <div class="doc-container">
          <div class="text-center py-5">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-warning">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <h5 class="mt-3">{{ $t('bikmedia.messages.errors.operationNotSupported') }}</h5>
            <p class="text-muted">{{ $t('bikmedia.messages.errors.levelEditNotSupported') }}</p>
            <div class="d-flex gap-2 justify-content-center">
              <button class="btn btn-primary" @click="handleView">
                {{ $t('bikmedia.actions.view') }} {{ $t('bikmedia.store.level') }}
              </button>
              <button class="btn btn-secondary" @click="router.push('/store/levels')">
                {{ $t('bikmedia.actions.backToList') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Form (when supported) -->
    <div v-else>
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">{{ $t('bikmedia.messages.loadingLevels') }}</span>
        </div>
        <p class="mt-2">{{ $t('bikmedia.messages.loadingLevels') }}</p>
      </div>

      <!-- Error State -->
      <div v-else-if="loadError" class="text-center py-5">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-danger">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <h5 class="mt-3">{{ $t('bikmedia.messages.errors.failedToLoad') }}</h5>
        <p class="text-muted">{{ loadError }}</p>
        <button class="btn btn-primary" @click="router.push('/store/levels')">
          {{ $t('bikmedia.actions.backToList') }}
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
                      <h3>{{ $t('bikmedia.pages.levels.edit.title') }}</h3>
                      <div class="d-flex align-items-end gap-2">
                        <div class="locale-selector" style="width: 200px;">
                          <label for="localeSelect" class="form-label mb-1">{{ $t('bikmedia.forms.language') }}:</label>
                          <select
                            id="localeSelect"
                            class="form-select"
                            v-model="selectedLocale"
                            @change="handleLocaleChange"
                          >
                            <option v-for="locale in levelConfig.supportedLocales" :key="locale.code" :value="locale.code">
                              {{ locale.label }}
                            </option>
                          </select>
                        </div>
                        <div class="form-check form-switch ms-2">
                          <input class="form-check-input" type="checkbox" id="toggleAllLocales" v-model="showAllLocales" @change="handleShowAllLocalesChange">
                          <label class="form-check-label" for="toggleAllLocales">{{ $t('bikmedia.actions.edit') }} {{ $t('bikmedia.forms.language') }}</label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- Fully Dynamic Form with Custom Panel Layout -->
                <DynamicFormBuilder
                  :entityConfig="levelConfig"
                  v-model="formData"
                  :isSubmitted="isSubmitted"
                  :errors="validationErrors"
                  :existingData="level"
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
                      <div class="col-xl-12 col-md-6 col-sm-6" v-if="levelConfig.supportsDelete">
                        <button
                          type="button"
                          class="btn btn-danger btn-block w-100 mb-3"
                          @click="handleDelete"
                          :disabled="isDeleting || !level || !level.id"
                        >
                          <span v-if="isDeleting" class="spinner-border spinner-border-sm me-2"></span>
                          <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2 me-2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path><path d="M10 11v6"></path><path d="M14 11v6"></path></svg>
                          {{ isDeleting ? $t('bikmedia.messages.loading') : $t('bikmedia.actions.delete') + ' ' + $t('bikmedia.store.level') }}
                        </button>
                      </div>
                      <div class="col-xl-12 col-md-6 col-sm-6">
                        <button
                          type="button"
                          class="btn btn-secondary btn-block w-100 mb-3"
                          @click="handleCancel"
                          :disabled="isSubmitting"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x me-2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
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
                          <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-save me-2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
                          {{ isSubmitting ? $t('bikmedia.messages.loading') : $t('bikmedia.actions.update') + ' ' + $t('bikmedia.store.level') }}
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
import levelService from '@/services/api/level.service';
import { levelConfig } from '@/config/entities/level.config';
import { initializeFormData, validateEntityFields, buildDynamicPayload } from '@/config/entities/helpers.js';
import { sanitizeObject } from '@/utils/sanitize';
import { 
  showErrorToast, 
  showSuccessToast, 
  showInfoToast, 
  showConfirmDialog,
  bikMediaNotifications 
} from '@/utils/notification-handler.js';

// i18n
const { t } = useI18n();

// Meta
useMeta({ title: t('bikmedia.pages.levels.edit.title') });

// Router
const router = useRouter();
const route = useRoute();

// Reactive State
const formData = ref(initializeFormData(levelConfig));
const level = ref(null);
const loading = ref(true);
const loadError = ref(null);
const isSubmitted = ref(false);
const isSubmitting = ref(false);
const validationErrors = ref({});
const selectedLocale = ref('en');
const showAllLocales = ref(false);
const syncingTranslations = ref(false);
const isDeleting = ref(false);

// Form validation
const validateForm = () => {
  const { valid, errors } = validateEntityFields(levelConfig, formData.value);
  validationErrors.value = errors;
  return valid;
};

// Prefetch other locales in background and populate suffixed buffers
const backgroundPrefetchOtherLocales = async (activeLocale, levelId) => {
  const others = (levelConfig.supportedLocales || []).map(l => l.code).filter(code => code !== activeLocale);
  if (others.length === 0) return;
  syncingTranslations.value = true;
  try {
    for (const locale of others) {
      try {
        const resp = await levelService.getById(levelId, locale);
        const item = resp?.item?.list?.find(l => l.id === Number(levelId)) || resp?.data?.one || null;
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

const loadLevel = async (lang = null) => {
  loading.value = true;
  loadError.value = null;
  
  try {
    const levelId = route.params.id;
    
    if (!levelId) {
      throw new Error('Level ID is required');
    }
    const locale = lang || selectedLocale.value;

    let foundLevel = null;
    try {
      // Preferred: fetch by id with locale
      const response = await levelService.getById(levelId, locale);
      foundLevel = response?.item?.list?.find(l => l.id === Number(levelId)) || response?.data?.one || null;
      if (!foundLevel) throw new Error('Invalid getById() response');
    } catch (e) {
      // Fallback to getAll with locale and filter
      const response = await levelService.getAll({ lang: locale });
      const levelList = response.items?.list || [];
      foundLevel = levelList.find(l => l.id === Number(levelId));
      if (!foundLevel) {
        throw new Error(`Level with ID ${levelId} not found`);
      }
    }

    level.value = foundLevel;

    // Initialize form with existing data to populate non-translatables
    const prevModel = formData.value;
    formData.value = initializeFormData(levelConfig, foundLevel);

    // Map unsuffixed localized fields from response into active locale buffers
    const suffix = selectedLocale.value.toUpperCase();
    if (typeof foundLevel.name === 'string') {
      const key = `name${suffix}`;
      formData.value[key] = foundLevel.name;
    }

    // Preserve other locale buffers if previously edited
    if (prevModel) {
      levelConfig.translatableFields.forEach(field => {
        const fname = typeof field === 'string' ? field : field.name;
        if (!fname) return;
        levelConfig.supportedLocales.forEach(loc => {
          const k = `${fname}${loc.code.toUpperCase()}`;
          if (loc.code !== selectedLocale.value && prevModel[k] && !formData.value[k]) {
            formData.value[k] = prevModel[k];
          }
        });
      });
    }

    console.log('Level loaded:', foundLevel);
    console.log('Form data populated:', formData.value);
    
    // Background prefetch for other locales to populate hidden buffers
    backgroundPrefetchOtherLocales(selectedLocale.value, levelId);
  
  } catch (error) {
    console.error('Failed to load level:', error);
    loadError.value = error.message || 'Failed to load level data';
    showMessage(loadError.value, 'error');
  } finally {
    loading.value = false;
  }
};

const handleLocaleChange = async () => {
  const hasChanges = JSON.stringify(formData.value) !== JSON.stringify(initializeFormData(levelConfig, level.value || {}));
  if (hasChanges && !showAllLocales.value) {
    const result = await showConfirmDialog({
      title: 'bikmedia.messages.confirmations.areYouSure',
      text: 'bikmedia.messages.notifications.languageSwitchWarning',
      options: {
        icon: 'warning'
      }
    });
    if (!result.isConfirmed) return;
  }
  await loadLevel(selectedLocale.value);
};

const handleShowAllLocalesChange = async () => {
  if (showAllLocales.value && level?.value?.id) {
    // Ensure all locales are populated when enabling 'edit all'
    await backgroundPrefetchOtherLocales(selectedLocale.value, level.value.id);
  }
};

// Event Handlers
const handleView = () => {
  const levelId = route.params.id;
  if (levelId) {
    router.push({ name: 'level-view', params: { id: levelId } });
  }
};

const handleDelete = async () => {
  if (!level.value || !level.value.id) {
    showMessage('No level selected for deletion', 'error');
    return;
  }

  const result = await bikMediaNotifications.level.confirmDelete(
    level.value.name || t('bikmedia.components.subGiftCard.unnamedLevel')
  );

  if (result.isConfirmed) {
    await performDelete(level.value.id);
  }
};

const performDelete = async (itemId) => {
  try {
    isDeleting.value = true;
    const response = await levelService.delete(itemId);
    
    // Check for success based on API response structure
    if (response.data?.code === 200 && response.data?.err === null && response.data?.data?.success === 1) {
      bikMediaNotifications.level.deleted();
      // Navigate to list page
      setTimeout(() => {
        router.push('/store/levels');
      }, 1000);
    } else if (response.data?.code === 201 && response.data?.err === 'notFound') {
      throw new Error('Level not found');
    } else if (response.data?.err) {
      throw new Error(response.data.err);
    } else {
      throw new Error('Delete operation failed');
    }
  } catch (error) {
    showMessage(error.message || t('bikmedia.messages.errors.failedToDelete'), 'error');
  } finally {
    isDeleting.value = false;
  }
};

const handleCancel = () => {
  const hasChanges = JSON.stringify(formData.value) !== JSON.stringify(initializeFormData(levelConfig, level.value || {}));

  if (hasChanges) {
    bikMediaNotifications.general.unsavedChanges().then((result) => {
      if (result.isConfirmed) {
        router.push('/store/levels');
      }
    });
  } else {
    router.push('/store/levels');
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

    // Sanitize string inputs
    const sanitizedData = {
      nameEN: formData.value.nameEN,
      nameAR: formData.value.nameAR
    };

    const cleaned = sanitizeObject(sanitizedData, ['nameEN']);

    Object.assign(formData.value, cleaned);

    // Build payload dynamically
    const payload = buildDynamicPayload(levelConfig, formData.value, level.value, 'update', { id: route.params.id, updateStrategy: 'all' });
    const isFormData = payload instanceof FormData;

    // Check if there are any changes
    if (
      (!isFormData && Object.keys(payload).length === 0) ||
      (isFormData && Array.from(payload.keys()).filter((key) => key !== 'id').length === 0)
    ) {
      showInfoToast('bikmedia.messages.notifications.noChanges');
      isSubmitting.value = false;
      return;
    }

    // Note: This will need to be implemented when the API supports level updates
    const response = isFormData
      ? await levelService.postFormData('/edit', payload)
      : await levelService.update(route.params.id, payload);

    // Show success message
    bikMediaNotifications.level.updated();

    // Navigate to list page
    setTimeout(() => {
      router.push('/store/levels');
    }, 1000);

  } catch (error) {
    console.error('Failed to update level:', error);
    showMessage(error.message || t('bikmedia.messages.errors.failedToUpdate'), 'error');
  } finally {
    isSubmitting.value = false;
  }
};

const showMessage = (msg, type = 'success') => {
  // Use the new notification system
  switch (type) {
    case 'success':
      return showSuccessToast(msg);
    case 'error':
      return showErrorToast(msg);
    case 'info':
      return showInfoToast(msg);
    default:
      return showSuccessToast(msg);
  }
};

// Lifecycle Hooks
onMounted(() => {
  // Only load level data if editing is supported
  if (levelConfig.supportsEdit) {
    loadLevel();
  }
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
</style>