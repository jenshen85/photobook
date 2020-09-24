import { Component, OnInit } from '@angular/core';
import { transition, trigger, useAnimation } from '@angular/animations';
import { fadeIn, fadeOut } from 'ng-animate';

@Component({
  selector: 'photobook-fade',
  templateUrl: './fade.component.html',
  styleUrls: ['./fade.component.scss'],
  animations: [
    trigger('fade', [
      transition(
        'void => *',
        useAnimation(fadeIn, {
          params: {
            timing: 0.3,
          },
        })
      ),
      transition(
        '* => void',
        useAnimation(fadeOut, {
          params: {
            timing: 0.3,
          },
        })
      ),
    ]),
  ],
})
export class FadeComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
