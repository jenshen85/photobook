import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'photobook-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  @Input() userBg: string;
  ngOnInit(): void {}
}
