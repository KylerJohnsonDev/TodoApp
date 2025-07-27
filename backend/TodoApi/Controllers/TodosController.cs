using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TodoApi.DTOs;
using TodoApi.Services;

namespace TodoApi.Controllers;

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

    [HttpGet]
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
    public async Task<ActionResult<TodoResponseDto>> CreateTodo(CreateTodoDto createTodoDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            var userId = GetCurrentUserId();
            var todo = await _todoService.CreateTodoAsync(createTodoDto, userId);
            return CreatedAtAction(nameof(GetTodo), new { id = todo.Id }, todo);
        }
        catch (UnauthorizedAccessException)
        {
            return Unauthorized();
        }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<TodoResponseDto>> UpdateTodo(int id, UpdateTodoDto updateTodoDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            var userId = GetCurrentUserId();
            var todo = await _todoService.UpdateTodoAsync(id, updateTodoDto, userId);
            
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
    public async Task<IActionResult> DeleteTodo(int id)
    {
        try
        {
            var userId = GetCurrentUserId();
            var result = await _todoService.DeleteTodoAsync(id, userId);
            
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
    public async Task<IActionResult> DeleteMultipleTodos(DeleteMultipleTodosDto deleteMultipleTodosDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            var userId = GetCurrentUserId();
            var deletedCount = await _todoService.DeleteMultipleTodosAsync(deleteMultipleTodosDto.TodoIds, userId);
            
            return Ok(new { 
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
