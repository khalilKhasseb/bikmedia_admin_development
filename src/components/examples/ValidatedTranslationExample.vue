<template>
  <div class="validated-translation-example">
    <h3>{{ t('bikmedia.pages.gifts.title') }}</h3>
    
    <!-- Using bikmedia shortcuts -->
    <p>Store sections: {{ bikmedia.store.gifts }}, {{ bikmedia.store.equipment }}, {{ bikmedia.store.levels }}</p>
    
    <!-- Using validation helpers -->
    <div class="validation-examples">
      <p v-if="hasTranslation('bikmedia.actions.create')">
        ✅ Translation exists: {{ t('bikmedia.actions.create') }}
      </p>
      
      <p v-if="!hasTranslation('bikmedia.nonexistent.key')">
        ❌ Translation missing for: bikmedia.nonexistent.key
      </p>
      
      <!-- Using helper functions -->
      <p>Validation message: {{ validationMessage('name', 'required') }}</p>
      <p>API error: {{ apiErrorMessage('404') }}</p>
      <p>Confirmation: {{ confirmationMessage('delete', 'gift') }}</p>
    </div>
    
    <!-- Testing fallback behavior -->
    <div class="fallback-test">
      <h4>Fallback Testing</h4>
      <p>Existing key: {{ t('bikmedia.store.gifts') }}</p>
      <p>Non-existent key (shows fallback): {{ t('bikmedia.test.nonexistent.key') }}</p>
    </div>
    
    <!-- Translation status -->
    <div class="translation-status">
      <h4>Translation Status</h4>
      <p>Current locale: {{ locale }}</p>
      <p>All translations for 'bikmedia.actions.create':</p>
      <ul>
        <li v-for="(translation, loc) in getAllTranslations('bikmedia.actions.create')" :key="loc">
          {{ loc }}: {{ translation }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { useValidatedTranslation } from '@/composables/use-validated-translation.js';

const {
  t,
  hasTranslation,
  bikmedia,
  validationMessage,
  apiErrorMessage,
  confirmationMessage,
  getAllTranslations,
  locale
} = useValidatedTranslation();
</script>

<style scoped>
.validated-translation-example {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin: 20px 0;
}

.validation-examples,
.fallback-test,
.translation-status {
  margin: 15px 0;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 4px;
}

.validation-examples p,
.fallback-test p,
.translation-status p {
  margin: 5px 0;
}

.translation-status ul {
  margin: 10px 0;
  padding-left: 20px;
}
</style>