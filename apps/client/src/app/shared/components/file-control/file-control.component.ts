import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'photobook-file-control',
  templateUrl: './file-control.component.html',
  styleUrls: ['./file-control.component.scss'],
  host: {
    class: 'photobook-file-control',
    type: 'file',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: FileControlComponent,
      multi: true,
    },
  ],
})
export class FileControlComponent implements ControlValueAccessor {
  onChange: Function;
  onTouched: Function;
  private files: FileList | File;
  @Input() isMultiple?: boolean;
  @ViewChild('control', { static: true }) control: ElementRef;
  @HostListener('change', ['$event.target.files']) emitFiles(event: FileList) {
    const data = this.isMultiple ? event : event.item(0);
    this.onChange(data);
    this.files = data;
  }

  constructor(
    private host: ElementRef<HTMLInputElement>,
    private render: Renderer2
  ) {}

  writeValue(value: null): void {
    this.host.nativeElement.value = '';
    this.control.nativeElement.value = '';
    this.files = null;
  }

  registerOnChange(fn: Function): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: Function): void {
    this.onTouched = fn;
  }
}
