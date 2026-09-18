export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];
export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

/**
 * Validates a File before it is sent to the backend, catching obvious
 * problems client-side so the user gets instant feedback.
 */
export function validateImageFile(file) {
  if (!file) {
    return { valid: false, reason: 'No image selected.' };
  }

  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return { valid: false, reason: 'Unsupported file type. Please upload a JPG or PNG image.' };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { valid: false, reason: 'Image is too large. Please upload a file under 10MB.' };
  }

  return { valid: true, reason: null };
}

/**
 * Formats a byte count into a short, human-readable string (e.g. "1.4 MB").
 */
export function formatFileSize(bytes) {
  if (!Number.isFinite(bytes)) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
