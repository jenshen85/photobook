import { Component, OnInit, ViewChild } from '@angular/core';
import { transition, trigger, useAnimation } from '@angular/animations';
import { fadeIn } from 'ng-animate';
import { SubSink } from 'subsink';

import {
  UserRoI,
  PhotoRoI,
  SpriteIconEnum,
  UserProfileCredentialsI,
} from '@photobook/data';
import { PhotobookService } from '../photobook.service';
import { DialogService } from '../../shared/components/dialog/dialog.service';

import { DialogRefDirective } from '../../shared/directives/dialog-ref.directive';
import { PhotoViewComponent } from '../../shared/components/photo-view/photo-view.component';

@Component({
  selector: 'photobook-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  animations: [
    trigger('fade', [
      transition(
        'void => *',
        useAnimation(fadeIn, { params: { timing: 0.3 } })
      ),
    ]),
  ],
})
export class HomePageComponent implements OnInit {
  @ViewChild(DialogRefDirective)
  dialogRefDir: DialogRefDirective;

  subs = new SubSink();

  user: UserRoI;
  profile: UserProfileCredentialsI;
  photos: PhotoRoI[] = [];
  addIcon: SpriteIconEnum = SpriteIconEnum.add;

  isEdit: boolean;
  pendingLoadUser: boolean;
  photosLoadPending: boolean;

  constructor(
    private readonly _photoService: PhotobookService,
    private readonly dialog: DialogService
  ) {}

  ngOnInit(): void {
    this.getMe();
    this.getPhotos();
  }

  getMe(): void {
    this.pendingLoadUser = true;
    this.subs.sink = this._photoService.getUser().subscribe(
      (user) => {
        this.user = user;
        this.profile = user.user_profile;
        this.pendingLoadUser = false;
      },
      (error) => {
        // TODO: error handling
        this.pendingLoadUser = false;
      }
    );
  }

  getPhotos() {
    this.photosLoadPending = true;
    this.subs.sink = this._photoService.getPhotos().subscribe(
      (photos) => {
        this.photos = photos;
        this.photosLoadPending = false;
      },
      (error) => {
        // TODO: error handling
        this.photosLoadPending = false;
      }
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  editHandler(_: Event) {
    this.isEdit = !this.isEdit;
  }

  openPhotoDialog(photo: PhotoRoI): void {
    this.dialog.open(this.dialogRefDir, PhotoViewComponent, {
      data: { photo, user: this.user },
      dialogContentClass: 'photo-view-content',
    });
  }

  loadMoreHandler() {}
}
