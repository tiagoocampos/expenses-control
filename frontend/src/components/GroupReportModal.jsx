import { Copy, FileText } from "lucide-react";
import { toast } from "sonner";

function formatBRL(value) {
    return `R$ ${Number(value).toFixed(2).replace(".", ",")}`;
}

function formatDateTime(date) {
    if (!date) return "";
    return new Date(date).toLocaleString("pt-BR");
}

function formatDate(date) {
    return new Date(date).toLocaleDateString("pt-BR");
}

function buildFullReportText(report) {
    const lines = [
        `Relatório de gastos — ${report.groupName}`,
        `Gerado em: ${formatDateTime(report.generatedAt)}`,
        `Total do grupo: ${formatBRL(report.total)}`,
        "",
    ];

    for (const expense of report.expenses) {
        lines.push(`${expense.title} — ${formatBRL(expense.amount)} (${formatDate(expense.date)})`);
        lines.push(`Pago por: ${expense.payerName}`);
        for (const split of expense.splits) {
            const status = split.isPaid
                ? split.paidAt
                    ? `Pago em ${formatDateTime(split.paidAt)}`
                    : "Pago"
                : "Pendente";
            lines.push(`  - ${split.name}: ${formatBRL(split.amount)} — ${status}`);
        }
        lines.push("");
    }

    return lines.join("\n");
}

export function GroupReportModal({ isOpen, onClose, report }) {
    if (!isOpen || !report) return null;

    async function handleCopy() {
        try {
            await navigator.clipboard.writeText(buildFullReportText(report));
            toast.success("Relatório copiado!");
        } catch (error) {
            console.log(error);
            toast.error("Não foi possível copiar o relatório.");
        }
    }

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-lg bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-start justify-between mb-5 gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                        <div className="h-9 w-9 rounded-lg bg-green-600/20 border border-green-600/40 flex items-center justify-center shrink-0">
                            <FileText className="h-5 w-5 text-green-400" />
                        </div>
                        <div className="min-w-0">
                            <h2 className="text-lg sm:text-xl font-semibold text-white">
                                Relatório do grupo
                            </h2>
                            <p className="text-gray-400 text-xs mt-0.5">
                                Gerado em {formatDateTime(report.generatedAt)}
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors p-2 -m-2 rounded-lg"
                        aria-label="Fechar"
                    >
                        ✕
                    </button>
                </div>

                <div className="space-y-5">
                    <p className="text-gray-200 text-sm leading-relaxed bg-gray-950 border border-gray-800 rounded-xl p-3">
                        Total do grupo: {formatBRL(report.total)}
                    </p>

                    {report.expenses.length === 0 ? (
                        <p className="text-gray-500 text-sm">Nenhum gasto registrado ainda.</p>
                    ) : (
                        <ul className="space-y-3">
                            {report.expenses.map((expense) => (
                                <li
                                    key={expense.id}
                                    className="bg-gray-950 border border-gray-800 rounded-xl p-3"
                                >
                                    <div className="flex items-start justify-between gap-3 mb-2">
                                        <div className="min-w-0">
                                            <p className="font-medium text-sm truncate">
                                                {expense.title}
                                            </p>
                                            <p className="text-gray-400 text-xs mt-0.5">
                                                Pago por {expense.payerName} ·{" "}
                                                {formatDate(expense.date)}
                                            </p>
                                        </div>
                                        <div className="text-sm font-semibold shrink-0">
                                            {formatBRL(expense.amount)}
                                        </div>
                                    </div>

                                    <ul className="space-y-1.5 pt-2 border-t border-gray-800">
                                        {expense.splits.map((split) => (
                                            <li
                                                key={split.id}
                                                className="flex items-center justify-between text-xs gap-2"
                                            >
                                                <span className="text-gray-300 truncate">
                                                    {split.name}:{" "}
                                                    <span className="text-gray-400">
                                                        {formatBRL(split.amount)}
                                                    </span>
                                                </span>

                                                {split.isPaid ? (
                                                    <span className="text-green-400 text-right shrink-0">
                                                        {split.paidAt
                                                            ? `Pago em ${formatDateTime(split.paidAt)}`
                                                            : "Pago"}
                                                    </span>
                                                ) : (
                                                    <span className="text-yellow-500 shrink-0">
                                                        Pendente
                                                    </span>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                            ))}
                        </ul>
                    )}

                    <div className="flex gap-3 pt-1">
                        <button
                            type="button"
                            onClick={handleCopy}
                            className="flex-1 bg-green-600 hover:bg-green-500 transition-colors px-4 py-2 rounded-lg font-medium text-sm flex items-center justify-center gap-1.5"
                        >
                            <Copy className="h-4 w-4" />
                            Copiar relatório
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 bg-gray-800 hover:bg-gray-700 transition-colors px-4 py-2 rounded-lg font-medium text-sm"
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}