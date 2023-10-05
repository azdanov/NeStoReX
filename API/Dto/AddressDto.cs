namespace API.Dto;

public record struct AddressDto(
    string FullName,
    string Address1,
    string? Address2,
    string City,
    string State,
    string Zip,
    string Country
);