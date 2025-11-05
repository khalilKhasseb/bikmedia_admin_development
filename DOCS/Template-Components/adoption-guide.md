# Template Component Adoption Guide

This guide provides step-by-step instructions for adopting template components into your project. The process is designed to be simple and flexible, allowing you to integrate only the components you need.

## Quick Start Process

### 1. Choose Your Component
Browse the [component catalog](./component-catalog.md) to find the component you need. Each component listing includes:
- File path and location
- Required dependencies
- Associated assets
- Feature descriptions
- Usage recommendations

### 2. Check Dependencies
Most dependencies are already included in the project. Verify required packages are installed:

```bash
# Check if a dependency is installed
npm list [dependency-name]

# Install missing dependencies if needed
npm install [dependency-name]
```

### 3. Copy Component Files
Copy the component file to your desired location:

```bash
# Example: Copy a form wizard component
cp src/views/forms/wizards.vue src/components/MyFormWizard.vue
```

### 4. Import Required Assets
Add any required SCSS imports to your component or main stylesheet:

```scss
// In your component's <style> section or main SCSS file
@import 'src/assets/sass/forms/switches.scss';
```

### 5. Customize and Integrate
Modify the component to fit your needs and integrate it into your application.

## Detailed Adoption Steps

### Step 1: Component Selection

Use the component inventory system to find suitable components:

```javascript
// Import the component catalog
import { templateComponents, getComponentsByCategory, searchComponents } from 'src/templates/available-components.js';

// Browse by category
const formComponents = getComponentsByCategory('forms');

// Search for specific functionality
const chartComponents = searchComponents('chart');

// Get component details
const wizardInfo = templateComponents['FormWizard'];
console.log(wizardInfo.dependencies); // Check required packages
console.log(wizardInfo.assets);       // Check required assets
```

### Step 2: Dependency Management

#### Check Current Dependencies
```bash
# List all installed packages
npm list --depth=0

# Check specific dependency
npm list vue3-form-wizard
```

#### Install Missing Dependencies
```bash
# Install a single dependency
npm install vue3-form-wizard

# Install multiple dependencies
npm install apexcharts vue3-apexcharts

# Install with specific version
npm install @bhplugin/vue3-datatable@^1.0.1
```

#### Verify Installation
```bash
# Check package.json was updated
cat package.json | grep "vue3-form-wizard"

# Test import in Node
node -e "console.log(require('vue3-form-wizard'))"
```

### Step 3: File Organization

#### Recommended Directory Structure
```
src/
├── components/
│   ├── forms/           # Adopted form components
│   ├── tables/          # Adopted table components
│   ├── charts/          # Adopted chart components
│   └── ui/              # Adopted UI components
├── templates/           # Component inventory
└── views/               # Original template files (preserved)
```

#### Copy Component Files
```bash
# Create component directories
mkdir -p src/components/forms
mkdir -p src/components/tables
mkdir -p src/components/charts
mkdir -p src/components/ui

# Copy specific components
cp src/views/forms/wizards.vue src/components/forms/FormWizard.vue
cp src/views/tables/vue3-datatable/basic.vue src/components/tables/DataTable.vue
cp src/views/components/modals.vue src/components/ui/Modal.vue
```

### Step 4: Asset Integration

#### SCSS Asset Management
```scss
// Option 1: Import in component
<style lang="scss">
@import 'src/assets/sass/forms/switches.scss';
// Your custom styles here
</style>

// Option 2: Import in main SCSS file
// src/assets/sass/app.scss
@import 'forms/switches.scss';
@import 'components/custom-modal.scss';
```

#### CSS Asset Management
```javascript
// For CSS files, import in component script
import 'src/assets/sass/forms/file-upload-with-preview.min.css';
```

### Step 5: Component Customization

#### Basic Component Structure
```vue
<template>
  <!-- Copy template content from original component -->
  <!-- Modify as needed for your use case -->
</template>

<script setup>
// Import required dependencies
import { ref, onMounted } from 'vue';
import SomeLibrary from 'some-library';

// Import utilities if needed
import { useMeta } from '/src/composables/use-meta';

// Your component logic
const componentData = ref([]);

// Set page meta if needed
useMeta({ title: 'My Custom Component' });
</script>

<style lang="scss" scoped>
// Import required assets
@import 'src/assets/sass/components/custom-modal.scss';

// Your custom styles
.my-custom-class {
  // Custom styling
}
</style>
```

#### Remove Template-Specific Code
When customizing, remove or modify:
- Breadcrumb teleports (unless needed)
- Template-specific navigation
- Demo data and examples
- Template-specific styling classes

#### Example Customization
```vue
<!-- Original template component -->
<template>
  <div class="container">
    <teleport to="#breadcrumb">
      <!-- Remove this breadcrumb section -->
    </teleport>
    
    <div class="container">
      <div class="nav sidenav">
        <!-- Remove this navigation section -->
      </div>
      
      <!-- Keep this main content -->
      <div class="row layout-top-spacing">
        <div class="col-12">
          <!-- Your component content -->
        </div>
      </div>
    </div>
  </div>
</template>

<!-- Customized component -->
<template>
  <div class="my-component">
    <!-- Keep only the essential content -->
    <div class="component-content">
      <!-- Your customized content -->
    </div>
  </div>
</template>
```

## Component-Specific Adoption Examples

### Adopting a Form Wizard

```bash
# 1. Copy the component
cp src/views/forms/wizards.vue src/components/forms/RegistrationWizard.vue

# 2. Install dependencies (if not already installed)
npm install vue3-form-wizard

# 3. Customize the component
```

```vue
<!-- src/components/forms/RegistrationWizard.vue -->
<template>
  <div class="registration-wizard">
    <form-wizard @on-complete="onComplete">
      <tab-content title="Personal Info">
        <!-- Step 1 content -->
      </tab-content>
      <tab-content title="Account Details">
        <!-- Step 2 content -->
      </tab-content>
      <tab-content title="Confirmation">
        <!-- Step 3 content -->
      </tab-content>
    </form-wizard>
  </div>
</template>

<script setup>
import { FormWizard, TabContent } from 'vue3-form-wizard';
import 'vue3-form-wizard/dist/style.css';

const onComplete = () => {
  console.log('Registration completed!');
};
</script>
```

### Adopting a Data Table

```bash
# 1. Copy the component
cp src/views/tables/vue3-datatable/basic.vue src/components/tables/UserTable.vue

# 2. Dependencies already installed (@bhplugin/vue3-datatable)

# 3. Customize for your data
```

```vue
<!-- src/components/tables/UserTable.vue -->
<template>
  <div class="user-table">
    <vue3-datatable 
      :rows="users" 
      :columns="columns" 
      :totalRows="users?.length"
      skin="table-hover"
      @row-click="onRowClick"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Vue3Datatable from '@bhplugin/vue3-datatable';

const props = defineProps({
  users: Array
});

const columns = ref([
  { field: 'id', title: 'ID', isUnique: true },
  { field: 'name', title: 'Name' },
  { field: 'email', title: 'Email' },
  { field: 'role', title: 'Role' }
]);

const onRowClick = (row) => {
  console.log('User selected:', row);
};
</script>
```

### Adopting Charts

```bash
# 1. Copy the component
cp src/views/charts/apex_chart.vue src/components/charts/SalesChart.vue

# 2. Dependencies already installed (apexcharts, vue3-apexcharts)

# 3. Customize for your data
```

```vue
<!-- src/components/charts/SalesChart.vue -->
<template>
  <div class="sales-chart">
    <apexchart 
      type="line" 
      :options="chartOptions" 
      :series="series"
      height="350"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  salesData: Array
});

const series = ref([{
  name: 'Sales',
  data: props.salesData || []
}]);

const chartOptions = ref({
  chart: {
    type: 'line',
    toolbar: { show: false }
  },
  xaxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
  },
  colors: ['#1f2937']
});
</script>
```

## Best Practices

### 1. Component Naming
- Use descriptive names that reflect your use case
- Follow your project's naming conventions
- Avoid generic names like "Component1" or "MyComponent"

### 2. File Organization
- Group related components in logical directories
- Keep adopted components separate from original template files
- Use consistent directory structure across your project

### 3. Dependency Management
- Only install dependencies for components you actually use
- Keep track of which components require which dependencies
- Consider using peer dependencies for optional features

### 4. Customization Strategy
- Start with minimal changes to ensure functionality
- Gradually customize styling and behavior
- Document your changes for future reference

### 5. Asset Optimization
- Only import assets for components you're using
- Consider creating a custom SCSS file for your adopted components
- Remove unused template-specific styles

## Troubleshooting

### Common Issues

#### Dependency Not Found
```bash
# Error: Module not found
npm install [missing-dependency]

# Check if dependency is listed in package.json
cat package.json | grep [dependency-name]
```

#### Style Not Applied
```scss
// Ensure SCSS import is correct
@import 'src/assets/sass/components/custom-modal.scss';

// Check if path exists
ls src/assets/sass/components/custom-modal.scss
```

#### Component Not Rendering
```javascript
// Check component import
import MyComponent from './components/MyComponent.vue';

// Verify component is registered
export default {
  components: {
    MyComponent
  }
}
```

### Getting Help

1. **Check Original Template**: Reference the original template component for working examples
2. **Review Dependencies**: Ensure all required packages are installed and imported
3. **Validate Paths**: Verify all file paths and imports are correct
4. **Test Incrementally**: Start with minimal changes and add features gradually

## Maintenance

### Keeping Components Updated
- Track which template components you've adopted
- Document customizations made to each component
- Consider creating a component adoption log
- Regularly review and update dependencies

### Component Adoption Log Example
```markdown
# Component Adoption Log

## FormWizard (adopted 2024-01-15)
- **Source**: src/views/forms/wizards.vue
- **Location**: src/components/forms/RegistrationWizard.vue
- **Dependencies**: vue3-form-wizard
- **Customizations**: 
  - Removed breadcrumb navigation
  - Added custom validation
  - Modified styling for brand colors

## DataTable (adopted 2024-01-20)
- **Source**: src/views/tables/vue3-datatable/basic.vue
- **Location**: src/components/tables/UserTable.vue
- **Dependencies**: @bhplugin/vue3-datatable
- **Customizations**:
  - Added row click handler
  - Custom column configuration
  - Integrated with user API
```

This adoption guide provides a comprehensive approach to integrating template components while maintaining flexibility and avoiding unnecessary complexity.