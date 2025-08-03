using Microsoft.EntityFrameworkCore;
using TodoApi.Data;
using TodoApi.ActionLogs;
using TodoApi.Auth;

namespace TodoApi.ActionLogs;

public interface IActionLogService
{
    Task<IEnumerable<ActionLogResponseDto>> GetActionLogsAsync(int userId);
    Task<IEnumerable<ActionLogResponseDto>> GetAllActionLogsAsync();
    Task<ActionLogResponseDto> CreateActionLogAsync(string username, int userId, string action);
}

public class ActionLogService : IActionLogService
{
    private readonly TodoDbContext _context;

    public ActionLogService(TodoDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<ActionLogResponseDto>> GetActionLogsAsync(int userId)
    {
        var actionLogs = await _context.ActionLogs
            .Where(a => a.UserId == userId)
            .OrderByDescending(a => a.Timestamp)
            .Select(a => new ActionLogResponseDto
            {
                Id = a.Id,
                Username = a.Username,
                Timestamp = a.Timestamp,
                Action = a.Action
            })
            .ToListAsync();

        return actionLogs;
    }

    public async Task<IEnumerable<ActionLogResponseDto>> GetAllActionLogsAsync()
    {
        var actionLogs = await _context.ActionLogs
            .OrderByDescending(a => a.Timestamp)
            .Select(a => new ActionLogResponseDto
            {
                Id = a.Id,
                Username = a.Username,
                Timestamp = a.Timestamp,
                Action = a.Action
            })
            .ToListAsync();

        return actionLogs;
    }

    public async Task<ActionLogResponseDto> CreateActionLogAsync(string username, int userId, string action)
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

        return new ActionLogResponseDto
        {
            Id = actionLog.Id,
            Username = actionLog.Username,
            Timestamp = actionLog.Timestamp,
            Action = actionLog.Action
        };
    }
}
