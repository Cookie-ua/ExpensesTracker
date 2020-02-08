import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ExpenseService } from '../expense.service';
import { AlertService } from 'src/app/core/services/alert.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {

  addForm: FormGroup;
  submitted: boolean = false;
  currentDate: Date;

  constructor(private expenseService: ExpenseService,
              private fb: FormBuilder,
              private alertService: AlertService,
              private router: Router) {
                this.currentDate = new Date;
                this.addForm = this.fb.group({ 
                  'category': ['', Validators.required],
                  'amount': ['', Validators.required],
                  'date': [new Date(this.currentDate.setHours(0,0,0,0)), Validators.required],
                  'note': [''],
                });
              }

  ngOnInit() {
  }

  get form() { return this.addForm.controls; }

  onSubmit(){
    this.submitted = true;

    if (this.addForm.valid) {
      this.expenseService.add(this.addForm.value).subscribe(
      data => {
        this.alertService.success('Entry has been added!', true);
        this.router.navigate(['/expense/list']);
      },
      error => {

      });
    }
  }
}
