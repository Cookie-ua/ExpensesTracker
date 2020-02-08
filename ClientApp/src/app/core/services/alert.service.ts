import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Router, NavigationStart } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  private subject = new BehaviorSubject<any>(null);
  private keepAfterRouteChange = false;

  constructor(private router: Router) { 
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
          if (this.keepAfterRouteChange) {
              // only keep for a single route change
              this.keepAfterRouteChange = false;
          } else {
              // clear alert message
              this.clear();
          }
      }
    });
  }
  
  getAlert(): Observable<any> {
    return this.subject.asObservable();
  }

  success(message: string, keepAfterRouteChange = false) {
      this.keepAfterRouteChange = keepAfterRouteChange;
      this.subject.next({ type: 'success', text: message });
  }

  error(message: string, keepAfterRouteChange = false) {
      this.keepAfterRouteChange = keepAfterRouteChange;
      this.subject.next({ type: 'error', text: message });
  }

  error_400(message: Array<any>, keepAfterRouteChange = false){
      this.keepAfterRouteChange = keepAfterRouteChange;
      this.subject.next({ type: 'error_400', text: message });
  }
  
  clear() {
      // clear by calling subject.next() without parameters
      this.subject.next(null);
  }
  
}
