﻿namespace API.Entities;

public class Basket
{
    public int Id { get; set; }
    public int? UserId { get; set; }
    public User? User { get; set; }
    public List<BasketItem> Items { get; set; } = new();
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }
}