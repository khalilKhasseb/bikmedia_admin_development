<template>
  <div v-if="shouldShowField" class="mb-4">
    <!-- Translatable Field -->
    <TranslationInput v-if="meta.translatable" :fieldName="meta.name" :fieldConfig="meta.config || {}"
      :locales="localesToRender" :modelValue="modelValue" :isSubmitted="isSubmitted" :errors="errors"
      @update:modelValue="$emit('update:modelValue', $event)" />

    <!-- Non-Translatable Field Types -->
    <template v-else>
      <!-- Text / Number / Textarea / Select / Checkbox -->
      <div v-if="!isFileType" class="form-group">
        <label :for="meta.name" class="form-label">
          {{ meta.config?.label || meta.name }}
          <span v-if="meta.config?.required" class="text-danger">*</span>
        </label>

        <!-- Text -->
        <input v-if="inputType === 'text' || inputType === 'number'" :type="inputType === 'number' ? 'number' : 'text'"
          class="form-control" :id="meta.name" :placeholder="meta.config?.placeholder || ''" :min="meta.config?.min"
          :max="meta.config?.max" :required="meta.config?.required" :class="validationClass" v-model="localValue" />

        <!-- Textarea -->
        <textarea v-else-if="inputType === 'textarea'" class="form-control" :id="meta.name"
          :placeholder="meta.config?.placeholder || ''" :rows="meta.config?.rows || 4"
          :maxlength="meta.config?.maxLength" :required="meta.config?.required" :class="validationClass"
          v-model="localValue"></textarea>

        <!-- Select -->
        <select v-else-if="inputType === 'select'" class="form-select" :id="meta.name" :required="meta.config?.required"
          :class="validationClass" v-model="localValue">
          <option v-for="opt in (meta.config?.options || [])" :key="opt.value" :value="opt.value">
            {{ opt.label }}
          </option>
        </select>

        <!-- Checkbox/Boolean -->
        <div v-else-if="inputType === 'checkbox' || inputType === 'boolean'" class="form-check">
          <input class="form-check-input" type="checkbox" :id="meta.name" v-model="checkedValue" />
          <label class="form-check-label" :for="meta.name">{{ meta.config?.label || meta.name }}</label>
        </div>

        <!-- Fallback to text -->
        <input v-else type="text" class="form-control" :id="meta.name" :placeholder="meta.config?.placeholder || ''"
          :required="meta.config?.required" :class="validationClass" v-model="localValue" />

        <!-- Validation Feedback -->
        <div class="valid-feedback">{{ $t('bikmedia.components.dynamicField.looksGood') }}</div>
        <div class="invalid-feedback">{{ fieldError }}</div>
      </div>

      <!-- File Field -->
      <div v-else>
        <!-- Custom Media Layout for Panel Mode -->
        <div v-if="layoutMode === 'custom-panels'">
          <div class="media-upload-box">
            <label class="form-label">{{ meta.config?.label || meta.name }}</label>

            <!-- Current File Preview -->
            <div v-if="currentFileUrl" class="mb-3">
              <label class="form-label text-muted small">{{ $t('bikmedia.components.dynamicField.current') }} {{ meta.config?.label || meta.name }}:</label>
              <div class="current-media-preview">
                <img v-if="isImageFile(currentFileUrl)" :src="currentFileUrl"
                  :alt="`Current ${meta.config?.label || meta.name}`" class="img-thumbnail"
                  style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px;" />
                <div v-else class="animation-placeholder">
                  <div class="d-flex align-items-center justify-content-center bg-light border rounded"
                    style="width: 80px; height: 80px;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                      class="text-muted">
                      <polygon points="23 7 16 12 23 17 23 7"></polygon>
                      <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                    </svg>
                  </div>
                  <small class="text-muted d-block mt-1">{{ getFileName(currentFileUrl) }}</small>
                </div>
              </div>
            </div>

            <div class="custom-file mb-3">
              <input :id="`${meta.name}File`" type="file" class="custom-file-input"
                :accept="meta.config?.accept || 'image/*'" @change="handleFileChange" :class="validationClass" />
              <label :for="`${meta.name}File`" :data-browse="$t('bikmedia.actions.search')" class="custom-file-label">
                <span class="d-block form-file-text">{{ fileData?.file ? fileData.file.name : `${$t('bikmedia.components.dynamicField.choose')} ${meta.config?.label?.toLowerCase() || meta.name} ${$t('bikmedia.components.dynamicField.file')}` }}</span>
              </label>
            </div>
            <small class="text-muted d-block mb-2">{{ $t('bikmedia.components.dynamicField.max') }} {{ meta.config?.maxSize || 5 }}MB. {{ $t('bikmedia.components.dynamicField.allowed') }}: {{ getAcceptedTypes() }}</small>
           
            <div v-if="meta.config?.supportsUrlFallback !== false" class="mb-3">
              <label :for="`${meta.name}Url`" class="form-label">{{ $t('bikmedia.components.dynamicField.orEnter') }} {{ meta.config?.label || meta.name }} {{ $t('bikmedia.components.dynamicField.url') }}</label>
              <input type="url" :id="`${meta.name}Url`" class="form-control" v-model="fileData.url"
                :placeholder="`${$t('bikmedia.components.dynamicField.enter')} ${meta.config?.label?.toLowerCase() || meta.name} URL`" />
              <small class="form-text text-muted">{{ $t('bikmedia.components.dynamicField.note') }}</small>
            </div>
            <div v-if="validationClass === 'is-invalid'" class="invalid-feedback d-block">
              {{ fieldError }}
            </div>
          </div>
        </div>

        <!-- Default File Upload Layout -->
        <FileUploadInput v-else :fieldName="meta.name" :label="meta.config?.label || meta.name" v-model="fileData"
          :accept="meta.config?.accept || 'image/*'" :maxSize="(meta.config?.maxSize || 5) * 1024 * 1024"
          :required="meta.config?.required || false" :showUrlInput="meta.config?.supportsUrlFallback !== false"
          :existingUrl="existingUrl" :isSubmitted="isSubmitted" :errors="errors" />
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import TranslationInput from '@/views/bikmedia/components/TranslationInput.vue';
import FileUploadInput from '@/components/forms/FileUploadInput.vue';
import { evaluateFieldCondition } from '@/config/entities/helpers.js';

const { t } = useI18n();

const props = defineProps({
  fieldConfig: { type: Object, required: true },
  entityConfig: { type: Object, required: true },
  modelValue: { type: Object, required: true },
  isSubmitted: { type: Boolean, default: false },
  errors: { type: Object, default: () => ({}) },
  existingData: { type: Object, default: null },
  selectedLocale: { type: String, default: 'en' },
  mode: { type: String, default: 'create' },
  showAllLocales: { type: Boolean, default: false },
  layoutMode: { type: String, default: 'default' }
});

const emit = defineEmits(['update:modelValue']);

const meta = computed(() => props.fieldConfig);
const inputType = computed(() => meta.value?.config?.type || meta.value?.type || 'text');
const isFileType = computed(() => (meta.value?.config?.type || meta.value?.type) === 'file');

// Check if field should be shown based on condition
const shouldShowField = computed(() => {
  const condition = meta.value?.config?.condition;
  return evaluateFieldCondition(condition, props.modelValue);
});

// Render behavior depends on mode
// - create: render all locales so user can fill all translations
// - edit: render only selected locale to avoid empty fields/flicker
const localesToRender = computed(() => {
  const all = props.entityConfig.supportedLocales || [];
  const isCreate = (props.mode || '').toLowerCase() === 'create';
  if (isCreate) return all;
  if (props.showAllLocales) return all;
  const sel = props.selectedLocale;
  return all.filter(l => l.code === sel);
});

const fieldError = computed(() => props.errors?.[meta.value?.name] || t('bikmedia.components.dynamicField.thisFieldRequired'));

const validationClass = computed(() => {
  if (!props.isSubmitted) return '';
  const hasError = !!props.errors?.[meta.value?.name];
  const value = props.modelValue?.[meta.value?.name];
  if (hasError) return 'is-invalid';
  if (value !== undefined && value !== null && value !== '') return 'is-valid';
  if (meta.value?.config?.required) return 'is-invalid';
  return '';
});

const localValue = computed({
  get() {
    return props.modelValue?.[meta.value?.name];
  },
  set(v) {
    emit('update:modelValue', { ...props.modelValue, [meta.value?.name]: v });
  }
});

const checkedValue = computed({
  get() {
    return !!props.modelValue?.[meta.value?.name];
  },
  set(v) {
    emit('update:modelValue', { ...props.modelValue, [meta.value?.name]: v });
  }
});

const fileDataKey = computed(() => `${meta.value?.name}Data`);
const fileData = computed({
  get() {
    return props.modelValue?.[fileDataKey.value] || { file: null, url: '' };
  },
  set(v) {
    emit('update:modelValue', { ...props.modelValue, [fileDataKey.value]: v });
  }
});

const existingUrl = computed(() => props.existingData?.[meta.value?.name] || '');

// Custom layout file handling
const currentFileUrl = computed(() => {
  if (fileData.value?.file) {
    return URL.createObjectURL(fileData.value.file);
  }
  if (fileData.value?.url) {
    return fileData.value.url;
  }
  return existingUrl.value;
});

const isImageFile = (url) => {
  if (!url) return false;
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
  const lowerUrl = url.toLowerCase();
  return imageExtensions.some(ext => lowerUrl.includes(ext));
};

const getFileName = (url) => {
  if (!url) return '';
  const segments = url.split('/');
  const fileName = segments.pop() || '';
  return fileName.split('?')[0];
};

const getAcceptedTypes = () => {
  const accept = meta.value?.config?.accept || 'image/*';
  if (accept === 'image/*') return 'JPG, PNG, GIF, SVG';
  if (accept.includes('.svga')) return 'SVGA, WEBP, GIF, SVG';
  return accept.replace(/\./g, '').toUpperCase();
};

const handleFileChange = (event) => {
  const file = event.target.files[0];
  const maxSize = (meta.value?.config?.maxSize || 5) * 1024 * 1024;

  if (file) {
    // Check file size
    if (file.size > maxSize) {
      const maxSizeMB = meta.value?.config?.maxSize || 5;
      // You might want to emit an error or show a message here
      console.error(t('bikmedia.components.dynamicField.fileSizeExceeds', { maxSize: maxSizeMB }));
      event.target.value = '';
      fileData.value = { file: null, url: fileData.value?.url || '' };
      return;
    }

    fileData.value = {
      file: file,
      url: fileData.value?.url || ''
    };
  } else {
    fileData.value = {
      file: null,
      url: fileData.value?.url || ''
    };
  }
};
</script>
<style scoped>
/* Custom Media Upload Box Styling */
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