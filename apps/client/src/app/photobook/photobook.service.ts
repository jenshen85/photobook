import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlbumRoI, PhotoRoI, UserProfileRoI, UserRoI } from '@photobook/data';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { PATHS } from '../shared/utils/api';

@Injectable()
export class PhotobookService {
  private _authUserSubj: Subject<UserRoI> = new Subject();
  private $authUser: Observable<UserRoI> = this._authUserSubj.asObservable();

  private _currentUserSubj: Subject<UserRoI> = new Subject();
  private $currentUser: Observable<UserRoI> = this._currentUserSubj.asObservable();

  private _authUserprofileSubj: Subject<UserProfileRoI> = new Subject();
  private $authUserprofile: Observable<UserProfileRoI> = this._authUserprofileSubj.asObservable();

  constructor(
    private readonly _http: HttpClient
  ) {}

  getMe(): Observable<UserRoI> {
    return this._http.get<UserRoI>(PATHS.me).pipe(
      map((data) => {
        this._authUserSubj.next(data);
        this._authUserprofileSubj.next(data.user_profile);
        return data;
      })
    );
  }

  public getAuthUser(): Observable<UserRoI> {
    return this.$authUser;
  }

  public getCurrentUser(): Observable<UserRoI> {
    return this.$currentUser;
  }

  public setCurrentUser(user: UserRoI) {
    this._currentUserSubj.next(user);
  }

  get getAuthUserProfile(): Observable<UserProfileRoI> {
    return this.$authUserprofile;
  }

  getUser(id: number | string): Observable<UserRoI> {
    return this._http.get<UserRoI>(PATHS.getUserById(id)).pipe(
      map((data) => {
        this._currentUserSubj.next(data);
        return data;
      })
    );
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
