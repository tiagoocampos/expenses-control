import { useEffect, useState } from "react";
import { CreateCategoryModal } from "./CreateCategoryModal";
import { Link } from "react-router-dom";
import { createExpense, getCategories } from "../services/api";

export function ExpenseForm() {

    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState(0);
    const [category, setCategory] = useState("");
    const [date, setDate] = useState("");
    const [categoryList, setCategoryList] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    function linkToCategories() {
        return (
            <Link to="/categories">Categories</Link>
        )
    }

    useEffect(() => {
        async function loadCategories() {
            const data = await getCategories();
            setCategoryList(data);
        }

        loadCategories();
    }, []);

    async function addExpense() {
        try {
            const data = await createExpense({
                user_id: 1,
                category_id: Number(category),
                title: title,
                amount: Number(amount),
                date: date,
            });

            alert(data.message);
        } catch (error) {
            console.log(error);
            alert("Erro ao salvar despesa");
        }
    }

    return (
        <>
            <form className="space-y-4">

                <div>

                    <label className="block text-sm text-gray-300 mb-1">
                        Descrição
                    </label>

                    <input
                        className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 outline-none focus:border-green-600"
                        placeholder="Ex: Mercado"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />

                </div>

                <div>

                    <label className="block text-sm text-gray-300 mb-1">
                        Valor
                    </label>

                    <div className="flex items-center">

                        <span className="bg-gray-900 border border-gray-800 rounded-l-lg px-3 py-2 text-gray-400">
                            R$
                        </span>

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

                    <label className="block text-sm text-gray-300 mb-1">
                        Categoria
                    </label>

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

                        <option value="">
                            Selecione uma categoria
                        </option>

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

                    <label className="block text-sm text-gray-300 mb-1">
                        Data
                    </label>

                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 outline-none focus:border-green-600"
                    />

                </div>

                <div>

                    <label className="block text-sm text-gray-300 mb-1">
                        Observação
                    </label>

                    <textarea
                        className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 outline-none focus:border-green-600 min-h-22.5"
                        placeholder="Opcional"
                    />

                </div>

                <div className="flex gap-3 pt-2">

                    <button
                        type="button"
                        className="flex-1 bg-gray-800 hover:bg-gray-700 transition-colors px-4 py-2 rounded-lg"
                    >
                        Cancelar
                    </button>

                    <button
                        onClick={addExpense}
                        type="button"
                        className="flex-1 bg-green-600 hover:bg-green-500 transition-colors px-4 py-2 rounded-lg font-medium"
                    >
                        Salvar despesa
                    </button>

                </div>

            </form>

            <CreateCategoryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
}