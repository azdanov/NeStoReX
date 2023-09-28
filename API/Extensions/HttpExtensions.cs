using System.Text.Json;

namespace API.Extensions;

public static class HttpExtensions
{
    public static void AddPaginationHeader(this HttpResponse response, Pagination.Pagination pagination)
    {
        var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };

        response.Headers.Add("Pagination", JsonSerializer.Serialize(pagination, options));
        response.Headers.Add("Access-Control-Expose-Headers", "Pagination");
    }
}