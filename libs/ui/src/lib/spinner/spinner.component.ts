import { Component, Input, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';

@Component({
  selector: 'photobook-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
  host: { class: 'photobook-spinner' },
})
export class SpinnerComponent implements OnInit {
  @Input() position: string = 'fixed';
  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'indeterminate';

  ngOnInit(): void {}
}
