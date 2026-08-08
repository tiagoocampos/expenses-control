import { Link, useLocation } from "react-router-dom";
import { CircleDollarSign, Menu as MenuIcon } from "lucide-react";

import { Sheet, SheetClose, SheetContent, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";

export function Header() {
    const location = useLocation();
    const isHomePage = location.pathname === "/";
    const isCategories = location.pathname === "/categories";
    const isRegister = location.pathname === "/register";

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

                    <li>
                        <Link
                            to="/register"
                            className={
                                isRegister
                                    ? "text-green-400 font-medium"
                                    : "text-gray-300 hover:text-white"
                            }
                        >
                            Criar conta
                        </Link>
                    </li>
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

                                    <SheetClose asChild>
                                        <Link
                                            to="/register"
                                            className={
                                                isRegister
                                                    ? "bg-gray-800 text-green-400 font-medium px-3 py-2 rounded-lg"
                                                    : "text-gray-300 hover:bg-gray-800 px-3 py-2 rounded-lg"
                                            }
                                        >
                                            Criar conta
                                        </Link>
                                    </SheetClose>
                                </nav>

                                <div className="mt-auto pt-4">
                                    <div className="text-gray-500 text-xs">ExpenseTracker</div>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </div>
    );
}


