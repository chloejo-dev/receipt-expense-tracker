namespace ExpenseTracker.Api.Models;

public class Store
{
    public int StoreId { get; set; }

    public required string StoreName { get; set; }
    
    // FK
    public int CategoryId { get; set; }

    // Navigation property for the related Category
    public Category Category { get; set; } = null!;

}