import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ExpensesPage } from "./pages/ExpensesPage";
import { AddExpensePage } from "./pages/AddExpensePage";

export function RoutesApp() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<ExpensesPage />} />
                <Route path="/despesas" element={<AddExpensePage />} />
            </Routes>
        </BrowserRouter>
    );
}

