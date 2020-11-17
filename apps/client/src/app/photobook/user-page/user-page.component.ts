import { transition, trigger, useAnimation } from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionEnum, AlbumRoI, SpriteIconEnum, UserProfileRoI, UserRoI } from '@photobook/data';
import { fadeIn } from 'ng-animate';
import { SubSink } from 'subsink';
import { AuthService } from '../../auth/auth.service';
import { AddAlbumComponent, addAlbumDataType } from '../../shared/components/add-album/add-album.component';
import { DialogService } from '../../shared/components/dialog/dialog.service';
import { DialogRefDirective } from '../../shared/directives/dialog-ref.directive';
import { PhotobookService } from '../photobook.service';

@Component({
  selector: 'photobook-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss'],
  animations: [
    trigger('fade', [
      transition(
        'void => *',
        useAnimation(fadeIn, { params: { timing: 0.3 } })
      ),
    ]),
  ],
})
export class UserPageComponent implements OnInit {
  isAuthUser: boolean;

  @ViewChild(DialogRefDirective)
  dialogRefDir: DialogRefDirective;

  subs = new SubSink();
  user: UserRoI;
  profile: UserProfileRoI;
  albums: AlbumRoI[];

  isEdit = false;
  loadUserPending: boolean;
  albumsLoadPending: boolean;

  addIcon: SpriteIconEnum = SpriteIconEnum.add;

  constructor(
    private readonly _photoService: PhotobookService,
    private readonly _authService: AuthService,
    private readonly dialog: DialogService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadUser();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  loadUser(): void {
    const authUserId = Number(this._authService.getPayload().id);
    this.loadUserPending = true;
    this.route.paramMap.subscribe(
      params => {
        const userId = Number(params.get('id'));
        this.isAuthUser = authUserId === userId;

        this.subs.sink = this._photoService.getUserById(userId).subscribe((user) => {
          this.user = user;
          this.profile = user.user_profile;
          this.loadUserPending = false;
          this.getAlbums()
        });
      },
      (error) => {
        this.loadUserPending = false;
        console.log(error);
      }
    )
  }

  getAlbums() {
    this.albumsLoadPending = true;
    this.subs.sink = this._photoService.getAllAlbumsByUserId(this.user.id).subscribe(
      (albums) => {
        this.albums = albums.sort((a, b) => Number(new Date(a.created_at)) - Number(new Date(b.created_at)));
        this.albumsLoadPending = false;
      },
      (error) => {
        // TODO: error handling
        this.albumsLoadPending = false;
      }
    )
  }

  editHandler(_: Event) {
    this.isEdit = !this.isEdit;
  }

  addAlbum(album?: AlbumRoI) {
    this.dialog.open(this.dialogRefDir, AddAlbumComponent, {
      data: {
        album,
        user: this.user,
        action: album ? ActionEnum.update : ActionEnum.create,
      },
      dialogContentClass: 'common-dialog-content',
      centered: true,
    }, (data: addAlbumDataType) => {
      if(data && data.type === ActionEnum.create) {
        this.albums.push(data.data);
      } else if(data && data.type === ActionEnum.update) {
        const index = this.albums.findIndex(album => album.id === data.album_id);
        this.albums = [ ...this.albums.slice(0, index), data.data, ...this.albums.slice(index + 1)]
      } else if(data && data.type === ActionEnum.delete) {
        const index = this.albums.findIndex(album => album.id === data.album_id);
        this.albums.splice(index, 1);
      }
    });
  }
}
