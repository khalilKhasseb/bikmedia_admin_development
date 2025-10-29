/**
 * Validates entity form fields against config requirements
 * @param {object} config - Entity configuration
 * @param {object} model - Form data model
 * @returns {{errors: object, isValid: boolean}}
 */
export function validateEntityForm(config, model) {
  const errors = {};

  // Validate non-translatable fields
  config.nonTranslatableFields?.forEach(field => {
    if (field.required && (!model[field.name] || String(model[field.name]).trim() === '')) {
      errors[field.name] = `${field.label || field.name} is required`;
    }
  });

  // Validate translatable fields
  config.translatableFields?.forEach(field => {
    if (field.required) {
      const hasValue = config.supportedLocales.some(locale => {
        const key = `${field.name}${locale.code.toUpperCase()}`;
        return model[key] && String(model[key]).trim() !== '';
      });
      
      if (!hasValue) {
        config.supportedLocales.forEach(locale => {
          const key = `${field.name}${locale.code.toUpperCase()}`;
          errors[key] = `${field.label || field.name} is required in at least one language`;
        });
      }
    }
  });

  return {
    errors,
    isValid: Object.keys(errors).length === 0
  };
}

/**
 * Checks if any translatable fields have changed
 * @param {object} config - Entity configuration
 * @param {object} model - Current form data
 * @param {object} original - Original data
 * @returns {boolean}
 */
export function hasTranslatableChanges(config, model, original) {
  return config.translatableFields?.some(field => {
    return config.supportedLocales.some(locale => {
      const key = `${field.name}${locale.code.toUpperCase()}`;
      return model[key] !== (original[key] || '');
    });
  }) || false;
}
