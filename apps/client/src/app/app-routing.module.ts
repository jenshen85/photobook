import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { AuthGuard } from './auth/auth.guard';
import { AccessGuard } from './auth/access.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./entry/entry.module').then((m) => m.EntryModule),
    canActivate: [AccessGuard],
  },
  {
    path: 'photobook',
    loadChildren: () =>
      import('./photobook/photobook.module').then((m) => m.PhotobookModule),
    canActivate: [AuthGuard],
  },
  { path: '**', component: NotfoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
