using System.Security.Claims;
using API.Data;
using API.Dto;
using API.Entities.Order;
using API.Exceptions;
using API.Extensions;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize(Roles = Constants.Member)]
[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly IOrderService _orderService;
    private readonly IPaymentService _paymentService;
    private readonly IUserService _userService;

    public OrdersController(IOrderService orderService, IUserService userService, IPaymentService paymentService)
    {
        _orderService = orderService;
        _userService = userService;
        _paymentService = paymentService;
    }

    [HttpGet]
    public async Task<ActionResult<List<OrderDto>>> GetOrders()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        var orders = await _orderService.GetOrdersAsync(int.Parse(userId));

        return Ok(orders.MapOrdersToDto());
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<OrderDto>> GetOrder(int id)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        var order = await _orderService.GetOrderByIdAsync(int.Parse(userId), id);
        if (order == null) return NotFound();

        return Ok(order.MapOrderToDto());
    }

    [HttpPost]
    public async Task<ActionResult<CreateOrderResponse>> CreateOrder([FromBody] CreateOrderRequest orderRequest)
    {
        var success = int.TryParse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value, out var userId);
        if (!success) return Unauthorized();

        PaymentIntentDto paymentIntent;
        Order order;
        try
        {
            if (orderRequest.SaveAddress) await _userService.SaveAddressAsync(userId, orderRequest.Address);

            paymentIntent = await _paymentService.CreatePaymentIntent(userId, orderRequest.Address);
            order = await _orderService.CreateOrderAsync(userId, orderRequest, paymentIntent.Id);
        }
        catch (BadRequestException e)
        {
            foreach (var (key, value) in e.ValidationErrors)
            {
                foreach (var error in value)
                {
                    ModelState.AddModelError(key, error);
                }
            }

            return ValidationProblem();
        }

        return CreatedAtAction(nameof(GetOrder), new { id = order.Id },
            new CreateOrderResponse(order.Id, paymentIntent.ClientSecret));
    }
}