import { Link } from "react-router-dom";
import { Card } from "../components/Card";
import { ExpenseForm } from "../components/ExpenseForm";
import { Header } from "../components/Header";

export function AddExpensePage() {
    return (
        <div className="min-h-screen bg-gray-950 text-white">
            <Header />

            <div className="max-w-2xl mx-auto px-4 py-6 sm:py-8">
                <div className="mb-5">
                    <Link to="/" className="text-gray-300 hover:text-white">← Voltar</Link>
                </div>

                <h1 className="text-2xl sm:text-3xl font-bold mb-2">Adicionar despesa</h1>
                <p className="text-gray-400 text-sm sm:text-base mb-6">Preencha os dados para salvar no seu controle</p>

                <Card>
                    <ExpenseForm />
                </Card>
            </div>
        </div>

    );
}

