using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TodoApi.Auth;

namespace TodoApi.Auth;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponseDto>> Register(RegisterDto registerDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var result = await _authService.RegisterAsync(registerDto);
        
        if (result == null)
            return BadRequest(new { message = "Username or email already exists" });

        return Ok(result);
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponseDto>> Login(LoginDto loginDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var result = await _authService.LoginAsync(loginDto);
        
        if (result == null)
            return Unauthorized(new { message = "Invalid username/email or password" });

        return Ok(result);
    }

    [HttpPost("change-password")]
    [Authorize]
    public async Task<IActionResult> ChangePassword(ChangePasswordDto changePasswordDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var userIdClaim = User.FindFirst("userId")?.Value;
        if (userIdClaim == null || !int.TryParse(userIdClaim, out int userId))
            return Unauthorized();

        var result = await _authService.ChangePasswordAsync(userId, changePasswordDto);
        
        if (!result)
            return BadRequest(new { message = "Current password is incorrect" });

        return Ok(new { message = "Password changed successfully" });
    }

    [HttpPost("reset-password")]
    public IActionResult ResetPassword(ResetPasswordDto resetPasswordDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        // In a real application, you would send a reset password email
        // For now, we'll just return a success message
        return Ok(new { message = "If the email exists, a password reset link has been sent" });
    }

    [HttpPost("logout")]
    [Authorize]
    public IActionResult Logout()
    {
        // With JWT tokens, logout is typically handled client-side by discarding the token
        // Here we can log the logout event, invalidate refresh tokens, etc.
        
        var username = User.FindFirst(ClaimTypes.Name)?.Value;
        var userId = User.FindFirst("userId")?.Value;
        
        // TODO: In a production app, you might want to:
        // 1. Add the token to a blacklist/revocation list
        // 2. Log the logout event
        // 3. Invalidate any refresh tokens
        
        return Ok(new { message = "Successfully logged out", username });
    }

    [HttpGet("profile")]
    [Authorize]
    public IActionResult GetProfile()
    {
        var username = User.FindFirst(ClaimTypes.Name)?.Value;
        var email = User.FindFirst(ClaimTypes.Email)?.Value;
        var userId = User.FindFirst("userId")?.Value;

        return Ok(new { username, email, userId });
    }
}
