using API.Data;
using API.Dto;
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

    public async Task<Basket?> GetBasketAsync(int basketId)
    {
        return await _context.Baskets
            .Include(basket => basket.Items)
            .ThenInclude(basketItem => basketItem.Product)
            .FirstOrDefaultAsync(basket => basket.Id == basketId);
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

    public async Task TransferBasketAsync(int basketId, User user)
    {
        var anonymousBasket = await _context.Baskets.FirstOrDefaultAsync(basket => basket.Id == basketId);
        if (anonymousBasket == null) return;

        await _context.Entry(user).Reference(x => x.Basket).LoadAsync();

        var userBasket = await _context.Baskets.FirstOrDefaultAsync(basket => basket.Id == user.Basket.Id);
        if (userBasket != null) _context.Baskets.Remove(userBasket);

        user.Basket = anonymousBasket;
        _context.Users.Update(user);

        await _context.SaveChangesAsync();
    }

    public Task SaveBasketsAsync(Basket basket, BasketDto basketDto)
    {
        basket.Items.Clear();
        basket.Items.AddRange(basketDto.Items.Select(item => new BasketItem
        {
            ProductId = item.ProductId,
            Quantity = item.Quantity,
            Basket = basket
        }));

        _context.Baskets.Update(basket);

        return _context.SaveChangesAsync();
    }
}