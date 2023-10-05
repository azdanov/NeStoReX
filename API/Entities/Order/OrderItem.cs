namespace API.Entities.Order;

public class OrderItem
{
    public int Id { get; set; }
    public ProductOrdered Ordered { get; set; } = default!;
    public long Price { get; set; }
    public int Quantity { get; set; }

    public int OrderId { get; set; }
}