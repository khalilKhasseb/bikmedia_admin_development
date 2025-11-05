# Template Component Dependency Mapping

This document explains the comprehensive dependency mapping system for template components, which enables selective adoption of components with precise dependency management.

## Overview

The dependency mapping system provides:
- **Precise dependency tracking** for each template component
- **Bundle size impact** estimation for informed decisions
- **Dependency grouping** by functionality (charts, forms, tables, etc.)
- **Version compatibility** information
- **Adoption recommendations** based on complexity and impact

## Files Structure

### Core Files

- **`template-dependencies.json`** - Complete dependency mapping database
- **`src/utils/dependency-checker.js`** - Utility functions for dependency management
- **`src/utils/template-adopter.js`** - Enhanced adoption helper with dependency integration

## Dependency Groups

Components are organized into logical dependency groups:

### 1. Charts (`charts`)
- **Dependencies**: `apexcharts`, `vue3-apexcharts`, `echarts`, `vue3-echarts`
- **Components**: ApexCharts
- **Bundle Impact**: ~280KB
- **Use Case**: Data visualization and analytics dashboards

### 2. Forms (`forms`)
- **Dependencies**: `@vuelidate/core`, `vue3-form-wizard`, `file-upload-with-preview`, etc.
- **Components**: FormWizard, FormValidation, FileUpload, DateRangePicker, RichTextEditor, etc.
- **Bundle Impact**: Varies (20KB - 120KB per component)
- **Use Case**: User input, data collection, and form processing

### 3. Tables (`tables`)
- **Dependencies**: `@bhplugin/vue3-datatable`, `v-tables-3`, `vue3-easy-data-table`
- **Components**: DataTableBasic, DataTableAdvanced, DataTableActions, V3TableBasic
- **Bundle Impact**: ~45KB - 60KB
- **Use Case**: Data display, sorting, filtering, and pagination

### 4. UI Components (`ui-components`)
- **Dependencies**: `vue3-carousel`, `vue-easy-lightbox`, `sweetalert2`, etc.
- **Components**: Carousel, Lightbox, SweetAlert, Counter, etc.
- **Bundle Impact**: Varies (12KB - 85KB per component)
- **Use Case**: Interactive UI elements and user experience enhancements

### 5. Calendar (`calendar`)
- **Dependencies**: `@fullcalendar/core`, `@fullcalendar/daygrid`, `@fullcalendar/interaction`, etc.
- **Components**: Calendar
- **Bundle Impact**: ~180KB
- **Use Case**: Event scheduling and calendar functionality

### 6. Drag & Drop (`drag-drop`)
- **Dependencies**: `vue-draggable-next`
- **Components**: Scrumboard, TodoList
- **Bundle Impact**: ~35KB
- **Use Case**: Interactive drag and drop interfaces

## Component Classification

### Lightweight Components (0KB Impact)
Components with no external dependencies:
- **Authentication**: LoginBoxed, RegisterBoxed, PasswordRecovery, LockScreen
- **UI Elements**: Accordions, Cards, Countdown, Modals, Timeline, Toast, Alerts, Buttons, Badges, Pagination, ProgressBar, Switches
- **Pages**: Error404, Error500, FAQ, ContactUs, ComingSoon
- **Users**: UserProfile, AccountSettings

### Essential Components (~82KB Total)
Components with small, essential dependencies:
- **Chat, Mailbox, Notes** (vue3-perfect-scrollbar: ~15KB)
- **Counter** (vue-countup-v3: ~12KB)
- **FormWizard** (vue3-form-wizard: ~20KB)

### Feature-Rich Components (~655KB Total)
Components with larger dependencies but rich functionality:
- **Calendar** (~180KB)
- **ApexCharts** (~280KB)
- **Scrumboard** (~35KB)
- **DataTable components** (~60KB each)
- **RichTextEditor** (~120KB)

### Specialized Components (~360KB Total)
Components for specific use cases:
- **Carousel** (~45KB)
- **Lightbox** (~30KB)
- **SweetAlert** (~85KB)
- **FormValidation** (~35KB)
- **FileUpload** (~25KB)
- **DateRangePicker** (~40KB)
- **Select2** (~25KB)

## Usage Examples

### Check Component Dependencies

```javascript
import { getComponentDependencies, validateComponentAdoption } from '@/utils/dependency-checker.js';

// Get dependency information
const deps = getComponentDependencies('Calendar');
console.log(deps);
// Output:
// {
//   component: 'Calendar',
//   dependencies: ['@fullcalendar/core@^5.11.0', '@fullcalendar/daygrid@^5.11.0', ...],
//   group: 'calendar',
//   bundleSize: '~180KB',
//   required: true,
//   description: 'Full calendar functionality requires all FullCalendar packages'
// }

// Validate if component is ready for adoption
const validation = validateComponentAdoption('Calendar');
console.log(validation);
// Output:
// {
//   ready: false,
//   component: 'Calendar',
//   missingDependencies: ['@fullcalendar/core@^5.11.0', ...],
//   installCommand: 'npm install @fullcalendar/core@^5.11.0 ...',
//   bundleImpact: '~180KB',
//   group: 'calendar',
//   required: true
// }
```

### Get Components by Group

```javascript
import { getComponentsByGroup, getDependencyGroup } from '@/utils/dependency-checker.js';

// Get all form components
const formComponents = getComponentsByGroup('forms');
console.log(formComponents); // ['FormWizard', 'FormValidation', 'FileUpload', ...]

// Get group information
const formsGroup = getDependencyGroup('forms');
console.log(formsGroup);
// Output:
// {
//   description: 'Form components and validation libraries',
//   dependencies: ['@vuelidate/core', 'vue3-form-wizard', ...]
// }
```

### Calculate Bundle Impact

```javascript
import { calculateBundleImpact } from '@/utils/dependency-checker.js';

// Calculate impact of adopting multiple components
const impact = calculateBundleImpact(['Calendar', 'ApexCharts', 'DataTableBasic']);
console.log(impact); // '~520KB'
```

### Get Adoption Recommendations

```javascript
import { getAdoptionRecommendation } from '@/utils/dependency-checker.js';

// Get lightweight component recommendations
const lightweight = getAdoptionRecommendation('lightweight');
console.log(lightweight);
// Output:
// {
//   description: 'Components with no external dependencies',
//   components: ['LoginBoxed', 'RegisterBoxed', ...],
//   totalBundleImpact: '0KB'
// }
```

## Integration with Template Adopter

The enhanced template adopter now uses the dependency mapping:

```javascript
import { adoptComponent, getAdoptionRecommendations } from '@/utils/template-adopter.js';

// Get enhanced recommendations with dependency info
const recommendations = getAdoptionRecommendations('Calendar');
console.log(recommendations);
// Output includes:
// - bundleImpact: '~180KB'
// - dependencyGroup: 'calendar'
// - ready: false
// - missingDependencies: [...]
// - adoptionCategory: 'feature-rich'

// Adopt component with dependency validation
const result = await adoptComponent('Calendar', 'src/components/MyCalendar.vue');
// Automatically checks dependencies and provides installation instructions
```

## Migration Guide

### Currently Used Dependencies
These dependencies are already in the project and safe to use:
- `@bhplugin/vue3-datatable`
- `@fullcalendar/*` packages
- `@suadelabs/vue3-multiselect`
- `@vuelidate/*` packages
- `apexcharts` and `vue3-apexcharts`
- And many more (see `template-dependencies.json`)

### Safe to Remove
These dependencies can be removed if not using specific components:
- `echarts`, `vue3-echarts` (if not using ECharts)
- `vue3-easy-data-table` (alternative table component)
- `vue3-google-map` (if not using maps)
- `jspdf`, `jspdf-autotable` (if not using PDF export)
- And others (see migration guide in mapping file)

## Best Practices

### 1. Start with Lightweight Components
Begin adoption with components that have no dependencies to minimize bundle impact.

### 2. Group Related Adoptions
When adopting multiple components, choose ones from the same dependency group to share dependencies.

### 3. Validate Before Adoption
Always use `validateComponentAdoption()` to check readiness before adopting a component.

### 4. Monitor Bundle Size
Use `calculateBundleImpact()` to understand the cumulative effect of multiple component adoptions.

### 5. Follow Adoption Categories
Use the adoption recommendation categories to guide your selection:
- **Lightweight**: For quick wins and basic functionality
- **Essential**: For commonly needed features with minimal impact
- **Specialized**: For specific use cases when needed
- **Feature-rich**: For comprehensive functionality when justified

## Troubleshooting

### Dependency Not Found
If a dependency is not found in the mapping:
1. Check if the component name is correct
2. Verify the component exists in `available-components.js`
3. Check if the dependency mapping is up to date

### Installation Issues
If dependency installation fails:
1. Check version compatibility in `template-dependencies.json`
2. Verify peer dependencies are installed
3. Clear npm cache and retry installation

### Bundle Size Concerns
If bundle size is too large:
1. Use `getAdoptionRecommendation('lightweight')` for alternatives
2. Consider adopting components incrementally
3. Review if all adopted components are actually being used

## Maintenance

The dependency mapping should be updated when:
- New template components are added
- Dependencies are updated to new versions
- New dependency groups are identified
- Bundle size measurements change significantly

To update the mapping:
1. Modify `template-dependencies.json`
2. Update version numbers and bundle sizes
3. Add new components to appropriate groups
4. Update migration guide if dependencies change
5. Test dependency checker functions with new data