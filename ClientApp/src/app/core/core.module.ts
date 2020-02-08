import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertService } from './services/alert.service';
import { AlertComponent } from './components/alert/alert.component';
import { NoExpensesComponent } from './components/no-expenses/no-expenses.component';

@NgModule({
  declarations: [
    AlertComponent,
    NoExpensesComponent
  ],
  imports: [
    CommonModule
  ],
  providers: [
    AlertService
  ],
  exports: [
    AlertComponent,
    NoExpensesComponent
  ]
})
export class CoreModule { }
