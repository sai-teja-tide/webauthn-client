import { Routes } from '@angular/router';

export const routes: Routes = [
  // {
  //   path: 'login',
  //   loadComponent: () =>
  //     import('./components/login/login.component').then(
  //       (m) => m.LoginComponent
  //     ),
  // },
  // {
  //   path: 'register',
  //   loadComponent: () =>
  //     import('./components/register/register.component').then(
  //       (m) => m.RegisterComponent
  //     ),
  // },
  // {
  //   path: 'success',
  //   loadComponent: () =>
  //     import('./components/success/success.component').then(
  //       (m) => m.SuccessComponent
  //     ),
  // },
  {
    path: 'webauthn',
    children: [
      {
        path: 'register',
        loadComponent: () =>
          import('./components/webauthn/registration/registration.component').then((m) => m.RegistrationComponent),
      }]
  },
  {
    path: '**',
    redirectTo: 'webauthn/register',
  },
];
