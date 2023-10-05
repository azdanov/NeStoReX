using System.Security.Claims;
using API.Data;
using API.Dto;
using API.Exceptions;
using API.Extensions;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize(Roles = Constants.Member)]
[ApiController]
[Route("api/[controller]")]
public class BasketController : ControllerBase
{
    private readonly IBasketService _basketService;

    public BasketController(IBasketService basketService)
    {
        _basketService = basketService;
    }

    [HttpGet]
    public async Task<ActionResult<BasketDto>> GetBasket()
    {
        var basketId = int.Parse(User.FindFirstValue(Constants.BasketIdClaim)!);

        var basket = await _basketService.GetBasketAsync(basketId);
        if (basket == null) return NotFound();

        return Ok(basket.MapBasketToDto());
    }

    [HttpPut("product/{productId:int}/add")]
    public async Task<ActionResult<BasketDto>> AddItemToBasket([FromRoute] int productId, [FromQuery] int quantity = 1)
    {
        var basketId = int.Parse(User.FindFirstValue(Constants.BasketIdClaim)!);

        var basket = await _basketService.GetBasketAsync(basketId);
        if (basket == null) return NotFound();

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
        var basketId = int.Parse(User.FindFirstValue(Constants.BasketIdClaim)!);

        var basket = await _basketService.GetBasketAsync(basketId);
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


    [HttpPut]
    public async Task<IActionResult> SaveBasket([FromBody] BasketDto basketDto)
    {
        var basketId = int.Parse(User.FindFirstValue(Constants.BasketIdClaim)!);

        var basket = await _basketService.GetBasketAsync(basketId);
        if (basket == null) return NotFound();

        try
        {
            await _basketService.SaveBasketsAsync(basket, basketDto);
        }
        catch (BadRequestException e)
        {
            e.AddToModelState(ModelState);
            return ValidationProblem();
        }

        return Ok();
    }
}