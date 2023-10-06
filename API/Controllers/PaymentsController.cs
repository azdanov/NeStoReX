using API.Exceptions;
using API.Services;
using Microsoft.AspNetCore.Mvc;
using Stripe;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PaymentsController : ControllerBase
{
    private readonly IConfiguration _config;
    private readonly ILogger<PaymentsController> _logger;
    private readonly IPaymentService _paymentService;

    public PaymentsController(IPaymentService paymentService, IConfiguration config, ILogger<PaymentsController> logger)
    {
        _config = config;
        _logger = logger;
        _paymentService = paymentService;
    }

    [HttpPost("webhook")]
    public async Task<ActionResult> StripeWebhook()
    {
        var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();

        var signatureHeader = Request.Headers["Stripe-Signature"];
        var endpointSecret = _config["StripeSettings:WebHookSecret"];

        var stripeEvent = EventUtility.ConstructEvent(json, signatureHeader, endpointSecret);

        if (stripeEvent.Type == Events.ChargeSucceeded)
        {
            var paymentIntent = (Charge)stripeEvent.Data.Object;
            _logger.LogInformation("Handled event type: {Type}", stripeEvent.Type);
            _logger.LogInformation("A successful payment for {Amount} was made", paymentIntent.Amount);

            try
            {
                await _paymentService.UpdateOrderPaymentSucceeded(paymentIntent.PaymentIntentId, paymentIntent.Status);
            }
            catch (NotFoundException e)
            {
                _logger.LogWarning("{Message}", e.Message);
                return NotFound();
            }
        }
        else
        {
            _logger.LogInformation("Unhandled event type: {Type}", stripeEvent.Type);
        }

        return Ok();
    }
}