import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AppService } from '../../services/app.service';
import {
  preformatMakeCredReq,
  publicKeyCredentialToJSON,
} from '../../helpers/app.helpers';
import { catchError, filter, from, map, switchMap } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatButtonModule,
    MatInputModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  public registerFormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    userName: new FormControl('', [Validators.required]),
  });

  constructor(private _appService: AppService, private _router: Router) {}

  public registerClicked() {
    const { userName, name } = this.registerFormGroup.value;

    if (userName && name) {
      this._appService
        .register({ name, username: userName })
        .pipe(
          map((val) => preformatMakeCredReq(val)),
          switchMap((publicKey) =>
            from(navigator.credentials.create({ publicKey }))
          ),
          filter((val) => !!val),
          map((val) => publicKeyCredentialToJSON(val)),
          switchMap((val) => this._appService.sendWebAuthnResponse(val))
        )
        .subscribe({
          next: () => this._router.navigate(['/success']),
          error: (error) => {
            return error;
          },
        });
    } else {
      console.log('Please enter valid details');
    }
  }
}
