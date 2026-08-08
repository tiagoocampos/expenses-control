const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const TOKEN_KEY = "token";

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function authHeaders(extraHeaders = {}) {
  const headers = { ...extraHeaders };
  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

async function request(path, { method = "GET", headers, body } = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body,
  });

  if (!res.ok) {
    let message = `Request failed with status ${res.status}`;
    try {
      const data = await res.json();
      message = data?.message || message;
    } catch (e) {
      message = message;
    }
    throw new Error(message);
  }

  return res.json();
}

export const apiClient = {
  get: (path) => request(path, { headers: authHeaders() }),
  post: (path, body) =>
    request(path, {
      method: "POST",
      headers: authHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify(body),
    }),
  patch: (path, body) =>
    request(path, {
      method: "PATCH",
      headers: authHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify(body),
    }),
  delete: (path) => request(path, { method: "DELETE", headers: authHeaders() }),
};
