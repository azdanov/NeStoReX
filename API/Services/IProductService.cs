using API.Entities;
using API.Pagination;

namespace API.Services;

public interface IProductService
{
    Task<PagedList<Product>> GetProductsAsync(ProductParams productParams);
    Task<Product?> GetProductByIdAsync(int id);
    Task<ProductFilters> GetProductFiltersAsync();
}