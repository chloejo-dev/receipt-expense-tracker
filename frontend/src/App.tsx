import { Routes, Route } from "react-router-dom";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import AddReceiptPage from "./pages/AddReceiptPage";
import ExpenseHistoryPage from "./pages/ExpenseHistoryPage";
import ReceiptDetailsPage from "./pages/ReceiptDetailsPage";
import DashBoard from "./pages/Dashboard";
import AppLayout from "./layouts/AppLayout";

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path='/sign-up' element={<SignUpPage />} />
        <Route path='/' element={<SignInPage />} />
        <Route path='/add-receipt' element={<AddReceiptPage />} />
        <Route path='/receipts/:receiptId' element={<ReceiptDetailsPage />} />
        <Route path='/expense-history' element={<ExpenseHistoryPage />} />
        <Route path='/dashboard' element={<DashBoard />} />
      </Route>
    </Routes>
  );
}

export default App;
