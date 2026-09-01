
using ExpenseTracker.Api.Data;
using ExpenseTracker.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    // Constructor Dependency Injection
    private readonly AppDbContext _context;
    private readonly IConfiguration _configuration;
    private readonly IWebHostEnvironment _environment;


    public AuthController(AppDbContext context, IConfiguration configuration, IWebHostEnvironment environment)
    {
        _context = context;
        _configuration = configuration;
        _environment = environment;
    }

    // POST /api/auth/sign-up
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

    // POST /api/auth/sign-in
    [HttpPost("sign-in")]
    public async Task<IActionResult> SignIn(SignInRequest request)
    {
        // Input validation: email, password
        var email = request.Email;
        var password = request.Password;

        // Email or password empty?
        if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(password))
        {
            return BadRequest();
        }

        // Email regex
        var emailRegex = new Regex(@"^[^\s@]+@[^\s@]+\.[^\s@]+$");

        if (!emailRegex.IsMatch(email))
        {
            return BadRequest();
        }

        // Password length(15-64)
        if (password.Length < 15 || password.Length > 64)
        {
            return BadRequest();
        }

        // Find user in DB
        var existingUser = await _context.Users.FirstOrDefaultAsync(user => user.Email == email);

        // No user found
        if (existingUser == null)
        {
            return Unauthorized();
        }

        // User found
        // Verify entered password against stored password hash
        var isPasswordValid = BCrypt.Net.BCrypt.Verify(password, existingUser.HashedPassword);

        if (!isPasswordValid)
        {
            return Unauthorized();
        }

        // JWT
        // Setup
        // Claim to identify user
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, existingUser.UserId.ToString())
        };

        // Get secret key from User Secrets to sign jwt and verify its signature later
        var jwtKey = _configuration["Jwt:Key"];

        // Handling case where jwtKey == null
        if (jwtKey == null)
        {
            throw new InvalidOperationException("JWT key is not configured.");
        }

        // Create key object using jwtKey
        var key = new SymmetricSecurityKey(
        Encoding.UTF8.GetBytes(jwtKey));


        // Create SigningCredentials instance using key object
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        // Create JWT object
        var token = new JwtSecurityToken(
            claims: claims,
            expires: DateTime.UtcNow.AddDays(1),
            signingCredentials: credentials
        );

        // Convert JWT object into string
        var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

        // Set cookie -> Server tells browser to set cookie
        Response.Cookies.Append("auth_token",
            tokenString,
            new CookieOptions
            {
                HttpOnly = true,
                Secure = _environment.IsProduction(),
                SameSite = SameSiteMode.Lax,
                Path = "/",
                MaxAge = TimeSpan.FromDays(1)
            }
        );

        // Return success response
        return Ok();
    }

    [HttpPost("sign-out")]
    public IActionResult SignOutUser()
    {
        // Server tells browser to delete cookie
        Response.Cookies.Delete("auth_token", new CookieOptions { Path = "/" });

        // Return success response
        return Ok();
    }
}

