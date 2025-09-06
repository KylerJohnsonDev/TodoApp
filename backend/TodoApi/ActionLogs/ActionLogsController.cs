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
    /// Get all action logs for the current user
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<object>> GetUserActionLogs()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
        {
            return Unauthorized();
        }

        var actionLogs = await _actionLogService.GetActionLogsAsync(userId);
        return Ok(new { items = actionLogs });
    }

    /// <summary>
    /// Get all action logs from all users (admin endpoint)
    /// </summary>
    [HttpGet("all")]
    public async Task<ActionResult<object>> GetAllActionLogs()
    {
        var actionLogs = await _actionLogService.GetAllActionLogsAsync();
        return Ok(new { items = actionLogs });
    }
}
