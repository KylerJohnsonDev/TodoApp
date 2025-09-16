using Microsoft.EntityFrameworkCore;
using TodoApi.Data;
using TodoApi.ActionLogs;
using TodoApi.Auth;

namespace TodoApi.ActionLogs;

public interface IActionLogService
{
    Task<(IEnumerable<ActionLogDto> Logs, int TotalCount)> GetActionLogsAsync(int userId, int page, int pageSize);
    Task<(IEnumerable<ActionLogDto> Logs, int TotalCount)> GetAllActionLogsAsync(int page, int pageSize);
    Task<ActionLogDto> CreateActionLogAsync(string username, int userId, string action);
}

public class ActionLogService : IActionLogService
{
    private readonly TodoDbContext _context;

    public ActionLogService(TodoDbContext context)
    {
        _context = context;
    }

    public async Task<(IEnumerable<ActionLogDto> Logs, int TotalCount)> GetActionLogsAsync(int userId, int page, int pageSize)
    {
        var query = _context.ActionLogs
            .Where(a => a.UserId == userId)
            .OrderByDescending(a => a.Timestamp);

        var totalCount = await query.CountAsync();
        var logs = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(a => new ActionLogDto
            {
                Id = a.Id,
                Username = a.Username,
                Timestamp = a.Timestamp,
                Action = a.Action
            })
            .ToListAsync();

        return (logs, totalCount);
    }

    public async Task<(IEnumerable<ActionLogDto> Logs, int TotalCount)> GetAllActionLogsAsync(int page, int pageSize)
    {
        var query = _context.ActionLogs
            .OrderByDescending(a => a.Timestamp);

        var totalCount = await query.CountAsync();
        var logs = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(a => new ActionLogDto
            {
                Id = a.Id,
                Username = a.Username,
                Timestamp = a.Timestamp,
                Action = a.Action
            })
            .ToListAsync();

        return (logs, totalCount);
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
