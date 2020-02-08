import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/core/services/alert.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  submitted: boolean = false;
  loading: boolean = false;

  constructor(private userService: UserService,
              private fb: FormBuilder,
              private router: Router,
              private alertService: AlertService) { 
                this.registerForm = this.fb.group({
                  'userName': ['', Validators.required],
                  'email': ['', [Validators.required, Validators.email]],
                  'password': ['', [Validators.required, Validators.minLength(6)]],
                  'confirmPassword': ['', Validators.required],
                });
              }

  ngOnInit() {
  }

  get form() { return this.registerForm.controls }

  errors: any[] = [];

  onSubmit(){
    this.submitted = true;

    if (this.registerForm.valid) {
      this.loading = true;

      this.userService.register(this.registerForm.value).subscribe(
        res => {
          this.router.navigate(['/auth']);
        },
        error =>{
          this.loading = false;
          if (error.status === 400) {
            this.alertService.error_400(error.error, true);
          }
        });
    }
  }

}
