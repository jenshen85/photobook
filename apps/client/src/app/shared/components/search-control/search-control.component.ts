import { Component, Input, OnInit } from '@angular/core';

import { SpriteIconEnum } from '@photobook/data';

@Component({
  selector: 'photobook-search-control',
  templateUrl: './search-control.component.html',
  styleUrls: ['./search-control.component.scss'],
  host: { class: 'photobook-search-control' },
})
export class SearchControlComponent implements OnInit {
  @Input() placeholder: string;
  searchIcon: SpriteIconEnum = SpriteIconEnum.search;
  ngOnInit(): void {}
}
