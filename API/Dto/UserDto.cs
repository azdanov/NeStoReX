namespace API.Dto;

public record struct UserDto(string Email, AddressDto? Address);