import { useState } from "react";
import { toast } from "sonner";
import { createCategory } from "../services/api";





export function CreateCategoryModal({ isOpen, onClose }) {

    const [name, setName] = useState("");

    async function createCategoryHandler() {
        if (!name) {


            return;
        }

        try {
            const data = await createCategory({ name });
            toast.success(data.message || "Categoria criada com sucesso");
            setName("");
            onClose();
        } catch (error) {
            console.log(error);
            toast.error("Erro ao criar categoria");
        }
    }

    if (!isOpen) return null;

    return (

        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">

            <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-2xl">

                <div className="flex items-center justify-between mb-6">

                    <h2 className="text-xl font-semibold text-white">
                        Nova Categoria
                    </h2>

                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        ✕
                    </button>

                </div>

                <div className="space-y-4">

                    <div>

                        <label className="block text-sm text-gray-300 mb-1">
                            Nome da categoria
                        </label>

                        <input
                            className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 outline-none focus:border-green-600"
                            placeholder="Ex: Investimentos"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />

                    </div>

                    <div className="flex gap-3 pt-2">

                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 bg-gray-800 hover:bg-gray-700 transition-colors px-4 py-2 rounded-lg"
                        >
                            Cancelar
                        </button>

                        <button
                            type="button"
                            onClick={createCategoryHandler}
                            className="flex-1 bg-green-600 hover:bg-green-500 transition-colors px-4 py-2 rounded-lg font-medium"
                        >

                            Criar categoria
                        </button>

                    </div>

                </div>

            </div>

        </div>

    );
}