namespace API.Pagination;

public record struct Pagination
(
    int CurrentPage,
    int TotalPages,
    int PageSize,
    int TotalCount
);