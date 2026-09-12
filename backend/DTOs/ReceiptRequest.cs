namespace ExpenseTracker.Api.DTOs;
using System.ComponentModel.DataAnnotations;

public class ReceiptRequest
{
    [Range(typeof(decimal), "0.01", "999999.99")]
    public decimal TotalAmount { get; set; }

    [Required]
    // DateOnly? allows null so [Required] can detect a missing date.
    public DateOnly? Date { get; set; }

    [Range(1, int.MaxValue)]
    public int StoreId { get; set; }

    [Required]
    [MinLength(1)]
    public List<ExpenseRequest> Expenses { get; set; } = [];

}