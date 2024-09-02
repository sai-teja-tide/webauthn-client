import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { AppService } from '../../services/app.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-success',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './success.component.html',
  styleUrl: './success.component.scss',
})
export class SuccessComponent {
  constructor(private _appService: AppService, private _router: Router) {}
  public logoutClicked(): void {
    this._appService.logout().subscribe(() => {
      this._router.navigate(['/login']);
    });
  }
}
