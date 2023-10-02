namespace API.Entities;

public class UserAddress : Address
{
    public required int Id { get; set; }
    public required int UserId { get; set; }
}