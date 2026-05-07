// services/api.js

export async function getExpenses() {
    const res = await fetch("http://localhost:3000/expenses");

    if (!res.ok) {
        throw new Error("Erro ao buscar despesas");
    }

    return res.json();
}