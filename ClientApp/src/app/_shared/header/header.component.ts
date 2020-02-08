import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/user/user.service';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/core/models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  currentUser: User;

  constructor(private authService: AuthService,
              private router: Router) { }

  ngOnInit() {
    this.authService.currentUser.subscribe(user => this.currentUser = user);
  }

  logout(){
    this.authService.logout();
    this.router.navigate(['/auth']);
  }
}
