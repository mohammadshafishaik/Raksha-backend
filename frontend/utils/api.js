// frontend/utils/api.js
// Central API configuration and helper utilities

// Backend base URL — update this if your backend URL changes.
// In development you can use your local IP address, e.g. 'http://192.168.1.12:5000'
// In production this points to the deployed URL.
export const BACKEND_BASE_URL =
  process.env.EXPO_PUBLIC_BACKEND_URL || 'http://localhost:5000';

/**
 * Makes an authenticated API request.
 * @param {string} path - API path (e.g. '/api/users/profile')
 * @param {string} method - HTTP method
 * @param {string|null} token - JWT auth token
 * @param {object|null} body - Request body (will be JSON-serialised)
 * @returns {Promise<{ok: boolean, status: number, data: any}>}
 */
export const apiRequest = async (path, method = 'GET', token = null, body = null) => {
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['x-auth-token'] = token;
  }

  const options = { method, headers };
  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${BACKEND_BASE_URL}${path}`, options);
  let data;
  try {
    data = await response.json();
  } catch {
    data = null;
  }
  return { ok: response.ok, status: response.status, data };
};
