import {
  Component,
  ElementRef,
  HostListener,
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';

@Component({
  selector: 'photobook-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.scss'],
  host: { class: 'photobook-upload-image' },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: UploadImage,
      multi: true,
    },
  ],
})
export class UploadImage implements ControlValueAccessor {
  onChange: Function;
  private file: File | null = null;
  @HostListener('change', ['$event.target.files']) emitFiles(event: FileList) {
    const file = event && event.item(0);
    this.onChange(file);
    this.file = file;
  }

  constructor(private host: ElementRef<HTMLInputElement>) {}

  writeValue(value: null) {
    //clear file input
    this.host.nativeElement.value = '';
    this.file = null;
  }

  registerOnChange(fn: Function) {
    this.onChange = fn;
  }

  registerOnTouched(fn: Function) {}
}
