import { useEffect, useState } from "react";
import { getExpenses } from "../services/api";

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

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[520px]">
                <thead>
                    <tr className="text-gray-400 text-xs sm:text-sm">
                        <th className="pb-2">Descrição</th>
                        <th className="pb-2">Valor</th>
                        <th className="pb-2">Categoria</th>
                        <th className="pb-2">Data</th>
                    </tr>
                </thead>

                <tbody>
                    {expenses.length === 0 ? (
                        <tr className="border-b border-gray-700">
                            <td className="py-3 text-gray-400 text-sm" colSpan={4}>
                                Nenhuma despesa cadastrada
                            </td>
                        </tr>
                    ) : (
                        expenses.map((expense) => (
                            <tr key={expense.id} className="border-b border-gray-700">
                                <td className="py-2 pr-2">
                                    <div className="max-w-[220px] sm:max-w-[260px] truncate">{expense.title || "Nenhuma despesa cadastrada"}</div>
                                </td>
                                <td className="py-2 text-sm">R$ {Number(expense.amount).toFixed(2).replace(".", ",")}</td>
                                <td className="py-2 text-sm">{expense.category_name}</td>
                                <td className="py-2 text-sm">{new Date(expense.date).toLocaleDateString("pt-BR")}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
