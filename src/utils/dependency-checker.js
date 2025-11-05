/**
 * Template Component Dependency Checker
 * 
 * Utility functions for checking and managing template component dependencies
 * based on the template-dependencies.json mapping file.
 */

import templateDependencies from '../../template-dependencies.json';

/**
 * Check if a dependency is currently installed
 * @param {string} dependency - The dependency name (e.g., 'vue3-carousel')
 * @returns {boolean} - Whether the dependency is installed
 */
export const isDependencyInstalled = (dependency) => {
  try {
    // Try to resolve the dependency
    require.resolve(dependency);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Get dependencies required for a specific component
 * @param {string} componentName - The component name (e.g., 'Calendar')
 * @returns {Object} - Component dependency information
 */
export const getComponentDependencies = (componentName) => {
  const componentInfo = templateDependencies.componentDependencyMapping[componentName];
  
  if (!componentInfo) {
    throw new Error(`Component "${componentName}" not found in dependency mapping`);
  }
  
  return {
    component: componentName,
    dependencies: componentInfo.dependencies,
    group: componentInfo.group,
    bundleSize: componentInfo.bundleSize,
    required: componentInfo.required,
    description: componentInfo.description
  };
};

/**
 * Get all components in a specific dependency group
 * @param {string} groupName - The group name (e.g., 'charts', 'forms')
 * @returns {Array} - Array of component names in the group
 */
export const getComponentsByGroup = (groupName) => {
  const components = [];
  
  for (const [componentName, componentInfo] of Object.entries(templateDependencies.componentDependencyMapping)) {
    if (componentInfo.group === groupName) {
      components.push(componentName);
    }
  }
  
  return components;
};

/**
 * Get all components that use a specific dependency
 * @param {string} dependency - The dependency name
 * @returns {Array} - Array of component names that use this dependency
 */
export const getComponentsUsingDependency = (dependency) => {
  const components = [];
  
  for (const [componentName, componentInfo] of Object.entries(templateDependencies.componentDependencyMapping)) {
    if (componentInfo.dependencies.some(dep => dep.startsWith(dependency))) {
      components.push(componentName);
    }
  }
  
  return components;
};

/**
 * Check which dependencies are missing for a component
 * @param {string} componentName - The component name
 * @returns {Array} - Array of missing dependencies
 */
export const getMissingDependencies = (componentName) => {
  const componentInfo = getComponentDependencies(componentName);
  const missingDeps = [];
  
  for (const dependency of componentInfo.dependencies) {
    // Extract package name without version
    const packageName = dependency.split('@')[0];
    
    if (!isDependencyInstalled(packageName)) {
      missingDeps.push(dependency);
    }
  }
  
  return missingDeps;
};

/**
 * Get installation command for missing dependencies
 * @param {string} componentName - The component name
 * @returns {string} - npm install command for missing dependencies
 */
export const getInstallCommand = (componentName) => {
  const missingDeps = getMissingDependencies(componentName);
  
  if (missingDeps.length === 0) {
    return null;
  }
  
  return `npm install ${missingDeps.join(' ')}`;
};

/**
 * Get dependency group information
 * @param {string} groupName - The group name
 * @returns {Object} - Group information including description and dependencies
 */
export const getDependencyGroup = (groupName) => {
  const groupInfo = templateDependencies.dependencyGroups[groupName];
  
  if (!groupInfo) {
    throw new Error(`Dependency group "${groupName}" not found`);
  }
  
  return groupInfo;
};

/**
 * Get detailed information about a specific dependency
 * @param {string} dependency - The dependency name
 * @returns {Object} - Detailed dependency information
 */
export const getDependencyDetails = (dependency) => {
  const dependencyInfo = templateDependencies.dependencyDetails[dependency];
  
  if (!dependencyInfo) {
    throw new Error(`Dependency "${dependency}" not found in details`);
  }
  
  return dependencyInfo;
};

/**
 * Get components by adoption recommendation category
 * @param {string} category - The recommendation category ('lightweight', 'essential', 'feature-rich', 'specialized')
 * @returns {Object} - Recommendation information including components and bundle impact
 */
export const getAdoptionRecommendation = (category) => {
  const recommendation = templateDependencies.adoptionRecommendations[category];
  
  if (!recommendation) {
    throw new Error(`Adoption recommendation category "${category}" not found`);
  }
  
  return recommendation;
};

/**
 * Calculate total bundle size impact for multiple components
 * @param {Array} componentNames - Array of component names
 * @returns {string} - Estimated total bundle size impact
 */
export const calculateBundleImpact = (componentNames) => {
  let totalSize = 0;
  const uniqueDependencies = new Set();
  
  for (const componentName of componentNames) {
    try {
      const componentInfo = getComponentDependencies(componentName);
      
      // Add dependencies to set to avoid counting duplicates
      componentInfo.dependencies.forEach(dep => {
        const packageName = dep.split('@')[0];
        uniqueDependencies.add(packageName);
      });
    } catch (error) {
      console.warn(`Component ${componentName} not found in dependency mapping`);
    }
  }
  
  // Calculate size based on unique dependencies
  for (const dependency of uniqueDependencies) {
    try {
      const depDetails = getDependencyDetails(dependency);
      const sizeMatch = depDetails.bundleSize.match(/~?(\d+)KB/);
      if (sizeMatch) {
        totalSize += parseInt(sizeMatch[1]);
      }
    } catch (error) {
      // Dependency details not found, skip
    }
  }
  
  return `~${totalSize}KB`;
};

/**
 * Get all available dependency groups
 * @returns {Array} - Array of group names
 */
export const getAllDependencyGroups = () => {
  return Object.keys(templateDependencies.dependencyGroups);
};

/**
 * Get all available components
 * @returns {Array} - Array of component names
 */
export const getAllComponents = () => {
  return Object.keys(templateDependencies.componentDependencyMapping);
};

/**
 * Validate component adoption readiness
 * @param {string} componentName - The component name
 * @returns {Object} - Validation result with status and details
 */
export const validateComponentAdoption = (componentName) => {
  try {
    const componentInfo = getComponentDependencies(componentName);
    const missingDeps = getMissingDependencies(componentName);
    
    return {
      ready: missingDeps.length === 0,
      component: componentName,
      missingDependencies: missingDeps,
      installCommand: missingDeps.length > 0 ? getInstallCommand(componentName) : null,
      bundleImpact: componentInfo.bundleSize,
      group: componentInfo.group,
      required: componentInfo.required
    };
  } catch (error) {
    return {
      ready: false,
      error: error.message
    };
  }
};

/**
 * Get migration information for currently used vs safe to remove dependencies
 * @returns {Object} - Migration guide information
 */
export const getMigrationGuide = () => {
  return templateDependencies.migrationGuide;
};

export default {
  isDependencyInstalled,
  getComponentDependencies,
  getComponentsByGroup,
  getComponentsUsingDependency,
  getMissingDependencies,
  getInstallCommand,
  getDependencyGroup,
  getDependencyDetails,
  getAdoptionRecommendation,
  calculateBundleImpact,
  getAllDependencyGroups,
  getAllComponents,
  validateComponentAdoption,
  getMigrationGuide
};