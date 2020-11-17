import { Component, Input, OnInit } from '@angular/core';
import { PhotoRoI, SpriteIconEnum, UserRoI } from '@photobook/data';
import { getUserName } from '../../utils/utils';

@Component({
  selector: 'photobook-photo-view',
  templateUrl: './photo-view.component.html',
  styleUrls: ['./photo-view.component.scss'],
  host: { class: 'photobook-photo-view' },
})
export class PhotoViewComponent implements OnInit {
  @Input() data: { photo: PhotoRoI, user: UserRoI };
  photo: PhotoRoI;
  authUser: UserRoI;
  loadPhoto: boolean;
  moreIcon = SpriteIconEnum.more;
  leftIcon = SpriteIconEnum.arrow_left;
  rightIcon = SpriteIconEnum.arrow_right;
  userName: string;
  authUserName: string;

  ngOnInit(): void {
    this.photo = this.data.photo;
    this.authUser = this.data.user;
    this.userName = getUserName(this.photo.user.username, this.photo.user_profile.first_name, this.photo.user_profile.last_name)
    this.authUserName = getUserName(this.authUser.username, this.authUser.user_profile.first_name, this.authUser.user_profile.last_name)
    this.loadPhoto = true;
  }

  onload(_: Event) {
    this.loadPhoto = false;
  }
}
