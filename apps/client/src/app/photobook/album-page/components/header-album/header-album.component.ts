import { transition, trigger, useAnimation } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { fadeIn } from 'ng-animate';

import { AlbumRoI, SpriteIconEnum, UserRoI } from '@photobook/data';
import { Dialog } from '@photobook/ui';

import { AddPhotoComponent } from '../../../../shared/components/add-photo/add-photo.component';

@Component({
  selector: 'photobook-header-album',
  templateUrl: './header-album.component.html',
  styleUrls: ['./header-album.component.scss'],
  host: { class: 'photobook-header-album'},
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
  // @ViewChild(DialogRefDirective) dialogRefDir: DialogRefDirective;
  @Input() isAuthUser?: boolean;
  @Input() user: UserRoI;
  @Input() album: AlbumRoI;
  isEdit: boolean;
  savePending: boolean;
  albumForm: FormGroup;

  @Output() onEditHandler: EventEmitter<boolean> = new EventEmitter()

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

  editHandler() {
    this.isEdit = !this.isEdit;
    this.onEditHandler.emit(this.isEdit);
  }

  updateProfileHandler() {
    console.log(this.albumForm);
  }

  addPhotoHandler() {
    const dialogRef = this.dialog.open(AddPhotoComponent, {
      data: {
        user: this.user
      },
      isScrolled: true,
      scrolledOverlayPosition: 'top'
      // dialogContentClass: 'common-dialog-content',
      // centered: true,
    });

    dialogRef.afterClosed().subscribe((data: any) => {
      console.log(data);
    })
  }
}
