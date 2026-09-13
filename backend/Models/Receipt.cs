namespace ExpenseTracker.Api.Models;

public class Receipt
{
    public int ReceiptId { get; set; }
    public decimal TotalAmount { get; set; }
    public DateOnly Date { get; set; }

    public required string IdempotencyKey { get; set; }

    // FK
    public int UserId { get; set; }
    public int StoreId { get; set; }

    // Navigation properties
    public User User { get; set; } = null!;
    public Store Store { get; set; } = null!;

    public ICollection<Expense> Expenses { get; set; } = [];

}