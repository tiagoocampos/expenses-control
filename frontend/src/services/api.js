import { apiClient } from "./apiClient";

const USER_ID_KEY = "userId";

function getUserId() {
  return localStorage.getItem(USER_ID_KEY);
}

export async function userRegister({ name, email, password }) {
  const data = await apiClient.post("/users", { name, email, password });
  localStorage.setItem(USER_ID_KEY, String(data.id));
  return data;
}

export async function getExpenses() {
  return apiClient.get(`/expenses?userId=${getUserId()}`);
}

export async function getTotalExpenses() {
  return apiClient.get(`/expenses/total?userId=${getUserId()}`);
}

export async function getCategories() {
  return apiClient.get("/categories");
}

export async function createCategory({ name }) {
  return apiClient.post("/categories", { name });
}

export async function getExpensesByCategory() {
  return apiClient.get(`/expenses/by-category?userId=${getUserId()}`);
}

export async function createExpense({ category_id, title, amount, date }) {
  return apiClient.post("/expenses", {
    userId: Number(getUserId()),
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
    userId: Number(getUserId()),
    categoryId: category_id,
    title,
    amount,
    date,
  });
}

