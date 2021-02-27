import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { SpriteIconEnum } from '@photobook/data';
import { checkFileSize, checkFileTypes, getBase64 } from '../../utils/utils';

@Component({
  selector: 'div[photobook-add-photo]',
  templateUrl: './add-photo.component.html',
  styleUrls: ['./add-photo.component.scss'],
  host: { class: 'common-dialog photobook-add-photo' }
})
export class AddPhotoComponent implements OnInit {
  form: FormGroup;
  cameraIcon = SpriteIconEnum.cam;
  closeIcon = SpriteIconEnum.close;

  previewImages: string[] = [];
  images: File[] = [];

  constructor() { }

  ngOnInit(): void {
    this.form = new FormGroup({
      files: new FormControl(null, [
        checkFileSize(7.5),
        checkFileTypes(['image/png', 'image/jpeg']),
      ])
    })
  }

  submitHandler() {

  }

  onFilesDrop($event) {
    let files: File[];
    if($event instanceof FileList) {
      files = Array.from($event as FileList);
    } else if($event.target && $event.target.files instanceof FileList) {
      files = Array.from($event.target.files as FileList);
    }

    if(files && files.length) {
      files.forEach((file, i) => {
        this.images.push(file);
        const index = this.images.indexOf(file);

        getBase64(file).then((imgBase64) => {
          typeof imgBase64 === 'string' && (this.previewImages[index] = imgBase64);
        });
      });
    }
  }

  removeImage(i: number) {
    this.images.splice(i, 1);
    this.previewImages.splice(i, 1);
  }
}
