import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { SubSink } from 'subsink';

import { ActionEnum, AlbumRoI, SpriteIconEnum, UserProfileRoI } from '@photobook/data';
import { Dialog } from '@photobook/ui';

import { AuthService } from '../../../../auth/auth.service';
import { PhotobookService } from '../../../photobook.service';

import {
  AddAlbumComponent,
  addAlbumOutDataType,
  addAlbumInDataType
} from '../add-album/add-album.component';
import { fadeAnimations } from '../../../../shared/utils/animations';

@Component({
  selector: 'photobook-home-page-albums',
  templateUrl: './home-page-albums.component.html',
  styleUrls: ['./home-page-albums.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [ fadeAnimations.fadeIn() ],
})
export class HomePageAlbumsComponent implements OnInit {
  subs = new SubSink();
  authUserProfile: UserProfileRoI;
  currentUserProfile: UserProfileRoI;
  pending = true;
  albums: AlbumRoI[];
  addIcon: SpriteIconEnum = SpriteIconEnum.add;

  constructor(
    private readonly _authService: AuthService,
    private readonly _photoService: PhotobookService,
    private readonly _dialog: Dialog,
    private readonly _changeDetectionRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.subs.add(
      this._authService.authUserProfile().subscribe((authUserProfile) => {
        if(authUserProfile) {
          this.authUserProfile = authUserProfile;
          this._changeDetectionRef.markForCheck();
        }
      }),

      this._authService.currentUserProfile().subscribe((currentUserProfile) => {
        if(currentUserProfile) {
          this.currentUserProfile = currentUserProfile;
          this.getAlbums();
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  getAlbums() {
    this.pending = true;
    this.subs.sink = this._photoService.getAllAlbumsByUserId(this.currentUserProfile.id).subscribe(
      (albums) => {
        this.albums = albums.sort((a, b) => Number(new Date(a.created_at)) - Number(new Date(b.created_at)));
      },
      (error) => {
        // TODO: error handling
        console.log(error);
      },
      () => {
        this.pending = false;
        this._changeDetectionRef.markForCheck();
      }
    )
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
      dialogContainerClass: ['add-album-container']
    });

    dialogRef.afterClosed().subscribe((data: addAlbumOutDataType) => {
      if(data && data.action === ActionEnum.create) {
        this.albums.push(data.album);
      } else if(data && data.action === ActionEnum.update) {
        const index = this.albums.findIndex(album => album.id === data.album.id);
        this.albums = [ ...this.albums.slice(0, index), data.album, ...this.albums.slice(index + 1)]
      } else if(data && data.action === ActionEnum.delete) {
        const index = this.albums.findIndex(album => album.id === data.album_id);
        this.albums.splice(index, 1);
      }
      this._changeDetectionRef.markForCheck();
    })
  }
}
