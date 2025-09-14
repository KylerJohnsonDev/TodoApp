using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using TodoApi.Auth;

namespace TodoApi.Todos;

[JsonConverter(typeof(JsonStringEnumConverter<TodoStatus>))]
public enum TodoStatus
{
    Incomplete = 0,
    InProgress = 1,
    Complete = 2
}

public class Todo
{
    [Range(0, int.MaxValue)]
    [JsonPropertyName("id")]
    public int Id { get; set; }

    [Required]
    [StringLength(500)]
    [JsonPropertyName("text")]
    public string Text { get; set; } = string.Empty;

    [Range(0, 2)]
    [JsonPropertyName("status")]
    public TodoStatus Status { get; set; } = TodoStatus.Incomplete;

    [JsonPropertyName("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [JsonPropertyName("updated_at")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    [JsonPropertyName("completed_at")]
    public DateTime? CompletedAt { get; set; }

    // Foreign key
    [Range(0, int.MaxValue)]
    [JsonPropertyName("user_id")]
    public int UserId { get; set; }

    // Navigation property
    [ForeignKey("UserId")]
    public User User { get; set; } = null!;
}
