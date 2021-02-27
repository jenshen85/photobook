import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AlbumPageComponent } from './album-page/album-page.component';
import { HomePageComponent } from './home-page/home-page.component';
import { PhotobookComponent } from './photobook.component';
import { HomePagePhotosComponent } from './home-page/components/home-page-photos/home-page-photos.component';
import { HomePageAlbumsComponent } from './home-page/components/home-page-albums/home-page-albums.component';

const routes: Routes = [
  {
    path: '',
    component: PhotobookComponent,
    children: [
      {
        path: '',
        component: HomePageComponent,
        children: [
          {
            path: '',
            component: HomePagePhotosComponent
          },
          {
            path: ':user_profile_id',
            component: HomePageAlbumsComponent
          }
        ]
      },
      {
        path: ':user_profile_id/:album_id',
        component: AlbumPageComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PhotobookRoutingModule { }
