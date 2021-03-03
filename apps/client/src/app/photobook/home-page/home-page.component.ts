import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SubSink } from 'subsink';

import {
  PhotoRoI,
  SpriteIconEnum,
  UserProfileRoI
} from '@photobook/data';
import { ActivatedRoute } from '@angular/router';
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
  isAuthUser: boolean = true;
  isAlbums: boolean;
  subs = new SubSink();
  authUserProfile: UserProfileRoI;
  currentUserProfile: UserProfileRoI;
  addIcon: SpriteIconEnum = SpriteIconEnum.add;

  isEdit = false;
  pending: boolean = true;
  pendingLoadPhotos = false;
  photos: PhotoRoI[] = [];

  private _take: number = 9;
  private _skip: number = 0;
  loadMore = true;

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
          this.currentUserProfile = authUserProfile;
          this.pending = false;
          this.getPhotos();
        }
      })
    )
  }

  get isAuth(): boolean {
    return this.currentUserProfile.id === this.authUserProfile.id;
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
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
        this._changeDetectionRef.markForCheck();
      }
    );
  }

  openPhotoDialog(photo: PhotoRoI): void {
    const openPhotoData: openPhotoInDataType = {
      authUserProfile: this.authUserProfile,
      photo
    }

    this._dialog.open(PhotoViewComponent, {
      data: openPhotoData,
      isScrolled: true,
      autoFocus: false,
      scrolledOverlayPosition: 'top',
      dialogContainerClass: 'photo-view-content'
    });
  }

  loadMoreHandler() {
    this.getPhotos();
  }
}
