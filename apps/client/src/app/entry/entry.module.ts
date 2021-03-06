import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { UiModule } from '@photobook/ui';
import { EntryComponent } from './entry.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { RestoreComponent } from './restore/restore.component';
import { ProfileComponent } from './profile/profile.component';
import { TranslocoModule } from '@ngneat/transloco';

const routes: Routes = [
  {
    path: '',
    component: EntryComponent,
    children: [
      {
        path: '',
        component: LoginComponent,
      },
      {
        path: 'register',
        component: RegisterComponent,
      },
      {
        path: 'profile',
        component: ProfileComponent,
      },
      {
        path: 'restore',
        component: RestoreComponent,
      },
    ],
  },
];

@NgModule({
  declarations: [
    EntryComponent,
    RegisterComponent,
    LoginComponent,
    RestoreComponent,
    ProfileComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    UiModule,
    TranslocoModule,
  ],
})
export class EntryModule {}
