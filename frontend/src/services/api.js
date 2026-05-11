
import { apiClient } from "./apiClient";

export async function getExpenses() {
  return apiClient.get("/expense");
}

export async function getTotalExpenses() {
  return apiClient.get("/expense/total");
}

export async function getCategories() {
  return apiClient.get("/categories");
}

export async function createCategory({ name }) {
  return apiClient.post("/categories", { name });
}

export async function getExpensesByCategory() {
  return apiClient.get("/expense/by-category");
}

export async function createExpense({ user_id, category_id, title, amount, date }) {
  return apiClient.post("/expense", {
    user_id,
    category_id,
    title,
    amount,
    date,
  });
}

export async function deleteExpense({ id }){
  return apiClient.delete(`/expense/delete-expense/${id}`);
}

export async function deleteCategory({ id }){
  return apiClient.delete(`/categories/delete-category/${id}`);
}


