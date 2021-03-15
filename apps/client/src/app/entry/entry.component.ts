import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'photobook-entry',
  templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.scss'],
  host: { class: 'photobook-entry' },
  encapsulation: ViewEncapsulation.None,
})
export class EntryComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
