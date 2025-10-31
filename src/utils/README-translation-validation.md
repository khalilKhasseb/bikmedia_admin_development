# Translation Validation System

This system provides comprehensive translation validation for the bikmedia application, including validation utilities, development warnings, and fallback mechanisms.

## Features

- **Translation Key Validation**: Validates all translation keys are present across supported locales
- **Development Warnings**: Shows console warnings for missing translations in development mode
- **Fallback Mechanism**: Automatically falls back to English when Arabic translations are missing
- **Comprehensive Reports**: Generates detailed reports about translation completeness
- **Development UI**: Visual component for monitoring translation status during development

## Components

### 1. TranslationValidator (`translation-validator.js`)
Core validation utility with methods for:
- Key validation across locales
- Fallback translation retrieval
- Missing translation tracking
- Comprehensive report generation

### 2. Enhanced i18n Configuration (`i18n.js`)
Integrates validation into the Vue i18n system with:
- Automatic fallback handling
- Development warnings
- Missing translation reporting

### 3. Validated Translation Composable (`use-validated-translation.js`)
Enhanced composable providing:
- Validated translation functions
- Bikmedia-specific helpers
- Validation utilities
- Error message helpers

### 4. Development UI Component (`TranslationValidator.vue`)
Visual component for development showing:
- Translation completeness statistics
- Missing translation lists
- Real-time validation status
- Export capabilities

### 5. Report Generator (`translation-report-generator.js`)
Standalone utility for generating comprehensive reports:
- Full translation analysis
- Bikmedia-specific reports
- Duplicate value detection
- Orphaned key identification

## Usage

### Basic Translation with Validation
```javascript
import { useValidatedTranslation } from '@/composables/use-validated-translation.js';

const { t, hasTranslation, bikmedia } = useValidatedTranslation();

// Use enhanced translation function
const title = t('bikmedia.pages.gifts.title');

// Check if translation exists
if (hasTranslation('bikmedia.custom.key')) {
  // Use translation
}

// Use bikmedia shortcuts
const giftLabel = bikmedia.value.store.gifts;
```

### Generate Translation Report
```bash
# Run validation report
npm run translation:validate

# Or directly
node src/utils/translation-report-generator.js
```

### Development Monitoring
Add the development component to your app (development only):
```vue
<template>
  <div id="app">
    <!-- Your app content -->
    <TranslationValidator v-if="isDev" />
  </div>
</template>

<script setup>
import TranslationValidator from '@/components/dev/TranslationValidator.vue';
const isDev = import.meta.env.DEV;
</script>
```

## Configuration

The system is configured in `main.js`:
```javascript
app.use(TranslationValidatorPlugin, {
  warningsEnabled: import.meta.env.DEV,
  fallbackLocale: 'en',
  supportedLocales: ['en', 'ar']
});
```

## Development Workflow

1. **Add new translation keys** to both `en.json` and `ar.json`
2. **Run validation** to check completeness: `npm run translation:validate`
3. **Use development UI** to monitor real-time status
4. **Fix missing translations** based on warnings and reports

## API Reference

### TranslationValidator Methods
- `validateKey(key, messages)` - Validate single key
- `hasTranslation(key, localeMessages)` - Check key existence
- `getTranslationWithFallback(key, locale, messages, params)` - Get with fallback
- `validateBikmediaTranslations(messages)` - Full bikmedia validation
- `generateMissingKeysReport(messages)` - Generate report

### useValidatedTranslation Composable
- `t(key, params, options)` - Enhanced translation function
- `tStrict(key, params)` - Translation without fallback
- `hasTranslation(key)` - Check key existence
- `validationMessage(field, rule, params)` - Form validation helper
- `apiErrorMessage(errorCode)` - API error helper
- `confirmationMessage(action, entity)` - Confirmation helper

## Best Practices

1. **Always add translations to both locales** when adding new keys
2. **Use the validation report** to identify missing translations
3. **Monitor development warnings** during development
4. **Use bikmedia namespace** for all bikmedia-related translations
5. **Test fallback behavior** by temporarily removing translations
6. **Run validation before releases** to ensure completeness