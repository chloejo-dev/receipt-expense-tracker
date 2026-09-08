
using ExpenseTracker.Api.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/expense-options")]
public class ExpenseOptionsController : ControllerBase
{   
    // Constructor for Dependency Injection
    private readonly AppDbContext _context;

    public ExpenseOptionsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetExpenseOptions()
    {

        // Get all rows from stores
        // var stores = await _context.Stores.ToListAsync(); 

        // Get all store names and their default categories
        // {storeId: 1, storeName: "Walmart", defaultCategoryId: 1, defaultCategoryName: "Groceries" }
        var stores = await _context.Stores.OrderBy(store => store.StoreName).Select(store => new
        {
            store.StoreId,
            store.StoreName,
            DefaultCategoryId = store.CategoryId,
            DefaultCategoryName = store.Category.CategoryName

        }).ToListAsync();

        // Get all categories to allow users to edit the default category
        var categories = await _context.Categories.OrderBy(category => category.CategoryId).ToListAsync();



        return Ok(new {stores, categories});
    }
}