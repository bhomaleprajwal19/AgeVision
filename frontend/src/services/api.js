const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ;

async function resolveErrorMessage(response) {
  try {
    const data = await response.json();
    return data.detail || data.message || `Request failed with status ${response.status}`;
  } catch {
    return `Request failed with status ${response.status}`;
  }
}

/**
 * GET /health — used for the header's API status indicator.
 * Never throws a slow/hanging promise into the UI thread; callers should
 * treat any rejection as "offline".
 */
export async function checkHealth() {
  const response = await fetch(`${API_BASE_URL}/health`);
  if (!response.ok) {
    throw new Error(await resolveErrorMessage(response));
  }
  return response.json();
}

/**
 * POST /predict — sends the selected image as multipart/form-data under
 * the "file" field, matching the existing backend contract exactly.
 */
export async function predictImage(file) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/predict`, {
    method: 'POST',
    body: formData,
    // Do not set Content-Type manually — the browser sets the multipart
    // boundary automatically for FormData bodies.
  });

  if (!response.ok) {
    throw new Error(await resolveErrorMessage(response));
  }

  return response.json();
}

export { API_BASE_URL };
