<template>
  <div class="row">
    <div 
      v-for="locale in locales" 
      :key="locale.code"
      :class="getColumnClass()"
    >
      <div class="form-group">
        <label 
          :for="getInputId(locale.code)" 
          class="form-label"
        >
          {{ fieldConfig?.label || fieldName }} ({{ locale.label }})
          <span class="text-danger" v-if="isRequired">*</span>
        </label>

        <!-- Text Input -->
        <input
          v-if="inputType === 'text'"
          type="text"
          class="form-control"
          :id="getInputId(locale.code)"
          v-model="localeModel(locale.code).value"
          :placeholder="getPlaceholder(locale.code)"
          :dir="locale.direction"
          :maxlength="fieldConfig?.maxLength"
          :required="isRequired"
          :class="getValidationClass(locale.code)"
        />

        <!-- Textarea -->
        <textarea
          v-else-if="inputType === 'textarea'"
          class="form-control"
          :id="getInputId(locale.code)"
          v-model="localeModel(locale.code).value"
          :placeholder="getPlaceholder(locale.code)"
          :dir="locale.direction"
          :maxlength="fieldConfig?.maxLength"
          :rows="fieldConfig?.rows || 4"
          :required="isRequired"
          :class="getValidationClass(locale.code)"
        ></textarea>

        <!-- Fallback: Default Text Input -->
        <input
          v-else
          type="text"
          class="form-control"
          :id="getInputId(locale.code)"
          v-model="localeModel(locale.code).value"
          :placeholder="getPlaceholder(locale.code)"
          :dir="locale.direction"
          :maxlength="fieldConfig?.maxLength"
          :required="isRequired"
          :class="getValidationClass(locale.code)"
        />

        <!-- Validation Feedback -->
        <div class="valid-feedback">Looks good!</div>
        <div class="invalid-feedback">{{ getErrorMessage(locale.code) }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { generateSuffixedFields } from '@/config/entities/helpers.js';

/**
 * TranslationInput Component
 * 
 * Reusable component for rendering translatable input fields dynamically
 * based on entity configuration. Extracts the hardcoded bilingual pattern
 * from equipments.vue into a reusable, config-driven component.
 * 
 * Uses Bootstrap 5 classes provided by template (form-control, validation classes)
 * and adds application-specific logic for entity config integration.
 */

const props = defineProps({
  /**
   * Base field name without suffix (e.g., 'name', 'description')
   */
  fieldName: {
    type: String,
    required: true
  },

  /**
   * Field configuration from entity config
   * Contains: type, required, maxLength, rows, placeholder, label
   */
  fieldConfig: {
    type: Object,
    required: false,
    default: null
  },

  /**
   * Optional: Input type override (when not using fieldConfig)
   */
  type: {
    type: String,
    required: false,
    default: null
  },

  /**
   * Optional: Required flag override (when not using fieldConfig)
   */
  required: {
    type: Boolean,
    required: false,
    default: false
  },

  /**
   * Optional: Column size for responsive layout (default: 6 for 2 locales)
   */
  cols: {
    type: Number,
    required: false,
    default: null
  },

  /**
   * Locale array from entity config
   * Format: [{ code: 'en', label: 'English', direction: 'ltr' }, ...]
   */
  locales: {
    type: Array,
    required: true
  },

  /**
   * Form data object with suffixed keys
   * Example: { nameEN: 'Test', nameAR: 'اختبار', ... }
   */
  modelValue: {
    type: Object,
    required: true
  },

  /**
   * Form submission state for validation display
   */
  isSubmitted: {
    type: Boolean,
    default: false
  },

  /**
   * Validation errors with suffixed field names as keys
   */
  errors: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['update:modelValue']);

/**
 * Computed: Input type (from fieldConfig or type prop)
 */
const inputType = computed(() => {
  const t = props.fieldConfig?.type || props.type || 'text';
  return ['text', 'textarea'].includes(t) ? t : 'text';
});

/**
 * Computed: Required flag (from fieldConfig or required prop)
 */
const isRequired = computed(() => {
  return props.fieldConfig?.required ?? !!props.required;
});

/**
 * Generate suffixed field name for API using centralized helper
 * @param {string} localeCode - Locale code (e.g., 'en', 'ar')
 * @returns {string} Suffixed field name (e.g., 'nameEN', 'nameAR')
 */
const getSuffixedFieldName = (localeCode) => {
  // Use helper from config/entities/helpers.js
  const suffixedFields = generateSuffixedFields(props.fieldName, [localeCode]);
  return suffixedFields[0];
};

/**
 * Generate unique input ID for label/input association
 * @param {string} localeCode - Locale code
 * @returns {string} Input ID (e.g., 'name_en', 'description_ar')
 */
const getInputId = (localeCode) => {
  return `${props.fieldName}_${localeCode}`;
};

/**
 * Create locale-scoped computed binding for v-model
 * @param {string} localeCode - Locale code
 * @returns {Object} Computed ref with getter/setter
 */
const localeModel = (localeCode) => {
  return computed({
    get: () => props.modelValue[getSuffixedFieldName(localeCode)] || '',
    set: (value) => {
      const updatedValue = {
        ...props.modelValue,
        [getSuffixedFieldName(localeCode)]: value
      };
      emit('update:modelValue', updatedValue);
    }
  });
};

/**
 * Get placeholder text for locale
 * @param {string} localeCode - Locale code
 * @returns {string} Placeholder text
 */
const getPlaceholder = (localeCode) => {
  const ph = props.fieldConfig?.placeholder;
  if (!ph) return '';
  if (typeof ph === 'string') return ph;
  return ph[localeCode] || '';
};

/**
 * Get column class based on locale count or cols prop
 * @returns {string} Bootstrap column class
 */
const getColumnClass = () => {
  if (props.cols) {
    return `col-md-${props.cols} mb-4`;
  }
  
  // Auto-calculate based on locale count
  const localeCount = props.locales.length;
  if (localeCount <= 2) return 'col-md-6 mb-4';
  if (localeCount === 3) return 'col-md-4 mb-4';
  if (localeCount === 4) return 'col-md-3 mb-4';
  return 'col-md-6 mb-4'; // Default fallback
};

/**
 * Get Bootstrap validation class for input
 * @param {string} localeCode - Locale code
 * @returns {string} Validation class ('is-valid', 'is-invalid', or '')
 */
const getValidationClass = (localeCode) => {
  if (!props.isSubmitted) return '';
  
  const suffixedFieldName = getSuffixedFieldName(localeCode);
  const fieldValue = props.modelValue?.[suffixedFieldName];
  const hasError = props.errors[suffixedFieldName];
  
  if (hasError) return 'is-invalid';
  if (isRequired.value && !fieldValue) return 'is-invalid';
  if (fieldValue) return 'is-valid';
  
  return '';
};

/**
 * Get error message for locale
 * @param {string} localeCode - Locale code
 * @returns {string} Error message
 */
const getErrorMessage = (localeCode) => {
  const suffixedFieldName = getSuffixedFieldName(localeCode);
  const customError = props.errors[suffixedFieldName];
  
  if (customError) return customError;
  
  const locale = props.locales.find(l => l.code === localeCode);
  return `Please fill the ${props.fieldConfig?.label || props.fieldName} (${locale?.label || localeCode})`;
};
</script>

<style scoped>
/* RTL text alignment for Arabic inputs */
.form-control[dir="rtl"] {
  text-align: right;
}

/* Optional: Add visual indicator for RTL fields */
.form-control[dir="rtl"]::placeholder {
  text-align: right;
}
</style>
