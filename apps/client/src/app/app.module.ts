import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JwtModule } from  '@auth0/angular-jwt';

import { environment } from '../environments/environment'
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { EntryModule } from './entry/entry.module';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { AuthService, tokenGetter } from './auth/auth.service'

@NgModule({
  declarations: [AppComponent, NotfoundComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    EntryModule,
    JwtModule.forRoot({
      config: {
        tokenGetter,
        allowedDomains: environment.tokenWhiteListedDomains
      }
    })
  ],
  providers: [ AuthService ],
  bootstrap: [AppComponent],
})
export class AppModule {}
