import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PhotobookComponent } from './photobook.component';
import { HomePageComponent } from './home-page/home-page.component';
import { UserPageComponent } from './user-page/user-page.component';
import { AlbumPageComponent } from './album-page/album-page.component';

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
        path: ':user_profile_id',
        component: UserPageComponent,
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
  exports: [RouterModule],
})
export class PhotobookRoutingModule {}
