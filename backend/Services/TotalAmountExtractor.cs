namespace ExpenseTracker.Api.Services;

public static class TotalAmountExtractor
{
    public static string? ExtractTotalAmount(string[] extractedLines)
    {
        // Find the total amount section using index
        int totalAmountIndex = -1;

        for (int i = 0; i < extractedLines.Length; i++)
        {
            if (extractedLines[i].Equals("TOTAL", StringComparison.OrdinalIgnoreCase) && i + 1 < extractedLines.Length)
            {
                totalAmountIndex = i + 1;
                break;
            }
        }

        if (totalAmountIndex == -1)
        {
            return null;
        }

        // Get total amount only
        string totalAmount = extractedLines[totalAmountIndex];

        // Get rid of $ symbol
        totalAmount = totalAmount.Replace("$", "");

        return totalAmount;
    }


}