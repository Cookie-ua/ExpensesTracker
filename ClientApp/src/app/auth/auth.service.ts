import { Injectable } from '@angular/core';
import { LoginViewModel } from '../core/models/login.model';
import { map } from 'rxjs/operators';
import { StorageService } from '../core/services/storage.service';
import { User } from '../core/models/user.model';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ApiService } from '../core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUserSubject : BehaviorSubject<User>;
  public currentUser : Observable<User>;

  constructor(private storageService: StorageService,
              private apiService: ApiService) {
                this.currentUserSubject = new BehaviorSubject<User>(this.storageService.get('currentUser'));
                this.currentUser = this.currentUserSubject.asObservable();
              }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  setAuth(user: User){
    this.storageService.set('currentUser', user);
    this.currentUserSubject.next(user);
  }

  login(credentials: LoginViewModel){
    return this.apiService.post('/auth/token', credentials).pipe(map(user =>{
      this.setAuth(user);  
    
      return user;
    }));
  }

  logout(){
    this.storageService.delete('currentUser');
    this.currentUserSubject.next(null);
  }
}
