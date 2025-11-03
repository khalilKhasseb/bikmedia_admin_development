# Netlify Deployment Guide

## Overview
This guide covers deploying the Vue.js application to Netlify with proper API proxy configuration.

## Key Changes Made

### 1. Netlify Configuration (`netlify.toml`)
- **API Proxying**: Redirects `/api/*` to `https://bikmedia.com/dashboard/*`
- **Admin API Proxying**: Redirects `/apiAdmin/*` to `https://bikmedia.com/admin/*`
- **SPA Routing**: Handles client-side routing with fallback to `index.html`
- **Security Headers**: Added security headers for production
- **Asset Caching**: Optimized caching for static assets

### 2. Vite Configuration Updates
- Changed `base` from `"./"` to `"/"` for Netlify compatibility
- Removed GitHub Pages specific base URL configuration
- Kept development proxy configuration intact

### 3. Build Scripts
- Added `build:netlify` script for Netlify-specific builds
- Added `preview:netlify` for local testing

## Deployment Steps

### Option 1: Automatic Deployment (Recommended)
1. **Connect Repository to Netlify**:
   - Go to [Netlify Dashboard](https://app.netlify.com)
   - Click "New site from Git"
   - Connect your GitHub repository
   - Select the repository

2. **Configure Build Settings**:
   - Build command: `npm run build:netlify`
   - Publish directory: `dist`
   - Node version: `18` (set in Environment variables)

3. **Set Environment Variables**:
   Go to Site settings > Environment variables and add:
   ```
   VITE_BASE_API_URL=bikmedia.com/dashboard/
   VITE_API_KEY=your-production-api-key
   VITE_AUTH_TOKEN=your-production-auth-token
   VITE_APP_ENV=production
   VITE_ENCRYPTION_KEY=your-production-encryption-key
   NODE_VERSION=18
   ```

4. **Deploy**: Push to your main branch to trigger automatic deployment

### Option 2: Manual Deployment
1. **Build locally**:
   ```bash
   npm run build:netlify
   ```

2. **Deploy via Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   netlify login
   netlify deploy --prod --dir=dist
   ```

## API Proxy Configuration

The `netlify.toml` file handles API proxying:

```toml
# Redirect API calls to the actual backend
[[redirects]]
  from = "/api/*"
  to = "https://bikmedia.com/dashboard/:splat"
  status = 200
  force = true

[[redirects]]
  from = "/apiAdmin/*"
  to = "https://bikmedia.com/admin/:splat"
  status = 200
  force = true
```

This ensures that:
- `/api/users` → `https://bikmedia.com/dashboard/users`
- `/apiAdmin/settings` → `https://bikmedia.com/admin/settings`

## Testing

### Local Testing
```bash
# Test Netlify build locally
npm run preview:netlify
```

### Production Testing
1. Deploy to Netlify
2. Test API endpoints in browser developer tools
3. Verify that API calls are reaching the correct backend URLs

## Troubleshooting

### API Calls Still Failing
1. **Check Environment Variables**: Ensure all `VITE_*` variables are set in Netlify dashboard
2. **Check API URLs**: Verify the backend API is accessible at `https://bikmedia.com/dashboard/` and `https://bikmedia.com/admin/`
3. **Check CORS**: Ensure the backend allows requests from your Netlify domain
4. **Check Network Tab**: Use browser dev tools to see actual request URLs

### Build Failures
1. **Node Version**: Ensure Node 18 is set in Netlify environment variables
2. **Dependencies**: Check that all dependencies install correctly
3. **Environment Variables**: Verify all required `VITE_*` variables are set

### Routing Issues
The `netlify.toml` includes SPA routing configuration. If routes don't work:
1. Verify the `[[redirects]]` section for `/*` is present
2. Check that `index.html` exists in the `dist` folder

## Migration from GitHub Pages

If migrating from GitHub Pages:
1. Update DNS to point to Netlify
2. Update any hardcoded URLs that reference GitHub Pages
3. Test all functionality thoroughly
4. Consider keeping GitHub Pages as a backup during transition

## Security Considerations

1. **Environment Variables**: Never commit production secrets to the repository
2. **API Keys**: Use different API keys for development and production
3. **HTTPS**: Netlify provides HTTPS by default
4. **Headers**: Security headers are configured in `netlify.toml`