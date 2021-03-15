import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SubSink } from 'subsink';

import {
  ActionEnum,
  AlbumRoI,
  SpriteIconEnum,
  UserProfileRoI,
} from '@photobook/data';
import { Dialog } from '@photobook/ui';

import { AuthService } from '../../auth/auth.service';
import { PhotobookService } from '../photobook.service';

import {
  AddAlbumComponent,
  addAlbumInDataType,
  addAlbumOutDataType,
} from './components/add-album/add-album.component';

import { fadeAnimations } from '../../shared/utils/animations';

@Component({
  selector: 'photobook-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss'],
  animations: [fadeAnimations.fadeIn()],
})
export class UserPageComponent implements OnInit {
  subs = new SubSink();

  authUserProfile: UserProfileRoI;
  currentUserProfile: UserProfileRoI;

  isEdit = false;

  pending = true;
  pendingAlbums = true;

  albums: AlbumRoI[];
  addIcon: SpriteIconEnum = SpriteIconEnum.add;

  constructor(
    private readonly _authService: AuthService,
    private readonly _photoService: PhotobookService,
    private readonly _dialog: Dialog,
    private readonly _route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.subs.sink = this._authService
      .authUserProfile()
      .subscribe((authUserProfile) => {
        if (authUserProfile) {
          this.authUserProfile = authUserProfile;
        }
      });

    this.getUserProfile();
    this.getAlbums();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  get user(): UserProfileRoI {
    if (this.authUserProfile.id === this.currentUserProfile.id) {
      return this.authUserProfile;
    }

    return this.currentUserProfile;
  }

  getUserProfile(): void {
    this.subs.sink = this._route.paramMap.subscribe((params) => {
      const userProfileId = params.get('user_profile_id');

      this.pending = true;
      this.subs.sink = this._authService
        .getUserProfile(userProfileId)
        .subscribe({
          next: (currentUserProfile) => {
            this.currentUserProfile = currentUserProfile;
            this.pending = false;
          },
          error: (error) => {
            // TODO: error handling
            console.log(error);
            this.pending = false;
          },
        });
    });
  }

  editHandler(isEdit: boolean) {
    this.isEdit = isEdit;
  }

  getAlbums() {
    this.subs.sink = this._route.paramMap.subscribe((params) => {
      const userProfileId = params.get('user_profile_id');

      this.pendingAlbums = true;
      this.subs.sink = this._photoService
        .getAllAlbumsByUserId(userProfileId)
        .subscribe(
          (albums) => {
            this.albums = albums.sort(
              (a, b) =>
                Number(new Date(a.created_at)) - Number(new Date(b.created_at))
            );
          },
          (error) => {
            // TODO: error handling
            console.log(error);
            this.pendingAlbums = false;
          },
          () => {
            this.pendingAlbums = false;
          }
        );
    });
  }

  addAlbum(album?: AlbumRoI) {
    const addAlbumData: addAlbumInDataType = {
      album,
      authUserProfile: this.authUserProfile,
      action: album ? ActionEnum.update : ActionEnum.create,
    };
    const dialogRef = this._dialog.open(AddAlbumComponent, {
      data: addAlbumData,
      isScrolled: true,
      scrolledOverlayPosition: 'top',
      dialogContainerClass: ['add-album-container'],
    });

    dialogRef.afterClosed().subscribe((data: addAlbumOutDataType) => {
      if (data && data.action === ActionEnum.create) {
        this.albums.push(data.album);
      } else if (data && data.action === ActionEnum.update) {
        const index = this.albums.findIndex(
          (album) => album.id === data.album.id
        );
        this.albums = [
          ...this.albums.slice(0, index),
          data.album,
          ...this.albums.slice(index + 1),
        ];
      } else if (data && data.action === ActionEnum.delete) {
        const index = this.albums.findIndex(
          (album) => album.id === data.album_id
        );
        this.albums.splice(index, 1);
      }
    });
  }
}
