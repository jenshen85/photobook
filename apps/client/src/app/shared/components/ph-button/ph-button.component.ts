import { Component, Input, OnInit } from '@angular/core';
import { SpriteIconEnum } from '@photobook/data';

@Component({
  selector: 'button[photobook-ph-button], a[photobook-ph-button]',
  templateUrl: './ph-button.component.html',
  styleUrls: ['./ph-button.component.scss'],
  host: {
    class: 'photobook-btn',
  },
})
export class PhButtonComponent implements OnInit {
  @Input() icon: SpriteIconEnum;
  @Input() iconOnly: boolean = false;
  ngOnInit(): void {}
}
