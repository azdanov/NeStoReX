using API.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace API.Data.Configurations;

public class BasketConfiguration : IEntityTypeConfiguration<Basket>
{
    public void Configure(EntityTypeBuilder<Basket> builder)
    {
        builder.HasMany(basket => basket.Items)
            .WithOne(basketItem => basketItem.Basket)
            .HasForeignKey(basketItem => basketItem.BasketId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasData(
            new Basket
            {
                Id = 1,
                UserId = 1
            },
            new Basket
            {
                Id = 2,
                UserId = 2
            }
        );
    }
}