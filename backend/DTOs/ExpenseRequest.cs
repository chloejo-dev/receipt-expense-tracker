namespace ExpenseTracker.Api.DTOs;
using System.ComponentModel.DataAnnotations;
public class ExpenseRequest
{

    [Range(typeof(decimal), "0.01", "999999.99")]
    public decimal Amount { get; set; }

    [Range(1, int.MaxValue)]
    public int CategoryId { get; set; }
}