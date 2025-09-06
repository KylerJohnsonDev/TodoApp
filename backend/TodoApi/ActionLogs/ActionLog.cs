using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using TodoApi.Auth;

namespace TodoApi.ActionLogs;

public class ActionLog
{
    [Required]
    [Range(0, int.MaxValue)]
    [JsonPropertyName("id")]
    public int Id { get; set; }

    [Required]
    [StringLength(100)]
    public string Username { get; set; } = string.Empty;

    public DateTime Timestamp { get; set; } = DateTime.UtcNow;

    [Required]
    [StringLength(500)]
    public string Action { get; set; } = string.Empty;

    // Foreign key
    [Required]
    [Range(0, int.MaxValue)]
    [JsonPropertyName("user_id")]
    public int UserId { get; set; }

    // Navigation property
    [ForeignKey("UserId")]
    public User User { get; set; } = null!;
}
