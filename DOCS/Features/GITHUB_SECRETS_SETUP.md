# GitHub Repository Secrets Setup

This document provides instructions for setting up GitHub repository secrets required for the automated deployment to GitHub Pages.

## Required Secrets

The following environment variables must be configured as GitHub repository secrets:

### 1. VITE_BASE_API_URL
- **Value**: `bikmedia.com/dashboard/`
- **Description**: Base API URL for the application
- **Type**: Public (can be exposed in client-side code)

### 2. VITE_API_KEY
- **Value**: `q25etr-as568-er9855-85rtg-45g56`
- **Description**: API key for authentication
- **Type**: Sensitive (should be kept secure)

### 3. VITE_AUTH_TOKEN
- **Value**: `dZaMZ423sb0Nv6TtlbwoD2oKR7`
- **Description**: Authentication token for API access
- **Type**: Sensitive (should be kept secure)

### 4. VITE_ENCRYPTION_KEY
- **Value**: `bikmedia-dev-key-2025`
- **Description**: Encryption passphrase for client-side token obfuscation
- **Type**: Sensitive (should be kept secure)

## Setup Instructions

### Step 1: Access Repository Settings
1. Navigate to your GitHub repository: `https://github.com/bikmedia/bikmedia_admin`
2. Click on the "Settings" tab
3. In the left sidebar, click on "Secrets and variables" → "Actions"

### Step 2: Add Repository Secrets
For each secret listed above:

1. Click "New repository secret"
2. Enter the secret name (e.g., `VITE_BASE_API_URL`)
3. Enter the corresponding value
4. Click "Add secret"

### Step 3: Verify Secret Configuration
After adding all secrets, you should see the following secrets listed:
- `VITE_BASE_API_URL`
- `VITE_API_KEY`
- `VITE_AUTH_TOKEN`
- `VITE_ENCRYPTION_KEY`

## Security Considerations

### Sensitive Values
- **VITE_API_KEY**: Contains authentication credentials
- **VITE_AUTH_TOKEN**: Contains access tokens
- **VITE_ENCRYPTION_KEY**: Used for client-side encryption

### Best Practices
1. **Regular Rotation**: Rotate API keys and tokens periodically
2. **Minimal Permissions**: Ensure tokens have only necessary permissions
3. **Access Control**: Limit repository access to authorized personnel
4. **Audit Trail**: Monitor secret usage through GitHub Actions logs

### Important Notes
- GitHub Secrets are encrypted and only accessible during workflow execution
- Secret values are masked in workflow logs for security
- Once added, secret values cannot be viewed, only updated or deleted
- The `VITE_APP_ENV` variable is set to `production` directly in the workflow and doesn't need to be a secret

## Troubleshooting

### Common Issues
1. **Missing Secrets**: If deployment fails with environment variable errors, verify all secrets are properly configured
2. **Incorrect Values**: Double-check secret values match your development environment
3. **Permissions**: Ensure the repository has proper permissions for GitHub Pages deployment

### Verification
After setting up secrets, trigger a deployment by:
1. Pushing code to the main branch, or
2. Manually triggering the workflow from the Actions tab

Monitor the workflow execution to ensure all environment variables are properly loaded during the build process.