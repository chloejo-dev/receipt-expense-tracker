import {
  Coffee,
  ShoppingCart,
  Bus,
  Film,
  Hospital,
  Utensils,
  Grid2X2,
} from "lucide-react";
import "./ExpenseHistoryPage.css";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

type Expense = {
  expenseId: number;
  date: string;
  storeName: string;
  categoryLabel: string;
  totalAmount: number;
};

const CategoryLabels = {
  Dining: {
    icon: <Utensils />,
    color: "#EF4444",
    backgroundColor: "#FEE2E2",
  },
  Groceries: {
    icon: <ShoppingCart />,
    color: "#22C55E",
    backgroundColor: "#DCFCE7",
  },
  Transportation: {
    icon: <Bus />,
    color: "#3B82F6",
    backgroundColor: "#DBEAFE",
  },
  Entertainment: {
    icon: <Film />,
    color: "#A855F7",
    backgroundColor: "#F3E8FF",
  },
  "Multiple Categories": {
    icon: <Grid2X2 />,
    color: "#F59E08",
    backgroundColor: "#FEF3C7",
  },
};

export default function ExpenseHistoryPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const getExpenses = async () => {
      setError("");

      // Call API to get the user's expenses
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BASE_URL}/api/expenses`,
          {
            // Tell the browser to include cookie (credentials)
            credentials: "include",
          },
        );

        // 401 response -> Redirect to the sign in page
        if (res.status === 401) {
          navigate("/", { replace: true });
          return;
        }

        // Handle other failure responses
        if (!res.ok) {
          setError(
            "Failed to retrieve expense history. Please try again later.",
          );
          setIsLoading(false);
          return;
        }

        const data = await res.json();
        setExpenses(data);
        setIsLoading(false);
      } catch {
        setError("Failed to retrieve expense history. Please try again later.");
        setIsLoading(false);
      }
    };

    getExpenses();
  }, [navigate]);

  // Group expenses by date
  const expensesByDate = Object.groupBy(expenses, (expense) => expense.date);
  const expenseGroups = Object.entries(expensesByDate); // [[key, value], [key, value], ...]

  return (
    <div className='history-page'>
      <div className='history-content'>
        {isLoading ? (
          <p>Loading expenses...</p>
        ) : error ? (
          <p>{error}</p>
        ) : expenseGroups.length === 0 ? (
          <p>You have no expense history yet. Ready to add one?</p>
        ) : (
          expenseGroups.map(([date, dailyExpenses]) => (
            <section className='receipt-group' key={date}>
              <h2 className='receipt-date'>{date}</h2>
              {dailyExpenses?.map((expense) => (
                <Link
                  to={`/expenses/${expense.expenseId}`}
                  key={expense.expenseId}
                >
                  <article className='receipt-card'>
                    <Coffee />
                    <h3>{expense.storeName}</h3>
                    <p className='receipt-total-amount'>
                      ${expense.totalAmount}
                    </p>
                    <p>{expense.categoryLabel}</p>
                  </article>
                </Link>
              ))}
            </section>
          ))
        )}
      </div>
    </div>
  );
}
