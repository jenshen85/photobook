import { Component, OnInit, ChangeDetectionStrategy, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActionEnum, PhotoRoI, SpriteIconEnum, UserProfileRoI } from '@photobook/data';
import { PhotoCredentialsDto } from '@photobook/dto';
import { DialogRef, DIALOG_DATA } from '@photobook/ui';
import { SubSink } from 'subsink';
import { PhotobookService } from '../../../photobook.service';

export type editPhotoInDataType = {
  photo: PhotoRoI,
  authUserProfile: UserProfileRoI
}

export type editPhotoOutDataType = {
  photo: PhotoRoI,
  action: ActionEnum.update
}

export type deletePhotoOutDataType = {
  photo_id: number,
  action: ActionEnum.delete
}

@Component({
  selector: 'photobook-edit-photo',
  templateUrl: './edit-photo.component.html',
  styleUrls: ['./edit-photo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditPhotoComponent implements OnInit {
  subs = new SubSink();
  removeIcon = SpriteIconEnum.delete;
  form: FormGroup;
  authUserProfile: UserProfileRoI;
  photo: PhotoRoI;
  pending: boolean;

  constructor(
    private readonly _photoBookService: PhotobookService,
    private readonly dialogRef: DialogRef<EditPhotoComponent>,
    @Inject(DIALOG_DATA) private data: editPhotoInDataType
  ) { }

  ngOnInit(): void {
    this.photo = this.data.photo;
    this.authUserProfile = this.data.authUserProfile;

    this.form = new FormGroup(
      {
        title: new FormControl(this.photo ? this.photo.title : null, [
          Validators.maxLength(20),
        ]),
        description: new FormControl(
          this.photo ? this.photo.description : null,
          [Validators.maxLength(200)]
        )
      },
      { updateOn: 'change' }
    );
  }

  submitHandler() {
    if (this.form.valid) {
      const data: PhotoCredentialsDto = this.form.value;
      this.pending = true;
      this.subs.sink = this._photoBookService.updatePhoto<PhotoCredentialsDto, PhotoRoI>(this.photo.album_id, this.photo.id, data)
        .subscribe(
          (photo) => {
            this.pending = false;
            const data: editPhotoOutDataType = {
              photo,
              action: ActionEnum.update
            };
            this.dialogRef.close(data);
          },
          (error) => {
            this.pending = false;
            console.log(error);
          }
        );
    }
  }

  removeAlbum(album_id: number, photo_id: number): void {
    this.subs.sink = this._photoBookService.removePhoto(album_id, photo_id).subscribe(
      () => {
        const data: deletePhotoOutDataType = {
          photo_id,
          action: ActionEnum.delete
        }
        this.dialogRef.close(data);
      }
    );
  }
}
