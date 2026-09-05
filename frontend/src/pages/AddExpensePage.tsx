import { useState } from "react";
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
          Take or upload a receipt
        </label>
        <input
          type='file'
          id='receipt'
          name='receipt'
          required
          accept='image/*'
          className='receipt-input'
        />
      </div>

      <div className='expense-form-field'>
        <label htmlFor='total'>Total Amount ($)</label>
        <input type='number' id='total' name='total' required />
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
