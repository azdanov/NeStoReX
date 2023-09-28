using API.Dto;
using API.Extensions;
using API.Pagination;
using API.Services;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IProductService _productService;

    public ProductsController(IProductService productService)
    {
        _productService = productService;
    }

    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<List<ProductDto>>> GetProducts([FromQuery] ProductParams productParams)
    {
        var products = await _productService.GetProductsAsync(productParams);

        Response.AddPaginationHeader(products.Pagination);
        return Ok(products.MapProductsToDtos());
    }

    [HttpGet("{id:int}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ProductDto>> GetProduct(int id)
    {
        var product = await _productService.GetProductByIdAsync(id);
        if (product == null) return NotFound();
        return Ok(product.MapProductToDto());
    }

    [HttpGet("filters")]
    public async Task<ActionResult<ProductFilters>> GetProductFilters()
    {
        return Ok(await _productService.GetProductFiltersAsync());
    }
}