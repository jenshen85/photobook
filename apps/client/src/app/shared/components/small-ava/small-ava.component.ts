import { Component, Input, OnInit } from '@angular/core';
import { PhotoUserRoI, SpriteIconEnum, UserProfileRoI, UserRoI } from '@photobook/data';
import { getUserName } from '../../utils/utils';

@Component({
  selector: 'photobook-small-ava',
  templateUrl: './small-ava.component.html',
  styleUrls: ['./small-ava.component.scss'],
  host: { class: 'photobook-small-ava' },
})
export class SmallAvaComponent implements OnInit {
  @Input() user: UserRoI | PhotoUserRoI;
  @Input() profile: UserProfileRoI;
  userName: string;
  moreIcon = SpriteIconEnum.more;

  ngOnInit(): void {
    this.userName = getUserName(
      this.user.username,
      this.profile.first_name,
      this.profile.last_name
    );
  }
}
