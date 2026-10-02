import "./ExpenseDetailsPage.css";
import {
  Coffee,
  Bus,
  Hospital,
  Utensils,
  ShoppingCart,
  Clapperboard,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

type Expense = {
  storeName: string;
  totalAmount: number;
  date: string;
  categoryName: string;
};

const categoryStyles = {
  // Dining: {
  //   color: "#EF4444",
  //   backgroundColor: "#FEE2E2",
  // },
  // Groceries: {
  //   color: "#22C55E",
  //   backgroundColor: "#DCFCE7",
  // },
  // Transportation: {
  //   color: "#3B82F6",
  //   backgroundColor: "#DBEAFE",
  // },
  // Entertainment: {
  //   color: "#A855F7",
  //   backgroundColor: "#F3E8FF",
  // },
  // Other: {
  //   color: "#F59E08",
  //   backgroundColor: "#FEF3C7",
  // },
};

export default function ExpenseDetailsPage() {
  const { expenseId } = useParams();
  const [expense, setExpense] = useState<Expense>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const getExpense = async () => {
      setIsLoading(true);
      setError("");

      try {
        // Call API to retrieve one expense
        const res = await fetch(
          `${import.meta.env.VITE_BASE_URL}/api/expenses/${expenseId}`,
          { credentials: "include" },
        );

        if (res.status === 401) {
          navigate("/", { replace: true });
          return;
        }

        if (res.status === 404) {
          setError("No record found.");
          setIsLoading(false);
          return;
        }

        if (!res.ok) {
          setError(
            "Failed to retrieve expense details. Please try again later.",
          );
          setIsLoading(false);
          return;
        }

        const data = await res.json();
        setExpense(data);
        setIsLoading(false);
      } catch {
        setError("Failed to retrieve expense details. Please try again later.");
        setIsLoading(false);
      }
    };

    getExpense();
  }, [navigate, expenseId]);

  const deleteExpense = async () => {
    try {
      // Call API
      // DELETE request
      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/expenses/${expenseId}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      if (res.status === 401) {
        navigate("/", { replace: true });
        return;
      }

      if (res.status === 404) {
        setError("No record found.");
        return;
      }

      if (!res.ok) {
        setError("Failed to delete the record. Please try again later.");
        return;
      }

      navigate("/expenses", { replace: true });
    } catch {
      setError("Failed to delete the record. Please try again later.");
    }
  };
  return (
    <div className='expense-details'>
      <div className='expense-content'>
        {isLoading ? (
          <p>Loading expense...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <>
            <div className='expense-hero'>
              <div className='store-row'>
                <h1>{expense?.storeName}</h1>
                <span>{expense?.date}</span>
              </div>
              <div className='amount-block'>
                <span>Total Amount</span>
                <strong className='total-amount'>
                  ${expense?.totalAmount}
                </strong>
              </div>
            </div>
            <div className='category-block'>{expense?.categoryName}</div>
            <div className='expense-actions'>
              <Link to={`/expenses/${expenseId}/edit`} className='edit-button'>
                Edit
              </Link>
              <button className='delete-button' onClick={deleteExpense}>
                Delete
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
