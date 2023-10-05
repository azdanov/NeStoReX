using API.Dto;
using API.Entities;
using API.Entities.Order;

namespace API.Extensions;

public static class AddressExtensions
{
    public static AddressDto MapAddressToDto(this Address address)
    {
        return new AddressDto
        {
            FullName = address.FullName,
            Address1 = address.Address1,
            Address2 = address.Address2,
            City = address.City,
            State = address.State,
            Zip = address.Zip,
            Country = address.Country
        };
    }

    public static UserAddress MapToUserAddress(this AddressDto addressDto)
    {
        return new UserAddress
        {
            FullName = addressDto.FullName,
            Address1 = addressDto.Address1,
            Address2 = addressDto.Address2,
            City = addressDto.City,
            State = addressDto.State,
            Zip = addressDto.Zip,
            Country = addressDto.Country
        };
    }

    public static ShippingAddress MapToShippingAddress(this AddressDto addressDto)
    {
        return new ShippingAddress
        {
            FullName = addressDto.FullName,
            Address1 = addressDto.Address1,
            Address2 = addressDto.Address2,
            City = addressDto.City,
            State = addressDto.State,
            Zip = addressDto.Zip,
            Country = addressDto.Country
        };
    }
}