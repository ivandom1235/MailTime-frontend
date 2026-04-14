// frontend/src/services/api.js
export const API_BASE_URL = "https://mailtime-1klh.onrender.com";
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
  try {
    data = await res.json();
  } catch (error) {
    data = {};
  }

  if (!res.ok) {
    throw new Error(data.message || "Request failed");
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
