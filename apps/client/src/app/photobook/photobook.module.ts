import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { UiModule } from '@photobook/ui';

import { PhotobookService } from './photobook.service';
import { PhotobookComponent } from './photobook.component';
import { HomePageComponent } from './home-page/home-page.component';
import { UserPageComponent } from './user-page/user-page.component';
import { AlbumPageComponent } from './album-page/album-page.component';
import { HeaderComponent } from '../shared/components/header/header.component';
import { UserComponent } from '../shared/components/user/user.component';
import { FooterComponent } from '../shared/components/footer/footer.component';
import { PhButton } from '../shared/components/ph-button/ph-button.component';
import { UploadImage } from '../shared/components/upload-image/upload-image.component';
import { SearchControl } from '../shared/components/search-control/search-control.component';

const routes: Routes = [
  {
    path: '',
    component: PhotobookComponent,
    children: [
      {
        path: '',
        component: HomePageComponent,
      },
      {
        path: 'user/:id',
        component: UserPageComponent,
      },
      {
        path: 'user/:id/:album_id',
        component: AlbumPageComponent,
      },
    ],
  },
];

@NgModule({
  declarations: [
    PhotobookComponent,
    HomePageComponent,
    UserPageComponent,
    AlbumPageComponent,
    HeaderComponent,
    UserComponent,
    FooterComponent,
    PhButton,
    UploadImage,
    SearchControl,
  ],
  imports: [CommonModule, RouterModule.forChild(routes), UiModule],
  providers: [PhotobookService],
  exports: [RouterModule],
})
export class PhotobookModule {}
