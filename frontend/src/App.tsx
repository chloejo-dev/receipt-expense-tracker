import { Routes, Route } from "react-router-dom";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import AddExpensePage from "./pages/AddExpensePage";
import ExpenseHistoryPage from "./pages/ExpenseHistoryPage";
import ExpenseDetailsPage from "./pages/ExpenseDetailsPage";
import DashBoard from "./pages/Dashboard";
import EditExpensePage from "./pages/EditExpensePage";
import AppLayout from "./layouts/AppLayout";

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path='/sign-up' element={<SignUpPage />} />
        <Route path='/' element={<SignInPage />} />
        <Route path='/add-expense' element={<AddExpensePage />} />
        <Route path='/expenses/:expenseId' element={<ExpenseDetailsPage />} />
        <Route path='/expenses/:expenseId/edit' element={<EditExpensePage />} />
        <Route path='/expenses' element={<ExpenseHistoryPage />} />
        <Route path='/dashboard' element={<DashBoard />} />
      </Route>
    </Routes>
  );
}

export default App;
