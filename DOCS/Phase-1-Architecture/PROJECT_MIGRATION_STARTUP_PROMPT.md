# Bikmedia Admin Project Migration - Startup Prompt

## Context
This is a **clean copy** of the Bikmedia Admin project that needs to be migrated from a template-heavy Vue.js application to a lean, business-focused admin dashboard. The original project was built on a Vue template with many unused features, components, and dependencies that need to be removed.

## Migration Objective
Transform this project into a clean, optimized version that:
- **Removes all template bloat** (unused views, components, assets, dependencies)
- **Keeps only business functionality** (Bikmedia-specific features)
- **Adds modern development tools** (ESLint, Prettier, TypeScript, testing)
- **Improves performance** (smaller bundle, faster load times)

## What to Read First
Please read these files to understand the migration plan:

1. **`.kiro/specs/project-migration-cleanup/requirements.md`** - Complete migration requirements
2. **`.kiro/specs/project-migration-cleanup/design.md`** - Technical design and approach
3. **`.kiro/specs/project-migration-cleanup/tasks.md`** - Step-by-step implementation tasks

## Business Functionality to PRESERVE
The following are the **core business features** that must remain functional:

### Essential Views (KEEP)
- `src/views/BikmediaHome.vue` - Main analytics dashboard
- `src/views/bikmedia/` - **All bikmedia business views**
  - `store/gifts.vue` - Gift management
  - `store/equipment.vue` - Equipment management  
  - `store/levels.vue` - Level management
  - `vip/index.vue` - VIP package management
  - `vipopt/index.vue` - VIP options management
- `src/views/auth/login.vue` - Authentication
- `src/views/forms/switches.vue` - Used in business forms

### Essential Services (KEEP ALL)
- `src/services/` - **Complete directory** (all API services)
- `src/config/` - **Complete directory** (entity configurations)
- `src/utils/` - **Complete directory** (business utilities)
- `src/composables/` - **Complete directory**
- `src/locales/` - **Complete directory** (i18n)
- `src/store/` - **Complete directory** (Vuex store)

### Essential Dependencies (KEEP)
```json
{
  "vue": "^3.2.13",
  "vue-router": "^4.0.12", 
  "vuex": "^4.0.2",
  "vue-i18n": "^9.1.9",
  "axios": "^0.27.2",
  "bootstrap": "5.1.3",
  "apexcharts": "^3.35.3",
  "vue3-apexcharts": "^1.4.1",
  "sweetalert2": "^11.4.17",
  "dompurify": "^2.3.8",
  "crypto-js": "^4.1.1"
}
```

## Template Bloat to REMOVE

### Views to DELETE
- `src/views/apps/` - **Complete directory**
- `src/views/charts/` - **Complete directory** 
- `src/views/components/` - **Complete directory**
- `src/views/elements/` - **Complete directory**
- `src/views/pages/` - **Complete directory**
- `src/views/tables/` - **Complete directory**
- `src/views/users/` - **Complete directory**
- `src/views/forms/` - **Delete all EXCEPT switches.vue**
- `src/views/auth/` - **Delete all EXCEPT login.vue**

### Dependencies to REMOVE
```json
{
  "echarts": "5.0.2",
  "vue-easymde": "^2.0.0",
  "vue3-easymde": "^1.0.0", 
  "vue-clipboard3": "^2.0.0",
  "vue-countup-v3": "^1.0.14",
  "vue-draggable-next": "^2.1.1",
  "vue-easy-lightbox": "^1.4.1",
  "vue-flatpickr-component": "^9.0.5",
  "vue3-carousel": "^0.1.40",
  "vue3-form-wizard": "^0.0.4",
  "vue3-google-map": "^0.11.0",
  "vue3-json-excel": "^1.0.10-alpha",
  "vue3-nouislider": "^1.0.0",
  "vue3-number-spinner": "^0.0.9",
  "vue3-quill": "^0.2.6",
  "vue3-scroll-spy": "^1.0.8",
  "svgaplayerweb": "^2.3.2"
}
```

## Success Criteria
- ✅ All business functionality preserved and working
- ✅ Bundle size reduced by >60% (from ~6MB to <2MB)
- ✅ All template code removed
- ✅ Modern development tools configured
- ✅ ESLint + Prettier + TypeScript ready
- ✅ Testing framework setup
- ✅ Pre-commit hooks working

## How to Start
1. **Read the spec files** mentioned above
2. **Execute tasks from** `.kiro/specs/project-migration-cleanup/tasks.md`
3. **Start with Phase 1** - Project setup and initial cleanup
4. **Test functionality** after each major cleanup step
5. **Follow the task order** to ensure nothing breaks

## Important Notes
- This is a **CLEAN COPY** - the original project is preserved
- **Test frequently** - verify business functionality after each cleanup step
- **Focus on business logic** - if unsure, keep it rather than delete it
- **Follow the spec** - it contains detailed analysis and safe removal lists

## Ready to Begin?
Ask me to start executing tasks from the migration spec, beginning with Phase 1: Project Setup and Initial Cleanup.