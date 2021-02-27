import { Component, Input } from '@angular/core';
import { SpriteIconEnum } from '@photobook/data';

@Component({
  selector: 'span[photobook-app-icon]',
  templateUrl: './app-icon.component.html',
  styleUrls: ['./app-icon.component.scss'],
  host: { class: 'photobook-app-icon' }
})
export class AppIconComponent {
  @Input() icon: SpriteIconEnum;
}
