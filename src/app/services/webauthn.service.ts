import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {IRecoveryData, IRecoveryResponse} from "../models/app.interface";

@Injectable({
  providedIn: 'root'
})
export class WebauthnService {

  private readonly API_V4_BASE_URL = 'https://api.wip-tideplatform.uk/api/v4/user-management/webauthn';
  private readonly httpClient = inject(HttpClient);

  public getRecoveryChallenge(recoveryCode: string, userId: string): Observable<IRecoveryData> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/vnd.tide.iam.webauthn-recovery+json;version=1',
      Accept: 'application/vnd.tide.iam.webauthn-recovery+json;version=1'
    });

    return this.httpClient.post<IRecoveryResponse>(`${this.API_V4_BASE_URL}/recovery`, {
      data: {
        code: recoveryCode,
        userId
      }
    }, { headers }).pipe(map(response => response.data));
  }

  public registerCredential(
    credentialId: string,
    clientDataJSON: string,
    attestationObject: string
  ): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/vnd.tide.iam.webauthn-register-credentials+json;version=1',
      Accept: 'application/vnd.tide.iam.webauthn-register-credentials+json;version=1'
    });

    return this.httpClient.post(`${this.API_V4_BASE_URL}/credential`, {
      data: {
        credentialId,
        clientDataJSON,
        attestationObject
      }
    }, { headers });
  }
}
