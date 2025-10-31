/**
 * Translation Report Generator
 * 
 * Utility script to generate comprehensive translation validation reports
 * Can be run independently or integrated into build processes
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class TranslationReportGenerator {
    constructor() {
        this.supportedLocales = ['en', 'ar'];
        this.localesPath = path.resolve(__dirname, '../locales');
        this.outputPath = path.resolve(__dirname, '../../translation-reports');
    }

    /**
     * Load all locale files
     * @returns {Object} Messages object with all locales
     */
    async loadMessages() {
        const messages = {};

        for (const locale of this.supportedLocales) {
            const filePath = path.join(this.localesPath, `${locale}.json`);
            
            try {
                const content = await fs.promises.readFile(filePath, 'utf-8');
                messages[locale] = JSON.parse(content);
            } catch (error) {
                console.error(`Failed to load locale file ${locale}.json:`, error.message);
                messages[locale] = {};
            }
        }

        return messages;
    }

    /**
     * Extract all keys from a nested object
     * @param {Object} obj - Object to extract keys from
     * @param {string} prefix - Key prefix
     * @returns {Array} Array of all keys
     */
    extractAllKeys(obj, prefix = '') {
        const keys = [];

        if (!obj || typeof obj !== 'object') {
            return keys;
        }

        Object.keys(obj).forEach(key => {
            const fullKey = prefix ? `${prefix}.${key}` : key;
            
            if (typeof obj[key] === 'object' && obj[key] !== null) {
                keys.push(...this.extractAllKeys(obj[key], fullKey));
            } else {
                keys.push(fullKey);
            }
        });

        return keys;
    }

    /**
     * Check if a translation key exists in a locale object
     * @param {string} key - Translation key (dot notation)
     * @param {Object} localeMessages - Locale messages object
     * @returns {boolean} True if translation exists
     */
    hasTranslation(key, localeMessages) {
        if (!localeMessages || typeof localeMessages !== 'object') {
            return false;
        }

        const keys = key.split('.');
        let current = localeMessages;

        for (const k of keys) {
            if (current && typeof current === 'object' && k in current) {
                current = current[k];
            } else {
                return false;
            }
        }

        return current !== null && current !== undefined && current !== '';
    }

    /**
     * Generate comprehensive translation report
     * @param {Object} messages - Messages object
     * @returns {Object} Comprehensive report
     */
    generateReport(messages) {
        const report = {
            generatedAt: new Date().toISOString(),
            supportedLocales: this.supportedLocales,
            summary: {
                totalKeys: 0,
                bikmediaKeys: 0,
                validKeys: 0,
                invalidKeys: 0
            },
            localeCompleteness: {},
            missingTranslations: [],
            bikmediaReport: {},
            keyAnalysis: {
                byNamespace: {},
                orphanedKeys: [],
                duplicateValues: []
            }
        };

        // Initialize locale completeness tracking
        this.supportedLocales.forEach(locale => {
            report.localeCompleteness[locale] = {
                total: 0,
                present: 0,
                missing: [],
                percentage: 0,
                keysByNamespace: {}
            };
        });

        // Get all keys from English (reference locale)
        const allKeys = this.extractAllKeys(messages.en || {});
        const bikmediaKeys = this.extractAllKeys(messages.en?.bikmedia || {}, 'bikmedia');
        
        report.summary.totalKeys = allKeys.length;
        report.summary.bikmediaKeys = bikmediaKeys.length;

        // Analyze all keys
        allKeys.forEach(key => {
            const namespace = key.split('.')[0];
            
            // Initialize namespace tracking
            if (!report.keyAnalysis.byNamespace[namespace]) {
                report.keyAnalysis.byNamespace[namespace] = {
                    total: 0,
                    complete: 0,
                    incomplete: 0,
                    missingInLocales: {}
                };
                
                this.supportedLocales.forEach(locale => {
                    report.keyAnalysis.byNamespace[namespace].missingInLocales[locale] = [];
                    report.localeCompleteness[locale].keysByNamespace[namespace] = {
                        total: 0,
                        present: 0,
                        missing: []
                    };
                });
            }

            report.keyAnalysis.byNamespace[namespace].total++;

            const missingLocales = [];
            let isValid = true;

            // Check each locale
            this.supportedLocales.forEach(locale => {
                report.localeCompleteness[locale].total++;
                report.localeCompleteness[locale].keysByNamespace[namespace].total++;

                if (this.hasTranslation(key, messages[locale])) {
                    report.localeCompleteness[locale].present++;
                    report.localeCompleteness[locale].keysByNamespace[namespace].present++;
                } else {
                    isValid = false;
                    missingLocales.push(locale);
                    report.localeCompleteness[locale].missing.push(key);
                    report.localeCompleteness[locale].keysByNamespace[namespace].missing.push(key);
                    report.keyAnalysis.byNamespace[namespace].missingInLocales[locale].push(key);
                }
            });

            if (isValid) {
                report.summary.validKeys++;
                report.keyAnalysis.byNamespace[namespace].complete++;
            } else {
                report.summary.invalidKeys++;
                report.keyAnalysis.byNamespace[namespace].incomplete++;
                report.missingTranslations.push({
                    key,
                    namespace,
                    missingLocales
                });
            }
        });

        // Calculate percentages
        this.supportedLocales.forEach(locale => {
            const stats = report.localeCompleteness[locale];
            stats.percentage = stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 0;

            // Calculate namespace percentages
            Object.keys(stats.keysByNamespace).forEach(namespace => {
                const nsStats = stats.keysByNamespace[namespace];
                nsStats.percentage = nsStats.total > 0 ? Math.round((nsStats.present / nsStats.total) * 100) : 0;
            });
        });

        // Generate bikmedia-specific report
        report.bikmediaReport = this.generateBikmediaReport(messages, bikmediaKeys);

        // Find duplicate values
        report.keyAnalysis.duplicateValues = this.findDuplicateValues(messages);

        // Find orphaned keys (keys that exist in non-reference locales but not in reference)
        report.keyAnalysis.orphanedKeys = this.findOrphanedKeys(messages);

        return report;
    }

    /**
     * Generate bikmedia-specific report
     * @param {Object} messages - Messages object
     * @param {Array} bikmediaKeys - Array of bikmedia keys
     * @returns {Object} Bikmedia report
     */
    generateBikmediaReport(messages, bikmediaKeys) {
        const report = {
            totalKeys: bikmediaKeys.length,
            validKeys: 0,
            invalidKeys: 0,
            missingTranslations: [],
            localeCompleteness: {},
            categories: {
                store: { keys: [], missing: [] },
                actions: { keys: [], missing: [] },
                forms: { keys: [], missing: [] },
                messages: { keys: [], missing: [] },
                navigation: { keys: [], missing: [] },
                components: { keys: [], missing: [] },
                pages: { keys: [], missing: [] }
            }
        };

        // Initialize locale tracking
        this.supportedLocales.forEach(locale => {
            report.localeCompleteness[locale] = {
                total: 0,
                present: 0,
                missing: [],
                percentage: 0
            };
        });

        // Analyze bikmedia keys
        bikmediaKeys.forEach(key => {
            const category = key.split('.')[1] || 'other';
            
            if (report.categories[category]) {
                report.categories[category].keys.push(key);
            }

            const missingLocales = [];
            let isValid = true;

            this.supportedLocales.forEach(locale => {
                report.localeCompleteness[locale].total++;

                if (this.hasTranslation(key, messages[locale])) {
                    report.localeCompleteness[locale].present++;
                } else {
                    isValid = false;
                    missingLocales.push(locale);
                    report.localeCompleteness[locale].missing.push(key);
                    
                    if (report.categories[category]) {
                        report.categories[category].missing.push({ key, locale });
                    }
                }
            });

            if (isValid) {
                report.validKeys++;
            } else {
                report.invalidKeys++;
                report.missingTranslations.push({ key, missingLocales });
            }
        });

        // Calculate percentages
        this.supportedLocales.forEach(locale => {
            const stats = report.localeCompleteness[locale];
            stats.percentage = stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 0;
        });

        return report;
    }

    /**
     * Find duplicate translation values
     * @param {Object} messages - Messages object
     * @returns {Array} Array of duplicate value groups
     */
    findDuplicateValues(messages) {
        const duplicates = [];
        
        this.supportedLocales.forEach(locale => {
            const valueMap = new Map();
            const allKeys = this.extractAllKeys(messages[locale] || {});
            
            allKeys.forEach(key => {
                const value = this.getTranslationValue(key, messages[locale]);
                if (value && typeof value === 'string') {
                    if (!valueMap.has(value)) {
                        valueMap.set(value, []);
                    }
                    valueMap.get(value).push(key);
                }
            });

            // Find values with multiple keys
            valueMap.forEach((keys, value) => {
                if (keys.length > 1) {
                    duplicates.push({
                        locale,
                        value,
                        keys
                    });
                }
            });
        });

        return duplicates;
    }

    /**
     * Find orphaned keys
     * @param {Object} messages - Messages object
     * @returns {Array} Array of orphaned keys
     */
    findOrphanedKeys(messages) {
        const orphaned = [];
        const referenceKeys = new Set(this.extractAllKeys(messages.en || {}));

        this.supportedLocales.forEach(locale => {
            if (locale === 'en') return; // Skip reference locale

            const localeKeys = this.extractAllKeys(messages[locale] || {});
            localeKeys.forEach(key => {
                if (!referenceKeys.has(key)) {
                    orphaned.push({
                        locale,
                        key,
                        value: this.getTranslationValue(key, messages[locale])
                    });
                }
            });
        });

        return orphaned;
    }

    /**
     * Get translation value from nested object
     * @param {string} key - Translation key
     * @param {Object} localeMessages - Locale messages object
     * @returns {*} Translation value
     */
    getTranslationValue(key, localeMessages) {
        const keys = key.split('.');
        let current = localeMessages;

        for (const k of keys) {
            if (current && typeof current === 'object' && k in current) {
                current = current[k];
            } else {
                return null;
            }
        }

        return current;
    }

    /**
     * Save report to file
     * @param {Object} report - Report object
     * @param {string} filename - Output filename
     */
    async saveReport(report, filename = 'translation-report.json') {
        try {
            // Ensure output directory exists
            await fs.promises.mkdir(this.outputPath, { recursive: true });

            const filePath = path.join(this.outputPath, filename);
            await fs.promises.writeFile(filePath, JSON.stringify(report, null, 2));
            
            console.log(`Translation report saved to: ${filePath}`);
            return filePath;
        } catch (error) {
            console.error('Failed to save report:', error.message);
            throw error;
        }
    }

    /**
     * Generate and save comprehensive report
     */
    async generateAndSaveReport() {
        try {
            console.log('Loading translation files...');
            const messages = await this.loadMessages();
            
            console.log('Generating translation report...');
            const report = this.generateReport(messages);
            
            console.log('Saving report...');
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            await this.saveReport(report, `translation-report-${timestamp}.json`);
            
            // Also save a latest version
            await this.saveReport(report, 'translation-report-latest.json');
            
            // Print summary
            this.printSummary(report);
            
            return report;
        } catch (error) {
            console.error('Failed to generate translation report:', error.message);
            throw error;
        }
    }

    /**
     * Print report summary to console
     * @param {Object} report - Report object
     */
    printSummary(report) {
        console.log('\n=== Translation Report Summary ===');
        console.log(`Generated at: ${report.generatedAt}`);
        console.log(`Total Keys: ${report.summary.totalKeys}`);
        console.log(`Bikmedia Keys: ${report.summary.bikmediaKeys}`);
        console.log(`Valid Keys: ${report.summary.validKeys}`);
        console.log(`Invalid Keys: ${report.summary.invalidKeys}`);
        
        console.log('\n=== Locale Completeness ===');
        Object.entries(report.localeCompleteness).forEach(([locale, stats]) => {
            console.log(`${locale.toUpperCase()}: ${stats.percentage}% (${stats.present}/${stats.total})`);
        });

        console.log('\n=== Bikmedia Report ===');
        console.log(`Bikmedia Valid Keys: ${report.bikmediaReport.validKeys}`);
        console.log(`Bikmedia Invalid Keys: ${report.bikmediaReport.invalidKeys}`);
        
        Object.entries(report.bikmediaReport.localeCompleteness).forEach(([locale, stats]) => {
            console.log(`Bikmedia ${locale.toUpperCase()}: ${stats.percentage}% (${stats.present}/${stats.total})`);
        });

        if (report.summary.invalidKeys > 0) {
            console.log(`\n⚠️  Found ${report.summary.invalidKeys} missing translations`);
            console.log('Check the detailed report for specific missing keys.');
        } else {
            console.log('\n✅ All translations are complete!');
        }
    }
}

// Export for use in other modules
export default TranslationReportGenerator;

// CLI usage
if (import.meta.url === `file://${process.argv[1]}`) {
    const generator = new TranslationReportGenerator();
    generator.generateAndSaveReport().catch(console.error);
}