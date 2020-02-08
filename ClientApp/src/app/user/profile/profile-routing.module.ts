import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PasswordComponent } from './password/password.component';
import { ProfileNavComponent } from './profile-nav/profile-nav.component';
import { ProfileComponent } from './profile/profile.component';
import { EmailComponent } from './email/email.component';
import { DeleteComponent } from "./delete/delete.component";


import { AuthGuard } from 'src/app/auth/auth.guard';

const profileRoutes: Routes = [
    {
        path: '', 
        component: ProfileNavComponent,
        canActivate: [AuthGuard],
        children: [
            {path: '', component: ProfileComponent},
            {path: 'password', component: PasswordComponent},
            {path: 'email', component: EmailComponent},
            {path: 'delete', component: DeleteComponent},
          ]
    }
  ];
  
  @NgModule({
    imports: [RouterModule.forChild(profileRoutes)],
    exports: [RouterModule]
  })
  export class ProfileRoutingModule { }