import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { SpriteIconEnum, UserCredentialsI } from '@photobook/data';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'photobook-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  host: {'class': 'photobook-register'}
})
export class RegisterComponent implements OnInit {
  form: FormGroup;
  registerSubs: Subscription;
  userIcon: SpriteIconEnum = SpriteIconEnum.user;
  envelopeIcon: SpriteIconEnum = SpriteIconEnum.envelope;
  passwordIcon: SpriteIconEnum = SpriteIconEnum.password;

  constructor( private readonly _authService: AuthService) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      username: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(8)]),
    });
  }

  ngOnDestroy() {
    this.registerSubs && this.registerSubs.unsubscribe();
  }

  submit($event: Event) {
    if(this.form.valid) {
      const data: UserCredentialsI = this.form.value;
      this.registerSubs = this._authService.register(data).subscribe(
        (userdata) => console.log(userdata),
        (error) => {
          // TODO: error handling
        },
      );
    } else {
      this.form.markAsTouched();
    }
  }
}
