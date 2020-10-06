import { Component, OnInit } from '@angular/core';
// import { transition, trigger, useAnimation } from '@angular/animations';
// import { fadeIn, fadeOut } from 'ng-animate';

@Component({
  selector: 'photobook-photo-book',
  templateUrl: './photobook.component.html',
  styleUrls: ['./photobook.component.scss'],
  host: { class: 'photobook-photo-book' },
  // animations: [
  //   trigger('fade', [
  //     transition(
  //       'void => *',
  //       useAnimation(fadeIn, { params: { timing: 0.3 } })
  //     ),
  //     transition(
  //       '* => void',
  //       useAnimation(fadeOut, { params: { timing: 0.3 } })
  //     ),
  //   ]),
  // ],
})
export class PhotobookComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
