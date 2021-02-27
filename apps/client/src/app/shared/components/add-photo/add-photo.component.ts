import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'div[photobook-add-photo]',
  templateUrl: './add-photo.component.html',
  styleUrls: ['./add-photo.component.scss'],
  host: { class: 'common-dialog photobook-add-photo' }
})
export class AddPhotoComponent implements OnInit {
  form: FormGroup;
  @Output() close = new EventEmitter<any>();
  constructor() { }

  ngOnInit(): void {
  }

  submitHandler() {

  }
}
