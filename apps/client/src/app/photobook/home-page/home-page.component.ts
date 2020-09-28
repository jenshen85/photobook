import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { PhotobookService } from '../photobook.service';

import { UserRoDto } from '@photobook/dto';

@Component({
  selector: 'photobook-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit {
  userSubscription$: Subscription;
  user: UserRoDto;
  loadUser: boolean;

  constructor(private readonly _photoService: PhotobookService) {}

  ngOnInit(): void {
    this.loadUser = false;
    this.userSubscription$ = this._photoService.getUser(1).subscribe(
      (user) => {
        this.user = user;
        this.loadUser = true
      },
      (error) => {
        console.log(error);
      }
    );
  }

  ngOnDestroy(): void {
    this.userSubscription$.unsubscribe();
  }
}
