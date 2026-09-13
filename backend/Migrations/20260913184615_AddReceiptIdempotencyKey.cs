using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ExpenseTracker.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddReceiptIdempotencyKey : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Receipts_UserId",
                table: "Receipts");

            migrationBuilder.AddColumn<string>(
                name: "IdempotencyKey",
                table: "Receipts",
                type: "nvarchar(64)",
                maxLength: 64,
                nullable: false);

            migrationBuilder.CreateIndex(
                name: "IX_Receipts_UserId_IdempotencyKey",
                table: "Receipts",
                columns: new[] { "UserId", "IdempotencyKey" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Receipts_UserId_IdempotencyKey",
                table: "Receipts");

            migrationBuilder.DropColumn(
                name: "IdempotencyKey",
                table: "Receipts");

            migrationBuilder.CreateIndex(
                name: "IX_Receipts_UserId",
                table: "Receipts",
                column: "UserId");
        }
    }
}
