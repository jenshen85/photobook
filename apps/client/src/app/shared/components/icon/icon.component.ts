import { Component, Input } from '@angular/core';
import { SpriteIconEnum } from '@photobook/data';

@Component({
  selector: 'span[photobook-icon]',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss'],
  host: { class: 'photobook-icon' }
})
export class IconComponent {
  @Input() icon: SpriteIconEnum;
}
