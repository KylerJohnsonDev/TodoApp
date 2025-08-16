using Microsoft.AspNetCore.Authorization;
using Swashbuckle.AspNetCore.Annotations;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TodoApi.Todos;

namespace TodoApi.Todos;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TodosController : ControllerBase
{
    private readonly ITodoService _todoService;

    public TodosController(ITodoService todoService)
    {
        _todoService = todoService;
    }

    private int GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst("userId")?.Value;
        if (userIdClaim == null || !int.TryParse(userIdClaim, out int userId))
            throw new UnauthorizedAccessException("User ID not found in token");
        return userId;
    }

    private string GetCurrentUsername()
    {
        var usernameClaim = User.FindFirst(ClaimTypes.Name)?.Value;
        if (string.IsNullOrEmpty(usernameClaim))
            throw new UnauthorizedAccessException("Username not found in token");
        return usernameClaim;
    }

    [HttpGet]
    [SwaggerOperation(OperationId = "GetTodos")]
    public async Task<ActionResult<IEnumerable<TodoResponseDto>>> GetTodos()
    {
        try
        {
            var userId = GetCurrentUserId();
            var todos = await _todoService.GetTodosAsync(userId);
            return Ok(todos);
        }
        catch (UnauthorizedAccessException)
        {
            return Unauthorized();
        }
    }

    [HttpGet("{id}")]
    [SwaggerOperation(OperationId = "GetTodoById")]

    public async Task<ActionResult<TodoResponseDto>> GetTodo(int id)
    {
        try
        {
            var userId = GetCurrentUserId();
            var todo = await _todoService.GetTodoByIdAsync(id, userId);

            if (todo == null)
                return NotFound(new { message = "Todo not found" });

            return Ok(todo);
        }
        catch (UnauthorizedAccessException)
        {
            return Unauthorized();
        }
    }

    [HttpPost]
    [SwaggerOperation(OperationId = "CreateTodo")]
    public async Task<ActionResult<TodoResponseDto>> CreateTodo(CreateTodoDto createTodoDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            var userId = GetCurrentUserId();
            var username = GetCurrentUsername();
            var todo = await _todoService.CreateTodoAsync(createTodoDto, userId, username);
            return CreatedAtAction(nameof(GetTodo), new { id = todo.Id }, todo);
        }
        catch (UnauthorizedAccessException)
        {
            return Unauthorized();
        }
    }

    [HttpPut("{id}")]
    [SwaggerOperation(OperationId = "UpdateTodo")]
    public async Task<ActionResult<TodoResponseDto>> UpdateTodo(int id, UpdateTodoDto updateTodoDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            var userId = GetCurrentUserId();
            var username = GetCurrentUsername();
            var todo = await _todoService.UpdateTodoAsync(id, updateTodoDto, userId, username);

            if (todo == null)
                return NotFound(new { message = "Todo not found" });

            return Ok(todo);
        }
        catch (UnauthorizedAccessException)
        {
            return Unauthorized();
        }
    }

    [HttpDelete("{id}")]
    [SwaggerOperation(OperationId = "DeleteTodo")]
    public async Task<IActionResult> DeleteTodo(int id)
    {
        try
        {
            var userId = GetCurrentUserId();
            var username = GetCurrentUsername();
            var result = await _todoService.DeleteTodoAsync(id, userId, username);

            if (!result)
                return NotFound(new { message = "Todo not found" });

            return NoContent();
        }
        catch (UnauthorizedAccessException)
        {
            return Unauthorized();
        }
    }

    [HttpDelete("bulk")]
    [SwaggerOperation(OperationId = "DeleteMultipleTodos")]
    public async Task<IActionResult> DeleteMultipleTodos(DeleteMultipleTodosDto deleteMultipleTodosDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            var userId = GetCurrentUserId();
            var username = GetCurrentUsername();
            var deletedCount = await _todoService.DeleteMultipleTodosAsync(deleteMultipleTodosDto.TodoIds, userId, username);

            return Ok(new
            {
                message = $"Successfully deleted {deletedCount} todo(s)",
                deletedCount = deletedCount,
                requestedCount = deleteMultipleTodosDto.TodoIds.Length
            });
        }
        catch (UnauthorizedAccessException)
        {
            return Unauthorized();
        }
    }
}
