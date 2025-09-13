using System.ComponentModel.DataAnnotations;

namespace TodoApi.Todos;

using System.Diagnostics.CodeAnalysis;
using System.Globalization;
using System.Text.Json.Serialization;

public class CreateTodoDto
{
    [Required]
    [StringLength(500, MinimumLength = 1)]
    [JsonPropertyName("text")]
    public string Text { get; set; } = string.Empty;
}

public class UpdateTodoDto
{
    [StringLength(500, MinimumLength = 1)]
    [JsonPropertyName("text")]
    public string? Text { get; set; }

    [Range(0, 2)]
    [JsonPropertyName("status")]
    public TodoStatus? Status { get; set; }
}

public class DeleteMultipleTodosDto
{
    [Required]
    [MinLength(1, ErrorMessage = "At least one todo ID must be provided")]
    [JsonPropertyName("todo_ids")]
    [System.ComponentModel.DataAnnotations.Range(0, int.MaxValue, ErrorMessage = "Each todo ID must be a non-negative integer")]
    public int[] TodoIds { get; set; } = Array.Empty<int>();
}

public class TodoResponseDto
{
    [Required]
    [Range(0, int.MaxValue)]
    [JsonPropertyName("id")]
    public int Id { get; set; }

    [JsonPropertyName("text")]
    public string Text { get; set; } = string.Empty;

    [Range(0, 2)]
    [JsonPropertyName("status")]
    public TodoStatus Status { get; set; }

    [JsonPropertyName("created_at")]
    public string CreatedAt { get; set; } = string.Empty;

    [JsonPropertyName("updated_at")]
    public string UpdatedAt { get; set; } = string.Empty;

    [JsonPropertyName("completed_at")]
    public string? CompletedAt { get; set; }

    public TodoResponseDto(Todo todo)
    {
        Id = todo.Id;
        Text = todo.Text;
        Status = todo.Status;
        CreatedAt = todo.CreatedAt.ToString("yyyy-MM-ddTHH:mm:ssZ", CultureInfo.InvariantCulture);
        UpdatedAt = todo.UpdatedAt.ToString("yyyy-MM-ddTHH:mm:ssZ", CultureInfo.InvariantCulture);
        CompletedAt = todo.CompletedAt?.ToString("yyyy-MM-ddTHH:mm:ssZ", CultureInfo.InvariantCulture);
    }
}
