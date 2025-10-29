<template>
  <!-- Standard Modal (No Animation) -->
  <div 
    class="modal" 
    :class="{ show: show }" 
    tabindex="-1" 
    role="dialog" 
    :style="show ? 'display:block;' : ''" 
    aria-modal="true"
  >
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Add Sub Gift</h5>
          <button type="button" class="btn-close" @click="handleClose" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label class="form-label">Icon Name</label>
            <input 
              type="text" 
              class="form-control" 
              v-model.trim="form.name" 
              :class="{ 'is-invalid': isSubmitted && !form.name }" 
              placeholder="Enter subgift name" 
            />
            <div class="invalid-feedback">Name is required</div>
          </div>

          <div class="mb-3">
            <label class="form-label">Icon File</label>
            <div class="custom-file">
              <input 
                id="iconFile" 
                type="file" 
                class="custom-file-input" 
                accept="image/*,.svga,.svg"
                @change="handleFileChange"
                :class="{ 'is-invalid': isSubmitted && !form.iconData?.file }"
              />
              <label for="iconFile" data-browse="Browse" class="custom-file-label">
                <span class="d-block form-file-text">{{ form.iconData?.file ? form.iconData.file.name : 'Choose file...' }}</span>
              </label>
            </div>
            <small class="text-muted d-block mt-3">Max 5MB. Allowed: images, .svga, .svg</small>
            <div v-if="isSubmitted && !form.iconData?.file" class="invalid-feedback d-block">
              Please select an icon file
            </div>
          </div>

          <div v-if="errorMessage" class="alert alert-danger py-2">{{ errorMessage }}</div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" :disabled="isSubmitting" @click="handleClose">Cancel</button>
          <button type="button" class="btn btn-primary" :disabled="isSubmitting" @click="handleSubmit">
            <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
            {{ isSubmitting ? 'Adding...' : 'Add Sub Gift' }}
          </button>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Modal Backdrop -->
  <div v-if="show" class="modal-backdrop fade show" @click="handleClose"></div>
</template>

<script setup>
import { reactive, ref, watch } from 'vue';
import giftService from '@/services/api/gift.service.js';

const props = defineProps({
  giftId: { type: [String, Number], required: true },
  show: { type: Boolean, default: false }
});

const emit = defineEmits(['close', 'success']);

const form = reactive({
  name: '',
  iconData: { file: null, url: '' }
});

const isSubmitting = ref(false);
const isSubmitted = ref(false);
const errorMessage = ref('');

watch(() => props.show, (v) => {
  if (v) {
    resetForm();
  }
});

function resetForm() {
  form.name = '';
  form.iconData = { file: null, url: '' };
  isSubmitting.value = false;
  isSubmitted.value = false;
  errorMessage.value = '';
}

function handleClose() {
  emit('close');
}

function handleFileChange(event) {
  const file = event.target.files[0];
  if (file) {
    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      errorMessage.value = 'File size exceeds 5MB limit';
      event.target.value = ''; // Clear the input
      form.iconData = { file: null, url: '' };
      return;
    }
    
    form.iconData = { file: file, url: '' };
    errorMessage.value = ''; // Clear any previous errors
  } else {
    form.iconData = { file: null, url: '' };
  }
}

async function handleSubmit() {
  isSubmitted.value = true;
  errorMessage.value = '';

  if (!form.name) {
    errorMessage.value = 'Please provide a name.';
    return;
  }
  if (!form.iconData?.file) {
    errorMessage.value = 'Please select an icon file.';
    return;
  }

  try {
    isSubmitting.value = true;
    await giftService.addSubGift(props.giftId, { name: form.name, file: form.iconData.file });
    emit('success');
    emit('close');
  } catch (e) {
    errorMessage.value = e?.message || 'Failed to add sub gift';
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<style scoped>
.modal { 
  background: rgba(0,0,0,0.3); 
}
</style>
