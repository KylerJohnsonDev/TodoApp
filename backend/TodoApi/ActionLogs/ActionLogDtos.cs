using System.ComponentModel.DataAnnotations;

namespace TodoApi.ActionLogs;

using System.Text.Json.Serialization;
using System.ComponentModel.DataAnnotations;

public class ActionLogResponseDto
{
    [Range(0, int.MaxValue)]
    [JsonPropertyName("id")]
    public int Id { get; set; }

    [JsonPropertyName("username")]
    public string Username { get; set; } = string.Empty;

    [JsonPropertyName("timestamp")]
    public DateTime Timestamp { get; set; }

    [JsonPropertyName("action")]
    public string Action { get; set; } = string.Empty;
}

public class CreateActionLogDto
{
    [Required]
    [StringLength(500, MinimumLength = 1)]
    [JsonPropertyName("action")]
    public string Action { get; set; } = string.Empty;
}
