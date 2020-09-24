import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserCredentialsDto, UserRoDto, AuthCredentialsDto, AuthRoDto } from '@photobook/dto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EntryService {
  api = 'api/auth/signup';
  api2 = 'api/auth/signin';
  constructor(private readonly http: HttpClient) {}

  signup(userCredentials: UserCredentialsDto): Observable<UserRoDto> {
    return this.http.post<UserRoDto>(this.api, userCredentials);
  }

  signin(userCredentials: AuthCredentialsDto): Observable<AuthRoDto> {
    return this.http.post<AuthRoDto>(this.api2, userCredentials);
  }
}
