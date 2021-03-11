import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PhotoRoI, SpriteIconEnum, UserProfileRoI } from '@photobook/data';
import { userName } from '../../utils/utils';

@Component({
  selector: 'photobook-photo-card',
  templateUrl: './photo-card.component.html',
  styleUrls: ['./photo-card.component.scss'],
  host: { class: 'photobook-photo-card' },
})
export class PhotoCardComponent implements OnInit {
  @Output() onPhotoClick: EventEmitter<{photo: PhotoRoI, userProfile: UserProfileRoI}> = new EventEmitter();
  @Output() onEditClick: EventEmitter<PhotoRoI> = new EventEmitter();
  @Input() userProfile: UserProfileRoI;
  @Input() photo: PhotoRoI;
  @Input() hasInfo?: boolean = true;
  @Input() isAuthUser?: boolean = false;
  @Input() albumTitle?: string;

  profile: UserProfileRoI;
  commentIcon = SpriteIconEnum.comments;
  likeIcon = SpriteIconEnum.like;
  loupeIcon = SpriteIconEnum.loupe;
  albumIcon = SpriteIconEnum.album;
  editIcon = SpriteIconEnum.edit;

  constructor() {}

  ngOnInit(): void {}

  onPhotoClickHandler(e: Event) {
    e.preventDefault();
    this.onPhotoClick.emit({ photo: this.photo, userProfile: this.userProfile })
  }

  onEditClickHandler(e: Event) {
    e.preventDefault();
    this.onEditClick.emit(this.photo)
  }

  get userName(): string {
    return userName({ first_name: this.userProfile.first_name, last_name: this.userProfile.last_name});
  }

  get commentsLength(): number {
    return this.photo.comments.length;
  }

  get likesLength(): number {
    return this.photo.likes.length;
  }
}
