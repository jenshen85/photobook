import { transition, trigger, useAnimation } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SpriteIconEnum, UserProfileCredentialsI, UserProfileRoI, UserRoI } from '@photobook/data';
import { fadeIn } from 'ng-animate';
import { SubSink } from 'subsink';
import { AuthService } from '../../../auth/auth.service';
import { PhotobookService } from '../../../photobook/photobook.service';
import { toFormData } from '../../utils/utils';

@Component({
  selector: 'photobook-header-user',
  templateUrl: './header-user.component.html',
  styleUrls: ['./header-user.component.scss'],
  host: { class: 'photobook-header-user'},
  animations: [
    trigger('fade', [
      transition(
        'void => *',
        useAnimation(fadeIn, { params: { timing: 0.3 } })
      ),
    ]),
  ],
})
export class HeaderUserComponent implements OnInit {
  subs = new SubSink();

  @Input() isAuthUser?: boolean;
  @Input() user: UserRoI;
  @Input() profile: UserProfileRoI;
  profileForm: FormGroup;
  isEdit: boolean;
  savePending: boolean;

  @Output() onEditHandler: EventEmitter<boolean> = new EventEmitter()

  editIcon: SpriteIconEnum = SpriteIconEnum.edit;
  logOutIcon: SpriteIconEnum = SpriteIconEnum.off;
  albumIcon: SpriteIconEnum = SpriteIconEnum.album;
  homeIcon: SpriteIconEnum = SpriteIconEnum.home;

  constructor(
    private readonly _photoService: PhotobookService,
    private readonly _authService: AuthService,
  ) {}

  ngOnInit(): void {
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

  editHandler(_: Event) {
    this.isEdit = !this.isEdit;
    this.onEditHandler.emit(this.isEdit);
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
        this.savePending = false;
        this.isEdit = false;
        this.onEditHandler.emit(this.isEdit);
      },
      (error) => {
        // TODO: error handling
        this.savePending = false;
        this.isEdit = false;
        this.onEditHandler.emit(this.isEdit);
      }
    );
  }
}
