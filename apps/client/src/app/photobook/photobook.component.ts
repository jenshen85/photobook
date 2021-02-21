import { Component, OnInit } from '@angular/core';
import { SubSink } from 'subsink';
import { PhotobookService } from './photobook.service';

@Component({
  selector: 'photobook-photo-book',
  templateUrl: './photobook.component.html',
  styleUrls: ['./photobook.component.scss'],
  host: { class: 'photobook-photo-book' },
})
export class PhotobookComponent implements OnInit {
  subs = new SubSink();
  pendingLoadUser = false;

  constructor(private readonly _photoService: PhotobookService) {}

  ngOnInit(): void {
    this.getMe();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  getMe(): void {
    this.pendingLoadUser = true;
    this.subs.sink = this._photoService.getMe().subscribe(
      (me) => console.log,
      (error) => {
        // TODO: error handling
        console.log(error);
      },
      () => this.pendingLoadUser = false
    );
  }
}
