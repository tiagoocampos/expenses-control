import { useState } from "react";
import { toast } from "sonner";
import { leaveGroup } from "../services/api";

export function LeaveGroupModal({ isOpen, onClose, group, onLeft }) {
    const [isLeaving, setIsLeaving] = useState(false);

    async function handleLeave() {
        if (!group?.id || isLeaving) return;

        try {
            setIsLeaving(true);
            const data = await leaveGroup({ groupId: group.id });
            toast.success(data?.message || "Você saiu do grupo");
            onLeft?.();
            onClose();
        } catch (error) {
            console.log(error);
            toast.error(error.message || "Erro ao sair do grupo");
        } finally {
            setIsLeaving(false);
        }
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-5 gap-3">
                    <h2 className="text-lg sm:text-xl font-semibold text-white">Sair do grupo</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors p-2 -m-2 rounded-lg"
                        disabled={isLeaving}
                        aria-label="Fechar"
                    >
                        ✕
                    </button>
                </div>

                <div className="space-y-4">
                    <p className="text-gray-300 text-sm leading-relaxed">
                        Tem certeza que deseja sair do grupo
                        {group?.name ? ` "${group.name}"` : ""}? Você deixará de ver os gastos
                        compartilhados dele, mas os gastos já registrados continuam existindo.
                    </p>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={handleLeave}
                            disabled={isLeaving}
                            className="flex-1 bg-red-500 hover:bg-red-400 disabled:opacity-60 transition-colors px-4 py-2 rounded-lg font-medium"
                        >
                            {isLeaving ? "Saindo..." : "Sim, sair"}
                        </button>

                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isLeaving}
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
