import { Link, useNavigate } from "react-router-dom";
import { Card } from "../components/Card";
import { Header } from "../components/Header";
import { useState } from "react";
import { toast } from "sonner";
import { userRegister } from "../services/api";

export function RegisterPage() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    async function Register() {
        if (!name || !email || !password || !confirmPassword) {
            toast.error("Preencha os campos corretamente");
            return;
        }
        if (password !== confirmPassword) {
            toast.error("As senhas não coincidem");
            return;
        }

        try {
            const data = await userRegister({ name, email, password });
            toast.success("Conta criada com sucesso, verifique seu email para ativar a conta");
            ClearForm();
            navigate("/login");
        } catch (error) {
            console.log(error)
            toast.error(error.message);
        }
    }

    function ClearForm() {
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
    }

    return (
        <div className="min-h-screen bg-gray-950 text-white">
            <Header />

            <div className="max-w-md mx-auto px-4 py-6 sm:py-10">
                <div className="mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold">Criar conta</h1>
                    <p className="text-gray-400 text-sm sm:text-base mt-1">
                        Cadastre-se para começar a controlar seus gastos
                    </p>
                </div>

                <Card>
                    <form className="space-y-4">
                        <div>
                            <label className="block text-sm text-gray-300 mb-1">Nome</label>
                            <input
                                type="text"
                                placeholder="Seu nome"
                                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 outline-none focus:border-green-600 text-sm sm:text-base"
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-300 mb-1">Email</label>
                            <input
                                type="email"
                                placeholder="seu@email.com"
                                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 outline-none focus:border-green-600 text-sm sm:text-base"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-300 mb-1">Senha</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 outline-none focus:border-green-600 text-sm sm:text-base"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-300 mb-1">Confirmar senha</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 outline-none focus:border-green-600 text-sm sm:text-base"
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>

                        <button
                            type="button"
                            className="w-full bg-green-600 hover:bg-green-500 transition-colors px-4 py-2 rounded-lg font-medium text-sm sm:text-base mt-2"
                            onClick={Register}
                        >
                            Criar conta
                        </button>
                    </form>

                    <p className="text-gray-400 text-sm text-center mt-4">
                        Já tem uma conta?{" "}
                        <Link to="/login" className="text-green-400 hover:text-green-300">
                            Entrar
                        </Link>
                    </p>
                </Card>
            </div>
        </div>
    );
}