import { Component, OnInit } from '@angular/core';
import { ExpenseService } from '../expense.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Expense } from 'src/app/core/models/expense.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertService } from 'src/app/core/services/alert.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  expenseId: any;
  expense: Expense;
  editForm: FormGroup;

  constructor(private route:ActivatedRoute,
              private router: Router,
              private expenseService: ExpenseService,
              private alertService: AlertService,
              private fb: FormBuilder) { 
                this.editForm = this.fb.group({
                  'category' : ['', Validators.required],
                  'amount' : ['', Validators.required],
                  'date' : ['', Validators.required],
                  'note' : ['', Validators.required],
                });
              }

  ngOnInit() {
    this.expenseId = this.route.snapshot.paramMap.get('id');
    this.expenseService.get(this.expenseId).subscribe(data => {
      this.expense = data;

      this.editForm.controls['category'].setValue(this.expense.category);
      this.editForm.controls['amount'].setValue(this.expense.amount);
      this.editForm.controls['date'].setValue(this.expense.date);
      this.editForm.controls['note'].setValue(this.expense.note);
    });

  }

  onSubmit(){
    this.editForm.value.expenseId = this.expense.expenseId;

    this.expenseService.edit(this.expenseId, this.editForm.value).subscribe(
      data => {
        this.alertService.success('Entry has been changed!', true);
        this.router.navigate(['/expense']);
      },
      error => {
        
      });
  }

}
