import { Routes, Route } from "react-router-dom";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import DashBoard from "./pages/Dashboard";
import AddExpensePage from "./pages/AddExpensePage";

function App() {
  return (
    <Routes>
      <Route path='/sign-up' element={<SignUpPage />} />
      <Route path='/' element={<SignInPage />} />
      <Route path='/dashboard' element={<DashBoard />} />
      <Route path='/add-expense' element={<AddExpensePage />} />
    </Routes>
  );
}

export default App;
