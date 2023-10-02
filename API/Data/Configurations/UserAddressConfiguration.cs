using API.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace API.Data.Configurations;

public class UserAddressConfiguration : IEntityTypeConfiguration<UserAddress>
{
    public void Configure(EntityTypeBuilder<UserAddress> builder)
    {
        builder.HasData(
            new UserAddress
            {
                Id = 1,
                UserId = 2,
                FullName = "Richard Roe",
                Address1 = "456 Broadway",
                Country = "Canada",
                City = "Toronto",
                State = "ON",
                Zip = "M4K 1P1"
            }
        );
    }
}