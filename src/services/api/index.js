/**
 * API Services Central Export
 * 
 * This file serves as the single entry point for all API-related functionality.
 * It exports the BaseService class, transformation utilities, and all resource services.
 * 
 * @example
 * // Import everything
 * import apiServices, { BaseService, transformers } from '@/services/api';
 * 
 * // Import specific services
 * import { BaseService } from '@/services/api';
 * 
 * // Use in Vuex actions
 * async fetchUsers({ commit }) {
 *   const response = await apiServices.user.getAll();
 *   commit('SET_USERS', response.items);
 * }
 */

import BaseService from './base.service.js';
import * as transformers from './utils/transformers.js';
import {
  transformPaginatedResponse,
  transformErrorResponse,
  buildQueryParams,
  transformListResponse,
  transformSingleResponse
} from './utils/transformers.js';

// Resource Services
// Import resource services here as they are created:
// import userService from './user.service.js'; // Disabled - API not ready
import giftService from './gift.service.js';
import equipmentService from './equipment.service.js';
import levelService from './level.service.js';
// import categoryService from './category.service.js';
// import roomService from './room.service.js';
// import storeService from './store.service.js';

/**
 * Default export containing all resource service instances
 * 
 * As new resource services are created, add them to this object:
 * export default {
 *   user: userService,
 *   gift: giftService,
 *   equipment: equipmentService,
 *   level: levelService
 * };
 */
export default {
  // user: userService, // Disabled - API not ready
  gift: giftService,
  equipment: equipmentService,
  level: levelService
};

/**
 * Named exports for BaseService class and transformation utilities
 * 
 * You can import transformers in two ways:
 * 1. As a namespace: import { transformers } from '@/services/api';
 *    Usage: transformers.transformPaginatedResponse(response)
 * 
 * 2. As individual functions: import { transformPaginatedResponse } from '@/services/api';
 *    Usage: transformPaginatedResponse(response)
 */
export {
  BaseService,
  transformers,
  transformPaginatedResponse,
  transformErrorResponse,
  buildQueryParams,
  transformListResponse,
  transformSingleResponse
};
