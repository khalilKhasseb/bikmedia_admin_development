/**
 * Notification Handler Utility
 * 
 * Provides centralized notification handling with localization support.
 * Handles SweetAlert dialogs, toast notifications, and confirmation dialogs.
 */

import i18n from '../i18n.js';

/**
 * Gets the translation function from i18n
 * @returns {Function} Translation function
 */
const getTranslationFunction = () => {
  return i18n.global.t;
};

/**
 * Default SweetAlert configuration for toast notifications
 */
const DEFAULT_TOAST_CONFIG = {
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', window.Swal.stopTimer);
    toast.addEventListener('mouseleave', window.Swal.resumeTimer);
  }
};

/**
 * Default SweetAlert configuration for confirmation dialogs
 */
const DEFAULT_CONFIRM_CONFIG = {
  showCancelButton: true,
  confirmButtonColor: '#3085d6',
  cancelButtonColor: '#d33',
  reverseButtons: true,
  focusCancel: true
};

/**
 * Shows a toast notification with localized message
 * 
 * @param {string|Object} message - Message key or object with key and params
 * @param {string} type - Notification type ('success', 'error', 'warning', 'info')
 * @param {Object} options - Additional SweetAlert options
 * @returns {Promise} SweetAlert promise
 */
export const showToast = (message, type = 'success', options = {}) => {
  const t = getTranslationFunction();
  
  // Handle message translation
  let translatedMessage;
  if (typeof message === 'object' && message.key) {
    translatedMessage = t(message.key, message.params || {});
  } else {
    translatedMessage = typeof message === 'string' && message.includes('.') 
      ? t(message) 
      : message;
  }
  
  const config = {
    ...DEFAULT_TOAST_CONFIG,
    icon: type,
    title: translatedMessage,
    ...options
  };
  
  return window.Swal.fire(config);
};

/**
 * Shows a success toast notification
 * 
 * @param {string|Object} message - Message key or object with key and params
 * @param {Object} options - Additional SweetAlert options
 * @returns {Promise} SweetAlert promise
 */
export const showSuccessToast = (message, options = {}) => {
  return showToast(message, 'success', options);
};

/**
 * Shows an error toast notification
 * 
 * @param {string|Object} message - Message key or object with key and params
 * @param {Object} options - Additional SweetAlert options
 * @returns {Promise} SweetAlert promise
 */
export const showErrorToast = (message, options = {}) => {
  return showToast(message, 'error', options);
};

/**
 * Shows a warning toast notification
 * 
 * @param {string|Object} message - Message key or object with key and params
 * @param {Object} options - Additional SweetAlert options
 * @returns {Promise} SweetAlert promise
 */
export const showWarningToast = (message, options = {}) => {
  return showToast(message, 'warning', options);
};

/**
 * Shows an info toast notification
 * 
 * @param {string|Object} message - Message key or object with key and params
 * @param {Object} options - Additional SweetAlert options
 * @returns {Promise} SweetAlert promise
 */
export const showInfoToast = (message, options = {}) => {
  return showToast(message, 'info', options);
};

/**
 * Shows a confirmation dialog with localized messages
 * 
 * @param {Object} config - Configuration object
 * @param {string|Object} config.title - Title message key or object
 * @param {string|Object} config.text - Text message key or object
 * @param {string|Object} config.html - HTML content (overrides text)
 * @param {string|Object} config.confirmButtonText - Confirm button text key or object
 * @param {string|Object} config.cancelButtonText - Cancel button text key or object
 * @param {Object} config.options - Additional SweetAlert options
 * @returns {Promise} SweetAlert promise
 */
export const showConfirmDialog = (config = {}) => {
  const t = getTranslationFunction();
  
  const translateMessage = (message) => {
    if (typeof message === 'object' && message.key) {
      return t(message.key, message.params || {});
    }
    return typeof message === 'string' && message.includes('.') 
      ? t(message) 
      : message;
  };
  
  const {
    title = 'bikmedia.messages.confirmations.areYouSure',
    text,
    html,
    confirmButtonText = 'bikmedia.actions.confirm',
    cancelButtonText = 'bikmedia.actions.cancel',
    options = {}
  } = config;
  
  const swalConfig = {
    ...DEFAULT_CONFIRM_CONFIG,
    title: translateMessage(title),
    confirmButtonText: translateMessage(confirmButtonText),
    cancelButtonText: translateMessage(cancelButtonText),
    ...options
  };
  
  if (html) {
    swalConfig.html = translateMessage(html);
  } else if (text) {
    swalConfig.text = translateMessage(text);
  }
  
  return window.Swal.fire(swalConfig);
};

/**
 * Shows a delete confirmation dialog
 * 
 * @param {Object} config - Configuration object
 * @param {string} itemName - Name of the item to delete
 * @param {string} itemType - Type of item ('gift', 'equipment', 'level')
 * @param {Object} options - Additional options
 * @returns {Promise} SweetAlert promise
 */
export const showDeleteConfirmation = (config = {}) => {
  const t = getTranslationFunction();
  const {
    itemName = '',
    itemType = '',
    options = {}
  } = config;
  
  // Build title based on item type
  let titleKey = 'bikmedia.messages.confirmations.delete';
  if (itemType) {
    titleKey = `bikmedia.messages.confirmations.delete${itemType.charAt(0).toUpperCase() + itemType.slice(1)}`;
  }
  
  // Build HTML content with item name
  const htmlContent = itemName 
    ? `<div class="text-center mb-3">
         <h4 class="mb-3">${itemName}</h4>
         <p class="text-muted">${t('bikmedia.messages.confirmations.cannotUndo')}</p>
       </div>`
    : `<p class="text-muted">${t('bikmedia.messages.confirmations.cannotUndo')}</p>`;
  
  return showConfirmDialog({
    title: titleKey,
    html: htmlContent,
    confirmButtonText: 'bikmedia.actions.delete',
    options: {
      icon: 'warning',
      confirmButtonColor: '#d33',
      ...options
    }
  });
};

/**
 * Shows a loading dialog with localized message
 * 
 * @param {string|Object} message - Loading message key or object
 * @param {Object} options - Additional SweetAlert options
 * @returns {void}
 */
export const showLoadingDialog = (message = 'bikmedia.messages.loading', options = {}) => {
  const t = getTranslationFunction();
  
  const translatedMessage = typeof message === 'object' && message.key
    ? t(message.key, message.params || {})
    : (typeof message === 'string' && message.includes('.') ? t(message) : message);
  
  window.Swal.fire({
    title: translatedMessage,
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    didOpen: () => {
      window.Swal.showLoading();
    },
    ...options
  });
};

/**
 * Closes any open SweetAlert dialog
 */
export const closeDialog = () => {
  window.Swal.close();
};

/**
 * Bikmedia-specific notification helpers
 */
export const bikMediaNotifications = {
  /**
   * Gift-related notifications
   */
  gift: {
    created: () => showSuccessToast('bikmedia.messages.success.giftCreated'),
    updated: () => showSuccessToast('bikmedia.messages.success.giftUpdated'),
    deleted: () => showSuccessToast('bikmedia.messages.success.giftDeleted'),
    loadError: () => showErrorToast('bikmedia.messages.errors.loadGifts'),
    createError: () => showErrorToast('bikmedia.messages.errors.failedToCreate'),
    updateError: () => showErrorToast('bikmedia.messages.errors.failedToUpdate'),
    deleteError: () => showErrorToast('bikmedia.messages.errors.failedToDelete'),
    confirmDelete: (giftName) => showDeleteConfirmation({
      itemName: giftName,
      itemType: 'gift'
    })
  },
  
  /**
   * Equipment-related notifications
   */
  equipment: {
    created: () => showSuccessToast('bikmedia.messages.success.equipmentCreated'),
    updated: () => showSuccessToast('bikmedia.messages.success.equipmentUpdated'),
    deleted: () => showSuccessToast('bikmedia.messages.success.equipmentDeleted'),
    loadError: () => showErrorToast('bikmedia.messages.errors.loadEquipment'),
    createError: () => showErrorToast('bikmedia.messages.errors.failedToCreate'),
    updateError: () => showErrorToast('bikmedia.messages.errors.failedToUpdate'),
    deleteError: () => showErrorToast('bikmedia.messages.errors.failedToDelete'),
    confirmDelete: (equipmentName) => showDeleteConfirmation({
      itemName: equipmentName,
      itemType: 'equipment'
    })
  },
  
  /**
   * Level-related notifications
   */
  level: {
    created: () => showSuccessToast('bikmedia.messages.success.levelCreated'),
    updated: () => showSuccessToast('bikmedia.messages.success.levelUpdated'),
    deleted: () => showSuccessToast('bikmedia.messages.success.levelDeleted'),
    loadError: () => showErrorToast('bikmedia.messages.errors.loadLevels'),
    createError: () => showErrorToast('bikmedia.messages.errors.failedToCreate'),
    updateError: () => showErrorToast('bikmedia.messages.errors.failedToUpdate'),
    deleteError: () => showErrorToast('bikmedia.messages.errors.failedToDelete'),
    confirmDelete: (levelName) => showDeleteConfirmation({
      itemName: levelName,
      itemType: 'level'
    })
  },
  
  /**
   * General notifications
   */
  general: {
    success: (message) => showSuccessToast(message),
    error: (message) => showErrorToast(message),
    warning: (message) => showWarningToast(message),
    info: (message) => showInfoToast(message),
    noChanges: () => showInfoToast('No changes to update'),
    invalidId: (type) => showErrorToast(`bikmedia.messages.errors.invalid${type.charAt(0).toUpperCase() + type.slice(1)}Id`),
    validationError: () => showErrorToast('bikmedia.forms.validation.required'),
    copySuccess: () => showSuccessToast('Link copied to clipboard!'),
    copyError: () => showErrorToast('Failed to copy link'),
    unsavedChanges: () => showConfirmDialog({
      title: 'bikmedia.messages.confirmations.areYouSure',
      text: 'You have unsaved changes. Are you sure you want to leave?',
      confirmButtonText: 'bikmedia.actions.confirm',
      cancelButtonText: 'bikmedia.actions.cancel'
    })
  }
};

/**
 * Legacy compatibility function for existing code
 * @deprecated Use specific notification functions instead
 */
export const showMessage = (message, type = 'success', options = {}) => {
  return showToast(message, type, options);
};

export default {
  showToast,
  showSuccessToast,
  showErrorToast,
  showWarningToast,
  showInfoToast,
  showConfirmDialog,
  showDeleteConfirmation,
  showLoadingDialog,
  closeDialog,
  bikMediaNotifications,
  showMessage // Legacy compatibility
};