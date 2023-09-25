namespace API.Dto;

public record struct BasketDto
(
    int Id,
    string BuyerId,
    List<BasketItemDto> Items
);