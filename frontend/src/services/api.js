import { apiClient } from "./apiClient";



export async function userRegister({ name, email, password }) {
  return apiClient.post("/users", { name, email, password });
}

export async function userLogin({ email, password }) {
  return apiClient.post("/auth/login", { email, password });
}




export async function getExpenses() {
  return apiClient.get("/expenses");
}

export async function getTotalExpenses() {
  return apiClient.get("/expenses/total");
}

export async function getCategories() {
  return apiClient.get("/categories");
}

export async function createCategory({ name }) {
  return apiClient.post("/categories", { name });
}

export async function getExpensesByCategory() {
  return apiClient.get("/expenses/by-category");
}

export async function createExpense({ category_id, title, amount, date }) {
  return apiClient.post("/expenses", {
    categoryId: category_id,
    title,
    amount,
    date,
  });
}

export async function deleteExpense({ id }) {
  return apiClient.delete(`/expenses/${id}`);
}

export async function deleteCategory({ id }) {
  return apiClient.delete(`/categories/${id}`);
}

export async function updateCategory({ id, name }) {
  return apiClient.patch(`/categories/${id}`, { name });
}

export async function updateExpense({ id, category_id, title, amount, date }) {
  return apiClient.patch(`/expenses/${id}`, {
    categoryId: category_id,
    title,
    amount,
    date,
  });
}

