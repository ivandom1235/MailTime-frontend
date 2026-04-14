// frontend/src/services/api.js
const DEFAULT_API_BASE_URL = import.meta.env.DEV
  ? "http://localhost:5000"
  : "https://mailtime-1klh.onrender.com";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL;
export const BASE_URL = `${API_BASE_URL}/api`;

function getHeaders() {
  const token =
    localStorage.getItem("session_token") || localStorage.getItem("auth_token");

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function request(path, options = {}) {
  const { headers = {}, ...restOptions } = options;

  const res = await fetch(`${BASE_URL}${path}`, {
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
  } catch (error) {
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
