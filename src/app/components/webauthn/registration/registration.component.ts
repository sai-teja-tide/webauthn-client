import {Component, inject} from '@angular/core';
import {MatInputModule} from "@angular/material/input";
import {MatFormFieldModule} from "@angular/material/form-field";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {WebauthnService} from "../../../services/webauthn.service";
import {from, switchMap} from "rxjs";
import {decode} from "../../../helpers/base64url.helpers";
import {publicKeyCredentialToJSON} from "../../../helpers/app.helpers";
import {IRecoveryData} from "../../../models/app.interface";

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [MatInputModule, MatFormFieldModule, ReactiveFormsModule, MatButtonModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss'
})
export class RegistrationComponent {
  recoveryCodeFormControl = new FormControl();
  private readonly webauthnService = inject(WebauthnService);

  public submit(): void {
    const { code: recoveryCode, userId } = this.extractRecoveryParameters(this.recoveryCodeFormControl.value);

    let recoveryData: IRecoveryData | null = null;

    this.webauthnService.getRecoveryChallenge(recoveryCode, userId).pipe(
      switchMap((recoveryResponse) => {
        recoveryData = recoveryResponse;
        return from(navigator.credentials.create({
          publicKey: {
            challenge: decode(recoveryResponse.challenge),
            user: {
              id: decode(userId),
              displayName: "suggula.teja+oaflutter@tide.co",
              name: userId
            },
            rp: { id: "localhost", name: "Tide" },
            pubKeyCredParams: [{ type: "public-key", alg: -7 }]
          } as PublicKeyCredentialCreationOptions
        }));
      })
    ).subscribe(credential => {
      const credentialJson = publicKeyCredentialToJSON(credential);

      if (credentialJson && credentialJson.id && credentialJson.response && recoveryData) {
        this.webauthnService.registerCredential(
          recoveryData.credentialId,
          credentialJson.response.clientDataJSON,
          credentialJson.response.attestationObject
        ).subscribe(registrationResponse => {
          console.log(registrationResponse);
        });
      }
    });
  }

  public extractRecoveryParameters(urlString: string): { code: string; userId: string } {
    const urlSearchParams = new URLSearchParams(urlString);

    return {
      code: urlSearchParams.get("deep_link_sub1") || '',
      userId: urlSearchParams.get("deep_link_sub2") || ''
    };
  }
}
