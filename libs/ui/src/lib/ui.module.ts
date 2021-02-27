import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import {
  FormGroupDirective,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { DialogModule } from './dialog/dialog.module';

import { FadeComponent } from './fade/fade.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { FormControlComponent } from './form-control/form-control.component';
import { AppIconComponent } from './app-icon/app-icon.component';
import { FormTextareaComponent } from './form-textarea/form-textarea.component';
import { PhButtonComponent } from './ph-button/ph-button.component';
import { SmallAvaComponent } from './small-ava/small-ava.component'

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    DialogModule
  ],
  exports: [
    CommonModule,
    FadeComponent,
    SpinnerComponent,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    DialogModule,
    FormControlComponent,
    FormTextareaComponent,
    AppIconComponent,
    PhButtonComponent,
    SmallAvaComponent
  ],
  providers: [FormGroupDirective],
  declarations: [
    FadeComponent,
    SpinnerComponent,
    FormControlComponent,
    FormTextareaComponent,
    AppIconComponent,
    PhButtonComponent,
    SmallAvaComponent
  ],
})
export class UiModule {}
