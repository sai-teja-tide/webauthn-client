import {Component, inject} from '@angular/core';
import {MatInputModule} from "@angular/material/input";
import {MatFormFieldModule} from "@angular/material/form-field";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {WebauthnService} from "../../../services/webauthn.service";
import {from, switchMap, map} from "rxjs";
import {decode} from "../../../helpers/base64url.helpers";
import {userId} from "../../../models/app.interface";
import {publicKeyCredentialToJSON} from "../../../helpers/app.helpers";

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [MatInputModule, MatFormFieldModule, ReactiveFormsModule, MatButtonModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss'
})
export class RegistrationComponent {
  codeFormControl = new FormControl();
  webauthnService = inject(WebauthnService);

  public submit(): void {

    const {code, userId} = this.getCode(this.codeFormControl.value)

    this.webauthnService.recovery(code, userId).pipe(
      switchMap((pk) =>
        from(navigator.credentials.create({
          publicKey: {
            challenge: decode(pk.challenge),
            user: {
              id: decode(userId),
              displayName: "suggula.teja+oaflutter@tide.co",
              name: userId
            },
            rp: { id: "localhost", name: "Tide" },
            pubKeyCredParams: [{ type: "public-key", alg: -7 }]
          } as PublicKeyCredentialCreationOptions
        })),
      )).subscribe(val => {
      console.log(val);
      console.log("-----------------------");
      console.log(publicKeyCredentialToJSON(val));
    })

  }

  public getCode(url: string): {code: string, userId: string} {
    const urlSearchParams = new URLSearchParams(url);

    return {
     code: urlSearchParams.get("deep_link_sub1") || '',
      userId: urlSearchParams.get("deep_link_sub2") || ''
    }
  }
}
