import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { StorageService } from '../services/storage.service';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/internal/operators/catchError';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    
    constructor(private authService: AuthService,
                private router: Router) { }
    
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {

            if (err.status === 401) {
                this.authService.logout();
                this.router.navigate(['/auth']);
            }
            let errors = []
            if (err.status === 400) {
                let validateError = err.error;
                for (const key in validateError) {
                  if (validateError.hasOwnProperty(key)) {
                    const element = validateError[key];
                    element.forEach(el => {
                      errors.push(el);
                    });
                  }
                }
            }
            let error = {
                status: err.status,
                error: errors
            }

            return throwError(error);
        }))
    }

}