import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { UserCredentialsI } from '@photobook/data';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'photobook-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  host: {'class': 'photobook-register'}
})
export class RegisterComponent implements OnInit {
  form: FormGroup;
  constructor( private readonly _authService: AuthService) {}
  ngOnInit(): void {
    this.form = new FormGroup({
      username: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(8)]),
    });
  }

  submit($event: Event) {
    if(this.form.valid) {
      const data: UserCredentialsI = this.form.value;
      this._authService.register(data).subscribe(
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
