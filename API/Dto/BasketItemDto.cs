namespace API.Dto;

public record struct BasketItemDto
(
    int ProductId,
    string Name,
    long Price,
    string PictureUrl,
    string Brand,
    string Type,
    int Quantity
);