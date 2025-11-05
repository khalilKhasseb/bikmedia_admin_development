# API Service Layer

A modular, reusable abstraction layer for making API requests. This architecture builds on top of the configured axios instance in `src/services/http.js` to provide a clean, consistent interface for working with API resources.

## Overview

The API service layer separates HTTP mechanics from business logic, making it easier to:
- Create new resource services quickly
- Maintain consistent patterns across the codebase
- Handle errors uniformly
- Transform API responses into predictable formats
- Test business logic independently of HTTP concerns

## Architecture

The API service layer follows a three-tier architecture:

### 1. HTTP Client Layer (`src/services/http.js`)

The foundation layer that handles low-level HTTP concerns:
- **Request Interceptors**: Automatically inject API-KEY and Auth-Token headers
- **Body Transformation**: Convert request bodies to URL-encoded format
- **Response Interceptors**: Log responses and handle errors
- **Error Handling**: Global handling for 401 (unauthorized), 403 (forbidden), and 500 (server error)
- **Base URL**: Configured with `/api` base URL
- **Proxy Rewrite**: Development server proxies `/api/*` to `/dashboard/*` (configured in `vite.config.js`)

### 2. Base Service Layer (`base.service.js`)

The abstraction layer that provides reusable CRUD methods:
- **BaseService Class**: Foundation for all resource services
- **HTTP Methods**: get, post, put, delete, patch, postFormData
- **URL Construction**: Automatic concatenation of resource paths and endpoints
- **Promise-based**: Returns axios promises for flexible error handling

### 3. Resource Service Layer

The business logic layer for specific API resources:
- **Resource-Specific Methods**: Implement operations like getAll, getById, create, update, delete
- **Data Transformation**: Use transformer utilities for consistent response handling
- **Validation**: Add input validation before making requests
- **Business Rules**: Encapsulate domain-specific logic

## BaseService Class

The `BaseService` class is the foundation for all resource services.

### Constructor

```javascript
const service = new BaseService(resourcePath);
```

**Parameters:**
- `resourcePath` (string): Base endpoint path for the resource (e.g., '/dashboard/gifts')

### Methods

#### `get(endpoint = '', params = {})`

Performs a GET request.

**Parameters:**
- `endpoint` (string): Additional path to append to resourcePath
- `params` (object): Query parameters

**Returns:** Promise with axios response

**Example:**
```javascript
const response = await service.get('/list', { page: 1, limit: 10 });
```

#### `post(endpoint = '', data = {}, config = {})`

Performs a POST request. The http client automatically transforms the body to URL-encoded format.

**Parameters:**
- `endpoint` (string): Additional path to append to resourcePath
- `data` (object): Request body data
- `config` (object): Optional axios config

**Returns:** Promise with axios response

**Example:**
```javascript
const response = await service.post('/create', { name: 'Gift', price: 100 });
```

#### `put(endpoint = '', data = {}, config = {})`

Performs a PUT request with the same pattern as POST.

#### `delete(endpoint = '', data = {})`

Performs a DELETE request. Some APIs require body data for DELETE operations.

#### `patch(endpoint = '', data = {}, config = {})`

Performs a PATCH request with the same pattern as POST.

#### `postFormData(endpoint = '', formData)`

Performs a POST request with FormData for file uploads and multipart/form-data.

**Parameters:**
- `endpoint` (string): Additional path to append to resourcePath
- `formData` (FormData): FormData object containing the request data

**Returns:** Promise with axios response

**Example:**
```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);
formData.append('name', 'Document');
const response = await service.postFormData('/upload', formData);
```

## Creating a Resource Service

Follow this pattern to create a new resource service:

### Step 1: Create the Service File

Create a new file in `src/services/api/` with the naming pattern `{resource}.service.js`:

```javascript
// gift.service.js
import BaseService from './base.service.js';
import { transformPaginatedResponse, transformSingleResponse } from './utils/transformers.js';

/**
 * Gift Service
 * 
 * Handles all gift-related API operations
 */
class GiftService extends BaseService {
  constructor() {
    super('/dashboard/gifts');
  }

  /**
   * Get all gifts with optional filters
   * 
   * @param {Object} filters - Filter parameters
   * @param {number} filters.p - Page number
   * @param {number} filters.limit - Items per page
   * @param {string} filters.search - Search query
   * @param {string} filters.lang - Language code
   * @returns {Promise<Object>} Paginated gift list
   */
  async getAll(filters = {}) {
    const response = await this.post('/index', {
      p: filters.p || 1,
      limit: filters.limit || 10,
      search: filters.search || '',
      lang: filters.lang || 'en'
    });
    
    return transformPaginatedResponse(response);
  }

  /**
   * Get a single gift by ID
   * 
   * @param {number|string} id - Gift ID
   * @returns {Promise<Object>} Gift details
   */
  async getById(id) {
    const response = await this.post('/show', { id });
    return transformSingleResponse(response);
  }

  /**
   * Create a new gift
   * 
   * @param {Object} data - Gift data
   * @returns {Promise<Object>} Created gift
   */
  async create(data) {
    const response = await this.post('/store', data);
    return transformSingleResponse(response);
  }

  /**
   * Update an existing gift
   * 
   * @param {number|string} id - Gift ID
   * @param {Object} data - Updated gift data
   * @returns {Promise<Object>} Updated gift
   */
  async update(id, data) {
    const response = await this.post('/edit', { ...data, id });
    return transformSingleResponse(response);
  }

  /**
   * Delete a gift
   * 
   * @param {number|string} id - Gift ID
   * @returns {Promise<Object>} Deletion result
   */
  async remove(id) {
    return this.post('/delete', { id });
  }
}

// Export singleton instance
export default new GiftService();
```

### Step 2: Add to Central Export

Update `src/services/api/index.js` to include the new service:

```javascript
import giftService from './gift.service.js';

export default {
  gift: giftService,
  // ... other services
};
```

### Step 3: Use in Vuex Actions

Call the service from Vuex actions, not directly from components:

```javascript
// store/modules/gifts.js
import apiServices from '@/services/api';

export default {
  namespaced: true,
  
  state: {
    gifts: [],
    loading: false,
    error: null
  },
  
  mutations: {
    SET_GIFTS(state, gifts) {
      state.gifts = gifts;
    },
    SET_LOADING(state, loading) {
      state.loading = loading;
    },
    SET_ERROR(state, error) {
      state.error = error;
    }
  },
  
  actions: {
    async fetchGifts({ commit }, filters) {
      commit('SET_LOADING', true);
      commit('SET_ERROR', null);
      
      try {
        const { items, pagination } = await apiServices.gift.getAll(filters);
        commit('SET_GIFTS', items);
        return { items, pagination };
      } catch (error) {
        const normalizedError = transformErrorResponse(error);
        commit('SET_ERROR', normalizedError.message);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    }
  }
};
```

## Transformation Utilities

The `utils/transformers.js` file provides functions for normalizing API responses.

### `transformPaginatedResponse(response)`

Extracts pagination metadata and data items from paginated API responses.

**Returns:**
```javascript
{
  items: [],           // Array of data items
  pagination: {
    total: 100,        // Total number of items
    page: 1,           // Current page number
    limit: 10,         // Items per page
    pages: 10          // Total number of pages
  },
  raw: {}              // Raw response data
}
```

**Usage:**
```javascript
const response = await service.post('/list', { p: 1, limit: 10 });
const { items, pagination } = transformPaginatedResponse(response);
```

### `transformErrorResponse(error)`

Normalizes axios error objects into a consistent format.

**Returns:**
```javascript
{
  message: 'Error message',  // Human-readable error message
  status: 500,               // HTTP status code
  code: 'ERROR_CODE',        // Error code if available
  raw: {}                    // Raw error response data
}
```

**Usage:**
```javascript
try {
  await service.post('/create', data);
} catch (error) {
  const normalizedError = transformErrorResponse(error);
  console.error(normalizedError.message);
}
```

### `buildQueryParams(params)`

Removes null/undefined values from query parameter objects.

**Usage:**
```javascript
const params = buildQueryParams({
  search: 'gift',
  status: null,      // Will be removed
  page: 1,
  limit: undefined   // Will be removed
});
// Returns: { search: 'gift', page: 1 }
```

### `transformListResponse(response)`

For simple list endpoints without pagination metadata.

**Returns:**
```javascript
{
  items: [],  // Array of data items
  raw: {}     // Raw response data
}
```

### `transformSingleResponse(response)`

For endpoints that return a single resource.

**Returns:**
```javascript
{
  item: {},   // The resource data
  raw: {}     // Raw response data
}
```

## Naming Conventions

Consistent naming makes the codebase easier to navigate and understand.

### File Naming

- **Pattern:** `{resource}.service.js`
- **Examples:** `user.service.js`, `gift.service.js`, `equipment.service.js`

### Class Naming

- **Pattern:** `{Resource}Service`
- **Examples:** `UserService`, `GiftService`, `EquipmentService`

### Method Naming

Use descriptive names that reflect the business operation:

- **List operations:** `getAll`, `list`, `search`
- **Single resource:** `getById`, `show`, `find`
- **Create:** `create`, `store`, `add`
- **Update:** `update`, `edit`, `modify`
- **Delete:** `remove`, `delete`, `destroy`
- **Custom operations:** `activate`, `deactivate`, `publish`, `archive`

### Export Pattern

Export a singleton instance as the default export:

```javascript
export default new GiftService();
```

Optionally export the class as a named export for testing:

```javascript
export { GiftService };
export default new GiftService();
```

## Integration with Vuex

Resource services should be called from Vuex actions, not directly from components. This pattern:
- Centralizes state management
- Makes it easier to handle loading states and errors
- Enables caching and optimistic updates
- Improves testability

**Pattern:**

```javascript
// Vuex action
async fetchData({ commit }, params) {
  commit('SET_LOADING', true);
  
  try {
    const result = await apiServices.resource.getAll(params);
    commit('SET_DATA', result.items);
    return result;
  } catch (error) {
    const normalizedError = transformErrorResponse(error);
    commit('SET_ERROR', normalizedError.message);
    throw error;
  } finally {
    commit('SET_LOADING', false);
  }
}
```

## Error Handling

### Global Error Handling

The HTTP client (`src/services/http.js`) handles global errors:
- **401 Unauthorized:** Redirects to login
- **403 Forbidden:** Shows permission error
- **500 Server Error:** Shows generic error message

### Resource-Specific Error Handling

Handle resource-specific errors in Vuex actions:

```javascript
try {
  await apiServices.gift.create(data);
} catch (error) {
  const normalizedError = transformErrorResponse(error);
  
  // Handle specific error codes
  if (normalizedError.code === 'DUPLICATE_NAME') {
    commit('SET_ERROR', 'A gift with this name already exists');
  } else {
    commit('SET_ERROR', normalizedError.message);
  }
}
```

### Error Propagation

Service methods should return promises and let calling code handle errors:

```javascript
// ✅ Good - Let caller handle errors
async create(data) {
  return this.post('/store', data);
}

// ❌ Bad - Handling errors internally
async create(data) {
  try {
    return this.post('/store', data);
  } catch (error) {
    console.error(error); // Don't do this
    return null;
  }
}
```

## API Endpoint Reference

Based on the API documentation (`api-docs-postman.json`), all endpoints follow these patterns:

### Endpoint Path Mapping

The development server proxies `/api` to `/dashboard` (configured in `vite.config.js`):

- **Backend expects**: `/dashboard/auth/login`, `/dashboard/gifts/index`, etc. (per Postman docs)
- **Code uses**: `/auth/login`, `/dashboard/gifts`, etc.
- **HTTP client adds**: `/api` prefix → `/api/auth/login`, `/api/dashboard/gifts`
- **Proxy rewrites**: `/api/*` → `/dashboard/*` → `/dashboard/auth/login`, `/dashboard/dashboard/gifts`

**Important**: When creating resource services, use the resource path as it appears in the Postman docs:
- Auth endpoints: Use `/auth/login` (becomes `/api/auth/login` → `/dashboard/auth/login`)
- Resource endpoints: Use `/dashboard/gifts` (becomes `/api/dashboard/gifts` → `/dashboard/dashboard/gifts`)

### Request Format

- **HTTP Method:** POST (for all operations)
- **Headers:** 
  - `API-KEY`: Automatically injected by http client
  - `Auth-Token`: Automatically injected by http client
- **Body Format:** URL-encoded or FormData
- **Common Parameters:**
  - `lang`: Language code (e.g., 'en', 'ar')
  - `search`: Search query string
  - `limit`: Items per page
  - `p`: Page number

### Response Format

All responses are JSON objects. Common patterns:

**Paginated List:**
```json
{
  "data": [...],
  "total": 100,
  "page": 1,
  "limit": 10,
  "pages": 10
}
```

**Single Resource:**
```json
{
  "data": {...}
}
```

**Error:**
```json
{
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

## Security Best Practices

### 1. Input Sanitization

Always sanitize user inputs before passing to API services to prevent XSS attacks.

**Use the sanitization utilities:**
- `sanitizeInput` - Sanitize a single string input
- `sanitizeObject` - Sanitize multiple fields in an object

**Import:**
```javascript
import { sanitizeInput, sanitizeObject } from '@/utils/sanitize';
```

**Example - Sanitizing form data:**
```javascript
// Sanitize specific string fields, leave numeric fields as-is
const sanitizedData = sanitizeObject(formData, ['name', 'description']);
await giftService.update(id, sanitizedData);
```

**Example - Sanitizing search input:**
```javascript
const sanitizedSearch = sanitizeInput(searchQuery.value);
await giftService.getAll({ search: sanitizedSearch });
```

**Important:**
- Sanitize string fields (names, descriptions, search terms) but not numeric fields
- Sanitize on input (before storing) rather than on output (before displaying)
- The sanitization utility uses DOMPurify to strip HTML tags and dangerous attributes

### 2. Token Security

Tokens are automatically encrypted before storage and decrypted when retrieved.

**Best practices:**
- Never log tokens in production code
- Use `import.meta.env.DEV` checks for debug logging
- The http client automatically adds the Auth-Token header to all requests
- Tokens are encrypted using AES-256 (see `src/utils/crypto.js`)

**Example - Safe token logging:**
```javascript
if (import.meta.env.DEV) {
    console.log('[Debug] Token retrieved:', token);
}
```

### 3. Error Handling

Never expose sensitive information in error messages.

**Best practices:**
- Use generic error messages for users ("Failed to update gift")
- Log detailed errors to console only in development mode
- The http client already handles 401/403/500 errors globally

**Example:**
```javascript
try {
    await giftService.update(id, data);
} catch (error) {
    if (import.meta.env.DEV) {
        console.error('[Gift Service] Update failed:', error);
    }
    // Show generic message to user
    showMessage('Failed to update gift. Please try again.', 'error');
}
```

### 4. CSRF Protection

**Not required for this API** - The API uses token-based authentication (API-KEY and Auth-Token headers) instead of cookies.

**Note:** If the backend adds cookie-based sessions in the future, implement CSRF tokens in the http client.

### 5. XSS Protection

Multiple layers of XSS protection are implemented:

1. **Input Sanitization** - All user inputs are sanitized using DOMPurify
2. **CSP Headers** - Content Security Policy headers in `index.html` restrict resource sources
3. **Token Encryption** - Tokens are encrypted before storage to prevent casual inspection

**Important:**
- Never use `v-html` with unsanitized user content
- Always sanitize user inputs before displaying or storing
- The CSP headers provide additional protection against inline script injection

### 6. API Key Security

**Best practices:**
- API keys are stored in `.env` and exposed via `import.meta.env.VITE_API_KEY`
- Never commit `.env` files to version control
- Rotate API keys regularly in production
- Consider implementing API key rotation mechanism

**Production checklist:**
- [ ] Generate new API keys for production
- [ ] Update `.env` with production keys
- [ ] Add `.env` to `.gitignore`
- [ ] Document key rotation process

### 7. Rate Limiting

**Backend responsibility:**
- Implement rate limiting on the backend for all endpoints
- Handle 429 (Too Many Requests) responses gracefully
- Consider adding retry logic with exponential backoff

**Example - Handling rate limits:**
```javascript
try {
    await giftService.getAll();
} catch (error) {
    if (error.response?.status === 429) {
        showMessage('Too many requests. Please wait a moment.', 'warning');
    }
}
```

### 8. Data Validation

**Best practices:**
- Validate data on both client and server side
- Use Vuelidate or similar for form validation
- Don't rely solely on client-side validation (can be bypassed)

**Example:**
```javascript
// Client-side validation
if (!formData.name || formData.name.length < 3) {
    showMessage('Name must be at least 3 characters', 'error');
    return;
}

// Sanitize after validation
const sanitizedData = sanitizeObject(formData, ['name']);
await giftService.create(sanitizedData);
```

### 9. Secure Communication

**Always use HTTPS in production** to protect tokens and data in transit.

**Production checklist:**
- [ ] Enable HTTPS on the backend
- [ ] Update API URLs to use `https://`
- [ ] Enable `upgrade-insecure-requests` in CSP (already configured)
- [ ] Test all API endpoints over HTTPS

### 10. Token Expiration

**Current implementation:**
- localStorage tokens expire after 24 hours
- sessionStorage tokens expire when browser closes
- Expired tokens are automatically cleared

**Future enhancement:**
- Implement token refresh mechanism when backend supports it
- Check expiration 5 minutes before TTL
- Automatically refresh token before expiration

---

## Best Practices

### 1. Keep Services Focused

Each service should handle a single resource:

```javascript
// ✅ Good - Focused on gifts
class GiftService extends BaseService {
  async getAll(filters) { ... }
  async getById(id) { ... }
  async create(data) { ... }
}

// ❌ Bad - Mixed concerns
class GiftService extends BaseService {
  async getGifts() { ... }
  async getUsers() { ... }  // Wrong resource
}
```

### 2. Don't Mix Authentication Logic

Authentication has its own service (`src/services/auth.js`). Don't mix auth logic with resource services.

### 3. Use Transformers for Consistency

Always use transformer utilities for consistent response handling:

```javascript
// ✅ Good - Using transformers
async getAll(filters) {
  const response = await this.post('/list', filters);
  return transformPaginatedResponse(response);
}

// ❌ Bad - Manual transformation
async getAll(filters) {
  const response = await this.post('/list', filters);
  return response.data.data; // Inconsistent
}
```

### 4. Add JSDoc Comments

Document all service methods with JSDoc:

```javascript
/**
 * Get all gifts with optional filters
 * 
 * @param {Object} filters - Filter parameters
 * @param {number} filters.p - Page number
 * @param {number} filters.limit - Items per page
 * @returns {Promise<Object>} Paginated gift list
 */
async getAll(filters = {}) { ... }
```

### 5. Return Promises

Don't handle errors internally unless necessary. Let calling code decide how to handle errors:

```javascript
// ✅ Good
async create(data) {
  return this.post('/store', data);
}

// ❌ Bad
async create(data) {
  try {
    return this.post('/store', data);
  } catch (error) {
    return null; // Swallowing errors
  }
}
```

### 6. Use Async/Await

Use async/await in calling code for cleaner syntax:

```javascript
// ✅ Good
async fetchGifts({ commit }) {
  try {
    const result = await apiServices.gift.getAll();
    commit('SET_GIFTS', result.items);
  } catch (error) {
    console.error(error);
  }
}

// ❌ Bad
fetchGifts({ commit }) {
  apiServices.gift.getAll()
    .then(result => commit('SET_GIFTS', result.items))
    .catch(error => console.error(error));
}
```

## Future Enhancements

Potential improvements to consider:

### Security Enhancements

- **Nonce-based CSP**: Implement nonce-based Content Security Policy for stricter security in production
- **Request Signing**: Add request signing for API integrity verification
- **Token Refresh**: Implement token refresh mechanism when backend supports it
- **Data Encryption**: Add request/response encryption for sensitive data
- **Certificate Pinning**: Implement certificate pinning for mobile apps

### Performance & Reliability

### Request Caching

Cache GET requests to reduce API calls:

```javascript
class CachedService extends BaseService {
  constructor(resourcePath) {
    super(resourcePath);
    this.cache = new Map();
  }
  
  async get(endpoint, params) {
    const key = `${endpoint}:${JSON.stringify(params)}`;
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }
    
    const response = await super.get(endpoint, params);
    this.cache.set(key, response);
    return response;
  }
}
```

### Optimistic Updates

Update UI immediately before API response:

```javascript
async updateGift({ commit }, { id, data }) {
  // Optimistic update
  commit('UPDATE_GIFT', { id, ...data });
  
  try {
    const result = await apiServices.gift.update(id, data);
    commit('UPDATE_GIFT', result.item); // Confirm with server data
  } catch (error) {
    commit('REVERT_GIFT', id); // Rollback on error
    throw error;
  }
}
```

### Request Cancellation

Cancel pending requests when component unmounts:

```javascript
import axios from 'axios';

class CancellableService extends BaseService {
  constructor(resourcePath) {
    super(resourcePath);
    this.cancelTokens = new Map();
  }
  
  async get(endpoint, params, cancelKey) {
    if (cancelKey && this.cancelTokens.has(cancelKey)) {
      this.cancelTokens.get(cancelKey).cancel();
    }
    
    const source = axios.CancelToken.source();
    if (cancelKey) {
      this.cancelTokens.set(cancelKey, source);
    }
    
    return super.get(endpoint, params, { cancelToken: source.token });
  }
}
```

### Retry Logic

Automatically retry failed requests:

```javascript
async function retryRequest(fn, retries = 3, delay = 1000) {
  try {
    return await fn();
  } catch (error) {
    if (retries === 0) throw error;
    await new Promise(resolve => setTimeout(resolve, delay));
    return retryRequest(fn, retries - 1, delay * 2);
  }
}
```

### WebSocket Integration

Real-time updates for live data:

```javascript
class RealtimeService extends BaseService {
  constructor(resourcePath) {
    super(resourcePath);
    this.socket = null;
  }
  
  subscribe(event, callback) {
    if (!this.socket) {
      this.socket = new WebSocket('ws://api.example.com');
    }
    this.socket.addEventListener(event, callback);
  }
}
```

## Examples

### Example 1: Creating a User Service

```javascript
// user.service.js
import BaseService from './base.service.js';
import { transformPaginatedResponse, transformSingleResponse } from './utils/transformers.js';

class UserService extends BaseService {
  constructor() {
    super('/admin/user');
  }

  async getAll(filters = {}) {
    const response = await this.post('/index', {
      p: filters.p || 1,
      limit: filters.limit || 10,
      search: filters.search || '',
      lang: filters.lang || 'en'
    });
    return transformPaginatedResponse(response);
  }

  async getById(id) {
    const response = await this.post('/show', { id });
    return transformSingleResponse(response);
  }

  async create(userData) {
    // Use FormData for user creation (as per API docs)
    const formData = new FormData();
    Object.keys(userData).forEach(key => {
      formData.append(key, userData[key]);
    });
    
    const response = await this.postFormData('/store', formData);
    return transformSingleResponse(response);
  }

  async update(id, userData) {
    const response = await this.post('/edit', { ...userData, id });
    return transformSingleResponse(response);
  }

  async remove(id) {
    return this.post('/delete', { id });
  }

  async changePassword(id, newPassword) {
    return this.post('/change-password', { id, password: newPassword });
  }
}

export default new UserService();
```

### Example 2: Using Service in Vuex

```javascript
// store/modules/users.js
import apiServices from '@/services/api';
import { transformErrorResponse } from '@/services/api';

export default {
  namespaced: true,
  
  state: {
    users: [],
    currentUser: null,
    loading: false,
    error: null,
    pagination: {
      total: 0,
      page: 1,
      limit: 10,
      pages: 1
    }
  },
  
  mutations: {
    SET_USERS(state, users) {
      state.users = users;
    },
    SET_CURRENT_USER(state, user) {
      state.currentUser = user;
    },
    SET_PAGINATION(state, pagination) {
      state.pagination = pagination;
    },
    SET_LOADING(state, loading) {
      state.loading = loading;
    },
    SET_ERROR(state, error) {
      state.error = error;
    },
    ADD_USER(state, user) {
      state.users.push(user);
    },
    UPDATE_USER(state, updatedUser) {
      const index = state.users.findIndex(u => u.id === updatedUser.id);
      if (index !== -1) {
        state.users.splice(index, 1, updatedUser);
      }
    },
    REMOVE_USER(state, userId) {
      state.users = state.users.filter(u => u.id !== userId);
    }
  },
  
  actions: {
    async fetchUsers({ commit }, filters = {}) {
      commit('SET_LOADING', true);
      commit('SET_ERROR', null);
      
      try {
        const { items, pagination } = await apiServices.user.getAll(filters);
        commit('SET_USERS', items);
        commit('SET_PAGINATION', pagination);
        return { items, pagination };
      } catch (error) {
        const normalizedError = transformErrorResponse(error);
        commit('SET_ERROR', normalizedError.message);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    async fetchUser({ commit }, userId) {
      commit('SET_LOADING', true);
      commit('SET_ERROR', null);
      
      try {
        const { item } = await apiServices.user.getById(userId);
        commit('SET_CURRENT_USER', item);
        return item;
      } catch (error) {
        const normalizedError = transformErrorResponse(error);
        commit('SET_ERROR', normalizedError.message);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    async createUser({ commit }, userData) {
      commit('SET_LOADING', true);
      commit('SET_ERROR', null);
      
      try {
        const { item } = await apiServices.user.create(userData);
        commit('ADD_USER', item);
        return item;
      } catch (error) {
        const normalizedError = transformErrorResponse(error);
        commit('SET_ERROR', normalizedError.message);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    async updateUser({ commit }, { id, userData }) {
      commit('SET_LOADING', true);
      commit('SET_ERROR', null);
      
      try {
        const { item } = await apiServices.user.update(id, userData);
        commit('UPDATE_USER', item);
        return item;
      } catch (error) {
        const normalizedError = transformErrorResponse(error);
        commit('SET_ERROR', normalizedError.message);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    async deleteUser({ commit }, userId) {
      commit('SET_LOADING', true);
      commit('SET_ERROR', null);
      
      try {
        await apiServices.user.remove(userId);
        commit('REMOVE_USER', userId);
      } catch (error) {
        const normalizedError = transformErrorResponse(error);
        commit('SET_ERROR', normalizedError.message);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    }
  },
  
  getters: {
    getUserById: (state) => (id) => {
      return state.users.find(u => u.id === id);
    },
    isLoading: (state) => state.loading,
    hasError: (state) => !!state.error
  }
};
```

### Example 3: Using Transformers

```javascript
import { 
  transformPaginatedResponse, 
  transformErrorResponse,
  buildQueryParams 
} from '@/services/api';

// Transform paginated response
async function fetchGifts(filters) {
  try {
    const response = await giftService.post('/index', filters);
    const { items, pagination } = transformPaginatedResponse(response);
    
    console.log(`Showing ${items.length} of ${pagination.total} gifts`);
    console.log(`Page ${pagination.page} of ${pagination.pages}`);
    
    return { items, pagination };
  } catch (error) {
    const normalizedError = transformErrorResponse(error);
    console.error(`Error: ${normalizedError.message} (${normalizedError.code})`);
    throw error;
  }
}

// Build clean query params
const filters = buildQueryParams({
  search: 'gift',
  status: null,        // Will be removed
  page: 1,
  limit: undefined,    // Will be removed
  category: 'premium'
});
// Result: { search: 'gift', page: 1, category: 'premium' }
```

### Example 4: Handling Errors

```javascript
// In a Vuex action
async createGift({ commit }, giftData) {
  try {
    const { item } = await apiServices.gift.create(giftData);
    commit('ADD_GIFT', item);
    
    // Show success message
    this.$notify({
      type: 'success',
      message: 'Gift created successfully'
    });
    
    return item;
  } catch (error) {
    const normalizedError = transformErrorResponse(error);
    
    // Handle specific error codes
    if (normalizedError.code === 'DUPLICATE_NAME') {
      commit('SET_ERROR', 'A gift with this name already exists');
    } else if (normalizedError.status === 422) {
      commit('SET_ERROR', 'Invalid gift data. Please check your input.');
    } else {
      commit('SET_ERROR', normalizedError.message);
    }
    
    // Show error notification
    this.$notify({
      type: 'error',
      message: normalizedError.message
    });
    
    throw error;
  }
}
```

### Example 5: Working with Pagination

```javascript
// Component with pagination
export default {
  data() {
    return {
      currentPage: 1,
      itemsPerPage: 10
    };
  },
  
  computed: {
    ...mapState('gifts', ['gifts', 'pagination', 'loading'])
  },
  
  methods: {
    ...mapActions('gifts', ['fetchGifts']),
    
    async loadGifts() {
      await this.fetchGifts({
        p: this.currentPage,
        limit: this.itemsPerPage,
        lang: this.$i18n.locale
      });
    },
    
    async goToPage(page) {
      this.currentPage = page;
      await this.loadGifts();
    },
    
    async changePageSize(size) {
      this.itemsPerPage = size;
      this.currentPage = 1; // Reset to first page
      await this.loadGifts();
    }
  },
  
  mounted() {
    this.loadGifts();
  }
};
```

---

## Quick Reference

### Creating a New Service

1. Create `{resource}.service.js` in `src/services/api/`
2. Extend `BaseService` with resource path
3. Implement resource-specific methods
4. Use transformers for consistent responses
5. Export singleton instance
6. Add to `index.js` exports
7. Use in Vuex actions

### Common Patterns

```javascript
// List with pagination
async getAll(filters) {
  const response = await this.post('/index', filters);
  return transformPaginatedResponse(response);
}

// Single resource
async getById(id) {
  const response = await this.post('/show', { id });
  return transformSingleResponse(response);
}

// Create
async create(data) {
  const response = await this.post('/store', data);
  return transformSingleResponse(response);
}

// Update
async update(id, data) {
  const response = await this.post('/edit', { ...data, id });
  return transformSingleResponse(response);
}

// Delete
async remove(id) {
  return this.post('/delete', { id });
}
```

### Import Patterns

```javascript
// Import everything
import apiServices, { BaseService, transformers } from '@/services/api';

// Import specific items
import { BaseService } from '@/services/api';
import { transformPaginatedResponse } from '@/services/api';

// Use in code
const result = await apiServices.gift.getAll();
const { items } = transformers.transformPaginatedResponse(response);
```
