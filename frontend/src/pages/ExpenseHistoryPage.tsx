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
import { useNavigate } from "react-router-dom";

type Receipt = {
  receiptId: number;
  date: string;
  storeName: string;
  categoryLabel: string;
  totalAmount: number;
};

const CategoryLabels = {
  Dining: {
    icon: <Coffee />,
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
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const getReceipts = async () => {
      setError("");

      // Call API to get the user's receipts
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BASE_URL}/api/receipts`,
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
        setReceipts(data);
        setIsLoading(false);
      } catch {
        setError("Failed to retrieve expense history. Please try again later.");
        setIsLoading(false);
      }
    };

    getReceipts();
  }, [navigate]);

  // Group expenses by date
  const receiptsByDate = Object.groupBy(receipts, (receipt) => receipt.date);
  const receiptGroups = Object.entries(receiptsByDate); // [[key, value], [key, value], ...]

  return (
    <div className='history-page'>
      <header className='history-header'>
        <h1>Expense History</h1>
      </header>
      <main className='history-content'>
        {isLoading ? (
          <p>Loading receipts...</p>
        ) : error ? (
          <p>{error}</p>
        ) : receiptGroups.length === 0 ? (
          <p>You have no expense history yet. Ready to add one?</p>
        ) : (
          receiptGroups.map(([date, dailyReceipts]) => (
            <section className='receipt-group' key={date}>
              <h2 className='receipt-date'>{date}</h2>
              {dailyReceipts?.map((receipt) => (
                <article key={receipt.receiptId} className='receipt-card'>
                  <Coffee />
                  <h3>{receipt.storeName}</h3>
                  <p className='receipt-total-amount'>${receipt.totalAmount}</p>
                  <p>{receipt.categoryLabel}</p>
                </article>
              ))}
            </section>
          ))
        )}
      </main>
    </div>
  );
}
