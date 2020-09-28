import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { UiModule } from '@photobook/ui';

import { PhotobookComponent } from './photobook.component';
import { HomePageComponent } from './home-page/home-page.component';
import { UserPageComponent } from './user-page/user-page.component';
import { AlbumPageComponent } from './album-page/album-page.component';
import { HeaderComponent } from '../components/header/header.component';
import { PhotobookService } from './photobook.service';
import { UserComponent } from '../components/user/user.component'


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
  ],
  imports: [CommonModule, RouterModule.forChild(routes), UiModule],
  providers: [ PhotobookService ],
  exports: [RouterModule],
})
export class PhotobookModule {}
