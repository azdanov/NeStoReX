using API.Data;
using API.Entities;
using API.Exceptions;
using Microsoft.EntityFrameworkCore;

namespace API.Services;

public class BasketService : IBasketService
{
    private readonly StoreDbContext _context;

    public BasketService(StoreDbContext context)
    {
        _context = context;
    }

    public async Task<Basket?> GetBasketAsync(string buyerId)
    {
        return await _context.Baskets
            .Include(i => i.Items)
            .ThenInclude(p => p.Product)
            .FirstOrDefaultAsync(b => b.BuyerId == buyerId);
    }

    public async Task<Basket> CreateBasketAsync(string buyerId)
    {
        var basket = new Basket { BuyerId = buyerId };
        _context.Baskets.Add(basket);

        var result = await _context.SaveChangesAsync();
        if (result <= 0) throw new ServerException("Problem creating basket.");

        return basket;
    }

    public async Task AddItemToBasketAsync(Basket basket, int productId, int quantity = 1)
    {
        var product = await _context.Products.FindAsync(productId);
        if (product == null)
        {
            throw new BadRequestException($"Product ({productId}) not found.", new Dictionary<string, string[]>
            {
                { "ProductId", new[] { "Product not found." } }
            });
        }

        var existingItem = basket.Items.Find(item => item.ProductId == product.Id);
        if (existingItem != null)
        {
            existingItem.Quantity += quantity;
        }
        else
        {
            basket.Items.Add(new BasketItem { Product = product, Quantity = quantity, Basket = basket });
        }
        
        _context.Baskets.Update(basket);

        var result = await _context.SaveChangesAsync();
        if (result <= 0) throw new ServerException("Problem saving item to basket.");
    }

    public async Task RemoveItemFromBasketAsync(Basket basket, int productId, int quantity = 1)
    {
        var product = await _context.Products.FindAsync(productId);
        if (product == null)
        {
            throw new BadRequestException($"Product ({productId}) not found.", new Dictionary<string, string[]>
            {
                { "ProductId", new[] { "Product not found." } }
            });
        }

        var item = basket.Items.Find(basketItem => basketItem.ProductId == productId);
        if (item == null) return;

        item.Quantity -= quantity;
        if (item.Quantity == 0) basket.Items.Remove(item);
        
        _context.Baskets.Update(basket);

        var result = await _context.SaveChangesAsync();
        if (result <= 0) throw new ServerException("Problem removing item from the basket.");
    }
}