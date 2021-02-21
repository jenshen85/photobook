import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { UiModule } from '@photobook/ui';
import { PhotobookRoutingModule } from './photobook-routing.module'
import { DialogModule } from '../shared/components/dialog/dialog.module';

import { PhotobookService } from './photobook.service';

import { PhotobookComponent } from './photobook.component';
import { HomePageComponent } from './home-page/home-page.component';
import { AlbumPageComponent } from './album-page/album-page.component';
import { HeaderUserComponent } from '../shared/components/header-user/header-user.component';
import { HeaderAlbumComponent } from '../shared/components/header-album/header-album.component';
import { UserComponentComponent } from '../shared/components/user/user.component';
import { FooterComponent } from '../shared/components/footer/footer.component';
import { PhButtonComponent } from '../shared/components/ph-button/ph-button.component';
import { UploadImageComponent } from '../shared/components/upload-image/upload-image.component';
import { SearchControlComponent } from '../shared/components/search-control/search-control.component';
import { PhotoCardComponent } from '../shared/components/photo-card/photo-card.component';
import { FallbackImageComponent } from '../shared/components/fallback-image/fallback-image.component';
import { PhotoAlbumComponent } from '../shared/components/photo-album/photo-album.component';
import { PhotoViewComponent } from '../shared/components/photo-view/photo-view.component';
import { SmallAvaComponent } from '../shared/components/small-ava/small-ava.component';
import { AddAlbumComponent } from '../shared/components/add-album/add-album.component';
import { FileControlComponent } from '../shared/components/file-control/file-control.component';
import { AppControlComponent } from '../shared/components/app-control/app-control.component';
import { AddPhotoComponent } from '../shared/components/add-photo/add-photo.component'
import { IconComponent } from '../shared/components/icon/icon.component';
import { PhotosComponent } from './photos/photos.component';
import { AlbumsComponent } from './albums/albums.component'

@NgModule({
  declarations: [
    PhotobookComponent,
    HomePageComponent,
    AlbumPageComponent,
    HeaderUserComponent,
    HeaderAlbumComponent,
    UserComponentComponent,
    FooterComponent,
    PhButtonComponent,
    UploadImageComponent,
    SearchControlComponent,
    PhotoCardComponent,
    FallbackImageComponent,
    PhotoAlbumComponent,
    PhotoViewComponent,
    SmallAvaComponent,
    AddAlbumComponent,
    FileControlComponent,
    AppControlComponent,
    AddPhotoComponent,
    IconComponent,
    PhotosComponent,
    AlbumsComponent
  ],
  imports: [
    CommonModule,
    PhotobookRoutingModule,
    DialogModule,
    UiModule,
  ],
  providers: [PhotobookService],
  entryComponents: [PhotoViewComponent, AddAlbumComponent, AddPhotoComponent],
  exports: [PhotobookRoutingModule, DialogModule],
})
export class PhotobookModule {}
