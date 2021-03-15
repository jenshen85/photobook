import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SpriteIconEnum } from '@photobook/data';
import { UserProfileCredentialsDto } from '@photobook/dto';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'photobook-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent implements OnInit {
  form: FormGroup;
  pending: boolean;
  userIcon: SpriteIconEnum = SpriteIconEnum.user;

  constructor(private readonly _authService: AuthService) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      first_name: new FormControl(null, [Validators.required]),
      last_name: new FormControl(null, [Validators.required]),
      description: new FormControl(null),
    });
  }

  submit($event) {
    if (this.form.valid) {
      this.pending = true;
      const data: UserProfileCredentialsDto = this.form.value;
      this._authService.createUserProfile(data).subscribe(
        (userdata) => {},
        (error) => {
          /* TODO: error handling */
        },
        () => (this.pending = false)
      );
    } else {
      this.form.markAsTouched();
    }
  }
}
