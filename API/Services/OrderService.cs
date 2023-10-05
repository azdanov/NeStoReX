using API.Data;
using API.Dto;
using API.Entities.Order;
using API.Exceptions;
using API.Extensions;
using Microsoft.EntityFrameworkCore;

namespace API.Services;

public class OrderService : IOrderService
{
    private readonly IBasketService _basketService;
    private readonly StoreDbContext _context;

    public OrderService(StoreDbContext context, IBasketService basketService)
    {
        _context = context;
        _basketService = basketService;
    }

    public async Task<List<Order>> GetOrdersAsync(int userId)
    {
        return await _context.Orders
            .Include(order => order.OrderItems)
            .Where(order => order.UserId == userId)
            .ToListAsync();
    }

    public async Task<Order?> GetOrderByIdAsync(int userId, int orderId)
    {
        return await _context.Orders
            .Where(order => order.UserId == userId && order.Id == orderId)
            .FirstOrDefaultAsync();
    }

    public async Task<Order> CreateOrderAsync(int userId, CreateOrderDto orderDto)
    {
        var basket = await _basketService.GetBasketAsync(userId);
        if (basket == null)
        {
            throw new BadRequestException(
                $"Basket with id {userId} does not exist",
                new Dictionary<string, string[]> { { "basket", new[] { $"Basket with id {userId} does not exist" } } }
            );
        }

        var items = new List<OrderItem>();
        foreach (var item in basket.Items)
        {
            var productItem = await _context.Products.FindAsync(item.ProductId);
            var orderItem = new OrderItem
            {
                Ordered = new ProductOrdered
                {
                    ProductId = productItem!.Id,
                    Name = productItem.Name,
                    PictureUrl = productItem.PictureUrl
                },
                Price = productItem.Price,
                Quantity = item.Quantity
            };
            items.Add(orderItem);
            productItem.QuantityInStock -= item.Quantity;
        }

        var order = new Order
        {
            OrderItems = items,
            ShippingAddress = orderDto.Address.MapToShippingAddress(),
            Subtotal = items.Sum(item => item.Price * item.Quantity),
            DeliveryFee = items.Sum(item => item.Price * item.Quantity) > 10000 ? 0 : 500,
            UserId = userId
        };

        basket.Items.Clear();
        _context.Baskets.Update(basket);
        _context.Orders.Add(order);

        await _context.SaveChangesAsync();

        return order;
    }
}