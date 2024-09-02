import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IRegisterPayload } from '../models/app.interface';
import { catchError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  constructor(private _httpClientService: HttpClient) {}

  public register(registerPayload: IRegisterPayload): Observable<any> {
    return this._httpClientService
      .post('http://localhost:3000/webauthn/register', registerPayload, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      })
      .pipe(
        catchError((err) => {
          console.log(err);
          return err;
        })
      );
  }

  public sendWebAuthnResponse(payload: any) {
    return this._httpClientService
      .post('http://localhost:3000/webauthn/response', payload, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      })
      .pipe(
        catchError((err) => {
          console.log(err);
          return err;
        })
      );
  }

  public logout(): Observable<any> {
    return this._httpClientService
      .get('http://localhost:3000/logout', {
        withCredentials: true,
      })
      .pipe(
        catchError((err) => {
          console.log(err);
          return err;
        })
      );
  }
}
