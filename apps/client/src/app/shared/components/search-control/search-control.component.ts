import { Component, Input, OnInit } from '@angular/core';

import { SpriteIconEnum } from '@photobook/api-interfaces'

@Component({
  selector: 'photobook-search-control',
  templateUrl: './search-control.component.html',
  styleUrls: ['./search-control.component.scss'],
  host: { class: 'photobook-search-control' },
})
export class SearchControl implements OnInit {
  @Input() placeholder: string;
  searchIcon: string = SpriteIconEnum.search;
  ngOnInit(): void {}
}
