import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'photobook-photo-book',
  templateUrl: './photobook.component.html',
  styleUrls: ['./photobook.component.scss'],
  host: { class: 'photobook-photo-book' },
})
export class PhotobookComponent implements OnInit {
  constructor() {}
  ngOnInit(): void {}
}
