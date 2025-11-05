# Services Documentation

## Overview

The services layer provides a clean abstraction for API communication, authentication, and other backend interactions.

## API Service Layer

The application uses a modular API service architecture built on top of the HTTP client. This architecture provides:

- **BaseService**: Foundation class for all resource services
- **Resource Services**: Business logic for specific API resources (users, gifts, equipment, etc.)
- **Transformers**: Utilities for normalizing API responses
- **Consistent Patterns**: Standardized methods and error handling

For comprehensive documentation on creating and using API services, see:
**[src/services/api/README.md](./api/README.md)**

### Available Resource Services

*Resource services will be listed here as they are created*

### Creating New Services

1. Create a new file in `src/services/api/` following the pattern `{resource}.service.js`
2. Extend `BaseService` with your resource path
3. Implement resource-specific methods
4. Export a singleton instance
5. Add to `src/services/api/index.js`

See the [API Service README](./api/README.md) for detailed examples and best practices.

## Auth Service

### Methods
- `login(username, password, rememberMe, lang = 'ar')` - Authenticate user
- `logout()` - Clear authentication and redirect to login

### Special Characteristics

The auth service does not extend BaseService because it has unique requirements:
- Direct storage management (sessionStorage/localStorage)
- Vuex store integration
- Router navigation
- Remember-me functionality

For standard API resources, use the BaseService pattern documented in [src/services/api/README.md](./api/README.md).

## HTTP Client

### Methods
- `get(url, config)` - GET requests
- `post(url, data, config)` - POST requests
- `put(url, data, config)` - PUT requests
- `delete(url, config)` - DELETE requests

### Features

- **Request Interceptors**: Automatically inject API-KEY and Auth-Token headers
- **Body Transformation**: Convert request bodies to URL-encoded format
- **Response Interceptors**: Log responses and handle errors
- **Error Handling**: Global handling for 401, 403, and 500 errors
- **Base URL**: Configured with `/api` base URL

### Proxy Configuration

The development server (configured in `vite.config.js`) proxies requests from `/api` to `/dashboard`:

- **Code uses**: `/api/auth/login`, `/api/dashboard/gifts`, etc.
- **Proxy rewrites to**: `/dashboard/auth/login`, `/dashboard/dashboard/gifts`, etc.
- **Backend expects**: `/dashboard/auth/login` (as documented in `api-docs-postman.json`)

This means:
- When calling the http client with `/auth/login`, the full URL becomes `/api/auth/login`
- The proxy rewrites it to `/dashboard/auth/login` before sending to the backend
- Resource services should use paths like `/dashboard/gifts` (which become `/api/dashboard/gifts` → `/dashboard/dashboard/gifts`)

**Note**: For auth endpoints, use `/auth/login` directly. For resource endpoints, include `/dashboard` in the resource path.

### Usage

**Important**: The HTTP client should not be used directly in most cases. Use BaseService or resource services instead. Direct HTTP client usage is only appropriate for special cases like authentication.

For standard API operations, create a resource service that extends BaseService. See [src/services/api/README.md](./api/README.md) for details.


## Authentication Flow

All API requests require two headers:

- **API-KEY**: Application identifier (stored in `.env` as `VITE_API_KEY`)
- **AUTH-TOKEN**: User authentication token (obtained from login)

### Login Process

1. **Request**: POST to `/auth/login` with username, password, and optional lang parameter
2. **Format**: Request accepts `x-www-form-urlencoded` data
3. **Response**: Contains auth token and user data
4. **Storage**: 
   - Auth token is stored in **sessionStorage** (default) or **localStorage** (if "Remember Me" is checked)
   - API key is retrieved from `.env` file (`VITE_API_KEY`)
5. **Automatic Injection**: The HTTP client automatically injects both headers into all subsequent requests

### Token Management

The auth token is:
- Retrieved from storage on app initialization
- Checked for validity before making requests
- Automatically included in request headers by the HTTP client interceptor
- Cleared on logout or when a 401 response is received

Storage location depends on the "Remember Me" preference:
- **sessionStorage**: Token expires when browser tab is closed (default)
- **localStorage**: Token persists across browser sessions (when "Remember Me" is checked)

## Naming Conventions

### Service Files
- **Pattern**: `{resource}.service.js`
- **Examples**: `user.service.js`, `gift.service.js`, `equipment.service.js`

### Service Classes
- **Pattern**: `{Resource}Service`
- **Examples**: `UserService`, `GiftService`, `EquipmentService`

### Service Methods
- **List**: `getAll`, `list`, `search`
- **Single**: `getById`, `show`, `find`
- **Create**: `create`, `store`, `add`
- **Update**: `update`, `edit`, `modify`
- **Delete**: `remove`, `delete`, `destroy`

For complete naming conventions and patterns, see [src/services/api/README.md](./api/README.md).
