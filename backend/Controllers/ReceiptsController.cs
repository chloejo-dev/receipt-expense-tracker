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
    public async Task<IActionResult> CreateReceipt(ReceiptRequest request,
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
        Receipt? existingReceipt = await _context.Receipts
        .AsNoTracking()
        .FirstOrDefaultAsync(
            receipt => receipt.UserId == userId &&
            receipt.IdempotencyKey == idempotencyKey);

        if (existingReceipt is not null)
        {
            return StatusCode(
            StatusCodes.Status201Created,
            new { receiptId = existingReceipt.ReceiptId }
            );
        }

        // Validate business rules
        // Store exists?
        bool storeExists = await _context.Stores.AnyAsync(store => store.StoreId == request.StoreId);

        if (!storeExists)
        {
            return BadRequest("The selected store does not exist.");
        }

        // Get unique category IDs from the request
        List<int> uniqueCategoryIds = request.Expenses
        .Select(expense => expense.CategoryId) // Select only CategoryId from each row
        .Distinct() // Get rid of duplicate CategoryIds
        .ToList(); // Create a new list of CategoryIds

        // Make sure no duplicate categories are in the request
        if (uniqueCategoryIds.Count < request.Expenses.Count)
        {
            return BadRequest("Duplicate categories are not allowed.");
        }

        // Check if all requested categories are in the Categories table
        int existingCategoryCount = await _context.Categories
        .CountAsync(category => uniqueCategoryIds.Contains(category.CategoryId));

        // Make sure all requested categories exist
        if (existingCategoryCount != uniqueCategoryIds.Count)
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
            IdempotencyKey = idempotencyKey,
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

    [HttpGet]
    public async Task<ActionResult<List<ReceiptListItemResponse>>> GetReceipts()
    {
        // Get UserId from JWT Claim
        string? userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(userIdClaim, out int userId))
        {
            return Unauthorized();
        }

        // Retrieve user's receipt records
        List<ReceiptListItemResponse> receipts = await _context.Receipts
        .AsNoTracking()
        .Where(receipt => receipt.UserId == userId)
        .OrderByDescending(receipt => receipt.Date) // Latest -> oldest
        .ThenByDescending(receipt => receipt.CreatedAt) // Latest -> oldest
        .Select(receipt => new ReceiptListItemResponse
        {
            // Map the records to response DTOs
            ReceiptId = receipt.ReceiptId,
            Date = receipt.Date,
            // Display one category name or "Multiple Categories"
            CategoryLabel = receipt.Expenses.Count > 1
                ? "Multiple Categories"
                : receipt.Expenses
                    .Select(expense => expense.Category.CategoryName)
                    .First(),
            TotalAmount = receipt.TotalAmount,
            StoreName = receipt.Store.StoreName
        }
        ).ToListAsync();

        // Return response
        return Ok(receipts);
    }

    [HttpGet("{receiptId:int}")]
    public async Task<ActionResult<ReceiptRecordResponse>> GetOneReceipt(int receiptId)
    {
        // Get UserId from JWT Claim
        string? userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(userIdClaim, out int userId))
        {
            return Unauthorized();
        }

        // Retrieve user's receipt from the Receipts table
        ReceiptRecordResponse? receipt = await _context.Receipts
        .AsNoTracking()
        .Where(receipt => receipt.UserId == userId)
        .Where(receipt => receipt.ReceiptId == receiptId)
        .Select(receipt => new ReceiptRecordResponse
        {
            // Map the details to response DTOs
            StoreName = receipt.Store.StoreName,
            TotalAmount = receipt.TotalAmount,
            Date = receipt.Date,
            // Get expenses from the Expenses table
            Expenses = receipt.Expenses
            .Select(expense => new ExpenseResponse
            {
                Amount = expense.Amount,
                CategoryName = expense.Category.CategoryName,
                ExpenseId = expense.ExpenseId
            })
            .ToList()
        })
        .FirstOrDefaultAsync();

        if (receipt is null)
        {
            return NotFound();
        }

        // Return response
        return Ok(receipt);
    }
}