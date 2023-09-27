namespace API.Middlewares;

public class SimulatedLatencyMiddleware
{
    private readonly int _max;
    private readonly int _min;
    private readonly RequestDelegate _next;

    public SimulatedLatencyMiddleware(
        RequestDelegate next,
        TimeSpan min,
        TimeSpan max
    )
    {
        _next = next;
        _min = (int)min.TotalMilliseconds;
        _max = (int)max.TotalMilliseconds;
    }

    public async Task Invoke(HttpContext context)
    {
        var delayInMs = Random.Shared.Next(_min, _max);

        await Task.Delay(delayInMs);
        await _next(context);
    }
}