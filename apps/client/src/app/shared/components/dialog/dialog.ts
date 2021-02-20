import { Directionality } from '@angular/cdk/bidi';
import {
  ComponentType,
  GlobalPositionStrategy,
  OverlayConfig,
  OverlayContainer,
  OverlayRef,
  ScrollStrategy } from '@angular/cdk/overlay';
import { ComponentPortal, TemplatePortal } from '@angular/cdk/portal';
import {
  Directive,
  Inject,
  Injectable,
  InjectionToken,
  Injector,
  NgZone,
  OnDestroy,
  Optional,
  SkipSelf,
  StaticProvider,
  TemplateRef,
  Type } from '@angular/core';
import {defer, Observable, of as observableOf, Subject} from 'rxjs';
import {startWith} from 'rxjs/operators';
import { DialogConfig } from './dialog-config';
import { DialogRef } from './dialog-ref';
import { DialogContainer, _DialogContainerBase } from './dialog-container';
import {
  BlockOverflowScrollStrategyOptions,
  OverlayScolled,
  ScrolledOverlayPositionBuilder,
  ScrolledPositionStrategy,
  ScrolledOverlayOptions
} from './overlay/overlay';

export type scrollStrategyType = (isScrolled: boolean) => ScrollStrategy;

export const DIALOG_DATA = new InjectionToken<any>('DialogData');

export const DIALOG_DEFAULT_OPTIONS = new InjectionToken<DialogConfig>('dialog-default-options');

export const DIALOG_SCROLL_STRATEGY = new InjectionToken<() => ScrollStrategy>('dialog-scroll-strategy');

export function DIALOG_SCROLL_STRATEGY_PROVIDER_FACTORY(overlay: OverlayScolled): scrollStrategyType {
  return (isScrolled) => {
    if(isScrolled) {
      return (overlay.scrollStrategies as BlockOverflowScrollStrategyOptions).overflow();
    }
    return overlay.scrollStrategies.block();
  };
}

/** @docs-private */
export const DIALOG_SCROLL_STRATEGY_PROVIDER = {
  provide: DIALOG_SCROLL_STRATEGY,
  deps: [OverlayScolled],
  useFactory: DIALOG_SCROLL_STRATEGY_PROVIDER_FACTORY,
};

@Directive()
export abstract class _DialogBase<C extends _DialogContainerBase> implements OnDestroy {
  private _openDialogsAtThisLevel: DialogRef<any>[] = [];
  private readonly _afterAllClosedAtThisLevel = new Subject<void>();
  private readonly _afterOpenedAtThisLevel = new Subject<DialogRef<any>>();
  private _ariaHiddenElements = new Map<Element, string|null>();
  private _scrollStrategy: scrollStrategyType;

  get openDialogs(): DialogRef<any>[] {
    return this._parentDialog ? this._parentDialog.openDialogs : this._openDialogsAtThisLevel;
  }

  get afterOpened(): Subject<DialogRef<any>> {
    return this._parentDialog ? this._parentDialog.afterOpened : this._afterOpenedAtThisLevel;
  }

  _getAfterAllClosed(): Subject<void> {
    const parent = this._parentDialog;
    return parent ? parent._getAfterAllClosed() : this._afterAllClosedAtThisLevel;
  }

  readonly afterAllClosed: Observable<void> = defer(() => this.openDialogs.length
    ? this._getAfterAllClosed()
    : this._getAfterAllClosed().pipe(startWith(undefined))) as Observable<any>;

  constructor(
    private _overlay: OverlayScolled,
    private _injector: Injector,
    private _defaultOptions: DialogConfig|undefined,
    private _parentDialog: _DialogBase<C>|undefined,
    private _overlayContainer: OverlayContainer,
    scrollStrategy: scrollStrategyType,
    private _dialogRefConstructor: Type<DialogRef<any>>,
    private _dialogContainerType: Type<C>,
    private _dialogDataToken: InjectionToken<any>,
    private _ngZone: NgZone
    ) {
    this._scrollStrategy = scrollStrategy;
  }

  open<T, D = any, R = any>(template: TemplateRef<T>, config?: DialogConfig<D>): DialogRef<T, R>;
  open<T, D = any, R = any>(template: ComponentType<T> | TemplateRef<T>, config?: DialogConfig<D>): DialogRef<T, R>;
  open<T, D = any, R = any>(componentOrTemplateRef: ComponentType<T> | TemplateRef<T>, config?: DialogConfig<D>): DialogRef<T, R> {

    config = _applyConfigDefaults(config, this._defaultOptions || new DialogConfig());

    // @ts-ignore
    if (config.id && this.getDialogById(config.id) && (typeof ngDevMode === 'undefined' || ngDevMode)) {
      throw Error(`Dialog with id "${config.id}" exists already. The dialog id must be unique.`);
    }

    const overlayRef = this._createOverlay(config);
    const dialogContainer = this._attachDialogContainer(overlayRef, config);
    const dialogRef = this._attachDialogContent<T, R>(componentOrTemplateRef, dialogContainer, overlayRef, config);
    if (!this.openDialogs.length) {
      this._hideNonDialogContentFromAssistiveTechnology();
    }
    this.openDialogs.push(dialogRef);
    dialogRef.afterClosed().subscribe(() => this._removeOpenDialog(dialogRef));
    this.afterOpened.next(dialogRef);
    dialogContainer._initializeWithAttachedContent();

    return dialogRef;
  }

  closeAll(): void {
    this._closeDialogs(this.openDialogs);
  }

  getDialogById(id: string): DialogRef<any> | undefined {
    return this.openDialogs.find(dialog => dialog.id === id);
  }

  ngOnDestroy() {
    // Only close the dialogs at this level on destroy
    // since the parent service may still be active.
    this._closeDialogs(this._openDialogsAtThisLevel);
    this._afterAllClosedAtThisLevel.complete();
    this._afterOpenedAtThisLevel.complete();
  }

  private _createOverlay(config: DialogConfig): OverlayRef {
    const overlayConfig = this._getOverlayConfig(config);
    return this._overlay.create(overlayConfig);
  }

  private _getOverlayConfig(dialogConfig: DialogConfig): OverlayConfig {
    const isScrolled = dialogConfig.isScrolled ? dialogConfig.isScrolled : false;
    const state = new OverlayConfig({
      positionStrategy: this._getOverlayPositionStrategy(isScrolled, {
        isScrolled: isScrolled,
        scrolledOverlayPosition: dialogConfig.scrolledOverlayPosition,
      }),
      scrollStrategy: dialogConfig.scrollStrategy || this._scrollStrategy(isScrolled),
      panelClass: dialogConfig.panelClass,
      hasBackdrop: dialogConfig.hasBackdrop,
      direction: dialogConfig.direction,
      minWidth: dialogConfig.minWidth,
      minHeight: dialogConfig.minHeight,
      maxWidth: dialogConfig.maxWidth,
      maxHeight: dialogConfig.maxHeight,
      disposeOnNavigation: dialogConfig.closeOnNavigation
    });

    if (dialogConfig.backdropClass) {
      state.backdropClass = dialogConfig.backdropClass;
    }

    return state;
  }

  private _getOverlayPositionStrategy(isScrolled: boolean, options: ScrolledOverlayOptions): GlobalPositionStrategy | ScrolledPositionStrategy {
    if(isScrolled) {
      return (this._overlay.position() as ScrolledOverlayPositionBuilder).scrolled(options);
    } else {
      return this._overlay.position().global();
    }
  }

  private _attachDialogContainer(overlay: OverlayRef, config: DialogConfig): C {
    const userInjector = config && config.viewContainerRef && config.viewContainerRef.injector;
    const injector = Injector.create({
      parent: userInjector || this._injector,
      providers: [{provide: DialogConfig, useValue: config}]
    });

    const containerPortal = new ComponentPortal(this._dialogContainerType,
        config.viewContainerRef, injector, config.componentFactoryResolver);
    const containerRef = overlay.attach<C>(containerPortal);

    return containerRef.instance;
  }

  private _attachDialogContent<T, R>(
    componentOrTemplateRef: ComponentType<T> | TemplateRef<T>,
    dialogContainer: C,
    overlayRef: OverlayRef,
    config: DialogConfig): DialogRef<T, R> {

    // Create a reference to the dialog we're creating in order to give the user a handle
    // to modify and close it.
    const dialogRef = new this._dialogRefConstructor(overlayRef, dialogContainer, config.id, config, this._ngZone);

    if (componentOrTemplateRef instanceof TemplateRef) {
      dialogContainer.attachTemplatePortal(
        new TemplatePortal<T>(componentOrTemplateRef, null!, <any>{$implicit: config.data, dialogRef}));
    } else {
      const injector = this._createInjector<T>(config, dialogRef, dialogContainer);
      const contentRef = dialogContainer.attachComponentPortal<T>(
        new ComponentPortal(componentOrTemplateRef, config.viewContainerRef, injector));
      dialogRef.componentInstance = contentRef.instance;
      // dialogContainer.dialogRefInstance = dialogRef;
    }

    if(!config.isScrolled) {
      dialogRef
        .updateSize(config.width, config.height)
        .updatePosition(config.position);
    }

    return dialogRef;
  }

  private _createInjector<T>( config: DialogConfig, dialogRef: DialogRef<T>, dialogContainer: C): Injector {
    const userInjector = config && config.viewContainerRef && config.viewContainerRef.injector;
    const providers: StaticProvider[] = [
      {provide: this._dialogContainerType, useValue: dialogContainer},
      {provide: this._dialogDataToken, useValue: config.data},
      {provide: this._dialogRefConstructor, useValue: dialogRef}
    ];

    if (config.direction &&
        (!userInjector || !userInjector.get<Directionality | null>(Directionality, null))) {
      providers.push({
        provide: Directionality,
        useValue: {value: config.direction, change: observableOf()}
      });
    }

    return Injector.create({parent: userInjector || this._injector, providers});
  }

  private _removeOpenDialog(dialogRef: DialogRef<any>) {
    const index = this.openDialogs.indexOf(dialogRef);

    if (index > -1) {
      this.openDialogs.splice(index, 1);
      if (!this.openDialogs.length) {
        this._ariaHiddenElements.forEach((previousValue, element) => {
          if (previousValue) {
            element.setAttribute('aria-hidden', previousValue);
          } else {
            element.removeAttribute('aria-hidden');
          }
        });

        this._ariaHiddenElements.clear();
        this._getAfterAllClosed().next();
      }
    }
  }

  private _hideNonDialogContentFromAssistiveTechnology() {
    const overlayContainer = this._overlayContainer.getContainerElement();

    // Ensure that the overlay container is attached to the DOM.
    if (overlayContainer.parentElement) {
      const siblings = overlayContainer.parentElement.children;

      for (let i = siblings.length - 1; i > -1; i--) {
        let sibling = siblings[i];

        if (sibling !== overlayContainer &&
          sibling.nodeName !== 'SCRIPT' &&
          sibling.nodeName !== 'STYLE' &&
          !sibling.hasAttribute('aria-live')) {

          this._ariaHiddenElements.set(sibling, sibling.getAttribute('aria-hidden'));
          sibling.setAttribute('aria-hidden', 'true');
        }
      }
    }
  }

  private _closeDialogs(dialogs: DialogRef<any>[]) {
    let i = dialogs.length;
    while (i--) {
      dialogs[i].close();
    }
  }
}

@Injectable()
export class Dialog extends _DialogBase<DialogContainer> {
  constructor(
    overlay: OverlayScolled,
    injector: Injector,
    @Optional() @Inject(DIALOG_DEFAULT_OPTIONS) defaultOptions: DialogConfig,
    @Inject(DIALOG_SCROLL_STRATEGY) scrollStrategy: scrollStrategyType,
    @Optional() @SkipSelf() parentDialog: Dialog,
    overlayContainer: OverlayContainer,
    _ngZone: NgZone)
  {
    super(overlay, injector, defaultOptions, parentDialog, overlayContainer, scrollStrategy, DialogRef, DialogContainer, DIALOG_DATA, _ngZone);
  }
}

function _applyConfigDefaults(config?: DialogConfig, defaultOptions?: DialogConfig): DialogConfig {
  return {...defaultOptions, ...config};
}
