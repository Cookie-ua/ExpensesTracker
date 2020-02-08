using AutoMapper;
using Expenses.Api.Controllers;
using Expenses.Api.Data;
using Expenses.Api.Data.Entities;
using Expenses.Api.Interfaces;
using Expenses.Api.ViewModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace Expenses.Test.Controllers
{
    public class ExpensesControllerUnitTests
    {
        private readonly ClaimsPrincipal user;
        private readonly Mock<IExpenseRepository> _mockExpenseRepository;
        private readonly Mock<IUserRepository> _mockUserRepository;
        private readonly Mock<ILogger<ExpensesController>> _mockLogger;
        private readonly MapperConfiguration _mockMapper;
        private readonly ExpensesController _expensesController;
        
        public ExpensesControllerUnitTests()
        {
            user = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Name, "test")
                }, "mock"));

            _mockExpenseRepository = new Mock<IExpenseRepository>();
            _mockUserRepository = new Mock<IUserRepository>();
            _mockMapper = new MapperConfiguration(configure => configure.AddProfile(new AutoMapperProfile()));
            _mockLogger = new Mock<ILogger<ExpensesController>>();
            _expensesController = new ExpensesController(
                _mockExpenseRepository.Object, 
                _mockUserRepository.Object, 
                _mockLogger.Object, 
                _mockMapper.CreateMapper());
            _expensesController.ControllerContext = new ControllerContext()
            {
                HttpContext = new DefaultHttpContext() { User = user }
            };
        }

        [Fact]
        public async Task GetAll_ShouldReturnAllExpenses()
        {
            //Arrange
            _mockExpenseRepository.Setup(repo => repo.GetAllExpenses("test"))
                .ReturnsAsync(GetExpenses());

            //Act
            var result = await _expensesController.Get();

            //Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<List<ExpenseViewModel>>(okResult.Value);
            Assert.Equal(GetExpenses().Count, returnValue.Count);
        }

        [Fact]
        public async Task GetExpenseById_ShouldReturnExpenseWithSameId()
        {
            //Arrange
            _mockExpenseRepository.Setup(repo => repo.GetExpense(1, "test"))
                .ReturnsAsync(GetExpense());

            //Act
            var result = await _expensesController.Get(1);

            //Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<ExpenseViewModel>(okResult.Value);
            Assert.Equal(GetExpense().Id, returnValue.ExpenseId);
        }

        [Fact]
        public async Task GetExpenseByRangeDate_ShouldReturnOkResult()
        {
            //Arrange
            _mockExpenseRepository.Setup(repo => repo.GetExpenseByDate(new DateTimeOffset(2020, 1, 28, 22, 0, 0, 0, new TimeSpan(0, 0, 0)),
                                                            new DateTimeOffset(2020, 2, 01, 22, 0, 0, 0, new TimeSpan(0, 0, 0)), "test"))
                                                            .ReturnsAsync(GetExpenses());

            //Act
            var result = await _expensesController.Post(new RangeDateModel
            {
                StartDate = new DateTimeOffset(2020, 1, 28, 22, 0, 0, 0, new TimeSpan(0, 0, 0)),
                FinishDate = new DateTimeOffset(2020, 2, 01, 22, 0, 0, 0, new TimeSpan(0, 0, 0))
            });

            //Assert
            var okObjextResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<List<ExpenseViewModel>>(okObjextResult.Value);
            Assert.Equal(GetExpenses().Count, returnValue.Count);
        }

        [Fact]
        public async Task GetExpenseById_ShouldReturnNotFound()
        {
            //Arrange
            _mockExpenseRepository.Setup(repo => repo.GetExpense(0, "test"))
                .ReturnsAsync((Expense)null);

            //Act
            var result = await _expensesController.Get(1);

            //Assert
            Assert.IsType<NotFoundResult>(result);
        }

        [Fact]
        public async Task AddExpense_ShouldReturnsBadRequest()
        {
            //Arrange
            _expensesController.ModelState.AddModelError("error", "some error");

            //Act
            var result = await _expensesController.Post(model: null as ExpenseViewModel);

            // Assert
            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public async Task AddExpense_ShouldReturnOkResult()
        {
            //Arrange
            _mockExpenseRepository.Setup(repo => repo.Save()).ReturnsAsync(true);

            //Act
            var result = await _expensesController.Post(new ExpenseViewModel { Amount = 15, Category = "Health", Date = DateTime.UtcNow });

            // Assert
            Assert.IsType<OkResult>(result);
        }

        [Fact]
        public async Task DeleteExpense_ShouldReturnOkResult()
        {
            //Arrange
            _mockExpenseRepository.Setup(repo => repo.GetExpense(1, "test"))
                .ReturnsAsync(GetExpense());
            _mockExpenseRepository.Setup(repo => repo.Save()).ReturnsAsync(true);

            //Act
            var result = await _expensesController.Delete(1);

            // Assert
            Assert.IsType<OkResult>(result);

        }

        [Fact]
        public async Task UpdateExpense_ShouldReturnOkResult()
        {
            //Arrange
            _mockExpenseRepository.Setup(repo => repo.Save()).ReturnsAsync(true);

            //Act
            var result = await _expensesController.Put(new ExpenseViewModel { Amount = 15, Category = "Health", Date = new DateTimeOffset(2020, 1, 28, 22, 0, 0, 0, new TimeSpan(0, 0, 0)) });

            // Assert
            Assert.IsType<OkResult>(result);
        }

        private Expense GetExpense()
        {
            return new Expense { Id = 1, Amount = 15, Category = "Health", Date = DateTime.UtcNow, User = new ApplicationUser { UserName = "test" } };
        }

        private List<Expense> GetExpenses()
        {
            return new List<Expense>()
            {
                new Expense { Id = 1, Amount = 15, Category = "Health", Date = new DateTimeOffset(2020, 1, 28, 22,0,0,0, new TimeSpan(0,0,0)), User = new ApplicationUser { UserName = "test"} },
                new Expense { Id = 2, Amount = 20, Category = "Transport", Date = new DateTimeOffset(2020, 1, 29, 22,0,0,0, new TimeSpan(0,0,0)), User = new ApplicationUser { UserName = "test"} },
                new Expense { Id = 3, Amount = 25, Category = "Groceries", Date = new DateTimeOffset(2020, 1, 30, 22,0,0,0, new TimeSpan(0,0,0)), User = new ApplicationUser { UserName = "test"} },
                new Expense { Id = 4, Amount = 30, Category = "Restaurant", Date = new DateTimeOffset(2020, 1, 31, 22,0,0,0, new TimeSpan(0,0,0)), User = new ApplicationUser { UserName = "test"} },
                new Expense { Id = 5, Amount = 35, Category = "Family", Date = new DateTimeOffset(2020, 2, 01, 22,0,0,0, new TimeSpan(0,0,0)), User = new ApplicationUser { UserName = "test"} },
            };
        }
    }
}