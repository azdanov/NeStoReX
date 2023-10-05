using Microsoft.AspNetCore.Identity;

namespace API.Entities;

public class User : IdentityUser<int>
{
    public UserAddress? Address { get; set; }
    public Basket Basket { get; set; } = default!;
    public List<Order.Order> Orders { get; set; } = new();
}