# Template Component Adoption Guide

Quick guide to adopting and using template components in the Bikmedia Admin project.

## 📋 Table of Contents
- [Quick Start](#quick-start)
- [Available Components](#available-components)
- [Adoption Methods](#adoption-methods)
- [Common Use Cases](#common-use-cases)
- [Troubleshooting](#troubleshooting)

## Quick Start

### 🚀 Fastest Way to Adopt a Component

```bash
# 1. List available components
npm run template:list

# 2. Get component information
npm run template:info DataTable

# 3. Adopt the component
npm run template:adopt DataTable
```

### 📖 Manual Adoption (5 minutes)

1. **Browse**: Check `src/views/` for available components
2. **Copy**: Copy component file to your location
3. **Install**: `npm install [required-dependencies]`
4. **Import**: Add SCSS imports if needed
5. **Use**: Import and use in your Vue component

## Available Components

### 📊 Most Popular Components

#### DataTable
- **Location**: `src/views/tables/vue3-datatable/`
- **Dependencies**: `@bhplugin/vue3-datatable`
- **Use Case**: Advanced data tables with sorting, filtering, pagination
- **Adoption**: `npm run template:adopt DataTable`

#### ApexCharts
- **Location**: `src/views/charts/apex_chart.vue`
- **Dependencies**: `apexcharts`, `vue3-apexcharts`
- **Use Case**: Interactive charts and graphs
- **Adoption**: `npm run template:adopt ApexCharts`

#### FormWizard
- **Location**: `src/views/forms/wizards.vue`
- **Dependencies**: `vue3-form-wizard`
- **Use Case**: Multi-step forms
- **Adoption**: `npm run template:adopt FormWizard`

#### Timeline
- **Location**: `src/views/components/timeline.vue`
- **Dependencies**: None (pure CSS)
- **Use Case**: Event timelines, activity feeds
- **Adoption**: Copy directly, no dependencies needed

### 📂 Component Categories

#### Forms (`src/views/forms/`)
- **Basic Forms**: Input validation, layouts
- **Advanced Forms**: Wizards, file uploads, editors
- **Form Elements**: Switches, selectors, masks

#### Tables (`src/views/tables/`)
- **Data Tables**: Sorting, filtering, pagination
- **Simple Tables**: Basic table layouts
- **Advanced Tables**: Export, search, custom columns

#### Charts (`src/views/charts/`)
- **ApexCharts**: Line, bar, pie, area charts
- **Interactive Charts**: Zoom, drill-down capabilities

#### UI Components (`src/views/components/`)
- **Layout**: Cards, accordions, tabs
- **Interactive**: Modals, carousels, lightboxes
- **Display**: Timeline, pricing tables, counters

#### Authentication (`src/views/auth/`)
- **Login Forms**: Standard and boxed layouts
- **Registration**: User signup forms
- **Recovery**: Password reset forms

#### Pages (`src/views/pages/`)
- **Error Pages**: 404, 500, 503 pages
- **Utility Pages**: FAQ, contact, coming soon
- **Info Pages**: Privacy policy, help desk

## Adoption Methods

### Method 1: Automated Adoption (Recommended)

```bash
# List all available components
npm run template:list

# Get detailed info about a component
npm run template:info ComponentName

# Adopt a component with automatic dependency installation
npm run template:adopt ComponentName
```

**Benefits**:
- ✅ Automatic dependency installation
- ✅ Asset management
- ✅ Integration validation
- ✅ Rollback on failure

### Method 2: Manual Adoption

#### Step-by-Step Process

1. **Identify Component**
   ```bash
   # Browse available components
   ls src/views/forms/
   ls src/views/tables/
   ls src/views/components/
   ```

2. **Check Dependencies**
   - Look at component imports
   - Check `package.json` for existing dependencies
   - Note any SCSS imports needed

3. **Copy Component**
   ```bash
   # Copy to your components directory
   cp src/views/forms/wizards.vue src/components/MyFormWizard.vue
   ```

4. **Install Dependencies**
   ```bash
   # Install required packages
   npm install vue3-form-wizard
   ```

5. **Import Assets**
   ```vue
   <style lang="scss">
   @import '@/assets/sass/forms/wizard.scss';
   </style>
   ```

6. **Use Component**
   ```vue
   <template>
     <MyFormWizard />
   </template>

   <script>
   import MyFormWizard from '@/components/MyFormWizard.vue'
   
   export default {
     components: { MyFormWizard }
   }
   </script>
   ```

### Method 3: Reference-Based Usage

For simple components, you can reference them directly:

```vue
<script>
// Import template component directly
import TimelineComponent from '@/views/components/timeline.vue'

export default {
  components: {
    TimelineComponent
  }
}
</script>
```

## Common Use Cases

### 🎯 Scenario 1: Adding a Data Table

**Need**: Display user data with sorting and filtering

**Solution**: Adopt DataTable component
```bash
npm run template:adopt DataTable
```

**Customization**:
```vue
<template>
  <DataTable 
    :columns="userColumns"
    :data="userData"
    :options="tableOptions"
  />
</template>
```

### 🎯 Scenario 2: Creating a Multi-Step Form

**Need**: User registration with multiple steps

**Solution**: Adopt FormWizard component
```bash
npm run template:adopt FormWizard
```

**Customization**:
```vue
<template>
  <FormWizard>
    <tab-content title="Personal Info">
      <!-- Step 1 content -->
    </tab-content>
    <tab-content title="Account Details">
      <!-- Step 2 content -->
    </tab-content>
  </FormWizard>
</template>
```

### 🎯 Scenario 3: Adding Charts to Dashboard

**Need**: Display analytics with interactive charts

**Solution**: Adopt ApexCharts component
```bash
npm run template:adopt ApexCharts
```

**Customization**:
```vue
<template>
  <apexchart 
    type="line" 
    :options="chartOptions" 
    :series="chartData"
  />
</template>
```

### 🎯 Scenario 4: Creating an Activity Timeline

**Need**: Show user activity history

**Solution**: Copy Timeline component (no dependencies)
```bash
cp src/views/components/timeline.vue src/components/ActivityTimeline.vue
```

**Customization**:
```vue
<template>
  <div class="timeline">
    <div class="timeline-item" v-for="activity in activities">
      <!-- Activity content -->
    </div>
  </div>
</template>
```

## Troubleshooting

### Common Issues

#### ❌ "Component not found"
**Problem**: Template component path is incorrect
**Solution**: 
```bash
# Verify component exists
ls src/views/forms/wizards.vue
# Use correct path in adoption
```

#### ❌ "Dependency missing"
**Problem**: Required package not installed
**Solution**:
```bash
# Check component dependencies
npm run template:info ComponentName
# Install missing dependencies
npm install missing-package
```

#### ❌ "Styles not loading"
**Problem**: SCSS imports missing
**Solution**:
```vue
<style lang="scss">
@import '@/assets/sass/components/component-name.scss';
</style>
```

#### ❌ "Build errors"
**Problem**: Conflicting dependencies or imports
**Solution**:
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Getting Help

#### 📖 Documentation Resources
- **[Component Catalog](../Template-Components/component-catalog.md)** - Full component list
- **[Adoption Guide](../Template-Components/adoption-guide.md)** - Detailed adoption process
- **[Usage Examples](../Template-Components/examples.md)** - Code examples

#### 🔍 Debugging Steps
1. **Check component exists**: Verify file path
2. **Verify dependencies**: Ensure packages are installed
3. **Test in isolation**: Create minimal test component
4. **Check console**: Look for error messages
5. **Validate imports**: Ensure correct import paths

#### 💡 Pro Tips
- **Start simple**: Begin with components that have no dependencies
- **Test early**: Verify component works before heavy customization
- **Keep originals**: Don't modify template files directly
- **Document changes**: Note customizations for future reference

## Quick Reference

### Essential Commands
```bash
npm run template:list          # List all components
npm run template:info [name]   # Get component details
npm run template:adopt [name]  # Adopt component
```

### Component Locations
```
src/views/
├── forms/          # Form components
├── tables/         # Table components  
├── charts/         # Chart components
├── components/     # UI components
├── auth/           # Authentication
└── pages/          # Page templates
```

### Dependency Check
```bash
# Check if dependency exists
npm list package-name

# Install if missing
npm install package-name
```

---

**Need more help?** Check the [complete template documentation](../Template-Components/README.md) or browse the [component catalog](../Template-Components/component-catalog.md)!