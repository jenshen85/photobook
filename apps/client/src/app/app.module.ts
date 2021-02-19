import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JwtModule } from '@auth0/angular-jwt';
import {
  FormsModule,
  ReactiveFormsModule,
  FormControlDirective,
} from '@angular/forms';

import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
// import { EntryModule } from './entry/entry.module';
import { AuthService, tokenGetter } from './auth/auth.service';
import { AppComponent } from './app.component';
import { NotfoundComponent } from './shared/components/notfound/notfound.component';
// import { HeaderAlbumComponent } from './shared/components/header-album/header-album.component';
// import { SmallAvaComponent } from './shared/components/small-ava/small-ava.component';

@NgModule({
  declarations: [
    AppComponent,
    NotfoundComponent,
    // HeaderAlbumComponent,
    // SmallAvaComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    // EntryModule,
    JwtModule.forRoot({
      config: {
        tokenGetter,
        allowedDomains: environment.tokenWhiteListedDomains,
      },
    }),
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [AuthService, FormControlDirective],
  bootstrap: [AppComponent],
})
export class AppModule {}
