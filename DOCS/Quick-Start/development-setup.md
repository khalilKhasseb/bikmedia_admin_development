# Development Setup Guide

Get your Bikmedia Admin development environment up and running in minutes.

## 📋 Table of Contents
- [Prerequisites](#prerequisites)
- [Quick Setup](#quick-setup)
- [Environment Configuration](#environment-configuration)
- [Verification](#verification)
- [IDE Setup](#ide-setup)
- [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Software
- **Node.js** >= 16.0.0 ([Download](https://nodejs.org/))
- **npm** >= 8.0.0 (comes with Node.js)
- **Git** ([Download](https://git-scm.com/))

### Recommended Software
- **VS Code** ([Download](https://code.visualstudio.com/))
- **Vue DevTools** browser extension

### System Requirements
- **OS**: Windows 10+, macOS 10.15+, or Linux
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 2GB free space

## Quick Setup

### ⚡ 5-Minute Setup

```bash
# 1. Clone the repository (if not already done)
git clone [repository-url]
cd bikmedia_admin

# 2. Install dependencies
npm install

# 3. Copy environment file
cp .env.example .env

# 4. Start development server
npm run dev
```

**That's it!** Your development server should be running at `http://localhost:5173`

### 📦 Installation Steps Explained

#### Step 1: Install Dependencies
```bash
npm install
```
This installs all required packages including:
- Vue 3 framework
- Vite build tool
- UI component libraries
- Development tools

#### Step 2: Environment Configuration
```bash
cp .env.example .env
```
Creates your local environment configuration file.

#### Step 3: Start Development
```bash
npm run dev
```
Starts the Vite development server with:
- Hot module replacement
- Fast refresh
- Source maps
- Development optimizations

## Environment Configuration

### Environment Files

The project uses multiple environment files:

#### `.env` - Local Development
```bash
# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_NAME=Bikmedia Admin
VITE_APP_ENV=development

# Feature Flags
VITE_ENABLE_DEBUG=true
VITE_ENABLE_MOCK_API=false

# Authentication
VITE_AUTH_STORAGE_KEY=bikmedia_auth
```

#### `.env.production` - Production Build
```bash
VITE_API_BASE_URL=https://api.bikmedia.com
VITE_APP_ENV=production
VITE_ENABLE_DEBUG=false
```

#### `.env.netlify` - Netlify Deployment
```bash
VITE_API_BASE_URL=https://api-staging.bikmedia.com
VITE_APP_ENV=staging
```

### Configuration Options

#### API Settings
- `VITE_API_BASE_URL`: Backend API endpoint
- `VITE_API_TIMEOUT`: Request timeout (default: 10000ms)

#### App Settings
- `VITE_APP_NAME`: Application display name
- `VITE_APP_VERSION`: Version number
- `VITE_APP_ENV`: Environment identifier

#### Feature Flags
- `VITE_ENABLE_DEBUG`: Enable debug logging
- `VITE_ENABLE_MOCK_API`: Use mock API responses
- `VITE_ENABLE_ANALYTICS`: Enable analytics tracking

#### Authentication
- `VITE_AUTH_STORAGE_KEY`: Local storage key for auth data
- `VITE_AUTH_TOKEN_EXPIRY`: Token expiration time

### 📖 **[Complete Environment Guide](../Features/ENVIRONMENT_CONFIG.md)**

## Verification

### ✅ Development Server Check

After running `npm run dev`, verify:

1. **Server starts successfully**
   ```
   ➜  Local:   http://localhost:5173/
   ➜  Network: use --host to expose
   ```

2. **Application loads**
   - Open `http://localhost:5173` in browser
   - Should see Bikmedia Admin login page
   - No console errors

3. **Hot reload works**
   - Make a small change to any Vue file
   - Page should update automatically

### 🧪 Build Verification

Test production build:
```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

Should complete without errors and preview should work at `http://localhost:4173`

### 🔍 Health Check Commands

```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Verify dependencies
npm list --depth=0

# Run linting (if configured)
npm run lint

# Run tests (if available)
npm run test
```

## IDE Setup

### VS Code (Recommended)

#### Essential Extensions
```bash
# Install via VS Code Extensions panel or command line:
code --install-extension Vue.volar
code --install-extension Vue.vscode-typescript-vue-plugin
code --install-extension bradlc.vscode-tailwindcss
code --install-extension esbenp.prettier-vscode
```

#### Recommended Extensions
- **Vue Language Features (Volar)** - Vue 3 support
- **TypeScript Vue Plugin** - Enhanced TypeScript support
- **Prettier** - Code formatting
- **ESLint** - Code linting
- **Auto Rename Tag** - HTML tag renaming
- **Bracket Pair Colorizer** - Bracket highlighting
- **GitLens** - Git integration

#### VS Code Settings
Create `.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "files.associations": {
    "*.vue": "vue"
  },
  "emmet.includeLanguages": {
    "vue": "html"
  }
}
```

### Alternative IDEs

#### WebStorm
- Built-in Vue support
- Excellent TypeScript integration
- Advanced debugging capabilities

#### Sublime Text
- Vue Syntax Highlighting package
- SublimeLinter-eslint
- Prettier plugin

## Troubleshooting

### Common Issues

#### ❌ "npm install" fails
**Problem**: Dependency installation errors
**Solutions**:
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Use different registry if needed
npm install --registry https://registry.npmjs.org/
```

#### ❌ "Port 5173 already in use"
**Problem**: Development server port conflict
**Solutions**:
```bash
# Use different port
npm run dev -- --port 3000

# Kill process using port 5173
lsof -ti:5173 | xargs kill -9  # macOS/Linux
netstat -ano | findstr :5173   # Windows
```

#### ❌ "Module not found" errors
**Problem**: Import path issues
**Solutions**:
```bash
# Check if file exists
ls src/components/ComponentName.vue

# Verify import path
# Use @ alias for src directory
import Component from '@/components/ComponentName.vue'
```

#### ❌ Environment variables not working
**Problem**: VITE_ prefix missing or file not loaded
**Solutions**:
```bash
# Ensure variables start with VITE_
VITE_API_URL=http://localhost:3000

# Restart dev server after .env changes
npm run dev
```

#### ❌ Styles not loading
**Problem**: SCSS compilation issues
**Solutions**:
```bash
# Ensure sass is installed
npm install -D sass

# Check SCSS syntax
# Verify @import paths
```

### Performance Issues

#### Slow Development Server
```bash
# Enable host exposure for network access
npm run dev -- --host

# Increase memory limit if needed
node --max-old-space-size=4096 node_modules/.bin/vite

# Clear Vite cache
rm -rf node_modules/.vite
```

#### Large Bundle Size
```bash
# Analyze bundle
npm run build
npm run preview

# Check for unused dependencies
npm run build -- --analyze
```

### Getting Help

#### 📖 Documentation
- **[Environment Config](../Features/ENVIRONMENT_CONFIG.md)** - Detailed environment setup
- **[Architecture Guide](../Phase-1-Architecture/README.md)** - Project structure
- **[Development Workflow](../Phase-3-Development/README.md)** - Best practices

#### 🔍 Debug Information
When reporting issues, include:
```bash
# System information
node --version
npm --version
git --version

# Project information
npm list vue
npm list vite
cat package.json | grep version
```

#### 💡 Pro Tips
- **Use npm scripts**: Prefer `npm run dev` over direct vite commands
- **Check console**: Browser dev tools often show helpful errors
- **Restart server**: Many issues resolve with a fresh server restart
- **Clear cache**: When in doubt, clear npm and browser caches

## Quick Reference

### Essential Commands
```bash
npm install          # Install dependencies
npm run dev         # Start development server
npm run build       # Build for production
npm run preview     # Preview production build
```

### Development URLs
- **Development**: `http://localhost:5173`
- **Preview**: `http://localhost:4173`
- **Network**: Use `--host` flag to expose on network

### File Locations
- **Environment**: `.env` (local), `.env.production` (prod)
- **Config**: `vite.config.js`, `package.json`
- **Source**: `src/` directory
- **Build**: `dist/` directory (after build)

---

**Ready to develop?** Start with `npm run dev` and check out the [template components](./template-adoption.md) for quick UI development!