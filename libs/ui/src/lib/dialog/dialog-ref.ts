import { NgZone } from '@angular/core';
import { GlobalPositionStrategy, OverlayRef } from '@angular/cdk/overlay';
import { ESCAPE, hasModifierKey } from '@angular/cdk/keycodes';
import { FocusOrigin } from '@angular/cdk/a11y';
import { Observable, Subject } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { _DialogContainerBase } from './dialog-container';
import { DialogConfig, DialogPosition } from './dialog-config';

let uniqueId = 0;
export const enum DialogState {
  OPEN,
  CLOSING,
  CLOSED
}

export class DialogRef<T, R = any> {
  componentInstance!: T;
  disableClose: boolean | undefined = this._containerInstance._config.disableClose;
  private readonly _afterOpened = new Subject<void>();
  private readonly _afterClosed = new Subject<R | undefined>();
  private readonly _beforeClosed = new Subject<R | undefined>();
  private readonly _overlayElementClick: Subject<MouseEvent> = new Subject();
  private _overlayElementClickHandler = (event: MouseEvent) => this._overlayElementClick.next(event);
  private _result: R | undefined;
  private _closeFallbackTimeout!: number;
  private _state = DialogState.OPEN;

  constructor(
    private _overlayRef: OverlayRef,
    public _containerInstance: _DialogContainerBase,
    readonly id: string = `dialog-${uniqueId++}`,
    private readonly config: DialogConfig,
    private readonly _ngZone: NgZone
  ) {
    _containerInstance._id = id;
    _containerInstance._animationStateChanged.pipe(
      filter(event => event.state === 'opened'),
      take(1)
    )
    .subscribe(() => {
      this._afterOpened.next();
      this._afterOpened.complete();
    });

    _containerInstance._animationStateChanged.pipe(
      filter(event => event.state === 'closed'),
      take(1)
    ).subscribe(() => {
      clearTimeout(this._closeFallbackTimeout);
      this._finishDialogClose();
    });

    _overlayRef.detachments().subscribe(() => {
      this._beforeClosed.next(this._result);
      this._beforeClosed.complete();
      this._afterClosed.next(this._result);
      this._afterClosed.complete();
      this.componentInstance = null!;
      this._overlayRef.dispose();
    });

    _overlayRef.keydownEvents()
      .pipe(filter(event => {
        return event.keyCode === ESCAPE && !this.disableClose && !hasModifierKey(event);
      }))
      .subscribe(event => {
        event.preventDefault();
        _closeDialogVia(this, 'keyboard');
      });

    _overlayRef.backdropClick().subscribe(() => {
      if (this.disableClose) {
        this._containerInstance._recaptureFocus();
      } else {
        _closeDialogVia(this, 'mouse');
      }
    });

    if(config.isScrolled) {
      this._attachOverlayElementListener();
      this._overlayElementClick.subscribe((e) => {
        if(e.target === _overlayRef.overlayElement) {
          if (this.disableClose) {
            this._containerInstance._recaptureFocus();
          } else {
            _closeDialogVia(this, 'mouse');
          }
        }
      });
    }
  }

  close(dialogResult?: R): void {
    this._result = dialogResult;
    this._containerInstance._animationStateChanged.pipe(
      filter(event => event.state === 'closing'),
      take(1)
    )
    .subscribe(event => {
      this._beforeClosed.next(dialogResult);
      this._beforeClosed.complete();
      this._overlayRef.detachBackdrop();

      if(this.config.isScrolled) {
        this._overlayElementClick.complete();
        this._detachOverlayElementListener();
      }

      // @ts-ignore
      this._closeFallbackTimeout = setTimeout(() => this._finishDialogClose(), event.totalTime + 100);
    });

    this._state = DialogState.CLOSING;
    this._containerInstance._startExitAnimation();
  }

  afterOpened(): Observable<void> {
    return this._afterOpened;
  }

  afterClosed(): Observable<R | undefined> {
    return this._afterClosed;
  }

  beforeClosed(): Observable<R | undefined> {
    return this._beforeClosed;
  }

  backdropClick(): Observable<MouseEvent> {
    return this._overlayRef.backdropClick();
  }

  keydownEvents(): Observable<KeyboardEvent> {
    return this._overlayRef.keydownEvents();
  }

  updatePosition(position?: DialogPosition): this {
    if(!this.config.isScrolled) {
      let strategy = this._getPositionStrategy();

      if (position && (position.left || position.right)) {
        position.left ? strategy.left(position.left) : strategy.right(position.right);
      } else {
        strategy.centerHorizontally();
      }

      if (position && (position.top || position.bottom)) {
        position.top ? strategy.top(position.top) : strategy.bottom(position.bottom);
      } else {
        strategy.centerVertically();
      }

      this._overlayRef.updatePosition();
    }

    return this;
  }

  updateSize(width: string = '', height: string = ''): this {
    this._overlayRef.updateSize({width, height});
    this._overlayRef.updatePosition();
    return this;
  }

  addPanelClass(classes: string | string[]): this {
    this._overlayRef.addPanelClass(classes);
    return this;
  }

  removePanelClass(classes: string | string[]): this {
    this._overlayRef.removePanelClass(classes);
    return this;
  }

  getState(): DialogState {
    return this._state;
  }

  private _attachOverlayElementListener() {
    this._overlayRef.overlayElement.addEventListener('click', this._overlayElementClickHandler);
  }

  private _detachOverlayElementListener() {
    let overlayElement = this._overlayRef.overlayElement;

    if (!overlayElement) {
      return;
    }

    let timeoutId: number;
    let finishDetach = () => {
      // It may not be attached to anything in certain cases (e.g. unit tests).
      if (overlayElement) {
        overlayElement.removeEventListener('click', this._overlayElementClickHandler);
        overlayElement.removeEventListener('transitionend', finishDetach);
      }

      clearTimeout(timeoutId);
    };

    this._ngZone.runOutsideAngular(() => {
      overlayElement!.addEventListener('transitionend', finishDetach);
    });

    // @ts-ignore
    timeoutId = this._ngZone.runOutsideAngular(() => setTimeout(finishDetach, 500));
  }

  private _finishDialogClose() {
    this._state = DialogState.CLOSED;
    this._overlayRef.dispose();
  }

  private _getPositionStrategy(): GlobalPositionStrategy {
    return this._overlayRef.getConfig().positionStrategy as GlobalPositionStrategy;
  }
}

export function _closeDialogVia<R>(ref: DialogRef<R>, interactionType: FocusOrigin, result?: R) {
  if (ref._containerInstance !== undefined) {
    ref._containerInstance._closeInteractionType = interactionType;
  }
  return ref.close(result);
}
