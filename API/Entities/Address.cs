namespace API.Entities;

public abstract class Address
{
    public string FullName { get; set; } = default!;
    public string Address1 { get; set; } = default!;
    public string? Address2 { get; set; }
    public string City { get; set; } = default!;
    public string State { get; set; } = default!;
    public string Zip { get; set; } = default!;
    public string Country { get; set; } = default!;
}