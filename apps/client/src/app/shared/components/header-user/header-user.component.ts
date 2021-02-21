import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SpriteIconEnum, UserProfileCredentialsI, UserProfileRoI, UserRoI } from '@photobook/data';
import { SubSink } from 'subsink';
import { AuthService } from '../../../auth/auth.service';
import { PhotobookService } from '../../../photobook/photobook.service';
import { fadeAnimations } from '../../utils/animations';
import { toFormData } from '../../utils/utils';

@Component({
  selector: 'header[photobook-header-user]',
  templateUrl: './header-user.component.html',
  styleUrls: ['./header-user.component.scss'],
  host: {
    class: 'photobook-header-user',
    '[class]': 'isEdit ? "user-edit" : ""',
    '[style.backgroundImage]': 'user.user_profile.cover ? "url(" + user.user_profile.cover + ")" : "url(assets/images/welcom-bg.png)"'
  },
  animations: [ fadeAnimations.fadeIn() ],
})
export class HeaderUserComponent implements OnInit {
  subs = new SubSink();

  @Input() isAuthUser?: boolean;
  @Input() isAlbums?: boolean;
  @Input() user: UserRoI;
  @Input() isEdit: boolean;

  @Output() onEditHandler: EventEmitter<boolean> = new EventEmitter();

  savePending: boolean;
  profile: UserProfileRoI;
  profileForm: FormGroup;

  editIcon: SpriteIconEnum = SpriteIconEnum.edit;
  logOutIcon: SpriteIconEnum = SpriteIconEnum.off;
  albumIcon: SpriteIconEnum = SpriteIconEnum.album;
  homeIcon: SpriteIconEnum = SpriteIconEnum.home;

  constructor(
    private readonly _photoService: PhotobookService,
    private readonly _authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.profile = this.user.user_profile;
    this.profileForm = new FormGroup({
      first_name: new FormControl(this.profile.first_name, [
        Validators.required,
        Validators.maxLength(20),
      ]),
      last_name: new FormControl(this.profile.last_name, [
        Validators.maxLength(20),
      ]),
      description: new FormControl(this.profile.description, [
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

  updateProfileHandler() {
    const data = toFormData<UserProfileCredentialsI>(this.profileForm.value);
    this.savePending = true;
    this.subs.sink = this._photoService.updateProfile(data).subscribe(
      (profile: UserProfileRoI) => {
        this.profile = profile;
        this.profileForm.patchValue({
          first_name: profile.first_name,
          last_name: profile.last_name,
          description: profile.description,
        });
      },
      (error) => {
        // TODO: error handling
        console.log(error)
      },
      () => {
        this.savePending = false;
        this.onEditHandler.emit(false);
      }
    );
  }
}
