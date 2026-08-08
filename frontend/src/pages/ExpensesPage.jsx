import { Link } from "react-router-dom";
import { Card } from "../components/Card";
import { ExpenseList } from "../components/ExpenseList";
import { Header } from "../components/Header";
import { useEffect, useState } from "react";
import { getTotalExpenses } from "../services/api";
import { ExpensesChart } from "../components/ExpensesChart";

export function ExpensesPage() {
    const [totalExpenses, setTotalExpenses] = useState(0);

    const isAuthenticated = !!localStorage.getItem("token");

    useEffect(() => {
        async function load() {
            try {
                const data = await getTotalExpenses();
                setTotalExpenses(data.total);
            } catch (error) {
                console.log(error);
                console.log("Erro ao calcular o total de gastos");
            }
        }
        load();
    }, []);

    return (
        <div className="min-h-screen bg-gray-950 text-white">
            <Header />

            <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8">
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
                    <div className="min-w-0">
                        <h1 className="text-2xl sm:text-3xl font-bold">Gastos</h1>
                        <p className="text-gray-400 text-sm sm:text-base">Acompanhe e gerencie todas as suas despesas</p>
                    </div>

                    <Link
                        to={isAuthenticated ? "/despesas" : "/login"}
                        className="bg-green-600 hover:bg-green-500 transition-colors px-4 py-2 rounded-lg font-medium text-sm sm:text-base text-center"
                    >
                        + Adicionar despesa
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                    <div className="lg:col-span-1">
                        <Card>
                            <div className="text-gray-400 text-sm">Total de gastos</div>
                            <div className="text-3xl sm:text-4xl font-bold mt-1 text-green-300 break-words">
                                {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(totalExpenses)}
                            </div>
                        </Card>
                    </div>

                    <div className="lg:col-span-2">
                        <ExpensesChart />
                    </div>
                </div>

                <div className="bg-gray-900 rounded-xl shadow-sm p-3 sm:p-4">
                    <ExpenseList />
                </div>
            </div>

        </div>
    );
}



