namespace API.Pagination;

public record struct ProductFilters(IEnumerable<string> Types, IEnumerable<string> Brands);