// frontend/src/services/apiClient.js

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

async function request(path, { method = "GET", headers, body } = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body,
  });

  if (!res.ok) {
    // tenta extrair mensagem do backend; senão, usa status
    let message = `Request failed with status ${res.status}`;
    try {
      const data = await res.json();
      message = data?.message || message;
    } catch (_) {
      // ignore
    }
    throw new Error(message);
  }

  return res.json();
}

export const apiClient = {
  get: (path) => request(path),
  post: (path, body) =>
    request(path, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }),
  delete: (path) => request(path, { method: "DELETE" }),
};






