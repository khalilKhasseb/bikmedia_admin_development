/**
 * VIP Data Transformation Utilities
 * 
 * Provides specialized transformation functions for converting between
 * Noble API format and frontend VIP format. Handles privilege state
 * conversion and data structure mapping.
 * 
 * @module services/api/utils/vip-transformers
 */

/**
 * Transform Noble API response to VIP format
 * 
 * Converts the Noble API response structure to the frontend VIP format.
 * Maps privileges_list to privileges with isActive states and preserves all necessary properties.
 * 
 * @param {Object} nobleData - Noble API response data
 * @param {Array} nobleData.noble - Array of noble packages
 * @param {Array} nobleData.privileges - Array of all available privileges
 * @returns {Array} Array of VIP packages in frontend format
 * 
 * @example
 * const nobleResponse = {
 *   noble: [
 *     {
 *       id: 1,
 *       name: "vip1",
 *       coin: 1000,
 *       privileges_list: [
 *         { id: 2, name: "vipBudg", state: 1, optional: 0 }
 *       ]
 *     }
 *   ],
 *   privileges: [
 *     { id: 2, name: "vipBudg", state: 1, optional: 0 }
 *   ]
 * };
 * 
 * const vipPackages = transformNobleToVip(nobleResponse);
 * console.log(vipPackages[0].privileges[0].isActive); // true
 */
export function transformNobleToVip(nobleData) {
  if (!nobleData || !nobleData.noble) {
    return [];
  }

  return nobleData.noble.map(noble => ({
    id: noble.id,
    name: noble.name,
    coin: noble.coin,
    renew_coin: noble.renew_coin || noble.coin, // Fallback to coin if renew_coin not provided
    days: noble.days || 30, // Default to 30 days if not provided
    icon: noble.icon || null, // Generate default icon path
    editUrl: `/vip/edit/${noble.id}`,
    privileges: transformPrivilegesList(noble.privileges_list || [], nobleData.privileges || [])
  }));
}

/**
 * Transform privileges list from Noble format to VIP format
 * 
 * Shows ALL available privileges for each VIP package, marking as active only those
 * that appear in the VIP package's privileges_list. This allows the UI to display
 * all privileges with proper active/inactive states.
 * 
 * @param {Array} privilegesList - Array of active privileges for a specific noble package
 * @param {Array} allPrivileges - Array of all available privileges with details
 * @returns {Array} Array of ALL privileges in frontend format with correct active states
 * 
 * @example
 * const privilegesList = [
 *   { id: 2, name: "vipBudg", state: 1, optional: 0 }
 * ];
 * 
 * const allPrivileges = [
 *   { id: 2, name: "vipBudg", state: 1, optional: 0 },
 *   { id: 3, name: "enterEffect", state: 1, optional: 0 }
 * ];
 * 
 * const transformed = transformPrivilegesList(privilegesList, allPrivileges);
 * console.log(transformed[0].isActive); // true (in privileges_list)
 * console.log(transformed[1].isActive); // false (not in privileges_list)
 */
export function transformPrivilegesList(privilegesList, allPrivileges) {
  // Create a map of active privileges for quick lookup
  const activePrivilegesMap = new Map();
  privilegesList.forEach(privilege => {
    activePrivilegesMap.set(privilege.id, privilege);
  });

  // Return ALL privileges, marking as active only those in the privileges_list
  return allPrivileges.map(privilege => {
    const activePrivilege = activePrivilegesMap.get(privilege.id);
    const isActive = activePrivilege !== undefined;

    return {
      id: privilege.id,
      name: privilege.name || `privilege_${privilege.id}`,
      description: `Privilege ${privilege.name || privilege.id}`,
      icon: `/assets/images/icons/${privilege.name || 'default'}.png`,
      svga: `/assets/images/animations/${privilege.name || 'default'}.svga`,
      isActive: isActive,
      optional: convertPrivilegeState(privilege.optional),
      vipId: null // Not available in Noble API structure
    };
  });
}

/**
 * Convert privilege state from Noble API format (0/1) to boolean
 * 
 * Handles the conversion of numeric state values (0/1) used by the Noble API
 * to boolean values expected by the frontend.
 * 
 * @param {number|string|boolean} state - State value from Noble API (0, 1, "0", "1", or boolean)
 * @returns {boolean} Boolean representation of the state
 * 
 * @example
 * console.log(convertPrivilegeState(1)); // true
 * console.log(convertPrivilegeState(0)); // false
 * console.log(convertPrivilegeState("1")); // true
 * console.log(convertPrivilegeState("0")); // false
 * console.log(convertPrivilegeState(true)); // true
 * console.log(convertPrivilegeState(false)); // false
 * console.log(convertPrivilegeState(null)); // false
 * console.log(convertPrivilegeState(undefined)); // false
 */
export function convertPrivilegeState(state) {
  // Handle null/undefined
  if (state === null || state === undefined) {
    return false;
  }

  // Handle boolean values
  if (typeof state === 'boolean') {
    return state;
  }

  // Handle numeric values
  if (typeof state === 'number') {
    return state === 1;
  }

  // Handle string values
  if (typeof state === 'string') {
    return state === '1' || state.toLowerCase() === 'true';
  }

  // Default to false for any other type
  return false;
}

/**
 * Convert boolean state to Noble API format (0/1)
 * 
 * Handles the conversion of boolean values used by the frontend
 * to numeric state values (0/1) expected by the Noble API.
 * 
 * @param {boolean|number|string} isActive - Boolean state from frontend
 * @returns {string} String representation of numeric state ("0" or "1")
 * 
 * @example
 * console.log(convertBooleanToNobleState(true)); // "1"
 * console.log(convertBooleanToNobleState(false)); // "0"
 * console.log(convertBooleanToNobleState(1)); // "1"
 * console.log(convertBooleanToNobleState(0)); // "0"
 * console.log(convertBooleanToNobleState("true")); // "1"
 * console.log(convertBooleanToNobleState("false")); // "0"
 */
export function convertBooleanToNobleState(isActive) {
  // Handle boolean values
  if (typeof isActive === 'boolean') {
    return isActive ? "1" : "0";
  }

  // Handle numeric values
  if (typeof isActive === 'number') {
    return isActive === 1 ? "1" : "0";
  }

  // Handle string values
  if (typeof isActive === 'string') {
    return (isActive === '1' || isActive.toLowerCase() === 'true') ? "1" : "0";
  }

  // Default to "0" for any other type
  return "0";
}



/**
 * Validate Noble API response structure
 * 
 * Ensures the API response has the expected structure for Noble endpoints.
 * Throws descriptive errors for missing or invalid data.
 * 
 * @param {Object} response - API response to validate
 * @throws {Error} If response structure is invalid
 * 
 * @example
 * try {
 *   validateNobleApiResponse(response);
 *   console.log('Response is valid');
 * } catch (error) {
 *   console.error('Invalid response:', error.message);
 * }
 */
export function validateNobleApiResponse(response) {
  if (!response || !response.data) {
    throw new Error('Invalid API response: Missing response data.');
  }

  const { data } = response;

  if (typeof data.code !== 'number') {
    throw new Error('Invalid API response: Missing or invalid response code.');
  }

  if (data.code !== 200) {
    const errorMessage = data.err || 'Unknown API error';
    throw new Error(`API Error (${data.code}): ${errorMessage}`);
  }

  if (!data.data || typeof data.data !== 'object') {
    throw new Error('Invalid API response: Missing or invalid data payload.');
  }

  if (!Array.isArray(data.data.noble)) {
    throw new Error('Invalid API response: Noble packages data is not an array.');
  }
}

/**
 * Validate privilege update parameters
 * 
 * Ensures all required parameters are present and valid before making API calls.
 * Provides detailed validation messages for better error handling.
 * 
 * @param {Object} params - Parameters to validate
 * @param {number} params.vipId - VIP package ID
 * @param {number} params.privilegeId - Privilege ID
 * @param {boolean} params.isActive - New privilege state
 * @throws {Error} If validation fails
 * 
 * @example
 * try {
 *   validateUpdatePrivilegeParams({ vipId: 1, privilegeId: 2, isActive: true });
 *   console.log('Parameters are valid');
 * } catch (error) {
 *   console.error('Invalid parameters:', error.message);
 * }
 */
export function validateUpdatePrivilegeParams(params) {
  if (!params || typeof params !== 'object') {
    const error = new Error('updatePrivilege requires valid parameters object.');
    error.code = 'INVALID_PARAMS';
    throw error;
  }

  // Validate vipId
  if (params.vipId === null || params.vipId === undefined || params.vipId === '') {
    const error = new Error('updatePrivilege requires a valid vipId.');
    error.code = 'MISSING_VIP_ID';
    throw error;
  }

  if (!Number.isInteger(Number(params.vipId)) || Number(params.vipId) <= 0) {
    const error = new Error('updatePrivilege requires vipId to be a positive integer.');
    error.code = 'INVALID_VIP_ID';
    throw error;
  }

  // Validate privilegeId
  if (params.privilegeId === null || params.privilegeId === undefined || params.privilegeId === '') {
    const error = new Error('updatePrivilege requires a valid privilegeId.');
    error.code = 'MISSING_PRIVILEGE_ID';
    throw error;
  }

  if (!Number.isInteger(Number(params.privilegeId)) || Number(params.privilegeId) <= 0) {
    const error = new Error('updatePrivilege requires privilegeId to be a positive integer.');
    error.code = 'INVALID_PRIVILEGE_ID';
    throw error;
  }

  // Validate isActive
  if (typeof params.isActive !== 'boolean') {
    const error = new Error('updatePrivilege requires isActive to be a boolean.');
    error.code = 'INVALID_IS_ACTIVE';
    throw error;
  }
}

/**
 * Prepare Noble API request data for privilege updates
 * 
 * Converts frontend privilege update parameters to the format expected by the Noble API.
 * Handles parameter transformation and validation.
 * 
 * @param {Object} params - Frontend privilege update parameters
 * @param {number} params.vipId - VIP package ID
 * @param {number} params.privilegeId - Privilege ID
 * @param {boolean} params.isActive - New privilege state
 * @returns {Object} Request data formatted for Noble API
 * @returns {string} returns.id - Noble package ID as string
 * @returns {string} returns.state - State as string ("0" or "1")
 * @returns {string} returns.privilegeID - Privilege ID as string
 * 
 * @example
 * const params = { vipId: 1, privilegeId: 2, isActive: true };
 * const requestData = prepareNobleUpdateRequest(params);
 * console.log(requestData); // { id: "1", state: "1", privilegeID: "2" }
 */
export function prepareNobleUpdateRequest(params) {
  // Validate parameters first
  validateUpdatePrivilegeParams(params);

  // Prepare request data for Noble API according to API documentation
  // POST {{bikmediaURL}}/dashboard/updatePrivileges
  // Body (urlencoded): id (noble id), state (0=delete, 1=add), privilegeID
  return {
    id: String(params.vipId),
    state: convertBooleanToNobleState(params.isActive),
    privilegeID: String(params.privilegeId)
  };
}

/**
 * Validate Noble API privilege update response
 * 
 * Ensures the updatePrivilege API response has the expected structure.
 * Checks for success indicators and error conditions.
 * 
 * @param {Object} response - API response to validate
 * @throws {Error} If response structure is invalid or indicates failure
 * 
 * @example
 * try {
 *   validateUpdatePrivilegeResponse(response);
 *   console.log('Update was successful');
 * } catch (error) {
 *   console.error('Update failed:', error.message);
 * }
 */
export function validateUpdatePrivilegeResponse(response) {
  if (!response || !response.data) {
    throw new Error('Invalid API response: Missing response data.');
  }

  const { data } = response;

  if (typeof data.code !== 'number') {
    throw new Error('Invalid API response: Missing or invalid response code.');
  }

  if (data.code !== 200) {
    const errorMessage = data.err || 'Unknown API error';
    throw new Error(`API Error (${data.code}): ${errorMessage}`);
  }

  if (!data.data || typeof data.data !== 'object') {
    throw new Error('Invalid API response: Missing or invalid data payload.');
  }

  // Check for success indicator . 
  // this check is not needed the APi has no Success parameter to check
  // if (data.data.success !== 1) {
  //   throw new Error('API Error: Privilege update was not successful.');
  // }
}