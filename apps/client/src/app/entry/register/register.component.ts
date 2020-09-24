import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { EntryService } from '../entry.service'
import { UserCredentialsDto } from '@photobook/dto';

@Component({
  selector: 'photobook-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  host: {'class': 'photobook-register'}
})
export class RegisterComponent implements OnInit {
  form: FormGroup;
  constructor( private readonly entryService: EntryService) {}
  ngOnInit(): void {
    this.form = new FormGroup({
      username: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(8)]),
    });
  }

  submit($event: Event) {
    if(this.form.valid) {
      const data: UserCredentialsDto = this.form.value;
      this.entryService.signup(data).subscribe((userdata) => console.log(userdata));
    } else {
      this.form.markAsTouched();
    }
  }
}
