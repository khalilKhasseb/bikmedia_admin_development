/**
 * Common utilities for entity configurations
 * @module config/entities/helpers
 */

/**
 * Standard supported locales (EN and AR)
 * @type {import('./types.js').LocaleConfig[]}
 */
export const STANDARD_LOCALES = [
  { code: 'en', label: 'English', direction: 'ltr' },
  { code: 'ar', label: 'العربية', direction: 'rtl' },
  // { code: 'fa', label: 'فارسی', direction: 'rtl' }
];

/**
 * Generate suffixed field names for API
 * @param {string} fieldName - Base field name
 * @param {string[]} localeCodes - Array of locale codes
 * @returns {string[]} Array of suffixed field names
 * 
 * @example
 * generateSuffixedFields('name', ['en', 'ar']) // ['nameEN', 'nameAR']
 */
export function generateSuffixedFields(fieldName, localeCodes) {
  return localeCodes.map(code => `${fieldName}${code.toUpperCase()}`);
}

/**
 * Safely get a translatable field value using locale suffix
 * @param {Record<string, any>} source
 * @param {string} fieldName
 * @param {string} localeCode
 * @returns {any}
 */
export function getTranslatableFieldValue(source, fieldName, localeCode) {
  if (!source) {
    return undefined;
  }

  const suffixedKey = `${fieldName}${localeCode.toUpperCase()}`;
  return source[suffixedKey];
}

/**
 * Append translatable fields into a target payload (FormData or plain object)
 * @param {FormData|Record<string, any>} target
 * @param {import('./types.js').EntityConfig} entityConfig
 * @param {Record<string, any>} formDataModel
 * @param {{ defaultValue?: any, originalData?: Record<string, any> }} [options]
 */
export function appendTranslatableFields(target, entityConfig, formDataModel, options = {}) {
  const { defaultValue, originalData } = options;
  const translatableFields = entityConfig?.translatableFields ?? [];
  const localeCodes = (entityConfig?.supportedLocales ?? []).map(locale => locale.code);

  translatableFields.forEach(field => {
    const fieldName = typeof field === 'string' ? field : field?.name;
    if (!fieldName) {
      return;
    }

    const fieldConfig = typeof field === 'string' ? {} : field;
    const suffixedFields = generateSuffixedFields(fieldName, localeCodes);

    suffixedFields.forEach((suffixedField, index) => {
      const localeCode = localeCodes[index];
      let value = getTranslatableFieldValue(formDataModel, fieldName, localeCode);

      if (value == null && originalData) {
        value = getTranslatableFieldValue(originalData, fieldName, localeCode);
      }

      if (value == null && defaultValue !== undefined) {
        value = defaultValue;
      }

      if (value == null) {
        value = '';
      }

      const normalizedValue = typeof value === 'string' ? value.trim() : value;
      const shouldSkip =
        (normalizedValue === '' || normalizedValue === null) && !fieldConfig?.required && defaultValue === undefined;

      if (shouldSkip) {
        return;
      }

      if (typeof target.append === 'function') {
        target.append(suffixedField, value);
      } else {
        target[suffixedField] = value;
      }
    });
  });
}

/**
 * Build an object containing translatable field values (all or only changed ones)
 * @param {import('./types.js').EntityConfig} entityConfig
 * @param {Record<string, any>} formDataModel
 * @param {Record<string, any>} originalData
 * @param {'all'|'changed'} [mode='all']
 * @returns {Record<string, any>}
 */
export function buildTranslatableFieldsObject(
  entityConfig,
  formDataModel,
  originalData = {},
  mode = 'all'
) {
  const result = {};
  const translatableFields = entityConfig?.translatableFields ?? [];
  const localeCodes = (entityConfig?.supportedLocales ?? []).map(locale => locale.code);

  translatableFields.forEach(field => {
    const fieldName = typeof field === 'string' ? field : field?.name;
    if (!fieldName) {
      return;
    }

    generateSuffixedFields(fieldName, localeCodes).forEach((suffixedField, index) => {
      const localeCode = localeCodes[index];
      const currentValue = getTranslatableFieldValue(formDataModel, fieldName, localeCode);
      const previousValue = getTranslatableFieldValue(originalData, fieldName, localeCode);

      const normalizedCurrent = currentValue == null ? '' : currentValue;
      const normalizedPrevious = previousValue == null ? '' : previousValue;

      if (mode === 'changed' && normalizedCurrent === normalizedPrevious) {
        return;
      }

      result[suffixedField] = normalizedCurrent;
    });
  });

  return result;
}

/**
 * Get locale by code
 * @param {string} code - Locale code
 * @returns {import('./types.js').LocaleConfig|undefined} Locale config or undefined
 */
export function getLocaleByCode(code) {
  return STANDARD_LOCALES.find(locale => locale.code === code);
}

/**
 * Retrieve the primary locale from an entity configuration
 * @param {import('./types.js').EntityConfig} entityConfig
 * @returns {import('./types.js').LocaleConfig|undefined}
 */
export function getPrimaryLocale(entityConfig) {
  if (!entityConfig) {
    return undefined;
  }

  if (entityConfig.primaryLocale) {
    return entityConfig.primaryLocale;
  }

  return entityConfig.supportedLocales?.[0];
}

/**
 * Get the value of a translatable field for the primary locale
 * @param {import('./types.js').EntityConfig} entityConfig
 * @param {Record<string, any>} source
 * @param {string} fieldName
 * @param {any} [fallback]
 * @returns {any}
 */
export function getPrimaryLocaleFieldValue(entityConfig, source, fieldName, fallback) {
  const primaryLocale = getPrimaryLocale(entityConfig);
  if (!primaryLocale) {
    return fallback;
  }

  const value = getTranslatableFieldValue(source, fieldName, primaryLocale.code);
  return value !== undefined ? value : fallback;
}

/**
 * Validate entity configuration
 * @param {import('./types.js').EntityConfig} config - Entity configuration
 * @throws {Error} If configuration is invalid
 */
export function validateEntityConfig(config) {
  if (!config.entityName) {
    throw new Error('Entity configuration must have an entityName');
  }
  if (!config.apiEndpoint) {
    throw new Error('Entity configuration must have an apiEndpoint');
  }
  if (!config.supportedLocales || config.supportedLocales.length === 0) {
    throw new Error('Entity configuration must have at least one supported locale');
  }
}

/**
 * Initialize form data object based on entity configuration.
 * - Creates suffixed keys for translatable fields (e.g., nameEN, nameAR)
 * - Creates direct keys for non-translatable fields
 * - Initializes file fields as { file: null, url: '' } under `<name>Data`
 * - Applies defaults from config and optionally populates from existing data
 * @param {import('./types.js').EntityConfig} entityConfig
 * @param {Record<string, any>|null} existingData
 * @returns {Record<string, any>}
 */
export function initializeFormData(entityConfig, existingData = null) {
  const model = {};

  const localeCodes = (entityConfig?.supportedLocales ?? STANDARD_LOCALES).map(l => l.code);

  // Translatable fields
  (entityConfig?.translatableFields ?? []).forEach(field => {
    const fieldName = typeof field === 'string' ? field : field?.name;
    if (!fieldName) return;
    generateSuffixedFields(fieldName, localeCodes).forEach((suffixed, idx) => {
      const code = localeCodes[idx];
      const val = existingData ? getTranslatableFieldValue(existingData, fieldName, code) : undefined;
      model[suffixed] = val ?? '';
    });
  });

  // Non-translatable fields
  (entityConfig?.nonTranslatableFields ?? []).forEach(field => {
    const defVal = field?.default;
    const existingVal = existingData?.[field.name];
    if (field.type === 'file') {
      const key = `${field.name}Data`;
      const existingUrl = typeof existingVal === 'string' ? existingVal : '';
      model[key] = { file: null, url: existingUrl };
    } else {
      model[field.name] = existingVal ?? (defVal !== undefined ? defVal : (field.type === 'number' ? 0 : ''));
    }
  });

  return model;
}

/**
 * Get combined list of all field configs with metadata
 * @param {import('./types.js').EntityConfig} entityConfig
 * @returns {Array<{ name: string, type: string, translatable: boolean, config: any }>} 
 */
export function getAllFieldConfigs(entityConfig) {
  const trans = (entityConfig?.translatableFields ?? []).map(cfg => ({
    name: typeof cfg === 'string' ? cfg : cfg.name,
    type: typeof cfg === 'string' ? 'text' : cfg.type,
    translatable: true,
    config: typeof cfg === 'string' ? {} : cfg
  }));
  const nonTrans = (entityConfig?.nonTranslatableFields ?? []).map(cfg => ({
    name: cfg.name,
    type: cfg.type,
    translatable: false,
    config: cfg
  }));
  return [...trans, ...nonTrans];
}

/**
 * Find a field config by name across both translatable and non-translatable arrays
 * @param {import('./types.js').EntityConfig} entityConfig
 * @param {string} fieldName
 * @returns {{ name: string, type: string, translatable: boolean, config: any }|null}
 */
export function getFieldConfigByName(entityConfig, fieldName) {
  const trans = (entityConfig?.translatableFields ?? []).find(f => (typeof f === 'string' ? f : f.name) === fieldName);
  if (trans) {
    const cfg = typeof trans === 'string' ? {} : trans;
    return { name: fieldName, type: cfg.type || 'text', translatable: true, config: cfg };
  }
  const non = (entityConfig?.nonTranslatableFields ?? []).find(f => f.name === fieldName);
  if (non) {
    return { name: fieldName, type: non.type, translatable: false, config: non };
  }
  return null;
}

/**
 * Validate fields dynamically based on entity config
 * - Required rule for non-translatable fields
 * - For translatable, require at least one locale if required
 * @param {import('./types.js').EntityConfig} entityConfig
 * @param {Record<string, any>} model
 * @param {{ requireAtLeastOneLocale?: boolean }} [options]
 * @returns {{ valid: boolean, errors: Record<string, string> }}
 */
export function validateEntityFields(entityConfig, model, options = {}) {
  const errors = {};
  const locales = (entityConfig?.supportedLocales ?? STANDARD_LOCALES).map(l => l.code);

  // Non-translatable
  (entityConfig?.nonTranslatableFields ?? []).forEach(field => {
    if (field.required) {
      if (field.type === 'file') {
        const key = `${field.name}Data`;
        const val = model?.[key] || {};
        if (!val.file && !val.url) {
          errors[field.name] = `${field.label || field.name} is required`;
        }
      } else {
        const val = model?.[field.name];
        if (val === undefined || val === null || val === '') {
          errors[field.name] = `${field.label || field.name} is required`;
        }
      }
    }
  });

  // Translatable
  (entityConfig?.translatableFields ?? []).forEach(field => {
    const cfg = typeof field === 'string' ? { name: field } : field;
    if (!cfg.name) return;
    if (cfg.required) {
      const hasValue = locales.some(code => {
        const key = `${cfg.name}${code.toUpperCase()}`;
        const val = model?.[key];
        return typeof val === 'string' ? val.trim() !== '' : !!val;
      });
      if (!hasValue) {
        locales.forEach(code => {
          const key = `${cfg.name}${code.toUpperCase()}`;
          errors[key] = `${cfg.label || cfg.name} is required in at least one language`;
        });
      }
    }
  });

  return { valid: Object.keys(errors).length === 0, errors };
}

/**
 * Build payload for create/update
 * - For 'create': always FormData (handles files) unless forceObject option is set
 * - For 'update': plain object with changed fields, unless files present -> FormData
 * - Automatically includes translatable fields
 * @param {import('./types.js').EntityConfig} entityConfig
 * @param {Record<string, any>} model
 * @param {Record<string, any>|null} original
 * @param {'create'|'update'} mode
 * @param {{ forceObject?: boolean, id?: string|number }} [options]
 * @returns {FormData|Record<string, any>}
 */
export function buildDynamicPayload(entityConfig, model, original = null, mode = 'create', options = {}) {
  const { forceObject = false, id, updateStrategy = 'all' } = options;

  const hasFiles = (entityConfig?.nonTranslatableFields ?? []).some(f => f.type === 'file' && (model?.[`${f.name}Data`]?.file));
  const useFormData = mode === 'create' ? !forceObject : hasFiles;

  if (useFormData) {
    const fd = new FormData();
    if (mode === 'update' && id != null) fd.append('id', String(id));

    // Translatable
    if (mode === 'create' || updateStrategy === 'all') {
      appendTranslatableFields(fd, entityConfig, model, { defaultValue: '' });
    } else {
      appendTranslatableFields(fd, entityConfig, model, { originalData: mode === 'update' ? (original || {}) : undefined, defaultValue: '' });
    }

    // Non-translatable
    (entityConfig?.nonTranslatableFields ?? []).forEach(field => {
      if (field.type === 'file') {
        const data = model?.[`${field.name}Data`] || {};
        if (data.file) {
          fd.append(field.name, data.file);
        } else if (typeof data.url === 'string' && data.url !== '') {
          if (mode === 'create' || updateStrategy === 'all' || (original && data.url !== (original[field.name] || ''))) {
            fd.append(field.name, data.url);
          }
        } else if (mode === 'update' && updateStrategy === 'all' && original?.[field.name]) {
          // Preserve original file URL if no new file is provided (for conditionally hidden fields)
          fd.append(field.name, original[field.name]);
        }
      } else {
        const value = model?.[field.name];
        if (mode === 'create') {
          // For create, only include if value is defined
          if (value !== undefined) fd.append(field.name, String(value));
        } else if (updateStrategy === 'all') {
          // For update with 'all' strategy, always include field
          // Use model value if present, otherwise fallback to original to preserve data
          const finalValue = value !== undefined ? value : (original?.[field.name] ?? field.default ?? (field.type === 'number' ? 0 : ''));
          fd.append(field.name, String(finalValue));
        } else {
          // For 'changed' strategy, only include if changed
          const prev = original?.[field.name];
          if (value !== prev) {
            fd.append(field.name, String(value));
          }
        }
      }
    });

    return fd;
  }

  // Plain object path (update without files)
  const out = {};

  // Translatable
  if (mode === 'create' || updateStrategy === 'all') {
    const transAll = buildTranslatableFieldsObject(entityConfig, model, original || {}, 'all');
    Object.assign(out, transAll);
  } else {
    const transChanged = buildTranslatableFieldsObject(entityConfig, model, original || {}, 'changed');
    Object.assign(out, transChanged);
  }

  // Some backends also expect primary name without suffix
  const primaryLocale = getPrimaryLocale(entityConfig);
  const hasTranslatableName = (entityConfig?.translatableFields || []).some(f => (typeof f === 'string' ? f : f.name) === 'name');
  if (primaryLocale && hasTranslatableName) {
    const key = `${'name'}${primaryLocale.code.toUpperCase()}`;
    if (model[key] !== (original?.nameEN || original?.name)) {
      if (model[key] !== undefined) out.name = model[key] || '';
    }
  }

  (entityConfig?.nonTranslatableFields ?? []).forEach(field => {
    if (field.type === 'file') {
      const data = model?.[`${field.name}Data`] || {};
      const originalUrl = original?.[field.name] || '';
      if (updateStrategy === 'all') {
        if (data.file) {
          out[field.name] = data.file;
        } else if (typeof data.url === 'string' && data.url !== '') {
          out[field.name] = data.url;
        } else if (mode === 'update' && originalUrl) {
          // Preserve original file URL if no new file is provided (for conditionally hidden fields)
          out[field.name] = originalUrl;
        }
      } else if (!data.file && typeof data.url === 'string' && data.url !== '' && data.url !== originalUrl) {
        out[field.name] = data.url;
      }
    } else {
      const curr = model?.[field.name];
      const prev = original?.[field.name];
      if (mode === 'create') {
        // For create, only include if value is defined
        if (curr !== undefined) out[field.name] = curr;
      } else if (updateStrategy === 'all') {
        // For update with 'all' strategy, always include field
        // Use model value if present, otherwise fallback to original to preserve data
        out[field.name] = curr !== undefined ? curr : (prev ?? field.default ?? (field.type === 'number' ? 0 : ''));
      } else {
        // For 'changed' strategy, only include if changed
        if (curr !== prev) out[field.name] = curr;
      }
    }
  });

  return out;
}

/**
 * Evaluate a field's condition to determine if it should be shown
 * @param {Function|Object|undefined} condition - Condition to evaluate
 * @param {Record<string, any>} modelValue - Current form data
 * @returns {boolean} True if field should be shown
 */
export function evaluateFieldCondition(condition, modelValue) {
  if (!condition) return true; // No condition = always show

  // Function condition: (modelValue) => boolean
  if (typeof condition === 'function') {
    return condition(modelValue);
  }

  // Object condition: { field: 'type', operator: '===', value: 7 }
  if (typeof condition === 'object' && condition.field) {
    const operator = condition.operator || '===';
    const expectedValue = condition.value;

    // Get raw field value
    let fieldValue = modelValue[condition.field];

    // Helpers to normalize common types to avoid string/number/boolean mismatches
    const toBool = (v) => {
      if (typeof v === 'boolean') return v;
      if (typeof v === 'number') return v !== 0;
      if (typeof v === 'string') return v.toLowerCase() === 'true' || v === '1';
      return !!v;
    };
    const toNum = (v) => {
      if (typeof v === 'number') return v;
      const n = Number(v);
      return Number.isNaN(n) ? v : n;
    };

    // Coerce field value to the type of expectedValue when appropriate
    if (typeof expectedValue === 'boolean') {
      fieldValue = toBool(fieldValue);
    } else if (typeof expectedValue === 'number') {
      fieldValue = toNum(fieldValue);
    }

    switch (operator) {
      case '===':
        return fieldValue === expectedValue;
      case '!==':
        return fieldValue !== expectedValue;
      case '==':
        // eslint-disable-next-line eqeqeq
        return fieldValue == expectedValue;
      case '!=':
        // eslint-disable-next-line eqeqeq
        return fieldValue != expectedValue;
      case '>':
        return fieldValue > expectedValue;
      case '>=':
        return fieldValue >= expectedValue;
      case '<':
        return fieldValue < expectedValue;
      case '<=':
        return fieldValue <= expectedValue;
      case 'in': {
        const arr = Array.isArray(expectedValue) ? expectedValue : [];
        return arr.some(v => {
          if (typeof v === 'boolean') return toBool(fieldValue) === v;
          if (typeof v === 'number') return toNum(fieldValue) === v;
          return String(fieldValue) === String(v);
        });
      }
      case 'notIn': {
        const arr = Array.isArray(expectedValue) ? expectedValue : [];
        return !arr.some(v => {
          if (typeof v === 'boolean') return toBool(fieldValue) === v;
          if (typeof v === 'number') return toNum(fieldValue) === v;
          return String(fieldValue) === String(v);
        });
      }
      default:
        return true;
    }
  }

  return true;
}
