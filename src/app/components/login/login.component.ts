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
  preformatGetAssertionRequest,
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
  usernameFormControl = new FormControl('', [Validators.required]);

  constructor(
    private readonly router: Router,
    private readonly appService: AppService
  ) {}

  public loginClicked(): void {
    const username = this.usernameFormControl.value;

    if (username) {
      this.appService
        .login(username)
        .pipe(
          map((response) => preformatGetAssertionRequest(response)),
          switchMap((publicKey) =>
            from(navigator.credentials.get({ publicKey }))
          ),
          map((credential) => publicKeyCredentialToJSON(credential)),
          switchMap((credentialJson) => this.appService.sendWebAuthnResponse(credentialJson))
        )
        .subscribe({
          next: () => this.router.navigate(['/success']),
          error: (error) => {
            return error;
          },
        });
    }
  }
}
