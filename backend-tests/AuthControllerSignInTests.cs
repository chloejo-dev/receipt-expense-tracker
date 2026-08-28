using ExpenseTracker.Api.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using ExpenseTracker.Api.Models;
using Microsoft.Extensions.Configuration;
using Moq;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;

public class AuthControllerSignInTests
{
    // Helper method to create AuthController
    private (AuthController controller, AppDbContext context) CreateTestSetup()
    {
        // Set to use EF Core InMemory provider instead of actual SQL server
        var options = new DbContextOptionsBuilder<AppDbContext>().UseInMemoryDatabase(Guid.NewGuid().ToString()).Options;

        // Prepare dependencies: AppDbContext, IConfiguration, and IWebHostEnvironment
        var context = new AppDbContext(options);

        var configuration = new ConfigurationBuilder()
        .AddInMemoryCollection(new Dictionary<string, string?>
        {
            {"Jwt:Key", "YWhA0GqXDaAsCyTKLyTO3oQePmfRTxlNUouYgeoXPps=" }
        })
        .Build();

        var environmentMock = new Mock<IWebHostEnvironment>();

        // Create AuthController instance with dependencies
        var controller = new AuthController(context, configuration, environmentMock.Object)
        {
            // Provide HttpContext for setting cookie
            ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext()
            }
        };

        return (controller, context);
    }

    // Email empty?
    [Fact]
    public async Task SignIn_ReturnsBadRequest_WhenEmailIsEmpty()
    {
        // Arrange
        var (controller, _) = CreateTestSetup();

        var request = new SignInRequest
        {
            Email = "",
            Password = new string('a', 15)
        };

        // Act
        var result = await controller.SignIn(request);

        // Assert
        Assert.IsType<BadRequestResult>(result);
    }

    // Password empty?
    [Fact]
    public async Task SignIn_ReturnsBadRequest_WhenPasswordIsEmpty()
    {
        // Arrange
        var (controller, _) = CreateTestSetup();

        var request = new SignInRequest
        {
            Email = "test@test.com",
            Password = ""
        };

        // Act
        var result = await controller.SignIn(request);

        // Assert
        Assert.IsType<BadRequestResult>(result);
    }

    // Email format
    [Fact]
    public async Task SignIn_ReturnsBadRequest_WhenEmailIsInvalid()
    {
        // Arrange
        var (controller, _) = CreateTestSetup();

        // Invalid email
        var request = new SignInRequest
        {
            Email = "test.com",
            Password = new string('a', 17)
        };

        // Act
        var result = await controller.SignIn(request);

        // Assert
        Assert.IsType<BadRequestResult>(result);
    }

    // Password min length
    [Fact]
    public async Task SignIn_ReturnsBadRequest_WhenPasswordIsTooShort()
    {
        // Arrange
        var (controller, _) = CreateTestSetup();

        var request = new SignInRequest
        {
            Email = "test@test.com",
            Password = new string('a', 14) // Boundary test
        };

        // Act
        var result = await controller.SignIn(request);

        // Assert
        Assert.IsType<BadRequestResult>(result);
    }

    // Password max length
    [Fact]
    public async Task SignIn_ReturnsBadRequest_WhenPasswordIsTooLong()
    {
        // Arrange
        var (controller, _) = CreateTestSetup();

        var request = new SignInRequest
        {
            Email = "test@test.com",
            Password = new string('a', 65)
        };

        // Act
        var result = await controller.SignIn(request);

        // Assert
        Assert.IsType<BadRequestResult>(result);
    }

    // User not found in DB
    [Fact]
    public async Task SignIn_ReturnsUnauthorized_WhenUserIsNotFound()
    {
        // Arrange
        var (controller, _) = CreateTestSetup();

        // Valid input
        var request = new SignInRequest
        {
            Email = "thisistest@test.com",
            Password = new string('a', 15)
        };

        // Act
        var result = await controller.SignIn(request);

        // Assert
        Assert.IsType<UnauthorizedResult>(result);
    }

    // Incorrect password
    [Fact]
    public async Task SignIn_ReturnsUnauthorized_WhenPasswordIsIncorrect()
    {
        // Arrange
        var (controller, context) = CreateTestSetup();

        // Create and store user in DB to test
        var hashedPassword = BCrypt.Net.BCrypt.HashPassword(new string('c', 15));

        context.Users.Add(new User
        {
            Name = "Test",
            Email = "test5@test.com",
            HashedPassword = hashedPassword
        });

        // Save changes
        await context.SaveChangesAsync();

        // Valid email and incorrect password
        var request = new SignInRequest
        {
            Email = "test5@test.com",
            Password = new string('a', 15)
        };

        // Act
        var result = await controller.SignIn(request);

        // Assert
        Assert.IsType<UnauthorizedResult>(result);
    }
    
    // Happy path
    [Fact]
    public async Task SignIn_ReturnsOk_WhenRequestIsValid()
    {
        // Arrange
        var (controller, context) = CreateTestSetup();

        // Create and store user in DB to test
        var hashedPassword = BCrypt.Net.BCrypt.HashPassword(new string('c', 15));

        context.Users.Add(new User
        {
            Name = "Test",
            Email = "test5@test.com",
            HashedPassword = hashedPassword
        });

        // Save changes
        await context.SaveChangesAsync();

        var request = new SignInRequest
        {
            Email = "test5@test.com",
            Password = new string('c', 15)
        };

        // Act
        var result = await controller.SignIn(request);

        // Assert
        Assert.IsType<OkResult>(result);
    }
}