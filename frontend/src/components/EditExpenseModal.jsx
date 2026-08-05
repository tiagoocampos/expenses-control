import { useMemo, useState, useEffect } from "react";
import { toast } from "sonner";
import { updateExpense } from "../services/api.js";


export function EditExpenseModal({ isOpen, onClose, expense }) {
    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");
    const [date, setDate] = useState("");

    const initialFields = useMemo(() => {
        const nextTitle = expense?.title ?? "";
        const nextAmount = expense?.amount ?? "";

        let nextDate = "";
        if (expense?.date) {
            const d = new Date(expense.date);
            const yyyy = d.getFullYear();
            const mm = String(d.getMonth() + 1).padStart(2, "0");
            const dd = String(d.getDate()).padStart(2, "0");
            nextDate = `${yyyy}-${mm}-${dd}`;
        }

        return {
            title: nextTitle,
            amount: nextAmount,
            date: nextDate,
        };
    }, [expense]);

    useEffect(() => {
        if (!isOpen) return;

        setTitle(initialFields.title);
        setAmount(initialFields.amount);
        setDate(initialFields.date);
    }, [isOpen, initialFields]);

    function handleClose() {
        onClose?.();
    }

    async function handleSave() {
        // Estrutura/validação visual (sem API, você conecta depois)
        if (!expense?.id) {
            toast.error("Gasto inválido para edição");
            return;
        }

        if (!title) {
            toast.error("Informe a descrição");
            return;
        }

        if (amount === "" || Number.isNaN(Number(amount))) {
            toast.error("Informe o valor");
            return;
        }

        if (!date) {
            toast.error("Informe a data");
            return;
        }
        const data = await updateExpense({
            id: expense.id,
            title,
            amount,
            date
        })
        // Placeholder: você implementa o consumo da API depois
        // await updateExpense({ id: expense.id, title, amount, date })
        // onClose();
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-5 gap-3">
                    <h2 className="text-lg sm:text-xl font-semibold text-white">
                        Editar gasto
                    </h2>

                    <button
                        type="button"
                        onClick={handleClose}
                        className="text-gray-400 hover:text-white transition-colors p-2 -m-2 rounded-lg"
                        aria-label="Fechar"
                    >
                        ✕
                    </button>
                </div>

                <div className="space-y-4">
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
                        <label className="block text-sm text-gray-300 mb-1">Valor</label>
                        <input
                            className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 outline-none focus:border-green-600"
                            placeholder="0.00"
                            type="number"
                            step="0.01"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-300 mb-1">Data</label>
                        <input
                            className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 outline-none focus:border-green-600"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex-1 bg-gray-800 hover:bg-gray-700 transition-colors px-4 py-2 rounded-lg"
                        >
                            Cancelar
                        </button>

                        <button
                            type="button"
                            onClick={handleSave}
                            className="flex-1 bg-green-600 hover:bg-green-500 transition-colors px-4 py-2 rounded-lg font-medium"
                        >
                            Salvar alterações
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

