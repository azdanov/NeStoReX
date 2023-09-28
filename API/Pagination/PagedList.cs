namespace API.Pagination;

public class PagedList<T> : List<T>
{
    public PagedList(IEnumerable<T> items, int count, int pageNumber, int pageSize)
    {
        Pagination = new Pagination
        {
            CurrentPage = pageNumber,
            PageSize = pageSize,
            TotalCount = count,
            TotalPages = (int)Math.Ceiling(count / (double)pageSize)
        };
        AddRange(items);
    }

    public PagedList(IEnumerable<T> items, Pagination pagination)
    {
        Pagination = pagination;
        AddRange(items);
    }

    public Pagination Pagination { get; set; }
}