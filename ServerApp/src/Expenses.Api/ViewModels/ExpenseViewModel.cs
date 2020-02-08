using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Expenses.Api.ViewModels
{
    public class ExpenseViewModel
    {
        public int ExpenseId { get; set; }
        [Required]
        public string Category { get; set; }
        [Required]
        public double Amount { get; set; }
        [Required]
        public DateTimeOffset Date { get; set; }
        public string Note { get; set; }
    }
}
