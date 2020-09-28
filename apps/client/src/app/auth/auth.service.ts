import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { shareReplay, tap } from 'rxjs/operators';

import {
  AuthCredentialsDto,
  AuthRoDto,
  UserCredentialsDto,
  UserRoDto,
} from '@photobook/dto';

export const ACCESS_TOKEN_KEY = 'access_token';

export function tokenGetter(): string {
  return localStorage.getItem(ACCESS_TOKEN_KEY) || '';
}

export function tokenSetter(token: string): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  api = 'api/auth/signup';
  api2 = 'api/auth/signin';
  constructor(
    private readonly _http: HttpClient,
    private readonly _jwtHelper: JwtHelperService,
    private readonly _router: Router
  ) {}

  register(userCredentials: UserCredentialsDto): Observable<UserRoDto> {
    return this._http.post<UserRoDto>(this.api, userCredentials).pipe(
      tap((data) => {
        this._router.navigate(['']);
      }),
      shareReplay({ refCount: true }),
    );
  }

  login(authCredential: AuthCredentialsDto): Observable<AuthRoDto> {
    return this._http.post<AuthRoDto>(this.api2, authCredential).pipe(
      tap((token) => {
        tokenSetter(token.accessToken);
        this._router.navigate(['photobook']);
      }),
      shareReplay({ refCount: true })
    );
  }

  restore() {}

  isAuthenticated(): boolean {
    const token = tokenGetter();
    return token && !this._jwtHelper.isTokenExpired(token);
  }

  logout(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    this._router.navigate(['']);
  }
}
