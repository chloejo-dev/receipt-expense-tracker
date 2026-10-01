import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

// Define types in a separate types file and import it to use
import type {
  StoreOption,
  CategoryOption,
  ExpenseOptionsResponse,
} from "./expenseOptions.types";

type Expense = {
  amount: number;
  categoryId: number;
  categoryName: string;
  expenseId: number;
};

export default function EditReceiptPage() {
  const { receiptId } = useParams();
  // Get all stores and categories from the server
  const [storeList, setStoreList] = useState<StoreOption[]>([]);
  const [categoryList, setCategoryList] = useState<CategoryOption[]>([]);
  const [date, setDate] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [storeId, setStoreId] = useState(0);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [inputError, setInputError] = useState({ type: "", message: "" });

  const [error, setError] = useState("");

  const navigate = useNavigate();
  // Get store and category options
  useEffect(() => {
    const getStoresAndCategories = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BASE_URL}/api/expense-options`,
        );

        if (!res.ok) {
          // Handle failure responses
          setError("Something is wrong. Please try again later.");
          return;
        }

        const data: ExpenseOptionsResponse = await res.json();

        setStoreList(data.stores);
        setCategoryList(data.categories);
      } catch {
        // Handle errors
        setError("Something is wrong. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    getStoresAndCategories();
  }, []);

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
          setError("No record found.");
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

        // Set and render the retrieved data
        setDate(data.date);
        setTotalAmount(String(data.totalAmount));
        setStoreId(data.storeId);
        setExpenses(data.expenses);
        setIsLoading(false);
      } catch {
        setError("Failed to retrieve receipt details. Please try again later.");
        setIsLoading(false);
      }
    };

    getReceipt();
  }, [navigate, receiptId]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p role='alert'>{error}</p>;
  if (!expenses) return <p>No receipt data found.</p>;

  const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    if (!date) {
      setInputError({ type: "date", message: "Please enter a date." });
      return;
    }

    // Convert totalAmount string into a number
    const parsedTotalAmount = Number(totalAmount);

    if (
      !totalAmount ||
      !Number.isFinite(parsedTotalAmount) ||
      parsedTotalAmount < 0.01 ||
      parsedTotalAmount > 999999.99
    ) {
      setInputError({
        type: "total amount",
        message: "Please enter a valid total amount.",
      });
      return;
    }

    if (!storeId) {
      setInputError({
        type: "store",
        message: "Please select a store.",
      });
      return;
    }

    // To-do: Replace this with categoryId
    if (!expenses) {
      setInputError({
        type: "category",
        message: "Please select a category.",
      });
      return;
    }

    setError("");

    try {
      // Call API
      // PATCH request
      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/receipts/${receiptId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            Date: date,
            totalAmount: parsedTotalAmount,
            StoreId: storeId,
            Expenses: expenses,
          }),
        },
      );

      if (!res.ok) {
        setError("Failed to edit the record. Please try again.");
        return;
      }

      console.log("Edit success!");
    } catch {
      setError("Oops, failed to edit the record. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className='expense-form'>
      <div className='expense-form-field'>
        <label htmlFor='date'>Date</label>
        <input
          type='date'
          id='date'
          name='date'
          required
          value={date}
          onChange={(e) => {
            setDate(e.target.value);
          }}
        />
      </div>
      <div className='expense-form-field'>
        <label htmlFor='total'>Total Amount ($)</label>
        <input
          type='number'
          id='total'
          name='total'
          required
          step='0.01'
          min='0.01'
          max='999999.99'
          value={totalAmount}
          onChange={(e) => {
            setTotalAmount(e.target.value);
          }}
        />
      </div>
      <div className='expense-form-field'>
        <label htmlFor='store'>Store</label>
        <select
          name='store'
          id='store'
          className='expense-form-select'
          value={storeId}
          onChange={(e) => {
            setStoreId(Number(e.target.value));
          }}
        >
          <option value={0} disabled>
            Select store
          </option>
          {storeList.map((store) => (
            <option value={store.storeId} key={store.storeId}>
              {store.storeName}
            </option>
          ))}
        </select>
      </div>
      <div className='expense-form-field'>
        {expenses.map((expense) => (
          <div key={expense.expenseId}>
            <label htmlFor={`category-${expense.expenseId}`}>Category</label>
            <select
              name='category'
              id={`category-${expense.expenseId}`}
              value={expense.categoryId}
              onChange={(e) => {
                const selectedCategory = categoryList.find(
                  (category) => category.categoryId === Number(e.target.value),
                );

                if (!selectedCategory) return;
                console.log(selectedCategory);
                setExpenses((current) =>
                  current.map((item) =>
                    item.expenseId === expense.expenseId
                      ? {
                          ...item,
                          amount: Number(totalAmount),
                          categoryId: selectedCategory.categoryId,
                          categoryName: selectedCategory.categoryName,
                        }
                      : item,
                  ),
                );
              }}
            >
              {categoryList.map((category) => (
                <option value={category.categoryId} key={category.categoryId}>
                  {category.categoryName}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
      <div>
        <button type='submit'>Save</button>
        <button type='button'>Discard</button>
      </div>
    </form>
  );
}
