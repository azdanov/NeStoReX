using API.Dto;
using API.Entities;
using API.Options;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AccountsController : ControllerBase
{
    private const string RefreshTokenName = "RefreshToken";

    private readonly UserManager<User> _userManager;
    private readonly IAuthService _authService;
    private readonly AppOptions _appOptions;

    public AccountsController(UserManager<User> userManager, IAuthService authService, IOptions<AppOptions> appOptions)
    {
        _userManager = userManager;
        _authService = authService;
        _appOptions = appOptions.Value;
    }

    [HttpPost("login")]
    public async Task<ActionResult<TokenDto>> Login(LoginDto loginDto)
    {
        var user = await _userManager.FindByNameAsync(loginDto.Username);
        if (user == null || !await _userManager.CheckPasswordAsync(user, loginDto.Password))
            return Unauthorized();

        var (accessToken, refreshToken) = await UserTokens(user);
        return new TokenDto(accessToken, refreshToken);
    }

    [HttpPost("register")]
    public async Task<ActionResult<TokenDto>> RegisterUser(RegisterDto registerDto)
    {
        var user = new User { UserName = registerDto.Username, Email = registerDto.Email };

        var result = await _userManager.CreateAsync(user, registerDto.Password);
        if (!result.Succeeded)
        {
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(error.Code, error.Description);
            }

            return ValidationProblem();
        }

        await _userManager.AddToRoleAsync(user, "Member");

        return NoContent();
    }

    [Authorize]
    [HttpPost("logout")]
    public async Task<ActionResult> Logout()
    {
        var identityName = User.Identity?.Name ?? "";
        if (string.IsNullOrEmpty(identityName))
            return Unauthorized();

        var user = await _userManager.FindByNameAsync(identityName);
        if (user == null)
            return Unauthorized();

        await _userManager.RemoveAuthenticationTokenAsync(user, _appOptions.Name, RefreshTokenName);

        return NoContent();
    }

    [Authorize]
    [HttpGet("current-user")]
    public async Task<ActionResult<UserDto>> GetCurrentUser()
    {
        var identityName = User.Identity?.Name ?? "";
        if (string.IsNullOrEmpty(identityName))
            return Unauthorized();
        
        var user = await _userManager.FindByNameAsync(identityName);
        if (user == null)
            return Unauthorized();

        return new UserDto
        {
            Email = user.Email!
        };
    }

    [HttpPost("refresh-token")]
    public async Task<ActionResult<TokenDto>> RefreshToken(RefreshTokenDto refreshTokenDto)
    {
        var principal = _authService.GetPrincipalFromExpiredToken(refreshTokenDto.AccessToken);
        var identityName = principal.Identity?.Name ?? "";
        if (string.IsNullOrEmpty(identityName))
            return Unauthorized();

        var user = await _userManager.FindByNameAsync(identityName);
        if (user == null)
            return Unauthorized();

        var foundRefreshToken =
            await _userManager.GetAuthenticationTokenAsync(user, _appOptions.Name, RefreshTokenName);
        if (foundRefreshToken != refreshTokenDto.RefreshToken)
            return Unauthorized();

        var isValidRefreshToken =
            await _userManager.VerifyUserTokenAsync(user, _appOptions.Name, RefreshTokenName, foundRefreshToken);
        if (!isValidRefreshToken)
            return Unauthorized();

        var (accessToken, refreshToken) = await UserTokens(user);
        return new TokenDto(accessToken, refreshToken);
    }

    private async Task<(string accessToken, string refreshToken)> UserTokens(User user)
    {
        var accessToken = await _authService.GenerateTokenAsync(user);
        await _userManager.RemoveAuthenticationTokenAsync(user, _appOptions.Name, RefreshTokenName);
        var refreshToken = await _userManager.GenerateUserTokenAsync(user, _appOptions.Name, RefreshTokenName);
        await _userManager.SetAuthenticationTokenAsync(user, _appOptions.Name, RefreshTokenName, refreshToken);
        return (accessToken, refreshToken);
    }
}