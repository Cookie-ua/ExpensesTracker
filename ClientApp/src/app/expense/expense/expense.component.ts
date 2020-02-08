import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { ShareService } from 'src/app/core/services/share.service';
import { ExpenseService } from '../expense.service';
import { Period } from 'src/app/core/models/enums/period.enum';
import { SearchModel } from 'src/app/core/models/search.model';
import { AlertService } from 'src/app/core/services/alert.service';
import { Expense } from 'src/app/core/models/expense.model';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.css']
})
export class ExpenseComponent implements OnInit {

  loading: boolean = false;
  displayedPeriod: string = '';
  dateNow: Date;
  periodForm: FormGroup;

  hide: boolean = true;

  selectedPeriod: Period;
  selectedDate: Date;

  constructor(private router: Router,
              private fb: FormBuilder,
              private shareService: ShareService,
              private expenseService: ExpenseService,
              private alertService: AlertService) { 
                this.selectedPeriod = Period.Week;
                this.selectedDate = new Date;
                this.periodForm = this.fb.group({
                  'period': [this.selectedPeriod]
                });
              }

  ngOnInit() {
    this.initial(this.selectedPeriod);
    this.alertService.getAlert().subscribe(res => {
      if (res && res.type === 'success') {
        console.log(res);
        this.initial(this.selectedPeriod);
      }
    })
  }

  initial(period){
    this.selectedPeriod = period;
    let days = this.defStartEndDays(period);

    this.shareService.updatePeriodSelection(this.selectedPeriod);
    this.shareService.updateDate(this.selectedDate);

    this.updateDisplayedPeriod(days.startDate, days.finishDate);
    this.expenseService.getExpensesByRangeDate(days).subscribe((data: Expense[]) => {
      if (data.length) {
        this.hide = false;
        this.shareService.updateEntriesData(data);
        this.loading = false;
      } else{
        this.hide = true;
        this.loading = false;
      }
    });
  }

  selectPeriod(period: Period){
    this.selectedDate = new Date;
    this.initial(period)
  }

  updateDisplayedPeriod(firstDay, lastDay){
    this.displayedPeriod = `${firstDay.toDateString().slice(4)} - ${lastDay.toDateString().slice(4)}`;
  }

  isListRoute(){
    var str = this.router.url;
    var res = str.includes('/list') || str.includes('/pie') || str.includes('/column');
    return res;
  }

  moveForward(){
    this.loading = true;
    
    if (this.selectedPeriod === Period.Week) {
      this.selectedDate = increaseDate(this.selectedDate, 7, 0, 0);
    }
    if (this.selectedPeriod === Period.Month) {
      this.selectedDate = increaseDate(this.selectedDate, 0, 1, 0);      
    }
    if (this.selectedPeriod === Period.Year) {
      this.selectedDate = increaseDate(this.selectedDate, 0, 0, 1);      
    }

    this.initial(this.selectedPeriod);
  }

  moveBack(){
    this.loading = true;

    if (this.selectedPeriod === Period.Week) {
      this.selectedDate = decreaseDate(this.selectedDate, 7, 0, 0);
    }
    if (this.selectedPeriod === Period.Month) {
      this.selectedDate = decreaseDate(this.selectedDate, 0, 1, 0);      
    }
    if (this.selectedPeriod === Period.Year) {
      this.selectedDate = decreaseDate(this.selectedDate, 0, 0, 1);      
    }

    this.initial(this.selectedPeriod);
  }
  
  defStartEndDays(period: Period){
    let days: SearchModel;
    if(period === Period.Week){
      days = this.shareService.defStartEndDaysInWeek(this.selectedDate);
    } 
    if(period === Period.Month){
      days = this.shareService.defStartEndDaysInMonth(this.selectedDate);
    } 
    if(period === Period.Year){
      days = this.shareService.defStartEndDaysInYear(this.selectedDate);
    } 

    return days;
  }
}

function increaseDate(currDate, day, month, year){
  let increasedDate = new Date( currDate.getFullYear() + year,
                                currDate.getMonth() + month,
                                currDate.getDate() + day);
  increasedDate.setHours(0,0,0,0);

  return increasedDate;
}

function decreaseDate(currDate, day, month, year){
  let increasedDate = new Date( currDate.getFullYear() - year,
                                currDate.getMonth() - month,
                                currDate.getDate() - day);
  increasedDate.setHours(0,0,0,0);

  return increasedDate;
}

// filterForm = new FormGroup({
//   fromDate: new FormControl(),
//   toDate: new FormControl()
// });

// updateFilterForm(firstDay, lastDay){
//   this.filterForm.controls['fromDate'].setValue(firstDay);
//   this.filterForm.controls['toDate'].setValue(lastDay);
// }

// get fromDate() {return this.filterForm.get('fromDate').value;}
// get toDate() {return this.filterForm.get('toDate').value;}