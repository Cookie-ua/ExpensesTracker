import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../user.service';

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.css']
})
export class EmailComponent implements OnInit {

  email: string;
  emailForm: FormGroup;

  submitted: boolean = false;
  loading: boolean = false;

  constructor(private authService: AuthService,
              private userService: UserService,
              private fb: FormBuilder) { 
                this.emailForm = this.fb.group({
                  'email': ['', [Validators.required, Validators.email]]
                });
              }

  ngOnInit() {
    this.email = this.authService.currentUserValue.email;
  }

  get form() { return this.emailForm.controls }

  onSubmit(){
    this.submitted = true;

    if (this.emailForm.valid) {
      this.loading = true;
      
      this.userService.changeEmail(this.emailForm.value).subscribe(
        data => {
          console.log(data)
        },
        error => {
          this.loading = false;
        }
      )
    }
  }
}
