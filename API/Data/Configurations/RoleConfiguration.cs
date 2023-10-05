using API.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace API.Data.Configurations;

public class RoleConfiguration : IEntityTypeConfiguration<Role>
{
    public void Configure(EntityTypeBuilder<Role> builder)
    {
        builder
            .HasData(
                new Role
                {
                    Id = 1, Name = Constants.Admin,
                    NormalizedName = Constants.Admin.ToUpperInvariant()
                },
                new Role
                {
                    Id = 2, Name = Constants.Member,
                    NormalizedName = Constants.Member.ToUpperInvariant()
                }
            );
    }
}