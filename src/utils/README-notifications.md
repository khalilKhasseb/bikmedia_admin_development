# Notification and Error Handling System

This document explains how to use the new localized notification and error handling system in the bikmedia application.

## Overview

The notification system provides centralized, localized handling for:
- Toast notifications (success, error, warning, info)
- Confirmation dialogs
- Error messages from API calls
- Loading states

## Files

- `src/utils/notification-handler.js` - Main notification utilities
- `src/utils/error-handler.js` - API error handling with localization
- `src/services/api/base.service.js` - Updated with automatic error localization

## Basic Usage

### Toast Notifications

```javascript
import { showSuccessToast, showErrorToast, showWarningToast, showInfoToast } from '@/utils/notification-handler.js';

// Show success message
showSuccessToast('bikmedia.messages.success.created');

// Show error message
showErrorToast('bikmedia.messages.errors.network');

// Show with custom options
showSuccessToast('bikmedia.messages.success.saved', {
  timer: 5000,
  position: 'top'
});
```

### Confirmation Dialogs

```javascript
import { showConfirmDialog, showDeleteConfirmation } from '@/utils/notification-handler.js';

// Basic confirmation
const result = await showConfirmDialog({
  title: 'bikmedia.messages.confirmations.areYouSure',
  text: 'This action cannot be undone.'
});

if (result.isConfirmed) {
  // User confirmed
}

// Delete confirmation with item name
const result = await showDeleteConfirmation({
  itemName: 'Gift Name',
  itemType: 'gift'
});
```

### Bikmedia-Specific Helpers

```javascript
import { bikMediaNotifications } from '@/utils/notification-handler.js';

// Gift notifications
bikMediaNotifications.gift.created();
bikMediaNotifications.gift.updated();
bikMediaNotifications.gift.deleted();
bikMediaNotifications.gift.loadError();

// Equipment notifications
bikMediaNotifications.equipment.created();
bikMediaNotifications.equipment.confirmDelete('Equipment Name');

// Level notifications
bikMediaNotifications.level.created();

// General notifications
bikMediaNotifications.general.noChanges();
bikMediaNotifications.general.validationError();
```

## API Error Handling

The BaseService now automatically handles errors with localization:

```javascript
import equipmentService from '@/services/api/equipment.service';

try {
  const response = await equipmentService.get('/list');
} catch (error) {
  // Error is automatically localized
  console.log(error.localizedMessage); // Localized message
  console.log(error.originalMessage);  // Original error message
}
```

### Custom Error Handling

```javascript
import { handleApiError, translateError } from '@/utils/error-handler.js';

try {
  const response = await apiCall();
} catch (error) {
  // Get localized error message
  const localizedMessage = translateError(error, 'bikmedia.messages.errors.failedToLoad');
  
  // Or use the handler with custom options
  handleApiError(error, {
    fallbackKey: 'bikmedia.messages.errors.custom',
    onError: (error, message) => {
      console.log('Custom error handling:', message);
    }
  });
}
```

## Translation Keys

All notification messages use translation keys from the locale files:

### Success Messages
- `bikmedia.messages.success.created`
- `bikmedia.messages.success.updated`
- `bikmedia.messages.success.deleted`
- `bikmedia.messages.success.giftCreated`
- `bikmedia.messages.success.equipmentCreated`
- `bikmedia.messages.success.levelCreated`

### Error Messages
- `bikmedia.messages.errors.network`
- `bikmedia.messages.errors.server`
- `bikmedia.messages.errors.notFound`
- `bikmedia.messages.errors.unauthorized`
- `bikmedia.messages.errors.api.400` (Bad Request)
- `bikmedia.messages.errors.api.401` (Unauthorized)
- `bikmedia.messages.errors.api.403` (Forbidden)
- `bikmedia.messages.errors.api.404` (Not Found)
- `bikmedia.messages.errors.api.500` (Server Error)

### Confirmation Messages
- `bikmedia.messages.confirmations.areYouSure`
- `bikmedia.messages.confirmations.deleteGift`
- `bikmedia.messages.confirmations.deleteEquipment`
- `bikmedia.messages.confirmations.deleteLevel`
- `bikmedia.messages.confirmations.cannotUndo`

### Notification Messages
- `bikmedia.messages.notifications.noChanges`
- `bikmedia.messages.notifications.copySuccess`
- `bikmedia.messages.notifications.copyError`
- `bikmedia.messages.notifications.unsavedChanges`

## Migration from Old System

### Before (Old showMessage function)
```javascript
const showMessage = (msg, type = 'success') => {
  const toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
  });
  
  toast.fire({
    icon: type,
    title: msg
  });
};

showMessage('Success!', 'success');
showMessage('Error occurred', 'error');
```

### After (New system)
```javascript
import { showSuccessToast, showErrorToast } from '@/utils/notification-handler.js';

showSuccessToast('bikmedia.messages.success.created');
showErrorToast('bikmedia.messages.errors.network');
```

## Benefits

1. **Localization**: All messages are automatically translated based on user's language preference
2. **Consistency**: Standardized notification appearance and behavior across the application
3. **Maintainability**: Centralized notification logic makes updates easier
4. **Type Safety**: Specific functions for different notification types
5. **Fallback Support**: Graceful degradation when translations are missing
6. **API Integration**: Automatic error localization for API calls

## Best Practices

1. Always use translation keys instead of hardcoded messages
2. Use specific notification functions (`showSuccessToast`) instead of generic ones
3. Provide meaningful fallback keys for error handling
4. Use bikmedia-specific helpers when available
5. Test notifications in both English and Arabic languages