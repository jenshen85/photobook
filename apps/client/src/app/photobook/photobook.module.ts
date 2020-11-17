import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { UiModule } from '@photobook/ui';

import { PhotobookService } from './photobook.service';
import { PhotobookComponent } from './photobook.component';
import { HomePageComponent } from './home-page/home-page.component';
import { UserPageComponent } from './user-page/user-page.component';
import { AlbumPageComponent } from './album-page/album-page.component';
import { HeaderUserComponent } from '../shared/components/header-user/header-user.component';
import { UserComponentComponent } from '../shared/components/user/user.component';
import { FooterComponent } from '../shared/components/footer/footer.component';
import { PhButtonComponent } from '../shared/components/ph-button/ph-button.component';
import { UploadImageComponent } from '../shared/components/upload-image/upload-image.component';
import { SearchControlComponent } from '../shared/components/search-control/search-control.component';
import { PhotoCardComponent } from '../shared/components/photo-card/photo-card.component';
import { FallbackImageComponent } from '../shared/components/fallback-image/fallback-image.component';
import { PhotoAlbumComponent } from '../shared/components/photo-album/photo-album.component';
import { DialogModule } from '../shared/components/dialog/dialog.module';
import { DialogRefDirective } from '../shared/directives/dialog-ref.directive';
import { PhotoViewComponent } from '../shared/components/photo-view/photo-view.component';
import { SmallAvaComponent } from '../shared/components/small-ava/small-ava.component';
import { AddAlbumComponent } from '../shared/components/add-album/add-album.component';
import { FileControlComponent } from '../shared/components/file-control/file-control.component'

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
    HeaderUserComponent,
    UserComponentComponent,
    FooterComponent,
    PhButtonComponent,
    UploadImageComponent,
    SearchControlComponent,
    PhotoCardComponent,
    FallbackImageComponent,
    PhotoAlbumComponent,
    DialogRefDirective,
    PhotoViewComponent,
    SmallAvaComponent,
    AddAlbumComponent,
    FileControlComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    DialogModule,
    UiModule,
  ],
  providers: [PhotobookService],
  entryComponents: [PhotoViewComponent, AddAlbumComponent],
  exports: [RouterModule, DialogModule],
})
export class PhotobookModule {}
