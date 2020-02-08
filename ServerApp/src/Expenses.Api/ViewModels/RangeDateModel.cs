using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Expenses.Api.ViewModels
{
    public class RangeDateModel
    {
        [Required]
        public DateTimeOffset StartDate { get; set; }
        [Required]
        public DateTimeOffset FinishDate { get; set; }
    }
}
