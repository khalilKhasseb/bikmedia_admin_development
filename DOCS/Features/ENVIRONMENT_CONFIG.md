# Environment Configuration Guide

This document explains the environment variable configuration for different deployment environments.

## Environment Variables Overview

The application uses the following environment variables:

| Variable | Development | Production | Description |
|----------|-------------|------------|-------------|
| `VITE_BASE_API_URL` | `bikmedia.com/dashboard/` | `bikmedia.com/dashboard/` | Base API URL for backend services |
| `VITE_API_KEY` | `q25etr-as568-er9855-85rtg-45g56` | From GitHub Secrets | API authentication key |
| `VITE_AUTH_TOKEN` | `dZaMZ423sb0Nv6TtlbwoD2oKR7` | From GitHub Secrets | Authentication token |
| `VITE_APP_ENV` | `development` | `production` | Application environment identifier |
| `VITE_ENCRYPTION_KEY` | `bikmedia-dev-key-2025` | From GitHub Secrets | Client-side encryption passphrase |

## Development Environment

### Configuration File
- **File**: `.env`
- **Usage**: Local development and testing
- **Security**: Contains actual values for development

### Setup
1. Ensure `.env` file exists in project root
2. All variables should have appropriate development values
3. File is included in `.gitignore` to prevent committing sensitive data

## Production Environment

### Configuration Method
- **Method**: GitHub Actions environment variables
- **Security**: Values injected from GitHub repository secrets
- **File**: `.env.production` (template only)

### Key Differences from Development
1. **VITE_APP_ENV**: Set to `production` instead of `development`
2. **Security**: All sensitive values (API keys, tokens, encryption key) are stored as GitHub secrets
3. **Injection**: Values are injected during the build process in GitHub Actions

### GitHub Actions Configuration
```yaml
env:
  VITE_BASE_API_URL: ${{ secrets.VITE_BASE_API_URL }}
  VITE_API_KEY: ${{ secrets.VITE_API_KEY }}
  VITE_AUTH_TOKEN: ${{ secrets.VITE_AUTH_TOKEN }}
  VITE_APP_ENV: production
  VITE_ENCRYPTION_KEY: ${{ secrets.VITE_ENCRYPTION_KEY }}
```

## Environment Variable Usage

### In Application Code
Environment variables are accessed using Vite's built-in environment variable support:

```javascript
// Example usage (if needed in the future)
const apiUrl = import.meta.env.VITE_BASE_API_URL;
const apiKey = import.meta.env.VITE_API_KEY;
const authToken = import.meta.env.VITE_AUTH_TOKEN;
const appEnv = import.meta.env.VITE_APP_ENV;
const encryptionKey = import.meta.env.VITE_ENCRYPTION_KEY;
```

### Current Implementation
- Environment variables are currently used primarily for build-time configuration
- The application preserves all existing functionality with production values
- No code changes are required for environment-specific behavior

## Security Best Practices

### Development
1. **Never commit `.env` file**: Ensure it's in `.gitignore`
2. **Use development-safe values**: Avoid production credentials in development
3. **Regular updates**: Keep development environment in sync with production structure

### Production
1. **GitHub Secrets**: Store all sensitive values as repository secrets
2. **Minimal exposure**: Only expose necessary variables to the build process
3. **Access control**: Limit repository access to authorized personnel
4. **Audit trail**: Monitor secret usage through GitHub Actions logs

## Validation

### Development Validation
```bash
# Check if all required environment variables are set
npm run dev
# Application should start without environment variable errors
```

### Production Validation
1. **GitHub Actions**: Monitor workflow execution for environment variable loading
2. **Deployed application**: Verify API connectivity and functionality
3. **Browser console**: Check for any environment-related errors

## Troubleshooting

### Common Issues
1. **Missing variables**: Ensure all required secrets are configured in GitHub
2. **Incorrect values**: Verify secret values match expected format
3. **Build failures**: Check GitHub Actions logs for environment variable errors

### Debug Steps
1. **Local build test**: Run `npm run build` locally with production-like values
2. **GitHub Actions logs**: Review build step output for environment variable loading
3. **Deployed site**: Test functionality to ensure proper configuration

## Migration Notes

### From Development to Production
- All existing environment variables are preserved
- Only `VITE_APP_ENV` changes from `development` to `production`
- No application code changes required
- API endpoints and authentication remain the same

### Future Considerations
- Environment variables can be easily extended by adding to both `.env` and GitHub secrets
- Application code can be enhanced to use `VITE_APP_ENV` for environment-specific behavior
- Additional environments (staging, testing) can be configured using the same pattern