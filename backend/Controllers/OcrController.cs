using Microsoft.AspNetCore.Mvc;
using Azure;
using Azure.AI.Vision.ImageAnalysis;
using ExpenseTracker.Api.Services;

[ApiController]
[Route("api/ocr")]
public class OcrController : ControllerBase
{   
    // Constructor Dependency Injection
    private readonly IConfiguration _configuration;
    // Constructor
    public OcrController(IConfiguration configuration)
    {
        _configuration = configuration;
    }
    // POST /api/ocr
    [HttpPost]
    public async Task<IActionResult> ExtractText(IFormFile receipt)
    {
        // Get Azure Vision endpoint and key
        string endpoint = _configuration["AzureVision:Endpoint"]
        ?? throw new InvalidOperationException("Azure Vision endpoint is not configured");

        string key = _configuration["AzureVision:Key"]
        ?? throw new InvalidOperationException("Azure Vision key is not configured");

        if (receipt.Length == 0)
        {
            return BadRequest("A receipt image is required");
        }

        // Read receipt image
        using Stream imageStream = receipt.OpenReadStream();
        BinaryData imageData = BinaryData.FromStream(imageStream);

        // Call Azure OCR API ImageAnalysisClient
        ImageAnalysisClient client = new(
            new Uri(endpoint),
            new AzureKeyCredential(key));

        // Get response from Azure OCR API
        Response<ImageAnalysisResult> response = await client.AnalyzeAsync(imageData, VisualFeatures.Read);

        // Get analysis result
        ImageAnalysisResult result = response.Value;

        // Get text from the image
        string[] extractedLines = result.Read.Blocks
        .SelectMany(block => block.Lines)
        .Select(line => line.Text)
        .ToArray();

        // Find the total amount section using index
        string? totalAmount = TotalAmountExtractor.ExtractTotalAmount(extractedLines);

        // Send response with extracted total amount: null or number
        return Ok(new {totalAmount});
    }
}