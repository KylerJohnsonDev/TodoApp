using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using System.ComponentModel.DataAnnotations;
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
    [SwaggerOperation(OperationId = "GetUserActionLogs")]
    public async Task<ActionResult<ActionLogsResponseDto>> GetUserActionLogs(
        [FromQuery, SwaggerParameter("Page number", Required = false)] int page = 1,
        [FromQuery, SwaggerParameter("Page size", Required = false)] int pageSize = 20)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
        {
            return Unauthorized();
        }

        var (logs, totalCount) = await _actionLogService.GetActionLogsAsync(userId, page, pageSize);
        var isLastPage = (page * pageSize) >= totalCount;

        var response = new ActionLogsResponseDto
        {
            ActionLogs = logs.ToList(),
            TotalCount = totalCount,
            IsLastPage = isLastPage
        };
        return Ok(response);
    }

    /// <summary>
    /// Get all action logs from all users (admin endpoint, paginated)
    /// </summary>
    [HttpGet("all")]
    [Authorize(Roles = "Admin")]
    [SwaggerOperation(OperationId = "GetAllActionLogs")]
    public async Task<ActionResult<ActionLogsResponseDto>> GetAllActionLogs(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        var (logs, totalCount) = await _actionLogService.GetAllActionLogsAsync(page, pageSize);
        var isLastPage = (page * pageSize) >= totalCount;

        var response = new ActionLogsResponseDto
        {
            ActionLogs = logs.ToList(),
            TotalCount = totalCount,
            IsLastPage = isLastPage
        };
        return Ok(response);
    }
}
