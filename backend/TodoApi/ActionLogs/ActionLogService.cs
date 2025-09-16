using Microsoft.EntityFrameworkCore;
using TodoApi.Data;
using TodoApi.ActionLogs;
using TodoApi.Auth;

namespace TodoApi.ActionLogs;

public interface IActionLogService
{
    Task<IEnumerable<ActionLogDto>> GetActionLogsAsync(int userId);
    Task<IEnumerable<ActionLogDto>> GetAllActionLogsAsync();
    Task<ActionLogDto> CreateActionLogAsync(string username, int userId, string action);
}

public class ActionLogService : IActionLogService
{
    private readonly TodoDbContext _context;

    public ActionLogService(TodoDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<ActionLogDto>> GetActionLogsAsync(int userId)
    {
        var actionLogs = await _context.ActionLogs
            .Where(a => a.UserId == userId)
            .OrderByDescending(a => a.Timestamp)
            .Select(a => new ActionLogDto
            {
                Id = a.Id,
                Username = a.Username,
                Timestamp = a.Timestamp,
                Action = a.Action
            })
            .ToListAsync();

        return actionLogs;
    }

    public async Task<IEnumerable<ActionLogDto>> GetAllActionLogsAsync()
    {
        var actionLogs = await _context.ActionLogs
            .OrderByDescending(a => a.Timestamp)
            .Select(a => new ActionLogDto
            {
                Id = a.Id,
                Username = a.Username,
                Timestamp = a.Timestamp,
                Action = a.Action
            })
            .ToListAsync();

        return actionLogs;
    }

    public async Task<ActionLogDto> CreateActionLogAsync(string username, int userId, string action)
    {
        var actionLog = new ActionLog
        {
            Username = username,
            UserId = userId,
            Action = action,
            Timestamp = DateTime.UtcNow
        };

        _context.ActionLogs.Add(actionLog);
        await _context.SaveChangesAsync();

        return new ActionLogDto
        {
            Id = actionLog.Id,
            Username = actionLog.Username,
            Timestamp = actionLog.Timestamp,
            Action = actionLog.Action
        };
    }
}
