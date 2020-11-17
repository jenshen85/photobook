import {
  Component,
  EventEmitter,
  HostBinding,
  Output,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ComponentRef,
  Type,
  ComponentFactoryResolver,
  Input,
} from '@angular/core';
import { transition, trigger, useAnimation } from '@angular/animations';
import { fadeIn, fadeOut } from 'ng-animate';
import { delay } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { SpriteIconEnum } from '@photobook/data';
import { DialogInsertDirective } from './dialog-insert.directive';
import { getScrollbarWidth } from '../../utils/utils';

const ANIMATION_DURATION = 100;

@Component({
  selector: 'photobook-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
  host: {
    class: 'photobook-dialog',
    tabindex: '-1',
    role: 'dialog',
  },
  animations: [
    trigger('fade', [
      transition('void => *', [
        useAnimation(fadeIn, { params: { timing: ANIMATION_DURATION / 1000 } }),
      ]),
      transition('* => void', [
        useAnimation(fadeOut, {
          params: { timing: ANIMATION_DURATION / 1000 },
        }),
      ]),
    ]),
  ],
})
export class DialogComponent implements AfterViewInit, OnDestroy {
  componentRef: ComponentRef<any>;
  @Input() centered = false;
  @Input() dialogContentClass: string = '';
  @Input() data = {};
  closeIcon = SpriteIconEnum.close;
  padding: string = '';
  @HostBinding('style.padding-right') pdRight = '';
  @HostBinding('@fade') public animateDialog = true;
  @Output() close = new EventEmitter<any>();
  @ViewChild(DialogInsertDirective) insertPoint: DialogInsertDirective;
  dialogContent: Type<any>;
  obs$: Observable<null>;

  constructor(private readonly factoryResolver: ComponentFactoryResolver) {}

  ngAfterViewInit(): void {
    this.obs$ = of(null);
    this.loadChildComponent(this.dialogContent);
    this.onInit();
  }

  ngOnDestroy(): void {
    if (this.componentRef) {
      this.componentRef.destroy();
    }

    this.obs$.pipe(delay(ANIMATION_DURATION)).subscribe(() => {
      this.onDestroy();
    });
  }

  loadChildComponent(component: Type<any>) {
    const factory = this.factoryResolver.resolveComponentFactory(component);
    const viewContainerRef = this.insertPoint.viewContainerRef;
    viewContainerRef.clear();
    this.componentRef = viewContainerRef.createComponent(factory);
    const dialogChildInstance = this.componentRef.instance
    dialogChildInstance.data = this.data;
    dialogChildInstance.close && dialogChildInstance.close.subscribe((data?: any) => {
      this.close.emit(data);
    });
  }

  onInit() {
    this.padding = `${getScrollbarWidth()}px`;
    document.body.style.paddingRight = this.padding;
    document.body.style.overflow = 'hidden';
    document.body.classList.add('dialog-open');
    this.pdRight = this.padding;
  }

  onDestroy() {
    this.pdRight = '';
    document.body.style.paddingRight = '';
    document.body.style.overflow = '';
    document.body.classList.remove('dialog-open');
  }
}
