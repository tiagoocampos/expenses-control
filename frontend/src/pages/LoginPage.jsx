import { Link, useNavigate } from "react-router-dom";
import { Card } from "../components/Card";
import { Header } from "../components/Header";
import { useState } from "react";
import { toast } from "sonner";
import { userLogin } from "../services/api";


export function LoginPage() {

    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


    async function Login() {
        if (!email || !password) {
            toast.error("Preencha os campos corretamente");
            return;
        }

        try {
            const data = await userLogin({ email, password });
            localStorage.setItem("token", data.access_token);
            localStorage.setItem("user", JSON.stringify(data.user));
            toast.success("Login realizado com sucesso");
            navigate("/");
        } catch (error) {
            console.log(error)
            toast.error(error.message);
        }
    }

    function ClearForm() {

        setEmail("");
        setPassword("");

    }

    return (
        <div className="min-h-screen bg-gray-950 text-white">
            <Header />

            <div className="max-w-md mx-auto px-4 py-6 sm:py-10">
                <div className="mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold">Faça login na sua conta</h1>
                    <p className="text-gray-400 text-sm sm:text-base mt-1">
                        Faça login na sua conta para acompanhar seus gastos
                    </p>
                </div>

                <Card>
                    <form className="space-y-4">


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



                        <button
                            type="button"
                            className="w-full bg-green-600 hover:bg-green-500 transition-colors px-4 py-2 rounded-lg font-medium text-sm sm:text-base mt-2"
                            onClick={Login}
                        >
                            Entrar
                        </button>
                    </form>

                    <p className="text-gray-400 text-sm text-center mt-4">
                        Não tem uma conta?{" "}
                        <Link to="/register" className="text-green-400 hover:text-green-300">
                            Cadastre-se
                        </Link>
                    </p>
                </Card>
            </div>
        </div>
    );
}