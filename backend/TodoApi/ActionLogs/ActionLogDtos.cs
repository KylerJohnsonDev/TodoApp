using System.ComponentModel.DataAnnotations;

namespace TodoApi.ActionLogs;

public class ActionLogResponseDto
{
    public int Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; }
    public string Action { get; set; } = string.Empty;
}

public class CreateActionLogDto
{
    [Required]
    [StringLength(500, MinimumLength = 1)]
    public string Action { get; set; } = string.Empty;
}
