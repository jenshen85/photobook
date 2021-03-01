import { transition, trigger, useAnimation } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { fadeIn } from 'ng-animate';

import { AlbumRoI, SpriteIconEnum, UserProfileRoI } from '@photobook/data';
import { Dialog } from '@photobook/ui';

import { getUserName } from 'apps/client/src/app/shared/utils/utils';

@Component({
  selector: 'header[photobook-header-album]',
  templateUrl: './header-album.component.html',
  styleUrls: ['./header-album.component.scss'],
  host: {
    class: 'header photobook-header-album',
    '[class]': 'isEdit ? "user-edit" : ""',
    '[style.backgroundImage]': 'album.preview ? "url(" + album.preview + ")" : "url(assets/images/default-bg.jpg)"'
  },
  animations: [
    trigger('fade', [
      transition(
        'void => *',
        useAnimation(fadeIn, { params: { timing: 0.3 } })
      ),
    ]),
    trigger('fadeIn', [
      transition(
        'void => *',
        useAnimation(fadeIn, { params: { timing: 0.3 } })
      ),
    ]),
  ],
})
export class HeaderAlbumComponent implements OnInit {
  @Input() isAuthUser?: boolean;
  @Input() authUserProfile: UserProfileRoI;
  @Input() currentUserProfile: UserProfileRoI;
  @Input() isEdit: boolean;
  @Input() album: AlbumRoI;
  savePending: boolean;
  albumForm: FormGroup;

  @Output() onEditHandler: EventEmitter<boolean> = new EventEmitter()
  @Output() onAddPhotoHandler: EventEmitter<boolean> = new EventEmitter()

  editIcon: SpriteIconEnum = SpriteIconEnum.edit;
  albumIcon: SpriteIconEnum = SpriteIconEnum.album;
  homeIcon: SpriteIconEnum = SpriteIconEnum.home;
  addIcon: SpriteIconEnum = SpriteIconEnum.add;

  constructor(private readonly dialog: Dialog) {}

  ngOnInit(): void {
    this.albumForm = new FormGroup({
      title: new FormControl(this.album.title, [
        Validators.required,
        Validators.maxLength(20)
      ]),
      description: new FormControl(this.album.description, [
        Validators.maxLength(20),
      ]),
      preview: new FormControl(null),
    });
  }

  // editHandler(isEdit: boolean) {
  //   this.onEditHandler.emit(isEdit);
  // }

  updateProfileHandler() {
    console.log(this.albumForm);
  }

  // addPhotoHandler() {
  //   const data: addPhotoDataInType = {
  //     authUserProfile: this.authUserProfile,
  //     album: this.album
  //   }

  //   this.dialog.open(AddPhotoComponent, {
  //     data,
  //     isScrolled: true,
  //     scrolledOverlayPosition: 'center',
  //     dialogContainerClass: ['add-photo-container']
  //   });
  // }

  get getName() {
    return getUserName(
      this.currentUserProfile.user.username,
      this.currentUserProfile.first_name,
      this.currentUserProfile.last_name
    );
  }
}
