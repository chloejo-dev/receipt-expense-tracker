import "./ReceiptDetailsPage.css";
import {
  Coffee,
  Bus,
  Hospital,
  Utensils,
  ShoppingCart,
  Clapperboard,
} from "lucide-react";
import { use, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

type Receipt = {
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

export default function ReceiptDetailsPage() {
  const { receiptId } = useParams();
  const [receipt, setReceipt] = useState<Receipt>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const getReceipt = async () => {
      setIsLoading(true);
      setError("");

      try {
        // Call API to retrieve one receipt
        const res = await fetch(
          `${import.meta.env.VITE_BASE_URL}/api/receipts/${receiptId}`,
          { credentials: "include" },
        );

        if (res.status === 401) {
          navigate("/", { replace: true });
          return;
        }

        if (res.status === 404) {
          setError("No record found");
          setIsLoading(false);
          return;
        }

        if (!res.ok) {
          setError(
            "Failed to retrieve receipt details. Please try again later.",
          );
          setIsLoading(false);
          return;
        }

        const data = await res.json();
        console.log(data);
        setReceipt(data);
        setIsLoading(false);
      } catch {
        setError("Failed to retrieve receipt details. Please try again later.");
        setIsLoading(false);
      }
    };

    getReceipt();
  }, [navigate, receiptId]);

  return (
    <div className='expense-details'>
      <div className='expense-content'>
        {isLoading ? (
          <p>Loading receipt...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <>
            <div className='expense-hero'>
              <div className='store-row'>
                <h1>{receipt?.storeName}</h1>
                <span>{receipt?.date}</span>
              </div>
              <div className='amount-block'>
                <span>Total Amount</span>
                <strong className='total-amount'>
                  ${receipt?.totalAmount}
                </strong>
              </div>
            </div>
            <div className='category-block'>{receipt?.categoryName}</div>
            <div className='expense-actions'>
              <button className='edit-button'>Edit</button>
              <button className='delete-button'>Delete</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
