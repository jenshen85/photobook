import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { ControlContainer, FormGroupDirective } from '@angular/forms';
import { transition, trigger, useAnimation } from '@angular/animations';
import { fadeIn } from 'ng-animate';

import { SpriteIconEnum, UserProfileRoI } from '@photobook/data';
import { getUserName } from '../../../shared/utils/utils';

@Component({
  selector: 'photobook-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  host: { class: 'photobook-user' },
  animations: [
    trigger('fadeIn', [
      transition(
        'void => *',
        useAnimation(fadeIn, { params: { timing: 0.3 } })
      ),
    ]),
  ],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective,
    },
  ],
})
export class UserComponentComponent implements OnInit, OnChanges {
  @Input() profile: UserProfileRoI;
  @Input() isEdit: boolean;
  @Input() avatarControl: string;
  @Input() firstNameControl: string;
  @Input() lastNameControl: string;
  @Input() descriptionControl: string;
  userIcon = SpriteIconEnum.user;
  userName = '';

  ngOnInit(): void {
    this.userName = getUserName(
      this.profile.user.username,
      this.profile.first_name,
      this.profile.last_name
    );
  }

  ngOnChanges(_: SimpleChanges): void {
    this.userName = getUserName(
      this.profile.user.username,
      this.profile.first_name,
      this.profile.last_name
    );
  }
}
