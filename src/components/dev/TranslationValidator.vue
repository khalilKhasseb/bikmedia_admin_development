<template>
  <div v-if="isDevelopment" class="translation-validator-panel">
    <div class="validator-toggle" @click="togglePanel">
      <i class="fas fa-language"></i>
      <span class="badge" :class="getBadgeClass()">{{ report.invalidKeys }}</span>
    </div>
    
    <div v-if="showPanel" class="validator-panel">
      <div class="panel-header">
        <h5>Translation Validation</h5>
        <button @click="refreshReport" class="btn btn-sm btn-primary">
          <i class="fas fa-refresh"></i> Refresh
        </button>
        <button @click="togglePanel" class="btn btn-sm btn-secondary">
          <i class="fas fa-times"></i>
        </button>
      </div>
      
      <div class="panel-content">
        <div class="validation-summary">
          <div class="stat-item">
            <span class="label">Total Keys:</span>
            <span class="value">{{ report.totalKeys }}</span>
          </div>
          <div class="stat-item">
            <span class="label">Valid Keys:</span>
            <span class="value text-success">{{ report.validKeys }}</span>
          </div>
          <div class="stat-item">
            <span class="label">Invalid Keys:</span>
            <span class="value text-danger">{{ report.invalidKeys }}</span>
          </div>
        </div>

        <div class="locale-completeness">
          <h6>Locale Completeness</h6>
          <div v-for="(stats, locale) in report.localeCompleteness" :key="locale" class="locale-stat">
            <div class="locale-header">
              <span class="locale-name">{{ locale.toUpperCase() }}</span>
              <span class="percentage" :class="getPercentageClass(stats.percentage)">
                {{ stats.percentage }}%
              </span>
            </div>
            <div class="progress">
              <div 
                class="progress-bar" 
                :class="getProgressBarClass(stats.percentage)"
                :style="{ width: stats.percentage + '%' }"
              ></div>
            </div>
            <small class="text-muted">{{ stats.present }}/{{ stats.total }} translations</small>
          </div>
        </div>

        <div v-if="report.missingTranslations.length > 0" class="missing-translations">
          <h6>Missing Translations</h6>
          <div class="missing-list">
            <div 
              v-for="missing in report.missingTranslations.slice(0, showAllMissing ? undefined : 10)" 
              :key="missing.key"
              class="missing-item"
            >
              <code class="translation-key">{{ missing.key }}</code>
              <div class="missing-locales">
                <span 
                  v-for="locale in missing.missingLocales" 
                  :key="locale"
                  class="badge badge-danger"
                >
                  {{ locale }}
                </span>
              </div>
            </div>
            
            <div v-if="report.missingTranslations.length > 10 && !showAllMissing" class="show-more">
              <button @click="showAllMissing = true" class="btn btn-sm btn-link">
                Show {{ report.missingTranslations.length - 10 }} more...
              </button>
            </div>
          </div>
        </div>

        <div class="validator-actions">
          <button @click="clearTrackedKeys" class="btn btn-sm btn-warning">
            Clear Tracked Keys
          </button>
          <button @click="copyReport" class="btn btn-sm btn-info">
            Copy Report
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useTranslationValidator } from '@/utils/translation-validator.js';
import { useI18n } from 'vue-i18n';

const { validator, generateReport, clearTrackedKeys: clearKeys } = useTranslationValidator();
const { messages } = useI18n();

const isDevelopment = import.meta.env.DEV;
const showPanel = ref(false);
const showAllMissing = ref(false);
const report = ref({
  totalKeys: 0,
  validKeys: 0,
  invalidKeys: 0,
  missingTranslations: [],
  localeCompleteness: {}
});

const togglePanel = () => {
  showPanel.value = !showPanel.value;
  if (showPanel.value) {
    refreshReport();
  }
};

const refreshReport = () => {
  report.value = generateReport(messages.value);
};

const clearTrackedKeys = () => {
  clearKeys();
  refreshReport();
};

const copyReport = async () => {
  const reportText = JSON.stringify(report.value, null, 2);
  try {
    await navigator.clipboard.writeText(reportText);
    console.log('Translation report copied to clipboard');
  } catch (err) {
    console.error('Failed to copy report:', err);
  }
};

const getBadgeClass = () => {
  if (report.value.invalidKeys === 0) return 'badge-success';
  if (report.value.invalidKeys < 10) return 'badge-warning';
  return 'badge-danger';
};

const getPercentageClass = (percentage) => {
  if (percentage === 100) return 'text-success';
  if (percentage >= 80) return 'text-warning';
  return 'text-danger';
};

const getProgressBarClass = (percentage) => {
  if (percentage === 100) return 'bg-success';
  if (percentage >= 80) return 'bg-warning';
  return 'bg-danger';
};

onMounted(() => {
  if (isDevelopment) {
    refreshReport();
  }
});
</script>

<style scoped>
.translation-validator-panel {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
}

.validator-toggle {
  background: #007bff;
  color: white;
  padding: 10px;
  border-radius: 50px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.2);
  transition: all 0.3s ease;
}

.validator-toggle:hover {
  background: #0056b3;
  transform: scale(1.05);
}

.validator-toggle .badge {
  background: white;
  color: #007bff;
  border-radius: 50%;
  min-width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
}

.badge-success { background: #28a745 !important; color: white !important; }
.badge-warning { background: #ffc107 !important; color: #212529 !important; }
.badge-danger { background: #dc3545 !important; color: white !important; }

.validator-panel {
  position: absolute;
  top: 60px;
  right: 0;
  width: 400px;
  max-height: 600px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  overflow: hidden;
}

.panel-header {
  background: #f8f9fa;
  padding: 15px;
  border-bottom: 1px solid #ddd;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.panel-header h5 {
  margin: 0;
  font-size: 16px;
}

.panel-content {
  padding: 15px;
  max-height: 500px;
  overflow-y: auto;
}

.validation-summary {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 10px;
  margin-bottom: 20px;
}

.stat-item {
  text-align: center;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 4px;
}

.stat-item .label {
  display: block;
  font-size: 12px;
  color: #6c757d;
  margin-bottom: 5px;
}

.stat-item .value {
  display: block;
  font-size: 18px;
  font-weight: bold;
}

.locale-completeness {
  margin-bottom: 20px;
}

.locale-stat {
  margin-bottom: 15px;
}

.locale-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}

.locale-name {
  font-weight: bold;
}

.progress {
  height: 8px;
  background: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 5px;
}

.progress-bar {
  height: 100%;
  transition: width 0.3s ease;
}

.missing-translations {
  margin-bottom: 20px;
}

.missing-list {
  max-height: 200px;
  overflow-y: auto;
}

.missing-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  margin-bottom: 5px;
  background: #fff;
}

.translation-key {
  font-size: 12px;
  background: #f8f9fa;
  padding: 2px 6px;
  border-radius: 3px;
  flex: 1;
  margin-right: 10px;
}

.missing-locales {
  display: flex;
  gap: 5px;
}

.missing-locales .badge {
  font-size: 10px;
  padding: 2px 6px;
}

.validator-actions {
  display: flex;
  gap: 10px;
  justify-content: center;
  padding-top: 15px;
  border-top: 1px solid #e9ecef;
}

.show-more {
  text-align: center;
  padding: 10px;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .validator-panel {
    background: #2d3748;
    border-color: #4a5568;
    color: #e2e8f0;
  }
  
  .panel-header {
    background: #4a5568;
    border-color: #718096;
  }
  
  .stat-item {
    background: #4a5568;
  }
  
  .missing-item {
    background: #4a5568;
    border-color: #718096;
  }
  
  .translation-key {
    background: #718096;
    color: #e2e8f0;
  }
}
</style>