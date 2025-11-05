# Template Component Adoption Workflow

This guide provides a comprehensive workflow for adopting template components with proper dependency management and troubleshooting.

## Quick Start

### Using the Adoption Script

The easiest way to adopt a template component is using our interactive script:

```bash
# List all available components
node scripts/adopt-template-component.js --list

# Get detailed information about a component
node scripts/adopt-template-component.js --info Calendar

# Adopt a component (dry run first)
node scripts/adopt-template-component.js --dry-run Calendar src/components/MyCalendar.vue

# Adopt a component with automatic dependency installation
node scripts/adopt-template-component.js --install-deps Calendar src/components/MyCalendar.vue
```

### Manual Adoption Process

If you prefer manual adoption or need more control:

1. **Choose a Component**: Browse the [component catalog](./component-catalog.md)
2. **Check Dependencies**: Use the dependency checker utility
3. **Install Dependencies**: Install any missing packages
4. **Copy Component**: Copy and customize the component file
5. **Import Assets**: Add required SCSS imports
6. **Test Integration**: Verify the component works in your application

## Detailed Workflow

### Step 1: Component Selection and Analysis

#### Browse Available Components

```javascript
import { templateComponents, getComponentsByCategory } from '../src/templates/available-components.js';

// Get all form components
const formComponents = getComponentsByCategory('forms');

// Search for specific functionality
const searchResults = searchComponents('calendar');
```

#### Analyze Component Requirements

```javascript
import { createDependencyReport } from '../src/utils/dependency-checker.js';

// Get comprehensive dependency analysis
const report = await createDependencyReport(['@fullcalendar/core', '@fullcalendar/vue3']);
console.log(report);
```

### Step 2: Dependency Management

#### Check Current Dependencies

```javascript
import { checkMultiplePackages } from '../src/utils/dependency-checker.js';

const dependencies = ['vue3-form-wizard', '@vuelidate/core'];
const status = await checkMultiplePackages(dependencies);

if (status.missing.length > 0) {
  console.log('Missing dependencies:', status.missing);
}
```

#### Install Missing Dependencies

```bash
# Install specific dependencies
npm install vue3-form-wizard @vuelidate/core @vuelidate/validators

# Or install with exact versions
npm install vue3-form-wizard@0.0.4 @vuelidate/core@2.0.0-alpha.42
```

#### Validate Installation

```javascript
import { validateDependencyVersions } from '../src/utils/dependency-checker.js';

const requirements = {
  'vue3-form-wizard': '^0.0.4',
  '@vuelidate/core': '^2.0.0-alpha.42'
};

const validation = await validateDependencyVersions(requirements);
console.log('Validation results:', validation);
```

### Step 3: Component Adoption

#### Using the Template Loader

```javascript
import { loadTemplateComponent } from '../src/utils/template-loader.js';

try {
  const result = await loadTemplateComponent('FormWizard', {
    checkDependencies: true,
    loadAssets: true,
    throwOnMissingDeps: false
  });
  
  console.log('Component loaded successfully:', result.component);
} catch (error) {
  console.error('Failed to load component:', error.message);
}
```

#### Manual Component Copying

1. **Copy the component file** from `src/views/[category]/[component].vue`
2. **Create your target file** in your desired location
3. **Apply customizations** to remove template-specific code

#### Component Customization

```javascript
// Remove template breadcrumbs
content = content.replace(
  /<teleport to="#breadcrumb">[\s\S]*?<\/teleport>\s*/g,
  ''
);

// Remove template navigation
content = content.replace(
  /<div class="nav sidenav">[\s\S]*?<\/div>\s*/g,
  ''
);

// Update component title
content = content.replace(
  /useMeta\(\{ title: ['"]([^'"]+)['"] \}\)/g,
  `useMeta({ title: 'Your Component Name' })`
);
```

### Step 4: Asset Management

#### Import Required SCSS

```scss
// In your main SCSS file or component style block
@import "src/assets/sass/forms/custom-flatpickr.css";
@import "src/assets/sass/components/custom-modal.scss";
```

#### Conditional Asset Loading

```javascript
import { loadComponentAssets } from '../src/utils/template-loader.js';

// Load assets dynamically
await loadComponentAssets([
  'src/assets/sass/forms/switches.scss',
  'src/assets/sass/components/timeline/custom-timeline.scss'
]);
```

### Step 5: Integration and Testing

#### Import in Parent Component

```vue
<template>
  <div>
    <MyAdoptedComponent :data="componentData" @event="handleEvent" />
  </div>
</template>

<script setup>
import MyAdoptedComponent from './components/MyAdoptedComponent.vue';

const componentData = ref({});

const handleEvent = (payload) => {
  console.log('Component event:', payload);
};
</script>
```

#### Test Component Functionality

1. **Verify Rendering**: Component displays correctly
2. **Test Interactions**: All interactive features work
3. **Check Dependencies**: No console errors about missing dependencies
4. **Validate Styling**: Component styling is applied correctly

## Dependency Groups and Management

### Understanding Dependency Groups

Template components are organized into dependency groups for easier management:

- **charts**: Chart and visualization libraries (~2.1MB)
- **calendar**: Calendar and scheduling components (~800KB)
- **forms**: Advanced form components (~1.5MB)
- **tables**: Data table components (~600KB)
- **ui-interactions**: Interactive UI components (~900KB)
- **utilities**: Utility libraries (~700KB)

### Template-Only vs Core Dependencies

#### Template-Only Dependencies
These can be installed on-demand when adopting specific components:
- `vue3-form-wizard`
- `vue3-carousel`
- `vue-easy-lightbox`
- `vue-draggable-next`
- `file-upload-with-preview`

#### Core Application Dependencies
These are already installed and used by the main application:
- `vue`
- `vue-router`
- `vuex`
- `vue-i18n`
- `apexcharts`
- `sweetalert2`

### Selective Installation Strategy

```bash
# Install only what you need for specific components

# For form components
npm install vue3-form-wizard @vuelidate/core @vuelidate/validators

# For interactive components
npm install vue-draggable-next vue3-carousel vue-countup-v3

# For data visualization
npm install apexcharts vue3-apexcharts  # Already installed in core

# For advanced tables
npm install @bhplugin/vue3-datatable
```

## Troubleshooting Guide

### Common Issues and Solutions

#### 1. Component Not Rendering

**Symptoms**: Component appears blank or throws errors

**Solutions**:
- Check browser console for JavaScript errors
- Verify all dependencies are installed
- Ensure component is properly imported and registered
- Check for missing SCSS imports

```javascript
// Debug component loading
import { validateComponent } from '../src/utils/template-loader.js';

const validation = await validateComponent('ComponentName');
console.log('Validation result:', validation);
```

#### 2. Missing Dependencies

**Symptoms**: Console errors about missing modules

**Solutions**:
- Use the dependency checker to identify missing packages
- Install missing dependencies with npm/yarn
- Verify package versions match requirements

```javascript
// Check and install dependencies
import { getInstallationCommand } from '../src/utils/template-loader.js';

const installInfo = await getInstallationCommand('ComponentName');
if (installInfo.needed) {
  console.log('Run:', installInfo.command);
}
```

#### 3. Styling Issues

**Symptoms**: Component appears unstyled or incorrectly styled

**Solutions**:
- Import required SCSS files
- Check for CSS conflicts with existing styles
- Verify asset paths are correct
- Ensure SCSS compilation includes new imports

```scss
// Import component-specific styles
@import "src/assets/sass/components/custom-modal.scss";
@import "src/assets/sass/forms/switches.scss";
```

#### 4. Version Conflicts

**Symptoms**: Dependency version warnings or runtime errors

**Solutions**:
- Check for conflicting package versions
- Update dependencies to compatible versions
- Use exact versions if needed

```javascript
// Detect conflicts
import { detectDependencyConflicts } from '../src/utils/dependency-checker.js';

const conflicts = await detectDependencyConflicts(['vue3-datatable@1.0.1']);
console.log('Conflicts:', conflicts);
```

#### 5. Bundle Size Issues

**Symptoms**: Large bundle size after adopting components

**Solutions**:
- Review dependency size estimates
- Consider lighter alternatives
- Use tree-shaking to eliminate unused code
- Implement lazy loading for heavy components

```javascript
// Check size impact
import { getDependencySizeEstimates } from '../src/utils/dependency-checker.js';

const sizeInfo = await getDependencySizeEstimates(['apexcharts', 'vue3-apexcharts']);
console.log('Size impact:', sizeInfo.totalFormatted);
```

### Debugging Tools

#### Component Validation

```javascript
import { validateAllComponents } from '../src/utils/template-loader.js';

// Validate all template components
const report = await validateAllComponents();
console.log(`${report.valid}/${report.total} components are valid`);
```

#### Dependency Analysis

```javascript
import { createDependencyReport } from '../src/utils/dependency-checker.js';

// Comprehensive dependency analysis
const report = await createDependencyReport(['vue3-form-wizard', '@vuelidate/core']);
console.log('Dependency report:', report);
```

## Best Practices

### 1. Start Small
- Begin with components that have no dependencies
- Gradually adopt more complex components
- Test each component thoroughly before moving to the next

### 2. Dependency Management
- Install dependencies as needed, not all at once
- Keep track of which components use which dependencies
- Regularly audit and clean up unused dependencies

### 3. Customization Strategy
- Always remove template-specific code (breadcrumbs, navigation)
- Customize component names and props for your use case
- Maintain consistent styling with your application theme

### 4. Documentation
- Document which template components you've adopted
- Keep notes on customizations made
- Maintain a list of dependencies for each adopted component

### 5. Testing
- Test components in isolation first
- Verify integration with your existing components
- Check for performance impact, especially with heavy components

## Advanced Usage

### Batch Component Adoption

```javascript
import { loadMultipleComponents } from '../src/utils/template-loader.js';

// Adopt multiple related components
const components = ['FormWizard', 'FormValidation', 'FileUpload'];
const results = await loadMultipleComponents(components, {
  checkDependencies: true,
  throwOnMissingDeps: false
});

console.log(`Loaded ${results.loadedCount}/${results.totalCount} components`);
```

### Custom Adoption Workflow

```javascript
import { createAdoptionPlan } from '../src/utils/template-adopter.js';

// Create a custom adoption plan
const plan = await createAdoptionPlan('Calendar', 'src/components/MyCalendar.vue', {
  copyAssets: true,
  installDeps: true,
  customizeComponent: true
});

console.log('Adoption plan:', plan);
```

### Automated Dependency Installation

```javascript
import { generateInstallCommands } from '../src/utils/dependency-checker.js';

// Generate installation commands for different package managers
const npmCommands = generateInstallCommands(['vue3-form-wizard'], {
  packageManager: 'npm',
  saveAs: 'dependencies'
});

const yarnCommands = generateInstallCommands(['vue3-form-wizard'], {
  packageManager: 'yarn',
  exact: true
});
```

## Migration and Maintenance

### Updating Template Components

When template components are updated:

1. **Check for Breaking Changes**: Review component changes
2. **Update Dependencies**: Install new dependency versions
3. **Test Existing Integrations**: Ensure adopted components still work
4. **Apply New Features**: Optionally adopt new component features

### Dependency Cleanup

Periodically review and clean up dependencies:

```bash
# Analyze bundle size
npm run build -- --analyze

# Check for unused dependencies
npx depcheck

# Update dependencies
npm update
```

### Version Management

Keep track of template component versions:

```json
{
  "templateComponents": {
    "Calendar": {
      "version": "1.0.0",
      "adoptedDate": "2025-11-03",
      "customizations": ["removed breadcrumbs", "updated styling"]
    }
  }
}
```

This workflow ensures successful template component adoption with proper dependency management and minimal issues.