import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
    Wallet,
    Plus,
    Trash2,
    Pencil,
    X,
    Save,
    TrendingUp,
    User as UserIcon,
    Mail,
    CircleDollarSign,
    CalendarDays,
    Loader2,
    ArrowLeft,
    Landmark,
    Check,
} from "lucide-react";
import { Header } from "../components/Header";
import { Card } from "../components/Card";
import { DeleteIncomeModal } from "../components/DeleteIncomeModal";
import { GroupsCard } from "../components/GroupsCard";

import { createIncome, getIncomes, updateIncome } from "../services/api";

const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export function ProfilePage() {
    const navigate = useNavigate();

    const [incomes, setIncomes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Form state
    const [source, setSource] = useState("");
    const [amount, setAmount] = useState("");
    const [receivedAt, setReceivedAt] = useState(() => {
        const today = new Date();
        return today.toISOString().split("T")[0];
    });

    // Edit state
    const [editingId, setEditingId] = useState(null);
    const [editSource, setEditSource] = useState("");
    const [editAmount, setEditAmount] = useState("");
    const [editReceivedAt, setEditReceivedAt] = useState("");

    // Delete state
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [incomeToDelete, setIncomeToDelete] = useState(null);

    const user = useMemo(() => {
        try {
            return JSON.parse(localStorage.getItem("user") || "null");
        } catch {
            return null;
        }
    }, []);

    const isAuthenticated = !!localStorage.getItem("token");

    async function loadIncomes() {
        try {
            const data = await getIncomes();
            const sorted = [...data].sort(
                (a, b) => new Date(b.receivedAt) - new Date(a.receivedAt)
            );
            setIncomes(sorted);
        } catch (error) {
            console.log(error);
            toast.error("Não foi possível carregar suas receitas.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login");
            return;
        }
        loadIncomes();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated]);

    const totalIncomes = incomes.reduce((sum, inc) => sum + Number(inc.amount), 0);

    function resetForm() {
        setSource("");
        setAmount("");
        setReceivedAt(new Date().toISOString().split("T")[0]);
    }

    async function handleCreate(e) {
        e.preventDefault();
        if (!source.trim() || !amount || !receivedAt) {
            toast.error("Preencha a fonte, o valor e a data de recebimento.");
            return;
        }
        const value = Number(String(amount).replace(",", "."));
        if (!value || value <= 0) {
            toast.error("Informe um valor válido maior que zero.");
            return;
        }

        setSaving(true);
        try {
            const data = await createIncome({
                source: source.trim(),
                amount: value,
                receivedAt: new Date(receivedAt).toISOString(),
            });
            toast.success(data.message || "Fonte de renda cadastrada com sucesso!");
            resetForm();
            await loadIncomes();
        } catch (error) {
            console.log(error);
            toast.error(error.message || "Erro ao cadastrar a fonte de renda.");
        } finally {
            setSaving(false);
        }
    }

    function startEdit(income) {
        setEditingId(income.id);
        setEditSource(income.source);
        setEditAmount(String(income.amount));
        setEditReceivedAt(new Date(income.receivedAt).toISOString().split("T")[0]);
    }

    function cancelEdit() {
        setEditingId(null);
        setEditSource("");
        setEditAmount("");
        setEditReceivedAt("");
    }

    async function handleUpdate(id) {
        if (!editSource.trim() || !editAmount || !editReceivedAt) {
            toast.error("Preencha todos os campos para salvar a edição.");
            return;
        }
        const value = Number(String(editAmount).replace(",", "."));
        if (!value || value <= 0) {
            toast.error("Informe um valor válido maior que zero.");
            return;
        }

        setSaving(true);
        try {
            await updateIncome({
                id,
                source: editSource.trim(),
                amount: value,
                receivedAt: new Date(editReceivedAt).toISOString(),
            });
            toast.success("Receita atualizada com sucesso!");
            cancelEdit();
            await loadIncomes();
        } catch (error) {
            console.log(error);
            toast.error(error.message || "Erro ao atualizar a receita.");
        } finally {
            setSaving(false);
        }
    }

    function openDeleteModal(income) {
        setIncomeToDelete(income);
        setIsDeleteModalOpen(true);
    }

    function formatDate(dateStr) {
        const d = new Date(dateStr);
        return d.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    }

    const inputClass =
        "w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 outline-none focus:border-green-600 text-sm sm:text-base transition-colors";

    return (
        <div className="min-h-screen bg-gray-950 text-white">
            <Header />

            <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
                <div className="mb-6 flex items-center gap-3">
                    <Link
                        to="/"
                        className="text-gray-400 hover:text-white transition-colors"
                        aria-label="Voltar"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold">Meu Perfil</h1>
                        <p className="text-gray-400 text-sm sm:text-base mt-1">
                            Gerencie suas fontes de renda e dados da conta
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-24">
                        <Loader2 className="h-8 w-8 animate-spin text-green-500" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left column: user info + form */}
                        <div className="lg:col-span-1 space-y-6">
                            {/* User card */}
                            <Card>
                                <div className="flex items-center gap-4">
                                    <div className="h-14 w-14 rounded-full bg-green-600/20 border border-green-600/40 flex items-center justify-center shrink-0">
                                        <UserIcon className="h-7 w-7 text-green-400" />
                                    </div>
                                    <div className="min-w-0">
                                        <h2 className="text-lg font-bold truncate">
                                            {user?.name || "Usuário"}
                                        </h2>
                                        <p className="text-gray-400 text-sm flex items-center gap-1.5 truncate">
                                            <Mail className="h-3.5 w-3.5 shrink-0" />
                                            <span className="truncate">{user?.email || "—"}</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-800">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-400">Total de receitas</span>
                                        <span className="font-semibold text-green-400 text-base">
                                            {brl.format(totalIncomes)}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm mt-2">
                                        <span className="text-gray-400">Fontes cadastradas</span>
                                        <span className="font-semibold">{incomes.length}</span>
                                    </div>
                                </div>
                            </Card>

                            {/* Dividir gastos */}
                            <GroupsCard currentUser={user} />

                            {/* Add income form */}
                            <Card>
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="h-9 w-9 rounded-lg bg-green-600/20 border border-green-600/40 flex items-center justify-center">
                                        <Plus className="h-5 w-5 text-green-400" />
                                    </div>
                                    <h2 className="text-base font-bold">Adicionar fonte de renda</h2>
                                </div>

                                <form onSubmit={handleCreate} className="space-y-4">
                                    <div>
                                        <label className="block text-sm text-gray-300 mb-1">
                                            Fonte de renda
                                        </label>
                                        <div className="relative">
                                            <Landmark className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                            <input
                                                type="text"
                                                value={source}
                                                onChange={(e) => setSource(e.target.value)}
                                                placeholder="Ex: Salário, Freelance..."
                                                className={`${inputClass} pl-9`}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm text-gray-300 mb-1">
                                            Valor
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                                                R$
                                            </span>
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                inputMode="decimal"
                                                value={amount}
                                                onChange={(e) => setAmount(e.target.value)}
                                                placeholder="0,00"
                                                className={`${inputClass} pl-10`}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm text-gray-300 mb-1">
                                            Data de recebimento
                                        </label>
                                        <div className="relative">
                                            <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                            <input
                                                type="date"
                                                value={receivedAt}
                                                onChange={(e) => setReceivedAt(e.target.value)}
                                                className={`${inputClass} pl-9`}
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="w-full bg-green-600 hover:bg-green-500 disabled:opacity-60 disabled:cursor-not-allowed transition-colors px-4 py-2.5 rounded-lg font-medium text-sm sm:text-base flex items-center justify-center gap-2"
                                    >
                                        {saving ? (
                                            <>
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                Salvando...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="h-4 w-4" />
                                                Cadastrar renda
                                            </>
                                        )}
                                    </button>
                                </form>
                            </Card>
                        </div>

                        {/* Right column: income list */}
                        <div className="lg:col-span-2">
                            <Card>
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <div className="h-9 w-9 rounded-lg bg-green-600/20 border border-green-600/40 flex items-center justify-center">
                                            <Wallet className="h-5 w-5 text-green-400" />
                                        </div>
                                        <h2 className="text-base font-bold">Minhas fontes de renda</h2>
                                    </div>
                                    <span className="text-xs text-gray-400 bg-gray-800 px-2.5 py-1 rounded-full">
                                        {incomes.length} {incomes.length === 1 ? "item" : "itens"}
                                    </span>
                                </div>

                                {incomes.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-16 text-center">
                                        <CircleDollarSign className="h-12 w-12 text-gray-700 mb-3" />
                                        <p className="text-gray-400 font-medium">
                                            Nenhuma fonte de renda cadastrada
                                        </p>
                                        <p className="text-gray-500 text-sm mt-1">
                                            Adicione sua primeira fonte de renda ao lado.
                                        </p>
                                    </div>
                                ) : (
                                    <ul className="space-y-3">
                                        {incomes.map((income) => {
                                            const isEditing = editingId === income.id;
                                            return (
                                                <li
                                                    key={income.id}
                                                    className="bg-gray-950 border border-gray-800 rounded-xl p-4"
                                                >
                                                    {isEditing ? (
                                                        <div className="space-y-3">
                                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                                <div>
                                                                    <label className="block text-xs text-gray-400 mb-1">
                                                                        Fonte
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        value={editSource}
                                                                        onChange={(e) => setEditSource(e.target.value)}
                                                                        className={inputClass}
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className="block text-xs text-gray-400 mb-1">
                                                                        Valor
                                                                    </label>
                                                                    <input
                                                                        type="number"
                                                                        step="0.01"
                                                                        min="0"
                                                                        value={editAmount}
                                                                        onChange={(e) => setEditAmount(e.target.value)}
                                                                        className={inputClass}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <label className="block text-xs text-gray-400 mb-1">
                                                                    Data de recebimento
                                                                </label>
                                                                <input
                                                                    type="date"
                                                                    value={editReceivedAt}
                                                                    onChange={(e) => setEditReceivedAt(e.target.value)}
                                                                    className={inputClass}
                                                                />
                                                            </div>
                                                            <div className="flex flex-col sm:flex-row gap-2 pt-1">
                                                                <button
                                                                    onClick={() => handleUpdate(income.id)}
                                                                    disabled={saving}
                                                                    className="flex-1 bg-green-600 hover:bg-green-500 disabled:opacity-60 transition-colors px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1.5"
                                                                >
                                                                    {saving ? (
                                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                                    ) : (
                                                                        <Check className="h-4 w-4" />
                                                                    )}
                                                                    Salvar
                                                                </button>
                                                                <button
                                                                    onClick={cancelEdit}
                                                                    className="flex-1 bg-gray-800 hover:bg-gray-700 transition-colors px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1.5"
                                                                >
                                                                    <X className="h-4 w-4" />
                                                                    Cancelar
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                                            <div className="flex items-start gap-3 min-w-0 flex-1">
                                                                <div className="h-10 w-10 rounded-lg bg-green-600/15 border border-green-600/30 flex items-center justify-center shrink-0">
                                                                    <TrendingUp className="h-5 w-5 text-green-400" />
                                                                </div>
                                                                <div className="min-w-0">
                                                                    <p className="font-semibold truncate">
                                                                        {income.source}
                                                                    </p>
                                                                    <p className="text-gray-400 text-sm flex items-center gap-1">
                                                                        <CalendarDays className="h-3.5 w-3.5" />
                                                                        {formatDate(income.receivedAt)}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center justify-between gap-3 sm:justify-end">
                                                                <span className="text-green-400 font-bold text-base whitespace-nowrap">
                                                                    {brl.format(Number(income.amount))}
                                                                </span>
                                                                <div className="flex items-center gap-1 shrink-0">
                                                                    <button
                                                                        onClick={() => startEdit(income)}
                                                                        className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                                                                        aria-label="Editar"
                                                                    >
                                                                        <Pencil className="h-4 w-4" />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => openDeleteModal(income)}
                                                                        className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                                                                        aria-label="Excluir"
                                                                    >
                                                                        <Trash2 className="h-4 w-4" />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </li>
                                            );
                                        })}
                                    </ul>
                                )}
                            </Card>
                        </div>
                    </div>
                )}
            </div>

            <DeleteIncomeModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setIncomeToDelete(null);
                }}
                income={incomeToDelete}
                onDeleted={loadIncomes}
            />
        </div>
    );
}