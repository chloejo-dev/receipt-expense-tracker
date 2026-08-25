import { Routes, Route } from "react-router-dom";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import DashBoard from "./pages/Dashboard";

function App() {
  return (
    <Routes>
      <Route path='/sign-up' element={<SignUpPage />} />
      <Route path='/' element={<SignInPage />} />
      <Route path='/dashboard' element={<DashBoard />} />
    </Routes>
  );
}

export default App;
