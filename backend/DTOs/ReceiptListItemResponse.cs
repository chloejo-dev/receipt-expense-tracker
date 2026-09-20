namespace ExpenseTracker.Api.DTOs;

public class ReceiptListItemResponse
{
    public int ReceiptId { get; set; }
    public DateOnly Date { get; set; }
    public string CategoryLabel { get; set; } = string.Empty;
    public decimal TotalAmount { get; set; }
    public string StoreName { get; set; } = string.Empty;

}