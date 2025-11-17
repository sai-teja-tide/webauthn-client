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
  preformatMakeCredentialRequest,
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

  constructor(
    private readonly appService: AppService,
    private readonly router: Router
  ) {}

  public registerClicked(): void {
    const { userName, name } = this.registerFormGroup.value;

    if (userName && name) {
      this.appService
        .register({ name, username: userName })
        .pipe(
          map((response) => preformatMakeCredentialRequest(response)),
          switchMap((publicKey) =>
            from(navigator.credentials.create({ publicKey }))
          ),
          filter((credential) => !!credential),
          map((credential) => publicKeyCredentialToJSON(credential)),
          switchMap((credentialJson) => this.appService.sendWebAuthnResponse(credentialJson))
        )
        .subscribe({
          next: () => this.router.navigate(['/success']),
          error: (error) => {
            return error;
          },
        });
    } else {
      console.log('Please enter valid details');
    }
  }
}
