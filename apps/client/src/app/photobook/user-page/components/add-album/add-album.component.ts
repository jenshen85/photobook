import { transition, trigger, useAnimation } from '@angular/animations';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  AlbumCredentialsI,
  AlbumRoI,
  SpriteIconEnum,
  ActionEnum,
  UserProfileRoI,
} from '@photobook/data';
import { Dialog, DialogRef, DIALOG_DATA } from '@photobook/ui';
import { SubSink } from 'subsink';
import { PhotobookService } from '../../../photobook.service';
import {
  checkFileSize,
  checkFileTypes,
  getBase64,
  toFormData,
} from '../../../../shared/utils/utils';
import { fadeAnimations } from 'apps/client/src/app/shared/utils/animations';
import { ConfirmComponent } from '../../../components/confirm/confirm.component';

export type addAlbumOutDataType = {
  action: ActionEnum;
  album?: AlbumRoI;
  album_id?: number;
};

export type addAlbumInDataType = {
  album?: AlbumRoI;
  authUserProfile: UserProfileRoI;
  action: ActionEnum;
};

@Component({
  selector: 'div[photobook-add-album]',
  templateUrl: './add-album.component.html',
  styleUrls: ['./add-album.component.scss'],
  host: { class: 'common-dialog photobook-add-album' },
  animations: [fadeAnimations.fadeIn()],
})
export class AddAlbumComponent implements OnInit {
  subs = new SubSink();
  actionCreate = ActionEnum.create;
  removeIcon = SpriteIconEnum.delete;
  form: FormGroup;
  album: AlbumRoI;
  authUserProfile: UserProfileRoI;
  action: ActionEnum;
  imgPreview: string;
  pending: boolean;

  constructor(
    private photobookService: PhotobookService,
    private readonly dialogRef: DialogRef<AddAlbumComponent>,
    private readonly _dialog: Dialog,
    @Inject(DIALOG_DATA) private data: addAlbumInDataType
  ) {}

  ngOnInit(): void {
    this.album = this.data.album;
    this.authUserProfile = this.data.authUserProfile;
    this.imgPreview = this.album && this.album.preview;
    this.action = this.data.action;

    this.form = new FormGroup(
      {
        title: new FormControl(this.album ? this.album.title : null, [
          Validators.required,
          Validators.maxLength(20),
        ]),
        description: new FormControl(
          this.album ? this.album.description : null,
          [Validators.maxLength(200)]
        ),
        preview: new FormControl(null, [
          checkFileSize(7.5),
          checkFileTypes(['image/png', 'image/jpeg']),
        ]),
      },
      { updateOn: 'change' }
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  submitHandler() {
    const data: FormData = toFormData<AlbumCredentialsI>(this.form.value);
    if (this.form.valid && this.action === ActionEnum.update) {
      this.updateAlbum(data);
    } else if (this.form.valid && this.action === ActionEnum.create) {
      this.createAlbum(data);
    } else {
      this.form.markAllAsTouched();
    }
  }

  setImagePreview($event) {
    getBase64($event.target.files[0]).then(
      (img) => typeof img === 'string' && (this.imgPreview = img)
    );
  }

  createAlbum(data: FormData): void {
    this.pending = true;
    this.subs.sink = this.photobookService.createAlbum(data).subscribe(
      (album) => {
        const data: addAlbumOutDataType = {
          action: ActionEnum.create,
          album,
        };
        this.pending = false;
        this.dialogRef.close(data);
      },
      (error) => {
        this.pending = false;
        console.log(error);
      }
    );
  }

  updateAlbum(data: FormData): void {
    this.pending = true;
    this.subs.sink = this.photobookService
      .updateAlbum(this.album.id, data)
      .subscribe(
        (album) => {
          const data: addAlbumOutDataType = {
            action: ActionEnum.update,
            album,
          };
          this.pending = false;
          this.dialogRef.close(data);
        },
        (error) => {
          this.pending = false;
          console.log(error);
        }
      );
  }

  removeAlbum(album_id: number): void {
    const confirm = this._dialog.open(ConfirmComponent, {
      data: {
        title: 'Удалить альбом',
        message: `Вы действительно хотите удалить альбом "${this.album.title}" и его фото (${this.album.photos.length})?`,
      },
      isScrolled: true,
      autoFocus: false,
      scrolledOverlayPosition: 'center',
      dialogContainerClass: ['confirm-container'],
    });

    confirm.afterClosed().subscribe((cond) => {
      if (cond) {
        this.subs.sink = this.photobookService
          .removeAlbum(album_id)
          .subscribe(() => {
            const data: addAlbumOutDataType = {
              action: ActionEnum.delete,
              album_id,
            };
            this.dialogRef.close(data);
          });
      }
    });
  }
}
