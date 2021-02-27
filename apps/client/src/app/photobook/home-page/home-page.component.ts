import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SubSink } from 'subsink';

import {
  SpriteIconEnum,
  UserProfileRoI
} from '@photobook/data';
import { ActivatedRoute } from '@angular/router';
import { fadeAnimations } from '../../shared/utils/animations';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'photobook-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  animations: [ fadeAnimations.fadeIn() ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePageComponent implements OnInit {
  isAuthUser: boolean = true;
  isAlbums: boolean;
  subs = new SubSink();
  authUserProfile: UserProfileRoI;
  currentUserProfile: UserProfileRoI;
  addIcon: SpriteIconEnum = SpriteIconEnum.add;

  isEdit = false;
  pending: boolean = true;

  constructor(
    private readonly _authService: AuthService,
    private readonly _route: ActivatedRoute,
    private readonly _changeDetectionRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.subs.add(
      this._authService.authUserProfile().subscribe((authUserProfile) => {
        if(authUserProfile) {
          this.authUserProfile = authUserProfile;
          this.getUserProfile();
        }
      }),

      this._authService.currentUserProfile().subscribe((currentUserProfile): void => {
        if(currentUserProfile) {
          this.currentUserProfile = currentUserProfile;
          this.isAuthUser = currentUserProfile.id === this.authUserProfile.id;
          this.pending = false;
          this._changeDetectionRef.markForCheck();
        }
      })
    )
  }

  getUserProfile(): void {
    this.pending = true;
    this.subs.sink = this._getRouteParamsMap().subscribe(
      params => {
        const userProfileId = params.get('user_profile_id');

        if(userProfileId && +userProfileId !== this.authUserProfile.id) {
          this.subs.sink = this._authService.getUserProfile(+userProfileId).subscribe(
            (profile) => this._authService.setCurrentUserProfile(profile),
            (error) => {
              // TODO: error handling
              console.log(error);
            }
          );
        } else {
          this._authService.setCurrentUserProfile(this.authUserProfile);
        }
      }
    )
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  editHandler(isEdit: boolean) {
    this.isEdit = isEdit;
  }

  private _getRouteParamsMap() {
    if(this._route.firstChild) {
      return this._route.firstChild.paramMap;
    }

    return this._route.paramMap;
  }
}
