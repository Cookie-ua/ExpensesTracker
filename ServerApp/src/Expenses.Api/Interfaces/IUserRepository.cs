using Expenses.Api.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Expenses.Api.Interfaces
{
    public interface IUserRepository
    {
        Task<ApplicationUser> FindByName(string username);
    }
}
