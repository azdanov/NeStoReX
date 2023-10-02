using API.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace API.Data.Configurations;

public class RolesConfiguration : IEntityTypeConfiguration<Role>
{
    public void Configure(EntityTypeBuilder<Role> builder)
    {
        builder
            .HasData(
                new Role
                {
                    Id = 1, Name = RoleEnum.Admin.ToString(),
                    NormalizedName = RoleEnum.Admin.ToString().ToUpperInvariant()
                },
                new Role
                {
                    Id = 2, Name = RoleEnum.Member.ToString(),
                    NormalizedName = RoleEnum.Member.ToString().ToUpperInvariant()
                }
            );
    }
}