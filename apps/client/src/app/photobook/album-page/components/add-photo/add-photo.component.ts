import { HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {
  AlbumRoI,
  PhotoRoI,
  SpriteIconEnum,
  UserProfileRoI,
} from '@photobook/data';
import { DialogRef, DIALOG_DATA } from '@photobook/ui';
import { from, fromEvent, pipe, Subscription } from 'rxjs';
import { filter, map, mergeMap, scan, tap } from 'rxjs/operators';
import { PhotobookService } from '../../../photobook.service';
import {
  bytesToSize,
  checkFileSize,
  checkFileTypes,
} from '../../../../shared/utils/utils';

const IMAGE_TYPES = ['image/png', 'image/jpeg'];

export type addPhotoDataInType = {
  authUserProfile: UserProfileRoI;
  album: AlbumRoI;
};

export type addPhotoDataOutType = PhotoRoI[];

export function uploadProgress<T>(cb: (progress: number) => void) {
  return tap(
    (event: HttpEvent<T>) => {
      if (event.type === HttpEventType.UploadProgress) {
        cb(Math.round((100 * event.loaded) / event.total));
      }

      return event;
    },
    (err) => {
      console.log('finished ERROR request');
    }
  );
}

export function toResponseBody<T>() {
  return pipe(
    filter((event: HttpEvent<T>) => event.type === HttpEventType.Response),
    map((res: HttpResponse<T>) => res.body)
  );
}

@Component({
  selector: 'div[photobook-add-photo]',
  templateUrl: './add-photo.component.html',
  styleUrls: ['./add-photo.component.scss'],
  host: { class: 'common-dialog photobook-add-photo' },
})
export class AddPhotoComponent implements OnInit {
  private _fileSize = 7.5;
  cameraIcon = SpriteIconEnum.cam;
  closeIcon = SpriteIconEnum.close;

  loadedPreviewImages: Array<{
    file: string;
    progress: number;
    maxFileSize: boolean;
    size: string;
    type: string;
    allowedType: boolean;
  }> = [];
  loadedImages: File[] = [];
  images$: Subscription;
  form: FormGroup;
  pending: boolean = false;

  constructor(
    private readonly _photoBookService: PhotobookService,
    private readonly dialogRef: DialogRef<AddPhotoComponent>,
    @Inject(DIALOG_DATA) private data: addPhotoDataInType
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup(
      {
        files: new FormControl(null, [
          checkFileSize(this._fileSize),
          checkFileTypes(['image/png', 'image/jpeg']),
        ]),
      },
      { updateOn: 'change' }
    );
  }

  ngOnDestroy(): void {
    this.images$ && this.images$.unsubscribe();
  }

  submitHandler() {
    if (this.loadedImages.length) {
      this.pending = true;

      this.images$ = from(this.loadedImages)
        .pipe(
          mergeMap((img, i) => {
            const data = new FormData();
            data.append('photo', img);

            return this._photoBookService
              .createPhoto<FormData, PhotoRoI>(this.data.album.id, data)
              .pipe(
                uploadProgress((p) => {
                  this.loadedPreviewImages[i].progress = p;
                }),
                toResponseBody()
              );
          }),
          scan((acc: PhotoRoI[], curr: PhotoRoI) => [...acc, curr], []),
          filter((imgs) => imgs.length === this.loadedImages.length)
        )
        .subscribe((data): void => {
          this.loadedImages.length = 0;
          this.loadedPreviewImages.length = 0;
          this.pending = false;
          this.dialogRef.close(data);
        });
    }
  }

  onFilesDrop($event) {
    let files: File[];

    if ($event instanceof FileList) {
      files = Array.from($event as FileList);
    } else if ($event.target && $event.target.files instanceof FileList) {
      files = Array.from($event.target.files as FileList);
    }

    if (files && files.length) {
      this.pending = true;

      from(files)
        .pipe(
          mergeMap((file) => {
            this.loadedImages.push(file);
            const index = this.loadedImages.indexOf(file);
            const reader = new FileReader();
            reader.readAsDataURL(file);

            return fromEvent(reader, 'load').pipe(
              map((e) => {
                if (typeof reader.result === 'string') {
                  this.loadedPreviewImages.splice(index, 0, {
                    file: reader.result,
                    progress: 0,
                    maxFileSize: file.size > this._fileSize * 1000000,
                    size: bytesToSize(file.size),
                    type: `*.${
                      file.name.split('.')[file.name.split('.').length - 1]
                    }`,
                    allowedType: !IMAGE_TYPES.includes(file.type),
                  });
                }

                return reader.result;
              })
            );
          }),
          scan((acc, curr) => [...acc, curr], []),
          filter((imgs) => imgs.length === files.length)
        )
        .subscribe((data) => {
          this.pending = false;
          this.form.get('files').setValue(null);
        });
    }
  }

  get fileMaxSize(): number {
    return this._fileSize;
  }

  get invalidateImages(): boolean {
    return !!this.loadedPreviewImages.filter((image) => image.maxFileSize)
      .length;
  }

  get invalidateImagesTypes(): boolean {
    return !!this.loadedImages.filter(
      (image) => !IMAGE_TYPES.includes(image.type)
    ).length;
  }

  removeImage(i: number) {
    this.loadedImages.splice(i, 1);
    this.loadedPreviewImages.splice(i, 1);
  }
}
