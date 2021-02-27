import { Directive, ElementRef, Input, OnChanges, OnInit, Optional, SimpleChanges } from '@angular/core';
import { Dialog } from './dialog';
import { DialogRef, _closeDialogVia } from './dialog-ref';

@Directive({
  selector: '[dialog-close], [dialogClose]',
  exportAs: 'dialogClose',
  host: {
    '(click)': '_onButtonClick($event)',
    '[attr.aria-label]': 'ariaLabel || null',
    '[attr.type]': 'type',
  }
})
export class DialogClose implements OnInit, OnChanges {
  @Input('aria-label') ariaLabel: string | null = null;
  @Input() type: 'submit' | 'button' | 'reset' = 'button';
  @Input('dialog-close') dialogResult: any;
  @Input('dialogClose') _dialogClose: any;

  constructor(
    @Optional() public dialogRef: DialogRef<any>,
    private _elementRef: ElementRef<HTMLElement>,
    private _dialog: Dialog) {}

  ngOnInit() {
    if (!this.dialogRef) {
      this.dialogRef = getClosestDialog(this._elementRef, this._dialog.openDialogs)!;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    const proxiedChange = changes['_dialogClose'] || changes['_dialogCloseResult'];

    if (proxiedChange) {
      this.dialogResult = proxiedChange.currentValue;
    }
  }

  _onButtonClick(event: MouseEvent) {
    _closeDialogVia(this.dialogRef, event.screenX === 0 && event.screenY === 0 ? 'keyboard' : 'mouse', this.dialogResult);
  }
}

function getClosestDialog(element: ElementRef<HTMLElement>, openDialogs: DialogRef<any>[]) {
  let parent: HTMLElement | null = element.nativeElement.parentElement;

  while (parent && !parent.classList.contains('dialog-container')) {
    parent = parent.parentElement;
  }

  return parent ? openDialogs.find(dialog => dialog.id === parent!.id) : null;
}
