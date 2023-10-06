using API.Data;
using API.Dto;
using API.Entities.Order;
using API.Exceptions;
using Microsoft.EntityFrameworkCore;
using Stripe;

namespace API.Services;

public class PaymentService : IPaymentService
{
    private readonly StoreDbContext _context;
    private readonly PaymentIntentService _paymentIntentService;

    public PaymentService(PaymentIntentService paymentIntentService, StoreDbContext context)
    {
        _paymentIntentService = paymentIntentService;
        _context = context;
    }

    public async Task<PaymentIntentDto> CreatePaymentIntent(int userId, AddressDto address)
    {
        var user = await _context.Users
            .Include(u => u.Basket)
            .ThenInclude(b => b.Items)
            .ThenInclude(i => i.Product)
            .Where(u => u.Id == userId)
            .FirstOrDefaultAsync();
        if (user == null) throw new NotFoundException("User", userId.ToString());

        var subtotal = user.Basket.Items.Sum(item => item.Quantity * item.Product.Price);
        var deliveryFee = subtotal > 10000 ? 0 : 500;

        var paymentIntent = await _paymentIntentService.CreateAsync(new PaymentIntentCreateOptions
        {
            CaptureMethod = "automatic",
            Amount = subtotal + deliveryFee,
            Currency = "eur",
            ReceiptEmail = user.Email,
            PaymentMethodTypes = new List<string> { "card" },
            Shipping = new ChargeShippingOptions
            {
                Name = address.FullName,
                Address = new AddressOptions
                {
                    Line1 = address.Address1,
                    Line2 = address.Address2,
                    City = address.City,
                    PostalCode = address.Zip,
                    State = address.State,
                    Country = address.Country
                }
            }
        });

        return new PaymentIntentDto(paymentIntent.Id, paymentIntent.ClientSecret);
    }

    public async Task UpdateOrderPaymentSucceeded(string paymentIntentId, string paymentIntentStatus)
    {
        var order = await _context.Orders.FirstOrDefaultAsync(o => o.PaymentIntentId == paymentIntentId);
        if (order == null) throw new NotFoundException(nameof(order), paymentIntentId);

        order.OrderStatus = paymentIntentStatus switch
        {
            "succeeded" => OrderStatus.PaymentReceived,
            "failed" => OrderStatus.PaymentFailed,
            _ => order.OrderStatus
        };

        await _context.SaveChangesAsync();
    }
}