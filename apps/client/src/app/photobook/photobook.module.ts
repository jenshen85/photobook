import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { UiModule } from '@photobook/ui';
import { PhotobookRoutingModule } from './photobook-routing.module'

import { PhotobookService } from './photobook.service';

import { PhotobookComponent } from './photobook.component';
import { HomePageComponent } from './home-page/home-page.component';
import { AlbumPageComponent } from './album-page/album-page.component';
import { HeaderUserComponent } from './home-page/components/header-user/header-user.component';
import { HeaderAlbumComponent } from './album-page/components/header-album/header-album.component';
import { UserComponentComponent } from '../shared/components/user/user.component';
import { UploadImageComponent } from '../shared/components/upload-image/upload-image.component';
import { SearchControlComponent } from '../shared/components/search-control/search-control.component';
import { PhotoCardComponent } from '../shared/components/photo-card/photo-card.component';
import { PhotoAlbumComponent } from '../shared/components/photo-album/photo-album.component';
import { PhotoViewComponent } from '../shared/components/photo-view/photo-view.component';
import { AddAlbumComponent } from './home-page/components/add-album/add-album.component';
import { FileControlComponent } from '../shared/components/file-control/file-control.component';
import { AppControlComponent } from '../shared/components/app-control/app-control.component';
import { AddPhotoComponent } from './album-page/components/add-photo/add-photo.component'
import { HomePagePhotosComponent } from './home-page/components/home-page-photos/home-page-photos.component';
import { HomePageAlbumsComponent } from './home-page/components/home-page-albums/home-page-albums.component'
import { FooterComponent } from './footer/footer.component';

import { DragNDropDirective } from '../shared/directives/drag-n-drop.directive';
import { EditPhotoComponent } from './album-page/components/edit-photo/edit-photo.component'

@NgModule({
  declarations: [
    PhotobookComponent,
    HomePageComponent,
    AlbumPageComponent,
    HeaderUserComponent,
    HeaderAlbumComponent,
    UserComponentComponent,
    UploadImageComponent,
    SearchControlComponent,
    PhotoCardComponent,
    PhotoAlbumComponent,
    PhotoViewComponent,
    AddAlbumComponent,
    FileControlComponent,
    AppControlComponent,
    AddPhotoComponent,
    HomePagePhotosComponent,
    HomePageAlbumsComponent,
    FooterComponent,
    DragNDropDirective,
    EditPhotoComponent
  ],
  imports: [
    CommonModule,
    PhotobookRoutingModule,
    UiModule,
  ],
  providers: [PhotobookService, DragNDropDirective],
  entryComponents: [PhotoViewComponent, AddAlbumComponent, AddPhotoComponent],
  exports: [PhotobookRoutingModule],
})
export class PhotobookModule {}
