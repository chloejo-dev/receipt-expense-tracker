// DTO
using System.ComponentModel.DataAnnotations;

public class SignUpRequest
{
    // Name
    [Required]
    public required string Name { get; set; }
    // Email
    [Required]
    [EmailAddress]
    public required string Email { get; set; }
    // Password
    [Required]
    [MinLength(15)]
    [MaxLength(64)]
    public required string Password { get; set; }
    // ConfirmPassword
    [Required]
    [Compare(nameof(Password))]
    public required string ConfirmPassword { get; set; }
}