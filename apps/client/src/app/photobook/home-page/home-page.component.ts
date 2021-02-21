import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SubSink } from 'subsink';

import {
  UserRoI,
  SpriteIconEnum,
  UserProfileCredentialsI,
} from '@photobook/data';
import { PhotobookService } from '../photobook.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { fadeAnimations } from '../../shared/utils/animations';

@Component({
  selector: 'photobook-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  animations: [ fadeAnimations.fadeIn() ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePageComponent implements OnInit {
  isAuthUser: boolean;
  subs = new SubSink();
  userSubj: Subject<UserRoI> = new Subject();
  $user: Observable<UserRoI> = this.userSubj.asObservable();
  authUser: UserRoI;
  user: UserRoI;
  profile: UserProfileCredentialsI;
  addIcon: SpriteIconEnum = SpriteIconEnum.add;
  isAlbums: boolean;

  isEdit = false;
  pendingLoadUser: boolean = true;

  constructor(
    private readonly _photoService: PhotobookService,
    private readonly _router: Router,
    private readonly _route: ActivatedRoute,
    private readonly _changeDetectionRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.subs.add(

      this.$user.subscribe((user: UserRoI): void => {
        this.user = user;
        this.profile = user.user_profile;
        this.isAuthUser = this.user.id === this.authUser.id;
        this._changeDetectionRef.markForCheck();
      }),

      this._photoService.getAuthUser().subscribe((authUser) => {
        this.authUser = authUser;
        this.getUser();
      }),

      this._getRouteParamsMap().subscribe((params) => {
        const userId = params.get('id');
        this.isAlbums = userId ? true : false;
      }),

      this._router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.getUser();
        }
      })
    )
  }

  getUser(): void {
    this.pendingLoadUser = true;
    this.subs.sink = this._getRouteParamsMap().subscribe(
      params => {
        const userId = params.get('id');
        this.isAlbums = userId ? true : false;

        if(userId && this.authUser && +userId !== this.authUser.id) {
          this.subs.sink = this._photoService.getUser(+userId).subscribe(
            (user) => this.userSubj.next(user),
            (error) => {
              // TODO: error handling
              console.log(error);
            },
            () => this.pendingLoadUser = false
          );
        } else {
          this.userSubj.next(this.authUser);
          this.pendingLoadUser = false;
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
