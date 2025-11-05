# Template Component Dependency Troubleshooting Guide

This guide helps resolve common dependency issues when adopting template components.

## Quick Diagnosis

### Check Component Dependencies

```bash
# List all available components and their dependencies
npm run template:list

# Get detailed info about a specific component
npm run template:info Calendar

# Check what dependencies are missing
node -e "
import('./src/utils/dependency-checker.js').then(checker => {
  checker.default.createDependencyReport(['vue3-form-wizard', '@vuelidate/core'])
    .then(report => console.log(JSON.stringify(report, null, 2)));
});
"
```

### Validate Current Installation

```javascript
// In browser console or Node.js
import { validateAllComponents } from './src/utils/template-loader.js';

const report = await validateAllComponents();
console.log(`${report.valid}/${report.total} components ready to use`);
console.log(`${report.missingDependencies} components need dependencies`);
```

## Common Dependency Issues

### 1. Module Not Found Errors

**Error**: `Cannot resolve module 'vue3-form-wizard'`

**Cause**: Package not installed or incorrect import path

**Solutions**:

```bash
# Install the missing package
npm install vue3-form-wizard

# Or install with specific version
npm install vue3-form-wizard@0.0.4

# Verify installation
npm list vue3-form-wizard
```

**Prevention**:
```javascript
// Always check dependencies before adopting
import { getInstallationCommand } from './src/utils/template-loader.js';

const installInfo = await getInstallationCommand('FormWizard');
if (installInfo.needed) {
  console.log('Install first:', installInfo.command);
}
```

### 2. Version Conflicts

**Error**: `ERESOLVE unable to resolve dependency tree`

**Cause**: Conflicting package versions

**Diagnosis**:
```javascript
import { detectDependencyConflicts } from './src/utils/dependency-checker.js';

const conflicts = await detectDependencyConflicts(['vue3-datatable@1.0.1']);
console.log('Conflicts found:', conflicts);
```

**Solutions**:

```bash
# Option 1: Use --force to override (not recommended)
npm install vue3-datatable --force

# Option 2: Install compatible version
npm install vue3-datatable@^1.0.0

# Option 3: Update conflicting packages
npm update @bhplugin/vue3-datatable

# Option 4: Use exact versions
npm install vue3-datatable@1.0.1 --save-exact
```

### 3. Peer Dependency Warnings

**Warning**: `WARN vue3-apexcharts@1.4.1 requires a peer of apexcharts@^3.35.0`

**Cause**: Peer dependencies not installed

**Solutions**:
```bash
# Install peer dependencies
npm install apexcharts@^3.35.0

# Install all peer dependencies automatically
npx install-peerdeps vue3-apexcharts

# Check what peer deps are needed
npm info vue3-apexcharts peerDependencies
```

### 4. TypeScript Declaration Issues

**Error**: `Could not find a declaration file for module 'vue3-form-wizard'`

**Cause**: Missing TypeScript declarations

**Solutions**:
```bash
# Install type definitions if available
npm install @types/vue3-form-wizard

# Or create custom declarations
echo "declare module 'vue3-form-wizard';" > src/types/vue3-form-wizard.d.ts

# Add to tsconfig.json
{
  "compilerOptions": {
    "typeRoots": ["./src/types", "./node_modules/@types"]
  }
}
```

### 5. Build Errors with Vite

**Error**: `Failed to resolve import "vue3-easymde" from "src/components/Editor.vue"`

**Cause**: Package not compatible with Vite's ESM

**Solutions**:
```javascript
// vite.config.js
export default {
  optimizeDeps: {
    include: ['vue3-easymde', 'vue3-form-wizard']
  },
  build: {
    commonjsOptions: {
      include: [/vue3-easymde/, /node_modules/]
    }
  }
}
```

## Dependency Group Troubleshooting

### Charts Group Issues

**Common Problems**:
- Large bundle size
- Multiple chart libraries conflict
- Canvas rendering issues

**Solutions**:
```bash
# Install only needed chart library
npm install apexcharts vue3-apexcharts  # Already in core
# OR
npm install echarts vue3-echarts

# Don't install both - choose one
```

### Forms Group Issues

**Common Problems**:
- Validation not working
- Form wizard steps broken
- File upload failures

**Solutions**:
```bash
# Install complete validation suite
npm install @vuelidate/core @vuelidate/validators

# For file uploads
npm install file-upload-with-preview

# Check form component dependencies
npm run template:info FormWizard
```

### Tables Group Issues

**Common Problems**:
- Table not rendering
- Sorting/filtering broken
- Performance issues with large data

**Solutions**:
```bash
# Choose one table library
npm install @bhplugin/vue3-datatable
# OR
npm install v-tables-3

# Don't install multiple table libraries
```

## Advanced Troubleshooting

### Dependency Tree Analysis

```bash
# View complete dependency tree
npm list --depth=3

# Check for duplicate packages
npm ls --depth=0 | grep -E "(vue3-|@)"

# Find why a package was installed
npm why vue3-form-wizard
```

### Bundle Analysis

```bash
# Analyze bundle size impact
npm run build -- --analyze

# Check what's included in bundle
npx webpack-bundle-analyzer dist/assets/*.js
```

### Clean Installation

```bash
# Nuclear option - clean reinstall
rm -rf node_modules package-lock.json
npm install

# Or with yarn
rm -rf node_modules yarn.lock
yarn install
```

## Dependency Optimization Strategies

### 1. Lazy Loading Heavy Components

```javascript
// Instead of direct import
import Calendar from './components/Calendar.vue';

// Use dynamic import
const Calendar = defineAsyncComponent(() => import('./components/Calendar.vue'));

// Or with loading states
const Calendar = defineAsyncComponent({
  loader: () => import('./components/Calendar.vue'),
  loadingComponent: LoadingSpinner,
  errorComponent: ErrorComponent,
  delay: 200,
  timeout: 3000
});
```

### 2. Conditional Dependency Loading

```javascript
// Load dependencies only when needed
const loadChartComponent = async () => {
  // Check if chart libraries are available
  try {
    await import('apexcharts');
    await import('vue3-apexcharts');
    return import('./components/ApexChart.vue');
  } catch (error) {
    console.warn('Chart dependencies not available');
    return import('./components/SimpleChart.vue');
  }
};
```

### 3. Tree Shaking Optimization

```javascript
// Import only what you need
import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';

// Instead of importing everything
// import * as FullCalendar from '@fullcalendar/core';
```

## Monitoring and Maintenance

### Regular Dependency Audits

```bash
# Check for security vulnerabilities
npm audit

# Fix automatically
npm audit fix

# Check for outdated packages
npm outdated

# Update packages
npm update
```

### Bundle Size Monitoring

```javascript
// Add to build process
const bundleSize = require('bundle-size');

bundleSize({
  files: ['dist/assets/*.js'],
  maxSize: '2MB'
}).then(results => {
  console.log('Bundle size check:', results);
});
```

### Dependency Health Check

```javascript
// Create a health check script
import { validateAllComponents } from './src/utils/template-loader.js';
import { createDependencyReport } from './src/utils/dependency-checker.js';

async function healthCheck() {
  const componentValidation = await validateAllComponents();
  const dependencyReport = await createDependencyReport(getAllDependencies());
  
  console.log('Component Health:', componentValidation.summary);
  console.log('Dependency Health:', dependencyReport.summary);
  
  if (dependencyReport.conflicts.length > 0) {
    console.warn('⚠️ Dependency conflicts detected');
  }
  
  if (componentValidation.invalid > 0) {
    console.warn('⚠️ Some components have issues');
  }
}

// Run health check
healthCheck();
```

## Emergency Recovery

### If Everything Breaks

1. **Backup Current State**:
   ```bash
   cp package.json package.json.backup
   cp package-lock.json package-lock.json.backup
   ```

2. **Reset to Known Good State**:
   ```bash
   git checkout HEAD -- package.json package-lock.json
   rm -rf node_modules
   npm install
   ```

3. **Gradually Re-add Dependencies**:
   ```bash
   # Add one dependency at a time
   npm install vue3-form-wizard
   npm run build  # Test after each addition
   ```

4. **Use Dependency Mapping**:
   ```javascript
   // Check what was working before
   const mapping = await fetch('/template-dependencies.json').then(r => r.json());
   console.log('Known working versions:', mapping.componentDependencies);
   ```

### Rollback Strategy

```javascript
// Create rollback information before major changes
const rollbackInfo = {
  timestamp: new Date().toISOString(),
  packageJson: JSON.parse(fs.readFileSync('package.json', 'utf8')),
  installedComponents: Object.keys(adoptedComponents),
  notes: 'Before adopting Calendar component'
};

// Save rollback info
fs.writeFileSync('rollback-info.json', JSON.stringify(rollbackInfo, null, 2));
```

## Getting Help

### Debug Information to Collect

When reporting dependency issues, include:

```bash
# System information
node --version
npm --version
cat package.json | grep -A 20 '"dependencies"'

# Error details
npm ls --depth=0 2>&1 | grep -E "(WARN|ERROR)"

# Component status
npm run template:list | head -20
```

### Useful Commands Reference

```bash
# Dependency management
npm install <package>          # Install package
npm uninstall <package>        # Remove package
npm list <package>             # Check if installed
npm outdated                   # Check for updates
npm audit                      # Security check

# Template component tools
npm run template:list          # List all components
npm run template:info <name>   # Component details
npm run template:adopt <name> <path>  # Adopt component

# Troubleshooting
npm cache clean --force        # Clear npm cache
rm -rf node_modules && npm install  # Clean reinstall
npm config list               # Check npm configuration
```

This troubleshooting guide should help resolve most dependency-related issues when adopting template components.