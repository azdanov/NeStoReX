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
    private readonly IUserService _userService;

    public OrdersController(IOrderService orderService, IUserService userService)
    {
        _orderService = orderService;
        _userService = userService;
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
    public async Task<ActionResult<OrderDto>> CreateOrder([FromBody] CreateOrderDto orderDto)
    {
        var success = int.TryParse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value, out var userId);
        if (!success) return Unauthorized();

        Order order;
        try
        {
            order = await _orderService.CreateOrderAsync(userId, orderDto);
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

        if (orderDto.SaveAddress) await _userService.SaveAddressAsync(userId, orderDto.Address);

        return CreatedAtAction(nameof(GetOrder), new { id = order.Id }, order.MapOrderToDto());
    }
}