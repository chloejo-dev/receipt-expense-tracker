using ExpenseTracker.Api.Services;

public class TotalAmountExtractorTests
{
    // Return total amount with TOTAL
    [Fact]
    public void ExtractTotalAmount_WithTOTAL_Returns_TotalAmount()
    {
        // Arrange
        string[] extractedLines = ["Sample", "$10.39", "TOTAL", "$25.34"];

        // Act  
        string? totalAmount = TotalAmountExtractor.ExtractTotalAmount(extractedLines);

        // Assert
        Assert.Equal("25.34", totalAmount);
    }

    // Return total amount with Total
    [Fact]
    public void ExtractTotalAmount_WithTotal_Returns_TotalAmount()
    {
        // Arrange
        string[] extractedLines = ["Sample", "$10.39", "Total", "$33.34"];

        // Act  
        string? totalAmount = TotalAmountExtractor.ExtractTotalAmount(extractedLines);

        // Assert
        Assert.Equal("33.34", totalAmount);
    }

    // Return null without total
    [Fact]
    public void ExtractTotalAmount_WithoutTotal_ReturnsNull()
    {
        // Arrange
        string[] extractedLines = ["Sample", "$10.39", "test"];

        // Act  
        string? totalAmount = TotalAmountExtractor.ExtractTotalAmount(extractedLines);

        // Assert
        Assert.Null(totalAmount);
    }
    
    // Return null when total is last
    [Fact]
    public void ExtractTotalAmount_WhenTotalIsLast_ReturnsNull()
    {
        // Arrange
        string[] extractedLines = ["Sample", "$10.39", "total"];

        // Act  
        string? totalAmount = TotalAmountExtractor.ExtractTotalAmount(extractedLines);

        // Assert
        Assert.Null(totalAmount);
    }
}