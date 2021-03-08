import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SubSink } from 'subsink';

import {
  ActionEnum,
  AlbumRoI,
  PhotoRoI,
  SpriteIconEnum,
  UserProfileRoI,
} from '@photobook/data';
import { Dialog } from '@photobook/ui';

import { AuthService } from '../../auth/auth.service';
import { PhotobookService } from '../photobook.service';

import { openPhotoInDataType, PhotoViewComponent } from '../../shared/components/photo-view/photo-view.component';
import { AddPhotoComponent, addPhotoDataInType, addPhotoDataOutType } from './components/add-photo/add-photo.component';
import { fadeAnimations } from '../../shared/utils/animations';
import {
  EditPhotoComponent,
  editPhotoInDataType,
  editPhotoOutDataType,
  deletePhotoOutDataType
} from './components/edit-photo/edit-photo.component';

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

  isEdit: boolean;
  pending: boolean;
  pendingLoadAlbum = true;

  constructor(
    private readonly _authService: AuthService,
    private readonly _photoService: PhotobookService,
    private readonly dialog: Dialog,
    private readonly _route: ActivatedRoute,
    // private readonly router: Router,
    // private readonly _changeDetectionRef: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.subs.sink = this._authService.authUserProfile().subscribe((authUserProfile) => {
      if(authUserProfile) {
        this.authUserProfile = authUserProfile;
        // this.getUserProfile();
      }
    })
    this.getUserProfile();
    this.loadAlbum();
  }

  get isAuth(): boolean {
    return this.currentUserProfile?.id === this.authUserProfile?.id;
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  getUserProfile(): void {
    this.pending = true;
    const userProfileId = this._route.snapshot.paramMap.get('user_profile_id');

    this.subs.sink = this._authService.getUserProfile(+userProfileId).subscribe(
      (profile) => {
        this.currentUserProfile = profile;
        this.pending = false;
      },
      (error) => {
        // TODO: error handling
        console.log(error);
        this.pending = false;
      }
    );
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
      autoFocus: false,
      scrolledOverlayPosition: 'center',
      dialogContainerClass: ['add-photo-container']
    });

    dialogRef.afterClosed().subscribe((data: addPhotoDataOutType) => {
      if(data) {
        data.forEach(photo => this.photos.push(photo));
      }
    });
  }

  openPhotoDialog({photo, userProfile}): void {
    const data: openPhotoInDataType = {
      photo,
      authUserProfile: this.authUserProfile,
      photoUserProfile: userProfile
    };

    const dialogRef = this.dialog.open(PhotoViewComponent, {
      data,
      isScrolled: true,
      autoFocus: false,
      scrolledOverlayPosition: 'top',
      dialogContainerClass: ['photo-view-container']
    });
  }

  openEditPhotoDilaog(photo: PhotoRoI): void {
    const data: editPhotoInDataType = {
      photo,
      authUserProfile: this.authUserProfile
    }
    const dialogRef = this.dialog.open(EditPhotoComponent, {
      data,
      isScrolled: true,
      autoFocus: false,
      scrolledOverlayPosition: 'center',
      dialogContainerClass: ['photo-view-container']
    });

    dialogRef.afterClosed().subscribe((data: editPhotoOutDataType | deletePhotoOutDataType) => {
      if(data.action === ActionEnum.update) {
        if(data.photo) {
          const index = this.photos.findIndex(photo => photo.id === data.photo.id);
          this.photos = [ ...this.photos.slice(0, index), data.photo, ...this.photos.slice(index + 1)];
        }
      } else if(data.action === ActionEnum.delete) {
        const index = this.photos.findIndex(photo => photo.id === data.photo_id);
        this.photos.splice(index, 1);
      }
    });
  }

  editHandler(isEdit: boolean) {
    this.isEdit = isEdit;
  }
}
