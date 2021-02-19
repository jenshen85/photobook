import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// import { Router } from '@angular/router';
import { AlbumRoI, PhotoRoI, UserProfileRoI, UserRoI } from '@photobook/data';
import { Observable } from 'rxjs';

import { PATHS } from '../shared/utils/api';

@Injectable({
  providedIn: 'root',
})
export class PhotobookService {
  constructor(
    private readonly _http: HttpClient,
    // private readonly _router: Router
  ) {}

  getUser(): Observable<UserRoI> {
    return this._http.get<UserRoI>(PATHS.me);
  }

  getUserById(id: number | string): Observable<UserRoI> {
    return this._http.get<UserRoI>(PATHS.getUserById(id));
  }

  updateProfile(data: FormData): Observable<UserProfileRoI> {
    return this._http.patch<UserProfileRoI>(PATHS.updateProfile, data);
  }

  getPhotos(): Observable<PhotoRoI[]> {
    return this._http.get<PhotoRoI[]>(PATHS.getAllPhoto);
  }

  getAllAlbums(): Observable<AlbumRoI[]> {
    return this._http.get<AlbumRoI[]>(PATHS.album);
  }

  getUserAlbumById(user_id: number | string, album_id: number | string): Observable<AlbumRoI> {
    return this._http.get<AlbumRoI>(PATHS.getUserAlbumById(user_id, album_id));
  }

  getAllAlbumsByUserId(user_id: number | string): Observable<AlbumRoI[]> {
    return this._http.get<AlbumRoI[]>(PATHS.getUserAllbums(user_id));
  }

  createAlbum(data: FormData): Observable<AlbumRoI> {
    return this._http.post<AlbumRoI>(PATHS.album, data);
  }

  updateAlbum(album_id: number | string, data: FormData): Observable<AlbumRoI> {
    return this._http.patch<AlbumRoI>(PATHS.updateAlbums(album_id), data);
  }

  removeAlbum(album_id: number | string): Observable<void> {
    return this._http.delete<void>(PATHS.deleteAlbums(album_id))
  }
}
