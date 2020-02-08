using Expenses.Api.Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Expenses.Api.Interfaces
{
    public interface IExpenseRepository
    {
        Task<IEnumerable<Expense>> GetAllExpenses(string username);
        Task<Expense> GetExpense(int id, string username);
        Task<IEnumerable<Expense>> GetExpenseByDate(DateTimeOffset from, DateTimeOffset to, string username);
        void AddExpense(Expense expense);
        void UpdateExpense(Expense expense);
        void DeleteExpense(Expense expense);

        Task<bool> Save();
    }
}
