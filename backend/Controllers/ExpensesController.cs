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
[Route("api/expenses")]
public class ExpensesController : ControllerBase
{
    // Constructor for dependency injection
    private readonly AppDbContext _context;
    public ExpensesController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> CreateExpense(ExpenseRequest request,
    [FromHeader(Name = "Idempotency-Key")] string? idempotencyKey)
    {
        // Check if idempotencyKey = null
        if (string.IsNullOrWhiteSpace(idempotencyKey))
        {
            return BadRequest("Idempotency-Key header is required.");
        }

        // Get and validate UserId from JWT Claim
        string? userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!int.TryParse(userIdClaim, out int userId))
        {
            return Unauthorized();
        }

        // Check if idempotency key with UserId already exists
        Expense? existingExpense = await _context.Expenses
        .AsNoTracking()
        .FirstOrDefaultAsync(
            expense => expense.UserId == userId &&
            expense.IdempotencyKey == idempotencyKey);

        if (existingExpense is not null)
        {
            return StatusCode(
            StatusCodes.Status201Created,
            new { expenseId = existingExpense.ExpenseId }
            );
        }

        // Validate business rules
        // Store exists?
        bool storeExists = await _context.Stores.AnyAsync(store => store.StoreId == request.StoreId);

        if (!storeExists)
        {
            return BadRequest("The selected store does not exist.");
        }


        // Map DTO objects to DB entities
        Expense expense = new()
        {
            UserId = userId,
            Date = request.Date!.Value,
            TotalAmount = request.TotalAmount,
            IdempotencyKey = idempotencyKey,
            StoreId = request.StoreId,
            CategoryId = request.CategoryId
        };

        // Add the Expense entity
        _context.Expenses.Add(expense);

        // Save changes
        await _context.SaveChangesAsync();

        // Return HTTP 201 Created with expenseId
        return StatusCode(StatusCodes.Status201Created,
        new { expenseId = expense.ExpenseId });
    }

    [HttpGet]
    public async Task<ActionResult<List<ExpenseListItemResponse>>> GetExpenses()
    {
        // Get UserId from JWT Claim
        string? userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(userIdClaim, out int userId))
        {
            return Unauthorized();
        }

        // Retrieve user's expense records
        List<ExpenseListItemResponse> expenses = await _context.Expenses
        .AsNoTracking()
        .Where(expense => expense.UserId == userId)
        .OrderByDescending(expense => expense.Date) // Latest -> oldest
        .ThenByDescending(expense => expense.CreatedAt) // Latest -> oldest
        .Select(expense => new ExpenseListItemResponse
        {
            // Map the records to response DTOs
            ExpenseId = expense.ExpenseId,
            Date = expense.Date,
            CategoryName = expense.Category.CategoryName,
            TotalAmount = expense.TotalAmount,
            StoreName = expense.Store.StoreName
        }
        ).ToListAsync();

        // Return response
        return Ok(expenses);
    }

    [HttpGet("{expenseId:int}")]
    public async Task<ActionResult<ExpenseRecordResponse>> GetOneExpense(int expenseId)
    {
        // Get UserId from JWT Claim
        string? userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(userIdClaim, out int userId))
        {
            return Unauthorized();
        }

        // Retrieve user's expense from the Expenses table
        ExpenseRecordResponse? expense = await _context.Expenses
        .AsNoTracking()
        .Where(expense => expense.UserId == userId)
        .Where(expense => expense.ExpenseId == expenseId)
        .Select(expense => new ExpenseRecordResponse
        {
            // Map the details to response DTOs
            StoreId = expense.Store.StoreId,
            StoreName = expense.Store.StoreName,
            TotalAmount = expense.TotalAmount,
            Date = expense.Date,
            CategoryName = expense.Category.CategoryName
        })
        .FirstOrDefaultAsync();

        if (expense is null)
        {
            return NotFound();
        }

        // Return response
        return Ok(expense);
    }

    [HttpPut("{expenseId:int}")]
    public async Task<IActionResult> EditExpense(ExpenseRequest request, int expenseId)
    {
        // Get UserId from JWT claim object
        string? userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
          
        // No UserId found
        if (!int.TryParse(userIdClaim, out int userId))
        {
            return Unauthorized();
        }

        // Find an expense with the expenseId
        var existingExpense = await _context.Expenses
        .AsNoTracking()
        .FirstOrDefaultAsync(
            expense => expense.UserId == userId &&
            expense.ExpenseId == expenseId);

        // No expense found
        if (existingExpense is null)
        {
            return NotFound();
        }

        // Update the expense with the data received from the client
        existingExpense.Date = request.Date!.Value;
        existingExpense.TotalAmount = request.TotalAmount;
        existingExpense.StoreId = request.StoreId;
        existingExpense.CategoryId = request.CategoryId;

        // Save changes
        await _context.SaveChangesAsync();

        // Return HTTP 204 No Content
        return NoContent();

    }
}