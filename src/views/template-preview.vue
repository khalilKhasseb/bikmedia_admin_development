<template>
  <div class="template-preview">
    <!-- Header -->
    <div class="preview-header">
      <h1 class="preview-title">🎨 Template Component Preview</h1>
      <p class="preview-subtitle">Explore and adopt pre-built UI components from the Cork Admin Template</p>
    </div>

    <!-- Controls -->
    <div class="preview-controls">
      <div class="search-section">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search components by name, description, or features..."
          class="search-input"
        />
      </div>
      
      <div class="filter-section">
        <button
          v-for="category in categories"
          :key="category"
          :class="['filter-btn', { active: selectedCategory === category }]"
          @click="selectedCategory = category"
        >
          {{ category === 'all' ? 'All' : category.charAt(0).toUpperCase() + category.slice(1) }}
        </button>
      </div>
      
      <div class="stats-section">
        <span class="component-count">{{ filteredComponents.length }} components</span>
      </div>
    </div>

    <!-- Component Grid -->
    <div v-if="filteredComponents.length > 0" class="component-grid">
      <div
        v-for="[name, component] in filteredComponents"
        :key="name"
        class="component-card"
      >
        <div class="card-header">
          <div class="card-category">{{ component.category }}</div>
          <h3 class="card-title">{{ name }}</h3>
          <p class="card-description">{{ component.description }}</p>
          
          <div class="card-features">
            <div class="features-title">Features:</div>
            <div class="features-list">
              <span
                v-for="feature in component.features"
                :key="feature"
                class="feature-tag"
              >
                {{ feature }}
              </span>
            </div>
          </div>
        </div>
        
        <div class="card-footer">
          <div class="dependencies">
            <div class="dependencies-title">Dependencies:</div>
            <div class="dependency-list">
              <span
                v-if="component.dependencies.length > 0"
                v-for="dep in component.dependencies"
                :key="dep"
                class="dependency-tag"
              >
                {{ dep }}
              </span>
              <span v-else class="no-deps">No dependencies required</span>
            </div>
          </div>
          
          <div class="card-actions">
            <button
              class="btn btn-primary"
              @click="showComponentDetails(name, component)"
            >
              📋 View Details
            </button>
            <button
              class="btn btn-secondary"
              @click="showPreview(name, component)"
            >
              👁️ Preview
            </button>
            <button
              class="btn btn-outline"
              @click="copyToClipboard(component.path, 'Component path copied!')"
            >
              📁 Copy Path
            </button>
          </div>
          
          <div class="usage-example">
            <strong>Use Case:</strong> {{ component.usageExample }}
          </div>
        </div>
      </div>
    </div>

    <!-- No Results -->
    <div v-else class="no-results">
      <h3>No components found</h3>
      <p>Try adjusting your search or filter criteria</p>
    </div>

    <!-- Component Details Modal -->
    <div v-if="selectedComponent" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2 class="modal-title">{{ selectedComponentName }} - Component Details</h2>
          <button class="close-btn" @click="closeModal">&times;</button>
        </div>
        
        <div class="modal-body">
          <div class="detail-section">
            <h3>📍 Component Location</h3>
            <div class="code-block">{{ selectedComponent.path }}</div>
          </div>

          <div class="detail-section">
            <h3>📦 Installation</h3>
            <div class="code-block">
              {{ selectedComponent.dependencies.length > 0 
                ? `npm install ${selectedComponent.dependencies.join(' ')}` 
                : 'No additional dependencies required' }}
            </div>
          </div>

          <div v-if="selectedComponent.assets.length > 0" class="detail-section">
            <h3>🎨 Required Assets</h3>
            <div class="code-block">
              {{ selectedComponent.assets.map(asset => `@import '${asset}';`).join('\n') }}
            </div>
          </div>

          <div class="detail-section">
            <h3>🚀 Adoption Steps</h3>
            <ol class="adoption-steps">
              <li>Copy the component file from <code>{{ selectedComponent.path }}</code> to your desired location</li>
              <li v-if="selectedComponent.dependencies.length > 0">
                Install required dependencies: <code>npm install {{ selectedComponent.dependencies.join(' ') }}</code>
              </li>
              <li v-if="selectedComponent.assets.length > 0">
                Import required SCSS files in your component or main stylesheet
              </li>
              <li>Import and register the component in your Vue application</li>
              <li>Customize the component props and styling as needed</li>
              <li>Test the component in your application context</li>
            </ol>
          </div>

          <div class="detail-section">
            <h3>✨ Features</h3>
            <ul class="feature-list">
              <li v-for="feature in selectedComponent.features" :key="feature">
                {{ feature }}
              </li>
            </ul>
          </div>

          <div class="detail-section">
            <h3>💡 Usage Example</h3>
            <div class="usage-highlight">
              {{ selectedComponent.usageExample }}
            </div>
          </div>

          <div class="detail-section">
            <h3>🔗 Quick Actions</h3>
            <div class="action-buttons">
              <button
                class="btn btn-primary"
                @click="copyToClipboard(selectedComponent.path, 'Component path copied!')"
              >
                📁 Copy File Path
              </button>
              <button
                class="btn btn-secondary"
                @click="copyInstallCommand"
              >
                📦 Copy Install Command
              </button>
              <a
                :href="`/${selectedComponent.path}`"
                target="_blank"
                class="btn btn-outline"
              >
                👁️ View Source
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Preview Modal -->
    <div v-if="previewComponent" class="modal-overlay" @click="closePreview">
      <div class="preview-modal-content" @click.stop>
        <div class="modal-header">
          <h2 class="modal-title">{{ previewComponentName }} - Interactive Preview</h2>
          <button class="close-btn" @click="closePreview">&times;</button>
        </div>
        <div class="preview-modal-body">
          <div class="preview-container" v-html="previewHTML"></div>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <div v-if="toastMessage" class="toast-notification">
      {{ toastMessage }}
    </div>
  </div>
</template>

<script>
import { templateComponents } from '../templates/available-components.js';
import { generateComponentPreview } from '../utils/template-preview-generator.js';

export default {
  name: 'TemplatePreview',
  data() {
    return {
      templateComponents,
      searchQuery: '',
      selectedCategory: 'all',
      selectedComponent: null,
      selectedComponentName: '',
      previewComponent: null,
      previewComponentName: '',
      previewHTML: '',
      toastMessage: '',
      toastTimeout: null
    };
  },
  computed: {
    categories() {
      const cats = [...new Set(Object.values(this.templateComponents).map(c => c.category))].sort();
      return ['all', ...cats];
    },
    filteredComponents() {
      let filtered = Object.entries(this.templateComponents);

      // Apply category filter
      if (this.selectedCategory !== 'all') {
        filtered = filtered.filter(([, component]) => component.category === this.selectedCategory);
      }

      // Apply search filter
      if (this.searchQuery.trim()) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(([name, component]) => {
          const searchableText = [
            name,
            component.description,
            ...component.features,
            component.usageExample
          ].join(' ').toLowerCase();
          return searchableText.includes(query);
        });
      }

      return filtered;
    }
  },
  methods: {
    showComponentDetails(name, component) {
      this.selectedComponentName = name;
      this.selectedComponent = component;
    },
    closeModal() {
      this.selectedComponent = null;
      this.selectedComponentName = '';
    },
    showPreview(name, component) {
      this.previewComponentName = name;
      this.previewComponent = component;
      
      // Generate enhanced interactive preview HTML
      this.previewHTML = generateComponentPreview(name, component);
    },
    closePreview() {
      this.previewComponent = null;
      this.previewComponentName = '';
      this.previewHTML = '';
    },
    async copyToClipboard(text, message) {
      try {
        await navigator.clipboard.writeText(text);
        this.showToast(message);
      } catch (err) {
        console.error('Failed to copy to clipboard:', err);
        this.showToast('Failed to copy to clipboard');
      }
    },
    copyInstallCommand() {
      const command = this.selectedComponent.dependencies.length > 0
        ? `npm install ${this.selectedComponent.dependencies.join(' ')}`
        : 'No additional dependencies required';
      this.copyToClipboard(command, 'Install command copied!');
    },
    showToast(message) {
      if (this.toastTimeout) {
        clearTimeout(this.toastTimeout);
      }
      this.toastMessage = message;
      this.toastTimeout = setTimeout(() => {
        this.toastMessage = '';
      }, 3000);
    }
  }
};
</script>

<style scoped>
.template-preview {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.preview-header {
  text-align: center;
  margin-bottom: 40px;
}

.preview-title {
  font-size: 2.5rem;
  margin-bottom: 10px;
  font-weight: 700;
  color: #333;
}

.preview-subtitle {
  font-size: 1.1rem;
  color: #666;
}

.preview-controls {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  margin-bottom: 30px;
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  align-items: center;
}

.search-section {
  flex: 1;
  min-width: 250px;
}

.search-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e0e6ed;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.3s;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
}

.filter-section {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 8px 16px;
  border: 2px solid #e0e6ed;
  background: white;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 14px;
  font-weight: 600;
}

.filter-btn:hover,
.filter-btn.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.stats-section {
  color: #666;
  font-size: 14px;
}

.component-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 25px;
}

.component-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.component-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0,0,0,0.15);
}

.card-header {
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.card-category {
  display: inline-block;
  background: #667eea;
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  margin-bottom: 10px;
}

.card-title {
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 8px;
  color: #333;
}

.card-description {
  color: #666;
  line-height: 1.5;
  margin-bottom: 15px;
}

.card-features {
  margin-bottom: 15px;
}

.features-title {
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
  font-size: 14px;
}

.features-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.feature-tag {
  background: #f8f9fa;
  color: #495057;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  border: 1px solid #e9ecef;
}

.card-footer {
  padding: 20px;
  background: #f8f9fa;
  border-top: 1px solid #f0f0f0;
}

.dependencies {
  margin-bottom: 15px;
}

.dependencies-title {
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
  font-size: 14px;
}

.dependency-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.dependency-tag {
  background: #e3f2fd;
  color: #1976d2;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-family: 'Courier New', monospace;
  border: 1px solid #bbdefb;
}

.no-deps {
  color: #28a745;
  font-size: 12px;
  font-style: italic;
}

.card-actions {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.btn-primary {
  background: #667eea;
  color: white;
}

.btn-primary:hover {
  background: #5a6fd8;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #5a6268;
}

.btn-outline {
  background: transparent;
  color: #667eea;
  border: 2px solid #667eea;
}

.btn-outline:hover {
  background: #667eea;
  color: white;
}

.usage-example {
  padding: 12px;
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 6px;
  font-size: 13px;
  color: #856404;
  line-height: 1.4;
}

.no-results {
  text-align: center;
  padding: 60px 20px;
  color: #666;
}

.no-results h3 {
  font-size: 1.5rem;
  margin-bottom: 10px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.8);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 12px;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 700;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  padding: 5px;
}

.modal-body {
  padding: 20px;
}

.detail-section {
  margin-bottom: 20px;
}

.detail-section h3 {
  margin-bottom: 10px;
  color: #333;
}

.code-block {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  padding: 15px;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  overflow-x: auto;
  white-space: pre-wrap;
}

.adoption-steps {
  list-style: none;
  counter-reset: step-counter;
}

.adoption-steps li {
  counter-increment: step-counter;
  margin-bottom: 15px;
  padding-left: 40px;
  position: relative;
}

.adoption-steps li::before {
  content: counter(step-counter);
  position: absolute;
  left: 0;
  top: 0;
  background: #667eea;
  color: white;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
}

.feature-list {
  list-style: disc;
  margin-left: 20px;
}

.usage-highlight {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 6px;
  border-left: 4px solid #667eea;
}

.action-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.preview-modal-content {
  background: white;
  border-radius: 12px;
  max-width: 1000px;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.preview-modal-body {
  flex: 1;
  padding: 0;
  overflow-y: auto;
  max-height: 500px;
}

.preview-container {
  padding: 20px;
  background: #f8f9fa;
  min-height: 400px;
}

.preview-wrapper {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.toast-notification {
  position: fixed;
  top: 20px;
  right: 20px;
  background: #28a745;
  color: white;
  padding: 12px 20px;
  border-radius: 6px;
  z-index: 10000;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

/* Preview Component Styles */
.preview-wrapper {
  font-family: 'Nunito', sans-serif;
}

/* Wizard Preview Styles */
.wizard-preview {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.wizard-steps {
  display: flex;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

.step {
  flex: 1;
  padding: 15px;
  text-align: center;
  font-weight: 600;
  color: #6c757d;
  border-right: 1px solid #e9ecef;
}

.step.active {
  background: #667eea;
  color: white;
}

.wizard-content {
  padding: 30px;
}

.wizard-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-input {
  padding: 12px;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  font-size: 14px;
}

.btn-next {
  background: #667eea;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  align-self: flex-start;
}

/* File Upload Preview Styles */
.file-upload-preview {
  background: white;
  border-radius: 8px;
  padding: 20px;
}

.upload-area {
  border: 2px dashed #667eea;
  border-radius: 8px;
  padding: 40px;
  text-align: center;
  margin-bottom: 20px;
}

.upload-icon {
  font-size: 48px;
  margin-bottom: 15px;
}

.upload-btn {
  background: #667eea;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 15px;
}

.file-list {
  border-top: 1px solid #e9ecef;
  padding-top: 15px;
}

.file-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 6px;
  margin-bottom: 10px;
}

.remove-btn {
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
}

/* Date Picker Preview Styles */
.date-picker-preview {
  background: white;
  border-radius: 8px;
  padding: 20px;
}

.date-input-group {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.date-input {
  padding: 10px;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  font-size: 14px;
}

.calendar-btn {
  background: #667eea;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 6px;
  cursor: pointer;
}

.date-shortcuts {
  display: flex;
  gap: 10px;
}

.shortcut-btn {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
}

/* DataTable Preview Styles */
.datatable-preview {
  background: white;
  border-radius: 8px;
  overflow: hidden;
}

.table-controls {
  display: flex;
  justify-content: space-between;
  padding: 15px;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

.search-input, .entries-select {
  padding: 8px 12px;
  border: 1px solid #e9ecef;
  border-radius: 4px;
}

.preview-table {
  width: 100%;
  border-collapse: collapse;
}

.preview-table th,
.preview-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #e9ecef;
}

.preview-table th {
  background: #f8f9fa;
  font-weight: 600;
  cursor: pointer;
}

.status {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.status.active {
  background: #d4edda;
  color: #155724;
}

.status.inactive {
  background: #f8d7da;
  color: #721c24;
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: #f8f9fa;
  border-top: 1px solid #e9ecef;
}

/* Chart Preview Styles */
.chart-preview {
  background: white;
  border-radius: 8px;
  padding: 20px;
}

.chart-container {
  margin-bottom: 15px;
}

.mock-chart {
  width: 100%;
  height: 200px;
}

.chart-legend {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

/* Modal Preview Styles */
.modal-preview {
  background: rgba(0,0,0,0.5);
  border-radius: 8px;
  padding: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-demo {
  background: white;
  border-radius: 8px;
  min-width: 300px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.3);
}

.modal-demo .modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e9ecef;
}

.modal-demo .modal-body {
  padding: 20px;
}

.modal-demo .modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 20px;
  border-top: 1px solid #e9ecef;
}

.btn-cancel {
  background: #6c757d;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.btn-confirm {
  background: #dc3545;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

/* Timeline Preview Styles */
.timeline-preview {
  background: white;
  border-radius: 8px;
  padding: 20px;
}

.timeline-item {
  display: flex;
  margin-bottom: 20px;
  position: relative;
}

.timeline-item:not(:last-child)::after {
  content: '';
  position: absolute;
  left: 11px;
  top: 24px;
  width: 2px;
  height: calc(100% + 20px);
  background: #e9ecef;
}

.timeline-marker {
  width: 24px;
  height: 24px;
  background: #667eea;
  border-radius: 50%;
  margin-right: 15px;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
}

.timeline-content h4 {
  margin: 0 0 5px 0;
  color: #333;
}

.timeline-content p {
  margin: 0 0 5px 0;
  color: #666;
}

.timeline-content small {
  color: #999;
}

/* Carousel Preview Styles */
.carousel-preview {
  background: white;
  border-radius: 8px;
  overflow: hidden;
}

.carousel-container {
  position: relative;
  height: 200px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.carousel-slide {
  text-align: center;
  color: white;
}

.carousel-prev,
.carousel-next {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255,255,255,0.2);
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 18px;
}

.carousel-prev {
  left: 15px;
}

.carousel-next {
  right: 15px;
}

.carousel-indicators {
  display: flex;
  justify-content: center;
  gap: 8px;
  padding: 15px;
}

.indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #e9ecef;
  cursor: pointer;
}

.indicator.active {
  background: #667eea;
}

/* Default Preview Styles */
.default-preview {
  background: white;
  border-radius: 8px;
  padding: 40px;
  text-align: center;
}

.placeholder-icon {
  font-size: 48px;
  margin-bottom: 15px;
}

.preview-placeholder h3 {
  margin: 0 0 10px 0;
  color: #333;
}

.preview-placeholder p {
  margin: 0 0 20px 0;
  color: #666;
}

.feature-highlights {
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
}

.feature-highlight {
  background: #f8f9fa;
  color: #495057;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  border: 1px solid #e9ecef;
}

@media (max-width: 768px) {
  .component-grid {
    grid-template-columns: 1fr;
  }
  
  .preview-controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-section {
    justify-content: center;
  }
  
  .preview-title {
    font-size: 2rem;
  }
}
</style>