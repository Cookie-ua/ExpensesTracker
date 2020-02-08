using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Expenses.Api.Data;
using Expenses.Api.ViewModels.Account;
using Expenses.Api.ViewModels.Manage;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace Expenses.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class AccountsController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ILogger<AccountsController> _logger;

        public AccountsController(UserManager<ApplicationUser> userManager, ILogger<AccountsController> logger)
        {
            _userManager = userManager;
            _logger = logger;
        }

        /// <summary>
        /// Create new user
        /// </summary>
        /// <remarks>
        /// Sample request:
        ///
        ///     POST /Accounts/register
        ///     {
        ///         "email": "test@example.com",
        ///         "username": "Test",
        ///         "password": "Qwerty_12345",
        ///         "confirmPassword": "Qwerty_12345"
        ///}
        ///
        /// </remarks>
        /// <response code="200">Return empty</response>
        /// <response code="400">Returns if the model is null</response>
        [AllowAnonymous]
        [HttpPost("Register")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(SerializableError), StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> Post([FromBody] RegisterViewModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var user = new ApplicationUser { UserName = model.Username, Email = model.Email };
                var result = await _userManager.CreateAsync(user, model.Password);

                if (!result.Succeeded)
                {
                    foreach (var error in result.Errors)
                    {
                        ModelState.AddModelError(string.Empty, error.Description);
                    }

                    return BadRequest(ModelState);
                }

                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed to add new user: {ex}");
                return BadRequest("Failed to add new user");
            }
        }

        /// <summary>
        /// Change pasword
        /// </summary>
        /// <remarks>
        /// Sample request:
        ///
        ///     POST /Accounts/ChangePassword
        ///     {
        ///         "currentPassword": "Qwerty_12345",
        ///         "newPassword": "Qwerty_12345_",
        ///         "confirmPassword": "Qwerty_12345_"
        ///     }
        ///
        /// </remarks>
        /// <response code="200">Return empty</response>
        /// <response code="400">Returns if the model is null</response>
        /// <response code="401">Returns if user unauthorized</response>
        [HttpPost("ChangePassword")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(SerializableError), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(SerializableError), StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult> Post([FromBody] ChangePasswordViewModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var user = await _userManager.FindByNameAsync(User.Identity.Name);
                var result = await _userManager.ChangePasswordAsync(user, model.CurrentPassword, model.NewPassword);
                if (!result.Succeeded)
                {
                    foreach (var error in result.Errors)
                    {
                        ModelState.AddModelError(string.Empty, error.Description);
                    }

                    return BadRequest(ModelState);
                }

                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed to change password: {ex}");
                return BadRequest("Failed to change password");
            }
        }

        /// <summary>
        /// Delete user
        /// </summary>
        /// <remarks>
        /// Sample request:
        ///
        ///     POST /Accounts/Delete
        ///     {
        ///         "password": "Qwerty_12345"
        ///     }
        ///
        /// </remarks>
        /// <response code="200">Return empty</response>
        /// <response code="400">Returns if the model is null</response>
        /// <response code="401">Returns if user unauthorized</response>
        [HttpPost("Delete")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(SerializableError), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(SerializableError), StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult> Post([FromBody] DeleteUserViewModel model)
        {
            var user = await _userManager.FindByNameAsync(User.Identity.Name);
            if (user == null)
                return NotFound("Unable load user");

            try
            {
                var requirePassword = await _userManager.HasPasswordAsync(user);
                if (requirePassword)
                {
                    if (!await _userManager.CheckPasswordAsync(user, model.Password))
                    {
                        ModelState.AddModelError(string.Empty, "Incorrect password");
                        return BadRequest(ModelState);
                    }
                }

                var result = await _userManager.DeleteAsync(user);

                if (!result.Succeeded)
                {
                    ModelState.AddModelError(string.Empty, "Unexpected error occurred deleting user");
                }

                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed to delete user: {ex}");
                return BadRequest("Failed to delete user");
            }
        }
    }
}