import { getSessionToken, clearSession } from './session';
// frontend/src/services/api.js
const DEFAULT_API_BASE_URL = import.meta.env.DEV
  ? "http://localhost:5000"
  : "https://mailtime-sj1m.onrender.com";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL;
export const BASE_URL = `${API_BASE_URL}/api`;

export function getHeaders() {
  const token = getSessionToken();

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function authFetch(url, options = {}) {
  if (new URL(url).origin !== new URL(API_BASE_URL).origin) throw new Error('Untrusted API origin');
  const response = await fetch(url, { ...options, signal: options.signal || AbortSignal.timeout(20000),
    headers: { ...getHeaders(), ...options.headers } });
  if (response.status === 401 && getSessionToken()) {
    clearSession();
    window.location.assign('/login');
  }
  return response;
}
export async function logout() {
  if (getSessionToken()) await request('/auth/logout', { method: 'POST', body: '{}' });
  clearSession();
}

async function request(path, options = {}) {
  const { headers = {}, ...restOptions } = options;

  const res = await authFetch(`${BASE_URL}${path}`, {
    ...restOptions,
    headers: {
      ...getHeaders(),
      ...headers,
    },
  });

  let data = {};
  let responseText = "";
  try {
    responseText = await res.text();
    data = responseText ? JSON.parse(responseText) : {};
  } catch {
    data = {};
  }

  if (!res.ok) {
    const fallbackMessage = responseText
      ? responseText.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()
      : "";
    const message = data.message || fallbackMessage || `Request failed with status ${res.status}`;

    throw new Error(message);
  }

  return data;
}

const api = {
  get: (path, options = {}) =>
    request(path, {
      method: "GET",
      ...options,
    }),

  post: (path, body, options = {}) =>
    request(path, {
      ...options,
      method: "POST",
      body: JSON.stringify(body),
    }),

  put: (path, body, options = {}) =>
    request(path, {
      ...options,
      method: "PUT",
      body: JSON.stringify(body),
    }),

  delete: (path, options = {}) =>
    request(path, {
      method: "DELETE",
      ...options,
    }),
};

export default api;
