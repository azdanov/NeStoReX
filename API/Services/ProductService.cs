using API.Data;
using API.Entities;
using API.Extensions;
using API.Pagination;
using Microsoft.EntityFrameworkCore;

namespace API.Services;

public class ProductService : IProductService
{
    private readonly StoreDbContext _context;

    public ProductService(StoreDbContext context)
    {
        _context = context;
    }

    public async Task<PagedList<Product>> GetProductsAsync(ProductParams productParams)
    {
        var query = _context.Products
            .Sort(productParams.OrderBy)
            .Search(productParams.SearchTerm)
            .Filter(productParams.Brands, productParams.Types)
            .AsQueryable();

        return await query.ToPagedListAsync(productParams.CurrentPage, productParams.PageSize);
    }

    public async Task<Product?> GetProductByIdAsync(int id)
    {
        return await _context.Products.FindAsync(id);
    }

    public async Task<ProductFilters> GetProductFiltersAsync()
    {
        var brands = await _context.Products
            .Select(product => product.Brand)
            .Distinct()
            .OrderBy(brand => brand)
            .ToListAsync();
        var types = await _context.Products
            .Select(product => product.Type)
            .Distinct()
            .OrderBy(type => type)
            .ToListAsync();

        return new ProductFilters
        {
            Brands = brands,
            Types = types
        };
    }
}