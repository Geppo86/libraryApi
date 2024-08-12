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

    public BooksController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetBooks()
    {
        var books = await _context.Books.ToListAsync();
        return Ok(books);
    }

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

    [Authorize(Roles = "Librarian")]
    [HttpPost]
    public async Task<IActionResult> AddBook(Book book)
    {
        _context.Books.Add(book);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetBook), new { id = book.Id }, book);
    }

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

    public class ReviewDto
    {
        public int Id { get; set; }
        public string Comment { get; set; }
        public int Rating { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class ReviewModel
    {
        public string Comment { get; set; }
        public int Rating { get; set; }
    }
}
