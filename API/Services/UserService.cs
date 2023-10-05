using API.Data;
using API.Dto;
using API.Entities;
using API.Extensions;
using Microsoft.EntityFrameworkCore;

namespace API.Services;

internal class UserService : IUserService
{
    private readonly StoreDbContext _context;

    public UserService(StoreDbContext context)
    {
        _context = context;
    }

    public async Task SaveAddressAsync(int userId, AddressDto addressDto)
    {
        var user = await _context.Users
            .Include(u => u.Address)
            .FirstOrDefaultAsync(u => u.Id == userId);
        user!.Address = addressDto.MapToUserAddress();
        await _context.SaveChangesAsync();
    }

    public async Task<UserAddress?> GetAddressAsync(int userId)
    {
        return await _context.Users
            .Where(user => user.Id == userId)
            .Select(user => user.Address)
            .FirstOrDefaultAsync();
    }
}