/**
 * API Response and Request Transformation Utilities
 * 
 * Provides consistent interfaces for handling various API response formats
 * and preparing request data across all resource services.
 */

/**
 * Transforms a paginated API response into a normalized structure
 * 
 * Extracts pagination metadata and data items from the response.
 * Handles common pagination properties like total, page, limit, pages.
 * 
 * @param {Object} response - Axios response object
 * @returns {Object} Normalized paginated response
 * @returns {Array} returns.items - Array of data items
 * @returns {Object} returns.pagination - Pagination metadata
 * @returns {number} returns.pagination.total - Total number of items
 * @returns {number} returns.pagination.page - Current page number
 * @returns {number} returns.pagination.limit - Items per page
 * @returns {number} returns.pagination.pages - Total number of pages
 * @returns {*} returns.raw - Raw response data
 * 
 * @example
 * const response = await giftService.post('/list', { p: 1, limit: 10 });
 * const { items, pagination } = transformPaginatedResponse(response);
 * console.log(`Showing ${items.length} of ${pagination.total} items`);
 */
export function transformPaginatedResponse(response) {
  const data = response.data || {};

  // Handle the specific API structure: response.data.data.list and response.data.data.pagination
  let items = [];
  let paginationData = {};

  if (data.data && data.data.list) {
    // Items are in data.data.list
    items = data.data.list || [];
    // Pagination metadata is in data.data.pagination
    paginationData = data.data.pagination || {};
  } else if (data.items && data.items.list) {
    // Alternative structure: data.items.list
    items = data.items.list || [];
    paginationData = data.pagination || {};
  } else if (Array.isArray(data.data)) {
    // Direct array in data.data
    items = data.data;
    paginationData = data;
  } else if (Array.isArray(data.items)) {
    // Direct array in data.items
    items = data.items;
    paginationData = data;
  } else if (Array.isArray(data)) {
    // Direct array response
    items = data;
    paginationData = {};
  }

  return {
    items: items,
    pagination: {
      total: paginationData.total || data.total || 0,
      page: paginationData.current_page || data.current_page || data.page || data.p || 1,
      limit: paginationData.per_page || data.per_page || data.limit || 10,
      pages: paginationData.last_page || data.last_page || data.pages || data.total_pages || 1
    },
    raw: response.data
  };
}

export function transformDeleteResponse(response) {
  const data = response.data || {};

  return {
    status: data
  }

}

/**
 * Transforms an API error into a normalized error structure
 * 
 * Extracts error information from axios error objects and provides
 * a consistent error format across all services.
 * 
 * @param {Error} error - Axios error object
 * @returns {Object} Normalized error object
 * @returns {string} returns.message - Human-readable error message
 * @returns {number} returns.status - HTTP status code
 * @returns {string} returns.code - Error code if available
 * @returns {*} returns.raw - Raw error response data
 * 
 * @example
 * try {
 *   await userService.post('/create', userData);
 * } catch (error) {
 *   const normalizedError = transformErrorResponse(error);
 *   console.error(normalizedError.message);
 * }
 */
export function transformErrorResponse(error) {
  const response = error.response || {};
  const data = response.data || {};

  return {
    message: data.message || data.error || error.message || 'An unexpected error occurred',
    status: response.status || 500,
    code: data.code || data.error_code || 'UNKNOWN_ERROR',
    raw: response.data
  };
}

/**
 * Builds clean query parameters by removing null/undefined values
 * 
 * Useful for GET requests where optional parameters should not be
 * sent if not provided.
 * 
 * @param {Object} params - Object containing query parameters
 * @returns {Object} Cleaned parameters object
 * 
 * @example
 * const params = buildQueryParams({
 *   search: 'gift',
 *   status: null,
 *   page: 1,
 *   limit: undefined
 * });
 * // Returns: { search: 'gift', page: 1 }
 */
export function buildQueryParams(params) {
  const cleanParams = {};

  for (const [key, value] of Object.entries(params)) {
    if (value !== null && value !== undefined) {
      cleanParams[key] = value;
    }
  }

  return cleanParams;
}

/**
 * Transforms a simple list API response into a normalized structure
 * 
 * For endpoints that return arrays without pagination metadata.
 * 
 * @param {Object} response - Axios response object
 * @returns {Object} Normalized list response
 * @returns {Array} returns.items - Array of data items
 * @returns {*} returns.raw - Raw response data
 * 
 * @example
 * const response = await categoryService.get('/all');
 * const { items } = transformListResponse(response);
 */
export function transformListResponse(response) {
  const data = response.data || {};

  return {
    items: Array.isArray(data) ? data : (data.data || data.items || []),
    raw: response.data
  };
}

/**
 * Transforms a single resource API response into a normalized structure
 * 
 * For endpoints that return a single object/resource.
 * 
 * @param {Object} response - Axios response object
 * @returns {Object} Normalized single resource response
 * @returns {*} returns.item - The resource data
 * @returns {*} returns.raw - Raw response data
 * 
 * @example
 * const response = await userService.get('/123');
 * const { item } = transformSingleResponse(response);
 * console.log(item.name);
 */
export function transformSingleResponse(response) {
  const data = response.data || {};

  return {
    item: data.data || data.item || data,
    raw: response.data
  };
}
