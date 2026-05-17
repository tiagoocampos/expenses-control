import { useEffect, useMemo, useState } from "react";
import { ResponsivePie } from "@nivo/pie";
import { Card } from "./Card";
import { getExpensesByCategory } from "../services/api";


const COLORS = [
    "#22c55e", // green-500
    "#16a34a", // green-600
    "#3b82f6", // blue-500
    "#06b6d4", // cyan-500
    "#f59e0b", // amber-500
    "#ef4444", // red-500
    "#a78bfa", // violet-400
    "#ec4899", // pink-500
    "#84cc16", // lime-500
];

function formatBRL(value) {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(value);
}



export function ExpensesChart() {
    const [grouped, setGrouped] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            setLoading(true);
            try {
                const data = await getExpensesByCategory();
                if (!cancelled) setGrouped(Array.isArray(data) ? data : []);
            } catch (e) {
                console.log(e);
                if (!cancelled) setGrouped([]);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();

        return () => {
            cancelled = true;
        };
    }, []);

    // Rebuild chart data from API shape: [{category_id, category_name, total, expenses: [...]}, ...]
    const chartData = useMemo(() => {
        const sanitized = (grouped || []).filter((x) => x && typeof x.total === "number");

        const totalAll = sanitized.reduce((acc, x) => acc + (Number(x.total) || 0), 0);

        if (totalAll <= 0) return [];

        return sanitized
            .map((x) => {
                const value = Number(x.total) || 0;
                const percent = totalAll > 0 ? (value / totalAll) * 100 : 0;
                return {
                    name: x.category_name,
                    value,
                    valuePercent: percent,
                };
            })
            .filter((x) => x.value > 0);
    }, [grouped]);

    const totalValue = useMemo(() => chartData.reduce((acc, x) => acc + x.value, 0), [chartData]);

    if (loading) {
        return (
            <Card>
                <div className="text-gray-400">Carregando resumo...</div>
            </Card>
        );
    }

    if (!chartData.length) {
        return (
            <Card>
                <div className="text-gray-400">Nenhuma despesa cadastrada por categoria</div>
            </Card>
        );
    }

    return (
        <Card>
            <div className="flex items-center justify-between gap-4 mb-4">
                <div>
                    <div className="text-gray-400 text-sm">Distribuição por categoria</div>
                    <div className="text-sm text-gray-200 mt-1">Atualiza conforme suas despesas</div>
                </div>
                <div className="text-right">
                    <div className="text-gray-400 text-xs">Total</div>
                    <div className="text-green-300 font-semibold">{formatBRL(totalValue)}</div>
                </div>
            </div>

            <div className="h-64 md:h-80 relative">
                {/* Nivo Pie (evita o recharts que quebrou com seu setup) */}
                <ResponsivePie
                    data={chartData.map((x, idx) => ({
                        id: x.name,
                        label: x.name,
                        value: x.value,
                        color: COLORS[idx % COLORS.length],
                    }))}
                    margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
                    startAngle={-90}
                    endAngle={90}
                    innerRadius={0.65}
                    padAngle={0.7}
                    cornerRadius={3}
                    activeOuterRadius={0.95}
                    enableArcLinkLabels={false}
                    arcLabelsSkipAngle={10}
                    colors={{ datum: "data.color" }}
                    isInteractive
                    tooltip={({ datum }) => (
                        <div className="rounded-lg border border-gray-700 bg-gray-900/95 px-3 py-2 shadow-lg">
                            <div className="text-sm font-medium text-white">{datum.label}</div>
                            <div className="text-xs text-gray-300 mt-1">
                                Valor: {formatBRL(datum.value)}
                            </div>
                        </div>
                    )}
                />

                {/* Centro (texto no donut) */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <div className="text-xs text-gray-400">Total</div>
                    <div className="text-xl font-bold text-white">{formatBRL(totalValue)}</div>
                </div>
            </div>
        </Card>
    );
}

