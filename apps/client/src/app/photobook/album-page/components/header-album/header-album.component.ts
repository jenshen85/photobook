import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import {
  AlbumRoI,
  PhotoCredentialsI,
  SpriteIconEnum,
  UserProfileRoI,
} from '@photobook/data';
import { Dialog } from '@photobook/ui';

import { toFormData, userName } from 'apps/client/src/app/shared/utils/utils';
import { SubSink } from 'subsink';
import { PhotobookService } from '../../../photobook.service';
import { fadeAnimations } from 'apps/client/src/app/shared/utils/animations';

@Component({
  selector: 'header[photobook-header-album]',
  templateUrl: './header-album.component.html',
  styleUrls: ['./header-album.component.scss'],
  host: {
    class: 'photobook-header photobook-header-album',
    '[class]': 'isEdit ? "user-edit" : ""',
    '[style.backgroundImage]':
      'album.preview ? "url(" + album.preview + ")" : "url(assets/images/default-bg.jpg)"',
  },
  animations: [fadeAnimations.fadeIn(), fadeAnimations.fadeOut()],
})
export class HeaderAlbumComponent implements OnInit {
  subs = new SubSink();
  @Input() isAuthUser?: boolean;
  @Input() authUserProfile: UserProfileRoI;
  @Input() currentUserProfile: UserProfileRoI;
  @Input() isEdit: boolean;
  @Input() album: AlbumRoI;
  savePending: boolean;
  albumForm: FormGroup;

  @Output() onEditHandler: EventEmitter<boolean> = new EventEmitter();
  @Output() onAddPhotoHandler: EventEmitter<boolean> = new EventEmitter();

  editIcon: SpriteIconEnum = SpriteIconEnum.edit;
  albumIcon: SpriteIconEnum = SpriteIconEnum.album;
  homeIcon: SpriteIconEnum = SpriteIconEnum.home;
  addIcon: SpriteIconEnum = SpriteIconEnum.add;

  constructor(
    private readonly dialog: Dialog,
    private readonly _photoService: PhotobookService
  ) {}

  ngOnInit(): void {
    this.albumForm = new FormGroup({
      title: new FormControl(this.album.title, [
        Validators.required,
        Validators.maxLength(20),
      ]),
      description: new FormControl(this.album.description, [
        Validators.maxLength(20),
      ]),
      preview: new FormControl(null),
    });
  }

  updateProfileHandler() {
    const data = toFormData<PhotoCredentialsI>(this.albumForm.value);
    this.savePending = true;
    this.subs.sink = this._photoService
      .updateAlbum(this.album.id, data)
      .subscribe(
        (album: AlbumRoI) => {
          this.album = album;
          this.albumForm.patchValue({
            title: album.title,
            description: album.description,
          });
          this.savePending = false;
          this.onEditHandler.emit(false);
        },
        (error) => {
          // TODO: error handling
          console.log(error);
          this.savePending = false;
        }
      );
  }

  get getName() {
    const { first_name, last_name } = this.currentUserProfile;
    return userName({ first_name, last_name });
  }
}
