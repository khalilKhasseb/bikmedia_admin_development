/**
 * Template Component Loader Utility
 * 
 * This utility provides dynamic loading capabilities for template components,
 * including dependency checking, asset loading, and error handling.
 */

import { templateComponents } from '../templates/available-components.js';

// Import dependency mapping
let dependencyMapping = null;

/**
 * Load dependency mapping from template-dependencies.json
 * @returns {Promise<Object>} - Dependency mapping data
 */
const loadDependencyMapping = async () => {
  if (dependencyMapping) {
    return dependencyMapping;
  }

  try {
    const response = await fetch('/template-dependencies.json');
    if (!response.ok) {
      throw new Error(`Failed to load dependency mapping: ${response.status}`);
    }
    dependencyMapping = await response.json();
    return dependencyMapping;
  } catch (error) {
    console.warn('Could not load template-dependencies.json, falling back to basic dependency checking');
    return null;
  }
};

/**
 * Load a template component dynamically with its dependencies and assets
 * @param {string} componentName - Name of the component to load
 * @param {Object} options - Loading options
 * @returns {Promise<Object>} - Loaded component with metadata
 */
export const loadTemplateComponent = async (componentName, options = {}) => {
  const {
    checkDependencies = true,
    loadAssets = true,
    throwOnMissingDeps = false
  } = options;

  // Get component information
  const componentInfo = templateComponents[componentName];
  if (!componentInfo) {
    throw new Error(`Template component "${componentName}" not found. Available components: ${Object.keys(templateComponents).join(', ')}`);
  }

  console.log(`Loading template component: ${componentName}`);

  // Check dependencies if requested
  if (checkDependencies) {
    const depCheck = await checkComponentDependencies(componentName, componentInfo.dependencies);
    
    if (depCheck.missing.length > 0) {
      const packageNames = depCheck.missing.map(dep => dep.split('@')[0]);
      let message = `Missing dependencies for ${componentName}: ${depCheck.missing.join(', ')}`;
      
      // Add helpful context from dependency mapping
      if (depCheck.componentInfo) {
        message += `\n  Component group: ${depCheck.group}`;
        message += `\n  Estimated size impact: ${depCheck.estimatedSize}`;
        
        if (depCheck.isTemplateOnly) {
          message += `\n  Note: This component uses template-only dependencies that can be installed on-demand.`;
        }
      }
      
      message += `\n  Install with: npm install ${packageNames.join(' ')}`;
      
      if (throwOnMissingDeps) {
        throw new Error(message);
      } else {
        console.warn(message);
      }
    } else if (depCheck.total > 0) {
      console.log(`✓ All ${depCheck.total} dependencies available for ${componentName}`);
    }
  }

  try {
    // Dynamically import the component
    // Remove 'src/' prefix if present since we're already in src/
    const cleanPath = componentInfo.path.startsWith('src/') ? 
      componentInfo.path.substring(4) : componentInfo.path;
    const componentModule = await import(`../${cleanPath}`);
    const component = componentModule.default || componentModule;

    // Load associated assets if requested
    if (loadAssets && componentInfo.assets && componentInfo.assets.length > 0) {
      await loadComponentAssets(componentInfo.assets);
    }

    return {
      component,
      info: componentInfo,
      loaded: true,
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    throw new Error(`Failed to load component ${componentName}: ${error.message}`);
  }
};

/**
 * Load multiple template components at once
 * @param {string[]} componentNames - Array of component names to load
 * @param {Object} options - Loading options
 * @returns {Promise<Object>} - Object with loaded components
 */
export const loadMultipleComponents = async (componentNames, options = {}) => {
  const results = {};
  const errors = [];

  for (const componentName of componentNames) {
    try {
      results[componentName] = await loadTemplateComponent(componentName, options);
    } catch (error) {
      errors.push({ componentName, error: error.message });
      console.error(`Failed to load ${componentName}:`, error.message);
    }
  }

  return {
    components: results,
    errors,
    loadedCount: Object.keys(results).length,
    totalCount: componentNames.length
  };
};

/**
 * Check if required dependencies are available using enhanced dependency mapping
 * @param {string} componentName - Name of the component to check
 * @param {string[]} fallbackDependencies - Fallback dependency list if mapping not available
 * @returns {Promise<Object>} - Dependency check result with detailed information
 */
export const checkComponentDependencies = async (componentName, fallbackDependencies = []) => {
  const mapping = await loadDependencyMapping();
  
  let dependencies = fallbackDependencies;
  let componentInfo = null;
  
  // Use enhanced dependency mapping if available
  if (mapping && mapping.componentDependencies && mapping.componentDependencies[componentName]) {
    componentInfo = mapping.componentDependencies[componentName];
    dependencies = componentInfo.required || [];
  }

  if (!dependencies || dependencies.length === 0) {
    return {
      missing: [],
      available: [],
      total: 0,
      componentInfo,
      isTemplateOnly: false
    };
  }

  const missingDeps = [];
  const availableDeps = [];

  for (const dep of dependencies) {
    // Extract package name without version
    const packageName = dep.split('@')[0];
    
    try {
      // Try to resolve the dependency
      await import(packageName);
      availableDeps.push(dep);
    } catch (error) {
      // If import fails, check if it's in node_modules
      try {
        const response = await fetch(`/node_modules/${packageName}/package.json`).catch(() => null);
        if (!response || !response.ok) {
          missingDeps.push(dep);
        } else {
          availableDeps.push(dep);
        }
      } catch {
        missingDeps.push(dep);
      }
    }
  }

  // Check if this component uses template-only dependencies
  const isTemplateOnly = mapping && mapping.templateOnlyDependencies && 
    dependencies.some(dep => mapping.templateOnlyDependencies.includes(dep.split('@')[0]));

  return {
    missing: missingDeps,
    available: availableDeps,
    total: dependencies.length,
    componentInfo,
    isTemplateOnly,
    group: componentInfo?.group,
    estimatedSize: componentInfo?.estimatedSize
  };
};

/**
 * Load component assets (CSS/SCSS files)
 * @param {string[]} assets - Array of asset paths
 * @returns {Promise<void>}
 */
export const loadComponentAssets = async (assets) => {
  if (!assets || assets.length === 0) {
    return;
  }

  const loadPromises = assets.map(async (assetPath) => {
    try {
      // Remove 'src/' prefix if present since we're already in src/
      const cleanPath = assetPath.startsWith('src/') ? 
        assetPath.substring(4) : assetPath;
        
      // For SCSS files, we need to import them dynamically
      if (cleanPath.endsWith('.scss') || cleanPath.endsWith('.sass')) {
        await import(`../${cleanPath}`);
        console.log(`Loaded SCSS asset: ${assetPath}`);
      } 
      // For CSS files
      else if (cleanPath.endsWith('.css')) {
        await import(`../${cleanPath}`);
        console.log(`Loaded CSS asset: ${assetPath}`);
      }
      // For other assets, we might need different handling
      else {
        console.warn(`Unknown asset type: ${assetPath}`);
      }
    } catch (error) {
      console.error(`Failed to load asset ${assetPath}:`, error.message);
    }
  });

  await Promise.all(loadPromises);
};

/**
 * Get component information without loading it
 * @param {string} componentName - Name of the component
 * @returns {Object|null} - Component information or null if not found
 */
export const getComponentInfo = (componentName) => {
  return templateComponents[componentName] || null;
};

/**
 * Search for components by various criteria
 * @param {Object} criteria - Search criteria
 * @returns {Object} - Matching components
 */
export const searchComponents = (criteria = {}) => {
  const {
    category,
    hasNoDependencies,
    hasDependencies,
    searchTerm,
    features
  } = criteria;

  let results = { ...templateComponents };

  // Filter by category
  if (category) {
    results = Object.fromEntries(
      Object.entries(results).filter(([, info]) => info.category === category)
    );
  }

  // Filter by dependency requirements
  if (hasNoDependencies) {
    results = Object.fromEntries(
      Object.entries(results).filter(([, info]) => !info.dependencies || info.dependencies.length === 0)
    );
  }

  if (hasDependencies) {
    results = Object.fromEntries(
      Object.entries(results).filter(([, info]) => info.dependencies && info.dependencies.length > 0)
    );
  }

  // Filter by search term
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    results = Object.fromEntries(
      Object.entries(results).filter(([name, info]) => 
        name.toLowerCase().includes(term) ||
        info.description.toLowerCase().includes(term) ||
        (info.features && info.features.some(feature => feature.toLowerCase().includes(term)))
      )
    );
  }

  // Filter by features
  if (features && features.length > 0) {
    results = Object.fromEntries(
      Object.entries(results).filter(([, info]) => 
        info.features && features.some(feature => 
          info.features.some(componentFeature => 
            componentFeature.toLowerCase().includes(feature.toLowerCase())
          )
        )
      )
    );
  }

  return results;
};

/**
 * Preload components for better performance
 * @param {string[]} componentNames - Components to preload
 * @param {Object} options - Preload options
 * @returns {Promise<Object>} - Preload results
 */
export const preloadComponents = async (componentNames, options = {}) => {
  const { 
    loadAssets = false, // Don't load assets by default for preloading
    checkDependencies = true 
  } = options;

  console.log(`Preloading ${componentNames.length} components...`);

  const results = await loadMultipleComponents(componentNames, {
    loadAssets,
    checkDependencies,
    throwOnMissingDeps: false
  });

  console.log(`Preloaded ${results.loadedCount}/${results.totalCount} components`);

  return results;
};

/**
 * Create a component loader with caching
 * @returns {Object} - Cached loader instance
 */
export const createCachedLoader = () => {
  const cache = new Map();

  return {
    async load(componentName, options = {}) {
      const cacheKey = `${componentName}-${JSON.stringify(options)}`;
      
      if (cache.has(cacheKey)) {
        console.log(`Loading ${componentName} from cache`);
        return cache.get(cacheKey);
      }

      const result = await loadTemplateComponent(componentName, options);
      cache.set(cacheKey, result);
      
      return result;
    },

    clear() {
      cache.clear();
    },

    has(componentName, options = {}) {
      const cacheKey = `${componentName}-${JSON.stringify(options)}`;
      return cache.has(cacheKey);
    },

    size() {
      return cache.size;
    }
  };
};

/**
 * Validate component before loading
 * @param {string} componentName - Component name to validate
 * @returns {Object} - Validation result
 */
export const validateComponent = async (componentName) => {
  const info = getComponentInfo(componentName);
  
  if (!info) {
    return {
      valid: false,
      errors: [`Component "${componentName}" not found`],
      warnings: []
    };
  }

  const errors = [];
  const warnings = [];

  // Check if component file exists (simplified check)
  try {
    // Remove 'src/' prefix if present since we're already in src/
    const cleanPath = info.path.startsWith('src/') ? 
      info.path.substring(4) : info.path;
    await import(`../${cleanPath}`);
  } catch (error) {
    errors.push(`Component file not found: ${info.path}`);
  }

  // Check dependencies
  const missingDeps = await checkComponentDependencies(info.dependencies);
  if (missingDeps.length > 0) {
    warnings.push(`Missing dependencies: ${missingDeps.join(', ')}`);
  }

  // Check assets
  if (info.assets && info.assets.length > 0) {
    for (const asset of info.assets) {
      try {
        await import(`../${asset}`);
      } catch (error) {
        warnings.push(`Asset not found: ${asset}`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    info
  };
};

/**
 * Get dependency groups and their components
 * @returns {Promise<Object>} - Dependency groups information
 */
export const getDependencyGroups = async () => {
  const mapping = await loadDependencyMapping();
  
  if (!mapping || !mapping.dependencyGroups) {
    return null;
  }

  return mapping.dependencyGroups;
};

/**
 * Check which dependencies are template-only vs core application
 * @returns {Promise<Object>} - Dependency classification
 */
export const classifyDependencies = async () => {
  const mapping = await loadDependencyMapping();
  
  if (!mapping) {
    return {
      templateOnly: [],
      coreApplication: [],
      unknown: []
    };
  }

  return {
    templateOnly: mapping.templateOnlyDependencies || [],
    coreApplication: mapping.coreApplicationDependencies || [],
    groups: mapping.dependencyGroups || {}
  };
};

/**
 * Get installation command for a component's dependencies
 * @param {string} componentName - Name of the component
 * @returns {Promise<Object>} - Installation information
 */
export const getInstallationCommand = async (componentName) => {
  const depCheck = await checkComponentDependencies(componentName);
  
  if (depCheck.missing.length === 0) {
    return {
      needed: false,
      command: null,
      dependencies: [],
      message: 'All dependencies are already installed'
    };
  }

  const packageNames = depCheck.missing.map(dep => dep.split('@')[0]);
  
  return {
    needed: true,
    command: `npm install ${packageNames.join(' ')}`,
    dependencies: depCheck.missing,
    packageNames,
    group: depCheck.group,
    estimatedSize: depCheck.estimatedSize,
    isTemplateOnly: depCheck.isTemplateOnly,
    message: `Install ${packageNames.length} missing dependencies for ${componentName}`
  };
};

/**
 * Validate all template components and their dependencies
 * @returns {Promise<Object>} - Validation report
 */
export const validateAllComponents = async () => {
  const components = Object.keys(templateComponents);
  const results = {
    total: components.length,
    valid: 0,
    invalid: 0,
    missingDependencies: 0,
    components: {}
  };

  for (const componentName of components) {
    const validation = await validateComponent(componentName);
    results.components[componentName] = validation;
    
    if (validation.valid) {
      results.valid++;
    } else {
      results.invalid++;
    }
    
    if (validation.warnings.some(w => w.includes('Missing dependencies'))) {
      results.missingDependencies++;
    }
  }

  return results;
};

/**
 * Get loading statistics with enhanced dependency information
 * @returns {Promise<Object>} - Enhanced loading statistics
 */
export const getLoadingStats = async () => {
  const totalComponents = Object.keys(templateComponents).length;
  const categoryCounts = {};
  const dependencyCounts = {};
  const mapping = await loadDependencyMapping();

  Object.values(templateComponents).forEach(info => {
    // Count by category
    categoryCounts[info.category] = (categoryCounts[info.category] || 0) + 1;

    // Count by dependencies
    const depCount = info.dependencies ? info.dependencies.length : 0;
    const depKey = depCount === 0 ? 'no-deps' : `${depCount}-deps`;
    dependencyCounts[depKey] = (dependencyCounts[depKey] || 0) + 1;
  });

  const stats = {
    totalComponents,
    categoryCounts,
    dependencyCounts,
    categories: Object.keys(categoryCounts).sort(),
    componentsWithNoDeps: dependencyCounts['no-deps'] || 0,
    componentsWithDeps: totalComponents - (dependencyCounts['no-deps'] || 0)
  };

  // Add enhanced information if mapping is available
  if (mapping) {
    stats.dependencyGroups = Object.keys(mapping.dependencyGroups || {});
    stats.templateOnlyDependencies = (mapping.templateOnlyDependencies || []).length;
    stats.coreApplicationDependencies = (mapping.coreApplicationDependencies || []).length;
    stats.mappingVersion = mapping.version;
  }

  return stats;
};

// Export default object with all functions
export default {
  loadTemplateComponent,
  loadMultipleComponents,
  checkComponentDependencies,
  loadComponentAssets,
  getComponentInfo,
  searchComponents,
  preloadComponents,
  createCachedLoader,
  validateComponent,
  getLoadingStats,
  getDependencyGroups,
  classifyDependencies,
  getInstallationCommand,
  validateAllComponents
};