namespace API.Entities.Order;

public class ProductOrdered
{
    public int ProductId { get; set; }
    public string Name { get; set; } = default!;
    public string PictureUrl { get; set; } = default!;
}