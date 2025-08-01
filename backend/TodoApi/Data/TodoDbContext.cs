using Microsoft.EntityFrameworkCore;
using TodoApi.Auth;
using TodoApi.Todos;

namespace TodoApi.Data;

public class TodoDbContext : DbContext
{
    public TodoDbContext(DbContextOptions<TodoDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Todo> Todos { get; set; }

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
                
            entity.Property(e => e.IsCompleted)
                .HasDefaultValue(false);
                
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
    }
}
