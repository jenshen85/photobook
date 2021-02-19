import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'photobook-app-control',
  templateUrl: './app-control.component.html',
  styleUrls: ['./app-control.component.scss'],
  host: {
    class: 'photobook-app-control',
    '(change)': 'onChange($event.target.value)',
    '(input)': 'onChange($event.target.value)',
    '(blur)': 'onTouched($event.target.value)',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: AppControlComponent,
      multi: true
    }
  ]
})
export class AppControlComponent implements OnInit, AfterViewInit, ControlValueAccessor {
  onChange: Function;
  onTouched: Function;
  // @Optional()
  @Input() type? = 'text';
  @Input() placeholder? = '';
  @Input() className?: string;
  @Input() isTextarea? = false;
  @Input() isDisabled? = false;
  @Input() isReadonly? = false;
  value = '';

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
  }

  writeValue(value: string): void {
    this.value = value;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }
}
