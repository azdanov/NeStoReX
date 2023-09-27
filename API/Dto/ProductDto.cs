namespace API.Dto;

public record struct ProductDto
(
    int Id,
    string Name,
    string Description,
    long Price,
    string PictureUrl,
    string Type,
    string Brand,
    int QuantityInStock
);