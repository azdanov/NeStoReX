using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace API.Data.Configurations;

public class UserRoleConfiguration : IEntityTypeConfiguration<IdentityUserRole<int>>
{
    public void Configure(EntityTypeBuilder<IdentityUserRole<int>> builder)
    {
        builder.HasData(
            new IdentityUserRole<int> { RoleId = 1, UserId = 1 },
            new IdentityUserRole<int> { RoleId = 2, UserId = 1 },
            new IdentityUserRole<int> { RoleId = 2, UserId = 2 }
        );
    }
}