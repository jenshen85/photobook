import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthCredentialsDto } from '@photobook/dto';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'photobook-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  host: {'class': 'photobook-login'}
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  constructor( private readonly _authService: AuthService) {}
  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(8)]),
    });
  }


  submit($event: Event) {
    if(this.form.valid) {
      const data: AuthCredentialsDto = this.form.value;
      this._authService.login(data).subscribe((userdata) => console.log(userdata));
    } else {
      this.form.markAsTouched();
    }
  }
}
