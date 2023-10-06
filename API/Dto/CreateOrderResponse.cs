namespace API.Dto;

public record struct CreateOrderResponse
(
    int OrderId,
    string ClientSecret
);