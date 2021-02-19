import { transition, trigger, useAnimation } from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlbumRoI, PhotoRoI, SpriteIconEnum, UserProfileCredentialsI, UserRoI } from '@photobook/data';
import { fadeIn } from 'ng-animate';
import { SubSink } from 'subsink';
import { AuthService } from '../../auth/auth.service';
import { DialogService } from '../../shared/components/dialog/dialog.service';
import { PhotoViewComponent } from '../../shared/components/photo-view/photo-view.component';
import { DialogRefDirective } from '../../shared/directives/dialog-ref.directive';
import { PhotobookService } from '../photobook.service';

@Component({
  selector: 'photobook-album-page',
  templateUrl: './album-page.component.html',
  styleUrls: ['./album-page.component.scss'],
  animations: [
    trigger('fade', [
      transition(
        'void => *',
        useAnimation(fadeIn, { params: { timing: 0.3 } })
      ),
    ]),
  ],
})
export class AlbumPageComponent implements OnInit {
  @ViewChild(DialogRefDirective)
  dialogRefDir: DialogRefDirective;

  subs = new SubSink();

  user: UserRoI;
  profile: UserProfileCredentialsI;
  album: AlbumRoI;
  // @ts-ignore
  photos: PhotoRoI[] = [{"id":1,"user_id":1,"album_id":1,"image":"images/1/albums/1/photos/1599897718441_0_feec2_a1495924_orig.jpg","image_name":"1599897718441_0_feec2_a1495924_orig.jpg","title":null,"description":null,"created_at":"2020-09-12T08:01:58.448Z","updated_at":"2020-09-12T08:01:58.448Z","user":{"id":1,"email":"some@gmail.com","username":"Some Name","created_at":"2020-09-10T05:48:53.238Z","updated_at":"2020-09-10T05:48:53.277Z","is_active":false,"role":"user"},"album":{"id":1,"user_id":1,"title":"Альбом","description":"album description","preview":"images/1/albums/1/preview/preview.jpg","created_at":"2020-09-10T05:50:41.602Z","updated_at":"2020-10-14T20:34:24.020Z"},"user_profile":{"id":1,"user_id":1,"first_name":"Вася","last_name":"Пупкин","avatar":"images/1/profile/avatar.jpg","cover":"images/1/profile/cover.png","description":"Я Вася Пупкин","created_at":"2020-09-10T05:48:53.264Z","updated_at":"2020-10-07T18:47:14.522Z"}},{"id":2,"user_id":1,"album_id":1,"image":"images/1/albums/1/photos/1599897718442_0_feec3_365b51cf_orig.jpg","image_name":"1599897718442_0_feec3_365b51cf_orig.jpg","title":null,"description":null,"created_at":"2020-09-12T08:01:58.491Z","updated_at":"2020-09-12T08:01:58.491Z","user":{"id":1,"email":"some@gmail.com","username":"Some Name","created_at":"2020-09-10T05:48:53.238Z","updated_at":"2020-09-10T05:48:53.277Z","is_active":false,"role":"user"},"album":{"id":1,"user_id":1,"title":"Альбом","description":"album description","preview":"images/1/albums/1/preview/preview.jpg","created_at":"2020-09-10T05:50:41.602Z","updated_at":"2020-10-14T20:34:24.020Z"},"user_profile":{"id":1,"user_id":1,"first_name":"Вася","last_name":"Пупкин","avatar":"images/1/profile/avatar.jpg","cover":"images/1/profile/cover.png","description":"Я Вася Пупкин","created_at":"2020-09-10T05:48:53.264Z","updated_at":"2020-10-07T18:47:14.522Z"}},{"id":3,"user_id":1,"album_id":1,"image":"images/1/albums/1/photos/1599897718442_0_feec4_52eab096_orig.jpg","image_name":"1599897718442_0_feec4_52eab096_orig.jpg","title":null,"description":null,"created_at":"2020-09-12T08:01:58.493Z","updated_at":"2020-09-12T08:01:58.493Z","user":{"id":1,"email":"some@gmail.com","username":"Some Name","created_at":"2020-09-10T05:48:53.238Z","updated_at":"2020-09-10T05:48:53.277Z","is_active":false,"role":"user"},"album":{"id":1,"user_id":1,"title":"Альбом","description":"album description","preview":"images/1/albums/1/preview/preview.jpg","created_at":"2020-09-10T05:50:41.602Z","updated_at":"2020-10-14T20:34:24.020Z"},"user_profile":{"id":1,"user_id":1,"first_name":"Вася","last_name":"Пупкин","avatar":"images/1/profile/avatar.jpg","cover":"images/1/profile/cover.png","description":"Я Вася Пупкин","created_at":"2020-09-10T05:48:53.264Z","updated_at":"2020-10-07T18:47:14.522Z"}},{"id":4,"user_id":1,"album_id":1,"image":"images/1/albums/1/photos/1599897741398_0_feec2_a1495924_orig.jpg","image_name":"1599897741398_0_feec2_a1495924_orig.jpg","title":null,"description":null,"created_at":"2020-09-12T08:02:21.407Z","updated_at":"2020-09-12T08:02:21.407Z","user":{"id":1,"email":"some@gmail.com","username":"Some Name","created_at":"2020-09-10T05:48:53.238Z","updated_at":"2020-09-10T05:48:53.277Z","is_active":false,"role":"user"},"album":{"id":1,"user_id":1,"title":"Альбом","description":"album description","preview":"images/1/albums/1/preview/preview.jpg","created_at":"2020-09-10T05:50:41.602Z","updated_at":"2020-10-14T20:34:24.020Z"},"user_profile":{"id":1,"user_id":1,"first_name":"Вася","last_name":"Пупкин","avatar":"images/1/profile/avatar.jpg","cover":"images/1/profile/cover.png","description":"Я Вася Пупкин","created_at":"2020-09-10T05:48:53.264Z","updated_at":"2020-10-07T18:47:14.522Z"}},{"id":5,"user_id":1,"album_id":1,"image":"images/1/albums/1/photos/1599897741399_0_feec4_52eab096_orig.jpg","image_name":"1599897741399_0_feec4_52eab096_orig.jpg","title":null,"description":null,"created_at":"2020-09-12T08:02:21.449Z","updated_at":"2020-09-12T08:02:21.449Z","user":{"id":1,"email":"some@gmail.com","username":"Some Name","created_at":"2020-09-10T05:48:53.238Z","updated_at":"2020-09-10T05:48:53.277Z","is_active":false,"role":"user"},"album":{"id":1,"user_id":1,"title":"Альбом","description":"album description","preview":"images/1/albums/1/preview/preview.jpg","created_at":"2020-09-10T05:50:41.602Z","updated_at":"2020-10-14T20:34:24.020Z"},"user_profile":{"id":1,"user_id":1,"first_name":"Вася","last_name":"Пупкин","avatar":"images/1/profile/avatar.jpg","cover":"images/1/profile/cover.png","description":"Я Вася Пупкин","created_at":"2020-09-10T05:48:53.264Z","updated_at":"2020-10-07T18:47:14.522Z"}},{"id":6,"user_id":1,"album_id":1,"image":"images/1/albums/1/photos/1599897741399_0_feec3_365b51cf_orig.jpg","image_name":"1599897741399_0_feec3_365b51cf_orig.jpg","title":null,"description":null,"created_at":"2020-09-12T08:02:21.559Z","updated_at":"2020-09-12T08:02:21.559Z","user":{"id":1,"email":"some@gmail.com","username":"Some Name","created_at":"2020-09-10T05:48:53.238Z","updated_at":"2020-09-10T05:48:53.277Z","is_active":false,"role":"user"},"album":{"id":1,"user_id":1,"title":"Альбом","description":"album description","preview":"images/1/albums/1/preview/preview.jpg","created_at":"2020-09-10T05:50:41.602Z","updated_at":"2020-10-14T20:34:24.020Z"},"user_profile":{"id":1,"user_id":1,"first_name":"Вася","last_name":"Пупкин","avatar":"images/1/profile/avatar.jpg","cover":"images/1/profile/cover.png","description":"Я Вася Пупкин","created_at":"2020-09-10T05:48:53.264Z","updated_at":"2020-10-07T18:47:14.522Z"}},{"id":7,"user_id":1,"album_id":3,"image":"images/1/albums/3/photos/1599897852543_0_feec2_a1495924_orig.jpg","image_name":"1599897852543_0_feec2_a1495924_orig.jpg","title":null,"description":null,"created_at":"2020-09-12T08:04:12.548Z","updated_at":"2020-09-12T08:04:12.548Z","user":{"id":1,"email":"some@gmail.com","username":"Some Name","created_at":"2020-09-10T05:48:53.238Z","updated_at":"2020-09-10T05:48:53.277Z","is_active":false,"role":"user"},"album":{"id":3,"user_id":1,"title":"Альбом 3","description":"album description","preview":"images/1/albums/3/preview/preview.jpg","created_at":"2020-09-12T08:03:59.489Z","updated_at":"2020-10-16T06:14:01.366Z"},"user_profile":{"id":1,"user_id":1,"first_name":"Вася","last_name":"Пупкин","avatar":"images/1/profile/avatar.jpg","cover":"images/1/profile/cover.png","description":"Я Вася Пупкин","created_at":"2020-09-10T05:48:53.264Z","updated_at":"2020-10-07T18:47:14.522Z"}},{"id":8,"user_id":1,"album_id":3,"image":"images/1/albums/3/photos/1599897852543_0_feec4_52eab096_orig.jpg","image_name":"1599897852543_0_feec4_52eab096_orig.jpg","title":null,"description":null,"created_at":"2020-09-12T08:04:12.594Z","updated_at":"2020-09-12T08:04:12.594Z","user":{"id":1,"email":"some@gmail.com","username":"Some Name","created_at":"2020-09-10T05:48:53.238Z","updated_at":"2020-09-10T05:48:53.277Z","is_active":false,"role":"user"},"album":{"id":3,"user_id":1,"title":"Альбом 3","description":"album description","preview":"images/1/albums/3/preview/preview.jpg","created_at":"2020-09-12T08:03:59.489Z","updated_at":"2020-10-16T06:14:01.366Z"},"user_profile":{"id":1,"user_id":1,"first_name":"Вася","last_name":"Пупкин","avatar":"images/1/profile/avatar.jpg","cover":"images/1/profile/cover.png","description":"Я Вася Пупкин","created_at":"2020-09-10T05:48:53.264Z","updated_at":"2020-10-07T18:47:14.522Z"}},{"id":9,"user_id":1,"album_id":3,"image":"images/1/albums/3/photos/1599897852543_0_feec3_365b51cf_orig.jpg","image_name":"1599897852543_0_feec3_365b51cf_orig.jpg","title":null,"description":null,"created_at":"2020-09-12T08:04:12.596Z","updated_at":"2020-09-12T08:04:12.596Z","user":{"id":1,"email":"some@gmail.com","username":"Some Name","created_at":"2020-09-10T05:48:53.238Z","updated_at":"2020-09-10T05:48:53.277Z","is_active":false,"role":"user"},"album":{"id":3,"user_id":1,"title":"Альбом 3","description":"album description","preview":"images/1/albums/3/preview/preview.jpg","created_at":"2020-09-12T08:03:59.489Z","updated_at":"2020-10-16T06:14:01.366Z"},"user_profile":{"id":1,"user_id":1,"first_name":"Вася","last_name":"Пупкин","avatar":"images/1/profile/avatar.jpg","cover":"images/1/profile/cover.png","description":"Я Вася Пупкин","created_at":"2020-09-10T05:48:53.264Z","updated_at":"2020-10-07T18:47:14.522Z"}}];
  addIcon: SpriteIconEnum = SpriteIconEnum.add;

  isAuthUser: boolean;
  pendingLoadAlbum: boolean;
  pendingLoadUser: boolean;
  isEdit: boolean;

  constructor(
    private readonly _authService: AuthService,
    private readonly _photoService: PhotobookService,
    private readonly dialog: DialogService,
    // private readonly router: Router,
    private readonly route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.loadUser();
  }

  loadUser(): void {
    const authUserId = Number(this._authService.getPayload().id);
    this.pendingLoadUser = true;
    this.route.paramMap.subscribe((params) => {
        if(params.has('id')) {
          const userId = Number(params.get('id'));
          this.isAuthUser = authUserId === userId;

          this.subs.sink = this._photoService.getUserById(userId).subscribe((user) => {
            this.user = user;
            this.profile = user.user_profile;
            this.pendingLoadUser = false;

            if(params.has('album_id')) {
              const albumId = Number(params.get('album_id'));
              this.loadAlbum(userId, albumId);
            }
          });

        }
      },
      (error) => {
        this.pendingLoadUser = false;
        // TODO: error handling
        console.log(error);
      }
    )
  }

  loadAlbum(user_id: number | string, album_id: number | string) {
    this.pendingLoadAlbum = true;
    this.subs.sink = this._photoService.getUserAlbumById(user_id, album_id).subscribe(
      (album) => {
        // console.log(album);
        this.album = album;
        // this.photos = album.photos;
        this.pendingLoadAlbum = false;
      },
      (error) => {
        // TODO: error handling
        this.pendingLoadAlbum = false;
      }
    );
  }

  openPhotoDialog(photo: PhotoRoI): void {
    this.dialog.open(this.dialogRefDir, PhotoViewComponent, {
      data: { photo, user: this.user },
      dialogContentClass: 'photo-view-content',
    });
  }


  editHandler(_: Event) {
    this.isEdit = !this.isEdit;
  }
}
