namespace API.Dto;

public record struct CreateOrderDto(
    bool SaveAddress,
    AddressDto Address
);