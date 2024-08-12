public class Book
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Author { get; set; }
    public string Description { get; set; }
    public string CoverImage { get; set; }
    public string Publisher { get; set; }
    public DateTime PublicationDate { get; set; }
    public string Category { get; set; }
    public string ISBN { get; set; }
    public int PageCount { get; set; }
    public bool IsCheckedOut { get; set; }
    public string? CheckedOutByUserId { get; set; }  // Nullable property for User ID
    public ApplicationUser? CheckedOutByUser { get; set; }  // Navigation property

    public DateTime? CheckedOutDate { get; set; } // Date when the book was checked out
    public double AverageRating { get; set; }  // Assuming ratings are on a scale like 1-5

    // New field for reviews
    public ICollection<Review> Reviews { get; set; } = new List<Review>();

    // Computed property for Availability
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
