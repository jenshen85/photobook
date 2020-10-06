import { Component, Input, OnInit } from '@angular/core';
import { ControlContainer, FormGroupDirective } from '@angular/forms';
import { transition, trigger, useAnimation } from '@angular/animations';
import { fadeIn } from 'ng-animate';

import { UserProfileRODto, UserRoDto } from '@photobook/dto';

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
      )
    ]),
  ],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective,
    },
  ],
})
export class UserComponent implements OnInit {
  @Input() profile: UserProfileRODto;
  @Input() isEdit: boolean;
  @Input() username: string;
  @Input() avatarControl: string;
  @Input() firstNameControl: string;
  @Input() lastNameControl: string;
  @Input() descriptionControl: string;
  userName = '';

  ngOnInit(): void {
    this.userName = this.getUserName(this.username);
  }

  private getUserName(username: string): string {
    let userName: string;
    if (this.profile.first_name) {
      userName = `${this.profile.first_name}${this.profile.last_name ? ' ' + this.profile.last_name : ''}`;
    } else {
      userName = username;
    }
    return userName;
  }
}
