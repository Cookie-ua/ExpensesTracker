import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../core/services/api.service';
import { Expense } from '../core/models/expense.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {

  constructor(private http: HttpClient,
              private apiService: ApiService) { }
  
  getAll(){
    return this.apiService.get('/expenses');
  }

  get(expenseId: number){
    return this.apiService.get(`/expenses/${expenseId}`);
  }

  getExpensesByRangeDate(rangeDate: any){
    return this.apiService.post('/expenses/rangeDate', rangeDate);
  }

  add(expense: any){
    return this.apiService.post('/expenses', expense);
  }
  
  edit(id: number, expense: Expense){
    return this.apiService.put(`/expenses/${id}`, expense);
  }

  delete(id: number){
    return this.apiService.delete(`/expenses/${id}`);
  }

  getExpenseWeekReport(dateRange: any){
    return this.apiService.post('/expensereport/dateRange', dateRange);
  }
}
