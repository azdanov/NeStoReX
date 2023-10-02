using System.Reflection;
using API.Entities;
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

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
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