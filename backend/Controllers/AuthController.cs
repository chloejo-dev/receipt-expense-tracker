
using ExpenseTracker.Api.Data;
using ExpenseTracker.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;


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
        // Input validation
        var name = request.Name;
        var email = request.Email;
        var password = request.Password;
        var confirmPassword = request.ConfirmPassword;

        // Name/email/password/confirmPassword is empty?
        if (string.IsNullOrWhiteSpace(name) ||
        string.IsNullOrWhiteSpace(email) ||
        string.IsNullOrWhiteSpace(password) ||
        string.IsNullOrWhiteSpace(confirmPassword))
        {
            return BadRequest();
        }

        // Email regex
        var emailRegex = new Regex(@"^[^\s@]+@[^\s@]+\.[^\s@]+$");

        if (!emailRegex.IsMatch(email))
        {
            return BadRequest();
        }

        // Password length (15-64)
        if (password.Length < 15 || password.Length > 64)
        {
            return BadRequest();
        }

        // Passwords match?
        if (password != confirmPassword)
        {
             return BadRequest();
        }

        // Check duplicate email => Result type = bool
        // User exists? 
        // Y: true, N: false
        var existingUser = await _context.Users.AnyAsync(user => user.Email == email);

        if (existingUser)
        {
            return Conflict(); // 409 error
        }

        // Hash password
        var hashedPassword = BCrypt.Net.BCrypt.HashPassword(password);

        // Create user
        var newUser = new User
        {
            Name = name,
            Email = email,
            HashedPassword = hashedPassword
        };

        // Store user in DB using EF Core
        _context.Users.Add(newUser);
        await _context.SaveChangesAsync();

        // Return response
        return StatusCode(201);

    }

}