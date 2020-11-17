import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[dialogInsert]',
})
export class DialogInsertDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}
