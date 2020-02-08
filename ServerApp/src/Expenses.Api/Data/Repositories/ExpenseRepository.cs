using Expenses.Api.Data.Entities;
using Expenses.Api.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Expenses.Api.Data.Repositories
{
    public class ExpenseRepository : IExpenseRepository
    {
        private readonly ApplicationDbContext _context;

        public ExpenseRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Expense>> GetAllExpenses(string username)
        {
            return await _context.Expenses
                .Where(x => x.User.UserName == username)
                .OrderBy(x => x.Date)
                .ToListAsync();
        }

        public async Task<Expense> GetExpense(int id, string username)
        {
            return await _context.Expenses
                .Where(x => x.Id == id && x.User.UserName == username)
                .FirstOrDefaultAsync();
        }

        public async Task<IEnumerable<Expense>> GetExpenseByDate(DateTimeOffset from, DateTimeOffset to, string username)
        {
            return await _context.Expenses
                .Where(x => x.Date <= to && x.Date >= from && x.User.UserName == username)
                .OrderBy(x => x.Date)
                .ToListAsync();
        }

        public void AddExpense(Expense expense)
        {
            _context.Add(expense);
        }

        public void UpdateExpense(Expense expense)
        {
            var updatedExpense = _context.Expenses.Attach(expense);
            updatedExpense.State = EntityState.Modified;
        }

        public void DeleteExpense(Expense expense)
        {
            _context.Expenses.Remove(expense);
        }

        public async Task<bool> Save()
        {
            return await _context.SaveChangesAsync() > 0;
        }
    }
}
