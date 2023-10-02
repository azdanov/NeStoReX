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

    [HttpGet]
    public async Task<ActionResult<BasketDto>> GetBasket()
    {
        var basket = await _basketService.GetBasketAsync(AcquireBuyerId());
        if (basket == null)
        {
            CleanupCookie();
            return NotFound();
        }

        return Ok(basket.MapBasketToDto());
    }


    [HttpPut("product/{productId:int}/add")]
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

        return Ok(basket.MapBasketToDto());
    }

    [HttpPut("product/{productId:int}/remove")]
    public async Task<ActionResult<BasketDto>> RemoveBasketItem([FromRoute] int productId, [FromQuery] int quantity = 1)
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

        return Ok(basket.MapBasketToDto());
    }

    private string AcquireBuyerId()
    {
        var buyerId = Request.Cookies[BuyerIdCookie];

        if (!string.IsNullOrEmpty(buyerId)) return buyerId;

        buyerId = Guid.NewGuid().ToString();

        Response.Cookies.Append(BuyerIdCookie, buyerId, new CookieOptions
            { IsEssential = true, Expires = DateTime.Now.AddDays(30), HttpOnly = false });

        return buyerId;
    }

    private void CleanupCookie()
    {
        if (Request.Cookies.ContainsKey(BuyerIdCookie))
        {
            Response.Cookies.Delete(BuyerIdCookie);
        }
    }
}