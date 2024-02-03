/**
 * @author [Sachin Pai]
 * @email [sachin.pai@atmecs.com]
 * @desc This file is responsible for managing routes through out the app
 */
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/App";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";
import RegisterPage from "./pages/RegisterPage";
import FinanceDashboard from "./pages/FinanceDashboard";
import AddTransactionPage from "./pages/AddTransaction";
import AllTransactions from "./pages/AllTranctions";
import Showbalances from "./pages/ShowBalances";


const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/financeDashboard" element={<FinanceDashboard />} />
                <Route path="/addTransaction" element={<AddTransactionPage />} />
                <Route path="/allTransactions" element={<AllTransactions />} />
                <Route path="/showBalances" element={<Showbalances />} />

                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
};

export default Router