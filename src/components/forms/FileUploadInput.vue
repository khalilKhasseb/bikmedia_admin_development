<template>
  <div class="form-group mb-4">
    <!-- Label -->
    <label class="form-label">
      {{ label || fieldName }}
      <span class="text-danger" v-if="required">*</span>
    </label>

    <!-- Custom File Container (file-upload-with-preview pattern) -->
    <div class="custom-file-container" :data-upload-id="uploadId">
      <label>
        {{ label || fieldName }}
        <a 
          href="javascript:void(0)" 
          class="custom-file-container__image-clear" 
          title="Clear Image"
          @click="clearFile"
        >
          x
        </a>
      </label>
      <label class="custom-file-container__custom-file">
        <input 
          ref="fileInput"
          type="file" 
          class="custom-file-container__custom-file__custom-file-input" 
          :accept="accept"
          @change="handleFileChange"
        />
        <input type="hidden" name="MAX_FILE_SIZE" :value="maxSize" />
        <span class="custom-file-container__custom-file__custom-file-control"></span>
      </label>
      
      <!-- Preview Area -->
      <div class="custom-file-container__image-preview" ref="previewContainer">
        <!-- SVGA File Preview (non-image) -->
        <div v-if="previewUrl && isSvgaFile" class="svga-preview-placeholder">
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
            <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
            <polyline points="13 2 13 9 20 9"></polyline>
          </svg>
          <div class="mt-2">{{ fileName }}</div>
          <span class="badge badge-info mt-1">SVGA Animation</span>
        </div>
      </div>
    </div>

    <!-- Hidden input for validation feedback -->
    <input 
      type="hidden" 
      class="form-control" 
      :class="validationClass"
      :value="previewUrl || ''"
    />

    <!-- URL Fallback Input -->
    <div v-if="showUrlInput" class="mt-3">
      <label :for="urlInputId" class="form-label">Or enter URL:</label>
      <input 
        type="url"
        :id="urlInputId"
        class="form-control"
        v-model="urlValue"
        :placeholder="'Enter ' + (label || fieldName) + ' URL'"
        @input="handleUrlChange"
      />
      <small class="form-text text-muted">
        Note: Uploaded files take priority over URLs
      </small>
    </div>

    <!-- Validation Feedback -->
    <div v-if="validationClass === 'is-valid'" class="valid-feedback d-block">
      File uploaded successfully!
    </div>
    <div v-if="validationClass === 'is-invalid'" class="invalid-feedback d-block">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import FileUploadWithPreview from 'file-upload-with-preview';
import '/src/assets/sass/forms/file-upload-with-preview.min.css';

const props = defineProps({
  fieldName: {
    type: String,
    required: true
  },
  label: {
    type: String,
    default: ''
  },
  modelValue: {
    type: Object,
    required: true
  },
  accept: {
    type: String,
    default: 'image/*'
  },
  maxSize: {
    type: Number,
    default: 5242880 // 5MB
  },
  required: {
    type: Boolean,
    default: false
  },
  showUrlInput: {
    type: Boolean,
    default: true
  },
  existingUrl: {
    type: String,
    default: ''
  },
  isSubmitted: {
    type: Boolean,
    default: false
  },
  errors: {
    type: Object,
    default: () => ({})
  },
  // Auto-upload integration props
  service: {
    type: Object,
    default: null
  },
  endpoint: {
    type: String,
    default: ''
  },
  autoUpload: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue', 'uploaded', 'upload-error']);

// Reactive State
const fileInput = ref(null);
const previewContainer = ref(null);
const selectedFile = ref(null);
const filePreviewUrl = ref(null);
const fileSizeError = ref('');
let uploadInstance = null;

// Computed Properties
const uploadId = computed(() => 'upload-' + props.fieldName);

const urlInputId = computed(() => 'url-input-' + props.fieldName);

const urlValue = computed({
  get() {
    return props.modelValue?.url || '';
  },
  set(value) {
    emit('update:modelValue', {
      file: selectedFile.value,
      url: value
    });
  }
});

const previewUrl = computed(() => {
  if (filePreviewUrl.value) {
    return filePreviewUrl.value;
  }
  if (props.modelValue?.url) {
    return props.modelValue.url;
  }
  if (props.existingUrl) {
    return props.existingUrl;
  }
  return null;
});

const fileName = computed(() => {
  if (selectedFile.value) {
    return selectedFile.value.name;
  }
  if (props.modelValue?.url) {
    const urlPath = props.modelValue.url.split('/').pop();
    return urlPath || 'File';
  }
  if (props.existingUrl) {
    const urlPath = props.existingUrl.split('/').pop();
    return urlPath || 'File';
  }
  return 'File';
});

const isSvgaFile = computed(() => {
  if (selectedFile.value) {
    const extension = selectedFile.value.name.split('.').pop().toLowerCase();
    return extension === 'svga';
  }
  
  const url = previewUrl.value || '';
  const extension = url.split('.').pop().toLowerCase().split('?')[0];
  return extension === 'svga';
});

const validationClass = computed(() => {
  if (!props.isSubmitted) return '';
  if (props.errors[props.fieldName]) return 'is-invalid';
  if (props.required && !previewUrl.value) return 'is-invalid';
  if (previewUrl.value) return 'is-valid';
  return '';
});

const errorMessage = computed(() => {
  if (props.errors[props.fieldName]) {
    return props.errors[props.fieldName];
  }
  if (fileSizeError.value) {
    return fileSizeError.value;
  }
  if (props.required && !previewUrl.value) {
    return `Please upload ${props.label || props.fieldName}`;
  }
  return '';
});

// Methods
const handleFileChange = async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  
  // Validate file size
  if (file.size > props.maxSize) {
    fileSizeError.value = `File size exceeds ${formatFileSize(props.maxSize)}`;
    // Reset file input
    fileInput.value.value = '';
    return;
  }
  
  // Clear any previous error
  fileSizeError.value = '';
  
  // Revoke previous object URL to prevent memory leak
  if (filePreviewUrl.value) {
    URL.revokeObjectURL(filePreviewUrl.value);
  }
  
  // Store file
  selectedFile.value = file;
  
  // Create preview URL
  filePreviewUrl.value = URL.createObjectURL(file);
  
  // Emit update
  emit('update:modelValue', {
    file: file,
    url: props.modelValue?.url || ''
  });
  
  // Auto-upload if enabled
  if (props.autoUpload && props.service && props.endpoint) {
    try {
      const formData = new FormData();
      formData.append(props.fieldName, file);
      
      const response = await props.service.postFormData(props.endpoint, formData);
      emit('uploaded', response);
    } catch (error) {
      emit('upload-error', error);
    }
  }
};

const handleUrlChange = () => {
  emit('update:modelValue', {
    file: selectedFile.value,
    url: urlValue.value
  });
};

const clearFile = () => {
  // Revoke object URL
  if (filePreviewUrl.value) {
    URL.revokeObjectURL(filePreviewUrl.value);
    filePreviewUrl.value = null;
  }
  
  // Clear file
  selectedFile.value = null;
  
  // Reset file input
  if (fileInput.value) {
    fileInput.value.value = '';
  }
  
  // Clear library instance
  if (uploadInstance) {
    uploadInstance.clearPreviewPanel();
  }
  
  // Clear error
  fileSizeError.value = '';
  
  // Emit update
  emit('update:modelValue', {
    file: null,
    url: props.modelValue?.url || ''
  });
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

// Watchers
watch(() => props.existingUrl, (newUrl) => {
  if (newUrl && !selectedFile.value && uploadInstance) {
    // Update preview to show existing URL
    // The library will handle this through the preview container
  }
});

// Lifecycle Hooks
onMounted(() => {
  // Initialize file-upload-with-preview library
  uploadInstance = new FileUploadWithPreview(uploadId.value, {
    images: {
      baseImage: '/src/assets/images/file-preview.png',
      backgroundImage: ''
    },
    text: {
      chooseFile: 'Choose file...',
      browse: 'Browse',
      selectedCount: 'files selected'
    }
  });
  
  // If existingUrl provided, show it in preview
  if (props.existingUrl && previewContainer.value) {
    // For non-SVGA files that can be displayed as images
    if (!isSvgaFile.value) {
      const img = document.createElement('img');
      img.src = props.existingUrl;
      img.style.maxWidth = '200px';
      img.style.maxHeight = '200px';
      previewContainer.value.appendChild(img);
    }
  }
});

onBeforeUnmount(() => {
  // Cleanup: Revoke object URL to prevent memory leaks
  if (filePreviewUrl.value) {
    URL.revokeObjectURL(filePreviewUrl.value);
  }
  
  // Cleanup library instance if needed
  if (uploadInstance && uploadInstance.destroy) {
    uploadInstance.destroy();
  }
});
</script>

<style scoped>
/* SVGA preview placeholder */
.svga-preview-placeholder {
  padding: 2rem;
  text-align: center;
  border: 1px solid #e0e6ed;
  border-radius: 8px;
  background-color: #f8f9fa;
}

.svga-preview-placeholder svg {
  color: #888;
}

/* Validation feedback display */
.valid-feedback.d-block,
.invalid-feedback.d-block {
  display: block !important;
}
</style>
