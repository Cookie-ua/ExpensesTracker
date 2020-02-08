import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExpenseService } from '../expense.service';
import { Expense } from 'src/app/core/models/expense.model';
import { AlertService } from 'src/app/core/services/alert.service';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.css']
})
export class DeleteComponent implements OnInit {

  expenseId: any;
  expense: Expense;

  constructor(private route:ActivatedRoute,
              private router:Router,
              private expenseService: ExpenseService,
              private alertService: AlertService) { }

  ngOnInit() {
    this.expenseId = this.route.snapshot.paramMap.get('id');
    this.expenseService.get(this.expenseId).subscribe(data => {
      this.expense = data;
    });

  }

  onSubmit(){
    this.expenseService.delete(this.expense.expenseId).subscribe(
      data => {
        this.alertService.success('Entry has been deleted!', true);
        this.router.navigate(['/expense']);
      },
      error => {
        
      })
  }
}