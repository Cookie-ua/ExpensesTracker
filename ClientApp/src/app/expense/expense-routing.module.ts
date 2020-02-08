import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExpenseComponent } from './expense/expense.component';
import { ListComponent } from './list/list.component';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
import { DeleteComponent } from './delete/delete.component';
import { PieComponent } from './charts/pie/pie.component';
import { ColumnComponent } from './charts/column/column.component';

import { AuthGuard } from 'src/app/auth/auth.guard';

const expenseRoutes: Routes = [
  {path: 'expense', redirectTo: '/expenses/list', canActivate: [AuthGuard]},
  {
    path: 'expenses', 
    component: ExpenseComponent,
    canActivate: [AuthGuard],
    children: [
      {path: 'list', component: ListComponent},
      {path: 'add', component: AddComponent},
      {path: 'edit/:id', component: EditComponent},
      {path: 'delete/:id', component: DeleteComponent},
      {path: 'pie', component: PieComponent},
      {path: 'column', component: ColumnComponent}
    ]
  }
];
  
  @NgModule({
    imports: [RouterModule.forChild(expenseRoutes)],
    exports: [RouterModule]
  })
  export class ExpenseRoutingModule { }