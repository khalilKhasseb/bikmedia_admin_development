/**
 * Entity Configuration Registry
 * 
 * Centralized import point for all entity configurations.
 * 
 * @module config/entities
 * 
 * @example
 * // Import specific configs
 * import { equipmentConfig, giftConfig, levelConfig } from '@/config/entities';
 * 
 * @example
 * // Import all configs as registry
 * import entityConfigs from '@/config/entities';
 * const config = entityConfigs.equipment;
 * 
 * @example
 * // Use helper function
 * import { getEntityConfig } from '@/config/entities';
 * const config = getEntityConfig('equipment');
 */

import equipmentConfig from './equipment.config.js';
import giftConfig from './gift.config.js';
import levelConfig from './level.config.js';
import vipOptionConfig from './vip-option.config.js';

/**
 * Entity configuration registry
 * Maps entity names to their configurations
 * 
 * @type {Object.<string, import('./types.js').EntityConfig>}
 */
const entityConfigRegistry = {
  equipment: equipmentConfig,
  gift: giftConfig,
  level: levelConfig,
  vipOption: vipOptionConfig
};

/**
 * Get entity configuration by entity name
 * 
 * @param {string} entityName - Name of the entity (e.g., 'equipment', 'gift', 'level')
 * @returns {import('./types.js').EntityConfig} Entity configuration object
 * @throws {Error} If entity configuration is not found
 * 
 * @example
 * const config = getEntityConfig('equipment');
 * console.log(config.displayName); // 'Equipment'
 */
export function getEntityConfig(entityName) {
  const normalizedName = entityName.toLowerCase();
  const config = entityConfigRegistry[normalizedName];
  
  if (!config) {
    const availableEntities = Object.keys(entityConfigRegistry).join(', ');
    throw new Error(
      `Entity configuration not found for: "${entityName}". ` +
      `Available entities: ${availableEntities}`
    );
  }
  
  return config;
}

/**
 * Get all entity names
 * 
 * @returns {string[]} Array of entity names
 */
export function getEntityNames() {
  return Object.keys(entityConfigRegistry);
}

/**
 * Check if entity exists
 * 
 * @param {string} entityName - Name of the entity
 * @returns {boolean} True if entity exists
 */
export function hasEntity(entityName) {
  return entityName.toLowerCase() in entityConfigRegistry;
}

// Named exports for individual configs
export { equipmentConfig, giftConfig, levelConfig, vipOptionConfig };

// Default export for registry
export default entityConfigRegistry;
