import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Directive({
  selector: '[appShowAuthed]'
})
export class ShowAuthedDirective implements OnInit {

  condition: boolean;

  constructor(private authService: AuthService,
              private templateRef: TemplateRef<any>,
              private viewContainer: ViewContainerRef) { }

  ngOnInit() {
    this.authService.currentUser.subscribe(
      (isAuth) => {
        if (isAuth && this.condition || !isAuth && !this.condition) {
          this.viewContainer.createEmbeddedView(this.templateRef);
        } else {
          this.viewContainer.clear();
        }
      });
  }

  @Input() set appShowAuthed(condition: boolean) {
    this.condition = condition;
  }
}
