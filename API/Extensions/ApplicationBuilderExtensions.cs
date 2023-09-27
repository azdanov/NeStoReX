using API.Middlewares;

namespace API.Extensions;

public static class ApplicationBuilderExtensions
{
    public static IApplicationBuilder UseSimulatedLatency(
        this IApplicationBuilder app,
        TimeSpan min,
        TimeSpan max
    )
    {
        return app.UseMiddleware(
            typeof(SimulatedLatencyMiddleware),
            min,
            max
        );
    }
}