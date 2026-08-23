import { apiClient } from "./apiClient";

export async function userRegister({ name, email, password }) {
  return apiClient.post("/users", { name, email, password });
}

export async function userLogin({ email, password }) {
  return apiClient.post("/auth/login", { email, password });
}

export async function verifyEmail({ token }) {
  return apiClient.get(`/auth/verify-email?token=${token}`);
}

export async function getCategories() {
  return apiClient.get("/categories");
}

export async function createCategory({ name }) {
  return apiClient.post("/categories", { name });
}

export async function updateCategory({ id, name }) {
  return apiClient.patch(`/categories/${id}`, { name });
}

export async function deleteCategory({ id }) {
  return apiClient.delete(`/categories/${id}`);
}

export async function getExpenses() {
  return apiClient.get("/expenses");
}

export async function getTotalExpenses() {
  return apiClient.get("/expenses/total");
}

export async function getExpensesByCategory() {
  return apiClient.get("/expenses/by-category");
}

export async function createExpense({ category_id, title, amount, date, group_id }) {
  return apiClient.post("/expenses", {
    categoryId: category_id,
    title,
    amount,
    date,
    ...(group_id ? { groupId: group_id } : {}),
  });
}

export async function updateExpense({ id, category_id, title, amount, date }) {
  return apiClient.patch(`/expenses/${id}`, {
    categoryId: category_id,
    title,
    amount,
    date,
  });
}

export async function deleteExpense({ id }) {
  return apiClient.delete(`/expenses/${id}`);
}

export async function getIncomes() {
  return apiClient.get("/incomes");
}

export async function createIncome({ source, amount, receivedAt }) {
  return apiClient.post("/incomes", { source, amount, receivedAt });
}

export async function updateIncome({ id, source, amount, receivedAt }) {
  return apiClient.patch(`/incomes/${id}`, { source, amount, receivedAt });
}

export async function deleteIncome({ id }) {
  return apiClient.delete(`/incomes/${id}`);
}

export async function getUserById({ id }) {
  return apiClient.get(`/users/${id}`);
}

export async function getGroups() {
  return apiClient.get("/groups");
}

export async function getGroup({ id }) {
  return apiClient.get(`/groups/${id}`);
}

export async function getGroupExpenses({ id }) {
  return apiClient.get(`/groups/${id}/expenses`);
}

export async function joinGroupByCode({ shareCode }) {
  return apiClient.post("/groups/join", { shareCode });
}

export async function updateGroup({ id, name }) {
  return apiClient.patch(`/groups/${id}`, { name });
}

export async function leaveGroup({ groupId }) {
  return apiClient.delete(`/group-members/${groupId}`);
}