#!/usr/bin/env node

/**
 * Template Component Adoption Script
 * 
 * This script provides an interactive command-line interface for adopting
 * template components with dependency management and guided setup.
 * 
 * Usage:
 *   node scripts/adopt-template-component.js [component-name] [target-path]
 *   npm run adopt:component [component-name] [target-path]
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { dirname, resolve } from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Import our utilities (simplified for Node.js environment)
let templateComponents = {};
let dependencyMapping = {};

try {
  // Load template components
  const componentsPath = resolve(__dirname, '../src/templates/available-components.js');
  if (existsSync(componentsPath)) {
    const componentsContent = readFileSync(componentsPath, 'utf8');
    // Extract the templateComponents object (simplified parsing)
    const match = componentsContent.match(/export const templateComponents = ({[\s\S]*?});/);
    if (match) {
      templateComponents = eval(`(${match[1]})`);
    }
  }

  // Load dependency mapping
  const mappingPath = resolve(__dirname, '../template-dependencies.json');
  if (existsSync(mappingPath)) {
    dependencyMapping = JSON.parse(readFileSync(mappingPath, 'utf8'));
  }
} catch (error) {
  console.error('Error loading template data:', error.message);
  process.exit(1);
}

/**
 * Display help information
 */
function showHelp() {
  console.log(`
Template Component Adoption Script
=================================

Usage:
  node scripts/adopt-template-component.js [options] <component-name> <target-path>

Options:
  --list, -l           List all available components
  --info, -i <name>    Show detailed information about a component
  --dry-run, -d        Show what would be done without making changes
  --install-deps       Automatically install missing dependencies
  --help, -h           Show this help message

Examples:
  node scripts/adopt-template-component.js --list
  node scripts/adopt-template-component.js --info Calendar
  node scripts/adopt-template-component.js Calendar src/components/MyCalendar.vue
  node scripts/adopt-template-component.js --dry-run DataTable src/views/MyTable.vue

Available Components:
${Object.keys(templateComponents).map(name => `  • ${name}`).join('\n')}
`);
}

/**
 * List all available components with categories
 */
function listComponents() {
  console.log('\nAvailable Template Components:');
  console.log('==============================\n');

  const categories = {};
  Object.entries(templateComponents).forEach(([name, info]) => {
    if (!categories[info.category]) {
      categories[info.category] = [];
    }
    categories[info.category].push({ name, info });
  });

  Object.entries(categories).forEach(([category, components]) => {
    console.log(`📁 ${category.toUpperCase()}`);
    components.forEach(({ name, info }) => {
      const deps = info.dependencies?.length || 0;
      const depsText = deps > 0 ? ` (${deps} deps)` : ' (no deps)';
      console.log(`   • ${name}${depsText} - ${info.description}`);
    });
    console.log('');
  });
}

/**
 * Show detailed information about a component
 */
function showComponentInfo(componentName) {
  const info = templateComponents[componentName];
  if (!info) {
    console.error(`❌ Component "${componentName}" not found.`);
    console.log('\nAvailable components:');
    console.log(Object.keys(templateComponents).join(', '));
    return;
  }

  const depInfo = dependencyMapping.componentDependencies?.[componentName];

  console.log(`\n📦 ${componentName}`);
  console.log('='.repeat(componentName.length + 3));
  console.log(`Category: ${info.category}`);
  console.log(`Description: ${info.description}`);
  console.log(`Path: ${info.path}`);
  
  if (depInfo) {
    console.log(`Group: ${depInfo.group}`);
    console.log(`Estimated Size: ${depInfo.estimatedSize}`);
  }

  console.log('\n📋 Features:');
  info.features?.forEach(feature => console.log(`   • ${feature}`));

  console.log('\n📦 Dependencies:');
  if (info.dependencies?.length > 0) {
    info.dependencies.forEach(dep => console.log(`   • ${dep}`));
  } else {
    console.log('   • No external dependencies');
  }

  console.log('\n🎨 Assets:');
  if (info.assets?.length > 0) {
    info.assets.forEach(asset => console.log(`   • ${asset}`));
  } else {
    console.log('   • No additional assets required');
  }

  console.log(`\n💡 Usage Example:\n   ${info.usageExample}`);
}

/**
 * Check if dependencies are installed
 */
function checkDependencies(dependencies) {
  if (!dependencies || dependencies.length === 0) {
    return { missing: [], installed: [] };
  }

  const missing = [];
  const installed = [];

  dependencies.forEach(dep => {
    const packageName = dep.split('@')[0];
    try {
      execSync(`npm list ${packageName}`, { stdio: 'ignore' });
      installed.push(dep);
    } catch (error) {
      missing.push(dep);
    }
  });

  return { missing, installed };
}

/**
 * Install missing dependencies
 */
function installDependencies(dependencies) {
  if (!dependencies || dependencies.length === 0) {
    return true;
  }

  const packageNames = dependencies.map(dep => dep.split('@')[0]);
  const command = `npm install ${packageNames.join(' ')}`;

  console.log(`\n📦 Installing dependencies: ${packageNames.join(', ')}`);
  console.log(`Command: ${command}`);

  try {
    execSync(command, { stdio: 'inherit' });
    console.log('✅ Dependencies installed successfully');
    return true;
  } catch (error) {
    console.error('❌ Failed to install dependencies:', error.message);
    return false;
  }
}

/**
 * Copy component file with customizations
 */
function copyComponent(sourcePath, targetPath, componentName, dryRun = false) {
  const fullSourcePath = resolve(__dirname, '..', sourcePath);
  const fullTargetPath = resolve(__dirname, '..', targetPath);

  if (!existsSync(fullSourcePath)) {
    throw new Error(`Source component not found: ${sourcePath}`);
  }

  // Create target directory if it doesn't exist
  const targetDir = dirname(fullTargetPath);
  if (!dryRun && !existsSync(targetDir)) {
    mkdirSync(targetDir, { recursive: true });
  }

  // Read source content
  let content = readFileSync(fullSourcePath, 'utf8');

  // Apply customizations
  content = customizeComponent(content, componentName);

  if (dryRun) {
    console.log(`\n📄 Would create file: ${targetPath}`);
    console.log('Content preview (first 10 lines):');
    console.log(content.split('\n').slice(0, 10).join('\n'));
    console.log('...');
  } else {
    writeFileSync(fullTargetPath, content, 'utf8');
    console.log(`✅ Component copied to: ${targetPath}`);
  }

  return content;
}

/**
 * Customize component content
 */
function customizeComponent(content, componentName) {
  // Remove breadcrumb teleports
  content = content.replace(
    /<teleport to="#breadcrumb">[\s\S]*?<\/teleport>\s*/g,
    ''
  );

  // Remove template navigation
  content = content.replace(
    /<div class="nav sidenav">[\s\S]*?<\/div>\s*/g,
    ''
  );

  // Update meta title
  content = content.replace(
    /useMeta\(\{ title: ['"]([^'"]+)['"] \}\)/g,
    `useMeta({ title: '${componentName}' })`
  );

  // Add customization comment
  const customizationComment = `<!--
  This component was adopted from the template library.
  
  Customizations applied:
  - Removed template breadcrumbs
  - Removed template navigation
  - Updated component title
  
  Next steps:
  1. Update component name and props as needed
  2. Customize styling to match your design
  3. Add your business logic
  4. Remove unused template code
-->

`;

  // Add comment at the beginning of template
  content = content.replace('<template>', `<template>\n${customizationComment}`);

  return content;
}

/**
 * Generate adoption instructions
 */
function generateInstructions(componentName, targetPath, depCheck, assets) {
  const instructions = [
    `\n📋 ADOPTION COMPLETE: ${componentName}`,
    '='.repeat(50),
    '',
    '✅ WHAT WAS DONE:',
    `   • Component copied to: ${targetPath}`,
    `   • Applied basic customizations`,
    `   • Removed template-specific code`,
    ''
  ];

  if (depCheck.missing.length > 0) {
    instructions.push('⚠️  DEPENDENCIES INSTALLED:');
    depCheck.missing.forEach(dep => instructions.push(`   • ${dep}`));
    instructions.push('');
  }

  if (assets && assets.length > 0) {
    instructions.push('🎨 ASSETS TO IMPORT:');
    assets.forEach(asset => instructions.push(`   • Add to your SCSS: @import "${asset}";`));
    instructions.push('');
  }

  instructions.push(
    '🔧 NEXT STEPS:',
    '   1. Review the copied component file',
    '   2. Update component name and props as needed',
    '   3. Customize styling to match your design',
    '   4. Add your business logic',
    '   5. Remove any unused template code',
    '   6. Import and use in your parent component',
    '',
    '📖 INTEGRATION EXAMPLE:',
    '   import MyComponent from "./path/to/component.vue";',
    '   ',
    '   export default {',
    '     components: { MyComponent }',
    '   }',
    '',
    '🆘 TROUBLESHOOTING:',
    '   • If component doesn\'t render, check console for errors',
    '   • Ensure all dependencies are properly installed',
    '   • Verify asset imports in your SCSS files',
    '   • Check Vue DevTools for component issues'
  );

  return instructions.join('\n');
}

/**
 * Main adoption function
 */
function adoptComponent(componentName, targetPath, options = {}) {
  const { dryRun = false, installDeps = false } = options;

  console.log(`\n🚀 Adopting template component: ${componentName}`);
  console.log(`Target path: ${targetPath}`);

  // Validate component
  const componentInfo = templateComponents[componentName];
  if (!componentInfo) {
    console.error(`❌ Component "${componentName}" not found.`);
    console.log('\nUse --list to see available components.');
    return false;
  }

  // Check if target file already exists
  const fullTargetPath = resolve(__dirname, '..', targetPath);
  if (existsSync(fullTargetPath) && !dryRun) {
    console.error(`❌ Target file already exists: ${targetPath}`);
    console.log('Choose a different target path or remove the existing file.');
    return false;
  }

  // Check dependencies
  console.log('\n🔍 Checking dependencies...');
  const depCheck = checkDependencies(componentInfo.dependencies);
  
  if (depCheck.missing.length > 0) {
    console.log(`⚠️  Missing dependencies: ${depCheck.missing.join(', ')}`);
    
    if (installDeps && !dryRun) {
      if (!installDependencies(depCheck.missing)) {
        return false;
      }
    } else {
      console.log(`\n📦 To install dependencies, run:`);
      console.log(`   npm install ${depCheck.missing.map(d => d.split('@')[0]).join(' ')}`);
      
      if (!dryRun) {
        console.log('\nOr run this script with --install-deps flag');
        return false;
      }
    }
  } else {
    console.log('✅ All dependencies are installed');
  }

  // Copy component
  console.log('\n📄 Copying component...');
  try {
    copyComponent(componentInfo.path, targetPath, componentName, dryRun);
  } catch (error) {
    console.error(`❌ Failed to copy component: ${error.message}`);
    return false;
  }

  // Show completion instructions
  if (!dryRun) {
    console.log(generateInstructions(componentName, targetPath, depCheck, componentInfo.assets));
  }

  return true;
}

/**
 * Parse command line arguments
 */
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    list: false,
    info: null,
    dryRun: false,
    installDeps: false,
    help: false,
    componentName: null,
    targetPath: null
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    switch (arg) {
      case '--list':
      case '-l':
        options.list = true;
        break;
      case '--info':
      case '-i':
        options.info = args[++i];
        break;
      case '--dry-run':
      case '-d':
        options.dryRun = true;
        break;
      case '--install-deps':
        options.installDeps = true;
        break;
      case '--help':
      case '-h':
        options.help = true;
        break;
      default:
        if (!options.componentName) {
          options.componentName = arg;
        } else if (!options.targetPath) {
          options.targetPath = arg;
        }
        break;
    }
  }

  return options;
}

/**
 * Main function
 */
function main() {
  const options = parseArgs();

  if (options.help) {
    showHelp();
    return;
  }

  if (options.list) {
    listComponents();
    return;
  }

  if (options.info) {
    showComponentInfo(options.info);
    return;
  }

  if (!options.componentName || !options.targetPath) {
    console.error('❌ Component name and target path are required.');
    console.log('\nUsage: node scripts/adopt-template-component.js <component-name> <target-path>');
    console.log('Use --help for more information.');
    process.exit(1);
  }

  const success = adoptComponent(options.componentName, options.targetPath, {
    dryRun: options.dryRun,
    installDeps: options.installDeps
  });

  process.exit(success ? 0 : 1);
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { adoptComponent, listComponents, showComponentInfo };