import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ExpensesPage } from "./pages/ExpensesPage";
import { AddExpensePage } from "./pages/AddExpensePage";
import { CategoriesPage } from "./pages/CategoriesPage";
import { RegisterPage } from "./pages/RegisterPage";
import { LoginPage } from "./pages/LoginPage";

export function RoutesApp() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<ExpensesPage />} />
                <Route path="/despesas" element={<AddExpensePage />} />
                <Route path="/categories" element={<CategoriesPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />
            </Routes>
        </BrowserRouter>
    );
}
