import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SpriteIconEnum } from '@photobook/data';
// import { AuthCredentialsDto } from '@photobook/dto';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'photobook-restore',
  templateUrl: './restore.component.html',
  styleUrls: ['./restore.component.scss'],
  host: {'class': 'photobook-restore'}
})
export class RestoreComponent implements OnInit {
  form: FormGroup;
  envelopeIcon: SpriteIconEnum = SpriteIconEnum.envelope;
  constructor( private readonly _authService: AuthService) {}
  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
    });
  }


  submit($event: Event) {
    // if(this.form.valid) {
    //   const data: AuthCredentialsDto = this.form.value;
    //   this._authService.restore(data).subscribe((userdata) => console.log(userdata));
    // } else {
    //   this.form.markAsTouched();
    // }
  }
}
