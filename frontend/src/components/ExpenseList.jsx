import { useEffect, useState } from "react";

export function ExpenseList() {
    const [expenses, setExpenses] = useState([]);

    useEffect(() => {
        async function getExpenses() {
            try {
                const res = await fetch("http://localhost:3000/expense");
                const data = await res.json();
                setExpenses(data);
                console.log(data);
            } catch (error) {
                console.log(error, "Erro ao conectar");
            }
        }

        getExpenses();
    }, []);

    return (
        <div className="overflow-x-auto">
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
                            <td className="py-2">{expense.title}</td>
                            <td className="py-2">
                                R$ {Number(expense.amount).toFixed(2).replace(".", ",")}
                            </td>
                            <td className="py-2">{expense.category_name}</td>
                            <td className="py-2">
                                {new Date(expense.date).toLocaleDateString("pt-BR")}
                            </td>
                        </tr>
                    ))}
                </tbody>

            </table>
        </div>
    );
}