import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from '../../services/app.service';
import { MatButtonModule } from '@angular/material/button';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  preformatGetAssertReq,
  publicKeyCredentialToJSON,
} from '../../helpers/app.helpers';
import { catchError, from, map, switchMap } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatButtonModule,
    MatInputModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  usernameFromControl = new FormControl('', [Validators.required]);

  constructor(private _router: Router, private _appService: AppService) {}

  public loginClicked(): void {
    const username = this.usernameFromControl.value;

    if (username) {
      this._appService
        .login(username)
        .pipe(
          map((resp) => preformatGetAssertReq(resp)),
          switchMap((publicKey) =>
            from(navigator.credentials.get({ publicKey }))
          ),
          map((val) => publicKeyCredentialToJSON(val)),
          switchMap((val) => this._appService.sendWebAuthnResponse(val))
        )
        .subscribe({
          next: () => this._router.navigate(['/success']),
          error: (error) => {
            return error;
          },
        });
    }
  }
}
