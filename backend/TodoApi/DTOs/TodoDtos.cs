using System.ComponentModel.DataAnnotations;

namespace TodoApi.DTOs;

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

public class TodoResponseDto
{
    public int Id { get; set; }
    public string Text { get; set; } = string.Empty;
    public bool IsCompleted { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
}
