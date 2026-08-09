import { useEffect, useMemo, useState } from "react";
import { ResponsivePie } from "@nivo/pie";
import { Card } from "./Card";
import { getExpensesByCategory, getIncomes } from "../services/api";
import { Link } from "react-router-dom";


const COLORS = [
    "#22c55e", // green-500
    "#3b82f6", // blue-500
    "#f59e0b", // amber-500
    "#ec4899", // pink-500
    "#a78bfa", // violet-400
    "#06b6d4", // cyan-500
    "#ef4444", // red-500
    "#16a34a", // green-600
    "#84cc16", // lime-500
];

const isAuthenticated = !!localStorage.getItem("token");

function formatBRL(value) {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(value);
}

function formatPercent(value) {
    return new Intl.NumberFormat("pt-BR", {
        style: "percent",
        maximumFractionDigits: 1,
    }).format(value / 100);
}

export function ExpensesChart() {
    const [grouped, setGrouped] = useState([]);
    const [totalIncome, setTotalIncome] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            setLoading(true);
            try {
                const [expensesData, incomesData] = await Promise.all([
                    getExpensesByCategory(),
                    getIncomes(),
                ]);

                if (!cancelled) {
                    setGrouped(Array.isArray(expensesData) ? expensesData : []);
                    const incomeSum = Array.isArray(incomesData)
                        ? incomesData.reduce((sum, inc) => sum + Number(inc.amount), 0)
                        : 0;
                    setTotalIncome(incomeSum);
                }
            } catch (e) {
                console.log(e);
                if (!cancelled) {
                    setGrouped([]);
                    setTotalIncome(0);
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();

        return () => {
            cancelled = true;
        };
    }, []);


    const chartData = useMemo(() => {
        const sanitized = (grouped || []).filter((x) => x && typeof x.total === "number");

        const totalExpenses = sanitized.reduce((acc, x) => acc + (Number(x.total) || 0), 0);

        if (totalExpenses <= 0) return [];

        return sanitized
            .map((x) => {
                const value = Number(x.total) || 0;
                const percentOfExpenses = totalExpenses > 0 ? (value / totalExpenses) * 100 : 0;
                const percentOfIncome = totalIncome > 0 ? (value / totalIncome) * 100 : null;
                return {
                    name: x.category_name,
                    value,
                    percentOfExpenses,
                    percentOfIncome,
                };
            })
            .filter((x) => x.value > 0);
    }, [grouped, totalIncome]);

    const totalValue = useMemo(() => chartData.reduce((acc, x) => acc + x.value, 0), [chartData]);

    const balance = totalIncome - totalValue;
    const percentSpentOfIncome = totalIncome > 0 ? (totalValue / totalIncome) * 100 : null;
    const isOverBudget = totalIncome > 0 && totalValue > totalIncome;

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
                <div className="flex flex-col gap-5 text-gray-400">
                    <h1>Gráfico de despesas</h1><p>Aqui será exibido o gráfico das suas despesas. <br></br> <Link className="text-green-400 hover:text-green-200" to={isAuthenticated ? "/despesas" : "/login"}>Adicione uma despesa</Link> para monitorar seus gastos.</p></div>
            </Card >
        );
    }

    return (
        <Card>
            <div className="flex items-center justify-between gap-4 mb-4">
                <div>
                    <div className="text-gray-400 text-sm">Distribuição por categoria</div>
                    <div className="text-sm text-gray-200 mt-1">Acompanhe o gráfico das suas despesas</div>
                </div>
                <div className="text-right">
                    <div className="text-gray-400 text-xs">Total gasto</div>
                    <div className="text-green-300 font-semibold">{formatBRL(totalValue)}</div>
                </div>
            </div>

            {totalIncome > 0 && (
                <div className="mb-5 bg-gray-950 border border-gray-800 rounded-xl p-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-gray-400">Renda total</span>
                        <span className="font-semibold text-white">{formatBRL(totalIncome)}</span>
                    </div>

                    <div className="w-full h-2 rounded-full bg-gray-800 overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all ${isOverBudget ? "bg-red-500" : "bg-green-500"}`}
                            style={{ width: `${Math.min(percentSpentOfIncome, 100)}%` }}
                        />
                    </div>

                    <div className="flex items-center justify-between text-xs mt-2">
                        <span className="text-gray-400">
                            {formatPercent(percentSpentOfIncome)} da renda gasta
                        </span>
                        <span className={isOverBudget ? "text-red-400 font-medium" : "text-gray-300"}>
                            {isOverBudget
                                ? `Estourou em ${formatBRL(Math.abs(balance))}`
                                : `Sobrou ${formatBRL(balance)}`}
                        </span>
                    </div>
                </div>
            )}

            <div className="h-64 md:h-80 relative">

                <ResponsivePie
                    data={chartData.map((x, idx) => ({
                        id: x.name,
                        label: x.name,
                        value: x.value,
                        color: COLORS[idx % COLORS.length],
                        percentOfIncome: x.percentOfIncome,
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
                            {datum.data.percentOfIncome !== null && (
                                <div className="text-xs text-gray-400 mt-0.5">
                                    {formatPercent(datum.data.percentOfIncome)} da renda
                                </div>
                            )}
                        </div>
                    )}
                />


                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <div className="text-xs text-gray-400">Total</div>
                    <div className="text-xl font-bold text-white">{formatBRL(totalValue)}</div>
                </div>
            </div>
        </Card>
    );
}