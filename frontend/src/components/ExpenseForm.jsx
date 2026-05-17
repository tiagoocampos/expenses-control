import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CreateCategoryModal } from "./CreateCategoryModal";
import { createExpense, getCategories } from "../services/api";

export function ExpenseForm() {
    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState(null);
    const [category, setCategory] = useState("");
    const [date, setDate] = useState("");
    const [categoryList, setCategoryList] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        async function loadCategories() {
            const data = await getCategories();
            setCategoryList(data);
        }
        loadCategories();
    }, []);

    async function addExpense() {
        if (!title || !amount || !category || !date) {
            toast.error("Preencha os campos corretamente");
            return;
        }

        try {
            const data = await createExpense({
                user_id: 1,
                category_id: Number(category),
                title,
                amount: Number(amount),
                date,
            });

            toast.success(data.message || "Despesa salva com sucesso");
        } catch (error) {
            console.log(error);
            toast.error("Erro ao salvar despesa");
            return;
        } finally {
            setTitle("");
            setAmount(0);
            setCategory("");
            setDate("");
        }
    }

    function clearForm() {
        setTitle("");
        setAmount(0);
        setCategory("");
        setDate("");
    }

    return (
        <>
            <form className="space-y-4">
                <div>
                    <label className="block text-sm text-gray-300 mb-1">Descrição</label>
                    <input
                        className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 outline-none focus:border-green-600"
                        placeholder="Ex: Mercado"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>

                <div>
                    <label className="block text-sm text-gray-300 mb-1">Valor</label>
                    <div className="flex items-center">
                        <span className="bg-gray-900 border border-gray-800 rounded-l-lg px-3 py-2 text-gray-400">R$</span>
                        <input
                            className="w-full bg-gray-950 border border-gray-800 border-l-0 rounded-r-lg px-3 py-2 outline-none focus:border-green-600"
                            placeholder="0,00"
                            inputMode="decimal"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm text-gray-300 mb-1">Categoria</label>
                    <select
                        value={category}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (value === "create") {
                                setIsModalOpen(true);
                                return;
                            }
                            setCategory(value);
                        }}
                        className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 outline-none focus:border-green-600"
                    >
                        <option value="">Selecione uma categoria</option>
                        {categoryList.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.name}
                            </option>
                        ))}
                        <option className="bg-green-500" value="create">
                            + Criar nova
                        </option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm text-gray-300 mb-1">Data</label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 outline-none focus:border-green-600"
                    />
                </div>

                <div>
                    <label className="block text-sm text-gray-300 mb-1">Observação</label>
                    <textarea
                        className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 outline-none focus:border-green-600 min-h-22.5"
                        placeholder="Opcional"
                    />
                </div>

                <div className="flex gap-3 pt-2">
                    <button
                        type="button"
                        onClick={clearForm}
                        className="flex-1 bg-gray-800 hover:bg-gray-700 transition-colors px-4 py-2 rounded-lg"
                    >
                        Cancelar
                    </button>

                    <button
                        type="button"
                        onClick={addExpense}
                        className="flex-1 bg-green-600 hover:bg-green-500 transition-colors px-4 py-2 rounded-lg font-medium"
                    >
                        Salvar despesa
                    </button>
                </div>
            </form>

            <CreateCategoryModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    (async () => {
                        try {
                            const data = await getCategories();
                            setCategoryList(data);
                        } catch (e) {
                            console.log(e);
                        }
                    })();
                }}
            />

        </>
    );
}

