import { createI18n } from "vue-i18n";
import messages from "@intlify/vite-plugin-vue-i18n/messages";
import translationValidator from "./utils/translation-validator.js";

// Create i18n instance
const i18n = createI18n({
    legacy: false,
    allowComposition: true,
    locale: "en",
    globalInjection: true,
    fallbackLocale: "en",
    messages,
    // Enable missing handler for development warnings
    missing: (locale, key, vm, values) => {
        if (import.meta.env.DEV) {
            // Use translation validator for fallback
            return translationValidator.getTranslationWithFallback(key, locale, messages, values);
        }
        return key;
    },
    // Enable fallback warnings in development
    silentFallbackWarn: !import.meta.env.DEV,
    silentTranslationWarn: !import.meta.env.DEV
});

// Generate validation report in development
if (import.meta.env.DEV) {
    // Wait for next tick to ensure messages are loaded
    setTimeout(() => {
        translationValidator.generateMissingKeysReport(messages);
    }, 1000);
}

export default i18n;
