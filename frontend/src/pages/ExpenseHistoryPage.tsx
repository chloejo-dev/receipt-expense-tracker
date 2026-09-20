import { Coffee, Bus, Hospital, Utensils, ShoppingCart } from "lucide-react";
import "./ExpenseHistoryPage.css";

type Expense = {
  id: number;
  date: string;
  store: string;
  category: string;
  amount: number;
};

// type ExpensesByDate = {
//   [date: string]: Expense[];
// };

export default function ExpenseHistoryPage() {
  //   const [expenses, setExpenses] = useState([]);
  // Hard-coded data to be replaced with actual data in DB
  const expenses = [
    {
      id: 1,
      date: "Aug 12",
      store: "Walmart",
      category: "Groceries",
      amount: 37.83,
    },
    {
      id: 2,
      date: "Aug 13",
      store: "Starbucks",
      category: "Dining",
      amount: 12.89,
    },
    {
      id: 3,
      date: "Aug 13",
      store: "Best Buy",
      category: "Electronics",
      amount: 105.83,
    },
    {
      id: 4,
      date: "Aug 14",
      store: "Sobeys",
      category: "Groceries",
      amount: 22.53,
    },
  ];

  // Group expenses by date
  // const expensesByDate = expenses.reduce(
  //   (expensesByDate: ExpensesByDate, expense) => {
  //     if (expense.date in expensesByDate) {
  //       expensesByDate[expense.date].push(expense);
  //     } else {
  //       expensesByDate[expense.date] = [expense];
  //     }
  //     return expensesByDate;
  //   },
  //   {},
  // );

  // const expensesByDateArr = Object.entries(expensesByDate);

  // console.log(expensesByDateArr);

  return (
    <div className='expense-history'>
      <header className='expense-header'>
        <h1>Expense History</h1>
      </header>
      <main className='history-content'>
        <section className='expense-date-group'>
          <h2 className='expense-date'>Today, Oct 24</h2>
          {expenses.map((expense) => (
            <article key={expense.id} className='expense-card'>
              <div className='expense-icon'>
                <Coffee />
              </div>
              <div className='history-details'>
                <h3 className='expense-store'>{expense.store}</h3>
                <p className='expense-category'>{expense.category}</p>
              </div>
              <strong className='expense-amount'>
                ${expense.amount.toFixed(2)}
              </strong>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
