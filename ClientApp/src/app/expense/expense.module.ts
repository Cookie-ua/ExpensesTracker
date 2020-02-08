import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExpenseComponent } from './expense/expense.component';
import { ListComponent } from './list/list.component';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
import { DeleteComponent } from './delete/delete.component';
import { PieComponent } from './charts/pie/pie.component';
import { ColumnComponent } from './charts/column/column.component';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ExpenseRoutingModule } from './expense-routing.module';
import { CoreModule } from '../core/core.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    AddComponent,
    ListComponent,
    ExpenseComponent,
    EditComponent,
    DeleteComponent,
    PieComponent,
    ColumnComponent,
  ],
  imports: [
    CommonModule,
    ExpenseRoutingModule,
    ReactiveFormsModule, FormsModule,
    NgbModule,
    CoreModule
  ]
})
export class ExpenseModule { }
