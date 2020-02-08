import { Component, OnInit } from '@angular/core';
import { UserService } from '../../user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from 'src/app/core/services/alert.service';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.css']
})
export class PasswordComponent implements OnInit {

  changePasswordForm: FormGroup;
  success: boolean = false;
  submitted: boolean = false;
  loading: boolean = false;

  constructor(private userService: UserService,
              private fb: FormBuilder,
              private alertService: AlertService) { 
                this.changePasswordForm = this.fb.group({
                  'currentPassword': ['', Validators.required],
                  'newPassword': ['', [Validators.required, Validators.minLength(6)]],
                  'confirmPassword': ['', Validators.required]
                })
              }

  ngOnInit() {
  }

  get form() { return this.changePasswordForm.controls }

  onSubmit(){
    // this.changePasswordForm.reset();
    this.submitted = true;
    
    if (this.changePasswordForm.valid) {
      this.loading = true;

      this.userService.changePassword(this.changePasswordForm.value).subscribe(
        data => {
          this.submitted = false;
          this.loading = false;
          this.changePasswordForm.reset();
          this.alertService.success('Your password has been changed.');
        },
        error => {
          this.loading = false;
          if (error.status === 400) {
            this.alertService.error_400(error.error, true);
          }
        });   
    }
  }
}
