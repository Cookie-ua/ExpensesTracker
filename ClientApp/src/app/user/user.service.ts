import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RegisterViewModel } from '../core/models/register.model';
import { ApiService } from '../core/services/api.service';
import { ChangePasswordModel } from '../core/models/change-password.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private apiService: ApiService) { }

  register(registerModel: RegisterViewModel){
    return this.apiService.post('/accounts/register', registerModel);
  }

  getUser(){
    return this.apiService.get('/accounts');
  }

  changePassword(changePasswordModel: ChangePasswordModel){
    return this.apiService.post('/accounts/ChangePassword', changePasswordModel);
  }

  changeEmail(changeEmailModel: string){
    return this.apiService.post('/accounts/ChangeEmail', changeEmailModel);
  }

  deleteUser(deletePasswordModel: string){
    return this.apiService.post('/accounts/Delete', deletePasswordModel);
  }
}