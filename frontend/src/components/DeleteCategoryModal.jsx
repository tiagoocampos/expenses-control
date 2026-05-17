import { useState } from "react";
import { toast } from "sonner";
import { deleteCategory } from "../services/api";

export function DeleteCategoryModal({
    isOpen,
    onClose,
    category,
    expensesCount,
    onDeleted,
}) {
    const [isDeleting, setIsDeleting] = useState(false);

    async function handleDelete() {
        if (!category?.id || isDeleting) return;

        try {
            setIsDeleting(true);
            const data = await deleteCategory({ id: category.id });
            toast.success(data?.message || "Categoria excluída com sucesso");
            onDeleted?.();
            onClose();
        } catch (error) {
            console.log(error);
            toast.error("Erro ao deletar categoria");
        } finally {
            setIsDeleting(false);
        }
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-5 gap-3">
                    <h2 className="text-lg sm:text-xl font-semibold text-white">Excluir categoria</h2>
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
                        Removendo esta categoria,
                        {category?.name ? ` "${category.name}"` : ""}, você irá remover junto todas as despesas cadastradas nela,
                        tem certeza que deseja excluir?
                        {typeof expensesCount === "number" ? (
                            <span className="block text-gray-400 mt-2">
                                Total de despesas na categoria: <span className="text-gray-200">{expensesCount}</span>
                            </span>
                        ) : null}
                    </p>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="flex-1 bg-green-600 hover:bg-green-500 disabled:opacity-60 transition-colors px-4 py-2 rounded-lg font-medium"
                        >
                            Sim
                        </button>

                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isDeleting}
                            className="flex-1 bg-red-500 hover:bg-red-400 disabled:opacity-60 transition-colors px-4 py-2 rounded-lg font-medium"
                        >
                            Não
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
