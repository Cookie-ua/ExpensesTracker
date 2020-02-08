import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/core/services/alert.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  submitted: boolean = false;
  loading: boolean = false;

  constructor(private authService: AuthService,
              private alertService: AlertService, 
              private fb: FormBuilder,
              private router: Router) { 
                this.loginForm = this.fb.group({
                  'userName': ['', Validators.required],
                  'password': ['', Validators.required],
                });
              }

  ngOnInit() {
  }

  get form() { return this.loginForm.controls }

  onSubmit(){
    this.submitted = true;

    if(this.loginForm.valid){
      this.loading = true;

      this.authService.login(this.loginForm.value).subscribe(
        res => {
          this.router.navigateByUrl('/expenses/list');
        }, 
        error => {
          this.loading = false;
          if (error.status === 400) {
            this.alertService.error_400(error.error, false);
          }
        });
    }
  }

}
