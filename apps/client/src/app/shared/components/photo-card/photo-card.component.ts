import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PhotoRoI, SpriteIconEnum, UserProfileRoI, PhotoUserRoI } from '@photobook/data';
import { getUserName } from '../../utils/utils';

@Component({
  selector: 'photobook-photo-card',
  templateUrl: './photo-card.component.html',
  styleUrls: ['./photo-card.component.scss'],
  host: { class: 'photobook-photo-card' },
})
export class PhotoCardComponent implements OnInit {
  @Output() onPhotoClick: EventEmitter<PhotoRoI> = new EventEmitter()
  @Input() photo: PhotoRoI;

  user: PhotoUserRoI;
  profile: UserProfileRoI;
  userName = '';
  commentIcon = SpriteIconEnum.comments;
  likeIcon = SpriteIconEnum.like;
  loupeIcon = SpriteIconEnum.loupe;
  albumIcon = SpriteIconEnum.album;

  ngOnInit(): void {
    this.user = this.photo.user;
    this.profile = this.photo.user_profile;
    this.userName = getUserName(
      this.user.username,
      this.profile.first_name,
      this.profile.last_name
    );
  }
}
