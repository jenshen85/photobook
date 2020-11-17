import {
  ComponentFactoryResolver,
  ComponentRef,
  Injectable,
  Type,
} from '@angular/core';
import { DialogComponent } from './dialog.component';
import { DialogRefDirective } from '../../directives/dialog-ref.directive';

export class DialogOptions {
  data?: {
    [key: string]: any
  };
  centered?: boolean;
  dialogContentClass?: string;
}

@Injectable({ providedIn: 'root' })
export class DialogService {
  constructor(
    private readonly resolver: ComponentFactoryResolver,
  ) {}

  open(
    dialogRefDir: DialogRefDirective,
    content: Type<any>,
    dialogOptions?: DialogOptions,
    onDialogClose?: Function
  ): ComponentRef<DialogComponent> {
    const factory = this.resolver.resolveComponentFactory(
      DialogComponent
    );
    dialogRefDir.containerRef.clear();
    const dialog = dialogRefDir.containerRef.createComponent(factory);
    const dialogInstance = dialog.instance;
    dialogInstance.dialogContent = content;
    setDialogProps(dialogOptions, dialogInstance);
    dialogInstance.close.subscribe((data?: any) => {
      typeof onDialogClose === 'function' && onDialogClose(data);
      dialogRefDir.containerRef.clear();
    });
    dialog.changeDetectorRef.detectChanges();
    return dialog;
  }

  close(dialogRefDir: DialogRefDirective): void {
    dialogRefDir.containerRef.clear();
  }
}

function setDialogProps(options: DialogOptions, componentInstance: DialogComponent) {
  return Object.keys(options).map(o => {
    componentInstance[o] = options[o];
  })
}
