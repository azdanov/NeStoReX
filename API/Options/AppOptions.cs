using System.ComponentModel.DataAnnotations;

namespace API.Options;

public record AppOptions
{
    [Required] public required string Name { get; init; }

    [Required] public required string Version { get; init; }
}