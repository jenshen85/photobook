import { Direction } from "@angular/cdk/bidi";
import { ScrollStrategy } from "@angular/cdk/overlay";
import { ComponentFactoryResolver, ViewContainerRef } from "@angular/core";
import { scrolledOverlayPositionType } from "./overlay/overlay";

export type DialogRole = 'dialog' | 'alertdialog';
export interface DialogPosition {
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
}

export class DialogConfig<D = any> {
  viewContainerRef?: ViewContainerRef;
  id?: string;
  role?: DialogRole;
  panelClass?: string | string[] = 'panelClass';
  hasBackdrop?: boolean = true;
  backdropClass?: string | string[] = '';
  disableClose?: boolean = false;
  width?: string = '';
  height?: string = '';
  minWidth?: string = '';
  minHeight?: string = '';
  maxWidth?: string = '80vh';
  maxHeight?: string;
  position?: DialogPosition;
  data?: D | null = null;
  direction?: Direction;
  ariaDescribedBy?: string | null = null;
  ariaLabelledBy?: string | null = null;
  ariaLabel?: string | null = null;
  autoFocus?: boolean = true;
  restoreFocus?: boolean = true;
  scrollStrategy?: ScrollStrategy;
  closeOnNavigation?: boolean = true;
  componentFactoryResolver?: ComponentFactoryResolver;
  isScrolled?: boolean = false;
  scrolledOverlayPosition?: scrolledOverlayPositionType = "top";
}
