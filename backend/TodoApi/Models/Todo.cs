using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TodoApi.Models;

public class Todo
{
    public int Id { get; set; }
    
    [Required]
    [StringLength(500)]
    public string Text { get; set; } = string.Empty;
    
    public bool IsCompleted { get; set; } = false;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime? CompletedAt { get; set; }
    
    // Foreign key
    public int UserId { get; set; }
    
    // Navigation property
    [ForeignKey("UserId")]
    public User User { get; set; } = null!;
}
