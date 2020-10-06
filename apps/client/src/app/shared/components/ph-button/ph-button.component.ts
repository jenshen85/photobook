import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'button[photobook-ph-button], a[photobook-ph-button]',
  templateUrl: './ph-button.component.html',
  styleUrls: ['./ph-button.component.scss'],
  host: {
    class: 'photobook-btn',
  },
})
export class PhButton implements OnInit {
  @Input() icon: string;
  @Input() iconOnly: boolean = false;
  ngOnInit(): void {}
}
