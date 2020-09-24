import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { EntryModule } from './entry/entry.module';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => EntryModule,
  },
  {
    path: 'photobook',
    loadChildren: () => import('./photobook/photobook.module').then(m => m.PhotobookModule),
  },
  { path: '**', component: NotfoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
