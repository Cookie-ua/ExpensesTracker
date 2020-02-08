using Expenses.Api.Data.Entities;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Expenses.Api.Data
{
    public class ApplicationDbContextSeed
    {
        public static async Task SeedAsync(UserManager<ApplicationUser> userManager, ApplicationDbContext context)
        {
            context.Database.EnsureCreated();

            var user = await userManager.FindByNameAsync("TestUser");
            if (user == null)
            {
                user = GetUser();

                var result = await userManager.CreateAsync(user, "Qwerty_123");
                if (result != IdentityResult.Success)
                    throw new InvalidOperationException("Could not create user in Seeding");
            }

            if (!context.Expenses.Any())
            {
                foreach (var expense in GetExpenses())
                {
                    expense.User = user;
                    context.Add(expense);
                }

                context.SaveChanges();
            }
        }

        static ApplicationUser GetUser()
        {
            return new ApplicationUser
            {
                Email = "test@test.com",
                UserName = "TestUser"
            };
        }

        static IEnumerable<Expense> GetExpenses()
        {
            return new List<Expense>()
            {
                new Expense { Amount = 15, Category = "Health",       Date = new DateTimeOffset(2020, 1, 28, 22,0,0,0, new TimeSpan(0,0,0)) },
                new Expense { Amount = 20, Category = "Transport",    Date = new DateTimeOffset(2020, 1, 28, 22,0,0,0, new TimeSpan(0,0,0)) },
                new Expense { Amount = 25, Category = "Groceries",    Date = new DateTimeOffset(2020, 1, 29, 22,0,0,0, new TimeSpan(0,0,0)) },
                new Expense { Amount = 30, Category = "Restaurant",   Date = new DateTimeOffset(2020, 1, 29, 22,0,0,0, new TimeSpan(0,0,0)) },
                new Expense { Amount = 35, Category = "Family",       Date = new DateTimeOffset(2020, 1, 30, 22,0,0,0, new TimeSpan(0,0,0)) },
                new Expense { Amount = 15, Category = "Health",       Date = new DateTimeOffset(2020, 1, 30, 22,0,0,0, new TimeSpan(0,0,0)) },
                new Expense { Amount = 20, Category = "Transport",    Date = new DateTimeOffset(2020, 1, 31, 22,0,0,0, new TimeSpan(0,0,0)) },
                new Expense { Amount = 25, Category = "Groceries",    Date = new DateTimeOffset(2020, 1, 31, 22,0,0,0, new TimeSpan(0,0,0)) },
                new Expense { Amount = 30, Category = "Restaurant",   Date = new DateTimeOffset(2020, 2, 01, 22,0,0,0, new TimeSpan(0,0,0)) },
                new Expense { Amount = 35, Category = "Family",       Date = new DateTimeOffset(2020, 2, 01, 22,0,0,0, new TimeSpan(0,0,0)) },
                new Expense { Amount = 20, Category = "Transport",    Date = new DateTimeOffset(2020, 2, 02, 22,0,0,0, new TimeSpan(0,0,0)) },
                new Expense { Amount = 25, Category = "Groceries",    Date = new DateTimeOffset(2020, 2, 03, 22,0,0,0, new TimeSpan(0,0,0)) },
                new Expense { Amount = 30, Category = "Restaurant",   Date = new DateTimeOffset(2020, 2, 03, 22,0,0,0, new TimeSpan(0,0,0)) },
                new Expense { Amount = 35, Category = "Family",       Date = new DateTimeOffset(2020, 2, 04, 22,0,0,0, new TimeSpan(0,0,0)) },
                new Expense { Amount = 20, Category = "Transport",    Date = new DateTimeOffset(2020, 2, 04, 22,0,0,0, new TimeSpan(0,0,0)) },
                new Expense { Amount = 25, Category = "Groceries",    Date = new DateTimeOffset(2020, 2, 05, 22,0,0,0, new TimeSpan(0,0,0)) },
                new Expense { Amount = 30, Category = "Restaurant",   Date = new DateTimeOffset(2020, 2, 05, 22,0,0,0, new TimeSpan(0,0,0)) },
                new Expense { Amount = 35, Category = "Family",       Date = new DateTimeOffset(2020, 2, 06, 22,0,0,0, new TimeSpan(0,0,0)) },
                new Expense { Amount = 15, Category = "Health",       Date = new DateTimeOffset(2020, 2, 06, 22,0,0,0, new TimeSpan(0,0,0)) },
                new Expense { Amount = 20, Category = "Transport",    Date = new DateTimeOffset(2020, 2, 07, 22,0,0,0, new TimeSpan(0,0,0)) },
                new Expense { Amount = 25, Category = "Groceries",    Date = new DateTimeOffset(2020, 2, 07, 22,0,0,0, new TimeSpan(0,0,0)) },
                new Expense { Amount = 30, Category = "Restaurant",   Date = new DateTimeOffset(2020, 2, 08, 22,0,0,0, new TimeSpan(0,0,0)) },
                new Expense { Amount = 35, Category = "Family",       Date = new DateTimeOffset(2020, 2, 08, 22,0,0,0, new TimeSpan(0,0,0)) },
                new Expense { Amount = 30, Category = "Restaurant",   Date = new DateTimeOffset(2020, 2, 09, 22,0,0,0, new TimeSpan(0,0,0)) },
                new Expense { Amount = 35, Category = "Family",       Date = new DateTimeOffset(2020, 2, 09, 22,0,0,0, new TimeSpan(0,0,0)) }
            };
        }
    }
}
