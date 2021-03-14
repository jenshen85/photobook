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
import { userName } from '../../shared/utils/utils';

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
  pendingLoadPhotos = true;

  constructor(
    private readonly _authService: AuthService,
    private readonly _photoService: PhotobookService,
    private readonly dialog: Dialog,
    private readonly _route: ActivatedRoute,
    private readonly _changeDetectionRef: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    const userProfileId = +this._route.snapshot.paramMap.get('user_profile_id');
    const albumId = +this._route.snapshot.paramMap.get('album_id');

    this.subs.sink = this._authService.authUserProfile().subscribe((authUserProfile) => {
      if(authUserProfile) {
        this.authUserProfile = authUserProfile;
      }
    })

    this.getUserProfile(userProfileId);
    this.loadAlbum(userProfileId, albumId);
    this.loadPhotos(albumId);
  }

  get isAuth(): boolean {
    return this.currentUserProfile?.id === this.authUserProfile?.id;
  }

  get photosLength(): number {
    return this.photos.length;
  }

  get commentsLength(): number {
    return this.photos.map((photo) => photo.comments)
      .reduce((acc, comment) => acc + comment.length, 0);
  }

  get likesLength(): number {
    return this.photos.map((photo) => photo.likes)
      .reduce((acc, like) => acc + like.length, 0);
  }

  get getName() {
    const {first_name, last_name } = this.currentUserProfile;
    return userName({ first_name, last_name });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  getUserProfile(userProfileId: number): void {
    this.pending = true;
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

  loadAlbum(userProfileId: number, albumId: number) {
    this.pendingLoadAlbum = true;
    this.subs.sink = this._photoService.getUserAlbumById(userProfileId, albumId).subscribe(
      (album) => {
        this.album = album;
        this.pendingLoadAlbum = false;
      },
      (error) => {
        // TODO: error handling
        this.pendingLoadAlbum = false;
      }
    );
  }

  loadPhotos(albumId: number) {
    this.pendingLoadPhotos = true;
    this.subs.sink = this._photoService.getAllAlbumPhotos(albumId).subscribe(
      (photos) => {
        this.photos = photos.sort((a, b) => a.id < b.id ? 1 : -1);
        this.pendingLoadPhotos = false;
      },
      (error) => {
        // TODO: error handling
        this.pendingLoadPhotos = false;
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
        const sortData = data.sort((a, b) => a.id > b.id ? 1 : -1);
        sortData.forEach(photo => this.photos.unshift(photo));
      }
    });
  }

  openPhotoDialog({photo, userProfile}: {photo: PhotoRoI, userProfile: UserProfileRoI}): void {
    const data: openPhotoInDataType = {
      photo,
      authUserProfile: this.authUserProfile,
      photoUserProfile: userProfile,
      album_id: this.album.id
    };

    const dialogRef = this.dialog.open(PhotoViewComponent, {
      data,
      isScrolled: true,
      autoFocus: false,
      scrolledOverlayPosition: 'top',
      dialogContainerClass: ['photo-view-container']
    });

    const updCommentsSubs = dialogRef.componentInstance.updateComments.subscribe((data) => {
      const photo = this.photos.find((photo) => photo.id === data.comment.photo_id);

      if(photo && data.action === ActionEnum.create) {
        photo.comments.push(data.comment);
      } else if(photo && data.action === ActionEnum.update) {
        const i = photo.comments.findIndex(comment => comment.id === data.comment.id);
        photo.comments.splice(i, 1, data.comment);
      } else if(photo && data.action === ActionEnum.delete) {
        const i = photo.comments.findIndex(comment => comment.id === data.comment_id);
        photo.comments.splice(i, 1);
      }
    });

    const updLikesSubs = dialogRef.componentInstance.updateLikes.subscribe((data) => {
      const photo = this.photos.find((photo) => photo.id === data.photo_id);
      if(photo && data.action === ActionEnum.update) {
        photo.likes.push(data.like);
      } else if(photo && data.action === ActionEnum.delete) {
        const i = photo.likes.findIndex(like => like.id === data.like.id);
        photo.likes.splice(i, 1);
      }
    });

    dialogRef.afterClosed().subscribe(() => {
      updCommentsSubs && updCommentsSubs.unsubscribe();
      updLikesSubs && updLikesSubs.unsubscribe();
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
