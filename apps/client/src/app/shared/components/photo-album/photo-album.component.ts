import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AlbumRoI, SpriteIconEnum } from '@photobook/data';

@Component({
  selector: 'photbook-photo-album',
  templateUrl: './photo-album.component.html',
  styleUrls: ['./photo-album.component.scss'],
  host: { class: 'photbook-photo-album' },
})
export class PhotoAlbumComponent implements OnInit {
  @Input() album: AlbumRoI;
  @Input() editable?: boolean = false;
  @Output() editClick = new EventEmitter<AlbumRoI>();
  editIcon = SpriteIconEnum.edit;
  ngOnInit(): void {}
}
