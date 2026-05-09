import { Link, useLocation } from "react-router-dom";
import { CircleDollarSign } from "lucide-react";

export function Header() {
    const location = useLocation();
    const isDespesas = location.pathname === "/" || location.pathname === "/despesas";

    return (
        <div className="bg-gray-950 border-b border-gray-800">
            <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <CircleDollarSign className="text-green-500" />
                    <h1 className="text-xl font-bold">
                        ExpenseTracker<span className="text-green-500">.</span>
                    </h1>
                </div>

                <ul className="flex gap-6 text-sm">
                    <li className={"text-gray-300"}>Resumo</li>

                    <li>
                        <Link
                            to="/"
                            className={isDespesas ? "text-green-400 font-medium" : "text-gray-300 hover:text-white"}
                        >
                            Despesas
                        </Link>
                    </li>

                    <li className={"text-gray-300"}><Link to="/categories">Categorias</Link></li>
                </ul>
            </div>
        </div>
    );
}

