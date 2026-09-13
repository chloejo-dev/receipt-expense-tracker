using ExpenseTracker.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace ExpenseTracker.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Store> Stores { get; set; }
    public DbSet<Category> Categories { get; set; }

    public DbSet<Receipt> Receipts { get; set; }
    public DbSet<Expense> Expenses { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // No duplicate emails allowed
        modelBuilder.Entity<User>()
            .HasIndex(user => user.Email)
            .IsUnique();

        // No duplicate store names allowed
        modelBuilder.Entity<Store>()
            .HasIndex(store => store.StoreName)
            .IsUnique();

        modelBuilder.Entity<Store>()
            .Property(store => store.StoreName)
            .HasMaxLength(100);

        // No duplicate category names allowed
        modelBuilder.Entity<Category>()
            .HasIndex(category => category.CategoryName)
            .IsUnique();

        modelBuilder.Entity<Category>()
           .Property(category => category.CategoryName)
           .HasMaxLength(100);

        // Add initial categories
        modelBuilder.Entity<Category>()
           .HasData(
            new Category
            {
                CategoryId = 1,
                CategoryName = "Groceries"

            },
           new Category
           {
               CategoryId = 2,
               CategoryName = "Dining"

           },
           new Category
           {
               CategoryId = 3,
               CategoryName = "Household"

           },
            new Category
            {
                CategoryId = 4,
                CategoryName = "Clothing"

            },
            new Category
            {
                CategoryId = 5,
                CategoryName = "Electronics"

            },
                new Category
                {
                    CategoryId = 6,
                    CategoryName = "Transportation"

                },
            new Category
            {
                CategoryId = 7,
                CategoryName = "Health"

            },
            new Category
            {
                CategoryId = 8,
                CategoryName = "Other"

            });

        // Add initial stores with default categories
        modelBuilder.Entity<Store>().HasData(
        new Store { StoreId = 1, StoreName = "Sobeys", CategoryId = 1 },
        new Store { StoreId = 2, StoreName = "Atlantic Superstore", CategoryId = 1 },

        new Store { StoreId = 3, StoreName = "Tim Hortons", CategoryId = 2 },
        new Store { StoreId = 4, StoreName = "McDonald's", CategoryId = 2 },

        new Store { StoreId = 5, StoreName = "Canadian Tire", CategoryId = 3 },
        new Store { StoreId = 6, StoreName = "Dollarama", CategoryId = 3 },

        new Store { StoreId = 7, StoreName = "Winners", CategoryId = 4 },
        new Store { StoreId = 8, StoreName = "Mark's", CategoryId = 4 },

        new Store { StoreId = 9, StoreName = "Best Buy", CategoryId = 5 },
        new Store { StoreId = 10, StoreName = "Staples", CategoryId = 5 },

        new Store { StoreId = 11, StoreName = "Irving", CategoryId = 6 },
        new Store { StoreId = 12, StoreName = "Circle K", CategoryId = 6 },

        new Store { StoreId = 13, StoreName = "Shoppers Drug Mart", CategoryId = 7 },
        new Store { StoreId = 14, StoreName = "Lawtons Drugs", CategoryId = 7 },

        new Store { StoreId = 15, StoreName = "Amazon", CategoryId = 8 },
        new Store { StoreId = 16, StoreName = "Other", CategoryId = 8 }
        );

        modelBuilder.Entity<Receipt>()
            .Property(receipt => receipt.TotalAmount)
            .HasPrecision(18, 2);

        modelBuilder.Entity<Receipt>()
            .Property(receipt => receipt.IdempotencyKey)
            .HasMaxLength(64);

        modelBuilder.Entity<Receipt>()
           .HasIndex(receipt => new
           {
               receipt.UserId,
               receipt.IdempotencyKey
           })
           .IsUnique();

        modelBuilder.Entity<Expense>()
            .Property(expense => expense.Amount)
            .HasPrecision(18, 2);

        // Category 삭제 시 연결된 Store 삭제 방지
        modelBuilder.Entity<Store>()
        .HasOne(store => store.Category)
        .WithMany()
        .HasForeignKey(store => store.CategoryId)
        .OnDelete(DeleteBehavior.NoAction);

        // Category 삭제 시 연결된 Expense 삭제 방지
        modelBuilder.Entity<Expense>()
        .HasOne(expense => expense.Category)
        .WithMany()
        .HasForeignKey(expense => expense.CategoryId)
        .OnDelete(DeleteBehavior.NoAction);
        }
}