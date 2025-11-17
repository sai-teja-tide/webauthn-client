import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IRegisterPayload } from '../models/app.interface';
import { catchError, Observable } from 'rxjs';
import { SnackbarService } from './snackbar.service';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  constructor(
    private readonly httpClient: HttpClient,
    private readonly snackbarService: SnackbarService
  ) {}

  public register(registerPayload: IRegisterPayload): Observable<any> {
    return this.httpClient
      .post('http://localhost:3000/webauthn/register', registerPayload, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      })
      .pipe(
        catchError((error) => {
          this.snackbarService.showSnackBarMessage(error.error.message);
          return error;
        })
      );
  }

  public sendWebAuthnResponse(webAuthnPayload: any): Observable<any> {
    return this.httpClient
      .post('http://localhost:3000/webauthn/response', webAuthnPayload, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      })
      .pipe(
        catchError((error) => {
          this.snackbarService.showSnackBarMessage(error.error.message);
          return error;
        })
      );
  }

  public login(username: string): Observable<any> {
    return this.httpClient
      .post(
        'http://localhost:3000/webauthn/login',
        { username },
        {
          withCredentials: true,
        }
      )
      .pipe(
        catchError((error) => {
          this.snackbarService.showSnackBarMessage(error.error.message);
          return error;
        })
      );
  }

  public logout(): Observable<any> {
    return this.httpClient
      .get('http://localhost:3000/logout', {
        withCredentials: true,
      })
      .pipe(
        catchError((error) => {
          this.snackbarService.showSnackBarMessage(error.error.message);
          return error;
        })
      );
  }
}
