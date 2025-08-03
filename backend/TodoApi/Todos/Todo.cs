using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using TodoApi.Auth;

namespace TodoApi.Todos;

public enum TodoStatus
{
    Incomplete,
    InProgress,
    Complete
}

public class Todo
{
    public int Id { get; set; }
    
    [Required]
    [StringLength(500)]
    public string Text { get; set; } = string.Empty;
    
    public TodoStatus Status { get; set; } = TodoStatus.Incomplete;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime? CompletedAt { get; set; }
    
    // Foreign key
    public int UserId { get; set; }
    
    // Navigation property
    [ForeignKey("UserId")]
    public User User { get; set; } = null!;
}
