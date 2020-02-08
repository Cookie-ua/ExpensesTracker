import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  get(path: string, params: HttpParams = new HttpParams()): Observable<any>{
    return this.http.get(`${environment.api_url}${path}`, {params});
  }

  post(path: string, body: Object = {}): Observable<any>{
    return this.http.post(`${environment.api_url}${path}`, JSON.stringify(body));
  }

  put(path: string, body: Object ={}): Observable<any>{
    return this.http.put(`${environment.api_url}${path}`, JSON.stringify(body));
  }

  delete(path: string, body: Object ={}): Observable<any>{
    return this.http.delete(`${environment.api_url}${path}`, body);
  }
}
