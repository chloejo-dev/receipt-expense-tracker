namespace ExpenseTracker.Api.DTOs;

public class ExpenseResponse
{
    public decimal Amount { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public int ExpenseId { get; set; }
}