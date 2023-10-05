namespace API.Dto;

public record struct BasketDto
(
    int Id,
    List<BasketItemDto> Items
);