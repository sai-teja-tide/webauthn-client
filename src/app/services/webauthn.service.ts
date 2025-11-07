import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {IRecoveryData, IRecoveryResponse} from "../models/app.interface";

@Injectable({
  providedIn: 'root'
})
export class WebauthnService {

  private API_V4_URL = 'https://api.wip-tideplatform.uk/api/v4/user-management/webauthn'
  private httpClient = inject(HttpClient);

  public recovery(code: string, userId: string): Observable<IRecoveryData> {

    let headers = new HttpHeaders({
      'Content-Type': 'application/vnd.tide.iam.webauthn-recovery+json;version=1',
      Accept: 'application/vnd.tide.iam.webauthn-recovery+json;version=1'
    });

    return this.httpClient.post<IRecoveryResponse>(`${this.API_V4_URL}/recovery`, {
      data: {
        code,
        userId
      }
    }, {headers}).pipe(map(res => res.data));
  }
}
