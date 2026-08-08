import { Link, useLocation, useNavigate } from "react-router-dom";
import { CircleDollarSign, LogOut, Menu as MenuIcon } from "lucide-react";

import { Sheet, SheetClose, SheetContent, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";

export function Header() {
    const location = useLocation();
    const navigate = useNavigate();
    const isHomePage = location.pathname === "/";
    const isCategories = location.pathname === "/categories";
    const isRegister = location.pathname === "/register";
    const isLogin = location.pathname === "/login";

    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const isAuthenticated = !!token;

    function handleLogout() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    }

    return (
        <div className="bg-gray-950 border-b border-gray-800">
            <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <CircleDollarSign className="text-green-500" />
                    <h1 className="text-xl font-bold">
                        ExpenseTracker<span className="text-green-500">.</span>
                    </h1>
                </div>

                {/* Desktop menu */}
                <ul className="hidden lg:flex gap-6 text-sm items-center">
                    <li className={"text-gray-300"}>Resumo</li>

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

                    <li className={"text-gray-300"}>
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
                            <li className="text-gray-300">
                                {user?.name || "Usuário"}
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
                        <>
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

                        </>
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

                        <SheetContent side="left" className="bg-gray-950 text-white border-gray-800 w-80">
                            <div className="flex flex-col h-full">
                                <div className="text-gray-400 text-sm mb-4">Menu</div>

                                <nav className="flex flex-col gap-2">
                                    <SheetClose asChild>
                                        <Link
                                            to="/"
                                            className={
                                                isHomePage
                                                    ? "bg-gray-800 text-green-400 font-medium px-3 py-2 rounded-lg"
                                                    : "text-gray-300 hover:bg-gray-800 px-3 py-2 rounded-lg"
                                            }
                                        >
                                            Página inicial
                                        </Link>
                                    </SheetClose>

                                    <SheetClose asChild>
                                        <Link
                                            to="/categories"
                                            className={
                                                isCategories
                                                    ? "bg-gray-800 text-green-400 font-medium px-3 py-2 rounded-lg"
                                                    : "text-gray-300 hover:bg-gray-800 px-3 py-2 rounded-lg"
                                            }
                                        >
                                            Categorias
                                        </Link>
                                    </SheetClose>

                                    {isAuthenticated ? (
                                        <SheetClose asChild>
                                            <button
                                                onClick={handleLogout}
                                                className="text-left text-gray-300 hover:bg-gray-800 px-3 py-2 rounded-lg"
                                            >
                                                Sair
                                            </button>
                                        </SheetClose>
                                    ) : (
                                        <>
                                            <SheetClose asChild>
                                                <Link
                                                    to="/login"
                                                    className={
                                                        isLogin
                                                            ? "bg-gray-800 text-green-400 font-medium px-3 py-2 rounded-lg"
                                                            : "text-gray-300 hover:bg-gray-800 px-3 py-2 rounded-lg"
                                                    }
                                                >
                                                    Entrar / Criar conta
                                                </Link>
                                            </SheetClose>


                                        </>
                                    )}
                                </nav>

                                <div className="mt-auto pt-4">
                                    <div className="text-gray-500 text-xs">
                                        {isAuthenticated
                                            ? `Logado como ${user?.name || "Usuário"}`
                                            : "ExpenseTracker"}
                                    </div>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </div>
    );
}
