import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SubSink } from 'subsink';

import {
  AlbumRoI,
  PhotoRoI,
  SpriteIconEnum,
  UserProfileRoI,
} from '@photobook/data';
import { Dialog } from '@photobook/ui';

import { AuthService } from '../../auth/auth.service';
import { PhotobookService } from '../photobook.service';

import { openPhotoInDataType, PhotoViewComponent } from '../../shared/components/photo-view/photo-view.component';
import { AddPhotoComponent, addPhotoDataInType, addPhotoDataOutType } from '../../shared/components/add-photo/add-photo.component';
import { fadeAnimations } from '../../shared/utils/animations';

@Component({
  selector: 'photobook-album-page',
  templateUrl: './album-page.component.html',
  styleUrls: ['./album-page.component.scss'],
  animations: [ fadeAnimations.fadeIn() ],
})
export class AlbumPageComponent implements OnInit {
  subs = new SubSink();

  authUserProfile: UserProfileRoI;
  currentUserProfile: UserProfileRoI;
  album: AlbumRoI;
  photos: PhotoRoI[] = [];
  addIcon: SpriteIconEnum = SpriteIconEnum.add;

  isAuthUser: boolean;
  isEdit: boolean;
  pending: boolean;
  pendingLoadAlbum: boolean = true;

  constructor(
    private readonly _authService: AuthService,
    private readonly _photoService: PhotobookService,
    private readonly dialog: Dialog,
    // private readonly router: Router,
    private readonly _route: ActivatedRoute,
    private readonly _changeDetectionRef: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.subs.add(
      this._authService.authUserProfile().subscribe((authUserProfile) => {
        if(authUserProfile) {
          this.authUserProfile = authUserProfile;
          this.getUserProfile();
        }
      }),

      this._authService.currentUserProfile().subscribe((currentUserProfile): void => {
        if(currentUserProfile) {
          this.currentUserProfile = currentUserProfile;
          this.isAuthUser = currentUserProfile.id === this.authUserProfile.id;
          this.pending = false;
          this.loadAlbum();
          this._changeDetectionRef.markForCheck();
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  getUserProfile(): void {
    this.pending = true;
    const userProfileId = this._route.snapshot.paramMap.get('user_profile_id');

    if(userProfileId && +userProfileId !== this.authUserProfile.id) {
      this.subs.sink = this._authService.getUserProfile(+userProfileId).subscribe(
        (profile) => this._authService.setCurrentUserProfile(profile),
        (error) => {
          // TODO: error handling
          console.log(error);
        }
      );
    } else {
      this._authService.setCurrentUserProfile(this.authUserProfile);
    }
  }

  loadAlbum() {
    const userProfileId = +this._route.snapshot.paramMap.get('user_profile_id');
    const albumId = +this._route.snapshot.paramMap.get('album_id');
    this.pendingLoadAlbum = true;
    this.subs.sink = this._photoService.getUserAlbumById(userProfileId, albumId).subscribe(
      (album) => {
        this.album = album;
        this.photos = album.photos;
        this.pendingLoadAlbum = false;
      },
      (error) => {
        // TODO: error handling
        this.pendingLoadAlbum = false;
      }
    );
  }

  addPhotoHandler() {
    const data: addPhotoDataInType = {
      authUserProfile: this.authUserProfile,
      album: this.album
    }

    const dialogRef = this.dialog.open(AddPhotoComponent, {
      data,
      isScrolled: true,
      scrolledOverlayPosition: 'center',
      dialogContainerClass: ['add-photo-container']
    });

    dialogRef.afterClosed().subscribe((data: addPhotoDataOutType) => {
      this.photos = [...this.photos, ...data]
    });
  }

  openPhotoDialog(photo: PhotoRoI): void {
    const data: openPhotoInDataType = {
      photo, authUserProfile: this.authUserProfile
    };

    const dialogRef = this.dialog.open(PhotoViewComponent, {
      data,
      isScrolled: true,
      scrolledOverlayPosition: 'top',
      dialogContainerClass: ['photo-view-container']
    });
  }

  editHandler(isEdit: boolean) {
    this.isEdit = isEdit;
  }

  private _getRouteParamsMap() {
    if(this._route.firstChild) {
      return this._route.firstChild.paramMap;
    }

    return this._route.paramMap;
  }
}
