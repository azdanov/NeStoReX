using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ErrorController : ControllerBase
{
    [HttpGet("not-found")]
    public ActionResult GetNotFound()
    {
        return NotFound();
    }

    [HttpGet("bad-request")]
    public ActionResult GetBadRequest()
    {
        return BadRequest(new ProblemDetails { Title = "Bad request" });
    }

    [HttpGet("unauthorised")]
    public ActionResult GetUnauthorised()
    {
        return Unauthorized();
    }

    [HttpGet("validation-error")]
    public ActionResult GetValidationError()
    {
        ModelState.AddModelError("Problem 1", "First error");
        ModelState.AddModelError("Problem 2", "Second error");
        return ValidationProblem();
    }

    [HttpGet("server-error")]
    public ActionResult GetServerError()
    {
        var dictionary = new Dictionary<string, string>();
        var hello = dictionary["hello"];
        return Ok(hello);
    }
}