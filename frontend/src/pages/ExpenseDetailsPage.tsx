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
        console.log(data);
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
    <div className='flex flex-col gap-5 justify-center '>
      <div className='flex flex-col items-center justify-center p-5 pb-10 text-primary rounded-xl shadow-lg bg-[#F5EFD6] '>
        {isLoading ? (
          <p>Loading expense...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <article className='flex self-stretch gap-10'>
            <div className='flex flex-col gap-1.5 flex-1'>
              <p className='text-primary/60 font-heading text-xs rounded-full bg-primary/8 self-start px-3 py-1.5'>
                {expense?.date}
              </p>
              <h1 className='font-semibold text-2xl font-heading'>
                {expense?.storeName}
              </h1>
              <strong className='total-amount'>${expense?.totalAmount}</strong>
            </div>
            <div className='flex flex-col justify-center items-center'>
              <div className='flex flex-col justify-center items-center w-12 h-12'>
                <ShoppingCart size={30} />
              </div>
              <p className='text-xs'>{expense?.categoryName}</p>
            </div>
          </article>
        )}
      </div>
      <div className='flex gap-4 font-heading justify-center'>
        <Link
          to={`/expenses/${expenseId}/edit`}
          className='flex bg-primary text-md text-semibold text-white rounded-2xl h-12 w-24 items-center justify-center'
        >
          Edit
        </Link>
        <button
          className='flex  text-primary text-md rounded-2xl border-2  h-12 w-24 items-center justify-center'
          onClick={deleteExpense}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
