import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../user.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.css']
})
export class DeleteComponent implements OnInit {

  deleteForm: FormGroup;
  submitted: boolean = false;
  loading: boolean = false;

  constructor(private authService: AuthService,
              private userService: UserService,
              private fb: FormBuilder,
              private router: Router) { 
                this.deleteForm = this.fb.group({
                  'password': ['', Validators.required]
                });
              }

  ngOnInit() {
  }

  get form() { return this.deleteForm.controls }

  onSubmit(){
    this.submitted = true;

    if (this.deleteForm.valid) {
      this.loading = true;
      
      this.userService.deleteUser(this.deleteForm.value).subscribe(
        res => {
          this.authService.logout();
          this.router.navigate(['/auth']);
        },
        error =>{
          console.log(error);
          this.loading = false;
        });
    }
  }
}