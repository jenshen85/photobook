import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Input} from '@angular/core';
import { PhotoRoI, UserRoI } from '@photobook/data';
import { SubSink } from 'subsink';
import { Dialog } from '../../shared/components/dialog/dialog';
import { PhotoViewComponent } from '../../shared/components/photo-view/photo-view.component';
import { fadeAnimations } from '../../shared/utils/animations';
import { PhotobookService } from '../photobook.service';

@Component({
  selector: 'photobook-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [ fadeAnimations.fadeIn() ],
})
export class PhotosComponent implements OnInit {
  subs = new SubSink();
  @Input() authUser: UserRoI;
  @Input() user: UserRoI;
  pendingLoadPhotos = false;
  photos: PhotoRoI[] = [];

  constructor(
    private readonly _photoService: PhotobookService,
    private readonly _dialog: Dialog,
    private readonly _changeDetectionRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
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
    this._dialog.open(PhotoViewComponent, {
      data: { photo, user: this.user },
      isScrolled: true,
      scrolledOverlayPosition: 'top',
      dialogContainerClass: 'photo-view-content'
    });
  }

  loadMoreHandler() {}
}
