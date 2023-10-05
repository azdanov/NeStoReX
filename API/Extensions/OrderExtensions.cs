using API.Dto;
using API.Entities.Order;

namespace API.Extensions;

public static class OrderExtensions
{
    public static List<OrderDto> MapOrdersToDto(this List<Order> orders)
    {
        return orders.Select(MapOrderToDto).ToList();
    }

    public static OrderDto MapOrderToDto(this Order basket)
    {
        return new OrderDto
        {
            Id = basket.Id,
            ShippingAddress = basket.ShippingAddress.MapAddressToDto(),
            OrderDate = basket.OrderDate,
            OrderItems = basket.OrderItems
                .Select(item => new OrderItemDto
                {
                    ProductId = item.Id,
                    Name = item.Ordered.Name,
                    PictureUrl = item.Ordered.PictureUrl,
                    Price = item.Price,
                    Quantity = item.Quantity
                })
                .ToList(),
            Subtotal = basket.Subtotal,
            DeliveryFee = basket.DeliveryFee,
            OrderStatus = basket.OrderStatus.ToString(),
            Total = basket.Subtotal + basket.DeliveryFee
        };
    }
}