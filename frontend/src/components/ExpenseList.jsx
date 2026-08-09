import { useEffect, useState } from "react";
import { getExpenses } from "../services/api";

function formatBRL(value) {
    return `R$ ${Number(value).toFixed(2).replace(".", ",")}`;
}

function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString("pt-BR");
}

export function ExpenseList() {
    const [expenses, setExpenses] = useState([]);

    useEffect(() => {
        async function load() {
            try {
                const data = await getExpenses();
                setExpenses(data);
            } catch (error) {
                console.log(error, "Erro ao conectar");
            }
        }

        load();
    }, []);

    if (expenses.length === 0) {
        return (
            <div className="py-3 text-gray-400 text-sm">
                Nenhuma despesa cadastrada
            </div>
        );
    }

    return (
        <>
            {/* Mobile: cards empilhados, sem scroll lateral */}
            <div className="sm:hidden space-y-2">
                {expenses.map((expense) => (
                    <div
                        key={expense.id}
                        className="border border-gray-800 rounded-xl p-3"
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                                <div className="font-medium text-sm truncate">
                                    {expense.title || "Sem descrição"}
                                </div>
                                <div className="text-gray-400 text-xs mt-1">
                                    {expense.category?.name || "Sem categoria"}
                                </div>
                            </div>
                            <div className="text-right shrink-0">
                                <div className="text-sm font-semibold">
                                    {formatBRL(expense.amount)}
                                </div>
                                <div className="text-gray-400 text-xs mt-1">
                                    {formatDate(expense.date)}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Desktop/tablet: tabela normal */}
            <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="text-gray-400 text-sm">
                            <th className="pb-2">Descrição</th>
                            <th className="pb-2">Valor</th>
                            <th className="pb-2">Categoria</th>
                            <th className="pb-2">Data</th>
                        </tr>
                    </thead>

                    <tbody>
                        {expenses.map((expense) => (
                            <tr key={expense.id} className="border-b border-gray-700">
                                <td className="py-2 pr-2">
                                    <div className="max-w-65 truncate">
                                        {expense.title || "Sem descrição"}
                                    </div>
                                </td>
                                <td className="py-2 text-sm">{formatBRL(expense.amount)}</td>
                                <td className="py-2 text-sm">{expense.category?.name || "—"}</td>
                                <td className="py-2 text-sm">{formatDate(expense.date)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}