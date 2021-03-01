import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { PhotoRoI, UserProfileRoI } from '@photobook/data';
import { SubSink } from 'subsink';
import { AuthService } from '../../../../auth/auth.service';
import { Dialog } from '@photobook/ui';
import { openPhotoInDataType, PhotoViewComponent } from '../../../../shared/components/photo-view/photo-view.component';
import { fadeAnimations } from '../../../../shared/utils/animations';
import { PhotobookService } from '../../../photobook.service';

@Component({
  selector: 'photobook-home-page-photos',
  templateUrl: './home-page-photos.component.html',
  styleUrls: ['./home-page-photos.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [ fadeAnimations.fadeIn() ],
})
export class HomePagePhotosComponent implements OnInit {
  subs = new SubSink();
  authUserProfile: UserProfileRoI;
  currentUserProfile: UserProfileRoI;
  pendingLoadPhotos = false;
  photos: PhotoRoI[] = [];

  constructor (
    private readonly _authService: AuthService,
    private readonly _photoService: PhotobookService,
    private readonly _dialog: Dialog,
    private readonly _changeDetectionRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.subs.add(
      this._authService.authUserProfile().subscribe((authUserProfile) => {
        this.authUserProfile = authUserProfile;
      }),
      this._authService.currentUserProfile().subscribe((currentUserProfile) => {
        this.currentUserProfile = currentUserProfile;
      })
    );

    this.getPhotos();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  getPhotos() {
    this.pendingLoadPhotos = true;
    this.subs.sink = this._photoService.getPhotos().subscribe(
      (photos) => this.photos = photos,
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

  loadMoreHandler() {}
}
