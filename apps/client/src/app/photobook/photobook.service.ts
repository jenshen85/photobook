import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserProfileCredentialsDto, UserProfileRODto, UserRoDto } from '@photobook/dto';
import { Observable } from 'rxjs';

import { PATHS } from '../shared/utils/api'

@Injectable({
  providedIn: 'root',
})
export class PhotobookService {
  constructor(
    private readonly _http: HttpClient,
    private readonly _router: Router
  ) {}

  getUser(): Observable<UserRoDto> {
    return this._http.get<UserRoDto>(PATHS.me);
  }

  updateProfile(data: FormData): Observable<UserProfileRODto> {
    return this._http.patch<UserProfileRODto>(PATHS.updateProfile, data);
  }
}
