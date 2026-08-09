import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Header } from "../components/Header";
import { Card } from "../components/Card";
import { verifyEmail } from "../services/api";

export function VerifyEmailPage() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const [status, setStatus] = useState("loading"); // loading | success | error
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (!token) {
            setStatus("error");
            setMessage("Link de verificação inválido — token não encontrado.");
            return;
        }

        async function verify() {
            try {
                const data = await verifyEmail({ token });
                setStatus("success");
                setMessage(data.message || "Email verificado com sucesso!");
            } catch (error) {
                console.log(error);
                setStatus("error");
                setMessage(error.message || "Não foi possível verificar seu email.");
            }
        }

        verify();
    }, [token]);

    return (
        <div className="min-h-screen bg-gray-950 text-white">
            <Header />

            <div className="max-w-md mx-auto px-4 py-10 sm:py-16">
                <Card>
                    <div className="flex flex-col items-center text-center gap-4 py-6">
                        {status === "loading" && (
                            <>
                                <Loader2 className="h-12 w-12 text-green-500 animate-spin" />
                                <p className="text-gray-300">Verificando seu email...</p>
                            </>
                        )}

                        {status === "success" && (
                            <>
                                <CheckCircle2 className="h-12 w-12 text-green-500" />
                                <h1 className="text-xl font-bold">Email verificado!</h1>
                                <p className="text-gray-400 text-sm">{message}</p>
                                <Link
                                    to="/login"
                                    className="mt-2 bg-green-600 hover:bg-green-500 transition-colors px-4 py-2 rounded-lg font-medium text-sm"
                                >
                                    Ir para o login
                                </Link>
                            </>
                        )}

                        {status === "error" && (
                            <>
                                <XCircle className="h-12 w-12 text-red-500" />
                                <h1 className="text-xl font-bold">Não foi possível verificar</h1>
                                <p className="text-gray-400 text-sm">{message}</p>
                            </>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
}