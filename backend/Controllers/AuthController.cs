
using ExpenseTracker.Api.Data;
using ExpenseTracker.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    // Constructor Injection
    private readonly AppDbContext _context;


    public AuthController(AppDbContext context)
    {
        _context = context;
    }

    // POST api/sign-up
    [HttpPost("sign-up")]
    public async Task<IActionResult> SignUp(SignUpRequest request)
    {
        // Check duplicate email => Result type = bool
        // User exists? 
        // Y: true, N: false
        var existingUser = await _context.Users.AnyAsync(user => user.Email == request.Email);

        if (existingUser)
        {
            return Conflict(); // 409 error
        }

        // Hash password
        var hashedPassword = BCrypt.Net.BCrypt.HashPassword(request.Password);

        // Create user
        var newUser = new User
        {
            Name = request.Name,
            Email = request.Email,
            HashedPassword = hashedPassword
        };

        // Store user in DB using EF Core
        _context.Users.Add(newUser);
        await _context.SaveChangesAsync();

        // Return response
        return StatusCode(201);

    }

}