import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AlbumPageComponent } from './album-page/album-page.component';
import { HomePageComponent } from './home-page/home-page.component';
import { PhotobookComponent } from './photobook.component';

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
            path: ':id',
            component: HomePageComponent
          }
        ]
      },
      {
        path: ':id/:album_id',
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
