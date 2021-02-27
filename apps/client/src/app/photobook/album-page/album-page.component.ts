import { transition, trigger, useAnimation } from '@angular/animations';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { fadeIn } from 'ng-animate';
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

@Component({
  selector: 'photobook-album-page',
  templateUrl: './album-page.component.html',
  styleUrls: ['./album-page.component.scss'],
  animations: [
    trigger('fade', [
      transition(
        'void => *',
        useAnimation(fadeIn, { params: { timing: 0.3 } })
      ),
    ]),
  ],
})
export class AlbumPageComponent implements OnInit {
  subs = new SubSink();

  authUserProfile: UserProfileRoI;
  currentUserProfile: UserProfileRoI;
  album: AlbumRoI;
  photos: PhotoRoI[] = [];
  addIcon: SpriteIconEnum = SpriteIconEnum.add;

  isAuthUser: boolean;
  pending: boolean;
  pendingLoadAlbum: boolean = true;
  isEdit: boolean;

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

  // loadUser(): void {
  //   const authUserId = Number(this._authService.getPayload().id);
  //   this.pendingLoadUser = true;
  //   this.route.paramMap.subscribe((params) => {
  //       if(params.has('id')) {
  //         const userId = Number(params.get('id'));
  //         this.isAuthUser = authUserId === userId;

  //         this.subs.sink = this._photoService.getUser(userId).subscribe((user) => {
  //           this.user = user;
  //           // this.profile = user.user_profile;
  //           this.pendingLoadUser = false;

  //           if(params.has('album_id')) {
  //             const albumId = Number(params.get('album_id'));
  //             this.loadAlbum(userId, albumId);
  //           }
  //         });

  //       }
  //     },
  //     (error) => {
  //       this.pendingLoadUser = false;
  //       // TODO: error handling
  //       console.log(error);
  //     }
  //   )
  // }

  loadAlbum() {
    const userProfileId = +this._route.snapshot.paramMap.get('user_profile_id');
    const albumId = +this._route.snapshot.paramMap.get('album_id');
    this.pendingLoadAlbum = true;
    this.subs.sink = this._photoService.getUserAlbumById(userProfileId, albumId).subscribe(
      (album) => {
        console.log(album);
        this.album = album;
        // this.photos = album.photos;
        this.pendingLoadAlbum = false;
      },
      (error) => {
        // TODO: error handling
        this.pendingLoadAlbum = false;
      }
    );
  }

  openPhotoDialog(photo: PhotoRoI): void {
    const data: openPhotoInDataType = {
      photo, authUserProfile: this.authUserProfile
    };

    this.dialog.open(PhotoViewComponent, {
      data,
      isScrolled: true,
      scrolledOverlayPosition: 'top'
      // dialogContentClass: 'photo-view-content',
    });
  }

  editHandler(isEdit: boolean) {
    this.isEdit = !this.isEdit;
  }

  private _getRouteParamsMap() {
    if(this._route.firstChild) {
      return this._route.firstChild.paramMap;
    }

    return this._route.paramMap;
  }
}
