using Bogus;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

public static class DbInitializer
{
    public static void Initialize(IServiceProvider serviceProvider)
    {
        using var context = new ApplicationDbContext(
            serviceProvider.GetRequiredService<DbContextOptions<ApplicationDbContext>>());

        context.Database.Migrate();

        var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();
        var userManager = serviceProvider.GetRequiredService<UserManager<ApplicationUser>>();

        SeedRoles(roleManager);
        var customers = SeedUsers(userManager);

        if (!context.Books.Any())
        {
            SeedBooks(context, customers);
        }
    }

    private static void SeedRoles(RoleManager<IdentityRole> roleManager)
    {
        var roles = new[] { "Librarian", "Customer" };
        foreach (var role in roles)
        {
            if (!roleManager.RoleExistsAsync(role).Result)
            {
                roleManager.CreateAsync(new IdentityRole(role)).Wait();
            }
        }
    }

    private static List<ApplicationUser> SeedUsers(UserManager<ApplicationUser> userManager)
    {
        var adminUser = CreateUser(userManager, "admin", "admin@library.com", "Admin User", "Librarian");

        var customers = new List<ApplicationUser>();
        for (int i = 1; i <= 5; i++)
        {
            var customer = CreateUser(userManager, $"customer{i}", $"customer{i}@library.com", $"Customer {i}", "Customer");
            customers.Add(customer);
        }

        return customers;
    }

    private static ApplicationUser CreateUser(UserManager<ApplicationUser> userManager, string userName, string email, string fullName, string role)
    {
        var user = userManager.FindByNameAsync(userName).Result;
        if (user == null)
        {
            user = new ApplicationUser
            {
                UserName = userName,
                Email = email,
                FullName = fullName,
                Role = role
            };

            var result = userManager.CreateAsync(user, "Password123!").Result;
            if (result.Succeeded)
            {
                userManager.AddToRoleAsync(user, role).Wait();
            }
            else
            {
                throw new Exception(string.Join(", ", result.Errors.Select(e => e.Description)));
            }
        }
        return user;
    }

    private static void SeedBooks(ApplicationDbContext context, List<ApplicationUser> customers)
    {
        var bookFaker = new Faker<Book>()
            .RuleFor(b => b.Title, f => f.Lorem.Sentence(3))
            .RuleFor(b => b.Author, f => f.Person.FullName)
            .RuleFor(b => b.Description, f => f.Lorem.Paragraph())
            .RuleFor(b => b.CoverImage, f => f.Image.PicsumUrl())
            .RuleFor(b => b.Publisher, f => f.Company.CompanyName())
            .RuleFor(b => b.PublicationDate, f => f.Date.Past(10))
            .RuleFor(b => b.Category, f => f.Commerce.Categories(1).First())
            .RuleFor(b => b.ISBN, f => f.Commerce.Ean13())
            .RuleFor(b => b.PageCount, f => f.Random.Int(100, 500))
            .RuleFor(b => b.IsCheckedOut, f => f.Random.Bool())
            .RuleFor(b => b.CheckedOutByUserId, (f, b) => b.IsCheckedOut ? f.PickRandom(customers).Id : null);  // Ensure it's set to null if not checked out

        var books = bookFaker.Generate(50);
        context.Books.AddRange(books);
        context.SaveChanges();
    }
}
