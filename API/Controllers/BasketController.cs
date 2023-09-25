using API.Dto;
using API.Exceptions;
using API.Extensions;
using API.Services;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BasketController : ControllerBase
{
    private const string BuyerIdCookie = "buyerId";
    private readonly IBasketService _basketService;

    public BasketController(IBasketService basketService)
    {
        _basketService = basketService;
    }

    [HttpGet(Name = nameof(GetBasket))]
    public async Task<ActionResult<BasketDto>> GetBasket()
    {
        var basket = await _basketService.GetBasketAsync(AcquireBuyerId());
        if (basket == null) return NotFound();

        return Ok(basket.MapBasketToDto());
    }

    [HttpPost("product/{productId:int}")]
    public async Task<ActionResult<BasketDto>> AddItemToBasket([FromRoute] int productId, [FromQuery] int quantity = 1)
    {
        var basket = await _basketService.GetBasketAsync(AcquireBuyerId()) ??
                     await _basketService.CreateBasketAsync(AcquireBuyerId());
        try
        {
            await _basketService.AddItemToBasketAsync(basket, productId, quantity);
        }
        catch (BadRequestException e)
        {
            e.AddToModelState(ModelState);
            return ValidationProblem();
        }

        return CreatedAtRoute(nameof(GetBasket), basket.MapBasketToDto());
    }

    [HttpDelete("product/{productId:int}")]
    public async Task<ActionResult> RemoveBasketItem([FromRoute] int productId, [FromQuery] int quantity = 1)
    {
        var basket = await _basketService.GetBasketAsync(AcquireBuyerId());
        if (basket == null) return NotFound();

        try
        {
            await _basketService.RemoveItemFromBasketAsync(basket, productId, quantity);
        }
        catch (BadRequestException e)
        {
            e.AddToModelState(ModelState);
            return ValidationProblem();
        }

        return NoContent();
    }

    private string AcquireBuyerId()
    {
        var buyerId = User.Identity?.Name ?? Request.Cookies[BuyerIdCookie];

        if (!string.IsNullOrEmpty(buyerId)) return buyerId;

        buyerId = Guid.NewGuid().ToString();
        var cookieOptions = new CookieOptions { IsEssential = true, Expires = DateTime.Now.AddDays(30) };
        Response.Cookies.Append(BuyerIdCookie, buyerId, cookieOptions);

        return buyerId;
    }
}