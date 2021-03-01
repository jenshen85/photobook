import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PhotoRoI, SpriteIconEnum, UserProfileRoI } from '@photobook/data';

@Component({
  selector: 'photobook-photo-card',
  templateUrl: './photo-card.component.html',
  styleUrls: ['./photo-card.component.scss'],
  host: { class: 'photobook-photo-card' },
})
export class PhotoCardComponent implements OnInit {
  @Output() onPhotoClick: EventEmitter<PhotoRoI> = new EventEmitter();
  @Output() onEditClick: EventEmitter<PhotoRoI> = new EventEmitter();
  @Input() userProfile: UserProfileRoI;
  @Input() album_title: string;
  @Input() photo: PhotoRoI;
  @Input() hasInfo?: boolean = true;
  @Input() isAuthUser?: boolean = false;

  profile: UserProfileRoI;
  commentIcon = SpriteIconEnum.comments;
  likeIcon = SpriteIconEnum.like;
  loupeIcon = SpriteIconEnum.loupe;
  albumIcon = SpriteIconEnum.album;
  editIcon = SpriteIconEnum.edit;

  constructor() {}

  ngOnInit(): void {}

  onPhotoClickHandler(e: Event, photo: PhotoRoI) {
    e.preventDefault();
    this.onPhotoClick.emit(photo)
  }

  get userName(): string {
    return `${this.userProfile.first_name}${this.userProfile.last_name ? ` ${this.userProfile.last_name}` : ''}`;
  }
}
