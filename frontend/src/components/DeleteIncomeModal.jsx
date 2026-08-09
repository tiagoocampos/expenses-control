import { useState } from "react";
import { toast } from "sonner";
import { deleteIncome } from "../services/api";

export function DeleteIncomeModal({
    isOpen,
    onClose,
    income,
    onDeleted,
}) {
    const [isDeleting, setIsDeleting] = useState(false);

    async function handleDelete() {
        if (!income?.id || isDeleting) return;

        try {
            setIsDeleting(true);
            await deleteIncome({ id: income.id });
            toast.success("Fonte de renda excluída com sucesso");
            onDeleted?.();
            onClose();
        } catch (error) {
            console.log(error);
            toast.error(error instanceof Error ? error.message : "Erro ao excluir fonte de renda");
        } finally {
            setIsDeleting(false);
        }
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-5 gap-3">
                    <h2 className="text-lg sm:text-xl font-semibold text-white">Excluir fonte de renda</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors p-2 -m-2 rounded-lg"
                        disabled={isDeleting}
                        aria-label="Fechar"
                    >
                        ✕
                    </button>
                </div>

                <div className="space-y-4">
                    <p className="text-gray-300 text-sm leading-relaxed">
                        Tem certeza que deseja excluir
                        {income?.source ? ` "${income.source}"` : " esta fonte de renda"}?
                        {typeof income?.amount === "number" ? (
                            <span className="block text-gray-400 mt-2">
                                Valor: <span className="text-gray-200">
                                    {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(income.amount)}
                                </span>
                            </span>
                        ) : null}
                    </p>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="flex-1 bg-red-500 hover:bg-red-400 disabled:opacity-60 transition-colors px-4 py-2 rounded-lg font-medium"
                        >
                            {isDeleting ? "Excluindo..." : "Sim, excluir"}
                        </button>

                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isDeleting}
                            className="flex-1 bg-gray-800 hover:bg-gray-700 disabled:opacity-60 transition-colors px-4 py-2 rounded-lg font-medium"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}