using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;

    // Constructor to initialize the controller with UserManager and SignInManager
    public AuthController(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager)
    {
        _userManager = userManager;
        _signInManager = signInManager;
    }

    /// <summary>
    /// Authenticates a user using their email and password.
    /// </summary>
    /// <param name="model">The login model containing the user's email, password, and remember me option.</param>
    /// <returns>An action result indicating the success or failure of the login attempt.</returns>
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginModel model)
    {
        // Check if the model state is valid
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        // Attempt to find the user by their email
        var user = await _userManager.FindByEmailAsync(model.Email);
        if (user == null)
        {
            // Return unauthorized if the user is not found
            return Unauthorized(new { message = "Invalid login attempt. User not found." });
        }

        // Attempt to sign in the user with the provided credentials
        var result = await _signInManager.PasswordSignInAsync(model.Email, model.Password, model.RememberMe, lockoutOnFailure: false);

        // If the sign-in is successful, return the user's details
        if (result.Succeeded)
        {
            var roles = await _userManager.GetRolesAsync(user);
            return Ok(new
            {
                message = "Login successful",
                username = user.UserName,
                role = roles.FirstOrDefault()
            });
        }

        // Handle specific cases such as account lockout or email confirmation
        if (result.IsLockedOut)
        {
            return Unauthorized(new { message = "User account is locked out." });
        }

        if (result.IsNotAllowed)
        {
            return Unauthorized(new { message = "User is not allowed to sign in. Please confirm your email." });
        }

        // Return a generic unauthorized response for other failed login attempts
        return Unauthorized(new { message = "Invalid login attempt." });
    }

    /// <summary>
    /// Registers a new user in the system.
    /// </summary>
    /// <param name="model">The registration model containing the user's details and password.</param>
    /// <returns>An action result indicating the success or failure of the registration.</returns>
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterModel model)
    {
        // Check if the model state is valid
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        // Create a new ApplicationUser with the provided details
        var user = new ApplicationUser
        {
            UserName = model.Email,
            Email = model.Email,
            FullName = model.FullName,
            Role = model.Role
        };

        // Attempt to create the user with the provided password
        var result = await _userManager.CreateAsync(user, model.Password);

        // If the registration is successful, add the user to the specified role and return success message
        if (result.Succeeded)
        {
            await _userManager.AddToRoleAsync(user, model.Role);
            return Ok(new { message = "Registration successful" });
        }

        // Return a bad request with the errors if the registration fails
        return BadRequest(result.Errors);
    }
}

// Model to handle login requests
public class LoginModel
{
    public string Email { get; set; }
    public string Password { get; set; }
    public bool RememberMe { get; set; }
}

// Model to handle registration requests
public class RegisterModel
{
    public string FullName { get; set; }
    public string Email { get; set; }
    public string Password { get; set; }
    public string Role { get; set; }
}
