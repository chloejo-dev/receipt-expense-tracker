namespace ExpenseTracker.Api.DTOs;

public class ExpenseRecordResponse
{
    public DateOnly Date { get; set; }
    public string StoreName { get; set; } = string.Empty;
    public int StoreId { get; set; }
    public decimal TotalAmount { get; set; }
    public int CategoryId { get; set; }
    public string CategoryName { get; set; } = string.Empty;
}