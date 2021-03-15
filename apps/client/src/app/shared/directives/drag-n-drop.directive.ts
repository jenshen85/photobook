import {
  Directive,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  Output,
} from '@angular/core';

@Directive({
  selector: '[dragNdrop]',
})
export class DragNDropDirective {
  @Input() dropClass: string;
  @HostBinding('class.filesover') fileOver: boolean;
  @Output() fileDropped: EventEmitter<FileList> = new EventEmitter();

  @HostListener('dragover', ['$event']) onDragOver($event) {
    $event.preventDefault();
    $event.stopPropagation();
    this.fileOver = true;
  }

  @HostListener('dragleave', ['$event']) public onDragLeave($event) {
    $event.preventDefault();
    $event.stopPropagation();
    this.fileOver = false;
  }

  @HostListener('drop', ['$event']) public onDrop($event) {
    $event.preventDefault();
    $event.stopPropagation();
    this.fileOver = false;
    let files = $event.dataTransfer.files;

    if (files.length) {
      this.fileDropped.emit(files);
    }
  }
}
