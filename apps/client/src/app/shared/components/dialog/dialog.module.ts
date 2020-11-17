import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogComponent } from './dialog.component';
import { DialogInsertDirective } from './dialog-insert.directive';
import { DialogService } from './dialog.service';
import { IconComponent } from '../icon/icon.component';

@NgModule({
  imports: [CommonModule],
  declarations: [DialogComponent, DialogInsertDirective, IconComponent],
  entryComponents: [DialogComponent],
  providers: [DialogService],
  exports: [CommonModule, IconComponent]
})
export class DialogModule {}
