using API.Exceptions;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace API.Extensions;

public static class BadRequestExceptionExtensions
{
    public static void AddToModelState(this BadRequestException exception, ModelStateDictionary modelState)
    {
        foreach (var (key, errors) in exception.ValidationErrors)
        {
            foreach (var error in errors)
            {
                modelState.AddModelError(key, error);
            }
        }
    }
}