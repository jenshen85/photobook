import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { SubSink } from 'subsink';
import { TranslocoService } from '@ngneat/transloco';
import { AuthService } from '../auth/auth.service';
import { WebsocketService } from '../websocket';
import { WS } from '@photobook/data';
// import { WS } from '../shared/utils/api';
// import { Observable } from 'rxjs';

export interface IMessage {
  id: number;
  text: string;
}

@Component({
  selector: 'photobook-photo-book',
  templateUrl: './photobook.component.html',
  styleUrls: ['./photobook.component.scss'],
  host: { class: 'photobook-photo-book' },
  encapsulation: ViewEncapsulation.None,
})
export class PhotobookComponent implements OnInit {
  subs = new SubSink();

  // private messages$: Observable<IMessage[]>;

  constructor(
    private readonly _authService: AuthService,
    private readonly _transService: TranslocoService,
    private readonly _wsService: WebsocketService
  ) {}

  ngOnInit(): void {
    this.subs.sink = this._authService.getMeProfile().subscribe(
      (me) => {
        this._transService.setActiveLang(me.language_code);
      },
      (error) => {
        // TODO: error handling
        console.log(error);
      }
    );

    this.subs.sink = this._wsService
      .on<IMessage[]>(WS.ON.test)
      .subscribe((messages: IMessage[]): void => {
        console.log(messages);
      });

    this._wsService.status.subscribe((status) => {
      if (status) {
        this._wsService.send('ws/api/test', 'test');
      }
    });

    this.subs.sink = this._wsService
      .on<IMessage[]>('createPhotos')
      .subscribe((messages: IMessage[]): void => {
        console.log(messages);
      });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
