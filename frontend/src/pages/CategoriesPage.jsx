import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "../components/Card";
import { CreateCategoryModal } from "../components/CreateCategoryModal";
import { Header } from "../components/Header";
import { deleteCategory, deleteExpense, getCategories, getExpenses, getExpensesByCategory } from "../services/api";

export function CategoriesPage() {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [id, setId] = useState(null);

    const [categoryList, setCategoryList] = useState([]);
    const [expensesByCategory, setExpensesByCategory] = useState([]);

    const [selectedCategoryId, setSelectedCategoryId] = useState(null);

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
                setId(data[0].id);
                console.log(data)
            } catch (error) {
                console.log(error);
                console.log("Erro ao buscar gastos")
            }
        }

        load();
        loadExpenses();
    }, []);

    async function deleteExpenseById(expenseId) {

        try {
            const data = await deleteExpense({ id: expenseId });
            alert(data?.message || "Gasto excluído com sucesso")

            const grouped = await getExpensesByCategory();
            setExpensesByCategory(grouped);
        } catch (error) {
            console.log(error);
            alert("Erro ao excluir gasto")
        }
    }





    const selectedCategory = categoryList.find((c) => c.id === selectedCategoryId);

    async function deleteCategoryById(categoryId) {
        try {
            const data = await deleteCategory({ id: categoryId });
            alert(data?.message || "Categoria excluída com sucesso");
            const categories = await getCategories();
            setCategoryList(categories)

            const grouped = await getExpensesByCategory();
            setExpensesByCategory(grouped)

            if (selectedCategoryId === categoryId) {
                setSelectedCategoryId(categories?.[0]?.id ?? null)
            }

        } catch (error) {
            console.log(error);
            alert("Erro ao deletar categoria")
        }
    }

    const selectedCategoryExpenses = expensesByCategory.find((category) => category.category_id === selectedCategoryId);
    return (
        <div className="min-h-screen bg-gray-950 text-white">
            <Header />

            <div className="max-w-5xl mx-auto px-4 py-8">
                <div className="flex items-end justify-between gap-6 mb-6">
                    <div>
                        <h1 className="text-3xl font-bold">Categorias</h1>
                        <p className="text-gray-400">Gerencie suas categorias e visualize os gastos de cada uma</p>
                    </div>

                    <button
                        type="button"
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-green-600 hover:bg-green-500 transition-colors px-4 py-2 rounded-lg font-medium"
                    >
                        + Nova categoria
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                    <Card>
                        <div className="mb-4">
                            <div className="text-gray-400 text-sm">Categorias</div>
                            <div className="text-gray-200 mt-1 text-sm">Selecione para ver os gastos</div>
                        </div>

                        <div className="space-y-2 ">
                            <div className="max-h-80 overflow-y-auto pr-1 py-2">
                                <div className="space-y-2">
                                    {categoryList.map((c) => (



                                        <button
                                            key={c.id}
                                            type="button"
                                            onClick={() => setSelectedCategoryId(c.id)}
                                            className={
                                                "w-full text-left cursor-pointer bg-gray-900 border border-gray-800 hover:bg-gray-800 transition-colors rounded-xl p-3" +
                                                (c.id === selectedCategory?.id
                                                    ? " bg-green-950"
                                                    : "")
                                            }
                                        >
                                            <div className="flex items-start justify-between  gap-3">
                                                <div>
                                                    <div className="font-medium">{c.name}</div>
                                                    <div className="text-gray-400 text-xs mt-1">
                                                        {expensesByCategory.find((x) => x.category_id === c.id)?.expenses?.length ?? 0} gastos
                                                    </div>

                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        type="button"
                                                        className="bg-gray-800 hover:bg-gray-700 transition-colors px-2 py-1 rounded-lg text-xs"
                                                    >
                                                        Editar
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => deleteCategoryById(c.id)}
                                                        className="bg-red-600 hover:bg-red-500 transition-colors px-2 py-1 rounded-lg text-xs"
                                                    >
                                                        Excluir categoria
                                                    </button>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="mt-4">
                            <Link to="/" className="text-gray-300 hover:text-white text-sm transition-colors">
                                ← Voltar para despesas
                            </Link>
                        </div>
                    </Card>

                    {/* Coluna: gastos da categoria */}
                    <div className="lg:col-span-2">
                        <Card>
                            <div className="flex items-end justify-between gap-4 mb-4">
                                <div>
                                    <div className="text-gray-400 text-sm">Gastos da categoria</div>
                                    <div className="text-2xl font-bold mt-1">{selectedCategory?.name}</div>
                                </div>

                                <div className="text-sm text-gray-400">
                                    {/* Placeholder de contagem depois */}
                                    {/* Ex: 12 lançamentos */}
                                    —
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="text-gray-400 text-sm">
                                            <th className="pb-2">Descrição</th>
                                            <th className="pb-2">Valor</th>
                                            <th className="pb-2">Data</th>
                                            <th className="pb-2">Ações</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {/* Layout (placeholders). Renderize as despesas filtradas por categoria depois. */}
                                        {selectedCategoryExpenses?.expenses.map((expense) => (
                                            <tr
                                                key={expense.id}
                                                className="border-b border-gray-700"
                                            >
                                                <td className="py-3">
                                                    {expense.title}
                                                </td>

                                                <td className="py-3">
                                                    R$ {expense.amount}
                                                </td>

                                                <td className="py-3">
                                                    {new Date(expense.date).toLocaleDateString("pt-BR")}
                                                </td>

                                                <td className="py-3">
                                                    <div className="flex gap-2">
                                                        <button
                                                            type="button"
                                                            className="bg-gray-800 hover:bg-gray-700 transition-colors px-3 py-1.5 rounded-lg text-sm"
                                                        >
                                                            Editar
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() => deleteExpenseById(expense.id)}
                                                            className="bg-red-600 hover:bg-red-500 transition-colors px-3 py-1.5 rounded-lg text-sm"
                                                        >
                                                            Remover
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <div className="mt-4 text-gray-400 text-sm">
                                {/* Placeholder: se não houver gastos, mostrar mensagem depois. */}
                                —
                            </div>
                        </Card>
                    </div>
                </div>
            </div >

            <CreateCategoryModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />
        </div >
    );
}

