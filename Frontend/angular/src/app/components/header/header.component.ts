import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/authService/auth.service';
import { Route } from '@angular/router';
import { Router } from '@angular/router';
@Component({
  selector: 'app-header',
  imports: [RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  authservice = inject(AuthService);
  router = inject(Router);
  isLoggedIn: boolean = false;
  isAdminBoolean: boolean = false;

  constructor() {
    //saber si usr esta logeado o no
    if (localStorage.getItem('authToken')) {
      this.isLoggedIn = true;
      //para saber si es admin o no
      this.authservice
        .isAdmin(localStorage.getItem('authToken') || '')
        .subscribe((res: any) => {
          if (res.user.isAdmin == 1) {
            this.isAdminBoolean = true;
          }
        });
    }
  }

  ngOnInit() {}

  logout() {
    this.authservice
      .logout(localStorage.getItem('authToken') || '')
      .subscribe((res: any) => {
        localStorage.removeItem('authToken');
        this.router.navigateByUrl('/login');
      });
  }
}
