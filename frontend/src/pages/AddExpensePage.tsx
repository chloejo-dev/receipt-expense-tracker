import { useEffect, useRef, useState } from "react";
import "./AddExpensePage.css";
import { Camera } from "lucide-react";
import getDefaultCategoryId from "./categorySelection";
import { Link, useNavigate } from "react-router-dom";

// Define types in a separate types file and import it to use
import type {
  StoreOption,
  CategoryOption,
  ExpenseOptionsResponse,
} from "./expenseOptions.types";

export default function AddExpensePage() {
  const today = new Date();

  const date = today.getDate().toString().padStart(2, "0");
  const month = (today.getMonth() + 1).toString().padStart(2, "0");
  const year = today.getFullYear().toString();

  const currentDate = `${year}-${month}-${date}`;
  const [storeList, setStoreList] = useState<StoreOption[]>([]);
  const [categoryList, setCategoryList] = useState<CategoryOption[]>([]);
  const [storeId, setStoreId] = useState(0);
  const [categoryId, setCategoryId] = useState(0);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [extractionError, setExtractionError] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [expenseDate, setExpenseDate] = useState(currentDate);
  const [notification, setNotification] = useState("");
  const [error, setError] = useState("");
  const [inputError, setInputError] = useState({ type: "", message: "" });
  const [isLoading, setIsLoading] = useState(true);
  const idempotencyKeyRef = useRef<string | null>(null);
  const navigate = useNavigate();

  // Get expense options from DB
  useEffect(() => {
    const getStoresAndCategories = async () => {
      try {
        // Get store and category options
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

  // Extract total amount from receipt image
  useEffect(() => {
    // Call OCR API endpoint
    const extractText = async () => {
      if (!receiptFile) return;

      // Clear previous request results
      setExtractionError("");
      setTotalAmount("");
      setNotification("");

      const formData = new FormData();
      formData.append("receipt", receiptFile);

      try {
        const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/ocr`, {
          method: "POST",
          body: formData,
        });

        // Failure responses
        if (!res.ok) {
          setExtractionError(
            "Can't read the image. Please enter the total amount.",
          );
          return;
        }

        // Get and set total amount
        const data: { totalAmount: string | null } = await res.json();

        // If extracting total amount fails
        if (data.totalAmount === null) {
          setTotalAmount("");
          setExtractionError(
            "Can't read the image. Please enter the total amount.",
          );
          return;
        }

        // Set the extracted total amount and ask the user to review it
        setTotalAmount(data.totalAmount);
        setNotification(
          "Please review and edit the total amount if needed before saving.",
        );
      } catch {
        setExtractionError(
          "Can't read the image. Please enter the total amount.",
        );
      }
    };

    extractText();
  }, [receiptFile]);

  const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    // Validate input and let users know about errors if any
    if (!expenseDate) {
      setInputError({ type: "date", message: "Please enter a date." });
      return;
    }

    if (!receiptFile) {
      setInputError({
        type: "receipt",
        message: "Please take or upload a receipt.",
      });
      return;
    }

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

    // Create an idempotencyKey to prevent duplicate expense entries when the same request is retried multiple times
    const key = idempotencyKeyRef.current ?? crypto.randomUUID();
    idempotencyKeyRef.current = key;

    // POST api/expenses
    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/expenses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": key,
        },
        credentials: "include",
        body: JSON.stringify({
          Date: expenseDate,
          TotalAmount: parsedTotalAmount,
          StoreId: storeId,
          CategoryId: categoryId,
        }),
      });

      // Handle error responses
      if (!res.ok) {
        setError("Failed to save a record. Please try again.");
        return;
      }

      idempotencyKeyRef.current = null;
      navigate("/expenses");

      // Handle errors
    } catch {
      setError("Oops, failed to save a record. Please try again.");
    }
  };

  // Reset idempotency key if any of the inputs changes
  const resetIdempotencyKey = () => {
    idempotencyKeyRef.current = null;
  };

  return (
    <form className='expense-form' onSubmit={handleSubmit} noValidate>
      <div className='expense-form-field'>
        <label htmlFor='date'>Date</label>
        <input
          type='date'
          id='date'
          name='date'
          required
          value={expenseDate}
          onChange={(e) => {
            resetIdempotencyKey();

            if (inputError.type === "date") {
              setInputError({ type: "", message: "" });
            }
            setExpenseDate(e.target.value);
          }}
        />
        {inputError.type === "date" && <span>{inputError.message}</span>}
      </div>
      <div className='expense-form-field'>
        <label className='receipt-photo' htmlFor='receipt'>
          <Camera />
          {receiptFile ? receiptFile.name : "Take or upload a receipt"}
        </label>
        <input
          type='file'
          id='receipt'
          name='receipt'
          required
          accept='image/*'
          capture='environment'
          className='receipt-input'
          onChange={(e) => {
            resetIdempotencyKey();

            if (inputError.type === "receipt") {
              setInputError({ type: "", message: "" });
            }
            // Get receipt photo
            const file = e.target.files?.[0];
            if (!file) return;
            setReceiptFile(file);
          }}
        />
        {extractionError && <span>{extractionError}</span>}
        {inputError.type === "receipt" && <span>{inputError.message}</span>}
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
          placeholder='0.0'
          value={totalAmount}
          onChange={(e) => {
            resetIdempotencyKey();

            if (inputError.type === "total amount") {
              setInputError({ type: "", message: "" });
            }
            setExtractionError("");
            setNotification("");
            setTotalAmount(e.target.value);
          }}
        />
        {notification && <span>{notification}</span>}
        {inputError.type === "total amount" && (
          <span>{inputError.message}</span>
        )}
      </div>
      <div className='expense-form-field'>
        <label htmlFor='store'>Store</label>
        <select
          name='store'
          id='store'
          className='expense-form-select'
          value={storeId}
          onChange={(e) => {
            resetIdempotencyKey();

            if (inputError.type === "store" || inputError.type === "category") {
              setInputError({ type: "", message: "" });
            }
            // Get store id for the selected store
            const selectedStoreId = Number(e.target.value);
            setStoreId(selectedStoreId);

            // Find defaultCategoryId
            const defaultCategoryId = getDefaultCategoryId(
              selectedStoreId,
              storeList,
            );

            setCategoryId(defaultCategoryId);
          }}
          disabled={isLoading || storeList.length === 0}
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
        {inputError.type === "store" && <span>{inputError.message}</span>}
      </div>
      <div className='expense-form-field'>
        <label htmlFor='category'>Category</label>
        <select
          name='category'
          id='category'
          className='expense-form-select'
          value={categoryId}
          disabled={isLoading || categoryList.length === 0}
          onChange={(e) => {
            resetIdempotencyKey();

            if (inputError.type === "category") {
              setInputError({ type: "", message: "" });
            }
            const selectedCategoryId = Number(e.target.value);
            setCategoryId(selectedCategoryId);
          }}
        >
          <option value={0} disabled>
            Select category
          </option>
          {categoryList.map((category) => (
            <option value={category.categoryId} key={category.categoryId}>
              {category.categoryName}
            </option>
          ))}
        </select>
        {inputError.type === "category" && <span>{inputError.message}</span>}
      </div>
      {error && <span>{error}</span>}
      <div className='actions'>
        <button type='submit' className='save-btn'>
          Save
        </button>
        <Link to='/dashboard' className='discard-btn'>
          Discard
        </Link>
      </div>
    </form>
  );
}
