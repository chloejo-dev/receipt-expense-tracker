import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import BottomNavigation from "../components/BottomNavigation";

export default function AppLayout() {
  return (
    <>
      <Header></Header>
      <main>
        <Outlet />
      </main>
      <BottomNavigation />
    </>
  );
}
