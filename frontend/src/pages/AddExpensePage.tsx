import { useEffect, useState } from "react";
import "./AddExpensePage.css";
import { Camera } from "lucide-react";

// Store-category mapping for category auto selection
const storeCategoryMap = {
  walmart: "groceries",
  sobeys: "groceries",
  "best-buy": "electronics",
};

// Custom type
type Store = keyof typeof storeCategoryMap;

export default function AddExpensePage() {
  const today = new Date();

  const date = today.getDate().toString().padStart(2, "0");
  const month = (today.getMonth() + 1).toString().padStart(2, "0");
  const year = today.getFullYear().toString();

  const currentDate = `${year}-${month}-${date}`;

  const [store, setStore] = useState("");
  const [category, setCategory] = useState("category");
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [totalAmount, setTotalAmount] = useState("");

  useEffect(() => {
    // Call OCR API endpoint
    const extractText = async () => {
      if (!receiptFile) return;

      // Clear previous request results
      setError("");
      setTotalAmount("");

      const formData = new FormData();
      formData.append("receipt", receiptFile);

      try {
        const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/ocr`, {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          // error
          setError("Can't read the image. Please enter the total amount.");
          return;
        }

        // Get and set total amount
        const data: { totalAmount: string | null } = await res.json();

        if (data.totalAmount === null) {
          setTotalAmount("");
          setError("Can't read the image. Please enter the total amount.");
          return;
        }

        setTotalAmount(data.totalAmount);
      } catch {
        setError("Can't read the image. Please enter the total amount.");
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
        {error && <span>{error}</span>}
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
            setError("");
            setTotalAmount(e.target.value);
          }}
        />
      </div>
      <div className='expense-form-field'>
        <label htmlFor='store'>Store</label>
        <select
          name='store'
          id='store'
          defaultValue='store'
          className='expense-form-select'
          onChange={(e) => {
            const store = e.target.value as Store;
            setStore(store);
            setCategory(storeCategoryMap[store]);
          }}
        >
          <option value='store' disabled>
            Select store
          </option>
          <option value='walmart'>Walmart</option>
          <option value='sobeys'>Sobeys</option>
          <option value='best-buy'>Best Buy</option>
        </select>
      </div>
      <div className='expense-form-field'>
        <label htmlFor='category'>Category</label>
        <select
          name='category'
          id='category'
          className='expense-form-select'
          value={category}
          onChange={(e) => {
            console.log(e.target.value);
            setCategory(e.target.value);
          }}
        >
          <option value='category'>Category</option>
          <option value='groceries'>Groceries</option>
          <option value='electronics'>Electronics</option>
          <option value='beauty'>Beauty</option>
        </select>
      </div>
      <button type='submit' className='save-btn'>
        Save
      </button>
    </form>
  );
}
