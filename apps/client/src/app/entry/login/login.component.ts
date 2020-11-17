import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthCredentialsI } from '@photobook/data';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'photobook-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  host: { class: 'photobook-login' },
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  pendingLogin: boolean;

  constructor(private readonly _authService: AuthService) {}
  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(8),
      ]),
    });
  }

  submit($event: Event) {
    if (this.form.valid) {
      this.pendingLogin = true;
      const data: AuthCredentialsI = this.form.value;
      this._authService.login(data).subscribe(
        (userdata) => {
          this.pendingLogin = false;
        },
        (error) => {
          // TODO: error handling
        }
      );
    } else {
      this.form.markAsTouched();
    }
  }
}
