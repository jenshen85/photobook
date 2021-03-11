import {
  AfterViewInit,
  Directive,
  ElementRef,
  Input
} from '@angular/core';

@Directive({
  selector: '[autoFocus]'
})
export class AutoFocusDirective implements AfterViewInit {
  private _autofocus: boolean;

  @Input() set autofocus(condition: boolean) {
    console.log(condition);
    this._autofocus = condition !== false;
  }

  constructor(private readonly _elementRef: ElementRef) {}

  ngAfterViewInit() {
    if(this._autofocus || typeof this._autofocus === 'undefined') {
      this._elementRef.nativeElement.focus();
    }
  }
}