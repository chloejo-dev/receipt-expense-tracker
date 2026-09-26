import { Link } from "react-router-dom";

export default function BottomNavigation() {
  return (
    <>
      <Link to='/dashboard'>Home</Link>
      <Link to='/add-receipt'>Add</Link>
      <Link to='/expense-history'>Expenses</Link>
      <Link to='/reports'>Reports</Link>
    </>
  );
}
