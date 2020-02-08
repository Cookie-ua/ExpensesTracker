using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Expenses.Api.Data;
using Expenses.Api.Data.Entities;
using Expenses.Api.Interfaces;
using Expenses.Api.ViewModels;
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
    public class ExpensesController : ControllerBase
    {
        private readonly IExpenseRepository _repository;
        private readonly IUserRepository _userRepository;
        private readonly ILogger<ExpensesController> _logger;
        private readonly IMapper _mapper;

        public ExpensesController(IExpenseRepository repository, 
            IUserRepository userRepository,
            ILogger<ExpensesController> logger,
            IMapper mapper)
        {
            _repository = repository;
            _userRepository = userRepository;
            _logger = logger;
            _mapper = mapper;
        }

        /// <summary>
        /// Get all expense records
        /// </summary>
        /// <response code="200">Returns all expense records</response>
        /// <response code="401">Returns if user unauthorized</response>
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(SerializableError), StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> Get()
        {
            try
            {
                var expenses = await _repository.GetAllExpenses(User.Identity.Name);
                return Ok(_mapper.Map<IEnumerable<Expense>, IEnumerable<ExpenseViewModel>>(expenses));
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed to get all expense records: {ex}");
                return BadRequest("Failed to get all expense records");
            }
        }

        /// <summary>
        /// Get expense record with specific Id
        /// </summary>
        /// /// <param name="id">The id of the expense record</param>
        /// <response code="200">Returns expense record with</response>
        /// <response code="400">Returns if something went wrong</response>
        /// <response code="401">Returns if the user unauthorized</response>
        /// <response code="404">Returns if the expense record not found</response>
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(SerializableError), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(SerializableError), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(SerializableError), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Get(int id)
        {
            try
            {
                var expense = await _repository.GetExpense(id, User.Identity.Name);

                if (expense == null) 
                    return NotFound();
                
                return Ok(_mapper.Map<Expense, ExpenseViewModel>(expense));
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed to get expense record: {ex}");
                return BadRequest("Failed to get expense record");
            }
        }

        /// <summary>
        /// Add new expense record
        /// </summary>
        /// <remarks>
        /// Sample request:
        ///
        ///     POST /Expenses
        ///     {
        ///         "startDate": "2020-01-29T00:00:00+02:00",
        ///         "finishDate": "2020-01-31T00:00:00+02:00"
        ///     }
        ///
        /// </remarks>
        /// /// <param name="model"></param>
        /// <response code="200">Return expense records between two dates</response>
        /// <response code="400">Returns if the model is null</response>
        /// <response code="401">Returns if user unauthorized</response>
        [HttpPost("RangeDate")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(SerializableError), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(SerializableError), StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> Post([FromBody] RangeDateModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var expenses = await _repository.GetExpenseByDate(model.StartDate, model.FinishDate, User.Identity.Name);
                return Ok(_mapper.Map<IEnumerable<Expense>, IEnumerable<ExpenseViewModel>>(expenses));
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed to get expense records: {ex}");
                return BadRequest("Failed to get expense records");
            }
        }

        /// <summary>
        /// Add new expense record
        /// </summary>
        /// <remarks>
        /// Sample request:
        ///
        ///     POST /Expenses
        ///     {
        ///         "category": "Health",
        ///         "amount": 96,
        ///         "date": "2020-01-29T00:00:00+02:00",
        ///         "note": "Pills"
        ///     }
        ///
        /// </remarks>
        /// /// <param name="model"></param>
        /// <response code="200">Returns empty</response>
        /// <response code="400">Returns if the model is null</response>
        /// <response code="401">Returns if user unauthorized</response>
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(SerializableError), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(SerializableError), StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> Post([FromBody] ExpenseViewModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var newExpense = _mapper.Map<ExpenseViewModel, Expense>(model);
                var user = await _userRepository.FindByName(User.Identity.Name);
                newExpense.Date = newExpense.Date.UtcDateTime;
                newExpense.User = user;

                _repository.AddExpense(newExpense);
                await _repository.Save();

                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed to save new expense record: {ex}");
                return BadRequest("Failed to save new expense record");
            }
        }

        /// <summary>
        /// Update expense record
        /// </summary>
        /// <remarks>
        /// Sample request:
        ///
        ///     POST /Expenses
        ///     {
        ///         "expenseId": "1"
        ///         "category": "Health",
        ///         "amount": 96,
        ///         "date": "2020-01-29T00:00:00+02:00",
        ///         "note": "Pills"
        ///     }
        ///
        /// </remarks>
        /// /// <param name="model"></param>
        /// <response code="200">Returns empty</response>
        /// <response code="400">Returns if the model is null</response>
        /// <response code="401">Returns if user unauthorized</response>
        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(SerializableError), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(SerializableError), StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> Put([FromBody] ExpenseViewModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                _repository.UpdateExpense(_mapper.Map<ExpenseViewModel, Expense>(model));
                if (await _repository.Save())
                    return Ok();

                return BadRequest("Failed to save updated expense record");

            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed to save updated expense record: {ex}");
                return BadRequest("Failed to save updated expense record");
            }
        }

        /// <summary>
        /// Delete expense record with specific Id
        /// </summary>
        /// /// <param name="id"></param>
        /// <response code="200">Returns empty</response>
        /// <response code="400">Returns if something went wrong</response>
        /// <response code="401">Returns if user unauthorized</response>
        /// <response code="404">Returns if the expense record not found</response>
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(SerializableError), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(SerializableError), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(SerializableError), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var expense = await _repository.GetExpense(id, User.Identity.Name);
                if (expense == null)
                    return NotFound();

                _repository.DeleteExpense(expense);
                if (await _repository.Save())
                    return Ok();

                return BadRequest("Failed to save, after deleting expense record");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed to save, after deleting expense record: {ex}");
                return BadRequest("Failed to save, after deleting expense record");
            }
        }
    }
}