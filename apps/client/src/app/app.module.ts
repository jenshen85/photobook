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
import { AuthService, tokenGetter } from './auth/auth.service';
import { AppComponent } from './app.component';
import { NotfoundComponent } from './notfound/notfound.component';

@NgModule({
  declarations: [
    AppComponent,
    NotfoundComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
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
