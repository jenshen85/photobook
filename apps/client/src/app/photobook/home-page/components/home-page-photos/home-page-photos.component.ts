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
  // changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [ fadeAnimations.fadeIn() ],
})
export class HomePagePhotosComponent implements OnInit {
  subs = new SubSink();
  authUserProfile: UserProfileRoI;
  currentUserProfile: UserProfileRoI;
  pendingLoadPhotos = false;
  photos: PhotoRoI[] = [];

  private _take: number = 9;
  private _skip: number = 0;
  loadMore = true;

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
        this._changeDetectionRef.markForCheck();
      }),
      this._authService.currentUserProfile().subscribe((currentUserProfile) => {
        this.currentUserProfile = currentUserProfile;
        this._changeDetectionRef.markForCheck();
      })
    );

    this.getPhotos();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
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
