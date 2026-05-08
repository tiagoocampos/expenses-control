import { Link } from "react-router-dom";
import { Card } from "../components/Card";
import { ExpenseList } from "../components/ExpenseList";
import { Header } from "../components/Header";
import { useEffect, useState } from "react";

export function ExpensesPage() {

    const [totalExpenses, setTotalExpenses] = useState(0);
    useEffect(() => {
        async function getTotalExpenses() {
            try {
                const res = await fetch("http://localhost:3000/expense/total");
                const data = await res.json();

                setTotalExpenses(data.total);
                console.log(data);
            } catch (error) {
                console.log(error);
                console.log("Erro ao calcular o total de gastos")
            }
        }
        getTotalExpenses();
    }, [])

    return (
        <div className="min-h-screen bg-gray-950 text-white">
            <Header />

            <div className="max-w-5xl mx-auto px-4 py-8">
                <div className="flex items-end justify-between gap-6 mb-6">
                    <div>
                        <h1 className="text-3xl font-bold">Gastos</h1>
                        <p className="text-gray-400">Acompanhe e gerencie todas as suas despesas</p>
                    </div>

                    <Link to="/despesas" className="bg-green-600 hover:bg-green-500 transition-colors px-4 py-2 rounded-lg font-medium">
                        + Adicionar despesa
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <Card>
                        <div className="text-gray-400">Total de gastos</div>
                        <div className="text-4xl font-bold mt-1 text-green-300">{new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(totalExpenses)}</div>
                    </Card>

                    <Card>
                        <div className="text-gray-400">Resumo</div>
                        <div className="mt-2 text-gray-200">Mock</div>
                    </Card>
                </div>

                <div className="bg-gray-900 rounded-xl shadow-sm p-4">
                    <ExpenseList />
                </div>
            </div>
        </div>
    );
}

