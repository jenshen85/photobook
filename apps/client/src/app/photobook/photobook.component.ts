import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { SubSink } from 'subsink';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'photobook-photo-book',
  templateUrl: './photobook.component.html',
  styleUrls: ['./photobook.component.scss'],
  host: { class: 'photobook-photo-book' },
  encapsulation: ViewEncapsulation.None
})
export class PhotobookComponent implements OnInit {
  subs = new SubSink();
  pending = false;

  constructor(
    private readonly _authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.subs.sink = this._authService.authUserProfile().subscribe((authUserProfile) => {
      if(!authUserProfile) {
        this.getMe();
      }
    });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  getMe(): void {
    this.pending = true;
    this.subs.sink = this._authService.getMeProfile().subscribe(
      console.log,
      (error) => {
        // TODO: error handling
        console.log(error);
      },
      () => this.pending = false
    );
  }
}
