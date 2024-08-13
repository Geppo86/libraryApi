using Microsoft.AspNetCore.Identity;

/// <summary>
/// Represents an application user, inheriting from the ASP.NET Core IdentityUser class.
/// This class is used to add custom properties to the default user provided by Identity.
/// </summary>
public class ApplicationUser : IdentityUser
{
    /// <summary>
    /// Gets or sets the full name of the user.
    /// </summary>
    public string FullName { get; set; }

    /// <summary>
    /// Gets or sets the role of the user within the application.
    /// This can be used to assign roles like "Admin", "Librarian", "User", etc.
    /// </summary>
    public string Role { get; set; }
}
