namespace ExpenseTracker.Api.Models;

public class User
{
    public int UserId { get; set; }
    public required string Name { get; set; }
    public required string Email { get; set; }

    public required string HashedPassword { get; set; }
     
    public DateTime JoinedDate { get; set; } = DateTime.UtcNow;
}