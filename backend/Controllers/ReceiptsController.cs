using ExpenseTracker.Api.DTOs;
using ExpenseTracker.Api.Data;
using ExpenseTracker.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;

namespace ExpenseTracker.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/receipts")]
public class ReceiptsController : ControllerBase
{   
    // Constructor for dependency injection
    private readonly AppDbContext _context;
    public ReceiptsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> CreateReceipt(ReceiptRequest request)
    {
        // Get and validate UserId from JWT Claim
        string? userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
       if (!int.TryParse(userIdClaim, out int userId))
        {
            return Unauthorized();
        }

        // Validate business rules
        // Store exists?
        bool storeExists = await _context.Stores.AnyAsync(store => store.StoreId == request.StoreId);

        if (!storeExists)
        {
            return BadRequest("The selected store does not exist.");
        }

        // Create a list to store all category Ids in the Expenses list
        List<int> requestedCategoryIds = request.Expenses
        .Select(expense => expense.CategoryId) // Select only CategoryId from each row
        .Distinct() // Get rid of duplicate CategoryIds
        .ToList(); // Create a new list of CategoryIds

        // Count CategoryIds in the categories table
        int existingCategoryCount = await _context.Categories
        .CountAsync(category => requestedCategoryIds.Contains(category.CategoryId));

        // Number of the count == requestedCategoryIds?
        if (existingCategoryCount != requestedCategoryIds.Count)
        {
            return BadRequest("One or more categories do not exist.");
        }

        // Calculate the sum of all requested expense amounts
        decimal expenseTotal = request.Expenses.Sum(expense => expense.Amount);

        // Total amount = sum of expenses?
        if (expenseTotal != request.TotalAmount)
        {
            return BadRequest("The receipt total must equal the sum of expense amounts.");
        }


        // Map DTO objects to DB entities
        Receipt receipt = new()
        {
            UserId = userId,
            Date = request.Date!.Value,
            TotalAmount = request.TotalAmount,
            StoreId = request.StoreId,
            Expenses = request.Expenses
            .Select(expense => new Expense
            {
                Amount = expense.Amount,
                CategoryId = expense.CategoryId
            })
            .ToList()
        };

        
        // Add the Receipt entity and its related expenses to DbContext
        _context.Receipts.Add(receipt);

        // Save changes
        await _context.SaveChangesAsync();

        // Return HTTP 201 Created with receiptId
        return StatusCode(StatusCodes.Status201Created,
        new { receiptId = receipt.ReceiptId });
    }
}