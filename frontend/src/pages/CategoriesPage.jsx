import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Card } from "../components/Card";
import { CreateCategoryModal } from "../components/CreateCategoryModal";
import { DeleteCategoryModal } from "../components/DeleteCategoryModal";
import { Header } from "../components/Header";
import {
    deleteExpense,
    getCategories,
    getExpenses,
    getExpensesByCategory,
} from "../services/api";

export function CategoriesPage() {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const [categoryList, setCategoryList] = useState([]);
    const [expensesByCategory, setExpensesByCategory] = useState([]);

    const [selectedCategoryId, setSelectedCategoryId] = useState(null);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);
    const [expensesCountToDelete, setExpensesCountToDelete] = useState(undefined);

    useEffect(() => {
        async function load() {
            try {
                const [categories, grouped] = await Promise.all([
                    getCategories(),
                    getExpensesByCategory(),
                ]);

                setCategoryList(categories);
                setExpensesByCategory(grouped);

                if (categories?.length > 0 && selectedCategoryId === null) {
                    setSelectedCategoryId(categories[0].id);
                }
            } catch (e) {
                console.log(e);
            }
        }

        async function loadExpenses() {
            try {
                const data = await getExpenses();
                console.log(data);
            } catch (error) {
                console.log(error);
            }
        }

        load();
        loadExpenses();
    }, []);

    async function deleteExpenseById(expenseId) {
        try {
            const data = await deleteExpense({ id: expenseId });
            toast.success(data?.message || "Gasto excluído com sucesso");

            const grouped = await getExpensesByCategory();
            setExpensesByCategory(grouped);
        } catch (error) {
            console.log(error);
            toast.error("Erro ao excluir gasto");
        }
    }

    const selectedCategory = categoryList.find(
        (c) => c.id === selectedCategoryId
    );

    const selectedCategoryExpenses = expensesByCategory.find(
        (category) => category.category_id === selectedCategoryId
    );

    async function refreshCategoriesAndExpenses() {
        try {
            const [categories, grouped] = await Promise.all([
                getCategories(),
                getExpensesByCategory(),
            ]);

            setCategoryList(categories);
            setExpensesByCategory(grouped);

            if (categories?.length > 0 && selectedCategoryId === null) {
                setSelectedCategoryId(categories[0].id);
            }
        } catch (error) {
            console.log(error);
        }
    }

    function openDeleteModal(category) {
        setCategoryToDelete(category);

        const count =
            expensesByCategory?.find((x) => x.category_id === category?.id)
                ?.expenses?.length ?? 0;

        setExpensesCountToDelete(count);
        setIsDeleteModalOpen(true);
    }

    return (
        <div className="min-h-screen bg-gray-950 text-white">
            <Header />

            <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8">
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
                    <div className="min-w-0">
                        <h1 className="text-2xl sm:text-3xl font-bold">Categorias</h1>
                        <p className="text-gray-400 text-sm sm:text-base">
                            Gerencie suas categorias e visualize os gastos de cada uma
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-green-600 hover:bg-green-500 transition-colors px-4 py-2 rounded-lg font-medium text-sm sm:text-base text-center"
                    >
                        + Nova categoria
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                    <Card>

                        <div className="mb-4">
                            <div className="text-gray-400 text-sm">Categorias</div>
                            <div className="text-gray-200 mt-1 text-sm">
                                Selecione para ver os gastos
                            </div>
                        </div>

                        <div className="max-h-80 overflow-y-auto pr-1 space-y-2">
                            {categoryList.map((c) => (
                                <button
                                    key={c.id}
                                    type="button"
                                    onClick={() => setSelectedCategoryId(c.id)}
                                    className={`w-full text-left border border-gray-800 hover:bg-gray-800 transition-colors rounded-xl p-3 ${c.id === selectedCategory?.id
                                        ? "bg-gray-800"
                                        : "bg-gray-900"
                                        }`}
                                >
                                    <div className="flex items-start justify-between gap-3">

                                        <div className="min-w-0">
                                            <div className="font-medium truncate">
                                                {c.name}
                                            </div>
                                            <div className="text-gray-400 text-xs mt-1">
                                                {expensesByCategory.find(
                                                    (x) => x.category_id === c.id
                                                )?.expenses?.length ?? 0}{" "}
                                                gastos
                                            </div>
                                        </div>


                                        <div className="flex flex-col gap-2 shrink-0 w-[110px]">
                                            <button
                                                type="button"
                                                className="w-full bg-blue-600 cursor-pointer hover:bg-blue-400 transition-colors px-2 py-1 rounded-lg text-xs"
                                            >
                                                Editar
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => openDeleteModal(c)}
                                                className="w-full bg-red-600 cursor-pointer hover:bg-red-400 transition-colors px-2 py-1 rounded-lg text-xs"
                                            >
                                                Excluir
                                            </button>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>

                        <div className="mt-4">
                            <Link
                                to="/"
                                className="text-gray-300 hover:text-white text-sm transition-colors"
                            >
                                ← Voltar para despesas
                            </Link>
                        </div>
                    </Card>


                    <div className="lg:col-span-2">
                        <Card>
                            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-4">
                                <div className="min-w-0">
                                    <div className="text-gray-400 text-sm">Gastos da categoria</div>
                                    <div className="text-lg sm:text-2xl font-bold mt-1 truncate">{selectedCategory?.name}</div>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left min-w-[520px]">

                                    <thead>
                                        <tr className="text-gray-400 text-sm">
                                            <th className="pb-2">Descrição</th>
                                            <th className="pb-2">Valor</th>
                                            <th className="pb-2">Data</th>
                                            <th className="pb-2">Ações</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {selectedCategoryExpenses?.expenses?.map((expense) => (
                                            <tr key={expense.id} className="border-b border-gray-700">
                                                <td className="py-3 pr-2">
                                                    <div className="max-w-[180px] sm:max-w-[220px] truncate">{expense.title}</div>
                                                </td>

                                                <td className="py-3 text-sm">R$ {expense.amount}</td>

                                                <td className="py-3 text-sm">
                                                    {new Date(expense.date).toLocaleDateString("pt-BR")}
                                                </td>

                                                <td className="py-3 text-sm">
                                                    <div className="flex gap-2">
                                                        <button className="bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded-lg text-xs sm:text-sm">
                                                            Editar
                                                        </button>

                                                        <button
                                                            onClick={() => deleteExpenseById(expense.id)}
                                                            className="bg-red-600 hover:bg-red-500 px-3 py-2 rounded-lg text-xs sm:text-sm"
                                                        >
                                                            Remover
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}

                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>

            <CreateCategoryModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />

            <DeleteCategoryModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                category={categoryToDelete}
                expensesCount={expensesCountToDelete}
                onDeleted={refreshCategoriesAndExpenses}
            />
        </div>
    );
}