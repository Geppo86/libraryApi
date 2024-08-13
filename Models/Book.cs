/// <summary>
/// Represents a book in the library system.
/// </summary>
public class Book
{
    /// <summary>
    /// Gets or sets the unique identifier for the book.
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// Gets or sets the title of the book.
    /// </summary>
    public string Title { get; set; }

    /// <summary>
    /// Gets or sets the author of the book.
    /// </summary>
    public string Author { get; set; }

    /// <summary>
    /// Gets or sets the description of the book.
    /// </summary>
    public string Description { get; set; }

    /// <summary>
    /// Gets or sets the URL or path of the book's cover image.
    /// </summary>
    public string CoverImage { get; set; }

    /// <summary>
    /// Gets or sets the publisher of the book.
    /// </summary>
    public string Publisher { get; set; }

    /// <summary>
    /// Gets or sets the publication date of the book.
    /// </summary>
    public DateTime PublicationDate { get; set; }

    /// <summary>
    /// Gets or sets the category or genre of the book.
    /// </summary>
    public string Category { get; set; }

    /// <summary>
    /// Gets or sets the International Standard Book Number (ISBN) of the book.
    /// </summary>
    public string ISBN { get; set; }

    /// <summary>
    /// Gets or sets the number of pages in the book.
    /// </summary>
    public int PageCount { get; set; }

    /// <summary>
    /// Gets or sets a value indicating whether the book is currently checked out.
    /// </summary>
    public bool IsCheckedOut { get; set; }

    /// <summary>
    /// Gets or sets the ID of the user who checked out the book.
    /// This is a foreign key to the ApplicationUser.
    /// </summary>
    public string? CheckedOutByUserId { get; set; }

    /// <summary>
    /// Gets or sets the user who checked out the book.
    /// This is a navigation property to the ApplicationUser.
    /// </summary>
    public ApplicationUser? CheckedOutByUser { get; set; }

    /// <summary>
    /// Gets or sets the date and time when the book was checked out.
    /// </summary>
    public DateTime? CheckedOutDate { get; set; }

    /// <summary>
    /// Gets or sets the average rating of the book based on user reviews.
    /// Assumes ratings are on a scale like 1-5.
    /// </summary>
    public double AverageRating { get; set; }

    /// <summary>
    /// Gets or sets the collection of reviews associated with the book.
    /// </summary>
    public ICollection<Review> Reviews { get; set; } = new List<Review>();

    /// <summary>
    /// Gets the availability status of the book.
    /// Indicates whether the book is available, overdue, or when it is due.
    /// </summary>
    public string Availability
    {
        get
        {
            if (!IsCheckedOut || !CheckedOutDate.HasValue)
            {
                return "Available";
            }

            // Calculate the days remaining until the book is due
            var daysCheckedOut = (DateTime.Now - CheckedOutDate.Value).Days;
            var daysRemaining = 5 - daysCheckedOut;

            // Ensure that the days remaining is not negative
            if (daysRemaining <= 0)
            {
                return "Overdue";
            }

            return $"Not Available (Due in {daysRemaining} days)";
        }
    }
}
