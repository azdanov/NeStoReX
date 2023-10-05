namespace API.Entities.Order;

public class Order
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public User User { get; set; } = default!;

    public ShippingAddress ShippingAddress { get; set; } = default!;
    public DateTimeOffset OrderDate { get; set; } = DateTimeOffset.UtcNow;
    public List<OrderItem> OrderItems { get; set; } = new();

    public long Subtotal { get; set; }
    public long DeliveryFee { get; set; }

    public OrderStatus OrderStatus { get; set; } = OrderStatus.Pending;
}