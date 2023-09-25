using API.Entities;

namespace API.Services;

public interface IBasketService
{
    Task<Basket?> GetBasketAsync(string buyerId);
    Task<Basket> CreateBasketAsync(string buyerId);
    Task AddItemToBasketAsync(Basket basket, int productId, int quantity = 1);
    Task RemoveItemFromBasketAsync(Basket basket, int productId, int quantity = 1);
}