namespace API.Dto;

public record struct OrderDto
(
    int Id,
    AddressDto ShippingAddress,
    DateTimeOffset OrderDate,
    List<OrderItemDto> OrderItems,
    long Subtotal,
    long DeliveryFee,
    string OrderStatus,
    long Total
);