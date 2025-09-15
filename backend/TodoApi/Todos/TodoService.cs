using Microsoft.EntityFrameworkCore;
using TodoApi.Data;
using TodoApi.Todos;
using TodoApi.ActionLogs;

namespace TodoApi.Todos;

public interface ITodoService
{
    Task<IEnumerable<TodoResponseDto>> GetTodosAsync(int userId);
    Task<TodoResponseDto?> GetTodoByIdAsync(int id, int userId);
    Task<TodoResponseDto> CreateTodoAsync(CreateTodoDto createTodoDto, int userId, string username);
    Task<TodoResponseDto?> UpdateTodoAsync(int id, UpdateTodoDto updateTodoDto, int userId, string username);
    Task<bool> DeleteTodoAsync(int id, int userId, string username);
    Task<int> DeleteMultipleTodosAsync(int[] todoIds, int userId, string username);
    Task<int> UpdateMultipleTodoStatusAsync(int[] todoIds, TodoStatus status, int userId, string username);
}

public class TodoService : ITodoService
{
    private readonly TodoDbContext _context;
    private readonly IActionLogService _actionLogService;

    public TodoService(TodoDbContext context, IActionLogService actionLogService)
    {
        _context = context;
        _actionLogService = actionLogService;
    }

    public async Task<IEnumerable<TodoResponseDto>> GetTodosAsync(int userId)
    {
        var todos = await _context.Todos
            .Where(t => t.UserId == userId)
            .OrderByDescending(t => t.CreatedAt)
            .Select(t => new TodoResponseDto(t))
            .ToListAsync();

        return todos;
    }

    public async Task<TodoResponseDto?> GetTodoByIdAsync(int id, int userId)
    {
        var todo = await _context.Todos
            .Where(t => t.Id == id && t.UserId == userId)
            .Select(t => new TodoResponseDto(t))
            .FirstOrDefaultAsync();

        return todo;
    }

    public async Task<TodoResponseDto> CreateTodoAsync(CreateTodoDto createTodoDto, int userId, string username)
    {
        var todo = new Todo
        {
            Text = createTodoDto.Text,
            UserId = userId,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Todos.Add(todo);
        await _context.SaveChangesAsync();

        // Log the action
        await _actionLogService.CreateActionLogAsync(username, userId, $"Created todo: '{createTodoDto.Text}'");

        return new TodoResponseDto(todo);
    }

    public async Task<TodoResponseDto?> UpdateTodoAsync(int id, UpdateTodoDto updateTodoDto, int userId, string username)
    {
        var todo = await _context.Todos
            .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);

        if (todo == null)
            return null;

        var actions = new List<string>();

        if (!string.IsNullOrEmpty(updateTodoDto.Text))
        {
            actions.Add($"Changed text from '{todo.Text}' to '{updateTodoDto.Text}'");
            todo.Text = updateTodoDto.Text;
        }

        if (updateTodoDto.Status.HasValue)
        {
            actions.Add($"Changed status from '{todo.Status}' to '{updateTodoDto.Status.Value}'");
            todo.Status = updateTodoDto.Status.Value;
            todo.CompletedAt = updateTodoDto.Status.Value == TodoStatus.Complete ? DateTime.UtcNow : null;
        }

        todo.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        // Log the action
        if (actions.Any())
        {
            var actionDescription = $"Updated todo (ID: {id}): {string.Join(", ", actions)}";
            await _actionLogService.CreateActionLogAsync(username, userId, actionDescription);
        }

        return new TodoResponseDto(todo);
    }

    public async Task<bool> DeleteTodoAsync(int id, int userId, string username)
    {
        var todo = await _context.Todos
            .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);

        if (todo == null)
            return false;

        var todoText = todo.Text;
        _context.Todos.Remove(todo);
        await _context.SaveChangesAsync();

        // Log the action
        await _actionLogService.CreateActionLogAsync(username, userId, $"Deleted todo (ID: {id}): '{todoText}'");

        return true;
    }

    public async Task<int> DeleteMultipleTodosAsync(int[] todoIds, int userId, string username)
    {
        var todosToDelete = await _context.Todos
            .Where(t => todoIds.Contains(t.Id) && t.UserId == userId)
            .ToListAsync();

        if (!todosToDelete.Any())
            return 0;

        var deletedTodoTexts = todosToDelete.Select(t => $"'{t.Text}' (ID: {t.Id})").ToList();

        _context.Todos.RemoveRange(todosToDelete);
        await _context.SaveChangesAsync();

        // Log the action
        await _actionLogService.CreateActionLogAsync(username, userId,
            $"Bulk deleted {todosToDelete.Count} todos: {string.Join(", ", deletedTodoTexts)}");

        return todosToDelete.Count;
    }

    public async Task<int> UpdateMultipleTodoStatusAsync(int[] todoIds, TodoStatus status, int userId, string username)
    {
        var todosToUpdate = await _context.Todos
            .Where(t => todoIds.Contains(t.Id) && t.UserId == userId)
            .ToListAsync();

        if (!todosToUpdate.Any())
            return 0;

        foreach (var todo in todosToUpdate)
        {
            var oldStatus = todo.Status;
            todo.Status = status;
            todo.UpdatedAt = DateTime.UtcNow;
            todo.CompletedAt = status == TodoStatus.Complete ? DateTime.UtcNow : null;
        }

        await _context.SaveChangesAsync();

        // Log the action
        await _actionLogService.CreateActionLogAsync(
            username,
            userId,
            $"Bulk updated status for {todosToUpdate.Count} todos to '{status}' (IDs: {string.Join(", ", todosToUpdate.Select(t => t.Id))})"
        );

        return todosToUpdate.Count;
    }
}
