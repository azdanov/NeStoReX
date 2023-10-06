namespace API.Dto;

public record struct CreateOrderRequest(
    bool SaveAddress,
    AddressDto Address
);