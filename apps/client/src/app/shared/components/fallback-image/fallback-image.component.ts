import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'photobook-fallback-image',
  templateUrl: './fallback-image.component.html',
  styleUrls: ['./fallback-image.component.scss'],
  host: { class: 'photobook-fallback-image' },
})
export class FallbackImageComponent implements OnInit {
  ngOnInit(): void {}
}
