using System.ComponentModel.DataAnnotations;

namespace API.Options;

public record JwtSettingsOptions
{
    [Required] public required string Key { get; init; }

    [Required] public required string KeyId { get; init; }

    [Required] public required string Issuer { get; init; }

    [Required] public required string Audience { get; init; }

    [Required] public required double DurationInMinutes { get; init; }

    [Required] public required double ClockSkewInSeconds { get; init; }
}