import { Component, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'photobook-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  // encapsulation: ViewEncapsulation.None,
  host: { class: 'photobook-root' },
})
export class AppComponent {
  constructor(private http: HttpClient) {}
}
