import { Routes, Route } from "react-router-dom";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import DashBoard from "./pages/Dashboard";
import AddReceiptPage from "./pages/AddReceiptPage";
import ExpenseHistoryPage from "./pages/ExpenseHistoryPage";
import ReceiptDetailsPage from "./pages/ReceiptDetailsPage";

function App() {
  return (
    <Routes>
      <Route path='/sign-up' element={<SignUpPage />} />
      <Route path='/' element={<SignInPage />} />
      <Route path='/dashboard' element={<DashBoard />} />
      <Route path='/add-receipt' element={<AddReceiptPage />} />
      <Route path='/receipt-details' element={<ReceiptDetailsPage />} />
      <Route path='/expense-history' element={<ExpenseHistoryPage />} />
    </Routes>
  );
}

export default App;
