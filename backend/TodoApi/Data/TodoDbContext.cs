using Microsoft.EntityFrameworkCore;
using TodoApi.Auth;
using TodoApi.Todos;
using TodoApi.ActionLogs;

namespace TodoApi.Data;

public class TodoDbContext : DbContext
{
    public TodoDbContext(DbContextOptions<TodoDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Todo> Todos { get; set; }
    public DbSet<ActionLog> ActionLogs { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure User entity
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Username).IsUnique();
            entity.HasIndex(e => e.Email).IsUnique();
            
            entity.Property(e => e.Username)
                .IsRequired()
                .HasMaxLength(100);
                
            entity.Property(e => e.Email)
                .IsRequired()
                .HasMaxLength(255);
                
            entity.Property(e => e.PasswordHash)
                .IsRequired();
                
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("datetime('now')");
                
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("datetime('now')");
        });

        // Configure Todo entity
        modelBuilder.Entity<Todo>(entity =>
        {
            entity.HasKey(e => e.Id);
            
            entity.Property(e => e.Text)
                .IsRequired()
                .HasMaxLength(500);
                
            entity.Property(e => e.Status)
                .HasDefaultValue(TodoStatus.Incomplete);
                
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("datetime('now')");
                
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("datetime('now')");

            // Configure relationship
            entity.HasOne(e => e.User)
                .WithMany(u => u.Todos)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Configure ActionLog entity
        modelBuilder.Entity<ActionLog>(entity =>
        {
            entity.HasKey(e => e.Id);
            
            entity.Property(e => e.Username)
                .IsRequired()
                .HasMaxLength(100);
                
            entity.Property(e => e.Action)
                .IsRequired()
                .HasMaxLength(500);
                
            entity.Property(e => e.Timestamp)
                .HasDefaultValueSql("datetime('now')");

            // Configure relationship
            entity.HasOne(e => e.User)
                .WithMany()
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
