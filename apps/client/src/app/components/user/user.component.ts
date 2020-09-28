import { Component, Input, OnInit } from '@angular/core';
import { UserProfileRODto, UserRoDto } from '@photobook/dto';

@Component({
  selector: 'photobook-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  @Input() user: UserRoDto;
  profile: UserProfileRODto;

  ngOnInit(): void {
    console.log(this.user);
    this.profile = this.checkData(this.user);
  }

  private checkData(user: UserRoDto): UserProfileRODto {
    const prfl = user.user_profile;
    if (!prfl.first_name && !prfl.first_name) {
      prfl.first_name = user.username;
    } else {
      prfl.first_name = `${prfl.first_name} ${prfl.last_name}`;
    }

    return prfl;
  }
}
