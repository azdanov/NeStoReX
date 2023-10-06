namespace API.Dto;

public record struct PaymentIntentDto
(
    string Id,
    string ClientSecret
);