using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TodoApi.ActionLogs;

namespace TodoApi.ActionLogs;

[ApiController]
[Route("api/action_logs")]
[Authorize]
public class ActionLogsController : ControllerBase
{
    private readonly IActionLogService _actionLogService;

    public ActionLogsController(IActionLogService actionLogService)
    {
        _actionLogService = actionLogService;
    }

    /// <summary>
    /// Get all action logs for the current user (paginated)
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<ActionLogsResponseDto>> GetUserActionLogs(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
        {
            return Unauthorized();
        }

        // Service will be updated to support pagination in next step
        var allLogs = await _actionLogService.GetActionLogsAsync(userId);
        var totalCount = allLogs.Count();
        var pagedLogs = allLogs.Skip((page - 1) * pageSize).Take(pageSize).ToList();
        var isLastPage = (page * pageSize) >= totalCount;

        var response = new ActionLogsResponseDto
        {
            ActionLogs = pagedLogs.Select(log => new ActionLogDto
            {
                Id = log.Id,
                Username = log.Username,
                Timestamp = log.Timestamp,
                Action = log.Action
            }).ToList(),
            TotalCount = totalCount,
            IsLastPage = isLastPage
        };
        return Ok(response);
    }

    /// <summary>
    /// Get all action logs from all users (admin endpoint, paginated)
    /// </summary>
    [HttpGet("all")]
    public async Task<ActionResult<ActionLogsResponseDto>> GetAllActionLogs(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        var allLogs = await _actionLogService.GetAllActionLogsAsync();
        var totalCount = allLogs.Count();
        var pagedLogs = allLogs.Skip((page - 1) * pageSize).Take(pageSize).ToList();
        var isLastPage = (page * pageSize) >= totalCount;

        var response = new ActionLogsResponseDto
        {
            ActionLogs = pagedLogs.Select(log => new ActionLogDto
            {
                Id = log.Id,
                Username = log.Username,
                Timestamp = log.Timestamp,
                Action = log.Action
            }).ToList(),
            TotalCount = totalCount,
            IsLastPage = isLastPage
        };
        return Ok(response);
    }
}
