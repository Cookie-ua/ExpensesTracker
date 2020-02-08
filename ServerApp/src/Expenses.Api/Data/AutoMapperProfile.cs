using AutoMapper;
using Expenses.Api.Data.Entities;
using Expenses.Api.ViewModels;
using Expenses.Api.ViewModels.Account;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Expenses.Api.Data
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<RegisterViewModel, ApplicationUser>();
            CreateMap<LoginViewModel, ApplicationUser>();
            CreateMap<Expense, ExpenseViewModel>()
                .ForMember(o => o.ExpenseId, ex => ex.MapFrom(o => o.Id))
                .ReverseMap();
        }
    }
}
