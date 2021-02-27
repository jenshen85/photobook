import { Component, Inject, OnInit } from '@angular/core';
import { PhotoRoI, SpriteIconEnum, UserProfileRoI } from '@photobook/data';
import { DialogRef, DIALOG_DATA } from '@photobook/ui';

import { PhotobookService } from '../../../photobook/photobook.service';
// import { getUserName } from '../../utils/utils';
// import { DIALOG_DATA } from '../dialog/dialog';
// import { DialogRef } from '../dialog/dialog-ref';

export type openPhotoInDataType = {
  photo: PhotoRoI;
  authUserProfile: UserProfileRoI;
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
  loadPhoto: boolean;
  moreIcon = SpriteIconEnum.more;
  leftIcon = SpriteIconEnum.arrow_left;
  rightIcon = SpriteIconEnum.arrow_right;
  userName: string;
  authUserName: string;

  constructor(
    private photobookService: PhotobookService,
    private readonly dialogRef: DialogRef<PhotoViewComponent>,
    @Inject(DIALOG_DATA) private data: openPhotoInDataType
  ) {}

  ngOnInit(): void {
    this.photo = this.data.photo;
    this.authUserProfile = this.data.authUserProfile;
    // this.userName = getUserName(this.photo.user.username, this.photo.user_profile.first_name, this.photo.user_profile.last_name)
    // this.authUserName = getUserName(this.authUser.username, this.authUser.user_profile.first_name, this.authUser.user_profile.last_name)
    this.loadPhoto = true;
  }

  onload(_: Event) {
    this.loadPhoto = false;
  }
}
