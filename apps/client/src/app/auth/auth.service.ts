import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map, shareReplay, tap } from 'rxjs/operators';

import {
  AuthCredentialsDto,
  AuthRoDto,
  UserCredentialsDto,
  UserProfileCredentialsDto,
  UserRoDto,
} from '@photobook/dto';
import { JwtPayload, UserProfileRoI, UserRoI } from '@photobook/data';
import { PATHS } from '../shared/utils/api'

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
  private _authUserProfileSubj: BehaviorSubject<UserProfileRoI> = new BehaviorSubject(null);
  private _authUserProfile$: Observable<UserProfileRoI> = this._authUserProfileSubj.asObservable();

  private _currentUserProfileSubj: BehaviorSubject<UserProfileRoI> = new BehaviorSubject(null);
  private _currentUserProfile$: Observable<UserProfileRoI> = this._currentUserProfileSubj.asObservable();

  constructor(
    private readonly _http: HttpClient,
    private readonly _jwtHelper: JwtHelperService,
    private readonly _router: Router
  ) {}

  register(userCredentials: UserCredentialsDto): Observable<UserRoDto> {
    return this._http.post<UserRoDto>(PATHS.signup, userCredentials).pipe(
      tap((data) => {
        this._router.navigate(['']);
      }),
      shareReplay({ refCount: true })
    );
  }

  login(authCredential: AuthCredentialsDto): Observable<AuthRoDto> {
    return this._http.post<AuthRoDto>(PATHS.signin, authCredential).pipe(
      tap((token) => {
        tokenSetter(token.accessToken);
        console.log(this.getPayload().hasProfile);
        if(this.getPayload().hasProfile) {
          this._router.navigate(['photobook']);
        } else {
          this._router.navigate(['profile']);
        }
      }),
      shareReplay({ refCount: true })
    );
  }

  restore() {}

  createUserProfile(data: UserProfileCredentialsDto): Observable<UserProfileRoI> {
    return this._http.post<UserProfileRoI>(PATHS.profile, data).pipe(
      tap((data) => {
        this._router.navigate(['photobook']);
      }),
      shareReplay({ refCount: true })
    );
  }

  getMeProfile(): Observable<UserProfileRoI> {
    return this._http.get<UserProfileRoI>(PATHS.profile).pipe(
      map((data) => {
        this._authUserProfileSubj.next(data);
        return data;
      })
    );
  }

  getUserProfile(user_profile_id: number | string): Observable<UserProfileRoI> {
    return this._http.get<UserProfileRoI>(`${PATHS.profile}/${user_profile_id}`).pipe(
      map((data) => {
        this._currentUserProfileSubj.next(data);
        return data;
      })
    );
  }

  updateMeProfile(data: FormData): Observable<UserProfileRoI> {
    return this._http.patch<UserProfileRoI>(PATHS.profile, data).pipe(
      map((data) => {
        this._authUserProfileSubj.next(data);
        return data;
      })
    );
  }

  public currentUserProfile(): Observable<UserProfileRoI> {
    return this._currentUserProfile$;
  }

  public authUserProfile(): Observable<UserProfileRoI> {
    return this._authUserProfile$;
  }

  public setCurrentUserProfile(user: UserProfileRoI) {
    this._currentUserProfileSubj.next(user);
  }

  public setAuthUserProfile(user: UserProfileRoI) {
    this._authUserProfileSubj.next(user);
  }

  isAuthenticated(): boolean {
    const token = tokenGetter();
    return token && !this._jwtHelper.isTokenExpired(token);
  }

  getPayload(): JwtPayload {
    const token = tokenGetter();
    return this._jwtHelper.decodeToken(token);
  }

  logout(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    this._router.navigate(['']);
  }
}
