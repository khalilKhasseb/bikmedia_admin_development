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
          <h5 class="modal-title">{{ $t('bikmedia.modals.subGift.addSubGift') }}</h5>
          <button type="button" class="btn-close" @click="handleClose" :aria-label="$t('bikmedia.actions.close')"></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label class="form-label">{{ $t('bikmedia.modals.subGift.iconName') }}</label>
            <input 
              type="text" 
              class="form-control" 
              v-model.trim="form.name" 
              :class="{ 'is-invalid': isSubmitted && !form.name }" 
              :placeholder="$t('bikmedia.modals.subGift.placeholders.enterSubgiftName')" 
            />
            <div class="invalid-feedback">{{ $t('bikmedia.modals.subGift.validation.nameRequired') }}</div>
          </div>

          <div class="mb-3">
            <label class="form-label">{{ $t('bikmedia.modals.subGift.iconFile') }}</label>
            <div class="custom-file">
              <input 
                id="SubGiftIconFile" 
                type="file" 
                class="custom-file-input" 
                accept="image/*,.svga,.svg"
                @click="clearFile"
                @change="handleFileChange"
                :class="{ 'is-invalid': isSubmitted && !form.iconData?.file }"
              />
              <label @click="clearFile" for="SubGiftIconFile" :data-browse="$t('bikmedia.actions.search')" class="custom-file-label">
                <span class="d-block form-file-text">{{ form.iconData?.file ? form.iconData.file.name : $t('bikmedia.modals.subGift.chooseFile') }}</span>
              </label>
            </div>
            <small class="text-muted d-block mt-3">{{ $t('bikmedia.modals.subGift.maxFileSize') }}</small>
            <div v-if="isSubmitted && !form.iconData?.file" class="invalid-feedback d-block">
              {{ $t('bikmedia.modals.subGift.validation.fileRequired') }}
            </div>
          </div>

          <div v-if="errorMessage" class="alert alert-danger py-2">{{ errorMessage }}</div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" :disabled="isSubmitting" @click="handleClose">{{ $t('bikmedia.actions.cancel') }}</button>
          <button type="button" class="btn btn-primary" :disabled="isSubmitting" @click="handleSubmit">
            <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
            {{ isSubmitting ? $t('bikmedia.modals.subGift.adding') : $t('bikmedia.modals.subGift.addSubGift') }}
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
import { useI18n } from 'vue-i18n';
import giftService from '@/services/api/gift.service.js';

const { t } = useI18n();

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
  console.log('event => ',event);
  
  const file = event.target.files[0];
  console.log('file changed => ',file);

  if (file) {
    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      errorMessage.value = t('bikmedia.modals.subGift.validation.fileSizeExceeds');
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

function clearFile() {
  console.log("Clicked")
  form.iconData = { file: null, url: '' };
}

async function handleSubmit() {
  isSubmitted.value = true;
  errorMessage.value = '';

  if (!form.name) {
    errorMessage.value = t('bikmedia.modals.subGift.validation.provideName');
    return;
  }
  if (!form.iconData?.file) {
    errorMessage.value = t('bikmedia.modals.subGift.validation.selectIconFile');
    return;
  }

  try {
    isSubmitting.value = true;
    await giftService.addSubGift(props.giftId, { name: form.name, file: form.iconData.file });
    emit('success');
    emit('close');
  } catch (e) {
    errorMessage.value = e?.message || t('bikmedia.modals.subGift.validation.failedToAdd');
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
