import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { transition, trigger, useAnimation } from '@angular/animations';
import { fadeIn } from 'ng-animate';
import { Subscription } from 'rxjs';

import { SpriteIconEnum } from '@photobook/api-interfaces';
import { UserProfileCredentialsDto, UserProfileRODto, UserRoDto } from '@photobook/dto';
import { AuthService } from '../../auth/auth.service';
import { PhotobookService } from '../photobook.service';

import { toFormData } from '../../shared/utils/utils';

@Component({
  selector: 'photobook-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  animations: [
    trigger('fade', [
      transition(
        'void => *',
        useAnimation(fadeIn, { params: { timing: 0.3 } })
      ),
    ]),
  ],
})
export class HomePageComponent implements OnInit {
  userSubscription$: Subscription;
  updateUserSubscription$: Subscription;
  user: UserRoDto;
  profile: UserProfileRODto;
  editIcon: SpriteIconEnum = SpriteIconEnum.edit;
  logOutIcon: SpriteIconEnum = SpriteIconEnum.off;
  albumIcon: SpriteIconEnum = SpriteIconEnum.album;
  isEdit: boolean;
  pendingLoadUser: boolean;
  savePending: boolean;
  profileForm: FormGroup;

  constructor(
    private readonly _photoService: PhotobookService,
    private readonly _authService: AuthService
  ) {}

  ngOnInit(): void {
    this.getMe();
  }

  getMe(): void {
    this.pendingLoadUser = true;
    this.userSubscription$ = this._photoService.getUser().subscribe(
      (user) => {
        this.user = user;
        this.profile = user.user_profile
        this.pendingLoadUser = false;

        this.profileForm = new FormGroup({
          first_name: new FormControl(this.user.user_profile.first_name, [Validators.required, Validators.maxLength(20)]),
          last_name: new FormControl(this.user.user_profile.last_name, [Validators.maxLength(20)]),
          description: new FormControl(this.user.user_profile.description, [Validators.maxLength(300)]),
          avatar: new FormControl(null),
          cover: new FormControl(null),
        });
      },
      (error) => {
        console.log(error);
      }
    );
  }

  ngOnDestroy(): void {
    this.userSubscription$.unsubscribe();
    this.updateUserSubscription$.unsubscribe();
  }

  editHandler(_: Event) {
    this.isEdit = !this.isEdit;
  }

  logOut(): void {
    this._authService.logout();
  }

  updateProfileHandler() {
    const data = toFormData<UserProfileCredentialsDto>(this.profileForm.value);
    this.savePending = true;
    this.updateUserSubscription$ = this._photoService.updateProfile(data)
      .subscribe(
        (profile: UserProfileRODto) => {
          this.profile = profile;
          this.savePending = false;
          this.isEdit = false;
        },
        (error) => {
          console.log(error);
        }
      )
  }
}
