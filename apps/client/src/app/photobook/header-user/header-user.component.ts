import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  SpriteIconEnum,
  UserProfileCredentialsI,
  UserProfileRoI,
} from '@photobook/data';
import { SubSink } from 'subsink';
import { AuthService } from '../../auth/auth.service';
import { fadeAnimations } from '../../shared/utils/animations';
import { toFormData } from '../../shared/utils/utils';

@Component({
  selector: 'header[photobook-header-user]',
  templateUrl: './header-user.component.html',
  styleUrls: ['./header-user.component.scss'],
  host: {
    class: 'photobook-header photobook-header-user',
    '[class]': 'isEdit ? "user-edit" : ""',
    '[style.backgroundImage]':
      'currentUserProfile.cover ? "url(" + currentUserProfile.cover + ")" : "url(assets/images/welcom-bg.png)"',
  },
  animations: [fadeAnimations.fadeIn()],
})
export class HeaderUserComponent implements OnInit {
  subs = new SubSink();

  @Input() isAlbums?: boolean;
  @Input() authUserProfile: UserProfileRoI;
  @Input() currentUserProfile: UserProfileRoI;
  @Input() isEdit: boolean;

  @Output() onEditHandler: EventEmitter<boolean> = new EventEmitter();

  pending: boolean;
  profileForm: FormGroup;

  editIcon: SpriteIconEnum = SpriteIconEnum.edit;
  logOutIcon: SpriteIconEnum = SpriteIconEnum.off;
  albumIcon: SpriteIconEnum = SpriteIconEnum.album;
  homeIcon: SpriteIconEnum = SpriteIconEnum.home;

  constructor(private readonly _authService: AuthService) {}

  ngOnInit(): void {
    this.profileForm = new FormGroup({
      first_name: new FormControl(this.authUserProfile.first_name, [
        Validators.required,
        Validators.maxLength(20),
      ]),
      last_name: new FormControl(this.authUserProfile.last_name, [
        Validators.maxLength(20),
      ]),
      description: new FormControl(this.authUserProfile.description, [
        Validators.maxLength(300),
      ]),
      avatar: new FormControl(null),
      cover: new FormControl(null),
    });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  editHandler(isEdit: boolean) {
    this.onEditHandler.emit(isEdit);
  }

  logOut(): void {
    this._authService.logout();
  }

  get isAuth(): boolean {
    return this.currentUserProfile.id === this.authUserProfile.id;
  }

  get user(): UserProfileRoI {
    if (this.authUserProfile.id === this.currentUserProfile.id) {
      return this.authUserProfile;
    }

    return this.currentUserProfile;
  }

  updateProfileHandler() {
    const data = toFormData<UserProfileCredentialsI>(this.profileForm.value);
    this.pending = true;
    this.subs.sink = this._authService.updateMeProfile(data).subscribe(
      (profile: UserProfileRoI) => {
        this.authUserProfile = profile;
        this.profileForm.patchValue({
          first_name: profile.first_name,
          last_name: profile.last_name,
          description: profile.description,
        });
      },
      (error) => {
        // TODO: error handling
        console.log(error);
        this.pending = false;
      },
      () => {
        this.pending = false;
        this.onEditHandler.emit(false);
      }
    );
  }
}
