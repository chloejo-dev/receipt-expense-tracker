namespace ExpenseTracker.Api.DTOs;

public class ReceiptRecordResponse
{
    public string StoreName { get; set; } = string.Empty;
    public decimal TotalAmount { get; set; }
    public DateOnly Date { get; set; }
    public string CategoryName { get; set; } = string.Empty;
}