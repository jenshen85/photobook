import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SubSink } from 'subsink';

import {
  PhotoRoI,
  SpriteIconEnum,
  UserProfileRoI
} from '@photobook/data';
import { fadeAnimations } from '../../shared/utils/animations';
import { AuthService } from '../../auth/auth.service';
import { PhotobookService } from '../photobook.service';
import { openPhotoInDataType, PhotoViewComponent } from '../../shared/components/photo-view/photo-view.component';
import { Dialog } from '@photobook/ui';

@Component({
  selector: 'photobook-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  animations: [ fadeAnimations.fadeIn() ],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePageComponent implements OnInit {
  subs = new SubSink();

  isEdit = false;

  authUserProfile: UserProfileRoI;
  currentUserProfile: UserProfileRoI;

  addIcon: SpriteIconEnum = SpriteIconEnum.add;

  pending = true;
  pendingLoadPhotos = false;

  photos: PhotoRoI[] = [];

  private _take = 9;
  private _skip = 0;
  loadMore = true;

  constructor(
    private readonly _authService: AuthService,
    private readonly _photoService: PhotobookService,
    private readonly _dialog: Dialog,
    private readonly _changeDetectionRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.subs.sink = this._authService.authUserProfile().subscribe((authUserProfile) => {
      if(authUserProfile) {
        this.authUserProfile = authUserProfile;
        this.currentUserProfile = authUserProfile;
        this.pending = false;
        this._changeDetectionRef.markForCheck();
      }
    });

    this.getPhotos();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  get user(): UserProfileRoI {
    if(this.authUserProfile.id === this.currentUserProfile.id) {
      return this.authUserProfile;
    }

    return this.currentUserProfile;
  }

  editHandler(isEdit: boolean) {
    this.isEdit = isEdit;
  }

  getPhotos() {
    this.pendingLoadPhotos = true;
    this.subs.sink = this._photoService.getPhotos({
      take: this._take.toString(),
      skip: this._skip.toString()
    }).subscribe(
      (photos) => {
        if(photos.length) {
          photos.forEach(photo => this.photos.push(photo));
          this._skip = this._skip + this._take;

          if(photos.length < this._take) {
            this.loadMore = false;
          }
        } else {
          this.loadMore = false;
        }
      },
      (error) => {
        // TODO: error handling
        console.log(error);
      },
      () => {
        this.pendingLoadPhotos = false;
      }
    );
  }

  openPhotoDialog({ photo, userProfile }): void {
    const openPhotoData: openPhotoInDataType = {
      authUserProfile: this.authUserProfile,
      photoUserProfile: userProfile,
      photo
    };

    this._dialog.open(PhotoViewComponent, {
      data: openPhotoData,
      isScrolled: true,
      autoFocus: false,
      scrolledOverlayPosition: 'top',
      dialogContainerClass: 'photo-view-content'
    });
  }
}
