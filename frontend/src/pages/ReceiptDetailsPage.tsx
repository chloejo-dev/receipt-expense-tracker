import "./ReceiptDetailsPage.css";
import {
  Coffee,
  Bus,
  Hospital,
  Utensils,
  ShoppingCart,
  Clapperboard,
} from "lucide-react";

const categoryStyles = {
  Dining: {
    color: "#EF4444",
    backgroundColor: "#FEE2E2",
  },
  Groceries: {
    color: "#22C55E",
    backgroundColor: "#DCFCE7",
  },
  Transportation: {
    color: "#3B82F6",
    backgroundColor: "#DBEAFE",
  },
  Entertainment: {
    color: "#A855F7",
    backgroundColor: "#F3E8FF",
  },
  Other: {
    color: "#F59E08",
    backgroundColor: "#FEF3C7",
  },
};

export default function ReceiptDetailsPage() {
  return (
    <div className='expense-details'>
      <main className='expense-content'>
        <div className='expense-hero'>
          <div className='store-row'>
            <h1>Walmart</h1>
            <span>Oct 24, 2026</span>
          </div>
          <div className='amount-block'>
            <span>Total Amount</span>
            <strong className='total-amount'>$82.10</strong>
          </div>
        </div>
        <div className='expense-breakdown'>
          <div className='breakdown-header'>
            <h2>Breakdown</h2>
            <span>Category totals</span>
          </div>
          <div className='category-group'>
            <div className='category-card'>
              <div
                className='category-icon'
                style={{
                  color: "#EF4444",
                  backgroundColor: "#FEE2E2",
                }}
              >
                <Coffee />
              </div>
              <div className='category-details'>
                <h3 className='category'>Dining</h3>
                <p>$18.50</p>
              </div>
            </div>
            <div className='category-card'>
              <div
                className='category-icon'
                style={{
                  color: "#22C55E",
                  backgroundColor: "#DCFCE7",
                }}
              >
                <ShoppingCart />
              </div>
              <div className='category-details'>
                <h3 className='category'>Groceries</h3>
                <p>$24.30</p>
              </div>
            </div>
            <div className='category-card'>
              <div
                className='category-icon'
                style={{
                  color: "#3B82F6",
                  backgroundColor: "#DBEAFE",
                }}
              >
                <Bus />
              </div>
              <div className='category-details'>
                <h3 className='category'>Transportation</h3>
                <p>$15.00</p>
              </div>
            </div>
            <div className='category-card'>
              <div
                className='category-icon'
                style={{
                  color: "#F59E08",
                  backgroundColor: "#FEF3C7",
                }}
              >
                <Coffee />
              </div>
              <div className='category-details'>
                <h3 className='category'>Other</h3>
                <p>$8.80</p>
              </div>
            </div>
            <div className='category-card'>
              <div
                className='category-icon'
                style={{
                  color: "#A855F7",
                  backgroundColor: "#F3E8FF",
                }}
              >
                <Clapperboard />
              </div>
              <div className='category-details'>
                <h3 className='category'>Entertainment</h3>
                <p>$8.80</p>
              </div>
            </div>
          </div>
        </div>
        <div className='expense-actions'>
          <button className='edit-button'>Edit</button>
          <button className='delete-button'>Delete</button>
        </div>
      </main>
    </div>
  );
}
