import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorageService } from '../services/storage.service';
import { User } from '../models/user.model';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private storageService: StorageService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const headersConfig = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          };
        
        let user: User = this.storageService.get('currentUser');
        if (user) {

            headersConfig['Authorization'] = `Bearer ${user.access_token}`;
        }  
        request =  request.clone({setHeaders: headersConfig});

        return next.handle(request);
    }
}