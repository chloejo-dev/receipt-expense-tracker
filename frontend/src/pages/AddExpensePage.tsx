import { useEffect, useState } from "react";
import "./AddExpensePage.css";
import { Camera } from "lucide-react";
import getDefaultCategoryId from "./categorySelection";

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
  const [notification, setNotification] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

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

  return (
    <form className='expense-form'>
      <div className='expense-form-field'>
        <label htmlFor='date'>Date</label>
        <input
          type='date'
          id='date'
          name='date'
          required
          defaultValue={currentDate}
        />
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
            // Get receipt photo
            const file = e.target.files?.[0];
            if (!file) return;
            setReceiptFile(file);
          }}
        />
        {extractionError && <span>{extractionError}</span>}
      </div>

      <div className='expense-form-field'>
        <label htmlFor='total'>Total Amount ($)</label>
        <input
          type='number'
          id='total'
          name='total'
          required
          step='0.01'
          min='0'
          value={totalAmount}
          onChange={(e) => {
            setExtractionError("");
            setNotification("");
            setTotalAmount(e.target.value);
          }}
        />
        {notification && <span>{notification}</span>}
      </div>
      <div className='expense-form-field'>
        <label htmlFor='store'>Store</label>
        <select
          name='store'
          id='store'
          className='expense-form-select'
          value={storeId}
          onChange={(e) => {
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
          disabled={isLoading || Boolean(error)}
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
        <label htmlFor='category'>Category</label>
        <select
          name='category'
          id='category'
          className='expense-form-select'
          value={categoryId}
          disabled={isLoading || Boolean(error)}
          onChange={(e) => {
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
        {error && <span>{error}</span>}
      </div>
      <button type='submit' className='save-btn'>
        Save
      </button>
    </form>
  );
}
