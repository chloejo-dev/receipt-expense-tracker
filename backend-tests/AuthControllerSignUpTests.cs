using ExpenseTracker.Api.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using ExpenseTracker.Api.Models;
using Microsoft.Extensions.Configuration;
using Moq;
using Microsoft.AspNetCore.Hosting;

public class AuthControllerSignUpTests
{
    // Helper method to create AuthController
    private (AuthController controller, AppDbContext context) CreateTestSetup()
    {
        // Set to use EF Core InMemory provider instead of actual SQL server
        var options = new DbContextOptionsBuilder<AppDbContext>().UseInMemoryDatabase(Guid.NewGuid().ToString()).Options;

        // Prepare dependencies: AppDbContext, IConfiguration, and IWebHostEnvironment
        var context = new AppDbContext(options);

        var configuration = new ConfigurationBuilder()
        .AddInMemoryCollection()
        .Build();

        var environmentMock = new Mock<IWebHostEnvironment>();

        // Create AuthController instance with dependencies
        var controller = new AuthController(context, configuration, environmentMock.Object);

        return (controller, context);
    }
    // Validate user input by writing test methods
    // Name empty?
    [Fact]
    public async Task SignUp_ReturnsBadRequest_WhenNameIsEmpty()
    {

        // Arrange
        // Create AuthController instance using helper method
        var (controller, _) = CreateTestSetup();

        // Actual code: 
        // SignUp(SignUpRequest request) --> SignUpRequest DTO (object initializer)
        var request = new SignUpRequest
        {
            Name = "",
            Email = "test@test.com",
            Password = "qazwsxedcrfvtgb",
            ConfirmPassword = "qazwsxedcrfvtgb"
        };

        // Act: Return response
        var result = await controller.SignUp(request);

        // Assert
        Assert.IsType<BadRequestResult>(result);
    }

    // Email empty?
    [Fact]
    public async Task SignUp_ReturnsBadRequest_WhenEmailIsEmpty()
    {
        // Arrange
        var (controller, _) = CreateTestSetup();

        var request = new SignUpRequest
        {
            Name = "Chloe",
            Email = "",
            Password = "qazwsxedcrfvtgb",
            ConfirmPassword = "qazwsxedcrfvtgb"
        };

        // Act
        var result = await controller.SignUp(request);

        // Assert
        Assert.IsType<BadRequestResult>(result);
    }

    // Email valid?
    [Fact]
    public async Task SignUp_ReturnsBadRequest_WhenEmailIsInvalid()
    {
        // Arrange
       var (controller, _) = CreateTestSetup();

        var request = new SignUpRequest
        {
            Name = "Chloe",
            Email = "test.com",
            Password = "qazwsxedcrfvtgb",
            ConfirmPassword = "qazwsxedcrfvtgb"
        };

        // Act
        var result = await controller.SignUp(request);

        // Assert
        Assert.IsType<BadRequestResult>(result);
    }

    // Password empty?
    [Fact]
    public async Task SignUp_ReturnsBadRequest_WhenPasswordIsEmpty()
    {
        // Arrange
        var (controller, _) = CreateTestSetup();

        var request = new SignUpRequest
        {
            Name = "Chloe",
            Email = "test@test.com",
            Password = "",
            ConfirmPassword = "qazwsxedcrfvtgb"
        };

        // Act
        var result = await controller.SignUp(request);

        // Assert
        Assert.IsType<BadRequestResult>(result);

    }
    // Min password length: 15
    [Fact]
    public async Task SignUp_ReturnsBadRequest_WhenPasswordIsTooShort()
    {
        // Arrange
        var (controller, _) = CreateTestSetup();

        var request = new SignUpRequest
        {
            Name = "Chloe",
            Email = "test@test.com",
            Password = "qazwsxedc",
            ConfirmPassword = "qazwsxedc"
        };

        // Act
        var result = await controller.SignUp(request);

        // Assert
        Assert.IsType<BadRequestResult>(result);
    }

    // Max password length: 64
    [Fact]
    public async Task SignUp_ReturnsBadRequest_WhenPasswordIsTooLong()
    {
        // Arrange
        var (controller, _) = CreateTestSetup();

        var password = new string('a', 65);

        var request = new SignUpRequest
        {
            Name = "Chloe",
            Email = "test@test.com",
            Password = password,
            ConfirmPassword = password
        };

        // Act
        var result = await controller.SignUp(request);

        // Assert
        Assert.IsType<BadRequestResult>(result);
    }

    // ConfirmPassword empty?
    [Fact]
    public async Task SignUp_ReturnsBadRequest_WhenConfirmPasswordIsEmpty()
    {
        // Arrange
        var (controller, _) = CreateTestSetup();

        var password = new string('a', 17);

        var request = new SignUpRequest
        {
            Name = "Chloe",
            Email = "test@test.com",
            Password = password,
            ConfirmPassword = ""
        };

        // Act
        var result = await controller.SignUp(request);

        // Assert
        Assert.IsType<BadRequestResult>(result);
    }

    // Password == confirmPassword?
    [Fact]
    public async Task SignUp_ReturnsBadRequest_WhenPasswordsAreDifferent()
    {
        // Arrange
        var (controller, _) = CreateTestSetup();

        var password = new string('a', 17);
        var confirmPassword = new string('b', 17);

        var request = new SignUpRequest
        {
            Name = "Chloe",
            Email = "test@test.com",
            Password = password,
            ConfirmPassword = confirmPassword
        };

        // Act
        var result = await controller.SignUp(request);

        // Assert
        Assert.IsType<BadRequestResult>(result);
    }

    // Password hashing
    [Fact]
    public async Task SignUp_HashesPassword_WhenRequestIsValid()
    {
        // Arrange
        var (controller, context) = CreateTestSetup();

        var password = new string('a', 17);

        var request = new SignUpRequest
        {
            Name = "Chloe",
            Email = "test7@test.com",
            Password = password,
            ConfirmPassword = password
        };

        // Act: new user is created and server returns 201 (happy path)
        var result = await controller.SignUp(request);

        // Assert
        // Get the new user from DB to verify password hashing
        var savedUser = await context.Users.SingleAsync();

        // Check if the original password matches the stored hash
        // Return type: bool
        var passwordsMatch = BCrypt.Net.BCrypt.Verify(password, savedUser.HashedPassword);

        Assert.NotEqual(password, savedUser.HashedPassword);
        Assert.True(passwordsMatch);

    }

    // Duplicate email? (409)
    [Fact]
    public async Task SignUp_ReturnsConflict_WhenEmailIsDuplicate()
    {
        // Arrange
        var (controller, context) = CreateTestSetup();

        // Create and store user in DB
        var hashedPassword = BCrypt.Net.BCrypt.HashPassword(new string('c', 15));

        context.Users.Add(new User
        {
            Name = "test",
            Email = "test@test.com",
            HashedPassword = hashedPassword
        });
        
        // Save changes
        await context.SaveChangesAsync();

        // Create new user with the same email address
        var password = new string('a', 17);
           
        var request = new SignUpRequest
        {
            Name = "Chloe",
            Email = "test@test.com",
            Password = password,
            ConfirmPassword = password
        };

        // Act: server returns 409 conflict due to duplicate email
        var result = await controller.SignUp(request);

        // Assert
        Assert.IsType<ConflictResult>(result);

    }
    
    // Happy path: Successful user creation (201)
    [Fact]
     public async Task SignUp_ReturnsCreated_WhenRequestIsValid()
    {
        // Arrange
        var (controller, _) = CreateTestSetup();

        // Create valid sign-up request
        var password = new string('a', 17);

        var request = new SignUpRequest
        {
            Name = "Chloe",
            Email = "test@test.com",
            Password = password,
            ConfirmPassword = password
        };

        // Act: new user is created and server returns 201 (happy path)
        var result = await controller.SignUp(request);

        // Assert
        // Return 201 status code?
        var statusResult = Assert.IsType<StatusCodeResult>(result);
        Assert.Equal(201, statusResult.StatusCode);
        
    }
}