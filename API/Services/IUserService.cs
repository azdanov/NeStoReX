using API.Dto;
using API.Entities;

namespace API.Services;

public interface IUserService
{
    Task SaveAddressAsync(int userId, AddressDto addressDto);
    Task<UserAddress?> GetAddressAsync(int userId);
}