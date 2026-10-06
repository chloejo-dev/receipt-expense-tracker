import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

// Define types in a separate types file and import it to use
import type {
  StoreOption,
  CategoryOption,
  ExpenseOptionsResponse,
} from "./expenseOptions.types";

export default function EditExpensePage() {
  const { expenseId } = useParams();
  // Get all stores and categories from the server
  const [storeList, setStoreList] = useState<StoreOption[]>([]);
  const [categoryList, setCategoryList] = useState<CategoryOption[]>([]);
  const [date, setDate] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [storeId, setStoreId] = useState(0);
  const [categoryId, setCategoryId] = useState(0);
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
        // Set and render the retrieved data
        setDate(data.date);
        setTotalAmount(String(data.totalAmount));
        setStoreId(data.storeId);
        setCategoryId(data.categoryId);
        setIsLoading(false);
      } catch {
        setError("Failed to retrieve expense details. Please try again later.");
        setIsLoading(false);
      }
    };

    getExpense();
  }, [navigate, expenseId]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p role='alert'>{error}</p>;
  if (!categoryId) return <p>No expense data found.</p>;

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

    if (!categoryId) {
      setInputError({
        type: "category",
        message: "Please select a category.",
      });
      return;
    }

    setError("");

    try {
      // Call API
      // PUT request
      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/expenses/${expenseId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            Date: date,
            totalAmount: parsedTotalAmount,
            StoreId: storeId,
            CategoryId: categoryId,
          }),
        },
      );

      if (res.status === 400) {
        const message = await res.text();
        setError(message);
        return;
      }

      if (res.status === 401) {
        navigate("/", { replace: true });
        return;
      }

      if (res.status === 404) {
        setError("No record found.");
        return;
      }

      if (!res.ok) {
        setError("Failed to edit the record. Please try again.");
        return;
      }
      navigate(`/expenses/${expenseId}`, { replace: true });
    } catch {
      setError("Oops, failed to edit the record. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='flex flex-col gap-5 bg-gray-100 text-main'
    >
      <div className='flex flex-col gap-3'>
        <div className='flex flex-col'>
          <label htmlFor='date' className='font-heading'>
            Date
          </label>
          <input
            className='p-2.5 border border-gray-300 bg-white outline-none  rounded-xl focus:ring-1 focus:ring-secondary'
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
        <div className='flex flex-col'>
          <label htmlFor='total' className='font-heading'>
            Total Amount ($)
          </label>
          <input
            className='p-2.5 border border-gray-300  rounded-xl bg-white outline-none  focus:ring-1 focus:ring-secondary'
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
        <div className='flex flex-col'>
          <label htmlFor='store' className='font-heading'>
            Store
          </label>
          <select
            className='p-2.5 border border-gray-300  rounded-xl bg-white outline-none  focus:ring-1 focus:ring-secondary'
            name='store'
            id='store'
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
        <div className='flex flex-col'>
          <label htmlFor='category' className='font-heading'>
            Category
          </label>
          <select
            className='p-2.5 border border-gray-300  rounded-xl bg-white outline-none  focus:ring-1 focus:ring-secondary'
            name='category'
            id='category'
            value={categoryId}
            onChange={(e) => {
              setCategoryId(Number(e.target.value));
            }}
          >
            <option value={0} disabled>
              Select Category
            </option>
            {categoryList.map((category) => (
              <option value={category.categoryId} key={category.categoryId}>
                {category.categoryName}
              </option>
            ))}
          </select>
        </div>
        {error && <span>{error}</span>}
      </div>
      <div className='flex gap-4 justify-center font-heading'>
        <button
          type='submit'
          className='flex bg-primary rounded-2xl h-12 w-24 items-center justify-center text-md text-white'
        >
          Save
        </button>
        <Link
          to='/expenses'
          className='flex  text-primary text-md rounded-2xl border-2  h-12 w-24 items-center justify-center'
        >
          Discard
        </Link>
      </div>
    </form>
  );
}
