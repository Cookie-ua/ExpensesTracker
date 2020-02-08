import { Component, OnInit } from '@angular/core';
import { AlertService } from '../../services/alert.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {

  private subscription: Subscription;
  message: any;
  messageArray: Array<any>;
  click: boolean = true;

  constructor(private alertService: AlertService) { }

  ngOnInit() {
      this.subscription = this.alertService.getAlert()
          .subscribe(message => {
              switch (message && message.type) {
                  case 'success':
                      message.cssClass = 'alert alert-success text-center';
                      break;
                  case 'error':
                      message.cssClass = 'alert alert-danger text-center';
                      break;
                  case 'error_400':
                      message.cssClass = 'text-danger';
                      this.messageArray = message;
                      break;
              }

              this.message = message;
          });
  }

  close(){
      this.message = null;
  }

  ngOnDestroy() {
      this.subscription.unsubscribe();
  }

}
