﻿namespace API.Entities;

public class Basket
{
    public int Id { get; set; }
    public string BuyerId { get; set; } = default!;
    public List<BasketItem> Items { get; set; } = new();
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }
}