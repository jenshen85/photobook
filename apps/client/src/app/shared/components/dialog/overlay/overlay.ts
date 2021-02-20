import { Directionality } from "@angular/cdk/bidi";
import { coerceCssPixelValue } from "@angular/cdk/coercion";
import {
  Overlay,
  OverlayContainer,
  OverlayKeyboardDispatcher,
  OverlayOutsideClickDispatcher,
  OverlayPositionBuilder,
  PositionStrategy,
  ScrollDispatcher,
  ScrollStrategy,
  ScrollStrategyOptions,
  ViewportRuler
} from "@angular/cdk/overlay";
import { OverlayReference } from "@angular/cdk/overlay/overlay-reference";
import { supportsScrollBehavior } from "@angular/cdk/platform";
import { DOCUMENT, Location } from "@angular/common";
import {
  ComponentFactoryResolver,
  Inject,
  Injectable,
  Injector,
  NgZone
} from "@angular/core";

/** Class to be added to the overlay pane wrapper. */
const wrapperClass = 'cdk-scrolled-overlay-wrapper';

export type scrolledOverlayPositionType = "top" | "center" | "bottom" | "left" | "right";

export interface ScrolledOverlayOptions {
  isScrolled?: boolean;
  scrolledOverlayPosition?: scrolledOverlayPositionType;
}

export class ScrolledPositionStrategy implements PositionStrategy {
  private _overlayRef!: OverlayReference;
  private _isDisposed!: boolean;
  private _options: ScrolledOverlayOptions

  constructor(options: ScrolledOverlayOptions) {
    this._options = options;
  }

  attach(overlayRef: OverlayReference): void {
    const config = overlayRef.getConfig();
    this._overlayRef = overlayRef;
    if (config.width) {
      overlayRef.updateSize({width: config.width});
    }

    if (!config.height) {
      overlayRef.updateSize({height: config.height});
    }

    overlayRef.hostElement.classList.add(wrapperClass);
    this._isDisposed = false;
  }

  apply(): void {
    // Since the overlay ref applies the strategy asynchronously, it could
    // have been disposed before it ends up being applied. If that is the
    // case, we shouldn't do anything.
    if (!this._overlayRef || !this._overlayRef.hasAttached()) {
      return;
    }

    const {isScrolled, scrolledOverlayPosition} = this._options;
    const parentStyles = this._overlayRef.hostElement.style;
    const styles = this._overlayRef.overlayElement.style;
    parentStyles.width = '100%';
    parentStyles.height = '100%';
    styles.width = '100%';
    styles.height = '100%';
    styles.maxWidth = '100%';
    styles.maxHeight = 'none';
    styles.overflowY = 'auto';
    styles.overflowX = 'hidden';

    this._overlayRef.overlayElement.classList.add('cdk-scrolled-overlay');

    if(isScrolled) {
      this._overlayRef.overlayElement.classList.add(`cdk-scrolled-overlay--${scrolledOverlayPosition}`);
    }
  }

  dispose(): void {
    if (this._isDisposed || !this._overlayRef) {
      return;
    }

    const {isScrolled, scrolledOverlayPosition} = this._options;
    const styles = this._overlayRef.overlayElement.style;
    const parent = this._overlayRef.hostElement;
    const parentStyles = parent.style;

    parent.classList.remove(wrapperClass);
    parentStyles.width = parentStyles.height = styles.width =
      styles.height = styles.maxWidth = styles.maxHeight = styles.overflowY = styles.overflowX = '';

    this._overlayRef.overlayElement.classList.remove('cdk-scrolled-overlay');
    this._overlayRef = null!;
    this._isDisposed = true;

    if(isScrolled && scrolledOverlayPosition === 'center') {
      this._overlayRef.overlayElement.classList.remove(`cdk-scrolled-overlay--${scrolledOverlayPosition}`);
    }
  }
}

const scrollBehaviorSupported = supportsScrollBehavior();

export class OverflowScrollStrategy implements ScrollStrategy {
  private _previousHTMLStyles = {top: '', left: ''};
  private _previousScrollPosition!: {top: number, left: number};
  private _isEnabled = false;
  private _document: Document;

  constructor(private _viewportRuler: ViewportRuler, document: any) {
    this._document = document;
  }

  enable(): void {
    if (this._canBeEnabled()) {
      const root = this._document.documentElement!;

      this._previousScrollPosition = this._viewportRuler.getViewportScrollPosition();

      // Cache the previous inline styles in case the user had set them.
      this._previousHTMLStyles.left = root.style.left || '';
      this._previousHTMLStyles.top = root.style.top || '';

      // Note: we're using the `html` node, instead of the `body`, because the `body` may
      // have the user agent margin, whereas the `html` is guaranteed not to have one.
      root.style.left = coerceCssPixelValue(-this._previousScrollPosition.left);
      root.style.top = coerceCssPixelValue(-this._previousScrollPosition.top);
      root.style.paddingRight = coerceCssPixelValue(this._getScrollbarWidth());
      root.classList.add('cdk-global-overflowblock');
      this._isEnabled = true;
    }
  }

  disable(): void {
    if (this._isEnabled) {
      const html = this._document.documentElement!;
      const body = this._document.body!;
      const htmlStyle = html.style;
      const bodyStyle = body.style;
      const previousHtmlScrollBehavior = htmlStyle.scrollBehavior || '';
      const previousBodyScrollBehavior = bodyStyle.scrollBehavior || '';

      this._isEnabled = false;

      htmlStyle.left = this._previousHTMLStyles.left;
      htmlStyle.top = this._previousHTMLStyles.top;
      htmlStyle.paddingRight = '';
      html.classList.remove('cdk-global-overflowblock');

      // Disable user-defined smooth scrolling temporarily while we restore the scroll position.
      // See https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-behavior
      // Note that we don't mutate the property if the browser doesn't support `scroll-behavior`,
      // because it can throw off feature detections in `supportsScrollBehavior` which
      // checks for `'scrollBehavior' in documentElement.style`.
      if (scrollBehaviorSupported) {
        htmlStyle.scrollBehavior = bodyStyle.scrollBehavior = 'auto';
      }

      window.scroll(this._previousScrollPosition.left, this._previousScrollPosition.top);

      if (scrollBehaviorSupported) {
        htmlStyle.scrollBehavior = previousHtmlScrollBehavior;
        bodyStyle.scrollBehavior = previousBodyScrollBehavior;
      }
    }
  }

  attach(overlayRef: OverlayReference): void {}

  detach() : void {}

  private _canBeEnabled(): boolean {
    // Since the scroll strategies can't be singletons, we have to use a global CSS class
    // (`cdk-global-overflowblock`) to make sure that we don't try to disable global
    // scrolling multiple times.
    const html = this._document.documentElement!;

    if (html.classList.contains('cdk-global-overflowblock') || this._isEnabled) {
      return false;
    }

    const body = this._document.body;
    const viewport = this._viewportRuler.getViewportSize();

    return body.scrollHeight > viewport.height || body.scrollWidth > viewport.width;
  }

  private _getScrollbarWidth(): number {
    const viewport = this._viewportRuler.getViewportSize();

    if(this._getDocHeight() > viewport.height) {
      const scrollDiv = document.createElement('div');
      scrollDiv.style.visibility = 'hidden';
      scrollDiv.style.overflow = 'scroll'; // forcing scrollbar to appear

      // @ts-ignore
      scrollDiv.style.msOverflowStyle = 'scrollbar'; // needed for WinJS apps

      document.body.appendChild(scrollDiv)
      const inner = document.createElement('div');
      scrollDiv.appendChild(inner);

      const scrollbarWidth = (scrollDiv.offsetWidth - inner.offsetWidth);

      document.body.removeChild(scrollDiv)
      if(scrollDiv && scrollDiv.parentNode) {
        scrollDiv.parentNode.removeChild(scrollDiv);
      }

      return scrollbarWidth;
    }
    return 0;
  }

  private _getDocHeight() {
    const D = document;
    return Math.max(
        D.body.scrollHeight, D.documentElement.scrollHeight,
        D.body.offsetHeight, D.documentElement.offsetHeight,
        D.body.clientHeight, D.documentElement.clientHeight
    );
  }
}

@Injectable()
export class ScrolledOverlayPositionBuilder extends OverlayPositionBuilder {
  scrolled(options: ScrolledOverlayOptions): ScrolledPositionStrategy {
    return new ScrolledPositionStrategy(options);
  }
}

@Injectable()
export class BlockOverflowScrollStrategyOptions extends ScrollStrategyOptions {
  protected document: Document;

  overflow = (): OverflowScrollStrategy => {
    return new OverflowScrollStrategy(this.viewportRuler, this.document);
  }

  constructor(
    protected scrollDispatcher: ScrollDispatcher,
    protected viewportRuler: ViewportRuler,
    protected ngZone: NgZone,
    @Inject(DOCUMENT) document: Document) {
      super(scrollDispatcher, viewportRuler, ngZone, document);
      this.document = document;
    }
}

@Injectable()
export class OverlayScolled extends Overlay {
  constructor(
    scrollStrategies: BlockOverflowScrollStrategyOptions,
    _overlayContainer: OverlayContainer,
    _componentFactoryResolver: ComponentFactoryResolver,
    _positionBuilder: ScrolledOverlayPositionBuilder,
    _keyboardDispatcher: OverlayKeyboardDispatcher,
    _injector: Injector,
    _ngZone: NgZone,
    @Inject(DOCUMENT) _document: any,
    _directionality: Directionality,
    _location: Location,
    _outsideClickDispatcher: OverlayOutsideClickDispatcher
  ) {
    super(
      scrollStrategies,
      _overlayContainer,
      _componentFactoryResolver,
      _positionBuilder,
      _keyboardDispatcher,
      _injector,
      _ngZone,
      _document,
      _directionality,
      _location,
      _outsideClickDispatcher
    );
  }
}
