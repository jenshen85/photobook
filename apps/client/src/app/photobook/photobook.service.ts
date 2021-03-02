import { HttpClient, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlbumRoI, PhotoRoI } from '@photobook/data';
import { Observable } from 'rxjs';

import { PATHS } from '../shared/utils/api';

@Injectable()
export class PhotobookService {
  constructor(
    private readonly _http: HttpClient
  ) {}

  getAllAlbums(): Observable<AlbumRoI[]> {
    return this._http.get<AlbumRoI[]>(PATHS.album);
  }

  getUserAlbumById(user_profile_id: number | string, album_id: number | string): Observable<AlbumRoI> {
    return this._http.get<AlbumRoI>(`${PATHS.album}/${user_profile_id}/${album_id}`);
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

  createPhoto<T, D>(album_id: number, data: T): Observable<HttpEvent<D>> {
    return this._http.post<D>(`${PATHS.photo}/${album_id}`, data, {
      reportProgress: true,
      observe: 'events',
    });
  }

  getPhotos({ take='9', skip='0' }: { take?: string, skip?: string }): Observable<PhotoRoI[]> {
    return this._http.get<PhotoRoI[]>(PATHS.photo, {
      params: {
        take, skip
      }
    });
  }

  updatePhoto<T, D>(album_id: number, photo_id: number, data: T): Observable<D> {
    return this._http.patch<D>(`${PATHS.photo}/${album_id}/${photo_id}`, data);
  }

  removePhoto(album_id: number, photo_id: number): Observable<void> {
    return this._http.delete<void>(`${PATHS.photo}/${album_id}/${photo_id}`)
  }
}
