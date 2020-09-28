import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserRoDto } from '@photobook/dto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PhotobookService {
  constructor(
    private readonly _http: HttpClient,
    private readonly _router: Router
  ) {}

  getUser(id: number): Observable<UserRoDto> {
    return this._http.get<UserRoDto>(`api/user/${id}`)
  }
}
