using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace TodoApi.ActionLogs
{
    public class ActionLogsResponseDto
    {
        [JsonPropertyName("action_logs")]
        public List<ActionLogDto> ActionLogs { get; set; } = new();

        [JsonPropertyName("total_count")]
        public int TotalCount { get; set; }

        [JsonPropertyName("is_last_page")]
        public bool IsLastPage { get; set; }
    }

    public class ActionLogDto
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
}
