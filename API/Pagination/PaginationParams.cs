namespace API.Pagination;

public record PaginationParams
{
    private const int MaxPages = 50;

    private int _pageSize = 6;

    public int CurrentPage { get; set; } = 1;

    public int PageSize
    {
        get => _pageSize;
        set => _pageSize = value > MaxPages ? MaxPages : value;
    }
}