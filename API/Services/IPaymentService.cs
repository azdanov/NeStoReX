using API.Dto;

namespace API.Services;

public interface IPaymentService
{
    public Task<PaymentIntentDto> CreatePaymentIntent(int userId, AddressDto address);
    Task UpdateOrderPaymentSucceeded(string paymentIntentId, string paymentIntentStatus);
}