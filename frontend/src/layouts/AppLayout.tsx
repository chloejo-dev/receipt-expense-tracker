import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import BottomNavigation from "../components/BottomNavigation";

export default function AppLayout() {
  return (
    <div className='min-h-dvh flex flex-col'>
      <Header></Header>
      <main className='w-full flex-1 pb-28 bg-gray-100'>
        <div className='w-full max-w-150 mx-auto p-5'>
          <Outlet />
        </div>
      </main>
      <BottomNavigation />
    </div>
  );
}
