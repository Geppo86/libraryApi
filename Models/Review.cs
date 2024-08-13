/// <summary>
/// Represents a review made by a user for a specific book.
/// </summary>
public class Review
{
    /// <summary>
    /// Gets or sets the unique identifier for the review.
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// Gets or sets the comment or feedback provided by the user about the book.
    /// </summary>
    public string Comment { get; set; }

    /// <summary>
    /// Gets or sets the rating given by the user, typically on a scale of 1-5.
    /// </summary>
    public int Rating { get; set; }

    /// <summary>
    /// Gets or sets the ID of the book that this review is associated with.
    /// This is a foreign key to the <see cref="Book"/> model.
    /// </summary>
    public int BookId { get; set; }

    /// <summary>
    /// Navigation property to the <see cref="Book"/> that this review is associated with.
    /// </summary>
    public Book Book { get; set; }

    /// <summary>
    /// Gets or sets the ID of the user who made the review.
    /// This is a foreign key to the <see cref="ApplicationUser"/> model.
    /// </summary>
    public string UserId { get; set; }

    /// <summary>
    /// Navigation property to the <see cref="ApplicationUser"/> who made the review.
    /// </summary>
    public ApplicationUser User { get; set; }

    /// <summary>
    /// Gets or sets the date and time when the review was created.
    /// </summary>
    public DateTime CreatedAt { get; set; }
}
