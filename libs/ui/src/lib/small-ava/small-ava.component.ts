import { Component, Input, OnInit } from '@angular/core';
import { SpriteIconEnum } from '@photobook/data';

@Component({
  selector: 'div[photobook-small-ava], span[photobook-small-ava], a[photobook-small-ava]',
  templateUrl: './small-ava.component.html',
  styleUrls: ['./small-ava.component.scss'],
  host: { class: 'photobook-small-ava' },
})
export class SmallAvaComponent implements OnInit {
  @Input() avatar?: string;
  @Input() userName: string;
  moreIcon = SpriteIconEnum.more;
  userIcon = SpriteIconEnum.user;

  ngOnInit(): void {}
}
