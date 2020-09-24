import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { PhotobookComponent } from './photobook.component';
import { UiModule } from '@photobook/ui';

const routes: Routes = [
  {
    path: '',
    component: PhotobookComponent
  }
]

@NgModule({
  declarations: [PhotobookComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    UiModule
  ],
  exports: [RouterModule]
})
export class PhotobookModule { }
