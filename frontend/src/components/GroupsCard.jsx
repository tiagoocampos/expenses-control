import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Copy, Users, LogIn, Loader2, UserRound } from "lucide-react";
import { Card } from "./Card";
import { LeaveGroupModal } from "./LeaveGroupModal";
import { getGroups, getUserById, joinGroupByCode } from "../services/api";
import { Link } from "react-router-dom";

export function GroupsCard({ currentUser }) {
    const [shareCode, setShareCode] = useState("");
    const [loadingCode, setLoadingCode] = useState(true);

    const [groups, setGroups] = useState([]);
    const [loadingGroups, setLoadingGroups] = useState(true);

    const [codeInput, setCodeInput] = useState("");
    const [joining, setJoining] = useState(false);

    const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
    const [groupToLeave, setGroupToLeave] = useState(null);

    async function loadShareCode() {
        if (!currentUser?.id) return;
        try {
            const data = await getUserById({ id: currentUser.id });
            setShareCode(data.shareCode || "");
        } catch (error) {
            console.log(error);
            toast.error("Não foi possível carregar seu código de compartilhamento.");
        } finally {
            setLoadingCode(false);
        }
    }

    async function loadGroups() {
        try {
            const data = await getGroups();
            setGroups(data);
        } catch (error) {
            console.log(error);
            toast.error("Não foi possível carregar seus grupos.");
        } finally {
            setLoadingGroups(false);
        }
    }

    useEffect(() => {
        loadShareCode();
        loadGroups();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser?.id]);

    async function handleCopy() {
        if (!shareCode) return;
        try {
            await navigator.clipboard.writeText(shareCode);
            toast.success("Código copiado!");
        } catch (error) {
            console.log(error);
            toast.error("Não foi possível copiar o código.");
        }
    }

    async function handleJoin(e) {
        e.preventDefault();
        if (!codeInput.trim()) {
            toast.error("Informe um código válido.");
            return;
        }

        setJoining(true);
        try {
            await joinGroupByCode({ shareCode: codeInput.trim().toUpperCase() });
            toast.success("Você entrou no grupo!");
            setCodeInput("");
            await loadGroups();
        } catch (error) {
            console.log(error);
            toast.error(error.message || "Erro ao entrar no grupo.");
        } finally {
            setJoining(false);
        }
    }

    function openLeaveModal(group) {
        setGroupToLeave(group);
        setIsLeaveModalOpen(true);
    }

    const inputClass =
        "w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 outline-none focus:border-green-600 text-sm sm:text-base transition-colors";

    return (
        <>
            <Card>
                <div className="flex items-center gap-2 mb-4">
                    <div className="h-9 w-9 rounded-lg bg-green-600/20 border border-green-600/40 flex items-center justify-center">
                        <Users className="h-5 w-5 text-green-400" />
                    </div>
                    <h2 className="text-base font-bold">Dividir gastos</h2>
                </div>

                {/* Meu código */}
                <div className="mb-5">
                    <label className="block text-sm text-gray-300 mb-1">Meu código</label>
                    {loadingCode ? (
                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Carregando...
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <span className="flex-1 bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-sm sm:text-base font-mono tracking-widest text-green-400">
                                {shareCode || "—"}
                            </span>
                            <button
                                type="button"
                                onClick={handleCopy}
                                className="shrink-0 p-2.5 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
                                aria-label="Copiar código"
                            >
                                <Copy className="h-4 w-4" />
                            </button>
                        </div>
                    )}
                    <p className="text-gray-500 text-xs mt-1.5">
                        Compartilhe esse código com quem você quer dividir gastos.
                    </p>
                </div>

                {/* Entrar com código */}
                <form onSubmit={handleJoin} className="mb-5">
                    <label className="block text-sm text-gray-300 mb-1">Entrar com um código</label>
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={codeInput}
                            onChange={(e) => setCodeInput(e.target.value)}
                            placeholder="Ex: X7K2P9"
                            className={`${inputClass} font-mono tracking-widest uppercase`}
                        />
                        <button
                            type="submit"
                            disabled={joining}
                            className="shrink-0 bg-green-600 hover:bg-green-500 disabled:opacity-60 disabled:cursor-not-allowed transition-colors px-3.5 py-2.5 rounded-lg font-medium text-sm flex items-center gap-1.5"
                        >
                            {joining ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <LogIn className="h-4 w-4" />
                            )}
                            Entrar
                        </button>
                    </div>
                </form>

                {/* Meus grupos */}
                <div className="pt-4 border-t border-gray-800">
                    <h3 className="text-sm font-semibold text-gray-300 mb-3">Meus grupos</h3>

                    {loadingGroups ? (
                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Carregando...
                        </div>
                    ) : groups.length === 0 ? (
                        <p className="text-gray-500 text-sm">
                            Você ainda não faz parte de nenhum grupo.
                        </p>
                    ) : (
                        <ul className="space-y-2">
                            {groups.map((group) => (
                                <li
                                    key={group.id}
                                    className="bg-gray-950 border border-gray-800 rounded-lg p-3 flex items-center justify-between gap-3"
                                >
                                    <div className="min-w-0">
                                        <Link
                                            to={`/grupos/${group.id}`}
                                            className="font-medium text-sm truncate hover:text-green-400 transition-colors block"
                                        >
                                            {group.name}
                                        </Link>
                                        <p className="text-gray-400 text-xs flex items-center gap-1 mt-0.5">
                                            <UserRound className="h-3 w-3" />
                                            {group.members?.length ?? 0}{" "}
                                            {group.members?.length === 1 ? "membro" : "membros"}
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => openLeaveModal(group)}
                                        className="shrink-0 text-xs text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors px-2.5 py-1.5 rounded-lg"
                                    >
                                        Sair
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </Card>

            <LeaveGroupModal
                isOpen={isLeaveModalOpen}
                onClose={() => {
                    setIsLeaveModalOpen(false);
                    setGroupToLeave(null);
                }}
                group={groupToLeave}
                onLeft={loadGroups}
            />
        </>
    );
}
