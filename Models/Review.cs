public class Review
{
    public int Id { get; set; }
    public string Comment { get; set; }
    public int Rating { get; set; }
    public int BookId { get; set; }
    public Book Book { get; set; }
    public string UserId { get; set; }
    public ApplicationUser User { get; set; } // Navigation property for the user who left the review
    public DateTime CreatedAt { get; set; } 
}
