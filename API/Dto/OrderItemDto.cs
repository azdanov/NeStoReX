namespace API.Dto;

public record struct OrderItemDto
(
    int ProductId,
    string Name,
    string PictureUrl,
    long Price,
    int Quantity
);