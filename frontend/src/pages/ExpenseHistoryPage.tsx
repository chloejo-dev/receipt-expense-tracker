import {
  ShoppingCart,
  Utensils,
  BrushCleaning,
  Shirt,
  SmartphoneCharging,
  Bus,
  Hospital,
  Film,
  Grid2X2,
  ChevronRight,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

type Expense = {
  expenseId: number;
  date: string;
  storeName: string;
  categoryName: string;
  totalAmount: number;
};

const CategoryLabels = {
  Groceries: {
    icon: <ShoppingCart />,
    color: "#22C55E",
    backgroundColor: "#DCFCE7",
  },
  Dining: {
    icon: <Utensils />,
    color: "#EF4444",
    backgroundColor: "#FEE2E2",
  },
  Household: {
    icon: <BrushCleaning />,
    color: "#EF4444",
    backgroundColor: "#FEE2E2",
  },
  Clothing: {
    icon: <Shirt />,
    color: "#F57A99",
    backgroundColor: "#FCDEE6",
  },
  Electronics: {
    icon: <SmartphoneCharging />,
    color: "#2163C4",
    backgroundColor: "#DEFCFC",
  },
  Transportation: {
    icon: <Bus />,
    color: "#3B82F6",
    backgroundColor: "#DBEAFE",
  },
  Health: {
    icon: <Hospital />,
    color: "#5BA022",
    backgroundColor: "#B8F28A",
  },
  Other: {
    icon: <Grid2X2 />,
    color: "#8F9DAE",
    backgroundColor: "#E0E5E2",
  },
  Entertainment: {
    icon: <Film />,
    color: "#A855F7",
    backgroundColor: "#F3E8FF",
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
        console.log(data);
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
    <div className='flex text-main'>
      <div className='flex flex-col w-full gap-3'>
        {isLoading ? (
          <p>Loading expenses...</p>
        ) : error ? (
          <p>{error}</p>
        ) : expenseGroups.length === 0 ? (
          <p>You have no expense history yet. Ready to add one?</p>
        ) : (
          expenseGroups.map(([date, dailyExpenses]) => (
            <section className='flex flex-col' key={date}>
              <h2 className='text-md font-heading'>{date}</h2>
              {dailyExpenses?.map((expense) => {
                return (
                  <Link
                    to={`/expenses/${expense.expenseId}`}
                    key={expense.expenseId}
                  >
                    <article className='flex items-center gap-1.5 m-1 pl-3 py-2 rounded-xl bg-white'>
                      <div className='flex flex-col flex-1'>
                        <h3 className='font-heading'>{expense.storeName}</h3>
                        <p className='font-light text-gray-500 text-xs'>
                          {expense.categoryName}
                        </p>
                      </div>
                      <p className='font-semibold'>${expense.totalAmount}</p>
                      <ChevronRight className='text-gray-400' strokeWidth={1} />
                    </article>
                  </Link>
                );
              })}
            </section>
          ))
        )}
      </div>
    </div>
  );
}
