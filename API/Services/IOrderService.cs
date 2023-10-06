using API.Dto;
using API.Entities.Order;

namespace API.Services;

public interface IOrderService
{
    Task<List<Order>> GetOrdersAsync(int userId);
    Task<Order?> GetOrderByIdAsync(int userId, int orderId);
    Task<Order> CreateOrderAsync(int userId, CreateOrderRequest orderRequest, string paymentIntentId);
}