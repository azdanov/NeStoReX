using API.Dto;
using API.Entities;

namespace API.Extensions;

public static class ProductExtensions
{
    public static List<ProductDto> MapProductsToDtos(this IEnumerable<Product> products)
    {
        return products.Select(product => new ProductDto
        {
            Id = product.Id,
            Name = product.Name,
            Description = product.Description,
            Price = product.Price,
            PictureUrl = product.PictureUrl,
            Type = product.Type,
            Brand = product.Brand,
            QuantityInStock = product.QuantityInStock
        }).ToList();
    }

    public static ProductDto MapProductToDto(this Product basket)
    {
        return new ProductDto
        {
            Id = basket.Id,
            Name = basket.Name,
            Description = basket.Description,
            Price = basket.Price,
            PictureUrl = basket.PictureUrl,
            Type = basket.Type,
            Brand = basket.Brand,
            QuantityInStock = basket.QuantityInStock
        };
    }
}