import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthCredentialsDto } from '@photobook/dto';
import { EntryService } from '../entry.service';

@Component({
  selector: 'photobook-restore',
  templateUrl: './restore.component.html',
  styleUrls: ['./restore.component.scss'],
  host: {'class': 'photobook-restore'}
})
export class RestoreComponent implements OnInit {

  form: FormGroup;
  constructor( private readonly entryService: EntryService) {}
  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
    });
  }


  submit($event: Event) {
    if(this.form.valid) {
      const data: AuthCredentialsDto = this.form.value;
      this.entryService.signin(data).subscribe((userdata) => console.log(userdata));
    } else {
      this.form.markAsTouched();
    }
  }
}
