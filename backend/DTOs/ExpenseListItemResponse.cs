namespace ExpenseTracker.Api.DTOs;

public class ExpenseListItemResponse
{
    public int ExpenseId { get; set; }
    public DateOnly Date { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public decimal TotalAmount { get; set; }
    public string StoreName { get; set; } = string.Empty;

}