using System.Reflection;
using API.Entities;
using API.Entities.Order;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class StoreDbContext : IdentityDbContext<User, Role, int>
{
    public StoreDbContext(DbContextOptions<StoreDbContext> options) : base(options)
    {
    }

    public DbSet<Product> Products { get; set; } = default!;
    public DbSet<Basket> Baskets { get; set; } = default!;
    public DbSet<BasketItem> BasketItems { get; set; } = default!;
    public DbSet<Order> Orders { get; set; } = default!;
    public DbSet<OrderItem> OrderItems { get; set; } = default!;

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());

        builder.Entity<User>().ToTable("Users");
        builder.Entity<Role>().ToTable("Roles");
        builder.Entity<IdentityUserClaim<int>>().ToTable("UserClaims");
        builder.Entity<IdentityUserRole<int>>().ToTable("UserRoles");
        builder.Entity<IdentityUserLogin<int>>().ToTable("UserLogins");
        builder.Entity<IdentityRoleClaim<int>>().ToTable("RoleClaims");
        builder.Entity<IdentityUserToken<int>>().ToTable("UserTokens");
    }

    public override int SaveChanges()
    {
        ChangeTracker.DetectChanges();

        SetAudit();

        return base.SaveChanges();
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = new())
    {
        ChangeTracker.DetectChanges();

        SetAudit();

        return await base.SaveChangesAsync(cancellationToken);
    }

    private void SetAudit()
    {
        var now = DateTimeOffset.UtcNow;

        // Can be extracted to parent class AuditableEntity
        foreach (var item in ChangeTracker.Entries<Basket>()
                     .Where(e => e.State is EntityState.Added or EntityState.Modified))
        {
            item.Entity.UpdatedAt = now;

            if (item.State == EntityState.Added)
            {
                item.Entity.CreatedAt = now;
            }
        }
    }
}