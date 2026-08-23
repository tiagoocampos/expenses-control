import { Copy, FileText } from "lucide-react";
import { toast } from "sonner";

function formatBRL(value) {
    return `R$ ${Number(value).toFixed(2).replace(".", ",")}`;
}

function formatDateTime(date) {
    return new Date(date).toLocaleString("pt-BR");
}

function buildSummaryText(report) {
    if (!report) return "";

    const parts = report.users
        .map((user) => `${formatBRL(user.total)} de ${user.name}`)
        .join(" e ");

    return `Total de gastos do grupo até o momento: ${formatBRL(report.total)}${
        parts ? `, sendo ${parts}` : ""
    }`;
}

function buildFullReportText(report) {
    const lines = [
        `Relatório de gastos — ${report.groupName}`,
        `Gerado em: ${formatDateTime(report.generatedAt)}`,
        "",
        buildSummaryText(report),
        "",
        "Gastos por usuário:",
        ...report.users.map(
            (user) =>
                `- ${user.name}: ${formatBRL(user.total)} (${user.count} ${
                    user.count === 1 ? "gasto criado" : "gastos criados"
                })`
        ),
    ];

    if (report.comparisons.length > 0) {
        lines.push("", "Comparação entre usuários:");
        for (const cmp of report.comparisons) {
            const amountLine =
                cmp.amountDiff === 0
                    ? `${cmp.a.name} e ${cmp.b.name} gastaram o mesmo valor (${formatBRL(cmp.a.total)})`
                    : cmp.amountDiff > 0
                      ? `${cmp.a.name} gastou ${formatBRL(cmp.amountDiff)} a mais que ${cmp.b.name} (${formatBRL(cmp.a.total)} vs ${formatBRL(cmp.b.total)})`
                      : `${cmp.b.name} gastou ${formatBRL(Math.abs(cmp.amountDiff))} a mais que ${cmp.a.name} (${formatBRL(cmp.b.total)} vs ${formatBRL(cmp.a.total)})`;

            const countLine =
                cmp.countDiff === 0
                    ? `${cmp.a.name} e ${cmp.b.name} criaram a mesma quantidade de gastos (${cmp.a.count})`
                    : cmp.countDiff > 0
                      ? `${cmp.a.name} criou ${cmp.countDiff} ${cmp.countDiff === 1 ? "gasto" : "gastos"} a mais que ${cmp.b.name} (${cmp.a.count} vs ${cmp.b.count})`
                      : `${cmp.b.name} criou ${Math.abs(cmp.countDiff)} ${Math.abs(cmp.countDiff) === 1 ? "gasto" : "gastos"} a mais que ${cmp.a.name} (${cmp.b.count} vs ${cmp.a.count})`;

            lines.push(`- ${amountLine}`);
            lines.push(`  ${countLine}`);
        }
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
                        {buildSummaryText(report)}
                    </p>

                    <div>
                        <h3 className="text-sm font-semibold text-gray-300 mb-2">
                            Gastos por usuário
                        </h3>
                        {report.users.length === 0 ? (
                            <p className="text-gray-500 text-sm">Nenhum membro no grupo.</p>
                        ) : (
                            <ul className="space-y-2">
                                {report.users.map((user) => {
                                    const share =
                                        report.total > 0
                                            ? ((user.total / report.total) * 100).toFixed(1)
                                            : "0,0";
                                    return (
                                        <li
                                            key={user.userId}
                                            className="bg-gray-950 border border-gray-800 rounded-xl p-3"
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0">
                                                    <p className="font-medium text-sm truncate">
                                                        {user.name}
                                                    </p>
                                                    <p className="text-gray-400 text-xs mt-0.5">
                                                        {user.count}{" "}
                                                        {user.count === 1
                                                            ? "gasto criado"
                                                            : "gastos criados"}
                                                    </p>
                                                </div>
                                                <div className="text-right shrink-0">
                                                    <div className="text-sm font-semibold text-green-300">
                                                        {formatBRL(user.total)}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {share.replace(".", ",")}% do total
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>

                    {report.comparisons.length > 0 && (
                        <div>
                            <h3 className="text-sm font-semibold text-gray-300 mb-2">
                                Comparação entre usuários
                            </h3>
                            <ul className="space-y-2">
                                {report.comparisons.map((cmp) => (
                                    <li
                                        key={`${cmp.a.userId}-${cmp.b.userId}`}
                                        className="bg-gray-950 border border-gray-800 rounded-xl p-3 text-sm text-gray-300 space-y-1"
                                    >
                                        <p>
                                            {cmp.amountDiff === 0 ? (
                                                <>
                                                    <span className="text-white">{cmp.a.name}</span> e{" "}
                                                    <span className="text-white">{cmp.b.name}</span>{" "}
                                                    gastaram o mesmo valor (
                                                    {formatBRL(cmp.a.total)})
                                                </>
                                            ) : cmp.amountDiff > 0 ? (
                                                <>
                                                    <span className="text-white">{cmp.a.name}</span>{" "}
                                                    gastou{" "}
                                                    <span className="text-green-400 font-medium">
                                                        {formatBRL(cmp.amountDiff)}
                                                    </span>{" "}
                                                    a mais que{" "}
                                                    <span className="text-white">{cmp.b.name}</span>{" "}
                                                    ({formatBRL(cmp.a.total)} vs{" "}
                                                    {formatBRL(cmp.b.total)})
                                                </>
                                            ) : (
                                                <>
                                                    <span className="text-white">{cmp.b.name}</span>{" "}
                                                    gastou{" "}
                                                    <span className="text-green-400 font-medium">
                                                        {formatBRL(Math.abs(cmp.amountDiff))}
                                                    </span>{" "}
                                                    a mais que{" "}
                                                    <span className="text-white">{cmp.a.name}</span>{" "}
                                                    ({formatBRL(cmp.b.total)} vs{" "}
                                                    {formatBRL(cmp.a.total)})
                                                </>
                                            )}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            {cmp.countDiff === 0
                                                ? `${cmp.a.name} e ${cmp.b.name} criaram a mesma quantidade de gastos (${cmp.a.count})`
                                                : cmp.countDiff > 0
                                                  ? `${cmp.a.name} criou ${cmp.countDiff} ${cmp.countDiff === 1 ? "gasto" : "gastos"} a mais que ${cmp.b.name} (${cmp.a.count} vs ${cmp.b.count})`
                                                  : `${cmp.b.name} criou ${Math.abs(cmp.countDiff)} ${Math.abs(cmp.countDiff) === 1 ? "gasto" : "gastos"} a mais que ${cmp.a.name} (${cmp.b.count} vs ${cmp.a.count})`}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        </div>
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
