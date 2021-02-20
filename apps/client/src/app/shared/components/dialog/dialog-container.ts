import {
  FocusMonitor,
  FocusOrigin,
  ConfigurableFocusTrap,
  ConfigurableFocusTrapFactory
} from '@angular/cdk/a11y'
import {
  animate,
  AnimationTriggerMetadata,
  AnimationEvent,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';
import {
  BasePortalOutlet,
  CdkPortalOutlet,
  ComponentPortal,
  TemplatePortal
} from '@angular/cdk/portal';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentRef,
  Directive,
  ElementRef,
  EmbeddedViewRef,
  EventEmitter,
  Inject,
  Optional,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { DialogConfig } from './dialog-config';
import { _closeDialogVia } from './dialog-ref';

interface DialogAnimationEvent {
  state: 'opened' | 'opening' | 'closing' | 'closed';
  totalTime: number;
}

const dialogAnimations: {
  readonly DialogContainer: AnimationTriggerMetadata
} = {
  DialogContainer: trigger('dialogContainer', [
    state('void, exit', style({opacity: 0, transform: 'scale(0.7)'})),
    state('enter', style({transform: 'none'})),
    transition('* => enter', animate('150ms cubic-bezier(0, 0, 0.2, 1)',
      style({opacity: 1, transform: 'none'}))),
    transition('* => void, * => exit', animate('75ms cubic-bezier(0.4, 0, 0.2, 1)',
      style({opacity: 0})))
  ])
}

export function throwDialogContentAlreadyAttachedError() {
  throw Error('Attemping to attach dialog content after content is already attached')
}

@Directive()
export abstract class _DialogContainerBase extends BasePortalOutlet {
  protected _document: Document;
  @ViewChild(CdkPortalOutlet, { static: true }) _portalOutlet!: CdkPortalOutlet;
  private _focusTrap!: ConfigurableFocusTrap;
  _animationStateChanged = new EventEmitter<DialogAnimationEvent>();
  private _elementFocusedBeforeDialogWasOpened: HTMLElement | null = null;
  _closeInteractionType: FocusOrigin | null = null;
  _ariaLabelledBy: string | null;
  _id!: string;

  constructor(
    protected _elementRef: ElementRef,
    protected _focusTrapFactory: ConfigurableFocusTrapFactory,
    protected _changeDetectorRef: ChangeDetectorRef,
    @Optional() @Inject(DOCUMENT) _document: any,
    public _config: DialogConfig,
    private _focusMonitor: FocusMonitor
  ) {
    super();
    this._ariaLabelledBy = _config.ariaLabelledBy || null;
    this._document = _document;
  }

  abstract _startExitAnimation(): void;

  _initializeWithAttachedContent() {
    this._setupFocusTrap();
    this._capturePreviouslyFocusedElement();
    this._focusDialogContainer();
  }

  attachComponentPortal<T>(portal: ComponentPortal<T>): ComponentRef<T> {
    // @ts-ignore
    if(this._portalOutlet.hasAttached() && (typeof ngDevMode === undefined || ngDevMode)) {
      throwDialogContentAlreadyAttachedError();
    }

    return this._portalOutlet.attachComponentPortal(portal);
  }

  attachTemplatePortal<C>(portal: TemplatePortal<C>): EmbeddedViewRef<C> {
    // @ts-ignore
    if (this._portalOutlet.hasAttached() && (typeof ngDevMode === 'undefined' || ngDevMode)) {
      throwDialogContentAlreadyAttachedError();
    }

    return this._portalOutlet.attachTemplatePortal(portal);
  }

  _recaptureFocus() {
    if(!this._containsFocus()) {
      const focusContainer = !this._config.autoFocus || !this._focusTrap.focusInitialElement();
      if(focusContainer) {
        this._elementRef.nativeElement.focus();
      }
    }
  }

  protected _trapFocus() {
    if(this._config.autoFocus) {
      this._focusTrap.focusLastTabbableElementWhenReady()
    } else if(!this._containsFocus()) {
      this._elementRef.nativeElement.focus();
    }
  }

  protected _restoreFocus() {
    const previousElement = this._elementFocusedBeforeDialogWasOpened;
    if(this._config.restoreFocus && previousElement && typeof previousElement.focus === 'function') {
      const activeElement = this._document.activeElement;
      const element = this._elementRef.nativeElement;

      if(!activeElement || activeElement === this._document.body || activeElement === element || element.contains(activeElement)) {
        if(this._focusMonitor) {
          this._focusMonitor.focusVia(previousElement, this._closeInteractionType);
          this._closeInteractionType = null
        } else {
          previousElement.focus();
        }
      }
    }

    if(this._focusTrap) {
      this._focusTrap.destroy();
    }
  }

  private _setupFocusTrap() {
    this._focusTrap = this._focusTrapFactory.create(this._elementRef.nativeElement);
  }

  private _capturePreviouslyFocusedElement() {
    if(this._document) {
      this._elementFocusedBeforeDialogWasOpened = this._document.activeElement as HTMLElement;
    }
  }

  private _focusDialogContainer() {
    if(this._elementRef.nativeElement.focus) {
      this._elementRef.nativeElement.focus();
    }
  }

  private _containsFocus() {
    const element = this._elementRef.nativeElement;
    const activeElement = this._document.activeElement;
    return element === activeElement || element.contains(activeElement);
  }
}

@Component({
  selector: 'dialog-container',
  templateUrl: './dialog-container.html',
  styleUrls: ['./dialog-container.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Default,
  animations: [dialogAnimations.DialogContainer],
  host: {
    class: 'dialog-container',
    'tabindex': '-1',
    'aria-modal': 'true',
    '[id]': '_id',
    '[attr.role]': '_config.role',
    '[attr.aria-labelledby]': '_config.ariaLabel ? null : _ariaLabelledBy',
    '[attr.aria-label]': '_config.ariaLabel',
    '[attr.aria-describedby]': '_config.ariaDescribedBy || null',
    '[@dialogContainer]': '_state',
    '(@dialogContainer.start)': '_onAnimationStart($event)',
    '(@dialogContainer.done)': '_onAnimationDone($event)',
  }
})
export class DialogContainer extends _DialogContainerBase {
  _state: 'void' | 'enter' | 'exit' = 'enter';

  _onAnimationDone({toState, totalTime}: AnimationEvent) {
    if(toState === 'enter') {
      this._trapFocus();
      this._animationStateChanged.next({state: 'opened', totalTime});
    } else if(toState === 'exit') {
      this._restoreFocus();
      this._animationStateChanged.next({state: 'closed', totalTime});
    }
  }

  _onAnimationStart({toState, totalTime}: AnimationEvent) {
    if (toState === 'enter') {
      this._animationStateChanged.next({state: 'opening', totalTime});
    } else if (toState === 'exit' || toState === 'void') {
      this._animationStateChanged.next({state: 'closing', totalTime});
    }
  }

  _startExitAnimation(): void {
    this._state = 'exit';
    this._changeDetectorRef.markForCheck();
  }
}
