<template>
  <div>
    <!-- Custom Panel Layout Mode -->
    <template v-if="layoutMode === 'custom-panels'">
      <div v-for="section in (entityConfig.formSections || [])" :key="section.name" class="statbox panel box box-shadow my-2" :class="getSectionClass(section.name)">
        <div class="panel-heading">
          <div class="row">
            <div class="col-xl-12 col-md-12 col-sm-12 col-12">
              <h4>{{ section.label || section.name }}</h4>
              <p v-if="section.description" class="text-muted mb-0">{{ section.description }}</p>
            </div>
          </div>
        </div>
        <div class="panel-body">
          <div class="row" :class="getSectionRowClass(section.name)">
            <template v-for="fieldName in (section.fields || [])" :key="fieldName">
              <DynamicFieldRenderer
                v-if="getFieldMeta(fieldName)"
                :fieldConfig="getFieldMeta(fieldName)"
                :entityConfig="entityConfig"
                :modelValue="modelValue"
                :isSubmitted="isSubmitted"
                :errors="errors"
                :existingData="existingData"
                :selectedLocale="selectedLocale"
                :mode="mode"
                :showAllLocales="showAllLocales"
                :layoutMode="layoutMode"
                @update:modelValue="$emit('update:modelValue', $event)"
              />
            </template>
          </div>
        </div>
      </div>
    </template>

    <!-- Default FormSection Layout Mode -->
    <template v-else>
      <FormSection
        v-for="section in (entityConfig.formSections || [])"
        :key="section.name"
        :title="section.label || section.name"
        :description="section.description || ''"
      >
        <div class="row">
          <div class="col-12">
            <template v-for="fieldName in (section.fields || [])" :key="fieldName">
              <DynamicFieldRenderer
                v-if="getFieldMeta(fieldName)"
                :fieldConfig="getFieldMeta(fieldName)"
                :entityConfig="entityConfig"
                :modelValue="modelValue"
                :isSubmitted="isSubmitted"
                :errors="errors"
                :existingData="existingData"
                :selectedLocale="selectedLocale"
                :mode="mode"
                :showAllLocales="showAllLocales"
                :layoutMode="layoutMode"
                @update:modelValue="$emit('update:modelValue', $event)"
              />
            </template>
          </div>
        </div>
      </FormSection>
    </template>
  </div>
</template>

<script setup>
import FormSection from '@/components/forms/FormSection.vue';
import DynamicFieldRenderer from '@/views/bikmedia/components/DynamicFieldRenderer.vue';
import { getFieldConfigByName } from '@/config/entities/helpers.js';

const props = defineProps({
  entityConfig: { type: Object, required: true },
  modelValue: { type: Object, required: true },
  isSubmitted: { type: Boolean, default: false },
  errors: { type: Object, default: () => ({}) },
  existingData: { type: Object, default: null },
  mode: { type: String, default: 'create' },
  selectedLocale: { type: String, default: 'en' },
  showAllLocales: { type: Boolean, default: true },
  layoutMode: { type: String, default: 'default' } // 'default' | 'custom-panels'
});

const emit = defineEmits(['update:modelValue']);

const getFieldMeta = (name) => {
  return getFieldConfigByName(props.entityConfig, name);
};

const getSectionClass = (sectionName) => {
  // Add specific classes for different sections
  const classes = [];
  if (sectionName === 'media') {
    classes.push('media-section');
  }
  return classes.join(' ');
};

const getSectionRowClass = (sectionName) => {
  // Add specific row classes for different sections
  if (sectionName === 'media') {
    return ''; // Media section uses custom layout in DynamicFieldRenderer
  }
  return '';
};
</script>

<style scoped>
/* Custom Panel Layout Styles */
.statbox.panel {
  border: 1px solid #e0e6ed;
  border-radius: 8px;
  overflow: hidden;
}

.panel-heading {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 1.5rem;
}

.panel-heading h4 {
  color: white;
  margin: 0;
  font-weight: 600;
}

.panel-heading p {
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
  margin-top: 0.25rem;
}

.panel-body {
  padding: 1.5rem;
}

/* Media section specific styling */
.media-section .panel-body {
  padding: 1.5rem;
}
</style>