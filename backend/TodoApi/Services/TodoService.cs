using Microsoft.EntityFrameworkCore;
using TodoApi.Data;
using TodoApi.DTOs;
using TodoApi.Models;

namespace TodoApi.Services;

public interface ITodoService
{
    Task<IEnumerable<TodoResponseDto>> GetTodosAsync(int userId);
    Task<TodoResponseDto?> GetTodoByIdAsync(int id, int userId);
    Task<TodoResponseDto> CreateTodoAsync(CreateTodoDto createTodoDto, int userId);
    Task<TodoResponseDto?> UpdateTodoAsync(int id, UpdateTodoDto updateTodoDto, int userId);
    Task<bool> DeleteTodoAsync(int id, int userId);
    Task<int> DeleteMultipleTodosAsync(int[] todoIds, int userId);
}

public class TodoService : ITodoService
{
    private readonly TodoDbContext _context;

    public TodoService(TodoDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<TodoResponseDto>> GetTodosAsync(int userId)
    {
        var todos = await _context.Todos
            .Where(t => t.UserId == userId)
            .OrderByDescending(t => t.CreatedAt)
            .Select(t => new TodoResponseDto
            {
                Id = t.Id,
                Text = t.Text,
                IsCompleted = t.IsCompleted,
                CreatedAt = t.CreatedAt,
                UpdatedAt = t.UpdatedAt,
                CompletedAt = t.CompletedAt
            })
            .ToListAsync();

        return todos;
    }

    public async Task<TodoResponseDto?> GetTodoByIdAsync(int id, int userId)
    {
        var todo = await _context.Todos
            .Where(t => t.Id == id && t.UserId == userId)
            .Select(t => new TodoResponseDto
            {
                Id = t.Id,
                Text = t.Text,
                IsCompleted = t.IsCompleted,
                CreatedAt = t.CreatedAt,
                UpdatedAt = t.UpdatedAt,
                CompletedAt = t.CompletedAt
            })
            .FirstOrDefaultAsync();

        return todo;
    }

    public async Task<TodoResponseDto> CreateTodoAsync(CreateTodoDto createTodoDto, int userId)
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

        return new TodoResponseDto
        {
            Id = todo.Id,
            Text = todo.Text,
            IsCompleted = todo.IsCompleted,
            CreatedAt = todo.CreatedAt,
            UpdatedAt = todo.UpdatedAt,
            CompletedAt = todo.CompletedAt
        };
    }

    public async Task<TodoResponseDto?> UpdateTodoAsync(int id, UpdateTodoDto updateTodoDto, int userId)
    {
        var todo = await _context.Todos
            .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);

        if (todo == null)
            return null;

        if (!string.IsNullOrEmpty(updateTodoDto.Text))
            todo.Text = updateTodoDto.Text;

        if (updateTodoDto.IsCompleted.HasValue)
        {
            todo.IsCompleted = updateTodoDto.IsCompleted.Value;
            todo.CompletedAt = updateTodoDto.IsCompleted.Value ? DateTime.UtcNow : null;
        }

        todo.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return new TodoResponseDto
        {
            Id = todo.Id,
            Text = todo.Text,
            IsCompleted = todo.IsCompleted,
            CreatedAt = todo.CreatedAt,
            UpdatedAt = todo.UpdatedAt,
            CompletedAt = todo.CompletedAt
        };
    }

    public async Task<bool> DeleteTodoAsync(int id, int userId)
    {
        var todo = await _context.Todos
            .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);

        if (todo == null)
            return false;

        _context.Todos.Remove(todo);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<int> DeleteMultipleTodosAsync(int[] todoIds, int userId)
    {
        var todosToDelete = await _context.Todos
            .Where(t => todoIds.Contains(t.Id) && t.UserId == userId)
            .ToListAsync();

        if (!todosToDelete.Any())
            return 0;

        _context.Todos.RemoveRange(todosToDelete);
        await _context.SaveChangesAsync();
        
        return todosToDelete.Count;
    }
}
