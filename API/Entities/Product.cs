namespace API.Entities;

public class Product
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string PictureUrl { get; set; } = string.Empty;
    public string ProductType { get; set; } = default!;
    public string ProductBrand { get; set; } = default!;
    public int QuantityInStock { get; set; }
}