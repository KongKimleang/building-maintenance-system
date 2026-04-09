import toast from 'react-hot-toast';

/**
 * Utility functions for displaying toast notifications
 * Makes it easier to show consistent notifications throughout the app
 */

/**
 * Show a success notification
 * @param {string} message - The message to display
 * @param {object} options - Optional toast options
 */
export const showSuccess = (message, options = {}) => {
  return toast.success(message, {
    duration: 3000,
    position: 'top-right',
    icon: '✅',
    ...options,
  });
};

/**
 * Show an error notification
 * @param {string} message - The message to display
 * @param {object} options - Optional toast options
 */
export const showError = (message, options = {}) => {
  return toast.error(message, {
    duration: 4000,
    position: 'top-right',
    icon: '❌',
    ...options,
  });
};

/**
 * Show an info notification
 * @param {string} message - The message to display
 * @param {object} options - Optional toast options
 */
export const showInfo = (message, options = {}) => {
  return toast(message, {
    duration: 3000,
    position: 'top-right',
    icon: 'ℹ️',
    ...options,
  });
};

/**
 * Show a warning notification
 * @param {string} message - The message to display
 * @param {object} options - Optional toast options
 */
export const showWarning = (message, options = {}) => {
  return toast(message, {
    duration: 3000,
    position: 'top-right',
    icon: '⚠️',
    ...options,
  });
};

/**
 * Show a loading notification that can be updated or resolved
 * @param {string} message - The message to display
 * @returns {string} - Toast ID to update or resolve later
 */
export const showLoading = (message = 'Loading...') => {
  return toast.loading(message, {
    position: 'top-right',
  });
};

/**
 * Update an existing toast notification
 * @param {string} toastId - The ID of the toast to update
 * @param {string} message - The new message
 * @param {string} type - The type: 'success', 'error', 'info', or 'warning'
 */
export const updateToast = (toastId, message, type = 'info') => {
  const options = {
    duration: 3000,
    position: 'top-right',
  };

  if (type === 'success') {
    options.icon = '✅';
    toast.success(message, { id: toastId, ...options });
  } else if (type === 'error') {
    options.icon = '❌';
    options.duration = 4000;
    toast.error(message, { id: toastId, ...options });
  } else if (type === 'warning') {
    options.icon = '⚠️';
    toast(message, { id: toastId, ...options });
  } else {
    options.icon = 'ℹ️';
    toast(message, { id: toastId, ...options });
  }
};

/**
 * Dismiss all notifications
 */
export const dismissAll = () => {
  toast.remove();
};

export default {
  showSuccess,
  showError,
  showInfo,
  showWarning,
  showLoading,
  updateToast,
  dismissAll,
};
