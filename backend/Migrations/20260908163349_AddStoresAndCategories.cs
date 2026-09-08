using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace ExpenseTracker.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddStoresAndCategories : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Categories",
                columns: table => new
                {
                    CategoryId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CategoryName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Categories", x => x.CategoryId);
                });

            migrationBuilder.CreateTable(
                name: "Stores",
                columns: table => new
                {
                    StoreId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    StoreName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    CategoryId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Stores", x => x.StoreId);
                    table.ForeignKey(
                        name: "FK_Stores_Categories_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "Categories",
                        principalColumn: "CategoryId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Categories",
                columns: new[] { "CategoryId", "CategoryName" },
                values: new object[,]
                {
                    { 1, "Groceries" },
                    { 2, "Dining" },
                    { 3, "Household" },
                    { 4, "Clothing" },
                    { 5, "Electronics" },
                    { 6, "Transportation" },
                    { 7, "Health" },
                    { 8, "Other" }
                });

            migrationBuilder.InsertData(
                table: "Stores",
                columns: new[] { "StoreId", "CategoryId", "StoreName" },
                values: new object[,]
                {
                    { 1, 1, "Sobeys" },
                    { 2, 1, "Atlantic Superstore" },
                    { 3, 2, "Tim Hortons" },
                    { 4, 2, "McDonald's" },
                    { 5, 3, "Canadian Tire" },
                    { 6, 3, "Dollarama" },
                    { 7, 4, "Winners" },
                    { 8, 4, "Mark's" },
                    { 9, 5, "Best Buy" },
                    { 10, 5, "Staples" },
                    { 11, 6, "Irving" },
                    { 12, 6, "Circle K" },
                    { 13, 7, "Shoppers Drug Mart" },
                    { 14, 7, "Lawtons Drugs" },
                    { 15, 8, "Amazon" },
                    { 16, 8, "Other" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Categories_CategoryName",
                table: "Categories",
                column: "CategoryName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Stores_CategoryId",
                table: "Stores",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_Stores_StoreName",
                table: "Stores",
                column: "StoreName",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Stores");

            migrationBuilder.DropTable(
                name: "Categories");
        }
    }
}
