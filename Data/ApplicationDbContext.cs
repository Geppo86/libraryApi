using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
{
    public DbSet<Book> Books { get; set; }
    public DbSet<Review> Reviews { get; set; }  // Add this line

    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure the relationship between Book and ApplicationUser
        modelBuilder.Entity<Book>()
            .HasOne(b => b.CheckedOutByUser)  // Each book has one checked-out user
            .WithMany()  // A user can have many checked-out books
            .HasForeignKey(b => b.CheckedOutByUserId)  // Foreign key property
            .OnDelete(DeleteBehavior.SetNull);  // If user is deleted, set CheckedOutByUserId to null
    }
}
