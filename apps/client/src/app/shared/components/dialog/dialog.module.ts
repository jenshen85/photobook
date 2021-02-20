import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PortalModule } from "@angular/cdk/portal";
import { OverlayModule } from "@angular/cdk/overlay";
import { BlockOverflowScrollStrategyOptions, OverlayScolled, ScrolledOverlayPositionBuilder } from "./overlay/overlay";
import { DialogContainer } from "./dialog-container";
import { Dialog, DIALOG_SCROLL_STRATEGY_PROVIDER } from "./dialog";
import { DialogClose } from "./dialog-content-directives";

@NgModule({
  declarations: [ DialogContainer, DialogClose ],
  imports: [ CommonModule, PortalModule, OverlayModule ],
  providers: [
    Dialog,
    ScrolledOverlayPositionBuilder,
    BlockOverflowScrollStrategyOptions,
    OverlayScolled,
    DIALOG_SCROLL_STRATEGY_PROVIDER
  ],
  exports: [ PortalModule, OverlayModule, DialogContainer, DialogClose ],
  entryComponents: [ DialogContainer ]
})
export class DialogModule {}
