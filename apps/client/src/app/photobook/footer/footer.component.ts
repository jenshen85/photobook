import { Component, Input, OnInit } from '@angular/core';
import { SpriteIconEnum } from '@photobook/data';
// import { fadeAnimations } from '../../utils/animations';

@Component({
  selector: 'footer[photobook-footer]',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  host: {
    class: 'photobook-footer footer',
    '[class]': 'isEdit ? "user-edit" : ""',
    '[style.backgroundImage]':
      'userBg ? "url(" + userBg + ")" : "url(assets/images/welcom-bg.png)"',
  },
  // animations: [ fadeAnimations.fadeIn() ],
})
export class FooterComponent implements OnInit {
  @Input() userBg: string;
  @Input() isEdit: boolean;
  topIcon: SpriteIconEnum = SpriteIconEnum.top;
  ngOnInit(): void {}
}
