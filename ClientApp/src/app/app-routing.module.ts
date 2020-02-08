import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './user/register/register.component';
import { StartComponent } from './start/start.component';


const routes: Routes = [
  {path: "", component: StartComponent},
  {path: "auth", component: LoginComponent},
  {path: "register", component: RegisterComponent},
  {
    path: "profile",
    loadChildren: () => import('./user/profile.module').then(mod => mod.ProfileModule), 
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }