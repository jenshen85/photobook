import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { ControlContainer, FormGroupDirective } from '@angular/forms';

import { SpriteIconEnum, UserProfileRoI } from '@photobook/data';
import { userName } from '../../../shared/utils/utils';
import { fadeAnimations } from '../../utils/animations';

@Component({
  selector: 'photobook-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  host: { class: 'photobook-user' },
  animations: [ fadeAnimations.fadeIn() ],
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

  ngOnInit(): void {}

  get userName() {
    return userName({
      first_name: this.profile.first_name,
      last_name: this.profile.last_name
    });
  }

  ngOnChanges(_: SimpleChanges): void {}
}
