using System.ComponentModel.DataAnnotations;

namespace TodoApi.Todos;

public class CreateTodoDto
{
    [Required]
    [StringLength(500, MinimumLength = 1)]
    public string Text { get; set; } = string.Empty;
}

public class UpdateTodoDto
{
    [StringLength(500, MinimumLength = 1)]
    public string? Text { get; set; }
    
    public bool? IsCompleted { get; set; }
}

public class DeleteMultipleTodosDto
{
    [Required]
    [MinLength(1, ErrorMessage = "At least one todo ID must be provided")]
    public int[] TodoIds { get; set; } = Array.Empty<int>();
}

public class TodoResponseDto
{
    public int Id { get; set; }
    public string Text { get; set; } = string.Empty;
    public bool IsCompleted { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
}
