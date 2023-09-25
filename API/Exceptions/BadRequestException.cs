namespace API.Exceptions;

public class BadRequestException : Exception
{
    public BadRequestException(string message) : base(message)
    {
        ValidationErrors = new Dictionary<string, string[]>();
    }

    public BadRequestException(string message, IDictionary<string, string[]> validationResult) : base(message)
    {
        ValidationErrors = validationResult;
    }

    public IDictionary<string, string[]> ValidationErrors { get; set; }
}