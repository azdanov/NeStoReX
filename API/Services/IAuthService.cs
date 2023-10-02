using System.Security.Claims;
using API.Entities;

namespace API.Services;

public interface IAuthService
{
    Task<string> GenerateTokenAsync(User user);
    ClaimsPrincipal GetPrincipalFromExpiredToken(string token);
}