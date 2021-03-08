import { Component, Inject, OnInit } from '@angular/core';
import { PhotoRoI, SpriteIconEnum, UserProfileRoI } from '@photobook/data';
import { DialogRef, DIALOG_DATA } from '@photobook/ui';

import { PhotobookService } from '../../../photobook/photobook.service';
import { userName } from '../../utils/utils';
// import { getUserName } from '../../utils/utils';

export type openPhotoInDataType = {
  photo: PhotoRoI;
  authUserProfile: UserProfileRoI;
  photoUserProfile: UserProfileRoI;
}

@Component({
  selector: 'photobook-photo-view',
  templateUrl: './photo-view.component.html',
  styleUrls: ['./photo-view.component.scss'],
  host: { class: 'photobook-photo-view' },
})
export class PhotoViewComponent implements OnInit {
  photo: PhotoRoI;
  authUserProfile: UserProfileRoI;
  photoUserProfile: UserProfileRoI;
  loadPhoto: boolean;
  moreIcon = SpriteIconEnum.more;
  leftIcon = SpriteIconEnum.arrow_left;
  rightIcon = SpriteIconEnum.arrow_right;
  comments = [];

  constructor(
    private photobookService: PhotobookService,
    private readonly dialogRef: DialogRef<PhotoViewComponent>,
    @Inject(DIALOG_DATA) private data: openPhotoInDataType
  ) {}

  ngOnInit(): void {
    this.photo = this.data.photo;
    this.authUserProfile = this.data.authUserProfile;
    this.photoUserProfile = this.data.photoUserProfile;
    this.loadPhoto = true;
  }

  get userName(): string {
    return userName({ first_name: this.photoUserProfile.first_name, last_name: this.photoUserProfile.last_name});
  }

  get authUserName(): string {
    return userName({ first_name: this.authUserProfile.first_name, last_name: this.authUserProfile.last_name});
  }

  get photoDate(): Date {
    return this.photo.created_at;
  }

  onload(_: Event) {
    this.loadPhoto = false;
  }

  closeDialog() {
    this.dialogRef.close()
  }
}
