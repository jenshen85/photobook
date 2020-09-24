import { Component, Input, OnInit } from '@angular/core';
import {
  ControlContainer,
  FormGroupDirective,
} from '@angular/forms';

@Component({
  selector: 'photobook-control',
  templateUrl: './app-control.component.html',
  styleUrls: ['./app-control.component.scss'],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective,
    },
  ],
  host: {'class': 'photobook-control'}
})
export class AppControlComponent implements OnInit {
  @Input() className: string;
  @Input() inputName: string;
  @Input() type = 'text';
  @Input() placeholder = '';
  @Input() icon: string;
  @Input() label: string;
  ngOnInit(): void {}
}
