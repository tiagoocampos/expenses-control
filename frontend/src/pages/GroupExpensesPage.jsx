import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import {
    ArrowLeft,
    Loader2,
    Users,
    UserRound,
    LogOut,
    Pencil,
    Check,
    X,
    FileText,
} from "lucide-react";
import { Header } from "../components/Header";
import { Card } from "../components/Card";
import { LeaveGroupModal } from "../components/LeaveGroupModal";
import { GroupReportModal } from "../components/GroupReportModal";
import { getGroup, getGroupExpenses, updateGroup, payExpenseSplit } from "../services/api";

function formatBRL(value) {
    return `R$ ${Number(value).toFixed(2).replace(".", ",")}`;
}

function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString("pt-BR");
}

export function GroupExpensesPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [group, setGroup] = useState(null);
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);

    const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [report, setReport] = useState(null);

    const [isEditingName, setIsEditingName] = useState(false);
    const [nameInput, setNameInput] = useState("");
    const [savingName, setSavingName] = useState(false);

    const [payingId, setPayingId] = useState(null);

    const currentUser = useMemo(() => {
        try {
            return JSON.parse(localStorage.getItem("user") || "null");
        } catch {
            return null;
        }
    }, []);

    const isAuthenticated = !!localStorage.getItem("token");

    async function loadData() {
        try {
            const [groupData, expensesData] = await Promise.all([
                getGroup({ id: Number(id) }),
                getGroupExpenses({ id: Number(id) }),
            ]);
            setGroup(groupData);
            setExpenses(expensesData);
        } catch (error) {
            console.log(error);
            toast.error("Não foi possível carregar os dados do grupo.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login");
            return;
        }
        loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, isAuthenticated]);

    function memberName(userId, expense) {
        const member = group?.members?.find((m) => m.userId === userId);
        if (member?.user?.name) return member.user.name;
        if (expense?.userId === userId && expense?.user?.name) return expense.user.name;
        return "Alguém";
    }

    const total = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

    // saldo: por membro, quanto ele deve pra mim (positivo) ou eu devo pra ele (negativo)
    const balances = useMemo(() => {
        if (!currentUser?.id) return {};
        const result = {};

        for (const expense of expenses) {
            const splits = expense.splits || [];
            for (const split of splits) {
                if (split.isPaid) continue;
                if (split.userId === expense.userId) continue;

                if (expense.userId === currentUser.id) {
                    result[split.userId] = (result[split.userId] || 0) + Number(split.amount);
                } else if (split.userId === currentUser.id) {
                    result[expense.userId] = (result[expense.userId] || 0) - Number(split.amount);
                }
            }
        }

        return result;
    }, [expenses, currentUser]);

    function generateReport() {
        const items = expenses.map((expense) => ({
            id: expense.id,
            title: expense.title,
            amount: expense.amount,
            date: expense.date,
            payerName: memberName(expense.userId, expense),
            splits: (expense.splits || []).map((split) => ({
                id: split.id,
                name: memberName(split.userId, expense),
                amount: split.amount,
                isPaid: split.isPaid,
                paidAt: split.paidAt,
            })),
        }));
    
        setReport({
            groupName: group?.name || "Grupo",
            generatedAt: new Date().toISOString(),
            total: expenses.reduce((sum, e) => sum + Number(e.amount), 0),
            expenses: items,
        });
        setIsReportModalOpen(true);
    }

    function startEditName() {
        setNameInput(group?.name || "");
        setIsEditingName(true);
    }

    async function saveName() {
        if (!nameInput.trim()) {
            toast.error("Informe um nome para o grupo.");
            return;
        }
        setSavingName(true);
        try {
            await updateGroup({ id: Number(id), name: nameInput.trim() });
            toast.success("Nome do grupo atualizado!");
            setIsEditingName(false);
            await loadData();
        } catch (error) {
            console.log(error);
            toast.error(error.message || "Erro ao atualizar o nome do grupo.");
        } finally {
            setSavingName(false);
        }
    }

    async function handlePaySplit(expenseId) {
        setPayingId(expenseId);
        try {
            await payExpenseSplit({ expenseId });
            toast.success("Sua parte foi marcada como paga!");
            await loadData();
        } catch (error) {
            console.log(error);
            toast.error(error.message || "Erro ao marcar como pago.");
        } finally {
            setPayingId(null);
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-950 text-white">
                <Header />
                <div className="flex items-center justify-center py-24">
                    <Loader2 className="h-8 w-8 animate-spin text-green-500" />
                </div>
            </div>
        );
    }

    if (!group) {
        return (
            <div className="min-h-screen bg-gray-950 text-white">
                <Header />
                <div className="max-w-3xl mx-auto px-4 py-10 text-center">
                    <p className="text-gray-400">Grupo não encontrado.</p>
                    <Link to="/profile" className="text-green-400 hover:underline mt-2 inline-block">
                        Voltar ao perfil
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-950 text-white">
            <Header />

            <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
                <div className="mb-6 flex flex-wrap items-center gap-3">
                    <Link
                        to="/profile"
                        className="text-gray-400 hover:text-white transition-colors"
                        aria-label="Voltar"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <div className="min-w-0 flex-1">
                        {isEditingName ? (
                            <div className="flex items-center gap-2">
                                <input
                                    value={nameInput}
                                    onChange={(e) => setNameInput(e.target.value)}
                                    className="bg-gray-950 border border-gray-800 rounded-lg px-3 py-1.5 outline-none focus:border-green-600 text-xl sm:text-2xl font-bold"
                                    autoFocus
                                />
                                <button
                                    onClick={saveName}
                                    disabled={savingName}
                                    className="p-2 rounded-lg bg-green-600 hover:bg-green-500 disabled:opacity-60 transition-colors"
                                    aria-label="Salvar"
                                >
                                    {savingName ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Check className="h-4 w-4" />
                                    )}
                                </button>
                                <button
                                    onClick={() => setIsEditingName(false)}
                                    disabled={savingName}
                                    className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
                                    aria-label="Cancelar"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <h1 className="text-2xl sm:text-3xl font-bold truncate">{group.name}</h1>
                                <button
                                    onClick={startEditName}
                                    className="text-gray-400 hover:text-white transition-colors p-1.5 rounded-lg"
                                    aria-label="Editar nome"
                                >
                                    <Pencil className="h-4 w-4" />
                                </button>
                            </div>
                        )}
                        <p className="text-gray-400 text-sm sm:text-base mt-1 flex items-center gap-1.5">
                            <Users className="h-4 w-4" />
                            {group.members?.length ?? 0}{" "}
                            {group.members?.length === 1 ? "membro" : "membros"}
                        </p>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                        <button
                            onClick={generateReport}
                            className="flex items-center gap-1.5 text-sm text-gray-300 hover:text-white hover:bg-green-600/20 transition-colors px-3 py-2 rounded-lg border border-gray-800"
                        >
                            <FileText className="h-4 w-4" />
                            Gerar relatório
                        </button>
                        <button
                            onClick={() => setIsLeaveModalOpen(true)}
                            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors px-3 py-2 rounded-lg"
                        >
                            <LogOut className="h-4 w-4" />
                            Sair do grupo
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                    <div className="lg:col-span-1">
                        <Card>
                            <div className="text-gray-400 text-sm">Total do grupo</div>
                            <div className="text-3xl font-bold mt-1 text-green-300 break-words">
                                {formatBRL(total)}
                            </div>
                        </Card>
                    </div>

                    <div className="lg:col-span-2">
                        <Card>
                            <h2 className="text-sm font-semibold text-gray-300 mb-3">Membros e saldo</h2>
                            <ul className="space-y-2">
                                {group.members?.map((member) => {
                                    if (member.userId === currentUser?.id) {
                                        return (
                                            <li
                                                key={member.id}
                                                className="flex items-center justify-between text-sm"
                                            >
                                                <span className="flex items-center gap-1.5 text-gray-300">
                                                    <UserRound className="h-3.5 w-3.5" />
                                                    {member.user?.name} (você)
                                                </span>
                                            </li>
                                        );
                                    }

                                    const balance = balances[member.userId] || 0;

                                    return (
                                        <li
                                            key={member.id}
                                            className="flex items-center justify-between text-sm"
                                        >
                                            <span className="flex items-center gap-1.5 text-gray-300">
                                                <UserRound className="h-3.5 w-3.5" />
                                                {member.user?.name}
                                            </span>
                                            {balance > 0 && (
                                                <span className="text-green-400 font-medium">
                                                    deve {formatBRL(balance)}
                                                </span>
                                            )}
                                            {balance < 0 && (
                                                <span className="text-red-400 font-medium">
                                                    você deve {formatBRL(Math.abs(balance))}
                                                </span>
                                            )}
                                            {balance === 0 && (
                                                <span className="text-gray-500">quitado</span>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        </Card>
                    </div>
                </div>

                <Card>
                    <h2 className="text-base font-bold mb-4">Gastos do grupo</h2>

                    {expenses.length === 0 ? (
                        <div className="py-6 text-gray-400 text-sm text-center">
                            Nenhum gasto registrado neste grupo ainda.
                        </div>
                    ) : (
                        <ul className="space-y-2">
                            {expenses.map((expense) => (
                                <li
                                    key={expense.id}
                                    className="bg-gray-950 border border-gray-800 rounded-xl p-3"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <p className="font-medium text-sm truncate">
                                                {expense.title || "Sem descrição"}
                                            </p>
                                            <p className="text-gray-400 text-xs mt-1">
                                                Pago por {memberName(expense.userId, expense)} ·{" "}
                                                {formatDate(expense.date)}
                                            </p>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <div className="text-sm font-semibold">
                                                {formatBRL(expense.amount)}
                                            </div>
                                        </div>
                                    </div>

                                    {expense.splits?.length > 0 && (
                                        <div className="mt-2 pt-2 border-t border-gray-800 flex flex-wrap items-center gap-x-4 gap-y-2">
                                            {expense.splits.map((split) => {
                                                const isMe = split.userId === currentUser?.id;
                                                return (
                                                    <div
                                                        key={split.id}
                                                        className="flex items-center gap-2 text-xs text-gray-400"
                                                    >
                                                        <span>
                                                            {memberName(split.userId, expense)}:{" "}
                                                            <span className="text-gray-300">
                                                                {formatBRL(split.amount)}
                                                            </span>
                                                        </span>

                                                        {isMe && !split.isPaid && (
                                                            <button
                                                                onClick={() => handlePaySplit(expense.id)}
                                                                disabled={payingId === expense.id}
                                                                className="flex items-center gap-1 text-green-400 hover:text-green-300 hover:bg-green-500/10 disabled:opacity-60 transition-colors px-2 py-0.5 rounded-md border border-green-800"
                                                            >
                                                                {payingId === expense.id ? (
                                                                    <Loader2 className="h-3 w-3 animate-spin" />
                                                                ) : (
                                                                    <Check className="h-3 w-3" />
                                                                )}
                                                                Marcar como paga
                                                            </button>
                                                        )}

                                                        {isMe && split.isPaid && (
                                                            <span className="text-green-500 text-[11px]">
                                                                ✓ paga
                                                            </span>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </Card>
            </div>

            <LeaveGroupModal
                isOpen={isLeaveModalOpen}
                onClose={() => setIsLeaveModalOpen(false)}
                group={group}
                onLeft={() => navigate("/profile")}
            />

            <GroupReportModal
                isOpen={isReportModalOpen}
                onClose={() => setIsReportModalOpen(false)}
                report={report}
            />
        </div>
    );
}