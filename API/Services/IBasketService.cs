﻿using API.Dto;
using API.Entities;

namespace API.Services;

public interface IBasketService
{
    Task<Basket?> GetBasketAsync(int basketId);
    Task AddItemToBasketAsync(Basket basket, int productId, int quantity = 1);
    Task RemoveItemFromBasketAsync(Basket basket, int productId, int quantity = 1);
    Task TransferBasketAsync(int basketId, User user);
    Task SaveBasketsAsync(Basket basket, BasketDto basketDto);
}