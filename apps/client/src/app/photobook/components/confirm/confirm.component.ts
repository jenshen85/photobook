import { Component, Inject, OnInit } from '@angular/core';
import { SpriteIconEnum } from '@photobook/data';
import { DialogRef, DIALOG_DATA } from '@photobook/ui';

export interface confirmComponentInDataType {
  title: string;
  message: string;
}

@Component({
  selector: 'photobook-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss'],
})
export class ConfirmComponent implements OnInit {
  removeIcon = SpriteIconEnum.delete;
  title: string;
  message: string;

  constructor(
    private readonly dialogRef: DialogRef<ConfirmComponent>,
    @Inject(DIALOG_DATA) private data: confirmComponentInDataType
  ) {}

  ngOnInit(): void {
    this.title = this.data.title;
    this.message = this.data.message;
  }
}
