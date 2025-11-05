/**
 * Template Component Adoption Helper
 * 
 * This utility provides comprehensive tools for adopting template components,
 * including dependency management, file operations, and rollback functionality.
 */

import { templateComponents } from '../templates/available-components.js';
import { 
  getComponentDependencies, 
  getMissingDependencies, 
  getInstallCommand,
  validateComponentAdoption,
  calculateBundleImpact,
  getAdoptionRecommendation
} from './dependency-checker.js';

/**
 * Adoption result structure
 * @typedef {Object} AdoptionResult
 * @property {boolean} success - Whether adoption was successful
 * @property {string} componentName - Name of the adopted component
 * @property {string} targetPath - Path where component was copied
 * @property {string[]} installedDependencies - Dependencies that were installed
 * @property {string[]} copiedAssets - Assets that were copied
 * @property {string[]} warnings - Any warnings during adoption
 * @property {string[]} errors - Any errors during adoption
 * @property {Object} rollbackInfo - Information needed for rollback
 */

/**
 * Check if required dependencies are installed for a component
 * @param {string} componentName - Name of the component
 * @returns {Object} - Dependency check result using new dependency mapping
 */
export const checkDependencies = (componentName) => {
  try {
    const validation = validateComponentAdoption(componentName);
    const missingDeps = getMissingDependencies(componentName);
    
    return {
      allInstalled: validation.ready,
      missing: missingDeps,
      installed: validation.ready ? getComponentDependencies(componentName).dependencies : [],
      installCommand: validation.installCommand
    };
  } catch (error) {
    return {
      allInstalled: false,
      missing: [],
      installed: [],
      installCommand: null,
      error: error.message
    };
  }
};

/**
 * Generate npm install command for a component's missing dependencies
 * @param {string} componentName - Name of the component
 * @returns {string} - npm install command
 */
export const generateInstallCommand = (componentName) => {
  return getInstallCommand(componentName);
};

/**
 * Install dependencies using npm (Note: This is a helper that generates commands)
 * @param {string} componentName - Name of the component
 * @returns {Object} - Installation instructions
 */
export const installDependencies = (componentName) => {
  const installCommand = generateInstallCommand(componentName);
  const componentInfo = getComponentDependencies(componentName);
  
  return {
    command: installCommand,
    instructions: [
      'Run the following command in your terminal:',
      installCommand || 'No dependencies to install',
      '',
      'After installation, you can proceed with component adoption.'
    ].join('\n'),
    dependencies: componentInfo.dependencies,
    bundleImpact: componentInfo.bundleSize,
    note: 'This function provides installation instructions. Run the command in your terminal to install dependencies.'
  };
};

/**
 * Validate component adoption requirements
 * @param {string} componentName - Name of component to adopt
 * @param {string} targetPath - Target path for adoption
 * @returns {Promise<Object>} - Validation result
 */
export const validateAdoption = async (componentName, targetPath) => {
  const errors = [];
  const warnings = [];

  // Check if component exists
  const componentInfo = templateComponents[componentName];
  if (!componentInfo) {
    errors.push(`Component "${componentName}" not found in template catalog`);
    return { valid: false, errors, warnings };
  }

  // Check if source file exists
  try {
    await import(`../${componentInfo.path}`);
  } catch (error) {
    errors.push(`Source component file not found: ${componentInfo.path}`);
  }

  // Check target path
  if (!targetPath) {
    errors.push('Target path is required');
  } else {
    // Validate target path format
    if (!targetPath.endsWith('.vue')) {
      warnings.push('Target path should end with .vue extension');
    }
    
    if (!targetPath.startsWith('src/')) {
      warnings.push('Target path should be within src/ directory');
    }
  }

  // Check dependencies using new dependency mapping
  const depCheck = checkDependencies(componentName);
  if (!depCheck.allInstalled) {
    if (depCheck.missing.length > 0) {
      warnings.push(`Missing dependencies: ${depCheck.missing.join(', ')}`);
    }
    if (depCheck.installCommand) {
      warnings.push(`Install with: ${depCheck.installCommand}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    componentInfo,
    dependencyCheck: depCheck
  };
};

/**
 * Generate adoption plan for a component
 * @param {string} componentName - Name of component to adopt
 * @param {string} targetPath - Target path for adoption
 * @param {Object} options - Adoption options
 * @returns {Promise<Object>} - Adoption plan
 */
export const createAdoptionPlan = async (componentName, targetPath, options = {}) => {
  const {
    copyAssets = true,
    customizeComponent = true
  } = options;

  const validation = await validateAdoption(componentName, targetPath);
  if (!validation.valid) {
    return {
      valid: false,
      errors: validation.errors,
      warnings: validation.warnings
    };
  }

  const { componentInfo, dependencyCheck } = validation;
  
  const plan = {
    valid: true,
    componentName,
    targetPath,
    sourcePath: componentInfo.path,
    steps: [],
    dependencies: componentInfo.dependencies || [],
    assets: componentInfo.assets || [],
    warnings: validation.warnings
  };

  // Step 1: Check/Install dependencies
  if (componentInfo.dependencies && componentInfo.dependencies.length > 0) {
    if (!dependencyCheck.allInstalled) {
      plan.steps.push({
        type: 'install-dependencies',
        description: `Install missing dependencies: ${dependencyCheck.missing.join(', ')}`,
        command: dependencyCheck.installCommand,
        required: true
      });
    } else {
      plan.steps.push({
        type: 'dependencies-ok',
        description: 'All dependencies are already installed',
        required: false
      });
    }
  }

  // Step 2: Copy component file
  plan.steps.push({
    type: 'copy-component',
    description: `Copy component from ${componentInfo.path} to ${targetPath}`,
    source: componentInfo.path,
    target: targetPath,
    required: true
  });

  // Step 3: Copy/Import assets
  if (copyAssets && componentInfo.assets && componentInfo.assets.length > 0) {
    plan.steps.push({
      type: 'handle-assets',
      description: `Import required assets: ${componentInfo.assets.join(', ')}`,
      assets: componentInfo.assets,
      required: false
    });
  }

  // Step 4: Customize component
  if (customizeComponent) {
    plan.steps.push({
      type: 'customize-component',
      description: 'Remove template-specific code and customize for your needs',
      suggestions: [
        'Remove breadcrumb teleports',
        'Remove template navigation',
        'Update component name and props',
        'Customize styling',
        'Add your business logic'
      ],
      required: false
    });
  }

  return plan;
};

/**
 * Adopt a template component (generates instructions and file content)
 * @param {string} componentName - Name of component to adopt
 * @param {string} targetPath - Target path for the component
 * @param {Object} options - Adoption options
 * @returns {Promise<AdoptionResult>} - Adoption result
 */
export const adoptComponent = async (componentName, targetPath, options = {}) => {
  const {
    dryRun = false,
    customizations = {},
    includeAssets = true
  } = options;

  const result = {
    success: false,
    componentName,
    targetPath,
    installedDependencies: [],
    copiedAssets: [],
    warnings: [],
    errors: [],
    rollbackInfo: null,
    instructions: [],
    fileContent: null
  };

  try {
    // Validate adoption
    const validation = await validateAdoption(componentName, targetPath);
    if (!validation.valid) {
      result.errors = validation.errors;
      result.warnings = validation.warnings;
      return result;
    }

    const { componentInfo } = validation;
    result.warnings = validation.warnings;

    // Generate adoption plan
    const plan = await createAdoptionPlan(componentName, targetPath, {
      copyAssets: includeAssets,
      customizeComponent: true
    });

    // Check dependencies using new dependency mapping
    const depCheck = checkDependencies(componentName);
    if (!depCheck.allInstalled) {
      result.instructions.push('DEPENDENCY INSTALLATION REQUIRED:');
      result.instructions.push(depCheck.installCommand || 'No install command available');
      result.instructions.push('');
    }

    // Load source component content
    let sourceContent;
    try {
      const response = await fetch(`/${componentInfo.path}`);
      if (response.ok) {
        sourceContent = await response.text();
      } else {
        throw new Error('Could not fetch source component');
      }
    } catch (error) {
      // Fallback: provide template for manual copying
      sourceContent = `<!-- Copy this component from: ${componentInfo.path} -->
<template>
  <!-- Component template will be here -->
</template>

<script setup>
// Component script will be here
// Required dependencies: ${componentInfo.dependencies?.join(', ') || 'none'}
</script>

<style lang="scss" scoped>
// Component styles will be here
// Required assets: ${componentInfo.assets?.join(', ') || 'none'}
</style>`;
    }

    // Apply customizations
    let customizedContent = sourceContent;
    if (customizations.removeBreadcrumbs !== false) {
      customizedContent = removeBreadcrumbs(customizedContent);
    }
    if (customizations.removeNavigation !== false) {
      customizedContent = removeTemplateNavigation(customizedContent);
    }
    if (customizations.componentName) {
      customizedContent = updateComponentName(customizedContent, customizations.componentName);
    }

    result.fileContent = customizedContent;

    // Generate instructions
    result.instructions = [
      `TEMPLATE COMPONENT ADOPTION: ${componentName}`,
      '='.repeat(50),
      '',
      '1. DEPENDENCIES:',
      depCheck.allInstalled ? 
        '   ✓ All dependencies are installed' : 
        `   ⚠ Run: ${depCheck.installCommand}`,
      '',
      '2. COMPONENT FILE:',
      `   • Create file: ${targetPath}`,
      `   • Copy content provided below`,
      '',
      '3. ASSETS:',
      componentInfo.assets && componentInfo.assets.length > 0 ?
        componentInfo.assets.map(asset => `   • Import: ${asset}`).join('\n') :
        '   • No additional assets required',
      '',
      '4. CUSTOMIZATION:',
      '   • Remove template-specific breadcrumbs',
      '   • Remove template navigation',
      '   • Update component name and props',
      '   • Customize styling as needed',
      '',
      '5. INTEGRATION:',
      '   • Import component in your parent component',
      '   • Add to components object',
      '   • Use in template with appropriate props',
      '',
      'COMPONENT CONTENT:',
      '-'.repeat(30)
    ];

    if (!dryRun) {
      result.success = true;
      result.rollbackInfo = {
        targetPath,
        originalExists: false, // Would check if file exists
        timestamp: new Date().toISOString()
      };
    }

  } catch (error) {
    result.errors.push(`Adoption failed: ${error.message}`);
  }

  return result;
};

/**
 * Remove breadcrumb teleports from component content
 * @param {string} content - Component content
 * @returns {string} - Modified content
 */
const removeBreadcrumbs = (content) => {
  // Remove teleport to breadcrumb sections
  return content.replace(
    /<teleport to="#breadcrumb">[\s\S]*?<\/teleport>\s*/g,
    ''
  );
};

/**
 * Remove template navigation from component content
 * @param {string} content - Component content
 * @returns {string} - Modified content
 */
const removeTemplateNavigation = (content) => {
  // Remove sidenav sections
  return content.replace(
    /<div class="nav sidenav">[\s\S]*?<\/div>\s*/g,
    ''
  );
};

/**
 * Update component name in content
 * @param {string} content - Component content
 * @param {string} newName - New component name
 * @returns {string} - Modified content
 */
const updateComponentName = (content, newName) => {
  // This is a simplified implementation
  // In a real scenario, you might want more sophisticated name replacement
  return content.replace(
    /useMeta\(\{ title: ['"]([^'"]+)['"] \}\)/g,
    `useMeta({ title: '${newName}' })`
  );
};

/**
 * Create rollback information for an adoption
 * @param {string} targetPath - Target path of adopted component
 * @param {Object} adoptionInfo - Information about the adoption
 * @returns {Object} - Rollback information
 */
export const createRollbackInfo = (targetPath, adoptionInfo) => {
  return {
    targetPath,
    adoptionInfo,
    timestamp: new Date().toISOString(),
    rollbackSteps: [
      `Remove file: ${targetPath}`,
      'Uninstall dependencies if no longer needed',
      'Remove asset imports if no longer needed'
    ]
  };
};

/**
 * Rollback a component adoption (generates rollback instructions)
 * @param {Object} rollbackInfo - Rollback information
 * @returns {Object} - Rollback result
 */
export const rollbackAdoption = (rollbackInfo) => {
  if (!rollbackInfo) {
    return {
      success: false,
      error: 'No rollback information provided'
    };
  }

  const instructions = [
    'ROLLBACK INSTRUCTIONS:',
    '='.repeat(30),
    '',
    '1. Remove adopted component file:',
    `   rm ${rollbackInfo.targetPath}`,
    '',
    '2. Check if dependencies can be removed:',
    '   • Review other components that might use the same dependencies',
    '   • Uninstall unused dependencies manually if needed',
    '',
    '3. Remove asset imports:',
    '   • Check your SCSS files for imported assets',
    '   • Remove imports that are no longer needed',
    '',
    `Rollback for adoption created on: ${rollbackInfo.timestamp}`
  ];

  return {
    success: true,
    instructions: instructions.join('\n'),
    rollbackInfo
  };
};

/**
 * Get adoption recommendations for a component using new dependency mapping
 * @param {string} componentName - Name of component
 * @returns {Object} - Adoption recommendations
 */
export const getAdoptionRecommendations = (componentName) => {
  const componentInfo = templateComponents[componentName];
  if (!componentInfo) {
    return null;
  }

  try {
    // Get dependency information from new mapping
    const dependencyInfo = getComponentDependencies(componentName);
    const validation = validateComponentAdoption(componentName);
    
    const recommendations = {
      componentName,
      category: componentInfo.category,
      complexity: 'medium', // Default
      timeEstimate: '30-60 minutes',
      prerequisites: [],
      bestPractices: [],
      commonIssues: [],
      alternatives: [],
      bundleImpact: dependencyInfo.bundleSize,
      dependencyGroup: dependencyInfo.group,
      ready: validation.ready,
      missingDependencies: validation.missingDependencies
    };

    // Set complexity based on dependencies and bundle size
    const depCount = dependencyInfo.dependencies.length;
    const bundleSizeMatch = dependencyInfo.bundleSize.match(/(\d+)KB/);
    const bundleSize = bundleSizeMatch ? parseInt(bundleSizeMatch[1]) : 0;

    if (depCount === 0 && bundleSize === 0) {
      recommendations.complexity = 'low';
      recommendations.timeEstimate = '15-30 minutes';
    } else if (depCount > 2 || bundleSize > 100) {
      recommendations.complexity = 'high';
      recommendations.timeEstimate = '1-2 hours';
    }

    // Use adoption recommendation from dependency mapping
    try {
      const adoptionCategory = bundleSize === 0 ? 'lightweight' : 
                              bundleSize < 50 ? 'essential' :
                              bundleSize < 150 ? 'specialized' : 'feature-rich';
      const adoptionRec = getAdoptionRecommendation(adoptionCategory);
      recommendations.adoptionCategory = adoptionCategory;
      recommendations.categoryDescription = adoptionRec.description;
    } catch (error) {
      // Fallback if adoption recommendation not found
    }

    // Category-specific recommendations (enhanced with dependency info)
    switch (componentInfo.category) {
      case 'forms':
        recommendations.prerequisites.push('Form validation library (if using validation)');
        recommendations.bestPractices.push('Implement proper form validation');
        recommendations.bestPractices.push('Handle form submission errors');
        recommendations.commonIssues.push('Validation rules not working');
        if (dependencyInfo.dependencies.includes('@vuelidate/core')) {
          recommendations.prerequisites.push('Vuelidate validation setup');
        }
        break;

      case 'tables':
        recommendations.prerequisites.push('Data source API or mock data');
        recommendations.bestPractices.push('Implement proper pagination');
        recommendations.bestPractices.push('Add loading states');
        recommendations.commonIssues.push('Large datasets causing performance issues');
        break;

      case 'charts':
        recommendations.prerequisites.push('Chart data in proper format');
        recommendations.bestPractices.push('Implement responsive chart sizing');
        recommendations.bestPractices.push('Add chart interaction handlers');
        recommendations.commonIssues.push('Chart not rendering on initial load');
        if (dependencyInfo.dependencies.some(dep => dep.includes('apexcharts'))) {
          recommendations.prerequisites.push('ApexCharts configuration');
        }
        break;

      case 'apps':
        recommendations.complexity = 'high';
        recommendations.timeEstimate = '2-4 hours';
        recommendations.prerequisites.push('Backend API integration');
        recommendations.bestPractices.push('Implement proper state management');
        recommendations.commonIssues.push('Complex component with many dependencies');
        break;
    }

    // Find similar components as alternatives
    recommendations.alternatives = Object.keys(templateComponents)
      .filter(name => 
        name !== componentName && 
        templateComponents[name].category === componentInfo.category
      )
      .slice(0, 3);

    return recommendations;
  } catch (error) {
    // Fallback to basic recommendations if dependency mapping fails
    return {
      componentName,
      category: componentInfo.category,
      complexity: 'unknown',
      timeEstimate: 'varies',
      error: error.message,
      alternatives: []
    };
  }
};

/**
 * Generate adoption report
 * @param {AdoptionResult[]} adoptionResults - Array of adoption results
 * @returns {Object} - Adoption report
 */
export const generateAdoptionReport = (adoptionResults) => {
  const report = {
    totalAttempts: adoptionResults.length,
    successful: 0,
    failed: 0,
    warnings: 0,
    components: [],
    summary: '',
    recommendations: []
  };

  adoptionResults.forEach(result => {
    if (result.success) {
      report.successful++;
    } else {
      report.failed++;
    }

    if (result.warnings && result.warnings.length > 0) {
      report.warnings += result.warnings.length;
    }

    report.components.push({
      name: result.componentName,
      success: result.success,
      warnings: result.warnings?.length || 0,
      errors: result.errors?.length || 0
    });
  });

  report.summary = `Adopted ${report.successful}/${report.totalAttempts} components successfully`;

  if (report.failed > 0) {
    report.recommendations.push('Review failed adoptions and resolve dependency issues');
  }

  if (report.warnings > 0) {
    report.recommendations.push('Address warnings to ensure optimal component functionality');
  }

  return report;
};

// Export default object with all functions
export default {
  checkDependencies,
  generateInstallCommand,
  installDependencies,
  validateAdoption,
  createAdoptionPlan,
  adoptComponent,
  createRollbackInfo,
  rollbackAdoption,
  getAdoptionRecommendations,
  generateAdoptionReport
};