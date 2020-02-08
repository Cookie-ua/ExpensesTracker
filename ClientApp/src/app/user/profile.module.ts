import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';

import { ProfileNavComponent } from './profile/profile-nav/profile-nav.component';
import { ProfileComponent } from './profile/profile/profile.component';
import { PasswordComponent } from './profile/password/password.component';
import { EmailComponent } from './profile/email/email.component';
import { DeleteComponent } from "./profile/delete/delete.component";

import { ProfileRoutingModule } from './profile/profile-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CoreModule } from 'src/app/core/core.module';

@NgModule({
    imports: [
      CommonModule,
      ProfileRoutingModule,
      ReactiveFormsModule, FormsModule,
      CoreModule
    ],
    declarations: [
        ProfileComponent,
        PasswordComponent,
        EmailComponent,
        DeleteComponent,
        ProfileNavComponent,
    ]
  })
  export class ProfileModule {}