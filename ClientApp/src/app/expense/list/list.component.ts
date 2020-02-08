import { Component, OnInit } from '@angular/core';
import { ExpenseService } from '../expense.service';
import { Expense } from 'src/app/core/models/expense.model';
import { ShareService } from 'src/app/core/services/share.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  expenses: Array<Expense>;
  pageSize = 5;
  page: number = 1;
  collectionSize: number;

  constructor(private shareService: ShareService) { }

  ngOnInit() {
    this.load();
  }

  load(){
    this.shareService.currentEntriesData.subscribe(data => {
      if (data) {
        this.expenses = data;
        this.collectionSize = this.expenses.length;
      }
    });
  }

  get displayedExpenses(): Expense[]{
    if (this.expenses) {
      return this.expenses.slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
    }
  }
}
