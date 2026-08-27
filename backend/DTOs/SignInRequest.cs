// DTO for sign in
using System.ComponentModel.DataAnnotations;
public class SignInRequest
{
    // Validation rule
    [Required]
    [EmailAddress]
    public required string Email { get; set; }
    [Required]
    [MinLength(15)]
    [MaxLength(64)]
    public required string Password { get; set; }
}