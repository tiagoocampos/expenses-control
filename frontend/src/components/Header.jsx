import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    CircleDollarSign,
    Home,
    Tags,
    User,
    LogOut,
    LogIn,
    Menu as MenuIcon,
} from "lucide-react";

import { Sheet, SheetClose, SheetContent, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";

export function Header() {
    const location = useLocation();
    const navigate = useNavigate();
    const isHomePage = location.pathname === "/";
    const isCategories = location.pathname === "/categories";
    const isLogin = location.pathname === "/login";
    const isProfile = location.pathname === "/profile";

    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const isAuthenticated = !!token;

    function handleLogout() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    }

    function initials(name) {
        if (!name) return "?";
        return name
            .split(" ")
            .filter(Boolean)
            .slice(0, 2)
            .map((n) => n[0].toUpperCase())
            .join("");
    }

    const mobileLinkClass = (active) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors border-l-2 ${active
            ? "bg-gray-800 text-green-400 font-medium border-green-500"
            : "text-gray-300 hover:bg-gray-800 hover:text-white border-transparent"
        }`;

    return (
        <div className="bg-gray-950 border-b border-gray-800">
            <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2">
                    <CircleDollarSign className="text-green-500" />
                    <h1 className="text-xl font-bold select-none">
                        ExpenseTracker<span className="text-green-500">.</span>
                    </h1>
                </Link>

                {/* Desktop menu */}
                <ul className="hidden lg:flex gap-6 text-sm items-center">
                    <li>
                        <Link
                            to="/"
                            className={
                                isHomePage
                                    ? "text-green-400 font-medium"
                                    : "text-gray-300 hover:text-white"
                            }
                        >
                            Página inicial
                        </Link>
                    </li>

                    <li>
                        <Link
                            to="/categories"
                            className={
                                isCategories
                                    ? "text-green-400 font-medium"
                                    : "text-gray-300 hover:text-white"
                            }
                        >
                            Categorias
                        </Link>
                    </li>

                    {isAuthenticated ? (
                        <>
                            <li>
                                <Link
                                    to="/profile"
                                    className={
                                        isProfile
                                            ? "text-green-400 font-medium"
                                            : "text-gray-300 hover:text-white"
                                    }
                                >
                                    {user?.name || "Usuário"}
                                </Link>
                            </li>
                            <li>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-1 text-gray-300 hover:text-white"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Sair
                                </button>
                            </li>
                        </>
                    ) : (
                        <li>
                            <Link
                                to="/login"
                                className={
                                    isLogin
                                        ? "text-green-400 font-medium"
                                        : "text-gray-300 hover:text-white"
                                }
                            >
                                Entrar / Criar conta
                            </Link>
                        </li>
                    )}
                </ul>

                {/* Mobile menu */}
                <div className="lg:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white">
                                <MenuIcon className="h-5 w-5" />
                                <span className="sr-only">Abrir menu</span>
                            </Button>
                        </SheetTrigger>

                        <SheetContent side="left" className="bg-gray-950 text-white border-gray-800 w-80 p-0">
                            <div className="flex flex-col h-full">
                                {isAuthenticated ? (
                                    <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-800">
                                        <div className="h-11 w-11 rounded-full bg-green-600/20 border border-green-600/40 flex items-center justify-center text-green-400 font-semibold shrink-0">
                                            {initials(user?.name)}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-semibold truncate">{user?.name || "Usuário"}</p>
                                            <p className="text-gray-400 text-xs truncate">{user?.email}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 px-5 py-5 border-b border-gray-800">
                                        <CircleDollarSign className="text-green-500 h-5 w-5" />
                                        <p className="font-bold">
                                            ExpenseTracker<span className="text-green-500">.</span>
                                        </p>
                                    </div>
                                )}

                                <nav className="flex flex-col gap-1 px-3 py-4">
                                    <SheetClose asChild>
                                        <Link to="/" className={mobileLinkClass(isHomePage)}>
                                            <Home className="h-4 w-4" />
                                            Página inicial
                                        </Link>
                                    </SheetClose>

                                    <SheetClose asChild>
                                        <Link to="/categories" className={mobileLinkClass(isCategories)}>
                                            <Tags className="h-4 w-4" />
                                            Categorias
                                        </Link>
                                    </SheetClose>

                                    {isAuthenticated && (
                                        <SheetClose asChild>
                                            <Link to="/profile" className={mobileLinkClass(isProfile)}>
                                                <User className="h-4 w-4" />
                                                Meu perfil
                                            </Link>
                                        </SheetClose>
                                    )}

                                    {!isAuthenticated && (
                                        <SheetClose asChild>
                                            <Link to="/login" className={mobileLinkClass(isLogin)}>
                                                <LogIn className="h-4 w-4" />
                                                Entrar / Criar conta
                                            </Link>
                                        </SheetClose>
                                    )}
                                </nav>

                                {isAuthenticated && (
                                    <div className="mt-auto px-3 pb-4">
                                        <SheetClose asChild>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                                            >
                                                <LogOut className="h-4 w-4" />
                                                Sair da conta
                                            </button>
                                        </SheetClose>
                                    </div>
                                )}
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </div>
    );
}