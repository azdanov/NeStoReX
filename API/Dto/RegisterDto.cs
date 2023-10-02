namespace API.Dto;

public record RegisterDto(
    string Email,
    string Username,
    string Password
);