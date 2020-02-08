using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Expenses.Api.Data.Entities
{
    public class Expense
    {
        public int Id { get; set; }
        public string Category { get; set; }
        public double Amount { get; set; }
        public DateTimeOffset Date { get; set; }
        public string Note { get; set; }

        public ApplicationUser User { get; set; }
    }
}
