const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Request failed: ${res.status}`);
  }

  return res.json();
}

export const api = {
  // fetch direto via this api.js (bem simples)
  getExpenses: () => request("/expenses"),

  // payload esperado pelo backend:
  // { category_id, title, amount, date }
  createExpense: (payload) =>
    request("/expenses", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};


