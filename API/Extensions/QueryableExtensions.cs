using API.Entities;
using API.Pagination;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions;

public static class QueryableExtensions
{
    public static async Task<PagedList<T>> ToPagedListAsync<T>(this IQueryable<T> source, int pageNumber, int pageSize)
    {
        var count = await source.CountAsync();
        var items = await source.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();
        return new PagedList<T>(items, count, pageNumber, pageSize);
    }

    public static IQueryable<Product> Sort(this IQueryable<Product> query, string? orderBy)
    {
        return orderBy switch
        {
            "price" => query.OrderBy(product => product.Price),
            "priceDesc" => query.OrderByDescending(product => product.Price),
            _ => query.OrderBy(product => product.Name)
        };
    }

    public static IQueryable<Product> Search(this IQueryable<Product> query, string? searchTerm)
    {
        return string.IsNullOrEmpty(searchTerm)
            ? query
            : query.Where(product => product.Name.ToLower().Contains(searchTerm.Trim().ToLower()));
    }

    public static IQueryable<Product> Filter(this IQueryable<Product> query, string? brand, string? type)
    {
        var brandList = new List<string>();
        var typeList = new List<string>();

        if (!string.IsNullOrEmpty(brand))
        {
            brandList.AddRange(brand.ToLower().Split(",").ToList());
        }

        if (!string.IsNullOrEmpty(type))
        {
            typeList.AddRange(type.ToLower().Split(",").ToList());
        }

        query = query.Where(product =>
            (brandList.Count == 0 || brandList.Contains(product.Brand.ToLower())) &&
            (typeList.Count == 0 || typeList.Contains(product.Type.ToLower()))
        );

        return query;
    }
}