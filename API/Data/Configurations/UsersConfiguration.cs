using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace API.Data.Configurations;

public class UsersConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder
            .HasOne(a => a.Address)
            .WithOne()
            .HasForeignKey<UserAddress>(a => a.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasData(
            new User
            {
                Id = 1,
                Email = "admin@localhost.com",
                NormalizedEmail = "ADMIN@LOCALHOST.COM",
                UserName = "admin",
                NormalizedUserName = "ADMIN",
                PasswordHash =
                    "AQAAAAIAAYagAAAAEGypFmNEcAyOGnFbnzG65FM/RBWJICVpJmYOAAOV4dF/MY1QnNB+FEZzuI2zuSSrWQ==", // 123321qw!
                EmailConfirmed = true,
                ConcurrencyStamp = "a0f9d9a1-bf96-454e-8ccf-6b4a3d6f3bcd",
                SecurityStamp = "20e51015-0b17-4a7e-92a6-3128aa7afac6"
            },
            new User
            {
                Id = 2,
                Email = "user@localhost.com",
                NormalizedEmail = "USER@LOCALHOST.COM",
                UserName = "user",
                NormalizedUserName = "USER",
                PasswordHash =
                    "AQAAAAIAAYagAAAAEKwxV161j475KbYyWpv+Nf2qCIaF1otMPrSw0y2IWSaOvd8uxz0vhcpyYcALaQu6vg==", // 123321qw!
                EmailConfirmed = true,
                ConcurrencyStamp = "569f516b-dcc7-4dd2-a7e6-cc7826135696",
                SecurityStamp = "dec1de48-c9be-43db-a9ce-a2dfe1a8144d"
            }
        );
    }
}