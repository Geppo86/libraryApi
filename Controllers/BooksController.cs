using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class BooksController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    // Constructor to initialize the controller with the database context
    public BooksController(ApplicationDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Retrieves the list of all books in the system.
    /// This endpoint is accessible to both authenticated and unauthenticated users.
    /// </summary>
    /// <returns>A list of books.</returns>
    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetBooks()
    {
        var books = await _context.Books.ToListAsync();
        return Ok(books);
    }

    /// <summary>
    /// Retrieves the details of a specific book by its ID.
    /// </summary>
    /// <param name="id">The ID of the book to retrieve.</param>
    /// <returns>The book details or a 404 Not Found status if the book does not exist.</returns>
    [HttpGet("{id}")]
    public async Task<IActionResult> GetBook(int id)
    {
        var book = await _context.Books.FindAsync(id);

        if (book == null)
        {
            return NotFound();
        }

        return Ok(book);
    }

    /// <summary>
    /// Adds a new book to the library.
    /// This action is restricted to users with the 'Librarian' role.
    /// </summary>
    /// <param name="book">The book object to add.</param>
    /// <returns>The created book along with its URI.</returns>
    [Authorize(Roles = "Librarian")]
    [HttpPost]
    public async Task<IActionResult> AddBook(Book book)
    {
        _context.Books.Add(book);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetBook), new { id = book.Id }, book);
    }

    /// <summary>
    /// Updates an existing book's information.
    /// This action is restricted to users with the 'Librarian' role.
    /// </summary>
    /// <param name="id">The ID of the book to update.</param>
    /// <param name="book">The updated book object.</param>
    /// <returns>No content if the update is successful, or BadRequest if the IDs do not match.</returns>
    [Authorize(Roles = "Librarian")]
    [HttpPut("{id}")]
    public async Task<IActionResult> EditBook(int id, Book book)
    {
        if (id != book.Id)
        {
            return BadRequest();
        }

        _context.Entry(book).State = EntityState.Modified;
        await _context.SaveChangesAsync();

        return NoContent();
    }

    /// <summary>
    /// Deletes a book from the library.
    /// This action is restricted to users with the 'Librarian' role.
    /// </summary>
    /// <param name="id">The ID of the book to delete.</param>
    /// <returns>No content if the deletion is successful, or NotFound if the book does not exist.</returns>
    [Authorize(Roles = "Librarian")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteBook(int id)
    {
        var book = await _context.Books.FindAsync(id);
        if (book == null)
        {
            return NotFound();
        }

        _context.Books.Remove(book);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    /// <summary>
    /// Marks a book as returned, making it available for others to check out.
    /// This action is restricted to users with the 'Librarian' role.
    /// </summary>
    /// <param name="id">The ID of the book to return.</param>
    /// <returns>No content if the return is successful, or BadRequest if the book is not checked out.</returns>
    [Authorize(Roles = "Librarian")]
    [HttpPost("{id}/return")]
    public async Task<IActionResult> ReturnBook(int id)
    {
        var book = await _context.Books.FindAsync(id);
        if (book == null || !book.IsCheckedOut)
        {
            return BadRequest();
        }

        book.IsCheckedOut = false;
        book.CheckedOutByUserId = null;
        await _context.SaveChangesAsync();

        return NoContent();
    }

    /// <summary>
    /// Checks out a book to the currently logged-in user.
    /// This action is restricted to authenticated users.
    /// </summary>
    /// <param name="id">The ID of the book to check out.</param>
    /// <returns>No content if the checkout is successful, or BadRequest if the book is already checked out.</returns>
    [Authorize]
    [HttpPost("{id}/checkout")]
    public async Task<IActionResult> CheckoutBook(int id)
    {
        var book = await _context.Books.FindAsync(id);
        if (book == null)
        {
            return NotFound();
        }

        if (book.IsCheckedOut)
        {
            return BadRequest("Book is already checked out.");
        }

        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        book.IsCheckedOut = true;
        book.CheckedOutByUserId = userId;
        book.CheckedOutDate = DateTime.Now;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    /// <summary>
    /// Retrieves all reviews for a specific book.
    /// </summary>
    /// <param name="id">The ID of the book to get reviews for.</param>
    /// <returns>A list of reviews for the specified book.</returns>
    [Authorize]
    [HttpGet("{id}/reviews")]
    public async Task<IActionResult> GetReviews(int id)
    {
        var book = await _context.Books.Include(b => b.Reviews).FirstOrDefaultAsync(b => b.Id == id);

        if (book == null)
        {
            return NotFound();
        }

        var reviews = book.Reviews.Select(r => new ReviewDto
        {
            Id = r.Id,
            Comment = r.Comment,
            Rating = r.Rating,
            CreatedAt = r.CreatedAt
        }).ToList();

        return Ok(reviews);
    }

    /// <summary>
    /// Adds a review to a specific book.
    /// This action is restricted to authenticated users.
    /// </summary>
    /// <param name="id">The ID of the book to review.</param>
    /// <param name="reviewModel">The review model containing the comment and rating.</param>
    /// <returns>Ok if the review is added successfully, or a 500 error if an exception occurs.</returns>
    [Authorize]
    [HttpPost("{id}/review")]
    public async Task<IActionResult> AddReview(int id, [FromBody] ReviewModel reviewModel)
    {
        try
        {
            var book = await _context.Books.Include(b => b.Reviews).FirstOrDefaultAsync(b => b.Id == id);

            if (book == null)
            {
                return NotFound();
            }

            var review = new Review
            {
                Comment = reviewModel.Comment,
                Rating = reviewModel.Rating,
                BookId = id,
                UserId = User.FindFirstValue(ClaimTypes.NameIdentifier), // Get the user's ID
                CreatedAt = DateTime.Now // Set CreatedAt to the current date and time
            };

            book.Reviews.Add(review);
            book.AverageRating = book.Reviews.Average(r => r.Rating); // Recalculate average rating

            await _context.SaveChangesAsync();

            return Ok(); // Return Ok without the book object
        }
        catch (Exception ex)
        {
            // Log the exception and return a 500 error with the message
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    // DTO class to transfer review data
    public class ReviewDto
    {
        public int Id { get; set; }
        public string Comment { get; set; }
        public int Rating { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    // Model class to receive review data from the client
    public class ReviewModel
    {
        public string Comment { get; set; }
        public int Rating { get; set; }
    }
}
