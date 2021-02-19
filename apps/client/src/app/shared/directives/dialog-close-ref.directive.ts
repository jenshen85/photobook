import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[dialogCloseRef]',
  exportAs: 'dialogCloseRef'
})
export class DialogCloseRefDirective {
  constructor(private templateRef: TemplateRef<any>) {
    console.log(templateRef);
  }
}
