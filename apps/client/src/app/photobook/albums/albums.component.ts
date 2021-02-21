import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Input } from '@angular/core';
import { ActionEnum, AlbumRoI, SpriteIconEnum, UserRoI } from '@photobook/data';
import { SubSink } from 'subsink';
import { AddAlbumComponent, addAlbumDataType } from '../../shared/components/add-album/add-album.component';
import { Dialog } from '../../shared/components/dialog/dialog';
import { PhotobookService } from '../photobook.service';
import { fadeAnimations } from '../../shared/utils/animations'

@Component({
  selector: 'photobook-albums',
  templateUrl: './albums.component.html',
  styleUrls: ['./albums.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [ fadeAnimations.fadeIn() ],
})
export class AlbumsComponent implements OnInit {
  subs = new SubSink();
  @Input() authUser: UserRoI;
  @Input() currentUser: UserRoI;
  albumsLoadPending = false;
  albums: AlbumRoI[];
  addIcon: SpriteIconEnum = SpriteIconEnum.add;

  constructor(
    private readonly _photoService: PhotobookService,
    private readonly _dialog: Dialog,
    private readonly _changeDetectionRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.getAlbums();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  getAlbums() {
    this.albumsLoadPending = true;
    this.subs.sink = this._photoService.getAllAlbumsByUserId(this.currentUser.id).subscribe(
      (albums) => {
        this.albums = albums.sort((a, b) => Number(new Date(a.created_at)) - Number(new Date(b.created_at)));
      },
      (error) => {
        // TODO: error handling
        console.log(error);
      },
      () => {
        this.albumsLoadPending = false;
        this._changeDetectionRef.markForCheck();
      }
    )
  }

  addAlbum(album?: AlbumRoI) {
    const dialogRef = this._dialog.open(AddAlbumComponent, {
      data: {
        album,
        user: this.authUser,
        action: album ? ActionEnum.update : ActionEnum.create,
      },
      isScrolled: true,
      scrolledOverlayPosition: 'top',
      dialogContainerClass: ['add-album-container']
    });

    dialogRef.afterClosed().subscribe((data: addAlbumDataType) => {
      if(data && data.type === ActionEnum.create) {
        this.albums.push(data.data);
      } else if(data && data.type === ActionEnum.update) {
        const index = this.albums.findIndex(album => album.id === data.album_id);
        this.albums = [ ...this.albums.slice(0, index), data.data, ...this.albums.slice(index + 1)]
      } else if(data && data.type === ActionEnum.delete) {
        const index = this.albums.findIndex(album => album.id === data.album_id);
        this.albums.splice(index, 1);
      }
      this._changeDetectionRef.markForCheck();
    })
  }
}
