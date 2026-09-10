namespace ExpenseTracker.Api.Models;

public class Expense
{
    public int ExpenseId { get; set; }
    public decimal Amount { get; set; }

    // FK
    public int ReceiptId { get; set; }
    public int CategoryId { get; set; }

    // Navigation properties
    public Receipt Receipt { get; set; } = null!;
    public Category Category { get; set; } = null!;


}